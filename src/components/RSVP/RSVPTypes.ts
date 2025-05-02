export interface RSVPSectionProps {
  isActive: boolean;
}

export interface GuestData {
  id: number;
  firstName: string;
  lastName: string;
  party: string;
  fullName: string;
}

export interface PartyMemberAttendance {
  name: string;
  isAttending: boolean;
  id: number;
  dietaryRestrictions?: string;
}

export interface RsvpData {
  partyName: string;
  attendees: PartyMemberAttendance[];
  message: string;
}

export type FormStage = 'nameSelection' | 'detailsSubmission';
