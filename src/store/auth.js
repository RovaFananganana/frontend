import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import router from '@/router'

/**
 * Store d'authentification utilisant la Composition API
 * Gère l'état de connexion, les informations utilisateur et les tokens JWT
 */
export const useAuthStore = defineStore('auth', () => {
  // État réactif
  const user = ref(null) // Informations de l'utilisateur connecté
  const token = ref(localStorage.getItem('nas_token') || null) // Token JWT
  const refreshToken = ref(localStorage.getItem('nas_refresh_token') || null) // Token de rafraîchissement
  const isLoading = ref(false) // État de chargement pour les opérations async
  const loginAttempts = ref(0) // Compteur de tentatives de connexion
  const maxLoginAttempts = ref(5) // Nombre maximum de tentatives
  
  const toast = useToast()
  const router = useRouter()  
  // Getters (computed)
  const isAuthenticated = computed(() => {
    return !!(token.value && user.value)
  })

  const userName = computed(() => {
    return user.value?.username || user.value?.email || 'Utilisateur'
  })

  const userInitials = computed(() => {
    if (!user.value) return '??'
    
    const name = user.value.username || user.value.email || ''
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
  })

  const canAttemptLogin = computed(() => {
    return loginAttempts.value < maxLoginAttempts.value
  })

  // Actions

  /**
   * Connexion utilisateur
   * @param {Object} credentials - Identifiants de connexion
   * @param {string} credentials.username - Nom d'utilisateur
   * @param {string} credentials.password - Mot de passe
   * @param {boolean} credentials.remember - Se souvenir de moi
   * @returns {Promise<boolean>} - Succès de la connexion
   */
  const login = async (credentials) => {
    if (!canAttemptLogin.value) {
      toast.error('Trop de tentatives de connexion. Attendez avant de réessayer.')
      return false
    }

    isLoading.value = true
    
    try {
      const response = await authService.login(credentials)
      
      if (response.success && response.data) {
        // Sauvegarde des données d'authentification
        user.value = response.data.user
        token.value = response.data.token
        refreshToken.value = response.data.refresh_token || null
        
        // Stockage local du token (conditionnellement selon "Se souvenir")
        if (credentials.remember) {
          localStorage.setItem('nas_token', token.value)
          if (refreshToken.value) {
            localStorage.setItem('nas_refresh_token', refreshToken.value)
          }
        } else {
          // Stockage en session seulement
          sessionStorage.setItem('nas_token', token.value)
          if (refreshToken.value) {
            sessionStorage.setItem('nas_refresh_token', refreshToken.value)
          }
        }
        
        // Réinitialisation du compteur de tentatives
        loginAttempts.value = 0
        
        toast.success(`Bienvenue ${userName.value} !`)
        
        // Redirection vers la page précédente ou le dashboard
        const redirectPath = router.currentRoute.value.query.redirect || '/dashboard'
        await router.push(redirectPath)
        
        return true
      } else {
        throw new Error(response.message || 'Erreur de connexion')
      }
    } catch (error) {
      loginAttempts.value++
      
      const remainingAttempts = maxLoginAttempts.value - loginAttempts.value
      if (remainingAttempts > 0) {
        toast.error(`Identifiants incorrects (${remainingAttempts} tentatives restantes)`)
      } else {
        toast.error('Compte temporairement bloqué')
      }
      
      console.error('Erreur de connexion:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Déconnexion utilisateur
   */
  const logout = async () => {
    isLoading.value = true
    
    try {
      // Appel API de déconnexion (optionnel, continue même si ça échoue)
      await authService.logout()
    } catch (error) {
      console.warn('Erreur lors de la déconnexion côté serveur:', error)
    }
    
    // Nettoyage de l'état local
    user.value = null
    token.value = null
    refreshToken.value = null
    
    // Nettoyage du stockage
    localStorage.removeItem('nas_token')
    localStorage.removeItem('nas_refresh_token')
    sessionStorage.removeItem('nas_token')
    sessionStorage.removeItem('nas_refresh_token')
    
    isLoading.value = false
    
    toast.info('Vous avez été déconnecté')
    
    // Redirection vers la page de connexion
    router.push('/login') 
  }
  

  /**
   * Rafraîchissement du token JWT
   * @returns {Promise<boolean>} - Succès du rafraîchissement
   */
  const refreshAuthToken = async () => {
    if (!refreshToken.value) {
      await logout()
      return false
    }

    try {
      const response = await authService.refreshToken()
      
      if (response.success && response.data) {
        token.value = response.data.token
        
        // Mise à jour du stockage
        const isRemembered = localStorage.getItem('nas_token')
        if (isRemembered) {
          localStorage.setItem('nas_token', token.value)
        } else {
          sessionStorage.setItem('nas_token', token.value)
        }
        
        return true
      } else {
        throw new Error('Échec du rafraîchissement')
      }
    } catch (error) {
      console.error('Erreur de rafraîchissement du token:', error)
      await logout()
      return false
    }
  }

  /**
   * Vérification et initialisation de l'état d'authentification au démarrage
   */
  const initializeAuth = async () => {
    // Récupération du token depuis le stockage
    const storedToken = localStorage.getItem('nas_token') || sessionStorage.getItem('nas_token')
    const storedRefreshToken = localStorage.getItem('nas_refresh_token') || sessionStorage.getItem('nas_refresh_token')
    
    if (!storedToken) {
      return false
    }

    token.value = storedToken
    refreshToken.value = storedRefreshToken
    isLoading.value = true

    try {
      // Vérification de la validité du token
      const response = await authService.verifyToken()
      
      if (response.success && response.data) {
        user.value = response.data.user
        return true
      } else {
        throw new Error('Token invalide')
      }
    } catch (error) {
      console.warn('Token invalide, tentative de rafraîchissement...')
      
      // Tentative de rafraîchissement
      const refreshed = await refreshAuthToken()
      if (refreshed) {
        // Nouvelle tentative de vérification après rafraîchissement
        try {
          const response = await authService.verifyToken()
          if (response.success && response.data) {
            user.value = response.data.user
            return true
          }
        } catch (retryError) {
          console.error('Échec de la vérification après rafraîchissement:', retryError)
        }
      }
      
      // Si tout échoue, on nettoie l'authentification
      await logout()
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Mise à jour du profil utilisateur
   * @param {Object} profileData - Nouvelles données du profil
   */
  const updateProfile = async (profileData) => {
    isLoading.value = true
    
    try {
      const response = await authService.updateProfile(profileData)
      
      if (response.success && response.data) {
        user.value = { ...user.value, ...response.data.user }
        toast.success('Profil mis à jour avec succès')
        return true
      } else {
        throw new Error(response.message || 'Erreur de mise à jour')
      }
    } catch (error) {
      console.error('Erreur de mise à jour du profil:', error)
      toast.error('Erreur lors de la mise à jour du profil')
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Changement de mot de passe
   * @param {Object} passwordData - Données du changement de mot de passe
   */
  const changePassword = async (passwordData) => {
    isLoading.value = true
    
    try {
      const response = await authService.changePassword(passwordData)
      
      if (response.success) {
        toast.success('Mot de passe modifié avec succès')
        return true
      } else {
        throw new Error(response.message || 'Erreur de changement de mot de passe')
      }
    } catch (error) {
      console.error('Erreur de changement de mot de passe:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Réinitialisation du compteur de tentatives de connexion
   */
  const resetLoginAttempts = () => {
    loginAttempts.value = 0
  }

  // Export des propriétés et méthodes du store
  return {
    // État
    user,
    token,
    refreshToken,
    isLoading,
    loginAttempts,
    maxLoginAttempts,
    
    // Getters
    isAuthenticated,
    userName,
    userInitials,
    canAttemptLogin,
    
    // Actions
    login,
    logout,
    refreshAuthToken,
    initializeAuth,
    updateProfile,
    changePassword,
    resetLoginAttempts
  }
})