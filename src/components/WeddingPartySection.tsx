import { PartyMember } from './PartyMember'

interface WeddingPartySectionProps {
  isActive: boolean;
}

export const WeddingPartySection = ({ isActive }: WeddingPartySectionProps) => {
  if (!isActive) return null;
  
  return (
    <section id="wedding-party" className="text-center my-14">
      <h2 className="text-3xl tracking-wider mb-8 font-['Cormorant_Garamond']">
        WEDDING PARTY
      </h2>
      
      <div className="flex flex-col items-center gap-12">
        {/* Groomsmen Row */}
        <div className="w-full">
          <h3 className="mb-6 text-2xl font-['Cormorant_Garamond']">GROOMSMEN</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 justify-items-center">
            <PartyMember 
              name="Ben" 
              image="assets/Ben.jpeg" 
              role="Best Man" 
            />
            <PartyMember 
              name="JP" 
              image="assets/JP.jpeg" 
            />
            <PartyMember 
              name="Wilber" 
              image="assets/Wilber.jpeg" 
            />
            <PartyMember 
              name="Neil" 
              image="assets/Neil.jpeg" 
            />
            <PartyMember 
              name="Colt" 
              image="assets/Colt.jpeg" 
            />
            <PartyMember 
              name="Nick" 
              image="assets/Nick.jpeg" 
            />
          </div>
        </div>
        
        {/* Bridesmaids Row */}
        <div className="w-full">
          <h3 className="mb-6 text-2xl font-['Cormorant_Garamond']">BRIDESMAIDS</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 justify-items-center">
            <PartyMember 
              name="Sarah" 
              image="assets/Sarah.jpeg" 
              role="Maid of Honor" 
            />
            <PartyMember 
              name="Julia" 
              image="assets/Julia.jpeg" 
            />
            <PartyMember 
              name="Kelly" 
              image="assets/Kelly.jpeg" 
            />
            <PartyMember 
              name="Claire" 
              image="assets/Claire.jpeg" 
            />
            <PartyMember 
              name="Makayla" 
              image="assets/Makayla.jpeg" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeddingPartySection;
