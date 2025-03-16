import { Link } from 'react-router-dom'

function Navbar({ isAuthenticated, onLogout }) {
  return (
    <nav className="bg-gray-800 text-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Auction Tracker</Link>
        
        {isAuthenticated ? (
          <div className="flex space-x-4 items-center">
            <Link to="/" className="hover:text-blue-300">Current Bids</Link>
            <Link to="/watchlist" className="hover:text-blue-300">Watchlist</Link>
            <Link to="/future-cards" className="hover:text-blue-300">Future Cards</Link>
            <button 
              onClick={onLogout}
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