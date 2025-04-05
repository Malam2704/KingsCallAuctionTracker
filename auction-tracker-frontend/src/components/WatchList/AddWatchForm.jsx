import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function AddWatchForm({ onAddWatch }) {
  const [isOpen, setIsOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    cardName: '',
    cardRace: 'Human',
    cardRarity: '1',
    timeLeft: '',
    seller: '',
    goldAmount: '',
    hasBids: false,
    activelyBidding: false,
    description: ''
  });

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
  ];

  // Handle text/number input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewItem({
      ...newItem,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setNewItem({
      ...newItem,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newItem.cardName.trim()) {
      // Calculate auction end timestamp based on current time + hours left
      const hoursLeft = parseFloat(newItem.timeLeft) || 0;
      const auctionEndTime = new Date(
        new Date().getTime() + hoursLeft * 60 * 60 * 1000
      ).toISOString();

      // Create item with end timestamp instead of just hours left
      const itemWithTimestamp = {
        ...newItem,
        auctionEndTime: auctionEndTime,
        auctionDuration: newItem.timeLeft // Store original duration for reference
      };

      onAddWatch(itemWithTimestamp);
      setNewItem({
        cardName: '',
        cardRace: 'Human',
        cardRarity: '1',
        timeLeft: '',
        seller: '',
        goldAmount: '',
        hasBids: false,
        activelyBidding: false,
        description: ''
      });
      setIsOpen(false);
    }
  };

  // Function to render stars based on rarity
  const renderStars = (count) => {
    const rarity = parseInt(count);
    const colors = {
      1: 'text-gray-400',
      2: 'text-green-400',
      3: 'text-blue-400',
      4: 'text-purple-400',
      5: 'text-yellow-400',
      6: 'text-amber-500',
      7: 'text-red-500'
    };

    return (
      <div className="flex">
        {Array.from({ length: rarity }).map((_, i) => (
          <Star key={i} size={16} className={`${colors[rarity]} fill-current`} />
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus size={16} />
          Add to Watchlist
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Watchlist</DialogTitle>
          <DialogDescription>
            Add a card you want to keep an eye on in the auction house.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="cardName">Card Name*</Label>
            <Input
              id="cardName"
              name="cardName"
              value={newItem.cardName}
              onChange={handleChange}
              placeholder="Enter card name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cardRace">Card Race</Label>
              <Select
                value={newItem.cardRace}
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
                  value={newItem.cardRarity}
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
                  {renderStars(newItem.cardRarity)}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timeLeft">Hours Left*</Label>
              <Input
                id="timeLeft"
                name="timeLeft"
                type="number"
                step="0.1"
                min="0"
                value={newItem.timeLeft}
                onChange={handleChange}
                placeholder="Hours remaining"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goldAmount">Gold Amount</Label>
              <Input
                id="goldAmount"
                name="goldAmount"
                type="number"
                min="0"
                value={newItem.goldAmount}
                onChange={handleChange}
                placeholder="Current price"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seller">Seller</Label>
            <Input
              id="seller"
              name="seller"
              value={newItem.seller}
              onChange={handleChange}
              placeholder="Seller name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description/Abilities</Label>
            <Textarea
              id="description"
              name="description"
              value={newItem.description}
              onChange={handleChange}
              placeholder="Card abilities or effects..."
              className="h-20 resize-none"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasBids"
              checked={newItem.hasBids}
              onCheckedChange={(checked) => handleSelectChange('hasBids', checked)}
            />
            <Label htmlFor="hasBids" className="cursor-pointer">Has bids already</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add to Watchlist</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddWatchForm;