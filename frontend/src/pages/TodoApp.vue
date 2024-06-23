<template>
  <div>
    <q-toolbar class="bg-primary text-white">
      <!-- <q-btn flat round dense icon="menu" class="q-mr-sm" /> -->
      <q-avatar>
        <img src="~/assets/TodoLogo.png">
      </q-avatar>

      <q-toolbar-title>Todo Application {{ input }}</q-toolbar-title>

      <q-btn flat round dense icon="whatshot" />
    </q-toolbar>
    <div class="row q-pa-md items-center">
      <div>
        <q-checkbox v-model="selectedAll" />
      </div>
      <div class="col">
        <q-input v-model="input" label="What's need to be done" @keyup.enter="add" />
      </div>
    </div>
    <div class="col">
      <q-list>
        <todo-item v-for="todo in filteredTodos" :key="todo.id" :todo="todo" />
      </q-list>
    </div>
    <div class="row q-pa-md items-center">
      <div>
        {{ getActiveTodos.length }} items left
      </div>
      <div class="col column items-center">
        <q-btn-toggle v-model="selectedTab" no-caps rounded unelevated toggle-color="primary" color="white"
          text-color="primary" :options="[
            { label: 'All', value: 'all' },
            { label: 'Active', value: 'active' },
            { label: 'Completed', value: 'completed' }
          ]" />
      </div>
      <div>
        <q-btn @click="clearCompleted">clear completed</q-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import TodoItem from 'components/TodoItem.vue';

  import { useTodosStore } from 'stores/todos';
  import { storeToRefs } from 'pinia';

  const storeTodos = useTodosStore()

  const { getTodos, getActiveTodos, getCompletedTodos } = storeToRefs(storeTodos);

  const { addTodo, clearCompleted } = storeTodos

  defineOptions({
    name: 'TodoApp'
  });

  const input = ref<string>('');
  const selectedAll = ref<boolean>(false);

  const selectedTab = ref<string>('all');

  const filteredTodos = computed(() => {
    switch (selectedTab.value) {
      case 'active':
        return getActiveTodos.value
      case 'completed':
        return getCompletedTodos.value
      default:
        return getTodos.value
    }
  })

  function add() {
    // add todo to array as first item
    addTodo({
      id: Date.now(),
      content: input.value,
      isDone: false
    });

    input.value = '';
  }

</script>