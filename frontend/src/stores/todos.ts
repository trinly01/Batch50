import { defineStore } from 'pinia';
import { Todo } from 'src/types/Todo';

export const useTodosStore = defineStore('todos', {
  state: () => ({
    todos: [] as Todo[],
  }),

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
    addTodo (todo: Todo) {
      this.todos.push(todo)
    },

    updateContent(id: number, content: string) {
      const index = this.todos.findIndex(todo => todo.id === id)
      this.todos[index].content = content
    },

    toggleStatus(id: number) {
      const index = this.todos.findIndex(todo => todo.id === id)
      this.todos[index].isDone = !this.todos[index].isDone
    },

    removeTodo(id: number) {
      const index = this.todos.findIndex(todo => todo.id === id)
      this.todos.splice(index, 1)
    },

    clearCompleted () {
      this.todos = this.todos.filter(todo => !todo.isDone)
    }
  }
});
