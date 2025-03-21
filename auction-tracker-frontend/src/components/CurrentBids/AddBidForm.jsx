import { useState } from 'react'

function AddBidForm({ onAddBid }) {
  const [newBid, setNewBid] = useState({
    cardName: '',
    bidTime: new Date().toISOString().slice(0, 16),
    timeLeft: '',
    seller: '',
    goldAmount: '',
    outbid: false,
    planToRebid: false
  })
  
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setNewBid({
      ...newBid,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onAddBid(newBid)
    setNewBid({
      cardName: '',
      bidTime: new Date().toISOString().slice(0, 16),
      timeLeft: '',
      seller: '',
      goldAmount: '',
      outbid: false,
      planToRebid: false
    })
    setIsFormOpen(false)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {isFormOpen ? (
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Add New Bid</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Card Name*</label>
                <input
                  type="text"
                  name="cardName"
                  value={newBid.cardName}
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
                  value={newBid.timeLeft}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Seller</label>
                <input
                  type="text"
                  name="seller"
                  value={newBid.seller}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Gold Amount</label>
                <input
                  type="number"
                  name="goldAmount"
                  value={newBid.goldAmount}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  min="0"
                />
              </div>
            </div>
            
            <div className="flex space-x-4 mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="outbid"
                  checked={newBid.outbid}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>Outbid</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="planToRebid"
                  checked={newBid.planToRebid}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>Plan to Rebid</span>
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
                Add Bid
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
          Add New Bid
        </button>
      )}
    </div>
  )
}

export default AddBidForm