<script setup>
import { nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { PRIORITIES, STATUSES } from '../composables/useTasks'

const props = defineProps({
  mode: { type: String, required: true }, // 'create' | 'edit'
  task: { type: Object, default: null },
})

const emit = defineEmits(['save', 'close'])

const isEdit = props.mode === 'edit'

const form = reactive({
  title: props.task?.title ?? '',
  description: props.task?.description ?? '',
  priority: props.task?.priority ?? 'medium',
  status: props.task?.status ?? 'todo',
})

const titleInput = ref(null)
const titleError = ref('')

function onKeydown(event) {
  if (event.key === 'Escape') emit('close')
}

onMounted(async () => {
  window.addEventListener('keydown', onKeydown)
  await nextTick()
  titleInput.value?.focus()
})

onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

function submit() {
  const title = form.title.trim()
  if (!title) {
    titleError.value = '标题不能为空'
    titleInput.value?.focus()
    return
  }
  emit('save', {
    title,
    description: form.description.trim(),
    priority: form.priority,
    ...(isEdit ? { status: form.status } : {}),
  })
}
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4 backdrop-blur-sm dark:bg-black/60"
      @click.self="emit('close')"
    >
      <form
        class="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-800"
        role="dialog"
        aria-modal="true"
        :aria-label="isEdit ? '编辑任务' : '新建任务'"
        @submit.prevent="submit"
      >
        <h2 class="text-base font-semibold">{{ isEdit ? '编辑任务' : '新建任务' }}</h2>

        <div class="mt-4 space-y-4">
          <div>
            <label
              for="task-title"
              class="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300"
            >
              标题 <span class="text-red-500">*</span>
            </label>
            <input
              id="task-title"
              ref="titleInput"
              v-model="form.title"
              type="text"
              maxlength="100"
              placeholder="例如：完成实验报告"
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-100"
              @input="titleError = ''"
            />
            <p v-if="titleError" class="mt-1 text-xs text-red-500">{{ titleError }}</p>
          </div>

          <div>
            <label
              for="task-desc"
              class="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300"
            >
              描述 <span class="text-slate-400">（选填）</span>
            </label>
            <textarea
              id="task-desc"
              v-model="form.description"
              rows="3"
              maxlength="500"
              placeholder="补充细节、验收标准、截止时间……"
              class="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-100"
            ></textarea>
          </div>

          <div>
            <span class="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">
              优先级
            </span>
            <div class="grid grid-cols-3 gap-2" role="radiogroup" aria-label="优先级">
              <button
                v-for="p in PRIORITIES"
                :key="p.id"
                type="button"
                role="radio"
                :aria-checked="form.priority === p.id"
                class="flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                :class="
                  form.priority === p.id
                    ? p.active
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700/50'
                "
                @click="form.priority = p.id"
              >
                <span class="size-2 rounded-full" :class="p.dot" aria-hidden="true"></span>
                {{ p.label }}
              </button>
            </div>
          </div>

          <div v-if="isEdit">
            <label
              for="task-status"
              class="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300"
            >
              状态
            </label>
            <select
              id="task-status"
              v-model="form.status"
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-100"
            >
              <option v-for="s in STATUSES" :key="s.id" :value="s.id">{{ s.label }}</option>
            </select>
          </div>
        </div>

        <div class="mt-5 flex justify-end gap-2">
          <button
            type="button"
            class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            @click="emit('close')"
          >
            取消
          </button>
          <button
            type="submit"
            class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            {{ isEdit ? '保存修改' : '创建' }}
          </button>
        </div>
      </form>
    </div>
  </Teleport>
</template>
