import { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'

function Login({ onLogin, isAuthenticated }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  
  // If already authenticated, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/" />
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    
    // Simple validation
    if (!email || !password) {
      setError('Email and password are required')
      return
    }
    
    // For demo purposes, just accept any credentials
    // In a real app, this would validate with Firebase or another auth service
    onLogin()
  }
  
  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="your@email.com"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
          >
            Login
          </button>
        </form>
        
        <div className="mt-4 text-center text-sm">
          Don't have an account? <Link to="/signup" className="text-blue-500 hover:text-blue-700">Sign up</Link>
        </div>
      </div>
    </div>
  )
}

export default Login