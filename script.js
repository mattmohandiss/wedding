document.addEventListener('DOMContentLoaded', function() {
    // Update countdown
    updateCountdown();
    
    // Set up navigation
    setupNavigation();
    
    // Make venue addresses clickable
    makeAddressesClickable();
});

// Calculate and update the countdown
function updateCountdown() {
    const weddingDate = new Date('July 20, 2025 00:00:00').getTime();
    
    // Update the countdown immediately
    const now = new Date().getTime();
    const distance = weddingDate - now;
    
    // Time calculations for days
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    
    // Display the result
    document.getElementById('countdown').textContent = days;
    
    // Update countdown every day
    setInterval(function() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        document.getElementById('countdown').textContent = days;
    }, 86400000); // Update every 24 hours
}

// Set up navigation tab functionality
function setupNavigation() {
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Hide all sections except home, ceremony, and reception
            const sections = document.querySelectorAll('section');
            sections.forEach(section => {
                if (section.id !== 'ceremony' && section.id !== 'reception') {
                    section.style.display = 'none';
                }
            });
            
            // Show the target section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetId === 'home') {
                // Show home sections (which include ceremony and reception)
                document.getElementById('home').style.display = 'block';
                document.getElementById('ceremony').style.display = 'block';
                document.getElementById('reception').style.display = 'block';
            } else {
                // Hide home related sections
                document.getElementById('home').style.display = 'none';
                document.getElementById('ceremony').style.display = 'none';
                document.getElementById('reception').style.display = 'none';
                
                // Show only the clicked section
                targetSection.style.display = 'block';
            }
        });
    });
    
// Trigger click on Home by default
    document.querySelector('nav ul li a[href="#home"]').click();
}

// Make venue addresses clickable with platform-specific map links
function makeAddressesClickable() {
    // Detect if user is on iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    // Get all venue address elements
    const addressElements = document.querySelectorAll('.venue-address');
    
    addressElements.forEach(addressElement => {
        const address = addressElement.textContent;
        const encodedAddress = encodeURIComponent(address);
        
        // Create map URL based on platform
        let mapUrl;
        if (isIOS) {
            // Apple Maps URL scheme for iOS
            mapUrl = `maps://?q=${encodedAddress}`;
        } else {
            // Google Maps URL for Android and other platforms
            mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
        }
        
        // Create link element
        const linkElement = document.createElement('a');
        linkElement.href = mapUrl;
        linkElement.textContent = address;
        linkElement.className = 'map-link';
        linkElement.setAttribute('target', '_blank'); // Open in a new tab/app
        
        // Replace the text node with the link
        addressElement.textContent = '';
        addressElement.appendChild(linkElement);
    });
}
