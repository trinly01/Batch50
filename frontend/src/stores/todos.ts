import { defineStore } from 'pinia';
import { NewTodo, Todo } from 'src/types/Todo';
import { $backendApi } from 'src/boot/axios';

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
    async fetchTodos () {
      const data = localStorage.getItem('todos');
      this.todos = data ? JSON.parse(data) : []
      const result = await $backendApi.get('/todos')
      this.todos = result.data.data.map((todo: { attributes: Todo; id: number; }) => ({ ...todo.attributes, id: todo.id } as Todo))
    },
    async addTodo (todo: NewTodo) {
      const result = await $backendApi.post('/todos', {
        data: todo
      })
      console.log('created', result)
      
      this.todos.push({...todo, id: result.data.data.id })
      localStorage.setItem('todos', JSON.stringify(this.todos))
    },

    async updateContent(id: number, content: string) {
      const index = this.todos.findIndex(todo => todo.id === id)
      await $backendApi.put('/todos/' + this.todos[index].id, {
        data: {
          content
        }
      })
      this.todos[index].content = content
      localStorage.setItem('todos', JSON.stringify(this.todos))
    },

    async toggleStatus(id: number) {
      const index = this.todos.findIndex(todo => todo.id === id)
      await $backendApi.put('/todos/' + this.todos[index].id, {
        data: {
          isDone: !this.todos[index].isDone
        }
      })
      this.todos[index].isDone = !this.todos[index].isDone
      
      localStorage.setItem('todos', JSON.stringify(this.todos))
    },

    async removeTodo(id: number) {
      const index = this.todos.findIndex(todo => todo.id === id)
      await $backendApi.delete('/todos/' + this.todos[index].id)
      this.todos.splice(index, 1)
      localStorage.setItem('todos', JSON.stringify(this.todos))
    },

    async clearCompleted () {
      const finishedTodos = this.todos.filter(todo => todo.isDone)

      for (const todo of finishedTodos) {
        await $backendApi.delete('/todos/' + todo.id)
      }

      this.todos = this.todos.filter(todo => !todo.isDone)
      localStorage.setItem('todos', JSON.stringify(this.todos))
    }
  }
});
