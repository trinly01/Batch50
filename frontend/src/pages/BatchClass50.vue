<template>
  <h1>Batch {{ batchNo }} </h1>
  <button @click="increment">Increment</button>
  <h2>Computed: {{ computedBatchNo }}</h2>
  <h2>Compute: {{ computeBatchNo(batchNo) }}</h2>

  <input type="number" v-model="batchNo" />

  <h1>Todos</h1>
  <q-input v-model="task" @keyup.enter="addTask" label="Add Task" />
  <div v-if="!todos.length">No data</div>
  <ul v-else>
    <li v-for="todo in todos" :key="todo.id">
      {{ todo.content }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, computed } from 'vue';
import { Todo } from './../types/Todo';
const batchNo = ref<number>(5000);

const todos = ref<Todo[]>([])

onBeforeMount(() => {
  batchNo.value = 50;
});

const computedBatchNo = computed(() => batchNo.value * 10);

function computeBatchNo(val: number): number {
  return val * 10
}

const task = ref<string>('')

function addTask() {
  todos.value.push({
    id: Date.now(),
    content: task.value,
    isDone: false
  })

  task.value = ''
}

function increment(): void {
  batchNo.value += 1;
}

</script>

<style scoped>
h1 {
  color: blue;
}
</style>