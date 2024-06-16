<template>
  <q-item clickable v-ripple @mouseover.prevent="hovering = true" @mouseleave.prevent="hovering = false">
    <q-item-section avatar>
      <q-checkbox :modelValue="todo.isDone" @click="toggle" />
    </q-item-section>
    <q-item-section v-if="editing" @keyup.escape="editing = false">
      <q-input v-model="content" @keyup.escape="editing = false, content = todo.content"
        @keyup.enter="emit('newContent', content), editing = false" />
    </q-item-section>
    <q-item-section v-else @dblclick="editing = true" :class="{ completed: todo.isDone }">{{ todo.content
      }}</q-item-section>
    <q-item-section side v-show="hovering">
      <q-btn round icon="delete" color="red" size="sm" @click="remove" />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
  import { ref, type PropType } from 'vue';
  import type { Todo } from 'src/types/Todo';
  const editing = ref(false)
  const { todo } = defineProps({
    todo: {
      type: Object as PropType<Todo>,
      required: true
    }
  })

  const content = ref(todo.content)

  const hovering = ref(false)

  const emit = defineEmits(['toggle', 'remove', 'newContent'])

  function toggle() {
    emit('toggle', !todo.isDone)
  }

  function remove() {
    emit('remove', todo.id)
  }
</script>

<style scoped>
  .completed {
    text-decoration: line-through;
    color: #777;
  }
</style>