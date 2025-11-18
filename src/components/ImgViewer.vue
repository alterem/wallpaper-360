<template>
  <Dialog v-model:open="uiStore.viewerOpen">
    <DialogContent
      :hide-close-button="true"
      :class="dialogContentClass"
      @escape-key-down="handleClose"
    >
      <DialogTitle class="sr-only">图片预览</DialogTitle>
      <DialogDescription class="sr-only">
        {{ uiStore.currentWallpaper?.utag || '壁纸预览' }}
      </DialogDescription>
      <div class="relative w-full h-full flex items-center justify-center p-6 lg:p-8">
        <!-- 图片容器 -->
        <div
          :class="[
            'relative flex items-center justify-center w-full h-full',
            imageWrapperClass,
          ]"
        >
          <ImageLoader
            v-if="uiStore.currentWallpaper"
            :src="imageUrl"
            :desc="uiStore.currentWallpaper.utag"
          />

          <!-- 分辨率标签 -->
          <div
            v-if="uiStore.currentWallpaper?.resolution"
            class="absolute bottom-2 right-2 bg-black/60 text-white text-xs rounded px-5! h-8 flex items-center justify-center mix-blend-hard-light"
          >
            {{ uiStore.currentWallpaper.resolution }}
          </div>

          <!-- 描述标签 -->
          <div
            v-if="uiStore.currentWallpaper?.utag"
            class="absolute bottom-2 left-2 bg-black/60 text-white text-xs rounded max-w-md truncate px-5! h-8 flex items-center justify-center mix-blend-hard-light"
          >
            {{ uiStore.currentWallpaper.utag }}
          </div>
        </div>

        <!-- 上一张按钮 -->
        <Button
          v-if="uiStore.currentIndex > 0"
          variant="ghost"
          size="icon"
          class="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-black/40 hover:bg-black/60 text-white"
          @click="handlePrev"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </Button>

        <!-- 下一张按钮 -->
        <Button
          v-if="uiStore.currentIndex < wallpaperStore.wallpapers.length - 1"
          variant="ghost"
          size="icon"
          class="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-black/40 hover:bg-black/60 text-white"
          @click="handleNext"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </Button>

        <!-- 顶部工具栏 -->
        <div class="absolute top-4 right-4 flex gap-2">
          <!-- 下载按钮 -->
          <Button
            variant="ghost"
            size="icon"
            class="h-10 w-10 bg-black/40 hover:bg-black/60 text-white"
            @click="handleDownload"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" x2="12" y1="15" y2="3"/>
            </svg>
          </Button>

          <!-- 复制URL按钮 -->
          <Button
            variant="ghost"
            size="icon"
            class="h-10 w-10 bg-black/40 hover:bg-black/60 text-white"
            @click="handleCopyUrl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
            </svg>
          </Button>

          <!-- 关闭按钮 -->
          <Button
            variant="ghost"
            size="icon"
            class="h-10 w-10 bg-black/40 hover:bg-black/60 text-white"
            @click="handleClose"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" x2="6" y1="6" y2="18"/>
              <line x1="6" x2="18" y1="6" y2="18"/>
            </svg>
          </Button>
        </div>

        <!-- 图片计数器 -->
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm rounded px-5! h-8 flex items-center justify-center mix-blend-hard-light">
          {{ uiStore.currentIndex + 1 }} / {{ wallpaperStore.wallpapers.length }}
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useWallpaperStore } from '@/stores/wallpaper'
import { useUIStore } from '@/stores/ui'
import { toast } from 'vue-sonner'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import ImageLoader from '@/components/ImageLoader.vue'

const wallpaperStore = useWallpaperStore()
const uiStore = useUIStore()

const imageUrl = computed(() => {
  if (!uiStore.currentWallpaper) return ''
  const url = uiStore.currentWallpaper.url || ''
  return url.replace(/http:\/\//g, 'https://')
})

const viewerOrientation = computed(() => {
  const resolution = uiStore.currentWallpaper?.resolution
  if (resolution) {
    const match = resolution.match(/(\d+)\s*[xX×]\s*(\d+)/)
    if (match) {
      const width = Number(match[1])
      const height = Number(match[2])
      if (width && height) {
        if (width === height) return 'square'
        return width > height ? 'landscape' : 'portrait'
      }
    }
  }
  return 'landscape'
})

const dialogContentClass = computed(() => {
  const base = 'p-0 bg-black/95 border-slate-700 rounded-2xl lg:rounded-3xl w-full'
  switch (viewerOrientation.value) {
    case 'portrait':
      return `${base} max-w-[92vw] max-h-[94vh] lg:max-w-3xl`
    case 'square':
      return `${base} max-w-[94vw] max-h-[92vh] lg:max-w-4xl`
    default:
      return `${base} max-w-[98vw] max-h-[88vh] lg:max-w-[1300px]`
  }
})

const imageWrapperClass = computed(() => {
  switch (viewerOrientation.value) {
    case 'portrait':
      return 'max-w-full sm:max-w-[75vw] max-h-full'
    case 'square':
      return 'max-w-full sm:max-w-[82vw] max-h-full'
    default:
      return 'max-w-full sm:max-w-[96vw] max-h-full'
  }
})

const handleClose = () => {
  uiStore.closeViewer()
}

const handlePrev = () => {
  uiStore.prevImage(wallpaperStore.wallpapers)
}

const handleNext = () => {
  uiStore.nextImage(wallpaperStore.wallpapers)
}

const handleDownload = async () => {
  if (!imageUrl.value) return

  const fileName = `wallpaper-${uiStore.currentWallpaper?.id || 'image'}.jpg`

  try {
    const response = await fetch(imageUrl.value, { mode: 'cors' })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const blob = await response.blob()
    const objectUrl = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = objectUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(objectUrl)

    toast.success('下载已开始')
  } catch (error) {
    const link = document.createElement('a')
    link.href = imageUrl.value
    link.rel = 'noopener'
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.error('图片源不支持直接下载，已在新标签页打开')
  }
}

const handleCopyUrl = async () => {
  if (imageUrl.value) {
    try {
      await navigator.clipboard.writeText(imageUrl.value)
      toast.success('复制原图URL成功')
    } catch (err) {
      // 降级方案
      const textarea = document.createElement('textarea')
      textarea.value = imageUrl.value
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      toast.success('复制原图URL成功')
    }
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (!uiStore.viewerOpen) return

  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    handlePrev()
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    handleNext()
  } else if (e.key === 'Escape') {
    e.preventDefault()
    handleClose()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>
