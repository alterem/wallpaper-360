<template>
  <Sheet v-model:open="uiStore.sidebarOpen">
    <SheetTrigger as-child>
      <Button
        variant="outline"
        class="flex items-center gap-2 h-10 rounded-full border border-slate-200 bg-white w-20 shadow-sm text-slate-700 hover:bg-slate-100"
        @click="uiStore.openSidebar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" x2="21" y1="6" y2="6"/>
          <line x1="3" x2="21" y1="12" y2="12"/>
          <line x1="3" x2="21" y1="18" y2="18"/>
        </svg>
        <span class="hidden sm:inline text-sm font-medium">分类</span>
      </Button>
    </SheetTrigger>

    <SheetContent
      side="top"
      class="w-full max-h-[80vh] overflow-y-auto bg-white text-slate-900 border-b border-slate-200"
    >
      <SheetHeader>
        <SheetTitle class="text-xl text-slate-900">壁纸分类</SheetTitle>
        <SheetDescription class="text-slate-600">
          搜索或选择分类浏览壁纸
        </SheetDescription>
      </SheetHeader>

      <div class="mt-6 space-y-6">
        <!-- 搜索框 -->
        <div class="relative max-w-100! mx-auto!">
          <Input
            v-model="keyword"
            type="text"
            placeholder="输入关键词回车搜索"
            class="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 pr-10 shadow-sm focus:border-blue-400 focus:ring-blue-200"
            @keydown.enter="handleSearch"
          />
          <svg
            class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
        </div>

        <!-- 分类网格 -->
        <div class="grid grid-cols-2 gap-3 m-10!">
          <Button
            v-for="item in categories"
            :key="item.id"
            variant="outline"
            size="lg"
            class="w-full rounded-xl text-base font-semibold transition-all duration-200"
            :class="isActiveCategory(item.id)
              ? 'border-blue-500 bg-blue-600 text-white shadow-lg hover:bg-blue-600/90 hover:text-white'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-600'"
            @click="handleCategoryChange(item.id)"
          >
            <span class="truncate">{{ item.name }}</span>
          </Button>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useWallpaperStore } from '@/stores/wallpaper'
import { useUIStore } from '@/stores/ui'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import categories from '@/assets/data.json'

const wallpaperStore = useWallpaperStore()
const uiStore = useUIStore()
const keyword = ref('')

const handleSearch = async () => {
  if (keyword.value.trim()) {
    await wallpaperStore.searchWallpapers(keyword.value.trim())
    uiStore.closeSidebar()
    keyword.value = ''
  }
}

const handleCategoryChange = async (id: string) => {
  await wallpaperStore.changeCategory(Number(id))
  uiStore.closeSidebar()
}

const isActiveCategory = (id: string) =>
  wallpaperStore.currentCategory === Number(id)
</script>
