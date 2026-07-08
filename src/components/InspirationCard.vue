<script setup>
import { TAG_COLOR_MAP } from '../utils/constants.js'

const props = defineProps({
  title: {
    type: String,
    default: '无题灵感',
  },
  content: {
    type: String,
    default: '',
  },
  tag: {
    type: String,
    default: '随笔',
  },
  color: {
    type: String,
    default: '',
  },
  createTime: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['delete'])

/**
 * 获取顶部 accent bar 的样式
 * 优先使用 TAG_COLOR_MAP 映射，未匹配则回退到传入的 Tailwind class
 */
function getBarStyle() {
  const mapped = TAG_COLOR_MAP[props.tag]
  if (mapped) {
    return { backgroundColor: mapped.bg }
  }
  return {}
}

/**
 * 获取标签徽章的样式（背景色 + 文字色）
 */
function getTagStyle() {
  const mapped = TAG_COLOR_MAP[props.tag]
  if (mapped) {
    return {
      backgroundColor: mapped.bg,
      color: mapped.text,
    }
  }
  return {}
}

/**
 * 处理删除操作 - 二次确认后触发 delete 事件
 */
function handleDelete() {
  if (typeof window !== 'undefined' && window.confirm) {
    const confirmed = window.confirm('请确认是否删除灵感，删除后不可恢复')
    if (confirmed) {
      emit('delete', { createTime: props.createTime, title: props.title })
    }
  }
}
</script>

<template>
  <div class="group relative bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden backdrop-blur-sm hover:border-slate-600/50 transition-all hover:shadow-xl hover:shadow-slate-900/50 hover:-translate-y-1">
    <!-- Color accent bar -->
    <div
      class="h-1.5 w-full"
      :style="getBarStyle()"
      :class="[!getBarStyle().backgroundColor ? color : '']"
    ></div>

    <!-- Delete icon -->
    <button
      @click.stop="handleDelete"
      class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400"
      title="删除"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      </svg>
    </button>

    <div class="p-5">
      <!-- Tag -->
      <span
        class="inline-block px-3 py-1 text-xs font-medium rounded-full mb-3"
        :style="getTagStyle()"
      >
        #{{ tag }}
      </span>

      <!-- Title -->
      <h3 class="text-lg font-semibold text-white mb-2 group-hover:text-amber-300 transition-colors pr-6">
        {{ title }}
      </h3>

      <!-- Content -->
      <p class="text-slate-400 text-sm leading-relaxed">
        {{ content }}
      </p>
    </div>
  </div>
</template>
