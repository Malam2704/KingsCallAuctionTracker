import { useState } from 'react'

function BidCard({ bid, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedBid, setEditedBid] = useState(bid)
  
  // Format the bid time for display
  const formatBidTime = (isoString) => {
    try {
      return new Date(isoString).toLocaleString()
    } catch (e) {
      return 'Invalid date'
    }
  }

  // Handle input changes when editing
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setEditedBid({
      ...editedBid,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdate(editedBid)
    setIsEditing(false)
  }

  // Determine card background color based on status
  const getCardClass = () => {
    if (editedBid.outbid) return 'bg-red-50 border-red-200'
    if (parseFloat(editedBid.timeLeft) <= 1) return 'bg-yellow-50 border-yellow-200'
    return 'bg-white border-gray-200'
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
              value={editedBid.cardName}
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
              value={editedBid.timeLeft}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min="0"
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Seller</label>
            <input
              type="text"
              name="seller"
              value={editedBid.seller}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Gold Amount</label>
            <input
              type="number"
              name="goldAmount"
              value={editedBid.goldAmount}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min="0"
            />
          </div>
          
          <div className="flex space-x-4 mb-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="outbid"
                checked={editedBid.outbid}
                onChange={handleChange}
                className="mr-2"
              />
              <span>Outbid</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                name="planToRebid"
                checked={editedBid.planToRebid}
                onChange={handleChange}
                className="mr-2"
              />
              <span>Plan to Rebid</span>
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
            <h3 className="text-lg font-semibold">{bid.cardName}</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(bid.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
          
          <div className="text-sm space-y-1">
            <p><span className="font-medium">Bid Time:</span> {formatBidTime(bid.bidTime)}</p>
            <p><span className="font-medium">Hours Left:</span> {bid.timeLeft}</p>
            <p><span className="font-medium">Seller:</span> {bid.seller}</p>
            <p><span className="font-medium">Gold Bid:</span> {bid.goldAmount}</p>
            
            <div className="flex space-x-4 mt-2">
              <p>
                <span className="font-medium">Outbid:</span>{' '}
                <span className={bid.outbid ? 'text-red-500' : 'text-green-500'}>
                  {bid.outbid ? 'Yes' : 'No'}
                </span>
              </p>
              <p>
                <span className="font-medium">Will Rebid:</span>{' '}
                <span className={bid.planToRebid ? 'text-blue-500' : 'text-gray-500'}>
                  {bid.planToRebid ? 'Yes' : 'No'}
                </span>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default BidCard