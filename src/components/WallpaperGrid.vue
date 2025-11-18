<template>
  <div class="grid w-full gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
    <div
      v-for="(wallpaper, index) in wallpapers"
      :key="wallpaper.id"
      class="group relative rounded-xl overflow-hidden cursor-pointer border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:shadow-blue-200/70 transform hover:-translate-y-1 transition-all duration-300"
      style="padding-bottom: 56.25%"
      @click="handleImageClick(wallpaper, index)"
    >
      <!-- 图片容器 -->
      <div class="absolute inset-0">
        <img
          v-lazy="getImageUrl(wallpaper)"
          :alt="wallpaper.utag"
          src="@/assets/images/lazy.svg"
          class="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
        />
      </div>

      <!-- 悬浮遮罩层 -->
      <div class="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <!-- 底部信息 -->
        <div class="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <p class="text-sm font-semibold truncate drop-shadow-lg mb-1">
            {{ wallpaper.utag }}
          </p>
          <div v-if="wallpaper.resolution" class="flex items-center gap-1.5 text-xs text-blue-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
              <path d="M3 9h18"/>
              <path d="M9 21V9"/>
            </svg>
            <span>{{ wallpaper.resolution }}</span>
          </div>
        </div>

        <!-- 顶部按钮 -->
        <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75">
          <Button
            size="icon"
            variant="secondary"
            class="h-9 w-9 rounded-full bg-black/60 backdrop-blur-md border border-white/20 hover:bg-black/80 hover:border-white/40 text-white shadow-xl hover:scale-110 transition-all"
            @click.stop="handleCopyUrl(wallpaper)"
            title="复制链接"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWallpaperStore } from '@/stores/wallpaper'
import { useUIStore } from '@/stores/ui'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import type { Wallpaper } from '@/stores/wallpaper'

const wallpaperStore = useWallpaperStore()
const uiStore = useUIStore()

defineProps<{
  wallpapers: Wallpaper[]
}>()

const getImageUrl = (wallpaper: Wallpaper) => {
  const url = (wallpaper.img_1024_768 && wallpaper.img_1024_768 !== 'no_data')
    ? wallpaper.img_1024_768
    : wallpaper.url
  return url.replace(/http:\/\//g, 'https://')
}

const handleImageClick = (wallpaper: Wallpaper, index: number) => {
  uiStore.openViewer(wallpaper, index, wallpaperStore.wallpapers.length)
}

const handleCopyUrl = async (wallpaper: Wallpaper) => {
  const url = wallpaper.url.replace(/http:\/\//g, 'https://')
  try {
    await navigator.clipboard.writeText(url)
    toast.success('复制原图URL成功')
  } catch (err) {
    // 降级方案
    const textarea = document.createElement('textarea')
    textarea.value = url
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    toast.success('复制原图URL成功')
  }
}
</script>
