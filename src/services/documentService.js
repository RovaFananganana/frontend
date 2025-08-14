import api, { uploadApi, apiUtils } from './api'

/**
 * Service de gestion des documents et dossiers
 * Gère toutes les interactions avec l'API de fichiers et dossiers
 */
export const documentService = {
  /**
   * GESTION DES DOSSIERS
   */
  
  /**
   * Récupération d'un dossier par ID
   * @param {number} folderId - ID du dossier
   * @returns {Promise<Object>} - Informations du dossier
   */
  async getFolder(folderId) {
    try {
      const response = await api.get(`/folders/${folderId}`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération du dossier:', error)
      throw error
    }
  },

  /**
   * Récupération du contenu d'un dossier
   * @param {number} folderId - ID du dossier (0 pour la racine)
   * @param {Object} options - Options de filtrage et tri
   * @returns {Promise<Object>} - Contenu du dossier (fichiers et sous-dossiers)
   */
  async getFolderContents(folderId = 0, options = {}) {
    try {
      const params = {
        search: options.search || '',
        type: options.type || '',
        sort: options.sort || 'name',
        order: options.order || 'asc',
        page: options.page || 1,
        limit: options.limit || 50
      }
      
      const url = apiUtils.buildUrl(`/folders/${folderId}/contents`, params)
      const response = await api.get(url)
      
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération du contenu:', error)
      throw error
    }
  },

  /**
   * Création d'un nouveau dossier
   * @param {Object} folderData - Données du dossier
   * @param {string} folderData.name - Nom du dossier
   * @param {number} folderData.parent_id - ID du dossier parent (0 pour racine)
   * @returns {Promise<Object>} - Dossier créé
   */
  async createFolder(folderData) {
    try {
      const response = await api.post('/folders', {
        name: folderData.name,
        parent_id: folderData.parent_id || 0,
        description: folderData.description || ''
      })
      return response.data
    } catch (error) {
      console.error('Erreur lors de la création du dossier:', error)
      throw error
    }
  },

  /**
   * Suppression d'un dossier
   * @param {number} folderId - ID du dossier à supprimer
   * @returns {Promise<void>}
   */
  async deleteFolder(folderId) {
    try {
      await api.delete(`/folders/${folderId}`)
    } catch (error) {
      console.error('Erreur lors de la suppression du dossier:', error)
      throw error
    }
  },

  /**
   * GESTION DES FICHIERS
   */
  
  /**
   * Récupération d'un fichier par ID
   * @param {number} fileId - ID du fichier
   * @returns {Promise<Object>} - Informations du fichier
   */
  async getFile(fileId) {
    try {
      const response = await api.get(`/files/${fileId}`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération du fichier:', error)
      throw error
    }
  },

  /**
   * Upload d'un ou plusieurs fichiers
   * @param {FileList|File[]} files - Fichiers à uploader
   * @param {number} folderId - ID du dossier de destination
   * @param {Function} onProgress - Callback de progression (optionnel)
   * @returns {Promise<Object>} - Résultats de l'upload
   */
  async uploadFiles(files, folderId = 0, onProgress = null) {
    try {
      const formData = new FormData()
      
      // Ajout des fichiers au FormData
      if (files instanceof FileList) {
        Array.from(files).forEach((file, index) => {
          formData.append(`files`, file)
        })
      } else if (Array.isArray(files)) {
        files.forEach((file, index) => {
          formData.append(`files`, file)
        })
      } else {
        formData.append('files', files)
      }
      
      // Ajout du dossier de destination
      formData.append('folder_id', folderId)
      
      // Configuration pour le suivi de progression
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      
      if (onProgress) {
        config.onUploadProgress = (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          onProgress(percentCompleted)
        }
      }
      
      const response = await uploadApi.post('/files/upload', formData, config)
      return response.data
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error)
      throw error
    }
  },

  /**
   * Téléchargement d'un fichier
   * @param {number} fileId - ID du fichier à télécharger
   * @returns {Promise<Blob>} - Blob du fichier
   */
  async downloadFile(fileId) {
    try {
      const response = await api.get(`/files/${fileId}/download`, {
        responseType: 'blob'
      })
      
      return response.data
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error)
      throw error
    }
  },

  /**
   * Suppression d'un fichier
   * @param {number} fileId - ID du fichier à supprimer
   * @returns {Promise<void>}
   */
  async deleteFile(fileId) {
    try {
      await api.delete(`/files/${fileId}`)
    } catch (error) {
      console.error('Erreur lors de la suppression du fichier:', error)
      throw error
    }
  },

  /**
   * RECHERCHE ET FILTRAGE
   */
  
  /**
   * Recherche globale de fichiers et dossiers
   * @param {Object} searchParams - Paramètres de recherche
   * @param {string} searchParams.query - Terme de recherche
   * @param {string} searchParams.type - Type de fichier (optionnel)
   * @param {number} searchParams.folderId - ID du dossier de recherche (optionnel)
   * @returns {Promise<Object>} - Résultats de la recherche
   */
  async searchFiles(searchParams) {
    try {
      const params = {
        q: searchParams.query,
        type: searchParams.type || '',
        folder_id: searchParams.folderId || '',
        page: searchParams.page || 1,
        limit: searchParams.limit || 20
      }
      
      const url = apiUtils.buildUrl('/search', params)
      const response = await api.get(url)
      
      return response.data
    } catch (error) {
      console.error('Erreur lors de la recherche:', error)
      throw error
    }
  },

  /**
   * UTILITAIRES
   */
  
  /**
   * Récupération des statistiques du système
   * @returns {Promise<Object>} - Statistiques (espace utilisé, nombre de fichiers, etc.)
   */
  async getSystemStats() {
    try {
      const response = await api.get('/dashboard')
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error)
      throw error
    }
  },

  /**
   * Génération d'une URL de prévisualisation pour un fichier
   * @param {number} fileId - ID du fichier
   * @param {string} type - Type de prévisualisation ('thumbnail', 'preview')
   * @returns {string} - URL de prévisualisation
   */
  getPreviewUrl(fileId, type = 'thumbnail') {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
    return `${baseUrl}/files/${fileId}/preview?type=${type}`
  },

  /**
   * Vérification si un fichier est prévisualisable
   * @param {string} filename - Nom du fichier
   * @returns {boolean} - true si prévisualisable
   */
  isPreviewable(filename) {
    const previewableTypes = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'txt', 'md']
    const extension = filename.split('.').pop().toLowerCase()
    return previewableTypes.includes(extension)
  },

  /**
   * Récupération de l'icône appropriée pour un type de fichier
   * @param {string} filename - Nom du fichier
   * @returns {string} - Nom de l'icône (pour Heroicons)
   */
  getFileIcon(filename) {
    const extension = filename.split('.').pop().toLowerCase()
    
    const iconMap = {
      // Documents
      'pdf': 'DocumentTextIcon',
      'doc': 'DocumentIcon',
      'docx': 'DocumentIcon',
      'txt': 'DocumentTextIcon',
      'md': 'DocumentTextIcon',
      
      // Images
      'jpg': 'PhotoIcon',
      'jpeg': 'PhotoIcon',
      'png': 'PhotoIcon',
      'gif': 'PhotoIcon',
      'svg': 'PhotoIcon',
      
      // Vidéos
      'mp4': 'VideoCameraIcon',
      'avi': 'VideoCameraIcon',
      'mkv': 'VideoCameraIcon',
      'mov': 'VideoCameraIcon',
      
      // Audio
      'mp3': 'MusicalNoteIcon',
      'wav': 'MusicalNoteIcon',
      'flac': 'MusicalNoteIcon',
      
      // Archives
      'zip': 'ArchiveBoxIcon',
      'rar': 'ArchiveBoxIcon',
      '7z': 'ArchiveBoxIcon',
      
      // Feuilles de calcul
      'xls': 'TableCellsIcon',
      'xlsx': 'TableCellsIcon',
      
      // Présentations
      'ppt': 'PresentationChartLineIcon',
      'pptx': 'PresentationChartLineIcon'
    }
    
    return iconMap[extension] || 'DocumentIcon'
  }
}