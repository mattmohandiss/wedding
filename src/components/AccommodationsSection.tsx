import { Place } from './Place';

interface Accommodation {
  name: string;
  address: string;
  phone: string;
  url: string;
}

interface AccommodationsSectionProps {
  isActive: boolean;
}

export const AccommodationsSection = ({ isActive }: AccommodationsSectionProps) => {
  if (!isActive) return null;

  const accommodations: Accommodation[] = [
    {
      name: "21c Museum Hotel Durham",
      address: "111 North Corcoran St., Durham, NC 27701",
      phone: "919.956.6700",
      url: "https://book.passkey.com/e/51038427"
    },
    {
      name: "Hilton Garden Inn",
      address: "2102 West Main St., Durham, NC 27705",
      phone: "919.286.0774",
      url: "https://www.hilton.com/en/attend-my-event/mohandiss-davis-2025/"
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
            <Place
              name={accommodation.name}
              address={accommodation.address}
            />
            <p className="text-sm mt-2">
              <a 
                href={accommodation.url}
                className="text-gray-600 no-underline border-b border-dotted border-gray-600 hover:text-gray-800 hover:border-gray-800 mr-4"
                target="_blank"
                rel="noreferrer"
              >
                🌐 Book a Room
              </a>
              <a 
                href={`tel:${accommodation.phone.replace(/[^0-9]/g, '')}`}
                className="text-gray-600 no-underline border-b border-dotted border-gray-600 hover:text-gray-800 hover:border-gray-800"
              >
                📞 {accommodation.phone}
              </a>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AccommodationsSection;
