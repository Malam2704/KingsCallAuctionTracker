import { useState } from 'react'

function WatchCard({ item, onUpdate, onDelete, onMoveToBids }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedItem, setEditedItem] = useState(item)

  // Handle input changes when editing
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setEditedItem({
      ...editedItem,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdate(editedItem)
    setIsEditing(false)
  }

  // Determine card background color based on time left
  const getCardClass = () => {
    return parseFloat(editedItem.timeLeft) <= 1 
      ? 'bg-yellow-50 border-yellow-200'
      : 'bg-white border-gray-200'
  }

  return (
    <div className={`border rounded-lg shadow-sm p-4 ${getCardClass()}`}>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Card Name</label>
            <input
              type="text"
              name="cardName"
              value={editedItem.cardName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Hours Left</label>
            <input
              type="number"
              name="timeLeft"
              step="0.01"
              value={editedItem.timeLeft}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min="0"
            />
          </div>
          
          <div className="mb-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="hasBids"
                checked={editedItem.hasBids}
                onChange={handleChange}
                className="mr-2"
              />
              <span>Has Bids</span>
            </label>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-blue-500 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">{item.cardName}</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
          
          <div className="text-sm space-y-1">
            <p><span className="font-medium">Hours Left:</span> {item.timeLeft}</p>
            <p>
              <span className="font-medium">Has Bids:</span>{' '}
              <span className={item.hasBids ? 'text-orange-500' : 'text-green-500'}>
                {item.hasBids ? 'Yes' : 'No'}
              </span>
            </p>
          </div>
          
          <div className="mt-4">
            <button
              onClick={() => onMoveToBids(item)}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
            >
              Bid On This Card
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default WatchCard