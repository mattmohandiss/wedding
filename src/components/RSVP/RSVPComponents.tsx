import React, { useState, useEffect, useRef } from 'react';
import { GuestData, FormStage } from './RSVPTypes';

// Toggle component
export interface ToggleProps {
  isOn: boolean;
  onChange: (newValue: boolean) => void;
  labelOn?: string;
  labelOff?: string;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({
  isOn,
  onChange,
  labelOn = 'On',
  labelOff = 'Off',
  disabled = false
}) => {
  return (
    <div className="flex items-center justify-center space-x-4">
      <span className={`text-sm ${isOn ? 'text-gray-800' : 'text-gray-400'}`}>
        {isOn ? labelOn : labelOff}
      </span>
      <button
        type="button"
        onClick={() => onChange(!isOn)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200 ${
          isOn ? 'bg-green-500' : 'bg-gray-200'
        }`}
        disabled={disabled}
        aria-pressed={isOn}
        aria-label={isOn ? labelOn : labelOff}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isOn ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

// Stage Indicator component
export interface StageIndicatorProps {
  currentStage: FormStage;
}

export const StageIndicator: React.FC<StageIndicatorProps> = ({
  currentStage
}) => {
  const stages: FormStage[] = ['nameSelection', 'detailsSubmission'];
  
  return (
    <div className="flex justify-center mb-4">
      <div className="flex items-center">
        {stages.map((stage, index) => (
          <React.Fragment key={stage}>
            <div 
              className={`h-2 w-2 rounded-full ${
                currentStage === stage ? 'bg-gray-800' : 'bg-gray-300'
              }`}
              aria-current={currentStage === stage}
              role="tab"
              aria-label={`Stage ${index + 1}`}
            />
            
            {index < stages.length - 1 && (
              <div className="h-0.5 w-10 bg-gray-300" aria-hidden="true" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// Dropdown Input component
export interface DropdownInputProps {
  options: GuestData[];
  placeholder?: string;
  onSelect: (guest: GuestData) => void;
  onChange?: (value: string) => void;
  value?: string;
  disabled?: boolean;
}

export const DropdownInput: React.FC<DropdownInputProps> = ({
  options,
  placeholder = 'Your Name',
  onSelect,
  onChange,
  value = '',
  disabled = false
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [showList, setShowList] = useState(false);
  const [filtered, setFiltered] = useState<GuestData[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Hide dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowList(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Reset filtered options when options change
  useEffect(() => {
    if (inputValue.trim() !== '') {
      filterOptions(inputValue);
    }
  }, [options]);

  const filterOptions = (value: string) => {
    if (value.trim() === '') {
      setFiltered([]);
      return;
    }
    
    const filteredOptions = options.filter(guest =>
      guest.fullName.toLowerCase().includes(value.toLowerCase()) ||
      `${guest.lastName}, ${guest.firstName}`.toLowerCase().includes(value.toLowerCase())
    );
    
    setFiltered(filteredOptions);
    setActiveIndex(0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    filterOptions(val);
    setShowList(true);
    
    // Call the onChange callback if it exists
    if (onChange) {
      onChange(val);
    }
  };

  const handleSelect = (guest: GuestData) => {
    setInputValue(guest.fullName);
    setShowList(false);
    onSelect(guest);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (filtered.length === 0 || !showList) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev: number) => prev < filtered.length - 1 ? prev + 1 : prev);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev: number) => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        e.preventDefault();
        handleSelect(filtered[activeIndex]);
        break;
      case 'Escape':
        setShowList(false);
        break;
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full"
    >
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => inputValue.trim() !== '' && setShowList(true)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-200"
        disabled={disabled}
        aria-label="Name input"
        aria-autocomplete="list"
      />

      {showList && filtered.length > 0 && (
        <ul
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto"
          role="listbox"
          aria-label="Suggested guests"
        >
          {filtered.map((guest: GuestData, index: number) => (
            <li
              key={`${guest.firstName}-${guest.lastName}-${index}`}
              onClick={() => handleSelect(guest)}
              className={`w-full text-left px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                index === activeIndex ? 'bg-gray-100' : ''
              }`}
              role="option"
              aria-selected={index === activeIndex}
            >
              <div>{guest.fullName}</div>
              {guest.party && guest.party !== 'Unknown' && (
                <div className="text-sm text-gray-500">
                  {/* Party: {guest.party} */}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// For backwards compatibility (deprecated)
export interface SuggestionsListProps {
  suggestions: GuestData[];
  activeSuggestionIndex: number;
  selectGuest: (guest: GuestData) => void;
  visible: boolean;
}

export const SuggestionsList: React.FC<SuggestionsListProps> = ({
  suggestions,
  activeSuggestionIndex,
  selectGuest,
  visible
}) => {
  console.warn('SuggestionsList is deprecated. Please use DropdownInput instead.');
  
  if (!visible || suggestions.length === 0) {
    return null;
  }

  return (
    <div 
      className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto"
      role="listbox"
      aria-label="Suggested guests"
      style={{ pointerEvents: 'auto' }}
    >
      {suggestions.map((guest, index) => (
        <button
          key={`${guest.firstName}-${guest.lastName}-${index}`}
          type="button"
          className={`w-full text-left px-4 py-2 cursor-pointer hover:bg-gray-100 suggestion-item ${
            index === activeSuggestionIndex ? 'bg-gray-100' : ''
          }`}
          role="option"
          aria-selected={index === activeSuggestionIndex}
          onClick={(e) => {
            e.preventDefault(); // Prevent default action
            e.stopPropagation(); // Prevent event from bubbling up
            selectGuest(guest);
          }}
        >
          <div>{guest.fullName}</div>
          {guest.party && guest.party !== 'Unknown' && (
            <div className="text-sm text-gray-500">
              {/* Party: {guest.party} */}
            </div>
          )}
        </button>
      ))}
    </div>
  );
};
