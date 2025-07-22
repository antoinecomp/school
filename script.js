// DevOpsia School - Scripts principaux

document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling pour les liens de navigation
    initSmoothScrolling();
    
    // Effet de scroll sur le header
    initHeaderScrollEffect();
    
    // Animation des éléments au scroll
    initScrollAnimations();
    
});

/**
 * Initialise le smooth scrolling pour tous les liens d'ancrage
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Gère l'effet de transparence du header au scroll
 */
function initHeaderScrollEffect() {
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });
}

/**
 * Initialise les animations d'apparition au scroll
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateElement(entry.target);
            }
        });
    }, observerOptions);

    // Observer les cartes de fonctionnalités
    observeFeatureCards(observer);
    
    // Observer le programme principal
    observeMainProgram(observer);
}

/**
 * Anime un élément lors de son apparition
 */
function animateElement(element) {
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
}

/**
 * Met en observation les cartes de fonctionnalités
 */
function observeFeatureCards(observer) {
    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

/**
 * Met en observation le programme principal
 */
function observeMainProgram(observer) {
    const mainProgram = document.querySelector('.main-program');
    if (mainProgram) {
        mainProgram.style.opacity = '0';
        mainProgram.style.transform = 'translateY(50px)';
        mainProgram.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(mainProgram);
    }
}

/**
 * Utilitaire pour débounce les événements
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
