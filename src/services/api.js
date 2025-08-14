import axios from 'axios'
import { useAuthStore } from '@/store/auth'
import { useToast } from 'vue-toastification'

// Configuration de base d'Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api',
  timeout: 10000, // Timeout de 10 secondes
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Instance séparée pour les uploads de fichiers
const uploadApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api',
  timeout: 60000, // Timeout plus long pour les uploads (1 minute)
  headers: {
    'Accept': 'application/json'
    // Content-Type sera défini automatiquement pour multipart/form-data
  }
})

// Intercepteur de requête pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    // Récupération du token depuis le store d'authentification
    const authStore = useAuthStore()
    const token = authStore.token
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Log des requêtes en mode développement
    if (import.meta.env.DEV) {
      console.log(`🔄 API Request: ${config.method.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params
      })
    }
    
    return config
  },
  (error) => {
    console.error('❌ Erreur dans l\'intercepteur de requête:', error)
    return Promise.reject(error)
  }
)

// Intercepteur de réponse pour gérer les erreurs globalement
api.interceptors.response.use(
  (response) => {
    // Log des réponses réussies en mode développement
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.config.method.toUpperCase()} ${response.config.url}`, response.data)
    }
    
    return response
  },
  async (error) => {
    const authStore = useAuthStore()
    const toast = useToast()
    
    // Log des erreurs
    console.error('❌ Erreur API:', error.response?.data || error.message)
    
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // Token expiré ou invalide - déconnexion automatique
          if (authStore.isAuthenticated) {
            toast.error('Session expirée, veuillez vous reconnecter')
            await authStore.logout()
            // Redirection vers la page de connexion gérée par le router guard
          }
          break
          
        case 403:
          toast.error('Accès refusé - permissions insuffisantes')
          break
          
        case 404:
          toast.error('Ressource non trouvée')
          break
          
        case 422:
          // Erreurs de validation - affichées par les composants individuels
          console.warn('Erreurs de validation:', data)
          break
          
        case 500:
          toast.error('Erreur serveur - veuillez réessayer plus tard')
          break
          
        default:
          // Affichage du message d'erreur du serveur ou message générique
          const message = data?.message || data?.error || 'Une erreur inattendue s\'est produite'
          toast.error(message)
      }
    } else if (error.code === 'ECONNABORTED') {
      toast.error('Délai d\'attente dépassé - vérifiez votre connexion')
    } else {
      toast.error('Erreur de connexion au serveur')
    }
    
    return Promise.reject(error)
  }
)

// Même configuration pour l'API d'upload
uploadApi.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const token = authStore.token
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => Promise.reject(error)
)

uploadApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const toast = useToast()
    
    if (error.response?.status === 413) {
      toast.error('Fichier trop volumineux')
    } else if (error.code === 'ECONNABORTED') {
      toast.error('Délai d\'upload dépassé')
    }
    
    return Promise.reject(error)
  }
)

// Fonctions utilitaires pour les appels API
export const apiUtils = {
  // Gestion des erreurs de validation
  handleValidationErrors: (error, form = null) => {
    if (error.response?.status === 422 && error.response.data?.errors) {
      const errors = error.response.data.errors
      
      // Si un objet form est fourni, on peut y assigner les erreurs
      if (form && typeof form === 'object') {
        Object.keys(errors).forEach(field => {
          if (form.hasOwnProperty(field + 'Error')) {
            form[field + 'Error'] = errors[field][0] // Premier message d'erreur
          }
        })
      }
      
      return errors
    }
    return null
  },
  
  // Construction d'URLs avec paramètres de requête
  buildUrl: (endpoint, params = {}) => {
    const url = new URL(endpoint, api.defaults.baseURL)
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        url.searchParams.append(key, params[key])
      }
    })
    return url.toString().replace(api.defaults.baseURL, '')
  },
  
  // Formatage des tailles de fichiers
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  },
  
  // Vérification du type MIME
  isValidFileType: (file, allowedTypes = []) => {
    if (!allowedTypes.length) return true
    const fileExtension = file.name.split('.').pop().toLowerCase()
    return allowedTypes.includes(fileExtension)
  }
}

// Export des instances configurées
export { api, uploadApi }
export default api