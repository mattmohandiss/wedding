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
          Recommendations for things to do in Durham coming soon!
        </p>
      </div>
    </section>
  );
};

export default ThingsToDoSection;
