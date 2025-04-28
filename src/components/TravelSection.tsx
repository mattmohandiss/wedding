interface TravelSectionProps {
  isActive: boolean;
}

export const TravelSection = ({ isActive }: TravelSectionProps) => {
  if (!isActive) return null;
  
  return (
    <section id="travel" className="text-center my-14">
      <h2 className="text-3xl tracking-wider mb-8 font-['Cormorant_Garamond']">
        TRAVEL
      </h2>
      
      <div className="max-w-2xl mx-auto">
        <p className="mb-8">
          Information about travel and accommodations coming soon!
        </p>
      </div>
    </section>
  );
};

export default TravelSection;
