// File: app/(auth)/signup/page.js
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSignup = async (e) => {
    e.preventDefault()
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (res.ok) {
      alert('Signup successful. Please log in.')
      router.push('/login')
    } else {
      alert('Signup failed')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Signup</h1>
      <form onSubmit={handleSignup} className="mb-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border border-gray-300 rounded px-4 py-2 mr-2"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border border-gray-300 rounded px-4 py-2 mr-2"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Signup
        </button>
      </form>
      <button onClick={() => router.push('/login')} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Go to Login
      </button>
    </div>
  )
}
