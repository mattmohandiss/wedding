import type { Env } from '../types';
import { getAccessToken, getCorsHeaders } from '../utils/googleAuth';

interface PartyMemberAttendance {
  name: string;
  isAttending: boolean;
  id: number;
}

interface RSVPFormData {
  partyName: string;
  attendees: PartyMemberAttendance[];
  message?: string;
}

export const onRequestPost = async (context: any) => {
  const { request, env } = context;
  
  // Set CORS headers
  const headers = getCorsHeaders('POST, OPTIONS');
  
  try {
    // Parse the request body
    const data: RSVPFormData = await request.json();
    
    // Validate required fields
    if (!data.partyName || !data.attendees || data.attendees.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "Party name and attendees are required" }),
        { status: 400, headers }
      );
    }
    
    // Prepare data for Google Sheets - one row per attendee with party info
    const timestamp = new Date().toISOString();
    const rows = [];
    
    // Create a row for each attendee
    for (const attendee of data.attendees) {
      const row = [
        attendee.name,
        attendee.isAttending ? "Attending" : "Not Attending",
        data.message || "", // Include message if provided, otherwise empty string
        data.partyName, // Add party name
        timestamp
      ];
      rows.push(row);
    }
    
    // Process the RSVP data
    await processRSVPData(env, data);
    
    return new Response(
      JSON.stringify({ success: true, message: "RSVP successfully submitted" }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Error processing RSVP:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Failed to process RSVP. Please try again later." 
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

// Process RSVP data and update the sheet
async function processRSVPData(env: Env, data: RSVPFormData) {
  try {
    console.log("Processing RSVP data for party:", data.partyName);
    
    // Get access token for Google Sheets API
    const token = await getAccessToken();
    
    // Update each attendee's status in the sheet
    for (const attendee of data.attendees) {
      // Skip entries with invalid IDs (like manually entered names with id = -1)
      if (attendee.id <= 0) {
        console.log(`Skipping update for manually entered guest: ${attendee.name}`);
        continue;
      }
      
      // Row is the guest's ID (already 1-indexed to account for header row)
      const row = attendee.id;
      
      // Column L is the 12th column (for attendance status)
      const range = `Guests!L${row}`;
      
      // Set value to "yes" or "no" based on attendance
      const value = attendee.isAttending ? "yes" : "no";
      
      console.log(`Updating ${attendee.name} (row ${row}): attendance = ${value}`);
      
      // Make the API request to update the cell
      await updateSheetCell(env, token, range, value);
    }
    
    console.log("RSVP update completed successfully");
    return true;
  } catch (error) {
    console.error("Error processing RSVP data:", error);
    throw error;
  }
}

// Helper function to update a single cell in the Google Sheet
async function updateSheetCell(env: Env, token: string, range: string, value: string) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${env.GOOGLE_SHEET_ID}/values/${encodeURIComponent(range)}?valueInputOption=RAW`;
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      values: [[value]]
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to update sheet: ${JSON.stringify(errorData)}`);
  }
  
  return response.json();
}

// Legacy function - will be removed once sheet update is implemented
async function addRowToSheet(env: Env, values: string[]) {
  console.log("DEPRECATED - Legacy function called with values:", values);
  return true;
}
