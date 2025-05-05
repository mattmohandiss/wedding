import { Env } from '../types';
import { getAccessToken, getCorsHeaders } from '../utils/googleAuth';
import { GuestData } from '@data';

// Parse sheet data into guest objects
function parseGuests(sheetData: any): GuestData[] {
  if (!sheetData.values || sheetData.values.length <= 1) {
    return [];
  }
  
  // Assume first row is headers
  const guests: GuestData[] = [];
  
  // Start from index 1 to skip header row
  for (let i = 1; i < sheetData.values.length; i++) {
    const row = sheetData.values[i];
    
    // Skip empty rows or rows without names
    if (!row || row.length < 2 || !row[0] || !row[1]) {
      continue;
    }
    
    const firstName = row[0].trim();
    const lastName = row[1].trim();
    const party = row[2] ? row[2].trim() : '';
    
    guests.push({
      id: i+1, //account for 1-indexing in Google sheets
      firstName,
      lastName,
      party,
      fullName: `${firstName} ${lastName}`
    });
  }
  
  return guests;
}

export const onRequestGet = async (context: any) => {
  const env = context.env as Env;
  
  // Set CORS headers
  const headers = getCorsHeaders('GET, OPTIONS');
  
  try {
    // Get access token
    const token = await getAccessToken(env);
    
    // Fetch guest data from sheet
    const range = "Guests!A1:C151"
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${env.GOOGLE_SHEET_ID}/values/${encodeURIComponent(range)}`;
    const resp = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    const data = await resp.json();
    
    if (data.error) {
      throw new Error(`Google Sheets API error: ${data.error.message}`);
    }
    
    // Parse and format guest data
    const guests = parseGuests(data);
    
    return new Response(
      JSON.stringify({ success: true, guests }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Error fetching guest data:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Failed to retrieve guest data. Please try again later.",
        error: String(error)
      }),
      { status: 500, headers }
    );
  }
};

// Handle preflight CORS requests
export const onRequestOptions = async () => {
  return new Response(null, {
    headers: getCorsHeaders('GET, OPTIONS')
  });
};
