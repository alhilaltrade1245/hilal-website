const text = "HILAL AHMAD AFRIDI";
let index = 0;

function typeEffect() {
    if (index < text.length) {
        document.querySelector(".hero h1 span").innerHTML += text.charAt(index);
        index++;
        setTimeout(typeEffect, 150); // Typing speed
    }
}

// First erase the name from HTML so it types by itself
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".hero h1 span").innerHTML = "";
    typeEffect();

    // Hamburger Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });

    // Mouse-tracking radial gradient for hero section
    const heroSection = document.querySelector('.hero');
    
    if (heroSection) {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            
            heroSection.style.setProperty('--mouse-x', `${x}%`);
            heroSection.style.setProperty('--mouse-y', `${y}%`);
        });

        // Set initial gradient position to center
        heroSection.style.setProperty('--mouse-x', '50%');
        heroSection.style.setProperty('--mouse-y', '50%');

        // Slow animated movement when not moving mouse (fallback animation)
        let animationTime = 0;
        setInterval(() => {
            animationTime += 0.01;
            const x = 50 + 30 * Math.sin(animationTime);
            const y = 50 + 30 * Math.cos(animationTime * 0.7);
            
            // Only update if mouse hasn't moved recently
            if (Date.now() - (window.lastMouseMove || 0) > 5000) {
                heroSection.style.setProperty('--mouse-x', `${x}%`);
                heroSection.style.setProperty('--mouse-y', `${y}%`);
            }
        }, 50);

        // Track last mouse movement
        document.addEventListener('mousemove', () => {
            window.lastMouseMove = Date.now();
        });
    }

    // Card Tilt Effect - Mouse tracking 3D transform
    const cards = document.querySelectorAll('[data-tilt]');
    
    cards.forEach(card => {
        let rect = card.getBoundingClientRect();
        
        card.addEventListener('mousemove', (e) => {
            rect = card.getBoundingClientRect();
            
            // Get mouse position relative to card center
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate tilt angles (max 15 degrees)
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * 15;
            const rotateY = ((centerX - x) / centerX) * 15;
            
            // Apply 3D transform with smooth spring-like effect
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        });
        
        // Reset on mouse leave
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });

    // Initialize testimonials slider
    initTestimonialsSlider();
});

window.addEventListener('scroll', () => {
    // Update scroll progress bar
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (progressBar) {
        progressBar.style.width = scrollPercent + '%';
    }

    // Trigger staggered animations for gallery cards when gallery comes into view
    const gallery = document.querySelector('.gallery');
    if (gallery) {
        const galleryTop = gallery.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        // If gallery is in view, trigger staggered animations
        if (galleryTop < windowHeight - 100) {
            const galleryCards = gallery.querySelectorAll('.card');
            galleryCards.forEach((card, index) => {
                // Add animate class to trigger the staggered animation
                if (!card.classList.contains('animate')) {
                    card.classList.add('animate');
                }
            });
        }
    }

    // Reveal other elements
    const reveals = document.querySelectorAll('.about, .contact');
    for (let i = 0; i < reveals.length; i++) {
        let windowHeight = window.innerHeight;
        let revealTop = reveals[i].getBoundingClientRect().top;
        if (revealTop < windowHeight - 150) {
            reveals[i].classList.add('active');
        }
    }
});

// Testimonials Slider
function initTestimonialsSlider() {
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('sliderDots');
    let current = 0;

    if (!cards.length) return;

    // Create dots
    dotsContainer.innerHTML = '';
    cards.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = 'slider-dot' + (idx === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Go to testimonial ' + (idx + 1));
        dot.addEventListener('click', () => showSlide(idx));
        dotsContainer.appendChild(dot);
    });
    const dots = dotsContainer.querySelectorAll('.slider-dot');

    function showSlide(idx) {
        cards.forEach((card, i) => {
            card.style.display = i === idx ? 'flex' : 'none';
            dots[i].classList.toggle('active', i === idx);
        });
        current = idx;
    }

    prevBtn.addEventListener('click', () => {
        showSlide((current - 1 + cards.length) % cards.length);
    });
    nextBtn.addEventListener('click', () => {
        showSlide((current + 1) % cards.length);
    });

    // Optional: auto-slide
    // setInterval(() => nextBtn.click(), 8000);
}

// Lightbox Logic
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.close-btn');

// Open lightbox on card overlay (VIEW IMAGE button) click
const cardOverlays = document.querySelectorAll('.card-overlay');
cardOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = overlay.closest('.card');
        const img = card.querySelector('img');
        if (img) {
            lightbox.classList.add('active');
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
        }
    });
});

// Also allow clicking directly on card images
const cardImages = document.querySelectorAll('.card img');
cardImages.forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
        lightbox.classList.add('active');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
    });
});

// Close lightbox on close button click
closeBtn.addEventListener('click', () => {
    lightbox.classList.remove('active');
});

// Close lightbox when clicking outside the image
lightbox.addEventListener('click', (e) => {
    if (e.target !== lightboxImg && e.target !== closeBtn) {
        lightbox.classList.remove('active');
    }
});

// Close lightbox with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        lightbox.classList.remove('active');
    }
});
