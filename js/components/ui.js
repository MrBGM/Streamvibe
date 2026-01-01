// ============================================================================
// COMPOSANTS UI - StreamVibe
// ============================================================================

// ============================================================================
// TOAST NOTIFICATIONS
// ============================================================================

class Toast {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        // Créer le conteneur de toasts s'il n'existe pas
        if (!document.querySelector('.toast-container')) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        } else {
            this.container = document.querySelector('.toast-container');
        }
    }

    show(message, type = 'info', duration = 4000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || icons.info}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close">✕</button>
        `;

        this.container.appendChild(toast);

        // Fermer au clic
        toast.querySelector('.toast-close').addEventListener('click', () => {
            this.close(toast);
        });

        // Auto-fermeture
        setTimeout(() => {
            this.close(toast);
        }, duration);
    }

    close(toast) {
        toast.style.animation = 'slideOut 0.3s forwards';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    success(message) {
        this.show(message, 'success');
    }

    error(message) {
        this.show(message, 'error');
    }

    warning(message) {
        this.show(message, 'warning');
    }

    info(message) {
        this.show(message, 'info');
    }
}

// Instance globale
const toast = new Toast();

// Ajouter le style d'animation slideOut
const toastStyle = document.createElement('style');
toastStyle.textContent = `
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(toastStyle);

// ============================================================================
// MODAL
// ============================================================================

class Modal {
    constructor() {
        this.overlay = null;
        this.currentModal = null;
    }

    create(options = {}) {
        const {
            title = '',
            content = '',
            footer = '',
            size = 'medium',
            closeable = true,
            onClose = null
        } = options;

        // Créer l'overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'modal-overlay';

        // Créer la modal
        const modal = document.createElement('div');
        modal.className = `modal modal-${size}`;

        modal.innerHTML = `
            <div class="modal-header">
                <h3 class="modal-title">${title}</h3>
                ${closeable ? '<button class="modal-close">✕</button>' : ''}
            </div>
            <div class="modal-body">
                ${content}
            </div>
            ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
        `;

        this.overlay.appendChild(modal);
        document.body.appendChild(this.overlay);
        this.currentModal = modal;

        // Activer après un court délai pour l'animation
        requestAnimationFrame(() => {
            this.overlay.classList.add('active');
        });

        // Événements de fermeture
        if (closeable) {
            modal.querySelector('.modal-close').addEventListener('click', () => {
                this.close();
                if (onClose) onClose();
            });

            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) {
                    this.close();
                    if (onClose) onClose();
                }
            });

            document.addEventListener('keydown', this.handleEscape.bind(this));
        }

        return this;
    }

    handleEscape(e) {
        if (e.key === 'Escape' && this.overlay) {
            this.close();
        }
    }

    close() {
        if (this.overlay) {
            this.overlay.classList.remove('active');
            setTimeout(() => {
                if (this.overlay && this.overlay.parentNode) {
                    this.overlay.parentNode.removeChild(this.overlay);
                }
                this.overlay = null;
                this.currentModal = null;
            }, 300);
            document.removeEventListener('keydown', this.handleEscape);
        }
    }

    confirm(options = {}) {
        return new Promise((resolve) => {
            const {
                title = 'Confirmation',
                message = 'Êtes-vous sûr ?',
                confirmText = 'Confirmer',
                cancelText = 'Annuler',
                type = 'danger'
            } = options;

            this.create({
                title,
                content: `<p>${message}</p>`,
                footer: `
                    <button class="btn btn-secondary modal-cancel">${cancelText}</button>
                    <button class="btn btn-${type} modal-confirm">${confirmText}</button>
                `,
                onClose: () => resolve(false)
            });

            this.currentModal.querySelector('.modal-cancel').addEventListener('click', () => {
                this.close();
                resolve(false);
            });

            this.currentModal.querySelector('.modal-confirm').addEventListener('click', () => {
                this.close();
                resolve(true);
            });
        });
    }

    alert(options = {}) {
        return new Promise((resolve) => {
            const {
                title = 'Information',
                message = '',
                buttonText = 'OK'
            } = options;

            this.create({
                title,
                content: `<p>${message}</p>`,
                footer: `<button class="btn btn-primary modal-ok">${buttonText}</button>`,
                onClose: () => resolve()
            });

            this.currentModal.querySelector('.modal-ok').addEventListener('click', () => {
                this.close();
                resolve();
            });
        });
    }

    prompt(options = {}) {
        return new Promise((resolve) => {
            const {
                title = 'Saisie',
                placeholder = '',
                defaultValue = '',
                confirmText = 'OK',
                cancelText = 'Annuler'
            } = options;

            this.create({
                title,
                content: `
                    <div class="form-group">
                        <input type="text" class="form-control modal-input"
                               placeholder="${placeholder}" value="${defaultValue}">
                    </div>
                `,
                footer: `
                    <button class="btn btn-secondary modal-cancel">${cancelText}</button>
                    <button class="btn btn-primary modal-confirm">${confirmText}</button>
                `,
                onClose: () => resolve(null)
            });

            const input = this.currentModal.querySelector('.modal-input');
            input.focus();

            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.close();
                    resolve(input.value);
                }
            });

            this.currentModal.querySelector('.modal-cancel').addEventListener('click', () => {
                this.close();
                resolve(null);
            });

            this.currentModal.querySelector('.modal-confirm').addEventListener('click', () => {
                this.close();
                resolve(input.value);
            });
        });
    }
}

