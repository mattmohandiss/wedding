import React, { useState, useEffect } from 'react';
import { GuestData, FormStage } from '@data';
import { Toggle, StageIndicator, DropdownInput } from './RSVPComponents';

export interface RSVPSectionProps {
  isActive: boolean;
}

export const RSVPSection: React.FC<RSVPSectionProps> = ({ isActive }) => {
  // Form stage state
  const [formStage, setFormStage] = useState<FormStage>('nameSelection');

  // Guest data state
  const [guests, setGuests] = useState<GuestData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Name selection state
  const [nameInput, setNameInput] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<GuestData | null>(null);

  // Details submission state
  const [message, setMessage] = useState('');
  const [partyGuests, setPartyGuests] = useState<GuestData[]>([]);
  // Track RSVP state separately to avoid modifying original guest data until submission
  const [guestAttendance, setGuestAttendance] = useState<Record<string, {
    rehearsal: boolean,
    ceremony: boolean,
    reception: boolean,
    dietaryRestrictions: string
  }>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Helper to get a unique string ID for each guest (for use as keys or in records)
  const getGuestKey = (guest: GuestData): string => {
    return `guest-${guest.id.row}`;
  };

  // Fetch guest data when component becomes active
  useEffect(() => {
    if (isActive) {
      fetchGuests();
    }
  }, [isActive]);

  // Simplified API functions
  async function fetchGuests() {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/guests');

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();

      if (data && data.success && data.guests) {
        setGuests(data.guests);
      } else {
        throw new Error(data.message || 'Failed to load guest list');
      }
    } catch (error) {
      console.error('Error fetching guests:', error);
      setErrorMessage('Unable to load guest list. Please try typing your name manually.');
    } finally {
      setIsLoading(false);
    }
  }

  async function submitRSVP(guests: GuestData[], message: string) {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guests,
          message
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();

      if (data && data.success) {
        setIsSuccess(true);
        resetForm();
      } else {
        throw new Error(data.message || 'Failed to submit RSVP');
      }
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      setErrorMessage('Failed to submit RSVP. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle selecting a guest
  const handleSelectGuest = (guest: GuestData) => {
    setSelectedGuest(guest);
    setNameInput(guest.fullName);
  };

  // Handle proceeding to details stage
  const handleProceedToDetails = () => {
    if (nameInput.trim() === '') {
      setErrorMessage('Please enter your name');
      return;
    }

    // First check if there's an exact match in the guests list, regardless of whether
    // a guest has already been selected through the dropdown
    const exactMatch = guests.find(
      (guest) => guest.fullName.toLowerCase() === nameInput.trim().toLowerCase()
    );

    if (exactMatch) {
      // If we found an exact match, use that guest
      console.log('Found match for: ', exactMatch.fullName);
      setSelectedGuest(exactMatch);
    } else if (!selectedGuest) {
      // If no exact match found and no guest selected from dropdown
      setErrorMessage('Please select a name from the guest list');
      return;
    }

    // Set up party guests list for RSVP tracking
    const guestToUse = exactMatch || selectedGuest;
    
    if (guestToUse) {
      let partyGuestsList: GuestData[] = [];
      
      // If this guest has a party, find all party members
      if (guestToUse.party && guestToUse.party !== 'Unknown') {
        // Find all guests with the same party name
        partyGuestsList = guests.filter(
          (guest) => guest.party === guestToUse.party
        );
      } else {
        // If no party or unknown party, just add the selected guest
        partyGuestsList = [guestToUse];
      }
      
      // Set the party guests
      setPartyGuests(partyGuestsList);
      
      // Initialize attendance state for each guest in the party
      const initialAttendance: Record<string, {
        rehearsal: boolean,
        ceremony: boolean,
        reception: boolean,
        dietaryRestrictions: string
      }> = {};
      
      partyGuestsList.forEach(guest => {
        initialAttendance[getGuestKey(guest)] = {
          rehearsal: guest.rehearsalRsvp !== "N/A",  // Default to true if applicable
          ceremony: guest.ceremonyRsvp !== "N/A",    // Default to true if applicable
          reception: guest.receptionRsvp !== "N/A",  // Default to true if applicable
          dietaryRestrictions: guest.dietaryRestrictions || ''
        };
      });
      
      setGuestAttendance(initialAttendance);
    }

    setErrorMessage('');
    setFormStage('detailsSubmission');
  };

  // Handle going back to name selection
  const handleBackToNameSelection = () => {
    setFormStage('nameSelection');
    setSelectedGuest(null);
    setNameInput('');
    setPartyGuests([]);
    setGuestAttendance({});
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // At this point, selectedGuest should be set, but we'll check to be safe
    if (!selectedGuest || partyGuests.length === 0) {
      setErrorMessage('Please enter your name');
      return;
    }

    // Map back the attendance states to GuestData objects for submission
    const updatedGuests = partyGuests.map(guest => {
      const guestKey = getGuestKey(guest);
      const attendance = guestAttendance[guestKey];
      
      // Create updated guest with attendance states
      return {
        ...guest,
        rehearsalRsvp: guest.rehearsalRsvp === "N/A" ? "N/A" : (attendance?.rehearsal ? "Yes" : "No"),
        ceremonyRsvp: guest.ceremonyRsvp === "N/A" ? "N/A" : (attendance?.ceremony ? "Yes" : "No"),
        receptionRsvp: guest.receptionRsvp === "N/A" ? "N/A" : (attendance?.reception ? "Yes" : "No"),
        dietaryRestrictions: attendance?.dietaryRestrictions || ''
      };
    });

    // Send the updated guests and message
    await submitRSVP(updatedGuests, message.trim());
  };

  // Handlers for toggle updates
  const handleRehearsalToggle = (guest: GuestData, newValue: boolean) => {
    const guestKey = getGuestKey(guest);
    setGuestAttendance(prev => ({
      ...prev,
      [guestKey]: {
        ...prev[guestKey],
        rehearsal: newValue
      }
    }));
  };

  const handleCeremonyToggle = (guest: GuestData, newValue: boolean) => {
    const guestKey = getGuestKey(guest);
    setGuestAttendance(prev => ({
      ...prev,
      [guestKey]: {
        ...prev[guestKey],
        ceremony: newValue
      }
    }));
  };

  const handleReceptionToggle = (guest: GuestData, newValue: boolean) => {
    const guestKey = getGuestKey(guest);
    setGuestAttendance(prev => ({
      ...prev,
      [guestKey]: {
        ...prev[guestKey],
        reception: newValue
      }
    }));
  };

  // Handle updating dietary restrictions
  const handleDietaryRestrictionsChange = (guest: GuestData, value: string) => {
    const guestKey = getGuestKey(guest);
    setGuestAttendance(prev => ({
      ...prev,
      [guestKey]: {
        ...prev[guestKey],
        dietaryRestrictions: value
      }
    }));
  };

  // Reset form to initial state
  const resetForm = () => {
    setNameInput('');
    setMessage('');
    setSelectedGuest(null);
    setPartyGuests([]);
    setGuestAttendance({});
    setFormStage('nameSelection');
  };

  // Don't render if not active
  if (!isActive) return null;

  // Render Name Selection Stage
  const renderNameSelectionStage = () => (
    <div className="space-y-6">
      <h3 className="text-xl mb-4">Enter Your Name</h3>

      {/* Name Input with Dropdown */}
      <div className="relative">
        <DropdownInput
          options={guests}
          onSelect={handleSelectGuest}
          onChange={(value) => setNameInput(value)}
          value={nameInput}
          placeholder="Your Name"
          disabled={isSubmitting || isLoading}
        />
      </div>

      {/* Next Button */}
      <div>
        <button
          type="button"
          onClick={handleProceedToDetails}
          disabled={isSubmitting || isLoading}
          className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 transition-colors disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );

  // Render Details Submission Stage
  const renderDetailsSubmissionStage = () => {
    if (!selectedGuest) return null;

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <h3 className="text-xl mb-4">Confirm Your RSVP</h3>

        {/* Display Party Information */}
        <div className="bg-gray-50 p-4 rounded border border-gray-200">
          {/* List each party member with individual toggles for each event */}
          <div className="space-y-4 mt-3">
            <p className="text-sm font-medium text-gray-700">Please confirm attendance for each event:</p>
            {partyGuests.map((guest) => {
              const guestKey = getGuestKey(guest);
              return (
                <div key={guestKey} className="bg-white p-3 rounded border border-gray-100 space-y-3">
                  <div className="font-medium text-gray-800 mb-2">{guest.fullName}</div>
                  
                  {/* Only show Rehearsal Toggle if applicable */}
                  {guest.rehearsalRsvp !== "N/A" && (
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-700">Rehearsal Dinner:</span>
                      <Toggle
                        isOn={guestAttendance[guestKey]?.rehearsal || false}
                        onChange={(newValue) => handleRehearsalToggle(guest, newValue)}
                        disabled={isSubmitting}
                      />
                    </div>
                  )}
                  
                  {/* Only show Ceremony Toggle if applicable */}
                  {guest.ceremonyRsvp !== "N/A" && (
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-700">Ceremony:</span>
                      <Toggle
                        isOn={guestAttendance[guestKey]?.ceremony || false}
                        onChange={(newValue) => handleCeremonyToggle(guest, newValue)}
                        disabled={isSubmitting}
                      />
                    </div>
                  )}
                  
                  {/* Only show Reception Toggle if applicable */}
                  {guest.receptionRsvp !== "N/A" && (
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-700">Reception:</span>
                      <Toggle
                        isOn={guestAttendance[guestKey]?.reception || false}
                        onChange={(newValue) => handleReceptionToggle(guest, newValue)}
                        disabled={isSubmitting}
                      />
                    </div>
                  )}
                  
                  {/* Show dietary restrictions if attending any event */}
                  {((guest.rehearsalRsvp !== "N/A" && guestAttendance[guestKey]?.rehearsal) || 
                    (guest.ceremonyRsvp !== "N/A" && guestAttendance[guestKey]?.ceremony) || 
                    (guest.receptionRsvp !== "N/A" && guestAttendance[guestKey]?.reception)) && (
                    <div className="mt-3">
                      <label htmlFor={`dietary-${guestKey}`} className="block text-sm text-gray-700 mb-1">
                        Dietary Restrictions:
                      </label>
                      <input
                        id={`dietary-${guestKey}`}
                        type="text"
                        value={guestAttendance[guestKey]?.dietaryRestrictions || ''}
                        onChange={(e) => handleDietaryRestrictionsChange(guest, e.target.value)}
                        placeholder="Please specify any dietary restrictions"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-200"
                        disabled={isSubmitting}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Message Input */}
        <div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a message (optional)"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-200 min-h-[100px]"
            disabled={isSubmitting}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleBackToNameSelection}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors disabled:opacity-50"
          >
            Back
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
          </button>
        </div>
      </form>
    );
  };

  return (
    <section id="rsvp" className="text-center my-14">
      <h2 className="text-3xl tracking-wider mb-8 font-['Cormorant_Garamond']">
        RSVP
      </h2>

      <div className="max-w-md mx-auto">
        {isSuccess ? (
          <div className="bg-green-50 border border-green-200 rounded p-4 mb-6">
            <p className="text-green-700">Thank you for your RSVP!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
                <p className="text-red-700">{errorMessage}</p>
              </div>
            )}

            {/* Stage Indicator */}
            <StageIndicator currentStage={formStage} />

            {/* Form Stages */}
            {formStage === 'nameSelection' ?
              renderNameSelectionStage() :
              renderDetailsSubmissionStage()
            }
          </div>
        )}
      </div>
    </section>
  );
};

export default RSVPSection;
