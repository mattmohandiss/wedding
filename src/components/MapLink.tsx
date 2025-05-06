import React from 'react';

interface MapLinkProps {
  businessName: string;
  address: string;
  className?: string;
}

/**
 * MapLink component that renders a location link using business name and address
 * It will open the appropriate maps app based on the user's platform
 */
export const MapLink = ({
  businessName,
  address,
  className = "text-gray-600 no-underline border-b border-dotted border-gray-600 hover:text-gray-800 hover:border-gray-800"
}: MapLinkProps) => {
  // Platform detection functions
  const isIOS = (): boolean => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  };

  // Get the appropriate URL based on platform
  const getMapUrl = (): string => {
    const encodedBusiness = encodeURIComponent(businessName);
    const encodedAddress = encodeURIComponent(address);
    
    if (isIOS()) {
      // Apple Maps URL for iOS
      return `maps://?q=${encodedBusiness}&address=${encodedAddress}`;
    } else {
      // Google Maps URL for Android and web
      return `https://www.google.com/maps/search/?api=1&query=${encodedBusiness} ${encodedAddress}`;
    }
  };
  
  const mapUrl = getMapUrl();
  
  return (
    <a 
      href={mapUrl}
      className={className}
      target="_blank"
      rel="noreferrer"
    >
      {address}
    </a>
  );
};

export default MapLink;
