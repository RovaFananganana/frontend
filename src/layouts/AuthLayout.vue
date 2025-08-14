<template>
  <!-- Layout d'authentification avec design moderne et responsive -->
  <div class="min-h-screen flex">
    
    <!-- Panel gauche avec branding et informations -->
    <div class="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
      
      <!-- Background pattern décoratif -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,<svg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg><g fill=none fill-rule=evenodd><g fill=%23ffffff fill-opacity=0.1><path d=m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%27/></g></g></svg>')"></div>
      </div>
      
      <!-- Contenu du panel -->
      <div class="relative z-10 flex flex-col justify-center px-8 xl:px-12">
        
        <!-- Logo et titre -->
        <div class="mb-8">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <ServerIcon class="w-8 h-8 text-white" />
            </div>
            <div class="ml-4">
              <h1 class="text-2xl font-bold text-white">{{ appName }}</h1>
              <p class="text-primary-100">Serveur de documents NAS</p>
            </div>
          </div>
        </div>

        <!-- Fonctionnalités mises en avant -->
        <div class="space-y-6">
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
              <MagnifyingGlassIcon class="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-white mb-1">Recherche avancée</h3>
              <p class="text-primary-100 text-sm leading-relaxed">
                Trouvez instantanément vos documents grâce à notre moteur
                de recherche intelligent.
              </p>
            </div>
          </div>
        </div>

        <!-- Statistiques du système (si disponibles) -->
        <div v-if="systemStats && showStats" class="mt-12 grid grid-cols-3 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-white">{{ formatNumber(systemStats.totalFiles) }}</div>
            <div class="text-xs text-primary-100">Fichiers</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-white">{{ formatFileSize(systemStats.totalSize) }}</div>
            <div class="text-xs text-primary-100">Stockage</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-white">{{ formatNumber(systemStats.totalUsers) }}</div>
            <div class="text-xs text-primary-100">Utilisateurs</div>
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
    <div class="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white">
      
      <!-- Logo mobile -->
      <div class="lg:hidden flex items-center justify-center mb-8">
        <div class="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
          <ServerIcon class="w-6 h-6 text-white" />
        </div>
        <h1 class="ml-3 text-xl font-bold text-secondary-900">{{ appName }}</h1>
      </div>

      <!-- Contenu principal du formulaire -->
      <div class="mx-auto w-full max-w-sm lg:w-96">
        
        <!-- Indicateur de connectivité -->
        <div v-if="!isOnline" class="mb-4 p-3 bg-warning-50 border border-warning-200 rounded-lg">
          <div class="flex items-center">
            <ExclamationTriangleIcon class="w-5 h-5 text-warning-600 mr-2" />
            <span class="text-sm text-warning-700">Connexion internet indisponible</span>
          </div>
        </div>

        <!-- Slot pour le contenu de la page d'authentification -->
        <div class="transition-all duration-300 ease-in-out">
          <slot />
        </div>

        <!-- Informations supplémentaires -->
        <div class="mt-8 text-center">
          <p class="text-xs text-secondary-500">
            Sécurisé par SSL • Version {{ appVersion }}
          </p>
          <div class="mt-4 flex justify-center space-x-4 text-xs text-secondary-400">
            <a href="#" class="hover:text-primary-600 transition-colors">
              Conditions d'utilisation
            </a>
            <span>•</span>
            <a href="#" class="hover:text-primary-600 transition-colors">
              Politique de confidentialité
            </a>
            <span>•</span>
            <a href="#" class="hover:text-primary-600 transition-colors">
              Support
            </a>
          </div>
        </div>

      </div>

      <!-- Footer avec informations techniques -->
      <div class="mt-auto pt-8 pb-6">
        <div class="text-center text-xs text-secondary-400">
          <p class="mb-2">Compatible avec les navigateurs modernes</p>
          <div class="flex justify-center space-x-4">
            <span>Chrome 90+</span>
            <span>Firefox 88+</span>
            <span>Safari 14+</span>
            <span>Edge 90+</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Message de maintenance si applicable -->
    <MaintenanceNotice 
      v-if="showMaintenanceNotice"
      :message="maintenanceMessage"
      :scheduled-time="maintenanceTime"
      @dismiss="dismissMaintenanceNotice"
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

      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div')
        particle.className = 'absolute w-2 h-2 bg-white opacity-10 rounded-full'
        particle.style.left = Math.random() * 100 + '%'
        particle.style.top = Math.random() * 100 + '%'
        particle.style.animation = `float-${Math.floor(Math.random() * 3) + 1} ${Math.random() * 10 + 10}s linear infinite`
        leftPanel.appendChild(particle)
      }
    }

    // Gestion du mode sombre (si implémenté)
    const handleThemeChange = () => {
      const isDark = document.documentElement.classList.contains('dark')
      // Adapter les couleurs si nécessaire
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
      }, 5000)
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
  0%, 100% { transform: translateY(0px) translateX(0px); }
  25% { transform: translateY(-20px) translateX(10px); }
  50% { transform: translateY(-10px) translateX(-5px); }
  75% { transform: translateY(-30px) translateX(5px); }
}

@keyframes float-2 {
  0%, 100% { transform: translateY(0px) translateX(0px); }
  33% { transform: translateY(-25px) translateX(-10px); }
  66% { transform: translateY(-15px) translateX(15px); }
}

@keyframes float-3 {
  0%, 100% { transform: translateY(0px) translateX(0px); }
  50% { transform: translateY(-35px) translateX(-20px); }
}

/* Animation pour l'entrée des éléments */
.auth-animate {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease-out;
}

.animate-slide-up {
  opacity: 1;
  transform: translateY(0);
}

/* Effet de survol pour les liens */
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

/* Responsive design amélioré */
@media (max-width: 1023px) {
  .lg\\:flex-1 {
    display: none;
  }
}

/* Mode sombre (si implémenté) */
.dark .bg-white {
  @apply bg-secondary-900;
}

.dark .text-secondary-900 {
  @apply text-white;
}

.dark .text-secondary-500 {
  @apply text-secondary-400;
}

/* Amélioration de l'accessibilité */
@media (prefers-reduced-motion: reduce) {
  .auth-animate,
  .animate-slide-up {
    transition: none;
    animation: none;
  }
  
  .absolute.w-2.h-2 {
    display: none;
  }
}

/* Optimisation pour l'impression */
@media print {
  .lg\\:flex-1,
  .mt-auto,
  .absolute {
    display: none;
  }
}

/* Effet de focus amélioré pour l'accessibilité */
*:focus-visible {
  outline: 2px solid theme('colors.primary.500');
  outline-offset: 2px;
  border-radius: 4px;
}
</style>