interface RegistrySectionProps {
  isActive: boolean;
}

export const RegistrySection = ({ isActive }: RegistrySectionProps) => {
  if (!isActive) return null;

  return (
    <section id="registry" className="text-center my-14">
      <h2 className="text-3xl tracking-wider mb-8 font-['Cormorant_Garamond']">
        Registry
      </h2>
      
      <div className="max-w-2xl mx-auto mb-10 text-center">
        <p className="mb-12">
          <a 
            href="https://www.theknot.com/us/matt-mohandiss-and-lauren-davis-jul-2025/registry" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#6b7280] hover:text-[#4b5563] underline"
          >
            Click Here
          </a>
        </p>
      </div>
      
      <h2 className="text-3xl tracking-wider mb-8 font-['Cormorant_Garamond']">
        From Wedding Bells to New Beginnings
      </h2>
      
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <h3 className="mb-2.5 text-xl font-['Cormorant_Garamond'] text-center">
            A New Chapter
          </h3>
          <p className="mb-4">
            After we say "I do," we're embarking on an exciting new journey — moving to Copenhagen, Denmark!
          </p>
          <p>
            Matt will be starting a Masters of Computer Science program on September 1, 2025.
          </p>
        </div>
        
        <div className="mb-8">
          <h3 className="mb-2.5 text-xl font-['Cormorant_Garamond'] text-center">
            Why Copenhagen?
          </h3>
          <p>
            Copenhagen holds a special place in our hearts — not just for its beauty and charm, but because it's part of Matt's family history. 
            Matt's Dad grew up in Copenhagen, and his Farmor (grandmother) lived there for most of her life. 
            Moving to Copenhagen feels like a meaningful way to connect with Matt's heritage while having the chance to experience life abroad together.
          </p>
          <p className="mt-4">
            It's a dream come true, and we can't wait to share this next chapter with you!
          </p>
        </div>
        
        <div className="mb-8">
          <h3 className="mb-2.5 text-xl font-['Cormorant_Garamond'] text-center">
            How You Can Support Us
          </h3>
          <p>
            Since we'll be packing up and crossing the ocean, we're kindly asking for no physical gifts. 
            If you'd like to contribute to our new adventure, please visit 
            <a 
              href="https://www.theknot.com/us/matt-mohandiss-and-lauren-davis-jul-2025/registry" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#6b7280] hover:text-[#4b5563] ml-1 underline"
            >
              our registry!
            </a>
          </p>
        </div>
        
        <div className="mb-2">
          <h3 className="mb-2.5 text-xl font-['Cormorant_Garamond'] text-center">
            Stay In Touch
          </h3>
          <p className="mb-4">
            Our family and friends mean the world to us, and moving so far away only makes us appreciate you all even more. 
            We want nothing more than to share our Copenhagen adventures with you — the big moments, the little everyday joys, and everything in between.
          </p>
          <p>
            We'll be sharing updates once we're settled, and we hope you'll stay in touch too! 
            Send us a message, or even plan a visit - our door is always open.
          </p>
        </div>
      </div>
    </section>
  );
};

export default RegistrySection;
