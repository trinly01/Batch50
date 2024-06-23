import { defineStore } from 'pinia';
import { Todo } from 'src/types/Todo';

export const useTodosStore = defineStore('todos', {
  state: () => {
    return {
      todos: [] as Todo[]
    }
  },

  getters: {
    getTodos (state): Todo[] {
      return state.todos
    },
    getActiveTodos (state): Todo[] {
      return state.todos.filter(todo => !todo.isDone)
    },
    getCompletedTodos (state): Todo[] {
      return state.todos.filter(todo => todo.isDone)
    },
  },

  actions: {
    fetchTodos () {
      const data = localStorage.getItem('todos');
      console.log('data data data', data)
      this.todos = data ? JSON.parse(data) : []
    },
    addTodo (todo: Todo) {
      console.log('process.env.CLIENT', process.env.CLIENT)
      this.todos.push(todo)
      if (process.env.CLIENT) localStorage.setItem('todos', JSON.stringify(this.todos))
    },

    updateContent(id: number, content: string) {
      const index = this.todos.findIndex(todo => todo.id === id)
      this.todos[index].content = content
      if (process.env.CLIENT) localStorage.setItem('todos', JSON.stringify(this.todos))
    },

    toggleStatus(id: number) {
      const index = this.todos.findIndex(todo => todo.id === id)
      this.todos[index].isDone = !this.todos[index].isDone
      if (process.env.CLIENT) localStorage.setItem('todos', JSON.stringify(this.todos))
    },

    removeTodo(id: number) {
      const index = this.todos.findIndex(todo => todo.id === id)
      this.todos.splice(index, 1)
      if (process.env.CLIENT) localStorage.setItem('todos', JSON.stringify(this.todos))
    },

    clearCompleted () {
      this.todos = this.todos.filter(todo => !todo.isDone)
      if (process.env.CLIENT) localStorage.setItem('todos', JSON.stringify(this.todos))
    }
  }
});
