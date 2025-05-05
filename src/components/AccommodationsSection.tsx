import { getMapUrl } from '../utils/mapLinks';

interface Accommodation {
  name: string;
  description?: string;
  address: string;
  phone: string;
}

interface AccommodationsSectionProps {
  isActive: boolean;
}

export const AccommodationsSection = ({ isActive }: AccommodationsSectionProps) => {
  if (!isActive) return null;

  const accommodations: Accommodation[] = [
    {
      name: "21c Museum Hotel Durham",
      description: "Mohandiss/Davis Wedding Block",
      address: "111 North Corcoran St., Durham, NC 27701",
      phone: "919.956.6700"
    },
    {
      name: "Hilton Garden Inn",
      description: "Durham/University Medical Center",
      address: "2102 West Main St., Durham, NC 27705",
      phone: "919.286.0774"
    }
  ];
  
  return (
    <section id="accommodations" className="text-center my-14">
      <h2 className="text-3xl tracking-wider mb-8 font-['Cormorant_Garamond']">
        ACCOMMODATIONS
      </h2>
      
      <div className="max-w-2xl mx-auto">
        {accommodations.map((accommodation, index) => (
          <div 
            key={index} 
            className="max-w-[700px] mx-auto mb-10 text-center border-b border-gray-100 pb-8 last:border-0"
          >
            <h3 className="mb-2 text-xl font-['Cormorant_Garamond']">
              {accommodation.name}
            </h3>
            {accommodation.description && (
              <p className="text-sm mb-2 text-gray-700">{accommodation.description}</p>
            )}
            <p className="text-sm mb-2">
              <a 
                href={getMapUrl(accommodation.address)}
                className="text-gray-600 no-underline border-b border-dotted border-gray-600 hover:text-gray-800 hover:border-gray-800"
                target="_blank"
                rel="noreferrer"
              >
                {accommodation.address}
              </a>
            </p>
            <p className="text-sm text-gray-700">
              <a 
                href={`tel:${accommodation.phone.replace(/[^0-9]/g, '')}`}
                className="text-gray-600 no-underline border-b border-dotted border-gray-600 hover:text-gray-800 hover:border-gray-800"
              >
                {accommodation.phone}
              </a>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AccommodationsSection;
