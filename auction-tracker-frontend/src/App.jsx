import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import CurrentBidsList from './components/CurrentBids/CurrentBidsList'
import WatchList from './components/Watchlist/WatchList'
import FutureCardsList from './components/FutureCards/FutureCardsList'
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'
import './App.css'

function App() {
  // For a quick prototype, manage auth state here
  // In a full implementation, move this to AuthContext
  const [isAuthenticated, setIsAuthenticated] = useState(
    // Check if user is logged in from localStorage
    JSON.parse(localStorage.getItem('isAuthenticated')) || false
  )

  const handleLogin = () => {
    setIsAuthenticated(true)
    localStorage.setItem('isAuthenticated', true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.setItem('isAuthenticated', false)
  }

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />
    }
    return children
  }

  return (
    <Router>
      <div className="app">
        <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <CurrentBidsList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/watchlist" 
              element={
                <ProtectedRoute>
                  <WatchList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/future-cards" 
              element={
                <ProtectedRoute>
                  <FutureCardsList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/login" 
              element={<Login onLogin={handleLogin} isAuthenticated={isAuthenticated} />} 
            />
            <Route 
              path="/signup" 
              element={<Signup onLogin={handleLogin} isAuthenticated={isAuthenticated} />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App