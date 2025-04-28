interface PhotosSectionProps {
  isActive: boolean;
}

export const PhotosSection = ({ isActive }: PhotosSectionProps) => {
  if (!isActive) return null;
  
  return (
    <section id="photos" className="text-center my-14">
      <h2 className="text-3xl tracking-wider mb-8 font-['Cormorant_Garamond']">
        PHOTOS
      </h2>
      
      <div className="w-full max-w-4xl mx-auto">
        <iframe
          src="https://photos.app.goo.gl/h8N3PrrBF2B3BiSX6?output=embed"
          width="100%" 
          height="600"
          style={{ border: 'none' }}
          allowFullScreen
          title="Wedding Photos"
        />
      </div>
    </section>
  );
};

export default PhotosSection;
