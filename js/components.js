// Système de composants modulaires pour DevOpsia School

/**
 * Charge et insère les composants HTML (header, footer)
 */
class ComponentLoader {
    constructor() {
        this.components = {
            header: 'components/header.html',
            footer: 'components/footer.html'
        };
    }

    /**
     * Initialise le chargement de tous les composants
     */
    async init() {
        await this.loadAllComponents();
        this.setActiveNavigation();
        this.initNavigation();
    }

    /**
     * Charge tous les composants définis
     */
    async loadAllComponents() {
        const promises = Object.entries(this.components).map(([name, path]) => 
            this.loadComponent(name, path)
        );
        
        await Promise.all(promises);
    }

    /**
     * Charge un composant spécifique
     * @param {string} name - Nom du composant
     * @param {string} path - Chemin vers le fichier HTML
     */
    async loadComponent(name, path) {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`Erreur de chargement du composant ${name}: ${response.status}`);
            }
            
            const html = await response.text();
            const placeholder = document.getElementById(`${name}-placeholder`);
            
            if (placeholder) {
                placeholder.outerHTML = html;
            } else {
                console.warn(`Placeholder #${name}-placeholder non trouvé`);
            }
        } catch (error) {
            console.error(`Erreur lors du chargement du composant ${name}:`, error);
            // Fallback: garder le placeholder ou afficher un message d'erreur
        }
    }

    /**
     * Définit la navigation active selon la page courante
     */
    setActiveNavigation() {
        // Attendre que le header soit chargé
        setTimeout(() => {
            const currentPage = this.getCurrentPageName();
            const navLinks = document.querySelectorAll('.nav-links a');
            
            navLinks.forEach(link => {
                const linkPage = link.getAttribute('data-page');
                if (linkPage === currentPage) {
                    link.classList.add('active');
                }
            });
        }, 100);
    }

    /**
     * Récupère le nom de la page courante
     * @returns {string} Nom de la page
     */
    getCurrentPageName() {
        const path = window.location.pathname;
        const page = path.split('/').pop().replace('.html', '');
        
        // Correspondance nom de fichier -> data-page
        const pageMap = {
            'index': 'formations', // Page d'accueil -> formations par défaut
            '': 'formations',
            'qui-sommes-nous': 'qui-sommes-nous',
            'tarifs': 'tarifs'
        };
        
        return pageMap[page] || page;
    }

    /**
     * Initialise les événements de navigation
     */
    initNavigation() {
        // Attendre que le header soit chargé
        setTimeout(() => {
            // Smooth scrolling pour les ancres
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
        }, 100);
    }
}

/**
 * Version simplifiée de fallback si fetch n'est pas disponible
 */
function fallbackComponentLoader() {
    // Cette fonction peut être utilisée comme fallback
    // pour les navigateurs qui ne supportent pas fetch
    console.warn('ComponentLoader utilise le mode fallback');
}

// Auto-initialisation quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const loader = new ComponentLoader();
        loader.init();
    });
} else {
    const loader = new ComponentLoader();
    loader.init();
}

// Export pour utilisation manuelle si nécessaire
window.ComponentLoader = ComponentLoader;

/**
 * Gestion de la navigation responsive
 */
class ResponsiveNav {
    constructor() {
        this.menuToggle = null;
        this.navLinks = null;
        this.body = document.body;
        
        // Attendre que le header soit chargé
        setTimeout(() => this.init(), 200);
    }

    init() {
        this.menuToggle = document.querySelector('.menu-toggle');
        this.navLinks = document.querySelector('.nav-links');
        
        if (this.menuToggle && this.navLinks) {
            this.menuToggle.addEventListener('click', () => this.toggleMenu());
            
            // Fermer le menu quand on clique sur un lien
            this.navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => this.closeMenu());
            });

            // Fermer le menu avec Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.navLinks.classList.contains('active')) {
                    this.closeMenu();
                }
            });

            // Fermer le menu si on redimensionne vers desktop
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768) {
                    this.closeMenu();
                }
            });
        }
    }

    toggleMenu() {
        if (!this.navLinks) return;
        
        const isActive = this.navLinks.classList.contains('active');
        
        if (isActive) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.navLinks.classList.add('active');
        this.menuToggle.classList.add('active');
        this.menuToggle.setAttribute('aria-expanded', 'true');
        this.body.style.overflow = 'hidden'; // Empêcher le scroll
    }

    closeMenu() {
        this.navLinks.classList.remove('active');
        this.menuToggle.classList.remove('active');
        this.menuToggle.setAttribute('aria-expanded', 'false');
        this.body.style.overflow = ''; // Restaurer le scroll
    }
}

// Modifier la fin de votre fichier component.js existant
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const loader = new ComponentLoader();
        loader.init();
        new ResponsiveNav(); // Ajouter cette ligne
    });
} else {
    const loader = new ComponentLoader();
    loader.init();
    new ResponsiveNav(); // Ajouter cette ligne
}

// Export pour utilisation manuelle si nécessaire
window.ComponentLoader = ComponentLoader;
window.ResponsiveNav = ResponsiveNav; // Ajouter cette ligne
