import { useState, useEffect } from 'react'
import WatchCard from './WatchCard'
import AddWatchForm from './AddWatchForm'

function WatchList() {
  // Load watchlist from localStorage initially
  const [watchItems, setWatchItems] = useState(() => {
    const savedItems = localStorage.getItem('watchlist')
    return savedItems ? JSON.parse(savedItems) : []
  })

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchItems))
  }, [watchItems])

  // Handle adding a new watchlist item
  const handleAddWatch = (newItem) => {
    const itemWithId = {
      ...newItem,
      id: Date.now().toString()
    }
    setWatchItems([...watchItems, itemWithId])
  }

  // Handle updating a watchlist item
  const handleUpdateWatch = (updatedItem) => {
    setWatchItems(watchItems.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ))
  }

  // Handle deleting a watchlist item
  const handleDeleteWatch = (itemId) => {
    setWatchItems(watchItems.filter(item => item.id !== itemId))
  }

  // Move an item from watchlist to current bids
  const handleMoveToBids = (item) => {
    // First, get current bids from localStorage
    const currentBidsJson = localStorage.getItem('currentBids')
    const currentBids = currentBidsJson ? JSON.parse(currentBidsJson) : []
    
    // Create a new bid from the watchlist item
    const newBid = {
      id: Date.now().toString(),
      cardName: item.cardName,
      bidTime: new Date().toISOString(),
      timeLeft: item.timeLeft,
      seller: '',
      goldAmount: '',
      outbid: false,
      planToRebid: false
    }
    
    // Add the new bid to current bids
    const updatedBids = [...currentBids, newBid]
    localStorage.setItem('currentBids', JSON.stringify(updatedBids))
    
    // Remove the item from the watchlist
    handleDeleteWatch(item.id)
    
    // Provide user feedback
    alert(`"${item.cardName}" moved to Current Bids!`)
  }

  // Timer to update time left
  useEffect(() => {
    const interval = setInterval(() => {
      setWatchItems(watchItems.map(item => {
        if (item.timeLeft) {
          const hoursLeft = parseFloat(item.timeLeft)
          if (!isNaN(hoursLeft) && hoursLeft > 0) {
            return { ...item, timeLeft: (hoursLeft - 1/60).toFixed(2) }
          }
        }
        return item
      }))
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [watchItems])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Watchlist</h1>
      
      <AddWatchForm onAddWatch={handleAddWatch} />
      
      <div className="mt-8">
        {watchItems.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No items in watchlist. Add some above!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {watchItems.map(item => (
              <WatchCard 
                key={item.id} 
                item={item} 
                onUpdate={handleUpdateWatch} 
                onDelete={handleDeleteWatch}
                onMoveToBids={handleMoveToBids}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default WatchList