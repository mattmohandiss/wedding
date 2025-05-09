import { Env } from '../types';
import { getAccessToken, getCorsHeaders } from '../utils/googleAuth';
import { GuestData } from '@data';

// Parse sheet data into guest objects
function parseGuests(sheetData: any): GuestData[] {
  if (!sheetData.values || sheetData.values.length <= 1) {
    return [];
  }
  
  // Extract headers and create column mapping
  const headers = sheetData.values[0];
  const columnMap: Record<string, number> = {};
  
  // Create a mapping of header names to column indices
  headers.forEach((header: string, index: number) => {
    columnMap[header.trim()] = index;
  });
  
  const guests: GuestData[] = [];
  
  // Process each data row, excluding the last row which contains counts
  for (let i = 1; i < sheetData.values.length - 1; i++) {
    const row = sheetData.values[i];
    
    // Skip empty rows or rows without first and last names
    if (!row || 
        columnMap['First Name'] === undefined || 
        columnMap['Last Name'] === undefined ||
        !row[columnMap['First Name']] || 
        !row[columnMap['Last Name']]) {
      continue;
    }
    
    const firstName = row[columnMap['First Name']]?.trim() || '';
    const lastName = row[columnMap['Last Name']]?.trim() || '';
    
    // Initialize guest with all required fields and default empty values
    const guest: GuestData = {
      id: {
        row: i + 1,  // Adjust to get actual sheet row number (accounting for header row)
        columnMap: {...columnMap}  // Clone the column map for each guest
      },
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      party: '',
      phone: '',
      email: '',
      address: '',
      rehearsalRsvp: '',
      ceremonyRsvp: '',
      receptionRsvp: '',
      dietaryRestrictions: ''
    };
    
    // Helper function to get cell value with default empty string
    const getCellValue = (headerName: string): string => {
      const columnIndex = columnMap[headerName];
      if (columnIndex !== undefined && row[columnIndex]) {
        return row[columnIndex].trim();
      }
      return '';
    };
    
    // Set each field individually in a type-safe way
    guest.party = getCellValue('Party');
    guest.phone = getCellValue('Phone');
    guest.email = getCellValue('Email');
    guest.address = getCellValue('Address');
    guest.rehearsalRsvp = getCellValue('Rehearsal Dinner - RSVP');
    guest.ceremonyRsvp = getCellValue('Ceremony - RSVP');
    guest.receptionRsvp = getCellValue('Reception - RSVP');
    guest.dietaryRestrictions = getCellValue('Dietary Restrictions');
    
    guests.push(guest);
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
    
    // Fetch entire guest sheet
    const range = "Guests"; // Get the entire sheet
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
