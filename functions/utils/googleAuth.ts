import { SignJWT, importPKCS8 } from 'jose';
import serviceAccount from 'google.json';

// Service account configuration
const SERVICE_ACCOUNT = {
  client_email: serviceAccount.client_email,
  private_key: serviceAccount.private_key.replace(/\\n/g, '\n'),
};
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_URI = 'https://oauth2.googleapis.com/token';

/**
 * Creates a signed JWT using the service account
 */
async function mintJWT(): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);
  
  // Import the private key in PKCS8 format for RS256
  const privateKey = await importPKCS8(SERVICE_ACCOUNT.private_key, 'RS256');
  
  return await new SignJWT({
    iss: SERVICE_ACCOUNT.client_email,
    scope: SCOPES.join(' '),
    aud: TOKEN_URI,
  })
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
    .setIssuedAt(iat)
    .setExpirationTime(iat + 3600)
    .sign(privateKey);
}

/**
 * Exchanges a JWT for a Google OAuth access token
 */
export async function getAccessToken(): Promise<string> {
  const assertion = await mintJWT();
  const resp = await fetch(TOKEN_URI, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });
  
  const data = await resp.json();
  
  if (!data.access_token) {
    throw new Error(`Failed to get access token: ${JSON.stringify(data)}`);
  }
  
  return data.access_token;
}

/**
 * Sets up standard CORS headers for API responses
 */
export function getCorsHeaders(methods: string = 'GET, POST, OPTIONS'): HeadersInit {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": methods,
    "Access-Control-Allow-Headers": "Content-Type"
  };
}
