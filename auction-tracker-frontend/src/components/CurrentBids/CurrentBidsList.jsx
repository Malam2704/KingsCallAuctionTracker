import { useState, useEffect } from 'react'
import BidCard from './BidCard'
import AddBidForm from './AddBidForm'

function CurrentBidsList() {
  // Load bids from localStorage initially
  const [bids, setBids] = useState(() => {
    const savedBids = localStorage.getItem('currentBids')
    return savedBids ? JSON.parse(savedBids) : []
  })

  // Save bids to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('currentBids', JSON.stringify(bids))
  }, [bids])

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
            return { ...bid, timeLeft: (hoursLeft - 1/60).toFixed(2) }
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
      
      <AddBidForm onAddBid={handleAddBid} />
      
      <div className="mt-8">
        {bids.length === 0 ? (
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