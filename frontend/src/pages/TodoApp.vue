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
        <q-input v-model="input" label="What's need to be done" @keyup.enter="addTodo" />
      </div>
    </div>
    <div class="col">
      <q-list>
        <todo-item v-for="todo in filteredTodos" :key="todo.id" :todo="todo"
          @toggle="(data: boolean) => updateTodoStatus(todo, data)" @remove="(id: number) => removeItem(id)"
          @new-content="(data: string) => todo.content = data"></todo-item>
      </q-list>
    </div>
    <div class="row q-pa-md items-center">
      <div>
        {{ itemsLeft }} items left
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
  import { Todo } from 'src/types/Todo';
  import { computed, ref } from 'vue';
  import TodoItem from 'components/TodoItem.vue';

  defineOptions({
    name: 'TodoApp'
  });

  const input = ref<string>('');
  const selectedAll = ref<boolean>(false);

  const selectedTab = ref<string>('all');

  const todos = ref<Todo[]>([]);

  const itemsLeft = computed(() => {
    console.log('triggered')
    return todos.value.filter(todo => !todo.isDone).length
  })

  const filteredTodos = computed(() => {
    switch (selectedTab.value) {
      case 'active':
        return todos.value.filter(todo => !todo.isDone)
      case 'completed':
        return todos.value.filter(todo => todo.isDone)
      default:
        return todos.value
    }
  })

  function addTodo() {
    // add todo to array as first item
    todos.value.unshift({
      id: Date.now(),
      content: input.value,
      isDone: false
    });

    input.value = '';
  }

  function updateTodoStatus(todo: Todo, newStatus: boolean) {
    todo.isDone = newStatus
  }

  function removeItem(id: number) {
    const index = todos.value.findIndex(todo => todo.id === id);
    todos.value.splice(index, 1);
  }

  function clearCompleted() {
    todos.value = todos.value.filter(todo => !todo.isDone)
  }



</script>