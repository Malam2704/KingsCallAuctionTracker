import { useState } from 'react'

function AddWatchForm({ onAddWatch }) {
  const [newItem, setNewItem] = useState({
    cardName: '',
    timeLeft: '',
    hasBids: false
  })
  
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setNewItem({
      ...newItem,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onAddWatch(newItem)
    setNewItem({
      cardName: '',
      timeLeft: '',
      hasBids: false
    })
    setIsFormOpen(false)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {isFormOpen ? (
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Add to Watchlist</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Card Name*</label>
                <input
                  type="text"
                  name="cardName"
                  value={newItem.cardName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Hours Left</label>
                <input
                  type="number"
                  name="timeLeft"
                  step="0.01"
                  value={newItem.timeLeft}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  min="0"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="hasBids"
                  checked={newItem.hasBids}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>Has Bids</span>
              </label>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Add to Watchlist
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsFormOpen(true)}
          className="w-full p-4 text-center text-blue-500 hover:text-blue-700 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add to Watchlist
        </button>
      )}
    </div>
  )
}

export default AddWatchForm