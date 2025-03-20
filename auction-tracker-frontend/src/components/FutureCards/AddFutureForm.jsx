import { useState } from 'react'

function AddFutureForm({ onAddCard }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [formData, setFormData] = useState({
    cardName: '',
    cardRace: 'Human',
    cardRarity: '1',
    description: '',
    attack: '',
    health: ''
  })

  // Card race options with their corresponding colors
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.cardName.trim()) {
      onAddCard(formData)
      setFormData({
        cardName: '',
        cardRace: 'Human',
        cardRarity: '1',
        description: '',
        attack: '',
        health: ''
      })
      setIsExpanded(false)
    }
  }

  // Function to render stars based on rarity
  const renderStars = (count) => {
    const stars = []
    for (let i = 0; i < count; i++) {
      stars.push(
        <svg key={i} className="w-4 h-4 text-yellow-400 inline-block" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )
    }
    return stars
  }

  // Get selected race colors
  const selectedRace = raceOptions.find(race => race.value === formData.cardRace) || raceOptions[0]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-2">Add Future Card</h2>

      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
        >
          Add New Card
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <label className="block text-xs font-medium mb-1">Card Name*</label>
            <input
              type="text"
              name="cardName"
              value={formData.cardName}
              onChange={handleChange}
              className="w-full p-1.5 text-sm border rounded"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium mb-1">Card Race</label>
              <div className="flex items-center">
                <select
                  name="cardRace"
                  value={formData.cardRace}
                  onChange={handleChange}
                  className="w-full p-1.5 text-sm border rounded"
                >
                  {raceOptions.map(race => (
                    <option key={race.value} value={race.value}>
                      {race.value}
                    </option>
                  ))}
                </select>
              </div>
              <div className={`mt-1 h-2 w-full rounded ${selectedRace.bgColor} ${selectedRace.borderColor} border`}></div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Rarity (Stars)</label>
              <div className="flex items-center">
                <select
                  name="cardRarity"
                  value={formData.cardRarity}
                  onChange={handleChange}
                  className="p-1.5 text-sm border rounded mr-2 w-16"
                >
                  {[1, 2, 3, 4, 5, 6, 7].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
                <div>{renderStars(parseInt(formData.cardRarity))}</div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Description/Abilities</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-1.5 text-sm border rounded h-16"
              placeholder="Card abilities or effects..."
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium mb-1">Attack</label>
              <input
                type="number"
                name="attack"
                value={formData.attack}
                onChange={handleChange}
                className="w-full p-1.5 text-sm border rounded"
                min="0"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Health</label>
              <input
                type="number"
                name="health"
                value={formData.health}
                onChange={handleChange}
                className="w-full p-1.5 text-sm border rounded"
                min="0"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
            >
              Add Card
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default AddFutureForm