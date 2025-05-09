/**
 * Shared type definitions for guest and RSVP data used by both frontend and backend.
 */

/**
 * Information about a guest's location in the spreadsheet
 */
export interface GuestPosition {
  row: number;       // The row number in the sheet
  columnMap: Record<string, number>;  // Maps field names to column indices
}

/**
 * Represents a guest's complete information.
 */
export interface GuestData {
  id: GuestPosition;  // Changed from number to GuestPosition
  firstName: string;
  lastName: string;
  party: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  rehearsalRsvp: string;
  ceremonyRsvp: string;
  receptionRsvp: string;
  dietaryRestrictions: string;
}

/**
 * Type for tracking the current stage of the RSVP form (frontend-only).
 */
export type FormStage = 'nameSelection' | 'detailsSubmission';