// Instance globale
const modal = new Modal();

// ============================================================================
// LOADING
// ============================================================================

class Loading {
    constructor() {
        this.overlay = null;
    }

    show(message = 'Chargement...') {
        if (this.overlay) return;

        this.overlay = document.createElement('div');
        this.overlay.className = 'loading-overlay';
        this.overlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <p class="loading-message">${message}</p>
            </div>
        `;
        document.body.appendChild(this.overlay);
    }

    hide() {
        if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
            this.overlay = null;
        }
    }

    async wrap(promise, message = 'Chargement...') {
        this.show(message);
        try {
            return await promise;
        } finally {
            this.hide();
        }
    }
}

// Instance globale
const loading = new Loading();

// Ajouter le style pour loading-content
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
    .loading-content {
        text-align: center;
    }
    .loading-message {
        margin-top: 1rem;
        color: var(--text-secondary);
    }
`;
document.head.appendChild(loadingStyle);

// ============================================================================
// DROPDOWN
// ============================================================================

function initDropdowns() {
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdown = toggle.closest('.dropdown');
            const menu = dropdown.querySelector('.dropdown-menu');

            // Fermer les autres dropdowns
            document.querySelectorAll('.dropdown-menu.active').forEach(m => {
                if (m !== menu) m.classList.remove('active');
            });

            menu.classList.toggle('active');
        });
    });

    // Fermer au clic extérieur
    document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown-menu.active').forEach(m => {
            m.classList.remove('active');
        });
    });
}

// ============================================================================
// TABS
// ============================================================================

function initTabs() {
    document.querySelectorAll('.tabs').forEach(tabContainer => {
        const tabs = tabContainer.querySelectorAll('.tab');
        const contents = tabContainer.parentElement.querySelectorAll('.tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.tab;

                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                contents.forEach(content => {
                    content.classList.toggle('active', content.id === target);
                });
            });
        });
    });
}

// ============================================================================
// SCROLL HEADER
// ============================================================================

function initScrollHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', throttle(() => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, 100));
}

// ============================================================================
// SEARCH BOX
// ============================================================================

function initSearchBox() {
    const searchBox = document.querySelector('.search-box');
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-box input');

    if (!searchBox || !searchBtn || !searchInput) return;

    searchBtn.addEventListener('click', () => {
        searchBox.classList.toggle('active');
        if (searchBox.classList.contains('active')) {
            searchInput.focus();
        }
    });

    searchInput.addEventListener('blur', () => {
        if (!searchInput.value) {
            searchBox.classList.remove('active');
        }
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && searchInput.value.trim()) {
            window.location.href = `/search.html?q=${encodeURIComponent(searchInput.value.trim())}`;
        }
    });
}

// ============================================================================
// CONTENT CARDS
// ============================================================================

