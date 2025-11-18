import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import getImglist from '@/api/imglist'
import searchImgs from '@/api/search'

export interface Wallpaper {
  id: string
  url: string
  img_1024_768?: string
  utag: string
  resolution?: string
  [key: string]: any
}

export const useWallpaperStore = defineStore('wallpaper', () => {
  // State
  const currentCategory = ref(10)
  const wallpapers = ref<Wallpaper[]>([])
  const start = ref(0)
  const isLoading = ref(false)
  const hasMore = ref(true)
  const isSearchMode = ref(false)
  const searchKeyword = ref('')
  const error = ref<string | null>(null)

  // Getters
  const totalWallpapers = computed(() => wallpapers.value.length)
  const isLoadingMore = computed(() => isLoading.value && wallpapers.value.length > 0)

  // Actions
  const loadWallpapers = async () => {
    if (isLoading.value || !hasMore.value) return

    isLoading.value = true
    error.value = null

    try {
      if (isSearchMode.value) {
        const res = await searchImgs(start.value, searchKeyword.value)
        if (res.errno === '0' && res.data) {
          wallpapers.value = wallpapers.value.concat(res.data)
          start.value += res.data.length
          hasMore.value = Number(res.total) > wallpapers.value.length
        }
      } else {
        const res = await getImglist(currentCategory.value, start.value)
        if (res.errno === '0' && res.data) {
          wallpapers.value = wallpapers.value.concat(res.data)
          start.value += res.data.length
          hasMore.value = Number(res.total) > wallpapers.value.length
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '加载失败'
      console.error('Failed to load wallpapers:', err)
    } finally {
      isLoading.value = false
    }
  }

  const changeCategory = async (categoryId: number) => {
    currentCategory.value = categoryId
    wallpapers.value = []
    start.value = 0
    isSearchMode.value = false
    hasMore.value = true
    await loadWallpapers()
  }

  const searchWallpapers = async (keyword: string) => {
    searchKeyword.value = keyword
    isSearchMode.value = true
    wallpapers.value = []
    start.value = 0
    hasMore.value = true
    await loadWallpapers()
  }

  const reset = () => {
    currentCategory.value = 10
    wallpapers.value = []
    start.value = 0
    isLoading.value = false
    hasMore.value = true
    isSearchMode.value = false
    searchKeyword.value = ''
    error.value = null
  }

  return {
    // State
    currentCategory,
    wallpapers,
    start,
    isLoading,
    hasMore,
    isSearchMode,
    searchKeyword,
    error,
    // Getters
    totalWallpapers,
    isLoadingMore,
    // Actions
    loadWallpapers,
    changeCategory,
    searchWallpapers,
    reset
  }
})
