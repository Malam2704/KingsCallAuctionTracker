import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Star, StarOff, Trash2, MoveRight } from "lucide-react"

function FutureCard({ card, onDelete, onMoveToWatchlist, onToggleFavorite }) {
  // Race options with colors
  const raceColorMap = {
    'Human': 'blue',
    'Elf': 'green',
    'Halfblood': 'purple',
    'Goblin': 'red',
    'Ogre': 'amber',
    'Beast': 'orange',
    'Outsider/Planes': 'indigo',
    'Angel/Celestial': 'sky',
    'Dragons': 'yellow',
    'Demons': 'rose',
    'Undead': 'emerald',
    'Special': 'pink',
    'Skills': 'gray'
  }

  // Get badge color for race
  const getRaceBadgeColor = (race) => {
    const color = raceColorMap[race] || 'gray'
    return `bg-${color}-100 text-${color}-800 border-${color}-300`
  }

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
    if (!count || isNaN(parseInt(count))) return null

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
    <Card className={`border-2 border-${raceColorMap[card.cardRace] || 'gray'}-300 shadow-sm hover:shadow-md transition-shadow`}>
      <CardHeader className={`bg-${raceColorMap[card.cardRace] || 'gray'}-50 pb-2`}>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{card.name || card.cardName}</CardTitle>
            <button
              onClick={() => onToggleFavorite(card.id)}
              className="focus:outline-none"
              aria-label={card.favorite ? "Remove from favorites" : "Add to favorites"}
            >
              {card.favorite ? (
                <Star size={18} className="text-yellow-500 fill-current" />
              ) : (
                <StarOff size={18} className="text-gray-400 hover:text-yellow-500" />
              )}
            </button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onMoveToWatchlist(card)}>
                <MoveRight size={16} className="mr-2" />
                Move to Watchlist
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(card.id)} className="text-red-500">
                <Trash2 size={16} className="mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-wrap gap-2 mt-1">
          {card.cardRace && (
            <Badge variant="outline" className={getRaceBadgeColor(card.cardRace)}>
              {card.cardRace}
            </Badge>
          )}

          {card.cardRarity && (
            <div className="flex items-center">
              {renderStars(card.cardRarity)}
            </div>
          )}
        </div>

        <CardDescription className="text-xs mt-1">
          Added on {formatDate(card.dateAdded)}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4">
        {card.description && (
          <p className="text-sm mb-3">{card.description}</p>
        )}

        {(card.attack || card.health) && (
          <div className="grid grid-cols-2 gap-2">
            {card.attack && (
              <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200 text-center">
                ATK: {card.attack}
              </Badge>
            )}
            {card.health && (
              <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200 text-center">
                HP: {card.health}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          onClick={() => onMoveToWatchlist(card)}
        >
          Move to Watchlist
        </Button>
      </CardFooter>
    </Card>
  )
}

export default FutureCard