function createContentCard(content, showProgress = false) {
    const posterUrl = getPosterUrl(content);
    const typeIcon = getTypeIcon(content.type);

    const card = document.createElement('div');
    card.className = 'content-card';
    card.dataset.id = content._id;

    card.innerHTML = `
        <div class="content-card-poster">
            ${posterUrl
                ? `<img src="${posterUrl}" alt="${content.titre}" loading="lazy">`
                : `<div class="placeholder">${typeIcon}</div>`
            }
            <div class="content-card-overlay">
                <div class="content-card-actions">
                    <button class="btn btn-icon btn-primary play-btn" title="Lecture">▶</button>
                    <button class="btn btn-icon btn-secondary watchlist-btn" title="Ma Liste">+</button>
                </div>
            </div>
        </div>
        <div class="content-card-info">
            <h4 class="content-card-title">${content.titre}</h4>
            <div class="content-card-meta">
                <span>${content.annee_sortie || ''}</span>
                ${content.duree_minutes ? `<span>${formatDuration(content.duree_minutes)}</span>` : ''}
                ${content.note_moyenne ? `<span class="rating">★ ${content.note_moyenne.toFixed(1)}</span>` : ''}
            </div>
            ${showProgress && content.pourcentage_progression ? `
                <div class="content-progress">
                    <div class="content-progress-bar" style="width: ${content.pourcentage_progression}%"></div>
                </div>
            ` : ''}
        </div>
    `;

    // Clic sur la carte -> page détail
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.play-btn') && !e.target.closest('.watchlist-btn')) {
            window.location.href = `/detail.html?id=${content._id}`;
        }
    });

    // Bouton lecture
    card.querySelector('.play-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        window.location.href = `/player.html?id=${content._id}`;
    });

    // Bouton watchlist
    card.querySelector('.watchlist-btn').addEventListener('click', async (e) => {
        e.stopPropagation();
        await toggleWatchlist(content._id, e.target);
    });

    return card;
}

// Fonction pour basculer watchlist
async function toggleWatchlist(contentId, button) {
    const profile = AuthService.getCurrentProfile();
    if (!profile) {
        toast.warning('Veuillez sélectionner un profil');
        window.location.href = '/profiles.html';
        return;
    }

    try {
        const checkResponse = await WatchlistService.check(profile._id, contentId);

        if (checkResponse.data && checkResponse.data.inWatchlist) {
            await WatchlistService.remove(profile._id, contentId);
            button.textContent = '+';
            button.title = 'Ajouter à Ma Liste';
            toast.success('Retiré de Ma Liste');
        } else {
            await WatchlistService.add(profile._id, contentId);
            button.textContent = '✓';
            button.title = 'Retirer de Ma Liste';
            toast.success('Ajouté à Ma Liste');
        }
    } catch (error) {
        toast.error('Erreur lors de la mise à jour de Ma Liste');
    }
}

// ============================================================================
// CONTENT ROWS
// ============================================================================

function createContentRow(title, contents, showProgress = false) {
    const section = document.createElement('section');
    section.className = 'content-section';

    section.innerHTML = `
        <div class="section-header">
            <h2 class="section-title">${title}</h2>
        </div>
        <div class="content-row"></div>
    `;

    const row = section.querySelector('.content-row');
    contents.forEach(content => {
        row.appendChild(createContentCard(content, showProgress));
    });

    return section;
}

// ============================================================================
// STAR RATING
// ============================================================================

function createStarRating(currentRating = 0, onRate = null) {
    const container = document.createElement('div');
    container.className = 'star-rating';

    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.className = `star ${i <= currentRating ? 'active' : ''}`;
        star.textContent = '★';
        star.dataset.value = i;

        if (onRate) {
            star.addEventListener('click', () => onRate(i));
            star.addEventListener('mouseenter', () => {
                container.querySelectorAll('.star').forEach((s, index) => {
                    s.classList.toggle('active', index < i);
                });
            });
        }

        container.appendChild(star);
    }

    if (onRate) {
        container.addEventListener('mouseleave', () => {
            container.querySelectorAll('.star').forEach((s, index) => {
                s.classList.toggle('active', index < currentRating);
            });
        });
    }

    return container;
}

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    initDropdowns();
    initTabs();
    initScrollHeader();
    initSearchBox();
});
