import React from 'react'

function FutureCard({ card, onDelete, onMoveToWatchlist }) {
  // Race options with colors
  const raceOptions = [
    { value: 'Human', borderColor: 'border-blue-500', bgColor: 'bg-blue-50' },
    { value: 'Elf', borderColor: 'border-green-500', bgColor: 'bg-green-50' },
    { value: 'Halfblood', borderColor: 'border-purple-500', bgColor: 'bg-purple-50' },
    { value: 'Goblin', borderColor: 'border-red-500', bgColor: 'bg-red-50' },
    { value: 'Ogre', borderColor: 'border-yellow-700', bgColor: 'bg-yellow-50' },
    { value: 'Beast', borderColor: 'border-orange-500', bgColor: 'bg-orange-50' },
    { value: 'Outsider/Planes', borderColor: 'border-indigo-500', bgColor: 'bg-indigo-50' },
    { value: 'Angel/Celestial', borderColor: 'border-sky-500', bgColor: 'bg-sky-50' },
    { value: 'Dragons', borderColor: 'border-amber-500', bgColor: 'bg-amber-50' },
    { value: 'Demons', borderColor: 'border-red-700', bgColor: 'bg-red-100' },
    { value: 'Special', borderColor: 'border-pink-500', bgColor: 'bg-pink-50' },
    { value: 'Skills', borderColor: 'border-gray-500', bgColor: 'bg-gray-50' }
  ]

  // Get race colors
  const raceStyle = raceOptions.find(race => race.value === card.cardRace) ||
    { borderColor: 'border-gray-200', bgColor: 'bg-white' };

  // Format date for display
  const formatDate = (isoString) => {
    try {
      return new Date(isoString).toLocaleDateString()
    } catch (e) {
      return 'Unknown date'
    }
  }

  // Render stars based on rarity
  const renderStars = (count) => {
    if (!count || isNaN(parseInt(count))) return null;

    const stars = [];
    for (let i = 0; i < parseInt(count); i++) {
      stars.push(
        <svg key={i} className="w-4 h-4 text-yellow-400 inline-block" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return stars;
  }

  return (
    <div className={`border-2 ${raceStyle.borderColor} ${raceStyle.bgColor} rounded-lg shadow-sm p-4`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-semibold">{card.name || card.cardName}</h3>
          {card.cardRace && (
            <div className="text-xs text-gray-600 mb-1">
              {card.cardRace}
            </div>
          )}
          <div className="mb-1">
            {card.cardRarity && renderStars(card.cardRarity)}
          </div>
        </div>
        <button
          onClick={() => onDelete(card.id)}
          className="text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      </div>

      {card.description && (
        <div className="mb-3 text-sm">
          <p>{card.description}</p>
        </div>
      )}

      {(card.attack || card.health) && (
        <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
          {card.attack && (
            <div className="bg-red-100 p-1 rounded text-center">
              <span className="font-medium">ATK:</span> {card.attack}
            </div>
          )}
          {card.health && (
            <div className="bg-green-100 p-1 rounded text-center">
              <span className="font-medium">HP:</span> {card.health}
            </div>
          )}
        </div>
      )}

      <div className="text-xs text-gray-500 mb-4">
        Added on {formatDate(card.dateAdded)}
      </div>

      <button
        onClick={() => onMoveToWatchlist(card)}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded text-sm"
      >
        Move to Watchlist
      </button>
    </div>
  )
}

export default FutureCard