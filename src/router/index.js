import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'

// Import des composants de pages (lazy loading pour de meilleures performances)
const Login = () => import('@/pages/Login.vue')
const Dashboard = () => import('@/pages/Dashboard.vue')
const Files = () => import('@/pages/Files.vue')
const Users = () => import('@/pages/Users.vue')
const Groups = () => import('@/pages/Groups.vue')
const Settings = () => import('@/pages/Settings.vue')
const Profile = () => import('@/pages/Profile.vue')

// Import des layouts
const AuthLayout = () => import('@/layouts/AuthLayout.vue')
const DefaultLayout = () => import('@/layouts/DefaultLayout.vue')

/**
 * Configuration des routes de l'application
 */
const routes = [
  // Routes d'authentification (sans layout principal)
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      layout: 'AuthLayout',
      requiresAuth: false,
      title: 'Connexion'
    }
  },

  // Routes principales (avec layout par défaut)
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      layout: 'DefaultLayout',
      requiresAuth: true,
      title: 'Tableau de bord',
      icon: 'HomeIcon'
    }
  },
  {
    path: '/files/:folderId?',
    name: 'Files',
    component: Files,
    props: route => ({ 
      folderId: parseInt(route.params.folderId) || 0 
    }),
    meta: {
      layout: 'DefaultLayout',
      requiresAuth: true,
      title: 'Fichiers',
      icon: 'FolderIcon'
    }
  },
  {
    path: '/users',
    name: 'Users',
    component: Users,
    meta: {
      layout: 'DefaultLayout',
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Utilisateurs',
      icon: 'UsersIcon'
    }
  },
  {
    path: '/groups',
    name: 'Groups',
    component: Groups,
    meta: {
      layout: 'DefaultLayout',
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Groupes',
      icon: 'UserGroupIcon'
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      layout: 'DefaultLayout',
      requiresAuth: true,
      title: 'Profil',
      icon: 'UserIcon'
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: {
      layout: 'DefaultLayout',
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Paramètres',
      icon: 'CogIcon'
    }
  },

  // Route de recherche
  {
    path: '/search',
    name: 'Search',
    component: Files,
    props: route => ({ 
      searchQuery: route.query.q,
      searchType: route.query.type
    }),
    meta: {
      layout: 'DefaultLayout',
      requiresAuth: true,
      title: 'Recherche'
    }
  },

  // Route 404 - doit être en dernière position
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFound.vue'),
    meta: {
      layout: 'DefaultLayout',
      requiresAuth: false,
      title: 'Page non trouvée'
    }
  }
]

/**
 * Création de l'instance du routeur
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  
  // Comportement du scroll lors des changements de route
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      return { top: 0 }
    }
  }
})

/**
 * Guard global de navigation - vérifie l'authentification
 */
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Mise à jour du titre de la page
  if (to.meta.title) {
    document.title = `${to.meta.title} - ${import.meta.env.VITE_APP_NAME || 'NAS Document Server'}`
  }
  
  // Vérification de l'authentification requise
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      // Si pas d'authentification, tentative d'initialisation depuis le stockage local
      const initialized = await authStore.initializeAuth()
      console.log(`je suis la variable initialized : ${initialized} `)
      
      // if (!initialized) {
      //   // Redirection vers la page de connexion avec l'URL de retour
      //   return next({
      //     name: 'Login',
      //     query: { redirect: to.fullPath }
      //   })
      // }
    }
    
    // Vérification des droits administrateur si requis
    if (to.meta.requiresAdmin && !authStore.user?.is_admin) {
      console.warn('Accès refusé : droits administrateur requis')
      return next({ name: 'Dashboard' })
    }
  }
  
  // Si utilisateur connecté essaie d'accéder à la page de connexion
  if (to.name === 'Login' && authStore.isAuthenticated) {
    return next({ name: 'Dashboard' })
  }
  
  next()
})

/**
 * Guard global après navigation - nettoyage et analytics
 */
router.afterEach((to, from) => {
  // Log de navigation en mode développement
  if (import.meta.env.DEV) {
    console.log(`🧭 Navigation: ${from.name || 'Unknown'} → ${to.name || 'Unknown'}`)
  }
  
  // Ici on pourrait ajouter des analytics ou du tracking
  // Exemple: gtag('config', 'GA_MEASUREMENT_ID', { page_path: to.path })
})

/**
 * Gestion des erreurs de navigation
 */
router.onError((error) => {
  console.error('Erreur de navigation:', error)
  
  // En production, on pourrait envoyer l'erreur à un service de monitoring
  if (import.meta.env.PROD) {
    // Exemple: Sentry.captureException(error)
  }
})

/**
 * Utilitaires pour la navigation
 */
export const navigationUtils = {
  /**
   * Navigation sécurisée avec vérification des permissions
   * @param {Object} route - Route de destination
   * @param {Object} router - Instance du routeur
   */
  navigateTo: async (route, routerInstance = router) => {
    try {
      await routerInstance.push(route)
    } catch (error) {
      if (error.name !== 'NavigationDuplicated') {
        console.error('Erreur de navigation:', error)
      }
    }
  },

  /**
   * Récupération des routes de menu (pour la sidebar)
   * @returns {Array} Routes filtrées pour le menu
   */
  getMenuRoutes: () => {
    const authStore = useAuthStore()
    
    return routes
      .filter(route => {
        // Exclure certaines routes du menu
        if (['Login', 'NotFound', 'Search'].includes(route.name)) return false
        if (route.path === '/') return false
        
        // Vérifier les permissions admin si nécessaire
        if (route.meta?.requiresAdmin && !authStore.user?.is_admin) return false
        
        return route.meta?.title && route.meta?.icon
      })
      .map(route => ({
        name: route.name,
        path: route.path,
        title: route.meta.title,
        icon: route.meta.icon,
        requiresAdmin: route.meta.requiresAdmin || false
      }))
  },

  /**
   * Vérification si une route est active
   * @param {string} routeName - Nom de la route
   * @param {Object} currentRoute - Route actuelle
   * @returns {boolean}
   */
  isRouteActive: (routeName, currentRoute) => {
    if (currentRoute.name === routeName) return true
    
    // Cas spéciaux
    if (routeName === 'Files' && currentRoute.name === 'Search') return true
    
    return false
  },

  /**
   * Construction d'URL avec paramètres
   * @param {string} routeName - Nom de la route
   * @param {Object} params - Paramètres de la route
   * @param {Object} query - Paramètres de requête
   * @returns {Object} Objet de route
   */
  buildRoute: (routeName, params = {}, query = {}) => {
    const route = { name: routeName }
    
    if (Object.keys(params).length) route.params = params
    if (Object.keys(query).length) route.query = query
    
    return route
  }
}

export default router