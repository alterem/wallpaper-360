<template>
  <div class="grid w-full gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
    <div
      v-for="i in count"
      :key="i"
      class="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100"
      style="padding-bottom: 56.25%"
    >
      <div class="absolute inset-0">
        <Skeleton class="h-full w-full bg-slate-200" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton'

withDefaults(
  defineProps<{
    count?: number
  }>(),
  {
    count: 12
  }
)
</script>
