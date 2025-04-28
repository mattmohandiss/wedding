import { getMapUrl } from '../utils/mapLinks';

interface EventSectionProps {
  id: string;
  title: string;
  date: string;
  venue: string;
  address: string;
  isActive: boolean;
}

export const EventSection = ({ 
  id, 
  title, 
  date, 
  venue, 
  address, 
  isActive 
}: EventSectionProps) => {
  if (!isActive) return null;
  
  // Generate map link for the address
  const mapUrl = getMapUrl(address);
  
  return (
    <section id={id} className="text-center my-20">
      <h2 className="text-3xl tracking-wider mb-4 font-['Cormorant_Garamond']">
        {title}
      </h2>
      <p className="text-base tracking-wide mb-5">
        {date}
      </p>
      <p className="font-medium mb-1 text-lg">
        {venue}
      </p>
      <p className="text-sm text-gray-600">
        <a 
          href={mapUrl}
          className="text-gray-600 no-underline border-b border-dotted border-gray-600 hover:text-gray-800 hover:border-gray-800"
          target="_blank"
          rel="noreferrer"
        >
          {address}
        </a>
      </p>
    </section>
  );
};

export default EventSection;
