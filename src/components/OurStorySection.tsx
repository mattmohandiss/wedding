interface OurStorySectionProps {
  isActive: boolean;
}

export const OurStorySection = ({ isActive }: OurStorySectionProps) => {
  if (!isActive) return null;
  
  return (
    <section id="our-story" className="text-center my-14">
      <h2 className="text-3xl tracking-wider mb-8 font-['Cormorant_Garamond']">
        OUR STORY
      </h2>
      
      <div className="w-full max-w-4xl mx-auto px-4 space-y-10">
        {/* First paragraph with image on left */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="md:w-2/5 w-full">
            <img 
              src="assets/Our_Story_1.jpg" 
              alt="Our Story: The Beginning" 
              className="w-full h-auto rounded-md shadow-md"
            />
          </div>
          <div className="md:w-3/5 w-full text-left">
            <p className="leading-relaxed">
              We first crossed paths in 2020 at the University of Tennessee through our professional engineering fraternity, Theta Tau. Our relationship started with a simple transition. Matt was the outgoing treasurer, and Lauren was stepping into the role. What could have been a quick document handoff became a longer conversation about our shared love of national parks and spending time outdoors. Lauren mentioned to Matt that she was planning a ski trip to Park City, Utah that winter and Matt invited himself along.
            </p>
            <p className="leading-relaxed mt-4">
              Before the Park City trip, we both joined a group ski trip to Snowshoe, West Virginia. During the long car ride up we got to know each other and instantly clicked. Right before stepping out of the car at the end of the trip, Matt asked Lauren on a first date to Smoothie King. He insisted Lauren try his favorite: <a href="https://www.smoothieking.com/menu/smoothies/enjoy-a-treat-blends/banana-boat" target="_blank" rel="noopener noreferrer">Banana Boat</a>.
            </p>
          </div>
        </div>
        
        {/* Second paragraph with image on right */}
        <div className="flex flex-col md:flex-row-reverse gap-6 items-start">
          <div className="md:w-2/5 w-full">
            <img 
              src="assets/Our_Story_2.jpeg" 
              alt="Our Story: Adventures Together" 
              className="w-full h-auto rounded-md shadow-md"
            />
          </div>
          <div className="md:w-3/5 w-full text-left">
            <p className="leading-relaxed">
              One day later, we were off to Utah. From navigating flights and rental cars to swapping stories on the lift, the trip set the tone for our relationship. It was full of adventure, laughter, and a whole lot of fun.
            </p>
            <p className="leading-relaxed mt-4">
              After graduation, we moved to Raleigh, North Carolina, where we started our life together. We explored new hiking spots, tested every food truck we could find, and built a life filled with shared routines and spontaneous adventures. A year later, we relocated to Durham for new opportunities and quickly fell in love with the Bull City. We began to enjoy all that Durham has to offer, from Durham Bulls baseball games and neighborhood walks with our dog Ollie, to rock climbing and trying the many fantastic restaurants the city has to offer.
            </p>
          </div>
        </div>
        
        {/* Third and fourth paragraphs with image on left */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="md:w-2/5 w-full">
            <img 
              src="assets/Our_Story_3.jpg" 
              alt="Our Story: The Proposal" 
              className="w-full h-auto rounded-md shadow-md"
            />
          </div>
          <div className="md:w-3/5 w-full text-left space-y-4">
            <p className="leading-relaxed">
              In fall 2024, Matt planned a weekend getaway to enjoy the changing leaves and celebrate Lauren's birthday earlier that month. On our first day, just before a hurricane rolled through the area, Matt proposed to Lauren at the Grove Park Inn, overlooking the city of Asheville and the Blue Ridge Mountains. The rest of the trip didn't go quite as planned, but escaping the hurricane strengthened our bond to each other and proved that we could endure difficult circumstances together.
            </p>
            
            <p className="leading-relaxed">
              In the spring of 2025, Matt received the exciting news that he had been accepted to graduate school in Copenhagen, Denmark. As we prepare for our wedding and the adventure of moving abroad, we're filled with gratitude for the journey that brought us here. We're excited to begin our lives together as a married couple and look forward to everything that comes next—new places, new experiences, and continuing to grow together, side by side.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStorySection;
