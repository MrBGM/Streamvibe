// ============================================================================
// CONFIGURATION API - StreamVibe
// ============================================================================

const API_CONFIG = {
    BASE_URL: 'http://localhost:5000',
    API_URL: 'http://localhost:5000/api',
    ADMIN_API_URL: 'http://localhost:5000/api/admin',
    VIDEOS_URL: 'http://localhost:5000/videos',

    // Endpoints publics
    ENDPOINTS: {
        // Auth utilisateur
        AUTH: {
            LOGIN: '/auth/login',
            REGISTER: '/auth/register',
            ME: '/auth/me'
        },
        // Contenus
        CONTENTS: {
            LIST: '/contents',
            TRENDING: '/contents/trending',
            NEW: '/contents/new',
            SEARCH: '/contents/search',
            CATEGORIES: '/contents/categories',
            DETAIL: (id) => `/contents/${id}`
        },
        // Profils
        PROFILES: {
            LIST: '/profiles',
            CREATE: '/profiles',
            UPDATE: (id) => `/profiles/${id}`,
            DELETE: (id) => `/profiles/${id}`,
            SELECT: (id) => `/profiles/${id}/select`
        },
        // Historique
        HISTORY: {
            PROGRESS: '/history/progress',
            LIST: (profileId) => `/history/${profileId}`,
            CONTINUE: (profileId) => `/history/${profileId}/continue`,
            DELETE: (profileId, contentId) => `/history/${profileId}/${contentId}`
        },
        // Watchlist
        WATCHLIST: {
            ADD: '/watchlist',
            LIST: (profileId) => `/watchlist/${profileId}`,
            CHECK: (profileId, contentId) => `/watchlist/${profileId}/check/${contentId}`,
            REMOVE: (profileId, contentId) => `/watchlist/${profileId}/${contentId}`
        },
        // Evaluations
        RATINGS: {
            ADD: '/ratings',
            GET: (profileId, contentId) => `/ratings/${profileId}/${contentId}`,
            CONTENT: (contentId) => `/ratings/content/${contentId}`
        }
    },

    // Endpoints admin
    ADMIN_ENDPOINTS: {
        AUTH: {
            LOGIN: '/auth/login',
            ME: '/auth/me'
        },
        CONTENTS: {
            LIST: '/contents',
            CREATE: '/contents',
            UPDATE: (id) => `/contents/${id}`,
            PUBLISH: (id) => `/contents/${id}/publish`,
            DELETE: (id) => `/contents/${id}`
        },
        USERS: {
            LIST: '/users',
            DETAIL: (id) => `/users/${id}`,
            EXTEND: (id) => `/users/${id}/extend-subscription`
        },
        STATS: {
            DASHBOARD: '/stats/dashboard',
            REVENUE: '/stats/revenue'
        },
        VIDEOS: {
            LIST: '/videos',
            UPLOAD: '/videos/upload'
        }
    }
};

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
}
