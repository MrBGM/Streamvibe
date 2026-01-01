// ============================================================================
// SERVICE API - StreamVibe
// ============================================================================

class ApiService {
    constructor() {
        this.baseUrl = API_CONFIG.API_URL;
        this.adminUrl = API_CONFIG.ADMIN_API_URL;
    }

    // Obtenir le token stocké
    getToken() {
        return localStorage.getItem('streamvibe_token');
    }

    // Obtenir le token admin stocké
    getAdminToken() {
        return localStorage.getItem('streamvibe_admin_token');
    }

    // Headers par défaut
    getHeaders(isAdmin = false) {
        const headers = {
            'Content-Type': 'application/json'
        };
        const token = isAdmin ? this.getAdminToken() : this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    }

    // Requête générique
    async request(url, options = {}, isAdmin = false) {
        const baseUrl = isAdmin ? this.adminUrl : this.baseUrl;
        const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;

        const config = {
            ...options,
            headers: {
                ...this.getHeaders(isAdmin),
                ...options.headers
            }
        };

        try {
            const response = await fetch(fullUrl, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur API');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // GET
    async get(url, isAdmin = false) {
        return this.request(url, { method: 'GET' }, isAdmin);
    }

    // POST
    async post(url, body, isAdmin = false) {
        return this.request(url, {
            method: 'POST',
            body: JSON.stringify(body)
        }, isAdmin);
    }

    // PUT
    async put(url, body, isAdmin = false) {
        return this.request(url, {
            method: 'PUT',
            body: JSON.stringify(body)
        }, isAdmin);
    }

    // DELETE
    async delete(url, isAdmin = false) {
        return this.request(url, { method: 'DELETE' }, isAdmin);
    }

    // Upload fichier (multipart/form-data)
    async upload(url, formData, isAdmin = false) {
        const baseUrl = isAdmin ? this.adminUrl : this.baseUrl;
        const fullUrl = `${baseUrl}${url}`;
        const token = isAdmin ? this.getAdminToken() : this.getToken();

        const headers = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(fullUrl, {
                method: 'POST',
                headers,
                body: formData
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur upload');
            }

            return data;
        } catch (error) {
            console.error('Upload Error:', error);
            throw error;
        }
    }
}

// Instance globale
const api = new ApiService();

// ============================================================================
// SERVICES SPECIFIQUES
// ============================================================================

// Service d'authentification utilisateur
const AuthService = {
    async login(email, mot_de_passe) {
        const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, { email, mot_de_passe });
        if (response.success && response.data.token) {
            localStorage.setItem('streamvibe_token', response.data.token);
            localStorage.setItem('streamvibe_user', JSON.stringify(response.data.user));
        }
        return response;
    },

    async register(userData) {
        const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData);
        if (response.success && response.data.token) {
            localStorage.setItem('streamvibe_token', response.data.token);
            localStorage.setItem('streamvibe_user', JSON.stringify(response.data.user));
        }
        return response;
    },

    async getMe() {
        return api.get(API_CONFIG.ENDPOINTS.AUTH.ME);
    },

    logout() {
        localStorage.removeItem('streamvibe_token');
        localStorage.removeItem('streamvibe_user');
        localStorage.removeItem('streamvibe_profile');
        window.location.href = '/index.html';
    },

    isLoggedIn() {
        return !!localStorage.getItem('streamvibe_token');
    },

    getUser() {
        const user = localStorage.getItem('streamvibe_user');
        return user ? JSON.parse(user) : null;
    },

    getCurrentProfile() {
        const profile = localStorage.getItem('streamvibe_profile');
        return profile ? JSON.parse(profile) : null;
    },

    setCurrentProfile(profile) {
        localStorage.setItem('streamvibe_profile', JSON.stringify(profile));
    }
};

// Service d'authentification admin
const AdminAuthService = {
    async login(email, mot_de_passe) {
        const response = await api.post(API_CONFIG.ADMIN_ENDPOINTS.AUTH.LOGIN, { email, mot_de_passe }, true);
        if (response.success && response.data.token) {
            localStorage.setItem('streamvibe_admin_token', response.data.token);
            localStorage.setItem('streamvibe_admin', JSON.stringify(response.data.admin));
        }
        return response;
    },

    async getMe() {
        return api.get(API_CONFIG.ADMIN_ENDPOINTS.AUTH.ME, true);
    },

    logout() {
        localStorage.removeItem('streamvibe_admin_token');
        localStorage.removeItem('streamvibe_admin');
        window.location.href = '/admin/login.html';
    },

    isLoggedIn() {
        return !!localStorage.getItem('streamvibe_admin_token');
    },

    getAdmin() {
        const admin = localStorage.getItem('streamvibe_admin');
        return admin ? JSON.parse(admin) : null;
    }
};

// Service des contenus
const ContentService = {
    async getAll(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${API_CONFIG.ENDPOINTS.CONTENTS.LIST}?${queryString}` : API_CONFIG.ENDPOINTS.CONTENTS.LIST;
        return api.get(url);
    },

    async getTrending() {
        return api.get(API_CONFIG.ENDPOINTS.CONTENTS.TRENDING);
    },

    async getNew() {
        return api.get(API_CONFIG.ENDPOINTS.CONTENTS.NEW);
    },

    async search(query) {
        return api.get(`${API_CONFIG.ENDPOINTS.CONTENTS.SEARCH}?q=${encodeURIComponent(query)}`);
    },

    async getCategories() {
        return api.get(API_CONFIG.ENDPOINTS.CONTENTS.CATEGORIES);
    },

    async getById(id) {
        return api.get(API_CONFIG.ENDPOINTS.CONTENTS.DETAIL(id));
    },

    async getRatings(contentId) {
        return api.get(API_CONFIG.ENDPOINTS.RATINGS.CONTENT(contentId));
    }
};

// Service des profils
const ProfileService = {
    async getAll() {
        return api.get(API_CONFIG.ENDPOINTS.PROFILES.LIST);
    },

    async create(profileData) {
        return api.post(API_CONFIG.ENDPOINTS.PROFILES.CREATE, profileData);
    },

    async update(id, profileData) {
        return api.put(API_CONFIG.ENDPOINTS.PROFILES.UPDATE(id), profileData);
    },

    async delete(id) {
        return api.delete(API_CONFIG.ENDPOINTS.PROFILES.DELETE(id));
    },

    async select(id) {
        return api.post(API_CONFIG.ENDPOINTS.PROFILES.SELECT(id), {});
    }
};

// Service historique
const HistoryService = {
    async updateProgress(profileId, contentId, progression_secondes, duree_totale_secondes) {
        return api.post(API_CONFIG.ENDPOINTS.HISTORY.PROGRESS, {
            profileId,
            contentId,
            progression_secondes,
            duree_totale_secondes
        });
    },

    async getHistory(profileId) {
        return api.get(API_CONFIG.ENDPOINTS.HISTORY.LIST(profileId));
    },

    async getContinueWatching(profileId) {
        return api.get(API_CONFIG.ENDPOINTS.HISTORY.CONTINUE(profileId));
    },

    async removeFromHistory(profileId, contentId) {
        return api.delete(API_CONFIG.ENDPOINTS.HISTORY.DELETE(profileId, contentId));
    }
};

// Service watchlist
const WatchlistService = {
    async add(profileId, contentId) {
        return api.post(API_CONFIG.ENDPOINTS.WATCHLIST.ADD, { profileId, contentId });
    },

    async getAll(profileId) {
        return api.get(API_CONFIG.ENDPOINTS.WATCHLIST.LIST(profileId));
    },

    async check(profileId, contentId) {
        return api.get(API_CONFIG.ENDPOINTS.WATCHLIST.CHECK(profileId, contentId));
    },

    async remove(profileId, contentId) {
        return api.delete(API_CONFIG.ENDPOINTS.WATCHLIST.REMOVE(profileId, contentId));
    }
};

// Service évaluations
const RatingService = {
    async rate(profileId, contentId, note, avis_texte = '') {
        return api.post(API_CONFIG.ENDPOINTS.RATINGS.ADD, {
            profileId,
            contentId,
            note,
            avis_texte
        });
    },

    async getMyRating(profileId, contentId) {
        return api.get(API_CONFIG.ENDPOINTS.RATINGS.GET(profileId, contentId));
    }
};

// Service admin contenus
const AdminContentService = {
    async getAll(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${API_CONFIG.ADMIN_ENDPOINTS.CONTENTS.LIST}?${queryString}` : API_CONFIG.ADMIN_ENDPOINTS.CONTENTS.LIST;
        return api.get(url, true);
    },

    async create(contentData) {
        return api.post(API_CONFIG.ADMIN_ENDPOINTS.CONTENTS.CREATE, contentData, true);
    },

    async update(id, contentData) {
        return api.put(API_CONFIG.ADMIN_ENDPOINTS.CONTENTS.UPDATE(id), contentData, true);
    },

    async publish(id) {
        return api.put(API_CONFIG.ADMIN_ENDPOINTS.CONTENTS.PUBLISH(id), {}, true);
    },

    async delete(id) {
        return api.delete(API_CONFIG.ADMIN_ENDPOINTS.CONTENTS.DELETE(id), true);
    }
};

// Service admin utilisateurs
const AdminUserService = {
    async getAll(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${API_CONFIG.ADMIN_ENDPOINTS.USERS.LIST}?${queryString}` : API_CONFIG.ADMIN_ENDPOINTS.USERS.LIST;
        return api.get(url, true);
    },

    async extendSubscription(userId, jours) {
        return api.put(API_CONFIG.ADMIN_ENDPOINTS.USERS.EXTEND(userId), { jours }, true);
    }
};

// Service admin stats
const AdminStatsService = {
    async getDashboard() {
        return api.get(API_CONFIG.ADMIN_ENDPOINTS.STATS.DASHBOARD, true);
    },

    async getRevenue() {
        return api.get(API_CONFIG.ADMIN_ENDPOINTS.STATS.REVENUE, true);
    }
};

// Service admin videos
const AdminVideoService = {
    async getAll() {
        return api.get(API_CONFIG.ADMIN_ENDPOINTS.VIDEOS.LIST, true);
    },

    async upload(formData) {
        return api.upload(API_CONFIG.ADMIN_ENDPOINTS.VIDEOS.UPLOAD, formData, true);
    }
};
