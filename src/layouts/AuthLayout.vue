<template>
  <!-- Layout d'authentification avec design moderne et responsive -->
  <div class="min-h-screen flex">
    
    <!-- Panel gauche avec branding et informations -->
    <div class="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
      
      <!-- Background pattern décoratif -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,<svg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg><g fill=none fill-rule=evenodd><g fill=%23ffffff fill-opacity=0.1><path d=m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%27/></g></g></svg>')"></div>
      </div>
      
      <!-- Contenu du panel avec nouvelle structure -->
      <div class="relative z-10 flex flex-col w-full">
        
        <!-- Header avec logo ASECNA et titre -->
        <div class="text-center py-8 px-8 xl:px-12 border-b border-white border-opacity-20">
          <!-- Logo ASECNA -->
          <div class="mb-6 flex justify-center">
              <img src="/logo-asecna-2021.png" alt="ASECNA" class="w-24 h-24" />
          </div>
          
          <!-- Titre centré -->
          <h1 class="text-3xl font-bold text-white mb-2">{{ appName }}</h1>
          </div>

        <!-- Zone centrale flexible -->
        <div class="flex-1 flex flex-col justify-center px-8 xl:px-12 py-8">
          
          <!-- Recherche en haut à gauche de cette section -->
          <!-- <div class="mb-8">
            <div class="flex items-center space-x-3 mb-6">
              <div class="flex-shrink-0 w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <MagnifyingGlassIcon class="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 class="text-xl font-semibold text-white">Recherche avancée</h3>
                <p class="text-primary-100 text-sm">
                  Trouvez instantanément vos documents
                </p>
              </div>
            </div>
          </div> -->

          <!-- Fonctionnalités mises en avant -->
          <div class="space-y-6">
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <MagnifyingGlassIcon class="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-white mb-1">Recherche avancée</h3>
                <p class="text-primary-100 text-sm leading-relaxed">
                  Trouvez instantanément vos documents
                </p>
              </div>
            </div>


            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <CloudIcon class="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-white mb-1">Stockage sécurisé</h3>
                <p class="text-primary-100 text-sm leading-relaxed">
                  Vos fichiers sont protégés avec un chiffrement de niveau entreprise
                  et des sauvegardes automatiques.
                </p>
              </div>
            </div>
            
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <UsersIcon class="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-white mb-1">Collaboration</h3>
                <p class="text-primary-100 text-sm leading-relaxed">
                  Partagez et collaborez sur vos documents avec votre équipe
                  en temps réel.
                </p>
              </div>
            </div>
            
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <ServerIcon class="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-white mb-1">Synology RS819</h3>
                <p class="text-primary-100 text-sm leading-relaxed">
                  Infrastructure NAS professionnelle avec haute disponibilité
                  et performances optimales.
                </p>
              </div>
            </div>
          </div>

          <!-- Statistiques du système (si disponibles) -->
          <div v-if="systemStats && showStats" class="mt-8 grid grid-cols-3 gap-4">
            <div class="text-center bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <div class="text-2xl font-bold text-white">{{ formatNumber(systemStats.totalFiles) }}</div>
              <div class="text-xs text-primary-100">Fichiers</div>
            </div>
            <div class="text-center bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <div class="text-2xl font-bold text-white">{{ formatFileSize(systemStats.totalSize) }}</div>
              <div class="text-xs text-primary-100">Stockage</div>
            </div>
            <div class="text-center bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <div class="text-2xl font-bold text-white">{{ formatNumber(systemStats.totalUsers) }}</div>
              <div class="text-xs text-primary-100">Utilisateurs</div>
            </div>
          </div>
        </div>

        <!-- Footer du panel gauche -->
        <div class="px-8 xl:px-12 py-4 border-t border-white border-opacity-20">
          <div class="text-center text-primary-100 text-sm">
            <!-- <p class="mb-2">Solution de gestion documentaire</p> -->
            <div class="flex justify-center items-center space-x-2">
              <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span class="text-xs">Système opérationnel</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Effet de vagues en bas -->
      <div class="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
        <svg class="absolute bottom-0 w-full h-full" viewBox="0 0 1200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,106.7C960,117,1056,139,1152,138.7C1248,139,1344,117,1392,106.7L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" fill="white" fill-opacity="0.1"/>
        </svg>
      </div>
      
    </div>

    <!-- Panel droit avec formulaire d'authentification -->
    <div class="flex-1 flex flex-col bg-gray-50">
      
      <!-- Header mobile avec logo ASECNA -->
      <div class="lg:hidden bg-white shadow-sm border-b border-gray-200">
        <div class="px-4 sm:px-6 py-4">
          <div class="flex items-center justify-between">
            <!-- Logo ASECNA mobile -->
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <div class="text-white font-bold text-xs">ASECNA</div>
              </div>
              <div>
                <h1 class="text-lg font-bold text-gray-900">{{ appName }}</h1>
                <p class="text-xs text-gray-500">NAS Document Server</p>
              </div>
            </div>
            
            <!-- Indicateur de statut mobile -->
            <div class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span class="text-xs text-gray-500">En ligne</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenu principal centré -->
      <div class="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <!-- <div class="w-full max-w-md"> -->
          
          <!-- Indicateur de connectivité -->
          <div v-if="!isOnline" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex items-center">
              <ExclamationTriangleIcon class="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
              <div>
                <p class="text-sm font-medium text-red-800">Connexion interrompue</p>
                <p class="text-xs text-red-600 mt-1">Vérifiez votre connexion au NAS</p>
              </div>
            </div>
          </div>

          <!-- Slot pour le contenu de la page d'authentification -->
          <div>
            <div class="transition-all duration-300 ease-in-out">
              <slot />
            </div>
          </div>

          <!-- Informations supplémentaires -->
          <div class="mt-6 text-center">
            <div class="flex items-center justify-center space-x-2 mb-4">
              <div class="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                <div class="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <p class="text-xs text-gray-500">
                Sécurisé par SSL • Version {{ appVersion }}
              </p>
            </div>
            
            <div class="flex justify-center space-x-4 text-xs text-gray-400">
              <a href="#" class="hover:text-primary-600 transition-colors duration-200 hover:underline">
                Conditions d'utilisation
              </a>
              <span class="text-gray-300">•</span>
              <a href="#" class="hover:text-primary-600 transition-colors duration-200 hover:underline">
                Politique de confidentialité
              </a>
              <span class="text-gray-300">•</span>
              <a href="#" class="hover:text-primary-600 transition-colors duration-200 hover:underline">
                Support technique
              </a>
            </div>
          </div>

        <!-- </div> -->
      </div>

      <!-- Footer avec informations techniques -->
      <!-- <div class="bg-white border-t border-gray-200 py-4">
        <div class="px-4 sm:px-6 lg:px-20 xl:px-24">
          <div class="text-center text-xs text-gray-400">
            <p class="mb-2">Compatible avec les navigateurs modernes</p>
            <div class="flex justify-center space-x-6">
              <span class="flex items-center space-x-1">
                <div class="w-3 h-3 bg-green-400 rounded-full"></div>
                <span>Chrome 90+</span>
              </span>
              <span class="flex items-center space-x-1">
                <div class="w-3 h-3 bg-green-400 rounded-full"></div>
                <span>Firefox 88+</span>
              </span>
              <span class="flex items-center space-x-1">
                <div class="w-3 h-3 bg-green-400 rounded-full"></div>
                <span>Safari 14+</span>
              </span>
              <span class="flex items-center space-x-1">
                <div class="w-3 h-3 bg-green-400 rounded-full"></div>
                <span>Edge 90+</span>
              </span>
            </div>
          </div>
        </div>
      </div> -->

    </div>

    <!-- Message de maintenance si applicable -->
    <MaintenanceNotice 
      v-if="showMaintenanceNotice"
      :message="maintenanceMessage"
      :scheduled-time="maintenanceTime"
      @dismiss="dismissMaintenanceNotice"
      class="fixed inset-x-0 top-0 z-50"
    />

  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { 
  ServerIcon, 
  CloudIcon, 
  UsersIcon, 
  MagnifyingGlassIcon,
  ExclamationTriangleIcon 
} from '@heroicons/vue/24/outline'

