import React from 'react'

function FutureCard({ card, onDelete, onMoveToWatchlist }) {
  // Format date for display
  const formatDate = (isoString) => {
    try {
      return new Date(isoString).toLocaleDateString()
    } catch (e) {
      return 'Unknown date'
    }
  }

  return (
    <div className="border border-gray-200 bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold">{card.name}</h3>
        <button
          onClick={() => onDelete(card.id)}
          className="text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      </div>
      
      <div className="text-sm text-gray-500 mb-4">
        Added on {formatDate(card.dateAdded)}
      </div>
      
      <button
        onClick={() => onMoveToWatchlist(card)}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
      >
        Move to Watchlist
      </button>
    </div>
  )
}

export default FutureCard