<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { PRIORITIES } from '../composables/useTasks'

const props = defineProps({
  task: { type: Object, required: true },
})

const emit = defineEmits(['edit', 'delete'])

const priority = computed(
  () => PRIORITIES.find((p) => p.id === props.task.priority) ?? PRIORITIES[1],
)

const isDragging = ref(false)
const confirmingDelete = ref(false)
let confirmTimer = null

function onDragStart(event) {
  event.dataTransfer.setData('text/plain', props.task.id)
  event.dataTransfer.effectAllowed = 'move'
  isDragging.value = true
}

function onDragEnd() {
  isDragging.value = false
}

function shortDate(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

// 两步删除：第一次点击进入确认态，2.5 秒后自动复位
function requestDelete() {
  if (confirmingDelete.value) {
    clearTimeout(confirmTimer)
    confirmingDelete.value = false
    emit('delete', props.task.id)
    return
  }
  confirmingDelete.value = true
  confirmTimer = setTimeout(() => {
    confirmingDelete.value = false
  }, 2500)
}

onBeforeUnmount(() => clearTimeout(confirmTimer))
</script>

<template>
  <article
    draggable="true"
    class="group cursor-grab rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition duration-150 active:cursor-grabbing dark:border-slate-700/80 dark:bg-slate-800/90"
    :class="
      isDragging
        ? 'rotate-2 opacity-40'
        : 'hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none'
    "
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <div class="flex items-start justify-between gap-2">
      <h3 class="break-words text-sm font-medium leading-snug">{{ task.title }}</h3>
      <div class="flex shrink-0 items-center gap-0.5">
        <button
          type="button"
          class="grid size-6 place-items-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-500 dark:hover:bg-slate-700 dark:hover:text-slate-200"
          :aria-label="`编辑「${task.title}」`"
          @click="emit('edit', task)"
        >
          <svg
            class="size-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        </button>
        <button
          v-if="!confirmingDelete"
          type="button"
          class="grid size-6 place-items-center rounded-md text-slate-400 transition hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
          aria-label="删除任务"
          @click="requestDelete"
        >
          <svg
            class="size-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <polyline points="3 6 5 6 21 6" />
            <path
              d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
            />
          </svg>
        </button>
        <button
          v-else
          type="button"
          class="rounded-md bg-red-500 px-1.5 py-1 text-[11px] font-medium leading-none text-white transition hover:bg-red-600 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-red-500"
          @click="requestDelete"
        >
          确认删除
        </button>
      </div>
    </div>

    <p
      v-if="task.description"
      class="mt-1.5 whitespace-pre-wrap break-words text-xs leading-5 text-slate-500 dark:text-slate-400"
    >
      {{ task.description }}
    </p>

    <div class="mt-2.5 flex items-center justify-between gap-2">
      <span
        class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
        :class="priority.chip"
      >
        <span class="size-1.5 rounded-full" :class="priority.dot" aria-hidden="true"></span>
        {{ priority.label }}优先级
      </span>
      <time class="text-[11px] tabular-nums text-slate-400 dark:text-slate-500">
        {{ shortDate(task.updatedAt || task.createdAt) }}
      </time>
    </div>
  </article>
</template>