// Import du composant de maintenance
import MaintenanceNotice from '@/components/MaintenanceNotice.vue'

export default {
  name: 'AuthLayout',
  components: {
    ServerIcon,
    CloudIcon,
    UsersIcon,
    MagnifyingGlassIcon,
    ExclamationTriangleIcon,
    MaintenanceNotice
  },

  setup() {
    // État réactif
    const isOnline = ref(navigator.onLine)
    const systemStats = ref(null)
    const showStats = ref(false)
    const showMaintenanceNotice = ref(false)
    const maintenanceMessage = ref('')
    const maintenanceTime = ref(null)

    // Configuration de l'application
    const appName = computed(() => 
      import.meta.env.VITE_APP_NAME || 'NAS Document Server'
    )
    
    const appVersion = computed(() => 
      import.meta.env.VITE_APP_VERSION || '1.0.0'
    )

    // Méthodes utilitaires
    const formatNumber = (num) => {
      if (!num) return '0'
      return new Intl.NumberFormat('fr-FR').format(num)
    }

    const formatFileSize = (bytes) => {
      if (!bytes) return '0 B'
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
    }

    // Gestion de la connectivité
    const handleOnline = () => {
      isOnline.value = true
    }

    const handleOffline = () => {
      isOnline.value = false
    }

    // Chargement des statistiques système anonymes
    const loadSystemStats = async () => {
      try {
        const response = await fetch('/api/public/stats')
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            systemStats.value = data.data
            showStats.value = true
          }
        }
      } catch (error) {
        // Erreur silencieuse - les stats ne sont pas critiques
        console.debug('Impossible de charger les statistiques publiques')
      }
    }

    // Vérification des notices de maintenance
    const checkMaintenanceNotice = async () => {
      try {
        const response = await fetch('/api/public/maintenance')
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data.scheduled) {
            maintenanceMessage.value = data.data.message
            maintenanceTime.value = data.data.scheduled_time
            showMaintenanceNotice.value = true
          }
        }
      } catch (error) {
        // Erreur silencieuse
        console.debug('Impossible de vérifier les maintenances')
      }
    }

    const dismissMaintenanceNotice = () => {
      showMaintenanceNotice.value = false
      localStorage.setItem('dismissed-maintenance', Date.now().toString())
    }

    // Effets visuels au chargement
    const initializeVisualEffects = () => {
      // Animation des éléments au chargement
      const elements = document.querySelectorAll('.auth-animate')
      elements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('animate-slide-up')
        }, index * 100)
      })

      // Particules flottantes (optionnel, pour un effet premium)
      if (window.innerWidth >= 1024) {
        createFloatingParticles()
      }
    }

    const createFloatingParticles = () => {
      const leftPanel = document.querySelector('.lg\\:flex-1')
      if (!leftPanel) return

      for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div')
        particle.className = 'absolute w-1 h-1 bg-white opacity-20 rounded-full'
        particle.style.left = Math.random() * 100 + '%'
        particle.style.top = Math.random() * 100 + '%'
        particle.style.animation = `float-${Math.floor(Math.random() * 3) + 1} ${Math.random() * 15 + 15}s linear infinite`
        leftPanel.appendChild(particle)
      }
    }

    onMounted(() => {
      // Event listeners pour la connectivité
      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)

      // Chargement des données non critiques
      loadSystemStats()
      checkMaintenanceNotice()

      // Effets visuels
      setTimeout(() => {
        initializeVisualEffects()
      }, 100)

      // Vérification périodique de la connectivité
      setInterval(() => {
        isOnline.value = navigator.onLine
      }, 10000)
    })

    return {
      // État
      isOnline,
      systemStats,
      showStats,
      showMaintenanceNotice,
      maintenanceMessage,
      maintenanceTime,

      // Computed
      appName,
      appVersion,

      // Méthodes
      formatNumber,
      formatFileSize,
      dismissMaintenanceNotice
    }
  }
}
</script>

