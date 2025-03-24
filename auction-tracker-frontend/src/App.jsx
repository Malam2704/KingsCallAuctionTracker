import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import WatchList from './components/Watchlist/WatchList'
import FutureCardsList from './components/FutureCards/FutureCardsList'
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'
import { AuthProvider, useAuth } from './context/AuthContext'
import './App.css'

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }
  return children;
}

function App() {

  return (
    <AuthProvider>
      <Router>
        <div className="app w-full">
          <Navbar />
          <div className="w-full px-4 py-8">
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <WatchList />
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
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App