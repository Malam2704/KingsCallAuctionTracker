import { useState, useEffect } from 'react'
import FutureCard from './FutureCard'
import AddFutureForm from './AddFutureForm'

function FutureCardsList() {
  // Load future cards from localStorage
  const [futureCards, setFutureCards] = useState(() => {
    const savedCards = localStorage.getItem('futureCards')
    return savedCards ? JSON.parse(savedCards) : []
  })

  // Save future cards to localStorage
  useEffect(() => {
    localStorage.setItem('futureCards', JSON.stringify(futureCards))
  }, [futureCards])

  // Add a new future card
  const handleAddCard = (cardName) => {
    const newCard = {
      id: Date.now().toString(),
      name: cardName,
      dateAdded: new Date().toISOString()
    }
    setFutureCards([...futureCards, newCard])
  }

  // Delete a future card
  const handleDeleteCard = (cardId) => {
    setFutureCards(futureCards.filter(card => card.id !== cardId))
  }

  // Move a card to watchlist
  const handleMoveToWatchlist = (card) => {
    // First, get watchlist from localStorage
    const watchlistJson = localStorage.getItem('watchlist')
    const watchlist = watchlistJson ? JSON.parse(watchlistJson) : []
    
    // Create a new watchlist item
    const newWatchItem = {
      id: Date.now().toString(),
      cardName: card.name,
      timeLeft: '',
      hasBids: false
    }
    
    // Add to watchlist
    const updatedWatchlist = [...watchlist, newWatchItem]
    localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist))
    
    // Remove from future cards
    handleDeleteCard(card.id)
    
    // Provide user feedback
    alert(`"${card.name}" moved to Watchlist!`)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Future Cards</h1>
      
      <AddFutureForm onAddCard={handleAddCard} />
      
      <div className="mt-8">
        {futureCards.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No future cards added yet. Add some above!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {futureCards.map(card => (
              <FutureCard 
                key={card.id} 
                card={card} 
                onDelete={handleDeleteCard}
                onMoveToWatchlist={handleMoveToWatchlist}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default FutureCardsList