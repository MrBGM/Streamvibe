// ============================================================================
// UTILITAIRES - StreamVibe
// ============================================================================

// Formater la durée (minutes -> hh:mm)
function formatDuration(minutes) {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
        return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
}

// Formater le temps (secondes -> mm:ss ou hh:mm:ss)
function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hrs > 0) {
        return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Formater la date
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Formater la date courte
function formatDateShort(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Formater le nombre
function formatNumber(num) {
    if (!num) return '0';
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Formater le prix FCFA
function formatPrice(amount) {
    if (!amount) return '0 FCFA';
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}

// Tronquer le texte
function truncateText(text, maxLength = 150) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Obtenir les initiales
function getInitials(name) {
    if (!name) return '?';
    return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
}

// Générer une couleur basée sur une chaîne
function stringToColor(str) {
    if (!str) return '#e50914';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
        '#e50914', '#4285f4', '#34a853', '#fbbc04',
        '#9c27b0', '#ff5722', '#009688', '#3f51b5'
    ];
    return colors[Math.abs(hash) % colors.length];
}

// Debounce
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

// Throttle
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Obtenir le paramètre URL
function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Vérifier si mobile
function isMobile() {
    return window.innerWidth <= 768;
}

// Scroll vers élément
function scrollToElement(selector, offset = 0) {
    const element = document.querySelector(selector);
    if (element) {
        const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    }
}

// Générer un ID unique
function generateId() {
    return '_' + Math.random().toString(36).substring(2, 11);
}

// Classer les contenus par type
function groupByType(contents) {
    return contents.reduce((groups, content) => {
        const type = content.type || 'autre';
        if (!groups[type]) {
            groups[type] = [];
        }
        groups[type].push(content);
        return groups;
    }, {});
}

// Obtenir l'URL de l'image poster
function getPosterUrl(content) {
    if (content.affiche_url) {
        return content.affiche_url;
    }
    // Placeholder par défaut
    return null;
}

// Obtenir l'URL de la vidéo
function getVideoUrl(content) {
    if (content.video_url) {
        // Si c'est un chemin relatif, ajouter le base URL
        if (content.video_url.startsWith('/')) {
            return API_CONFIG.BASE_URL + content.video_url;
        }
        return content.video_url;
    }
    return null;
}

// Avatar icons
const AVATAR_ICONS = {
    'avatar_1': '👤',
    'avatar_2': '👩',
    'avatar_3': '🎮',
    'avatar_4': '🎬',
    'avatar_5': '🌟',
    'avatar_6': '🦊',
    'avatar_7': '🐱',
    'avatar_8': '🐶'
};

function getAvatarIcon(avatarId) {
    return AVATAR_ICONS[avatarId] || '👤';
}

// Type de contenu icons
const TYPE_ICONS = {
    'film': '🎬',
    'serie': '📺',
    'documentaire': '📚'
};

function getTypeIcon(type) {
    return TYPE_ICONS[type] || '🎬';
}

// Classification age badges
const AGE_BADGES = {
    'G': { text: 'Tout public', class: 'badge-success' },
    'PG': { text: 'PG', class: 'badge-info' },
    '13+': { text: '13+', class: 'badge-warning' },
    '16+': { text: '16+', class: 'badge-warning' },
    '18+': { text: '18+', class: 'badge-danger' }
};

function getAgeBadge(classification) {
    return AGE_BADGES[classification] || { text: classification, class: 'badge-info' };
}

// Stocker les données localement avec expiration
function setWithExpiry(key, value, ttl) {
    const now = new Date();
    const item = {
        value: value,
        expiry: now.getTime() + ttl
    };
    localStorage.setItem(key, JSON.stringify(item));
}

function getWithExpiry(key) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    const item = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
        localStorage.removeItem(key);
        return null;
    }
    return item.value;
}
