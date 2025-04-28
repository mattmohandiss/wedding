interface HomeSectionProps {
  isActive: boolean;
}

export const HomeSection = ({ isActive }: HomeSectionProps) => {
  if (!isActive) return null;
  
  return (
    <section id="home" className="my-16">
      <div className="flex justify-center items-center text-center md:flex-row flex-col">
        <div className="flex-1 max-w-xs">
          <h2 className="text-3xl font-['Cormorant_Garamond'] tracking-wide leading-tight">
            JULY 20,<br />2025
          </h2>
        </div>
        
        <div className="w-px h-24 bg-gray-200 mx-12 my-8 md:my-0"></div>
        
        <div className="flex-1 max-w-xs">
          <h2 className="text-3xl font-['Cormorant_Garamond'] tracking-wide leading-tight">
            DURHAM<br />NC
          </h2>
        </div>
      </div>
    </section>
  );
};

export default HomeSection;
