import type { Env } from '../types';
import { getAccessToken, getCorsHeaders } from '../utils/googleAuth';
import { GuestData } from '@data';

export const onRequestPost = async ({ request, env }: { request: Request, env: Env }) => {
  const headers = getCorsHeaders('POST, OPTIONS');
  
  try {
    // Parse and validate request body
    const { guests, message = '' } = await request.json();
    
    if (!guests?.length) {
      return new Response(
        JSON.stringify({ success: false, message: "At least one guest is required" }),
        { status: 400, headers }
      );
    }
    
    // Update guests in the sheet
    await updateGuestsInSheet(env, guests, message);
    
    return new Response(
      JSON.stringify({ success: true, message: "RSVP successfully submitted" }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Error processing RSVP:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Failed to process RSVP. Please contact Matt at mattmohandiss@gmail.com." 
      }),
      { status: 500, headers }
    );
  }
};

// Handle preflight CORS requests
export const onRequestOptions = async () => {
  return new Response(null, {
    headers: getCorsHeaders('POST, OPTIONS')
  });
};

/**
 * Update all guests in the Google Sheet
 */
async function updateGuestsInSheet(env: Env, guests: GuestData[], message: string) {
  const token = await getAccessToken(env);
  const validGuests = guests.filter(guest => guest.id.row > 0);
  
  if (!validGuests.length) {
    console.log("No valid guests to update");
    return;
  }
  
  console.log(`Updating ${validGuests.length} guests`);
  
  // Prepare batch update data
  const batchData = createBatchUpdateData(validGuests, message);
  
  // Send batch update
  if (batchData.length) {
    await sendBatchUpdate(env, token, batchData);
    console.log("RSVP update completed successfully");
  }
}

/**
 * Type for batch update entry
 */
interface BatchUpdateEntry {
  range: string;
  values: any[][];
}

/**
 * Create batch update data for all guests
 */
function createBatchUpdateData(guests: GuestData[], message: string): BatchUpdateEntry[] {
  const batchData: BatchUpdateEntry[] = [];
  
  guests.forEach(guest => {
    const { row, columnMap } = guest.id;
    
    // Define all fields that should be updated
    const fields = {
      'First Name': guest.firstName,
      'Last Name': guest.lastName,
      'Party': guest.party,
      'Phone': guest.phone,
      'Email': guest.email,
      'Address': guest.address,
      'Rehearsal Dinner - RSVP': guest.rehearsalRsvp,
      'Ceremony - RSVP': guest.ceremonyRsvp,
      'Reception - RSVP': guest.receptionRsvp,
      'Dietary Restrictions': guest.dietaryRestrictions,
      'Message': message
    };
    
    // Add each field that has a column mapping to the batch
    Object.entries(fields).forEach(([fieldName, value]) => {
      if (columnMap[fieldName] !== undefined) {
        const columnLetter = getColumnLetter(columnMap[fieldName] + 1);
        const range = `Guests!${columnLetter}${row}`;
        
        batchData.push({
          range,
          values: [[value]]
        });
      }
    });
  });
  
  return batchData;
}

/**
 * Send batch update to Google Sheets API
 */
async function sendBatchUpdate(env: Env, token: string, data: BatchUpdateEntry[]) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${env.GOOGLE_SHEET_ID}/values:batchUpdate`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      valueInputOption: 'RAW',
      data
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update sheet: ${errorText}`);
  }
  
  return response.json();
}

/**
 * Convert column index to letter (A, B, C, etc.)
 */
function getColumnLetter(index: number): string {
  let letter = '';
  while (index > 0) {
    const remainder = (index - 1) % 26;
    letter = String.fromCharCode(65 + remainder) + letter;
    index = Math.floor((index - 1) / 26);
  }
  return letter;
}
