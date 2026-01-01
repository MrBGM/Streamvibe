// ============================================================================
// PAGE D'ACCUEIL - StreamVibe
// ============================================================================

document.addEventListener('DOMContentLoaded', async () => {
    // Vérifier l'authentification
    checkAuth();

    // Charger les contenus
    await loadHomeContent();
});

// Vérifier si l'utilisateur est connecté
function checkAuth() {
    const isLoggedIn = AuthService.isLoggedIn();
    const profileMenu = document.getElementById('profileMenu');
    const profileAvatar = document.getElementById('profileAvatar');

    if (isLoggedIn) {
        const user = AuthService.getUser();
        const profile = AuthService.getCurrentProfile();

        if (profile) {
            profileAvatar.textContent = getAvatarIcon(profile.avatar);
            profileAvatar.title = profile.nom_profil;
        } else {
            // Rediriger vers la sélection de profil
            window.location.href = '/profiles.html';
            return;
        }

        profileMenu.innerHTML = `
            <a href="/profiles.html">Changer de profil</a>
            <a href="/account.html">Compte</a>
            <hr>
            <button onclick="AuthService.logout()">Déconnexion</button>
        `;
    } else {
        profileAvatar.textContent = '👤';
        profileMenu.innerHTML = `
            <a href="/login.html">Se connecter</a>
            <a href="/register.html">S'inscrire</a>
        `;
    }
}

// Charger le contenu de la page d'accueil
async function loadHomeContent() {
    const mainContent = document.getElementById('mainContent');

    try {
        // Charger les données en parallèle
        const [trendingResponse, newResponse, allContentsResponse, categoriesResponse] = await Promise.all([
            ContentService.getTrending(),
            ContentService.getNew(),
            ContentService.getAll({ limit: 20 }),
            ContentService.getCategories()
        ]);

        // Vider le conteneur
        mainContent.innerHTML = '';

        // Configurer le hero avec un contenu tendance
        if (trendingResponse.success && trendingResponse.data.length > 0) {
            setupHero(trendingResponse.data[0]);
        }

        // Section "Continuer à regarder" (si connecté)
        if (AuthService.isLoggedIn()) {
            const profile = AuthService.getCurrentProfile();
            if (profile) {
                try {
                    const continueResponse = await HistoryService.getContinueWatching(profile._id);
                    if (continueResponse.success && continueResponse.data.length > 0) {
                        const section = createContentRow('Reprendre la lecture', continueResponse.data, true);
                        mainContent.appendChild(section);
                    }
                } catch (e) {
                    console.log('Pas de contenu à reprendre');
                }
            }
        }

        // Section Tendances
        if (trendingResponse.success && trendingResponse.data.length > 0) {
            const section = createContentRow('Tendances actuelles', trendingResponse.data);
            mainContent.appendChild(section);
        }

        // Section Nouveautés
        if (newResponse.success && newResponse.data.length > 0) {
            const section = createContentRow('Nouveautés', newResponse.data);
            mainContent.appendChild(section);
        }

        // Tous les contenus
        if (allContentsResponse.success && allContentsResponse.data.length > 0) {
            // Grouper par type
            const films = allContentsResponse.data.filter(c => c.type === 'film');
            const series = allContentsResponse.data.filter(c => c.type === 'serie');

            if (films.length > 0) {
                const section = createContentRow('Films populaires', films);
                mainContent.appendChild(section);
            }

            if (series.length > 0) {
                const section = createContentRow('Séries du moment', series);
                mainContent.appendChild(section);
            }
        }

        // Ma Liste (si connecté)
        if (AuthService.isLoggedIn()) {
            const profile = AuthService.getCurrentProfile();
            if (profile) {
                try {
                    const watchlistResponse = await WatchlistService.getAll(profile._id);
                    if (watchlistResponse.success && watchlistResponse.data.length > 0) {
                        const section = createContentRow('Ma Liste', watchlistResponse.data);
                        mainContent.appendChild(section);
                    }
                } catch (e) {
                    console.log('Watchlist vide');
                }
            }
        }

        // Par catégorie
        if (categoriesResponse.success && categoriesResponse.data.length > 0) {
            // Afficher les 3 premières catégories avec contenu
            const categoriesToShow = categoriesResponse.data.slice(0, 3);
            for (const category of categoriesToShow) {
                try {
                    const categoryContents = await ContentService.getAll({
                        categorie: category._id,
                        limit: 10
                    });
                    if (categoryContents.success && categoryContents.data.length > 0) {
                        const section = createContentRow(category.nom, categoryContents.data);
                        mainContent.appendChild(section);
                    }
                } catch (e) {
                    console.log(`Pas de contenu pour ${category.nom}`);
                }
            }
        }

    } catch (error) {
        console.error('Erreur lors du chargement:', error);
        mainContent.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <h2>Erreur de chargement</h2>
                <p>Impossible de charger les contenus. Vérifiez que le serveur est démarré.</p>
                <button class="btn btn-primary" onclick="location.reload()">Réessayer</button>
            </div>
        `;
    }
}

// Configurer la section hero
function setupHero(content) {
    const heroSection = document.getElementById('heroSection');
    const heroTitle = document.getElementById('heroTitle');
    const heroDescription = document.getElementById('heroDescription');
    const heroMeta = document.getElementById('heroMeta');
    const heroPlayBtn = document.getElementById('heroPlayBtn');
    const heroInfoBtn = document.getElementById('heroInfoBtn');

    // Background
    if (content.banniere_url) {
        heroSection.style.backgroundImage = `url(${content.banniere_url})`;
    } else {
        heroSection.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)';
    }

    // Titre et description
    heroTitle.textContent = content.titre;
    heroDescription.textContent = content.description || content.synopsis_court || '';

    // Meta info
    heroMeta.innerHTML = `
        ${content.note_moyenne ? `<span class="hero-rating">★ ${content.note_moyenne.toFixed(1)}</span>` : ''}
        <span>${content.annee_sortie || ''}</span>
        ${content.duree_minutes ? `<span>${formatDuration(content.duree_minutes)}</span>` : ''}
        ${content.classification_age ? `<span class="badge badge-warning">${content.classification_age}</span>` : ''}
    `;

    // Boutons
    heroPlayBtn.onclick = () => {
        if (!AuthService.isLoggedIn()) {
            toast.warning('Connectez-vous pour regarder');
            window.location.href = '/login.html';
            return;
        }
        window.location.href = `/player.html?id=${content._id}`;
    };

    heroInfoBtn.onclick = () => {
        window.location.href = `/detail.html?id=${content._id}`;
    };
}
