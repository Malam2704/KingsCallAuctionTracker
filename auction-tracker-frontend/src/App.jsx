import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import WatchList from './components/WatchList/WatchList'
import FutureCardsList from './components/FutureCards/FutureCardsList'
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'
import EmailVerification from './components/Auth/EmailVerification' // New component
import VerificationNotice from './components/Auth/VerificationNotice' // New component
import { AuthProvider, useAuth } from './context/AuthContext'
import './App.css'

// Protected route component with email verification
const ProtectedRoute = ({ children, requireVerified = true }) => {
  const { isAuthenticated, currentUser } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  // Check if email verification is required and if the user's email is verified
  if (requireVerified && currentUser && !currentUser.emailVerified) {
    return <Navigate to="/verify-notice" />
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

              {/* New routes for email verification */}
              <Route path="/verify-email" element={<EmailVerification />} />
              <Route path="/verify-notice" element={<VerificationNotice />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App