import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { logoutUser } from '../services/firebase'

function Navbar() {
  const { isAuthenticated, currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="bg-gray-800 text-white py-4 w-full">
      <div className="w-full px-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Auction Tracker</Link>

        {isAuthenticated ? (
          <div className="flex space-x-4 items-center">
            <span className="text-sm text-gray-300">
              {currentUser?.email}
            </span>
            <Link to="/" className="hover:text-blue-300">Current Bids</Link>
            <Link to="/watchlist" className="hover:text-blue-300">Watchlist</Link>
            <Link to="/future-cards" className="hover:text-blue-300">Future Cards</Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex space-x-4">
            <Link to="/login" className="hover:text-blue-300">Login</Link>
            <Link to="/signup" className="hover:text-blue-300">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar