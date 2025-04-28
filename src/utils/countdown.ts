/**
 * Countdown utility functions for wedding date
 */
import { useState, useEffect } from 'react';

// Wedding date - July 20, 2025
const WEDDING_DATE = new Date('July 20, 2025 00:00:00').getTime();

/**
 * Calculate days remaining until wedding
 * @returns {number} Number of days until wedding
 */
export function getDaysUntilWedding(): number {
  const now = new Date().getTime();
  const distance = WEDDING_DATE - now;
  
  // Time calculations for days
  return Math.floor(distance / (1000 * 60 * 60 * 24));
}

/**
 * Custom hook to get countdown value
 * @returns {number} Days until wedding
 */
export function useCountdown(): number {
  const [days, setDays] = useState<number>(getDaysUntilWedding());
  
  useEffect(() => {
    // Update countdown once a day
    const interval = setInterval(() => {
      setDays(getDaysUntilWedding());
    }, 86400000); // 24 hours
    
    return () => clearInterval(interval);
  }, []);
  
  return days;
}
