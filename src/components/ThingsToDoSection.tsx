import { Place } from './Place';

interface ThingsToDoSectionProps {
  isActive: boolean;
}

export const ThingsToDoSection = ({ isActive }: ThingsToDoSectionProps) => {
  if (!isActive) return null;
  
  return (
    <section id="things-to-do" className="text-center my-14">
      <h2 className="text-3xl tracking-wider mb-8 font-['Cormorant_Garamond']">
        THINGS TO DO
      </h2>
      
      <div className="max-w-2xl mx-auto">
        <p className="mb-8">
          <a 
            href="https://www.discoverdurham.com/events/?range=1&date-from=2025-07-18&date-to=2025-07-21#dir-filters" 
            target="_blank" 
            rel="noreferrer"
            className="text-gray-600 no-underline border-b border-dotted border-gray-600 hover:text-gray-800 hover:border-gray-800"
          >
            🌐 Durham Events Calendar
          </a>
        </p>

        <div className="mb-8 flex flex-col md:flex-row items-center gap-6">
          <div className="md:w-1/2">
            <img 
              src="assets/Farmers_Market.png" 
              alt="Durham Farmers Market" 
              className="rounded-md max-w-full" 
              style={{ maxHeight: '250px' }}
            />
          </div>
          <div className="md:w-1/2 text-left">
            <Place 
              name="Durham Farmers Market" 
              address="501 Foster St, Durham, NC 27701" 
            />
            <p className="mt-2 text-gray-600">
              Open from 8am-12pm on Saturday July 19th, 2025
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThingsToDoSection;
