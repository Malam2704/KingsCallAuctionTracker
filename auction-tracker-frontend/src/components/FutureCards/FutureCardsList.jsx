import { useState, useEffect } from 'react'
import FutureCard from './FutureCard'
import AddFutureForm from './AddFutureForm'
import { useAuth } from '../../context/AuthContext'
import { getUserData, saveFutureCards, saveWatchlist } from '../../services/firebase'

function FutureCardsList() {
  const [futureCards, setFutureCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { currentUser } = useAuth()

  // Load future cards from Firestore
  useEffect(() => {
    const fetchFutureCards = async () => {
      try {
        setLoading(true)
        const userData = await getUserData(currentUser.uid)
        setFutureCards(userData.futureCards || [])
      } catch (err) {
        console.error("Error fetching future cards:", err)
        setError("Failed to load your future cards. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    if (currentUser) {
      fetchFutureCards()
    }
  }, [currentUser])

  // Save future cards to Firestore whenever they change
  useEffect(() => {
    const saveToFirestore = async () => {
      if (currentUser && !loading) {
        try {
          await saveFutureCards(currentUser.uid, futureCards)
        } catch (err) {
          console.error("Error saving future cards:", err)
        }
      }
    }

    saveToFirestore()
  }, [futureCards, currentUser, loading])

  // Add a new future card
  const handleAddCard = (cardData) => {
    const newCard = {
      id: Date.now().toString(),
      dateAdded: new Date().toISOString(),
      ...cardData
    }
    setFutureCards([...futureCards, newCard])
  }

  // Delete a future card
  const handleDeleteCard = (cardId) => {
    setFutureCards(futureCards.filter(card => card.id !== cardId))
  }

  // Move a card to watchlist
  const handleMoveToWatchlist = async (card) => {
    try {
      // Get current watchlist
      const userData = await getUserData(currentUser.uid)
      const watchlist = userData.watchlist || []

      // Create a new watchlist item
      const newWatchItem = {
        id: Date.now().toString(),
        cardName: card.name || card.cardName,
        timeLeft: '',
        hasBids: false,
        cardRace: card.cardRace,
        cardRarity: card.cardRarity,
        description: card.description,
        attack: card.attack,
        health: card.health
      }

      // Add to watchlist and save
      const updatedWatchlist = [...watchlist, newWatchItem]
      await saveWatchlist(currentUser.uid, updatedWatchlist)

      // Remove from future cards
      handleDeleteCard(card.id)

      // Provide user feedback
      alert(`"${card.name || card.cardName}" moved to Watchlist!`)
    } catch (err) {
      console.error("Error moving card to watchlist:", err)
      setError("Failed to move card to watchlist. Please try again.")
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Future Cards</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <AddFutureForm onAddCard={handleAddCard} />

      <div className="mt-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : futureCards.length === 0 ? (
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