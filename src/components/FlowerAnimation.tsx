import { useEffect, useRef, useState } from 'react';

interface FlowerAnimationProps {
  scale?: number;
  duration?: number;
}

const FlowerAnimation = ({ 
  scale = 1,
  duration = 3000 
}: FlowerAnimationProps) => {
  // Hardcoded natural dimensions of the image
  const naturalWidth = 1376;
  const naturalHeight = 732;
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = naturalWidth;
    canvas.height = naturalHeight;
    
    // Create offscreen canvases for processing
    const flowerCanvas = document.createElement('canvas');
    const mapCanvas = document.createElement('canvas');
    flowerCanvas.width = naturalWidth;
    flowerCanvas.height = naturalHeight;
    mapCanvas.width = naturalWidth;
    mapCanvas.height = naturalHeight;
    
    const flowerCtx = flowerCanvas.getContext('2d');
    const mapCtx = mapCanvas.getContext('2d');
    if (!flowerCtx || !mapCtx) return;
    
    // Load images
    const flowerImage = new Image();
    const mapImage = new Image();
    
    let pixelsToReveal: { x: number; y: number; delay: number }[] = [];
    let animationStartTime = 0;
    let animationFrameId = 0;
    
    // Function to process pixel data and create animation map
    const processImages = () => {
      // Draw images to offscreen canvases
      flowerCtx.drawImage(flowerImage, 0, 0, naturalWidth, naturalHeight);
      mapCtx.drawImage(mapImage, 0, 0, naturalWidth, naturalHeight);
      
      // Get image data
      const flowerData = flowerCtx.getImageData(0, 0, naturalWidth, naturalHeight);
      const mapData = mapCtx.getImageData(0, 0, naturalWidth, naturalHeight);
      
      // Create reveal sequence based on red values
      pixelsToReveal = [];
      
      // Group pixels by their red value (0-255)
      const redGroups: { x: number; y: number }[][] = Array.from({ length: 256 }, () => []);
      
      for (let y = 0; y < naturalHeight; y++) {
        for (let x = 0; x < naturalWidth; x++) {
          const index = (y * naturalWidth + x) * 4;
          // Only include pixels that aren't fully transparent in the original image
          if (flowerData.data[index + 3] > 0) {
            const redValue = mapData.data[index];
            redGroups[redValue].push({ x, y });
          }
        }
      }
      
      // Convert to animation sequence with calculated delays
      for (let i = 0; i < redGroups.length; i++) {
        const pixelsWithThisRed = redGroups[i];
        // Shuffle pixels with the same red value for a more organic reveal
        pixelsWithThisRed.sort(() => Math.random() - 0.5);
        
        for (const pixel of pixelsWithThisRed) {
          // Map red values to delays
          // Higher red value = later reveal time
          // Normalize to the animation duration
          const delay = (i / 255) * duration;
          pixelsToReveal.push({ ...pixel, delay });
        }
      }
      
      // Start animation
      animationStartTime = performance.now();
      animate();
    };
    
    // Animation function
    const animate = () => {
      const currentTime = performance.now();
      const elapsed = currentTime - animationStartTime;
      
      // Clear canvas
      ctx.clearRect(0, 0, naturalWidth, naturalHeight);
      
      // Create a temporary canvas for this frame
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = naturalWidth;
      tempCanvas.height = naturalHeight;
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;
      
      // Draw the flower with pixels revealed based on elapsed time
      const flowerData = flowerCtx.getImageData(0, 0, naturalWidth, naturalHeight);
      const frameData = tempCtx.createImageData(naturalWidth, naturalHeight);
      
      // Copy the flower image data
      for (let i = 0; i < frameData.data.length; i += 4) {
        frameData.data[i] = flowerData.data[i];       // R
        frameData.data[i + 1] = flowerData.data[i + 1]; // G
        frameData.data[i + 2] = flowerData.data[i + 2]; // B
        frameData.data[i + 3] = 0;                    // A (start transparent)
      }
      
      // Reveal pixels that should be visible at this time
      for (const pixel of pixelsToReveal) {
        if (elapsed >= pixel.delay) {
          const index = (pixel.y * naturalWidth + pixel.x) * 4;
          frameData.data[index + 3] = flowerData.data[index + 3]; // Reveal this pixel
        }
      }
      
      // Draw this frame
      tempCtx.putImageData(frameData, 0, 0);
      ctx.drawImage(tempCanvas, 0, 0);
      
      // Continue animation if not complete
      if (elapsed < duration) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    
    // Load images and start animation when loaded
    let imagesLoaded = 0;
    const onImageLoad = () => {
      imagesLoaded++;
      if (imagesLoaded === 2) {
        setIsLoading(false);
        processImages();
      }
    };
    
    flowerImage.onload = onImageLoad;
    mapImage.onload = onImageLoad;
    
    flowerImage.src = '/assets/flower.png';
    mapImage.src = '/assets/flower_map.png';
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [duration]);
  
  return (
    <div className="flex justify-center items-center relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          {/* Empty box shown while animation is loading */}
        </div>
      )}
      <canvas 
        ref={canvasRef} 
        className="max-w-full h-auto"
        style={{ width: `${naturalWidth * scale}px`, height: `${naturalHeight * scale}px` }}
      />
    </div>
  );
};

export default FlowerAnimation;
