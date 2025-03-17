import { useState, useEffect } from 'react'
import BidCard from './BidCard'
import AddBidForm from './AddBidForm'
import { useAuth } from '../../context/AuthContext'
import { getUserData, saveBids } from '../../services/firebase'

function CurrentBidsList() {
  const [bids, setBids] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { currentUser } = useAuth()

  // Load user bids from Firestore
  useEffect(() => {
    const fetchUserBids = async () => {
      try {
        setLoading(true)
        const userData = await getUserData(currentUser.uid)
        setBids(userData.currentBids || [])
      } catch (err) {
        console.error("Error fetching bids:", err)
        setError("Failed to load your bids. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    if (currentUser) {
      fetchUserBids()
    }
  }, [currentUser])

  // Save bids to Firestore whenever they change
  useEffect(() => {
    const saveBidsToFirestore = async () => {
      if (currentUser && !loading) {
        try {
          await saveBids(currentUser.uid, bids)
        } catch (err) {
          console.error("Error saving bids:", err)
        }
      }
    }

    saveBidsToFirestore()
  }, [bids, currentUser, loading])

  // Handle adding a new bid
  const handleAddBid = (newBid) => {
    const bidWithId = {
      ...newBid,
      id: Date.now().toString(),
      bidTime: newBid.bidTime || new Date().toISOString()
    }
    setBids([...bids, bidWithId])
  }

  // Handle updating a bid
  const handleUpdateBid = (updatedBid) => {
    setBids(bids.map(bid =>
      bid.id === updatedBid.id ? updatedBid : bid
    ))
  }

  // Handle deleting a bid
  const handleDeleteBid = (bidId) => {
    setBids(bids.filter(bid => bid.id !== bidId))
  }

  // Timer to update time left
  useEffect(() => {
    const interval = setInterval(() => {
      setBids(bids.map(bid => {
        if (bid.timeLeft) {
          const hoursLeft = parseInt(bid.timeLeft)
          if (!isNaN(hoursLeft) && hoursLeft > 0) {
            return { ...bid, timeLeft: (hoursLeft - 1 / 60).toFixed(2) }
          }
        }
        return bid
      }))
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [bids])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Current Bids</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <AddBidForm onAddBid={handleAddBid} />

      <div className="mt-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : bids.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No current bids. Add some above!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bids.map(bid => (
              <BidCard
                key={bid.id}
                bid={bid}
                onUpdate={handleUpdateBid}
                onDelete={handleDeleteBid}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CurrentBidsList