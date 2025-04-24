// flower.js - Animation reveal logic for the flower image using flower_map.png for timing
document.addEventListener('DOMContentLoaded', function() {
    // Find the flower image and set up animation
    const flowerImg = document.querySelector('.header-flowers');
    if (flowerImg) {
        // Start animation after a short delay to ensure image is loaded
        setTimeout(() => {
            startFlowerAnimation(flowerImg);
        }, 500);
    }
});

// Start the animation process
function startFlowerAnimation(originalImg) {
    if (!originalImg) return;
    
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.className = originalImg.className;
    canvas.width = originalImg.naturalWidth || originalImg.width || 300;
    canvas.height = originalImg.naturalHeight || originalImg.height || 160;
    canvas.id = 'flower-canvas';
    
    // Apply the same styling but make sure canvas is visible
    canvas.style.width = originalImg.clientWidth + 'px';
    canvas.style.height = originalImg.clientHeight + 'px';
    canvas.style.opacity = '1'; // Ensure canvas is visible even though image is hidden
    
    // Hide original image and insert canvas in its place
    originalImg.style.display = 'none';
    originalImg.parentNode.insertBefore(canvas, originalImg);
    
    // Load the map image and start animation
    loadImagesAndAnimate(canvas, originalImg);
}

// Load images and start animation
function loadImagesAndAnimate(canvas, originalImg) {
    let flowerImg = originalImg;
    const mapImg = new Image();
    
    // When map image loads, start animation
    mapImg.onload = function() {
        animateFlower(canvas, flowerImg, mapImg);
    };
    
    mapImg.onerror = function() {
        // Create a fallback map with a gradient if the map image fails to load
        const fallbackCanvas = document.createElement('canvas');
        fallbackCanvas.width = flowerImg.naturalWidth || 300;
        fallbackCanvas.height = flowerImg.naturalHeight || 160;
        
        const ctx = fallbackCanvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, fallbackCanvas.width, fallbackCanvas.height);
        gradient.addColorStop(0, 'black');
        gradient.addColorStop(1, 'white');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, fallbackCanvas.width, fallbackCanvas.height);
        
        const fallbackImg = new Image();
        fallbackImg.onload = function() {
            animateFlower(canvas, flowerImg, fallbackImg);
        };
        fallbackImg.src = fallbackCanvas.toDataURL();
    };
    
    // Try to use the preloaded map image element first
    const mapImgElement = document.getElementById('flower-map-image');
    if (mapImgElement && mapImgElement.complete && mapImgElement.naturalWidth > 0) {
        mapImg.src = mapImgElement.src;
    } else {
        mapImg.src = 'wedding/flower_map.png';
    }
}

// Main animation function
function animateFlower(canvas, flowerImg, mapImg) {
    const ctx = canvas.getContext('2d', { alpha: true });
    const duration = 4000; // Animation duration in ms
    const startTime = performance.now();
    
    // Create offscreen canvas for the map
    const mapCanvas = document.createElement('canvas');
    mapCanvas.width = mapImg.width;
    mapCanvas.height = mapImg.height;
    const mapCtx = mapCanvas.getContext('2d');
    mapCtx.drawImage(mapImg, 0, 0);
    
    // Try to get map data
    let mapData;
    try {
        mapData = mapCtx.getImageData(0, 0, mapCanvas.width, mapCanvas.height).data;
    } catch (err) {
        // Fallback to simple animation if can't access map data
        simpleRevealAnimation(canvas, flowerImg, duration);
        return;
    }
    
    // Create a temporary canvas for pixel manipulation
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Draw the flower image to temp canvas
    tempCtx.drawImage(flowerImg, 0, 0, canvas.width, canvas.height);
    
    // Get image data for manipulation
    let imageData;
    try {
        imageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
    } catch (err) {
        // Fallback if can't get image data
        simpleRevealAnimation(canvas, flowerImg, duration);
        return;
    }
    
    // Create a copy of the original image data
    const originalData = new Uint8ClampedArray(imageData.data);
    
    // Animation frame loop
    function updateFrame(timestamp) {
        // Calculate progress (0 to 1)
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        // Use raw linear progress
        const linearProgress = progress;
            
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Create a new ImageData object for this frame
        const frameData = new ImageData(
            new Uint8ClampedArray(originalData), 
            canvas.width, 
            canvas.height
        );
        const data = frameData.data;
        
        // Process each pixel individually
        for (let i = 0; i < data.length; i += 4) {
            // Skip if pixel is already transparent
            if (originalData[i + 3] === 0) continue;
            
            // Get x,y coordinates from the pixel index
            const pixelIndex = i / 4;
            const x = pixelIndex % canvas.width;
            const y = Math.floor(pixelIndex / canvas.width);
            
            // Get map value at this position
            const mapX = Math.floor(x * mapImg.width / canvas.width);
            const mapY = Math.floor(y * mapImg.height / canvas.height);
            const mapIndex = (mapY * mapImg.width + mapX) * 4;
            
            // Use red channel from map
            const red = mapData[mapIndex];
            const threshold = red / 255; // 0 to 1
            
            // If current progress is less than this pixel's threshold, make it transparent
            if (linearProgress < threshold) {
                data[i + 3] = 0; // Set alpha to 0 (transparent)
            } else if (linearProgress < threshold + 0.05) {
                // Add a gentle fade-in effect for pixels near the threshold
                const fadeAmount = (linearProgress - threshold) / 0.05;
                data[i + 3] = Math.floor(originalData[i + 3] * fadeAmount);
            }
        }
        
        // Put the modified pixel data back to the canvas
        ctx.putImageData(frameData, 0, 0);
        
        // Continue animation if not finished
        if (progress < 1) {
            requestAnimationFrame(updateFrame);
        } else {
            // Draw final image
            ctx.drawImage(flowerImg, 0, 0, canvas.width, canvas.height);
            // Ensure canvas is fully visible at the end
            canvas.style.opacity = '1';
        }
    }
    
    // Start animation
    requestAnimationFrame(updateFrame);
}

// Fallback simple reveal animation
function simpleRevealAnimation(canvas, flowerImg, duration) {
    const ctx = canvas.getContext('2d');
    const startTime = performance.now();
    
    function updateFrame(timestamp) {
        // Calculate progress (0 to 1)
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Create a gradient reveal from left to right
        const width = Math.floor(canvas.width * progress);
        
        // Draw visible portion of the image
        ctx.drawImage(flowerImg, 
            0, 0, width, canvas.height,  // Source rect
            0, 0, width, canvas.height); // Dest rect
        
        // Continue animation if not finished
        if (progress < 1) {
            requestAnimationFrame(updateFrame);
        } else {
            ctx.drawImage(flowerImg, 0, 0, canvas.width, canvas.height);
            // Ensure canvas is fully visible at the end
            canvas.style.opacity = '1';
        }
    }
    
    // Start animation
    requestAnimationFrame(updateFrame);
}
