// ============================================
// SLIDE ENGINE
// ============================================

const slides = document.querySelectorAll('.slide');
const navContainer = document.getElementById('slideNav');
const totalSlides = slides.length;
let currentSlide = 0;

// Build navigation dots
slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('nav-dot');
    if (i === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    navContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.nav-dot');

// ============================================
// NAVIGATION
// ============================================

function goToSlide(index) {
    if (index < 0 || index >= totalSlides || index === currentSlide) return;

    // Deactivate current
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    resetAnimations(slides[currentSlide]);

    // Activate new
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    triggerAnimations(slides[currentSlide]);
}

function nextSlide() {
    if (currentSlide < totalSlides - 1) goToSlide(currentSlide + 1);
}

function prevSlide() {
    if (currentSlide > 0) goToSlide(currentSlide - 1);
}

// ============================================
// ANIMATIONS
// ============================================

function triggerAnimations(slide) {
    const animElements = slide.querySelectorAll('.animate');
    animElements.forEach(el => {
        const delay = parseInt(el.dataset.delay || '0', 10);
        setTimeout(() => {
            el.classList.add('visible');
        }, 150 + delay * 150); // 150ms base + 150ms per step
    });
}

function resetAnimations(slide) {
    const animElements = slide.querySelectorAll('.animate');
    animElements.forEach(el => {
        el.classList.remove('visible');
    });
}

// Trigger animations on first slide
triggerAnimations(slides[0]);

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowRight':
        case ' ':
        case 'PageDown':
            e.preventDefault();
            nextSlide();
            break;
        case 'ArrowLeft':
        case 'PageUp':
            e.preventDefault();
            prevSlide();
            break;
        case 'Home':
            e.preventDefault();
            goToSlide(0);
            break;
        case 'End':
            e.preventDefault();
            goToSlide(totalSlides - 1);
            break;
    }
});

// Touch support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
    }
}, { passive: true });
