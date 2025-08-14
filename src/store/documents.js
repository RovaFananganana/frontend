import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { documentService } from '@/services/documentService'
import { useToast } from 'vue-toastification'

/**
 * Store de gestion des documents et dossiers
 * Gère l'état de navigation, les fichiers, dossiers et opérations associées
 */
export const useDocumentsStore = defineStore('documents', () => {
  // État réactif
  const currentFolder = ref({ id: 0, name: 'Accueil', path: '/' }) // Dossier actuellement ouvert
  const folderContents = ref({ folders: [], files: [] }) // Contenu du dossier actuel
  const breadcrumbs = ref([]) // Fil d'ariane pour la navigation
  const isLoading = ref(false) // État de chargement
  const searchResults = ref(null) // Résultats de recherche
  const selectedItems = ref([]) // Items sélectionnés (pour actions en lot)
  const uploadProgress = ref(0) // Progression de l'upload
  const isUploading = ref(false) // État d'upload en cours
  
  // Paramètres de vue et filtrage
  const viewMode = ref('grid') // 'grid' ou 'list'
  const sortBy = ref('name') // 'name', 'date', 'size', 'type'
  const sortOrder = ref('asc') // 'asc' ou 'desc'
  const searchQuery = ref('') // Terme de recherche actuel
  const filterType = ref('') // Filtre par type de fichier
  
  // Statistiques système
  const systemStats = ref({
    totalFiles: 0,
    totalFolders: 0,
    totalSize: 0,
    usedSpace: 0,
    availableSpace: 0
  })
  
  const toast = useToast()

  // Getters (computed)
  const isSearchActive = computed(() => {
    return searchQuery.value.length > 0 || filterType.value.length > 0
  })

  const currentFolderId = computed(() => {
    return currentFolder.value?.id || 0
  })

  const filteredFiles = computed(() => {
    if (!folderContents.value.files) return []
    
    let files = [...folderContents.value.files]
    
    // Filtrage par type si spécifié
    if (filterType.value) {
      files = files.filter(file => {
        const extension = file.name.split('.').pop().toLowerCase()
        return extension === filterType.value.toLowerCase()
      })
    }
    
    // Tri des fichiers
    files.sort((a, b) => {
      let aVal, bVal
      
      switch (sortBy.value) {
        case 'name':
          aVal = a.name.toLowerCase()
          bVal = b.name.toLowerCase()
          break
        case 'date':
          aVal = new Date(a.created_at)
          bVal = new Date(b.created_at)
          break
        case 'size':
          aVal = a.size || 0
          bVal = b.size || 0
          break
        case 'type':
          aVal = a.name.split('.').pop().toLowerCase()
          bVal = b.name.split('.').pop().toLowerCase()
          break
        default:
          aVal = a.name.toLowerCase()
          bVal = b.name.toLowerCase()
      }
      
      if (sortOrder.value === 'desc') {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0
      }
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
    })
    
    return files
  })

  const filteredFolders = computed(() => {
    if (!folderContents.value.folders) return []
    
    let folders = [...folderContents.value.folders]
    
    // Tri des dossiers (toujours par nom pour les dossiers)
    folders.sort((a, b) => {
      const aName = a.name.toLowerCase()
      const bName = b.name.toLowerCase()
      
      if (sortOrder.value === 'desc') {
        return aName < bName ? 1 : aName > bName ? -1 : 0
      }
      return aName > bName ? 1 : aName < bName ? -1 : 0
    })
    
    return folders
  })

  const hasSelection = computed(() => {
    return selectedItems.value.length > 0
  })

  const selectionCount = computed(() => {
    return selectedItems.value.length
  })

  // Actions

  /**
   * Chargement du contenu d'un dossier
   * @param {number} folderId - ID du dossier (0 pour racine)
   */
  const loadFolderContents = async (folderId = 0) => {
    isLoading.value = true
    
   try {
        if (folderId > 0) {
          const folderResponse = await documentService.getFolder(folderId)
          if (folderResponse.success) {
            currentFolder.value = folderResponse.data
          }
        } else {
          currentFolder.value = { id: 0, name: 'Accueil', path: '/' }
        }

        const contentsResponse = await documentService.getFolderContents(folderId)
        if (contentsResponse.success) {
          folderContents.value = contentsResponse.data
        }
      } catch (error) {
        console.error('Erreur lors du chargement du dossier', error)
      } finally {
        isLoading.value = false
      }
   
  }

  /**
   * Mise à jour du fil d'ariane (breadcrumbs)
   * @param {number} folderId - ID du dossier actuel
   */
  const updateBreadcrumbs = async (folderId) => {
    if (folderId === 0) {
      breadcrumbs.value = [{ id: 0, name: 'Accueil', path: '/' }]
      return
    }
    
    // Construction du fil d'ariane en remontant la hiérarchie
    const crumbs = []
    let currentId = folderId
    
    while (currentId > 0) {
      try {
        const response = await documentService.getFolder(currentId)
        if (response.success) {
          crumbs.unshift(response.data)
          currentId = response.data.parent_id || 0
        } else {
          break
        }
      } catch (error) {
        console.error('Erreur lors de la construction du fil d\'ariane:', error)
        break
      }
    }
    
    // Ajout de l'accueil au début
    breadcrumbs.value = [{ id: 0, name: 'Accueil', path: '/' }, ...crumbs]
  }

  /**
   * Navigation vers un dossier
   * @param {number} folderId - ID du dossier de destination
   */
  const navigateToFolder = async (folderId) => {
    await loadFolderContents(folderId)
  }

  /**
   * Création d'un nouveau dossier
   * @param {string} folderName - Nom du nouveau dossier
   */
  const createFolder = async (folderName) => {
    if (!folderName.trim()) {
      toast.error('Le nom du dossier ne peut pas être vide')
      return false
    }
    
    isLoading.value = true
    
    try {
      const response = await documentService.createFolder({
        name: folderName.trim(),
        parent_id: currentFolderId.value
      })
      
      if (response.success) {
        toast.success(`Dossier "${folderName}" créé avec succès`)
        await loadFolderContents(currentFolderId.value) // Rechargement du contenu
        return true
      } else {
        throw new Error(response.message || 'Erreur de création')
      }
    } catch (error) {
      console.error('Erreur lors de la création du dossier:', error)
      toast.error('Erreur lors de la création du dossier')
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Suppression d'un dossier
   * @param {number} folderId - ID du dossier à supprimer
   */
  const deleteFolder = async (folderId) => {
    try {
      await documentService.deleteFolder(folderId)
      toast.success('Dossier supprimé avec succès')
      await loadFolderContents(currentFolderId.value) // Rechargement du contenu
      return true
    } catch (error) {
      console.error('Erreur lors de la suppression du dossier:', error)
      toast.error('Erreur lors de la suppression du dossier')
      return false
    }
  }

  /**
   * Upload de fichiers
   * @param {FileList|File[]} files - Fichiers à uploader
   */
  const uploadFiles = async (files) => {
    if (!files || files.length === 0) return false
    
    isUploading.value = true
    uploadProgress.value = 0
    
    try {
      const response = await documentService.uploadFiles(
        files, 
        currentFolderId.value,
        (progress) => {
          uploadProgress.value = progress
        }
      )
      
      if (response.success) {
        const fileCount = Array.isArray(files) ? files.length : files.length
        toast.success(`${fileCount} fichier(s) uploadé(s) avec succès`)
        await loadFolderContents(currentFolderId.value) // Rechargement du contenu
        return true
      } else {
        throw new Error(response.message || 'Erreur d\'upload')
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error)
      toast.error('Erreur lors de l\'upload des fichiers')
      return false
    } finally {
      isUploading.value = false
      uploadProgress.value = 0
    }
  }

  /**
   * Téléchargement d'un fichier
   * @param {Object} file - Objet fichier à télécharger
   */
  const downloadFile = async (file) => {
    try {
      const blob = await documentService.downloadFile(file.id)
      
      // Création d'un lien de téléchargement temporaire
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast.success(`Téléchargement de "${file.name}" démarré`)
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error)
      toast.error('Erreur lors du téléchargement du fichier')
    }
  }

  /**
   * Suppression d'un fichier
   * @param {number} fileId - ID du fichier à supprimer
   */
  const deleteFile = async (fileId) => {
    try {
      await documentService.deleteFile(fileId)
      toast.success('Fichier supprimé avec succès')
      await loadFolderContents(currentFolderId.value) // Rechargement du contenu
      return true
    } catch (error) {
      console.error('Erreur lors de la suppression du fichier:', error)
      toast.error('Erreur lors de la suppression du fichier')
      return false
    }
  }

  /**
   * Recherche de fichiers et dossiers
   * @param {string} query - Terme de recherche
   * @param {string} type - Type de fichier (optionnel)
   */
  const searchFiles = async (query, type = '') => {
    if (!query.trim() && !type) {
      searchResults.value = null
      searchQuery.value = ''
      filterType.value = ''
      return
    }
    
    isLoading.value = true
    searchQuery.value = query
    filterType.value = type
    
    try {
      const response = await documentService.searchFiles({
        query: query.trim(),
        type: type,
        folderId: currentFolderId.value
      })
      
      if (response.success) {
        searchResults.value = response.data
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error)
      toast.error('Erreur lors de la recherche')
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Effacement de la recherche
   */
  const clearSearch = () => {
    searchQuery.value = ''
    filterType.value = ''
    searchResults.value = null
  }

  /**
   * Chargement des statistiques système
   */
  const loadSystemStats = async () => {
    try {
      const response = await documentService.getSystemStats()
      if (response.success) {
        systemStats.value = response.data
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error)
    }
  }

  /**
   * GESTION DE LA SÉLECTION
   */
  
  /**
   * Sélection/désélection d'un item
   * @param {Object} item - Item à sélectionner (fichier ou dossier)
   * @param {boolean} selected - État de sélection
   */
  const toggleSelection = (item, selected) => {
    const itemId = `${item.type || 'file'}_${item.id}`
    
    if (selected) {
      if (!selectedItems.value.find(i => i.id === itemId)) {
        selectedItems.value.push({
          id: itemId,
          type: item.type || 'file',
          originalId: item.id,
          name: item.name,
          data: item
        })
      }
    } else {
      selectedItems.value = selectedItems.value.filter(i => i.id !== itemId)
    }
  }

  /**
   * Sélection de tous les items
   */
  const selectAll = () => {
    clearSelection()
    
    // Sélection de tous les dossiers
    filteredFolders.value.forEach(folder => {
      toggleSelection({ ...folder, type: 'folder' }, true)
    })
    
    // Sélection de tous les fichiers
    filteredFiles.value.forEach(file => {
      toggleSelection({ ...file, type: 'file' }, true)
    })
  }

  /**
   * Désélection de tous les items
   */
  const clearSelection = () => {
    selectedItems.value = []
  }

  /**
   * Suppression des items sélectionnés
   */
  const deleteSelected = async () => {
    if (!hasSelection.value) return false
    
    const items = [...selectedItems.value]
    let successCount = 0
    
    for (const item of items) {
      try {
        if (item.type === 'folder') {
          await documentService.deleteFolder(item.originalId)
        } else {
          await documentService.deleteFile(item.originalId)
        }
        successCount++
      } catch (error) {
        console.error(`Erreur lors de la suppression de ${item.name}:`, error)
      }
    }
    
    if (successCount > 0) {
      toast.success(`${successCount} élément(s) supprimé(s)`)
      clearSelection()
      await loadFolderContents(currentFolderId.value)
    }
    
    return successCount === items.length
  }

  /**
   * PARAMÈTRES DE VUE
   */
  
  /**
   * Changement du mode d'affichage
   * @param {string} mode - 'grid' ou 'list'
   */
  const setViewMode = (mode) => {
    viewMode.value = mode
    localStorage.setItem('nas_view_mode', mode)
  }

  /**
   * Changement des paramètres de tri
   * @param {string} field - Champ de tri
   * @param {string} order - Ordre de tri ('asc' ou 'desc')
   */
  const setSorting = (field, order = null) => {
    if (sortBy.value === field && order === null) {
      // Inversion de l'ordre si même champ
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortBy.value = field
      if (order) sortOrder.value = order
    }
    
    // Sauvegarde des préférences
    localStorage.setItem('nas_sort_by', sortBy.value)
    localStorage.setItem('nas_sort_order', sortOrder.value)
  }

  /**
   * Initialisation des préférences utilisateur
   */
  const initializePreferences = () => {
    // Récupération des préférences sauvegardées
    const savedViewMode = localStorage.getItem('nas_view_mode')
    const savedSortBy = localStorage.getItem('nas_sort_by')
    const savedSortOrder = localStorage.getItem('nas_sort_order')
    
    if (savedViewMode) viewMode.value = savedViewMode
    if (savedSortBy) sortBy.value = savedSortBy
    if (savedSortOrder) sortOrder.value = savedSortOrder
  }

  // Export des propriétés et méthodes du store
  return {
    // État
    currentFolder,
    folderContents,
    breadcrumbs,
    isLoading,
    searchResults,
    selectedItems,
    uploadProgress,
    isUploading,
    viewMode,
    sortBy,
    sortOrder,
    searchQuery,
    filterType,
    systemStats,
    
    // Getters
    isSearchActive,
    currentFolderId,
    filteredFiles,
    filteredFolders,
    hasSelection,
    selectionCount,
    
    // Actions
    loadFolderContents,
    navigateToFolder,
    createFolder,
    deleteFolder,
    uploadFiles,
    downloadFile,
    deleteFile,
    searchFiles,
    clearSearch,
    loadSystemStats,
    toggleSelection,
    selectAll,
    clearSelection,
    deleteSelected,
    setViewMode,
    setSorting,
    initializePreferences
  }
})
