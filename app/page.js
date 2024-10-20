// File: app/page.js
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')
  const [token, setToken] = useState('')
  const router = useRouter()

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
      fetchTodos(storedToken)
    } else {
      router.push('/login')
    }
  }, [router])

  const fetchTodos = async (authToken) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todos`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
    if (res.ok) {
      const data = await res.json()
      setTodos(data)
    } else {
      localStorage.removeItem('token')
      setToken('')
      router.push('/login')
    }
  }

  const addTodo = async (e) => {
    e.preventDefault()
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todos`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ text: newTodo, priority, dueDate }),
    })
    const data = await res.json()
    setTodos([...todos, data])
    setNewTodo('')
    setPriority('medium')
    setDueDate('')
  }

  const toggleTodo = async (id) => {
    const todo = todos.find((t) => t._id === id)
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todos/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ ...todo, completed: !todo.completed }),
    })
    const updatedTodo = await res.json()
    setTodos(todos.map((t) => (t._id === id ? updatedTodo : t)))
  }

  const deleteTodo = async (id) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todos/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    setTodos(todos.filter((t) => t._id !== id))
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken('')
    router.push('/login')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Todo List</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Logout
        </button>
      </div>
      <form onSubmit={addTodo} className="mb-8">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          className="border border-gray-300 rounded px-4 py-2 mr-2"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 mr-2"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 mr-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Todo
        </button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li
            key={todo._id}
            className="flex items-center justify-between border-b border-gray-200 py-4"
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo._id)}
                className="mr-4"
              />
              <span className={todo.completed ? 'line-through' : ''}>
                {todo.text} - Priority: {todo.priority}, Due: {new Date(todo.dueDate).toLocaleDateString()}
              </span>
            </div>
            <button
              onClick={() => deleteTodo(todo._id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
