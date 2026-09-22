<script setup>
import { ref } from 'vue'
import TaskCard from './TaskCard.vue'

defineProps({
  status: { type: Object, required: true },
  tasks: { type: Array, default: () => [] },
})

const emit = defineEmits(['drop-task', 'edit', 'delete'])

const dropActive = ref(false)
let dragDepth = 0

function onDragEnter() {
  dragDepth += 1
  dropActive.value = true
}

function onDragLeave() {
  dragDepth = Math.max(0, dragDepth - 1)
  if (dragDepth === 0) dropActive.value = false
}

function onDrop(event) {
  dragDepth = 0
  dropActive.value = false
  const taskId = event.dataTransfer.getData('text/plain')
  if (taskId) emit('drop-task', taskId)
}
</script>

<template>
  <section
    class="flex flex-col rounded-xl border bg-slate-200/40 transition-colors"
    :class="
      dropActive
        ? 'border-blue-400 bg-blue-100/50 dark:border-blue-500 dark:bg-blue-500/10'
        : 'border-slate-200 dark:border-slate-800'
    "
    @dragover.prevent
    @dragenter.prevent="onDragEnter"
    @dragleave="onDragLeave"
    @drop.prevent="onDrop"
  >
    <header class="flex items-center justify-between gap-2 px-4 pb-2 pt-4">
      <div class="flex items-center gap-2">
        <span class="size-2 rounded-full" :class="status.dot" aria-hidden="true"></span>
        <h2 class="text-sm font-semibold">{{ status.label }}</h2>
      </div>
      <span
        class="min-w-6 rounded-full bg-white px-2 py-0.5 text-center text-xs font-medium text-slate-500 tabular-nums dark:bg-slate-800 dark:text-slate-400"
      >
        {{ tasks.length }}
      </span>
    </header>

    <div class="flex min-h-28 flex-1 flex-col gap-2 px-3 pb-3">
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @edit="emit('edit', $event)"
        @delete="emit('delete', $event)"
      />
      <div
        v-if="!tasks.length"
        class="grid flex-1 place-items-center rounded-lg border border-dashed px-4 py-8"
        :class="dropActive ? 'border-blue-400' : 'border-slate-300 dark:border-slate-700'"
      >
        <p class="text-center text-xs leading-5 text-slate-400 dark:text-slate-500">
          把卡片拖到这里<br />或点击右上角「新建任务」
        </p>
      </div>
    </div>
  </section>
</template>
