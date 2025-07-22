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
