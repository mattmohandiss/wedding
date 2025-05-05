/**
 * Shared type definitions for guest and RSVP data used by both frontend and backend.
 */

/**
 * Represents a guest's basic information.
 */
export interface GuestData {
  id: number;
  firstName: string;
  lastName: string;
  party: string;
  fullName: string;
}

/**
 * Represents a party member's attendance status and dietary restrictions.
 */
export interface PartyMemberAttendance {
  name: string;
  isAttending: boolean;
  id: number;
  dietaryRestrictions?: string;
}

/**
 * Represents the complete RSVP submission data for a party.
 */
export interface RsvpData {
  partyName: string;
  attendees: PartyMemberAttendance[];
  message?: string;
}

/**
 * Type for tracking the current stage of the RSVP form (frontend-only).
 */
export type FormStage = 'nameSelection' | 'detailsSubmission';
