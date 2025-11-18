import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Wallpaper } from './wallpaper'

export const useUIStore = defineStore('ui', () => {
  // Viewer state
  const viewerOpen = ref(false)
  const currentWallpaper = ref<Wallpaper | null>(null)
  const currentIndex = ref(0)
  const totalImages = ref(0)

  // Sidebar state
  const sidebarOpen = ref(false)

  // Actions
  const openViewer = (wallpaper: Wallpaper, index: number, total: number) => {
    currentWallpaper.value = wallpaper
    currentIndex.value = index
    totalImages.value = total
    viewerOpen.value = true
  }

  const closeViewer = () => {
    viewerOpen.value = false
    currentWallpaper.value = null
    currentIndex.value = 0
  }

  const nextImage = (wallpapers: Wallpaper[]) => {
    if (currentIndex.value < wallpapers.length - 1) {
      currentIndex.value++
      currentWallpaper.value = wallpapers[currentIndex.value]!
    }
  }

  const prevImage = (wallpapers: Wallpaper[]) => {
    if (currentIndex.value > 0) {
      currentIndex.value--
      currentWallpaper.value = wallpapers[currentIndex.value]!
    }
  }

  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }

  const openSidebar = () => {
    sidebarOpen.value = true
  }

  const closeSidebar = () => {
    sidebarOpen.value = false
  }

  return {
    // Viewer state
    viewerOpen,
    currentWallpaper,
    currentIndex,
    totalImages,
    // Sidebar state
    sidebarOpen,
    // Actions
    openViewer,
    closeViewer,
    nextImage,
    prevImage,
    toggleSidebar,
    openSidebar,
    closeSidebar
  }
})
