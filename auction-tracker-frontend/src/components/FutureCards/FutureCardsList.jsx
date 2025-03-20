import { useState, useEffect } from 'react'
import FutureCard from './FutureCard'
import AddFutureForm from './AddFutureForm'
import { useAuth } from '../../context/AuthContext'
import { getUserData, saveFutureCards, saveWatchlist } from '../../services/firebase'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { SortAsc, SortDesc, Calendar, Loader2, Filter } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

function FutureCardsList() {
  const [futureCards, setFutureCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { currentUser } = useAuth()
  const [sortBy, setSortBy] = useState('dateAdded')
  const [sortOrder, setSortOrder] = useState('desc')
  const [filterFavorites, setFilterFavorites] = useState(false)

  // Load future cards from Firestore
  useEffect(() => {
    const fetchFutureCards = async () => {
      try {
        setLoading(true)
        const userData = await getUserData(currentUser.uid)
        setFutureCards(userData.futureCards || [])
      } catch (err) {
        console.error("Error fetching future cards:", err)
        setError("Failed to load your future cards. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    if (currentUser) {
      fetchFutureCards()
    }
  }, [currentUser])

  // Save future cards to Firestore whenever they change
  useEffect(() => {
    const saveToFirestore = async () => {
      if (currentUser && !loading) {
        try {
          await saveFutureCards(currentUser.uid, futureCards)
        } catch (err) {
          console.error("Error saving future cards:", err)
        }
      }
    }

    saveToFirestore()
  }, [futureCards, currentUser, loading])

  // Add a new future card
  const handleAddCard = (cardData) => {
    const newCard = {
      id: Date.now().toString(),
      dateAdded: new Date().toISOString(),
      favorite: false,
      ...cardData
    }
    setFutureCards([...futureCards, newCard])
  }

  // Delete a future card
  const handleDeleteCard = (cardId) => {
    setFutureCards(futureCards.filter(card => card.id !== cardId))
  }

  // Toggle favorite status
  const handleToggleFavorite = (cardId) => {
    setFutureCards(futureCards.map(card =>
      card.id === cardId ? { ...card, favorite: !card.favorite } : card
    ))
  }

  // Move a card to watchlist
  const handleMoveToWatchlist = async (card) => {
    try {
      // Get current watchlist
      const userData = await getUserData(currentUser.uid)
      const watchlist = userData.watchlist || []

      // Create a new watchlist item
      const newWatchItem = {
        id: Date.now().toString(),
        cardName: card.name || card.cardName,
        timeLeft: '',
        hasBids: false,
        cardRace: card.cardRace,
        cardRarity: card.cardRarity,
        description: card.description,
        attack: card.attack,
        health: card.health,
        favorite: card.favorite
      }

      // Add to watchlist and save
      const updatedWatchlist = [...watchlist, newWatchItem]
      await saveWatchlist(currentUser.uid, updatedWatchlist)

      // Remove from future cards
      handleDeleteCard(card.id)

      // Provide user feedback
      alert(`"${card.name || card.cardName}" moved to Watchlist!`)
    } catch (err) {
      console.error("Error moving card to watchlist:", err)
      setError("Failed to move card to watchlist. Please try again.")
    }
  }

  // Sort and filter cards
  const getSortedCards = () => {
    // First filter by favorites if needed
    let filteredCards = filterFavorites
      ? futureCards.filter(card => card.favorite)
      : futureCards;

    // Then sort the filtered cards
    return [...filteredCards].sort((a, b) => {
      // Handle different sort fields
      let aValue, bValue;

      switch (sortBy) {
        case 'cardName':
          aValue = (a.name || a.cardName || '').toLowerCase();
          bValue = (b.name || b.cardName || '').toLowerCase();
          break;
        case 'cardRarity':
          aValue = parseInt(a.cardRarity) || 0;
          bValue = parseInt(b.cardRarity) || 0;
          break;
        case 'cardRace':
          aValue = (a.cardRace || '').toLowerCase();
          bValue = (b.cardRace || '').toLowerCase();
          break;
        case 'dateAdded':
        default:
          aValue = new Date(a.dateAdded || 0).getTime();
          bValue = new Date(b.dateAdded || 0).getTime();
      }

      // Apply sort order
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  // Toggle sort order when clicking the same sort field
  const handleSortClick = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  }

  // Get the sorted and filtered cards
  const sortedCards = getSortedCards()

  // Get sort icon
  const getSortIcon = () => {
    return sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Future Cards</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md">
          {error}
        </div>
      )}

      <AddFutureForm onAddCard={handleAddCard} />

      {!loading && futureCards.length > 0 && (
        <Card className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <Filter size={16} />
                    Sort & Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-52">
                  <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => handleSortClick('dateAdded')}
                      className="gap-2 cursor-pointer"
                    >
                      <Calendar size={16} />
                      Date Added
                      {sortBy === 'dateAdded' && getSortIcon()}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSortClick('cardName')}
                      className="gap-2 cursor-pointer"
                    >
                      <span>Name</span>
                      {sortBy === 'cardName' && getSortIcon()}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSortClick('cardRarity')}
                      className="gap-2 cursor-pointer"
                    >
                      <span>Rarity</span>
                      {sortBy === 'cardRarity' && getSortIcon()}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSortClick('cardRace')}
                      className="gap-2 cursor-pointer"
                    >
                      <span>Race</span>
                      {sortBy === 'cardRace' && getSortIcon()}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Filter</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => setFilterFavorites(!filterFavorites)}>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="favorites"
                        checked={filterFavorites}
                        onCheckedChange={() => setFilterFavorites(!filterFavorites)}
                      />
                      <label htmlFor="favorites" className="cursor-pointer text-sm">
                        Favorites only
                      </label>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="text-sm text-muted-foreground">
                Showing {sortedCards.length} cards
                {filterFavorites ? " (favorites only)" : ""}
              </div>
            </div>

            <Tabs defaultValue="grid" className="w-[160px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="grid">Grid</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
              <TabsContent value="grid" className="hidden">Grid View</TabsContent>
              <TabsContent value="list" className="hidden">List View</TabsContent>
            </Tabs>
          </div>
        </Card>
      )}

      <div>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : futureCards.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">No future cards added yet. Add some above!</p>
          </Card>
        ) : sortedCards.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">No favorites found. Add some cards to favorites!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedCards.map(card => (
              <FutureCard
                key={card.id}
                card={card}
                onDelete={handleDeleteCard}
                onMoveToWatchlist={handleMoveToWatchlist}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default FutureCardsList