<style scoped>
/* Animations personnalisées pour les particules */
@keyframes float-1 {
  0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
  25% { transform: translateY(-20px) translateX(10px) rotate(90deg); }
  50% { transform: translateY(-10px) translateX(-5px) rotate(180deg); }
  75% { transform: translateY(-30px) translateX(5px) rotate(270deg); }
}

@keyframes float-2 {
  0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
  33% { transform: translateY(-25px) translateX(-10px) scale(1.2); }
  66% { transform: translateY(-15px) translateX(15px) scale(0.8); }
}

@keyframes float-3 {
  0%, 100% { transform: translateY(0px) translateX(0px) opacity(0.2); }
  50% { transform: translateY(-35px) translateX(-20px) opacity(0.6); }
}

/* Animation pour l'entrée des éléments */
.auth-animate {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-slide-up {
  opacity: 1;
  transform: translateY(0);
}

/* Effets de survol améliorés */
a {
  position: relative;
  transition: all 0.3s ease;
}

a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: currentColor;
  transition: width 0.3s ease;
}

a:hover::after {
  width: 100%;
}

/* Amélioration des cartes de statistiques */
.grid > div {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.grid > div:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Style pour le formulaire d'authentification */
.bg-white.rounded-xl {
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.bg-white.rounded-xl:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* Responsive design amélioré */
@media (max-width: 1023px) {
  .lg\\:flex-1 {
    display: none;
  }
}

/* Amélioration de l'accessibilité */
@media (prefers-reduced-motion: reduce) {
  .auth-animate,
  .animate-slide-up,
  .grid > div,
  .bg-white.rounded-xl {
    transition: none;
    animation: none;
  }
  
  .absolute.w-1.h-1 {
    display: none;
  }
}

/* Optimisation pour l'impression */
@media print {
  .lg\\:flex-1,
  .bg-gray-50 > div:first-child,
  .bg-white.border-t,
  .fixed {
    display: none !important;
  }
  
  .bg-gray-50 {
    background: white;
  }
}

/* Effet de focus amélioré pour l'accessibilité */
*:focus-visible {
  outline: 2px solid theme('colors.primary.500');
  outline-offset: 2px;
  border-radius: 4px;
}

/* Animation du statut en ligne */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Personnalisation des scrollbars pour webkit */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.5);
}
</style>