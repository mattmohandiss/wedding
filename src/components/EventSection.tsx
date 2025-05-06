import { Place } from './Place';

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
  
  return (
    <section id={id} className="text-center my-20">
      <h2 className="text-3xl tracking-wider mb-4 font-['Cormorant_Garamond']">
        {title}
      </h2>
      <p className="text-base tracking-wide mb-5">
        {date}
      </p>
      <p className="text-sm text-gray-600">
        <Place
          name={venue}
          address={address}
        />
      </p>
    </section>
  );
};

export default EventSection;
