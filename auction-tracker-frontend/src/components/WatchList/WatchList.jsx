import { useState, useEffect } from 'react';
import WatchCard from './WatchCard';
import AddWatchForm from './AddWatchFormWithImage';
import { useAuth } from '../../context/AuthContext';
import { getUserData, saveWatchlist } from '../../services/firebase';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Search, Clock, Loader2 } from 'lucide-react';

function WatchList() {
  const [watchItems, setWatchItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("timeLeft");
  const [filterHasBids, setFilterHasBids] = useState(false);
  const [filterActiveBids, setFilterActiveBids] = useState(false);
  const [hideEndedAuctions, setHideEndedAuctions] = useState(true);

  // Load watchlist from Firestore
  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        setLoading(true);
        const userData = await getUserData(currentUser.uid);
        setWatchItems(userData.watchlist || []);
      } catch (err) {
        console.error("Error fetching watchlist:", err);
        setError("Failed to load your watchlist. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchWatchlist();
    }
  }, [currentUser]);

  // Save watchlist to Firestore whenever it changes
  useEffect(() => {
    const saveToFirestore = async () => {
      if (currentUser && !loading) {
        try {
          await saveWatchlist(currentUser.uid, watchItems);
        } catch (err) {
          console.error("Error saving watchlist:", err);
        }
      }
    };

    saveToFirestore();
  }, [watchItems, currentUser, loading]);

  // Handle updating a watchlist item (like toggling activelyBidding)
  const handleUpdateWatch = (updatedItem) => {
    setWatchItems(watchItems.map(item =>
      item.id === updatedItem.id ? updatedItem : item
    ));
  };

  // Handle deleting a watchlist item
  const handleDeleteWatch = (itemId) => {
    setWatchItems(watchItems.filter(item => item.id !== itemId));
  };

  // Helper function to calculate time remaining for an item
  const calculateTimeRemaining = (item) => {
    if (!item.auctionEndTime) {
      // Fall back to the old method if no end timestamp
      return parseFloat(item.timeLeft) || 0;
    }

    const now = new Date();
    const endTime = new Date(item.auctionEndTime);
    const diffMs = endTime - now;
    const diffHours = diffMs / (1000 * 60 * 60);

    return Math.max(0, diffHours);
  };

  // Function to check if an auction has ended
  const isAuctionEnded = (item) => {
    return calculateTimeRemaining(item) === 0;
  };

  // Filter and sort watchlist items
  const getFilteredAndSortedItems = () => {
    return watchItems
      .filter(item => {
        // Apply search filter
        const matchesSearch = item.cardName.toLowerCase().includes(searchQuery.toLowerCase());

        // Apply has bids filter
        const matchesHasBids = !filterHasBids || item.hasBids;

        // Apply active bids filter
        const matchesActiveBids = !filterActiveBids || item.activelyBidding;

        // Apply hide ended auctions filter
        const matchesEnded = !hideEndedAuctions || !isAuctionEnded(item);

        return matchesSearch && matchesHasBids && matchesActiveBids && matchesEnded;
      })
      .sort((a, b) => {
        // Sort by selected field
        switch (sortBy) {
          case 'activelyBidding':
            // Sort by actively bidding (true first)
            return (b.activelyBidding || false) - (a.activelyBidding || false);
          case 'timeLeft':
            return calculateTimeRemaining(a) - calculateTimeRemaining(b);
          case 'cardName':
            return a.cardName.localeCompare(b.cardName);
          case 'cardRarity':
            return (parseInt(b.cardRarity) || 0) - (parseInt(a.cardRarity) || 0);
          case 'goldAmount':
            return (parseInt(b.goldAmount) || 0) - (parseInt(a.goldAmount) || 0);
          default:
            return 0;
        }
      });
  };

  const filteredItems = getFilteredAndSortedItems();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Watchlist</h1>
        <AddWatchForm onAddWatch={(newItem) => {
          const itemWithId = {
            ...newItem,
            id: Date.now().toString()
          };
          setWatchItems([...watchItems, itemWithId]);
        }} />
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md">
          {error}
        </div>
      )}

      {watchItems.length > 0 && (
        <Card className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-grow max-w-sm">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search by card name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>

            <div className="flex items-center gap-2">
              <Clock size={18} className="text-gray-500" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="timeLeft">Time Left (Ending Soon)</SelectItem>
                  <SelectItem value="activelyBidding">My Bids First</SelectItem>
                  <SelectItem value="cardName">Card Name</SelectItem>
                  <SelectItem value="cardRarity">Rarity (Highest)</SelectItem>
                  <SelectItem value="goldAmount">Price (Highest)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="filterHasBids"
                checked={filterHasBids}
                onCheckedChange={setFilterHasBids}
              />
              <Label htmlFor="filterHasBids" className="cursor-pointer text-sm">
                Show only cards with bids
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="filterActiveBids"
                checked={filterActiveBids}
                onCheckedChange={setFilterActiveBids}
              />
              <Label htmlFor="filterActiveBids" className="cursor-pointer text-sm">
                Show only my active bids
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hideEndedAuctions"
                checked={hideEndedAuctions}
                onCheckedChange={setHideEndedAuctions}
              />
              <Label htmlFor="hideEndedAuctions" className="cursor-pointer text-sm">
                Hide ended auctions
              </Label>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="text-sm text-gray-500">
            Showing {filteredItems.length} of {watchItems.length} cards
          </div>
        </Card>
      )}

      <div>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : watchItems.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">No cards in your watchlist. Add some to keep track of auctions!</p>
          </Card>
        ) : filteredItems.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">No cards match your search filters.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map(item => (
              <WatchCard
                key={item.id}
                item={item}
                onUpdate={handleUpdateWatch}
                onDelete={handleDeleteWatch}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WatchList;