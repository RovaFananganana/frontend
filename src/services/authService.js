import api from './api'

/**
 * Service d'authentification
 * Gère toutes les interactions avec l'API d'authentification
 */
export const authService = {
  /**
   * Connexion utilisateur
   * @param {Object} credentials - Identifiants de connexion
   * @param {string} credentials.username - Nom d'utilisateur ou email
   * @param {string} credentials.password - Mot de passe
   * @returns {Promise<Object>} - Données de l'utilisateur et token
   */
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', {
        username: credentials.username,
        password: credentials.password
      })
      
      // Structure attendue de la réponse :
      // {
      //   success: true,
      //   data: {
      //     user: { id, username, email, ... },
      //     token: "jwt_token_here",
      //     expires_at: "timestamp"
      //   }
      // }
      
      return response.data
    } catch (error) {
      console.error('Erreur lors de la connexion:', error)
      throw error
    }
  },

  /**
   * Déconnexion utilisateur
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      // On continue même si la déconnexion côté serveur échoue
      console.warn('Erreur lors de la déconnexion côté serveur:', error)
    }
  },

  /**
   * Rafraîchissement du token JWT
   * @returns {Promise<Object>} - Nouveau token
   */
  async refreshToken() {
    try {
      const response = await api.post('/auth/refresh')
      
      // Structure attendue de la réponse :
      // {
      //   success: true,
      //   data: {
      //     token: "new_jwt_token",
      //     expires_at: "timestamp"
      //   }
      // }
      
      return response.data
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error)
      throw error
    }
  },

  /**
   * Vérification de la validité du token
   * @returns {Promise<Object>} - Informations de l'utilisateur connecté
   */
  async verifyToken() {
    try {
      const response = await api.get('/auth/me')
      
      // Structure attendue de la réponse :
      // {
      //   success: true,
      //   data: {
      //     user: { id, username, email, ... }
      //   }
      // }
      
      return response.data
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error)
      throw error
    }
  },

  /**
   * Récupération du profil utilisateur
   * @returns {Promise<Object>} - Profil complet de l'utilisateur
   */
  async getUserProfile() {
    try {
      const response = await api.get('/users/profile')
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error)
      throw error
    }
  },

  /**
   * Mise à jour du profil utilisateur
   * @param {Object} profileData - Données du profil à mettre à jour
   * @returns {Promise<Object>} - Profil mis à jour
   */
  async updateProfile(profileData) {
    try {
      const response = await api.put('/users/profile', profileData)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error)
      throw error
    }
  },

  /**
   * Changement de mot de passe
   * @param {Object} passwordData - Données pour changer le mot de passe
   * @param {string} passwordData.currentPassword - Mot de passe actuel
   * @param {string} passwordData.newPassword - Nouveau mot de passe
   * @param {string} passwordData.confirmPassword - Confirmation du nouveau mot de passe
   * @returns {Promise<Object>} - Confirmation du changement
   */
  async changePassword(passwordData) {
    try {
      const response = await api.post('/auth/change-password', {
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
        confirm_password: passwordData.confirmPassword
      })
      return response.data
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error)
      throw error
    }
  }
}