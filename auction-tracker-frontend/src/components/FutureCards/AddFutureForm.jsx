import { useState } from 'react'

function AddFutureForm({ onAddCard }) {
  const [cardName, setCardName] = useState('')
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (cardName.trim()) {
      onAddCard(cardName)
      setCardName('')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4">Add Future Card</h2>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          placeholder="Enter card name"
          className="flex-grow p-2 border rounded-l"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r"
        >
          Add
        </button>
      </form>
    </div>
  )
}

export default AddFutureForm