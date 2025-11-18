<script setup lang="ts">
import { onMounted, onUnmounted, watch, computed, nextTick } from 'vue'
import { useWallpaperStore } from '@/stores/wallpaper'
import { toast } from 'vue-sonner'
import debounce from '@/utils/debounce'
import SideBar from '@/components/SideBar.vue'
import ImgViewer from '@/components/ImgViewer.vue'
import WallpaperGrid from '@/components/WallpaperGrid.vue'
import WallpaperSkeleton from '@/components/WallpaperSkeleton.vue'
import { Toaster } from '@/components/ui/sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import categories from '@/assets/data.json'

const wallpaperStore = useWallpaperStore()
// 获取当前分类名称
const currentCategory = computed(() => categories.find(cat => cat.id === String(wallpaperStore.currentCategory)) || null)
const currentCategoryName = computed(() => currentCategory.value?.name || '未知分类')
const currentCategoryTags = computed(() => {
  const tagString = currentCategory.value?.tag?.trim()
  return tagString ? tagString.split(/\s+/) : []
})

// 滚动加载
const handleScroll = debounce(() => {
  const bottomOfWindow =
    document.documentElement.offsetHeight -
    document.documentElement.scrollTop -
    window.innerHeight <= 500

  if (bottomOfWindow && wallpaperStore.hasMore && !wallpaperStore.isLoading) {
    wallpaperStore.loadWallpapers()
  }
}, 200)

// 监听错误状态
watch(() => wallpaperStore.error, (error) => {
  if (error) {
    toast.error(error)
  }
})

// 初始化
let isFillingContent = false

const ensureContentFilled = async () => {
  if (isFillingContent) return
  isFillingContent = true

  try {
    await nextTick()

    while (
      wallpaperStore.hasMore &&
      !wallpaperStore.isLoading &&
      document.documentElement.scrollHeight <= window.innerHeight + 200
    ) {
      const previousCount = wallpaperStore.wallpapers.length
      await wallpaperStore.loadWallpapers()
      await nextTick()

      if (wallpaperStore.wallpapers.length === previousCount) {
        break
      }
    }
  } finally {
    isFillingContent = false
  }
}

watch(
  () => wallpaperStore.wallpapers.length,
  async () => {
    if (!wallpaperStore.isLoading) {
      await ensureContentFilled()
    }
  }
)

onMounted(async () => {
  await wallpaperStore.loadWallpapers()
  await ensureContentFilled()
  window.addEventListener('scroll', handleScroll)
})

// 清理
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="min-h-screen bg-linear-to-br from-slate-100 via-white to-slate-200 text-slate-900">
    <!-- 头部 -->
    <header class="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-200">
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3 ml-20!">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
            <circle cx="9" cy="9" r="2"/>
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
          </svg>
          <div>
            <h1 class="text-2xl font-bold text-slate-900">壁纸库</h1>
            <p class="text-sm text-slate-600">发现精美壁纸，一键下载</p>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div v-if="wallpaperStore.isSearchMode" class="hidden sm:flex items-center gap-2">
            <Badge variant="secondary" class="gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.3-4.3"/>
              </svg>
              {{ wallpaperStore.searchKeyword }}
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              class="text-slate-500 hover:text-slate-900 h-7 px-2"
              @click="wallpaperStore.changeCategory(10)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" x2="6" y1="6" y2="18"/>
                <line x1="6" x2="18" y1="6" y2="18"/>
              </svg>
            </Button>
          </div>
          <div v-else class="hidden sm:flex items-center gap-4">
            <div class="flex flex-wrap items-center gap-2">
              <Badge class="bg-blue-600/10 text-blue-700 border-blue-300 w-20 h-10 flex flex-col items-center justify-center px-3 py-1.5 text-sm font-semibold">
                {{ currentCategoryName }}
              </Badge>
              <Badge class="bg-red-600/20 text-blue-700 border-blue-300 w-10 h-10 flex flex-col items-center justify-center px-3 py-1.5 text-sm font-semibold">
                {{ wallpaperStore.totalWallpapers }}
              </Badge>
            </div>
          </div>
          <SideBar />
        </div>
      </div>
    </header>

    <!-- 主内容区域 -->
    <main class="w-full mt-6! px-4! pb-12! lg:px-8! xl:px-12!">
      <template v-if="wallpaperStore.wallpapers.length === 0">
        <WallpaperSkeleton
          v-if="wallpaperStore.isLoading"
          :count="12"
        />

        <div
          v-else
          class="flex flex-col items-center justify-center py-20 text-slate-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="mb-4 opacity-50">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <p class="text-lg">暂无壁纸</p>
          <p class="text-sm mt-2">尝试搜索或切换分类</p>
        </div>
      </template>

      <template v-else>
        <!-- 壁纸网格 -->
        <WallpaperGrid :wallpapers="wallpaperStore.wallpapers" />

        <!-- 加载更多骨架屏 -->
        <div v-if="wallpaperStore.isLoadingMore" class="mt-8">
          <WallpaperSkeleton :count="8" />
        </div>
      </template>

      <!-- 加载完毕提示 -->
      <div
        v-if="!wallpaperStore.hasMore && wallpaperStore.wallpapers.length > 0"
        class="flex justify-center py-8"
      >
        <div class="bg-white/80 text-slate-600 px-6 py-3 rounded-full text-sm shadow">
          已加载全部壁纸
        </div>
      </div>
    </main>

    <!-- 图片查看器 -->
    <ImgViewer />

    <!-- Toast 通知 -->
    <Toaster
      position="top-center"
      :duration="3000"
    />
  </div>
</template>

<style>
/* 全局滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(148, 163, 184, 0.2);
}

::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.6);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(100, 116, 139, 0.7);
}
</style>
