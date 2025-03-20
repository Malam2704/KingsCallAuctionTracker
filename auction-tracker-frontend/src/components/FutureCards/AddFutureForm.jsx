import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

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

  // Card race options
  const raceOptions = [
    'Human',
    'Elf',
    'Halfblood',
    'Goblin',
    'Ogre',
    'Beast',
    'Outsider/Planes',
    'Angel/Celestial',
    'Dragons',
    'Demons',
    'Undead',
    'Special',
    'Skills'
  ]

  // Handle text/number input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  // Handle select changes
  const handleSelectChange = (name, value) => {
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
    const rarity = parseInt(count)
    const colors = {
      1: 'text-gray-400',
      2: 'text-green-400',
      3: 'text-blue-400',
      4: 'text-purple-400',
      5: 'text-yellow-400',
      6: 'text-amber-500',
      7: 'text-red-500'
    }

    return (
      <div className="flex">
        {Array.from({ length: rarity }).map((_, i) => (
          <Star key={i} size={16} className={`${colors[rarity]} fill-current`} />
        ))}
      </div>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <Collapsible
        open={isExpanded}
        onOpenChange={setIsExpanded}
        className="w-full"
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Add Future Card</CardTitle>
          <CardDescription>
            Add a card you're interested in for the future
          </CardDescription>
          <CollapsibleTrigger asChild>
            {!isExpanded && (
              <Button className="w-full mt-2">
                Add New Card
              </Button>
            )}
          </CollapsibleTrigger>
        </CardHeader>

        <CollapsibleContent>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardName">Card Name*</Label>
                <Input
                  id="cardName"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleChange}
                  placeholder="Enter card name"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cardRace">Card Race</Label>
                  <Select
                    value={formData.cardRace}
                    onValueChange={(value) => handleSelectChange('cardRace', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select race" />
                    </SelectTrigger>
                    <SelectContent>
                      {raceOptions.map(race => (
                        <SelectItem key={race} value={race}>
                          {race}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardRarity">Rarity</Label>
                  <div className="flex items-center gap-2">
                    <Select
                      value={formData.cardRarity}
                      onValueChange={(value) => handleSelectChange('cardRarity', value)}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="Stars" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7].map(num => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div>
                      {renderStars(formData.cardRarity)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description/Abilities</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Card abilities or effects..."
                  className="h-20 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="attack">Attack</Label>
                  <Input
                    id="attack"
                    name="attack"
                    type="number"
                    min="0"
                    value={formData.attack}
                    onChange={handleChange}
                    placeholder="ATK"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="health">Health</Label>
                  <Input
                    id="health"
                    name="health"
                    type="number"
                    min="0"
                    value={formData.health}
                    onChange={handleChange}
                    placeholder="HP"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsExpanded(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Add Card
                </Button>
              </div>
            </form>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

export default AddFutureForm