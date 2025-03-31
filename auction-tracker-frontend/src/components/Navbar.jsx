import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { logoutUser } from '../services/firebase'
import { Menu, X, User, BookOpen, LogOut } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

function Navbar() {
  const { isAuthenticated, currentUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setMobileMenuOpen(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="bg-gray-800 text-white py-2 w-full sticky top-0 z-10">
      <div className="w-full px-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Auction Tracker</Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex space-x-4 items-center">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-300 truncate max-w-[200px]">
                {currentUser?.email}
              </span>
              <Link to="/watchlist" className="hover:text-blue-300">Watchlist</Link>
              <Link to="/future-cards" className="hover:text-blue-300">Future Cards</Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-300">Login</Link>
              <Link to="/signup" className="hover:text-blue-300">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger menu */}
        <div className="md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-gray-800 text-white border-gray-700">
              <div className="flex flex-col space-y-6 mt-6">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-2">
                      <User size={18} />
                      <span className="text-sm text-gray-300 truncate">
                        {currentUser?.email}
                      </span>
                    </div>
                    <Link
                      to="/watchlist"
                      className="flex items-center space-x-2 hover:text-blue-300 py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <BookOpen size={18} />
                      <span>Watchlist</span>
                    </Link>
                    <Link
                      to="/future-cards"
                      className="flex items-center space-x-2 hover:text-blue-300 py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <BookOpen size={18} />
                      <span>Future Cards</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-red-400 hover:text-red-300 py-2"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="hover:text-blue-300 py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="hover:text-blue-300 py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}

export default Navbar