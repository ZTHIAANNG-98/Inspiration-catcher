<script setup>
defineProps({
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
    default: 'from-violet-500 to-purple-600',
  },
})
</script>

<template>
  <div class="group relative bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden backdrop-blur-sm hover:border-slate-600/50 transition-all hover:shadow-xl hover:shadow-slate-900/50 hover:-translate-y-1">
    <!-- Color accent bar -->
    <div :class="['h-1.5 bg-gradient-to-r', color]"></div>

    <div class="p-5">
      <!-- Tag -->
      <span class="inline-block px-3 py-1 text-xs font-medium rounded-full bg-slate-700/50 text-slate-300 mb-3">
        #{{ tag }}
      </span>

      <!-- Title -->
      <h3 class="text-lg font-semibold text-white mb-2 group-hover:text-amber-300 transition-colors">
        {{ title }}
      </h3>

      <!-- Content -->
      <p class="text-slate-400 text-sm leading-relaxed">
        {{ content }}
      </p>
    </div>
  </div>
</template>
