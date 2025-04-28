/**
 * Utilities for handling map links based on platform
 */

/**
 * Check if the user is on iOS
 * @returns {boolean} true if user is on iOS device
 */
export function isIOS(): boolean {
  // Check if device is iOS
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

/**
 * Generate a map URL for the given address based on user's platform
 * @param {string} address - The location address
 * @returns {string} URL to open address in appropriate maps app
 */
export function getMapUrl(address: string): string {
  const encodedAddress = encodeURIComponent(address);
  
  if (isIOS()) {
    // Apple Maps URL scheme for iOS
    return `maps://?q=${encodedAddress}`;
  } else {
    // Google Maps URL for Android and other platforms
    return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  }
}
