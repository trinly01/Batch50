export type Todo = {
  id: number,
  content: string,
  isDone: boolean
}

// NewTodo Omit id
export type NewTodo = Omit<Todo, 'id'>