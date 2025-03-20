import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { loginUser } from '../../services/firebase'
import { useAuth } from '../../context/AuthContext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // If already authenticated, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/" />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Simple validation
    if (!email || !password) {
      setError('Email and password are required')
      return
    }

    try {
      setLoading(true)
      await loginUser(email, password)
      navigate('/')
    } catch (error) {
      setError(
        error.code === 'auth/invalid-credential'
          ? 'Invalid email or password'
          : `Login error: ${error.message}`
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <div className="bg-white rounded-lg shadow-md p-6 w-full">
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
            disabled={loading}
            className={`w-full ${loading ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'} text-white py-2 rounded flex justify-center items-center`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : (
              'Login'
            )}
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