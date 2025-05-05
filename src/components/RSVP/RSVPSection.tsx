import React, { useState, useEffect, useRef } from 'react';
import { GuestData, FormStage, RsvpData, PartyMemberAttendance } from '@data';
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
  const [partyMembers, setPartyMembers] = useState<PartyMemberAttendance[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);


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

  async function submitRSVP(rsvpData: RsvpData) {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rsvpData),
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
    console.log('iNPUT: ', nameInput)
    if (nameInput.trim() === '') {
      setErrorMessage('Please enter your name');
      return;
    }

    // First check if there's an exact match in the guests list, regardless of whether
    // a guest has already been selected through the dropdown
    const exactMatch = guests.find(
      (guest: GuestData) => guest.fullName.toLowerCase() === nameInput.trim().toLowerCase()
    );

    if (exactMatch) {
      // If we found an exact match, use that guest (even if they didn't use the dropdown)
      console.log('Found match for: ', exactMatch.fullName)
      setSelectedGuest(exactMatch);
    } else if (!selectedGuest) {
      // If no exact match found and no guest selected from dropdown
      setErrorMessage('Please select a name from the guest list');
      return;
    }

    // Set up party members list for attendance tracking
    // Use exactMatch if it exists, otherwise fall back to selectedGuest
    const guestToUse = exactMatch || selectedGuest;
    
    if (guestToUse) {
      // If this guest has a party, find all party members
      if (guestToUse.party && guestToUse.party !== 'Unknown') {
        // Find all guests with the same party name
        const partyGuests = guests.filter(
          (guest) => guest.party === guestToUse.party
        );
        
        // Create attendance objects for each party member
        const partyAttendees = partyGuests.map((guest) => ({
          name: guest.fullName,
          isAttending: true, // Default to attending
          id: guest.id,
          dietaryRestrictions: ''
        }));
        
        setPartyMembers(partyAttendees);
      } else {
        // If no party or unknown party, just add the selected guest
        setPartyMembers([
          {
            name: guestToUse.fullName,
            isAttending: true,
            id: guestToUse.id,
            dietaryRestrictions: ''
          }
        ]);
      }
    }

    setErrorMessage('');
    setFormStage('detailsSubmission');
  };

  // Handle going back to name selection
  const handleBackToNameSelection = () => {
    setFormStage('nameSelection');
    setSelectedGuest(null);
    setNameInput('');
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // At this point, selectedGuest should be set, but we'll check to be safe
    if (!selectedGuest) {
      setErrorMessage('Please enter your name');
      return;
    }

    // We've already populated partyMembers using the correct guest information
    // so we just need to use the selectedGuest for the partyName
    const rsvpData: RsvpData = {
      partyName: selectedGuest.party || selectedGuest.fullName,
      attendees: partyMembers,
      message: message.trim()
    };

    await submitRSVP(rsvpData);
  };

  // Reset form to initial state
  const resetForm = () => {
    setNameInput('');
    setMessage('');
    setSelectedGuest(null);
    setPartyMembers([]);
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

  // Handle toggling attendance for a party member
  const handleAttendanceToggle = (index: number, newValue: boolean) => {
    const updatedMembers = [...partyMembers];
    updatedMembers[index] = {
      ...updatedMembers[index],
      isAttending: newValue
    };
    setPartyMembers(updatedMembers);
  };

  // Handle updating dietary restrictions for a party member
  const handleDietaryRestrictionsChange = (index: number, value: string) => {
    const updatedMembers = [...partyMembers];
    updatedMembers[index] = {
      ...updatedMembers[index],
      dietaryRestrictions: value
    };
    setPartyMembers(updatedMembers);
  };

  // Render Details Submission Stage
  const renderDetailsSubmissionStage = () => {
    if (!selectedGuest) return null;

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <h3 className="text-xl mb-4">Confirm Your RSVP</h3>

        {/* Display Party Information */}
        <div className="bg-gray-50 p-4 rounded border border-gray-200">
          {/* {selectedGuest.party && selectedGuest.party !== 'Unknown' && (
            <p className="text-sm text-gray-600 mb-2">
              Party: {selectedGuest.party}
            </p>
          )} */}
          
          {/* List each party member with individual toggles */}
          <div className="space-y-4 mt-3">
            <p className="text-sm font-medium text-gray-700">Please confirm who will be attending:</p>
            {partyMembers.map((member, index) => (
              <div key={index} className="bg-white p-3 rounded border border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-800">{member.name}</span>
                  <div className="flex items-center">
                    <span className="mr-2 text-sm text-gray-700">Attending:</span>
                    <Toggle
                      isOn={member.isAttending}
                      onChange={(newValue) => handleAttendanceToggle(index, newValue)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                
                {member.isAttending && (
                  <div>
                    <input
                      id={`dietary-${index}`}
                      type="text"
                      value={member.dietaryRestrictions}
                      onChange={(e) => handleDietaryRestrictionsChange(index, e.target.value)}
                      placeholder="Dietary Restrictions"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-200"
                      disabled={isSubmitting}
                    />
                  </div>
                )}
              </div>
            ))}
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
