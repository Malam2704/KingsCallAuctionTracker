import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, User, Coins, Star, Trash2, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

function WatchCard({ item, onUpdate, onDelete }) {
  // Race options with colors based on the provided icon image
  const raceColorMap = {
    'Human': 'cyan',
    'Elf': 'green',
    'Halfblood': 'yellow',
    'Goblin': 'slate',
    'Ogre': 'stone',
    'Beast': 'orange',
    'Outsider/Planes': 'violet',
    'Angel/Celestial': 'sky',
    'Dragons': 'red',
    'Demons': 'fuchsia',
    'Undead': 'purple',
    'Special': 'white',
    'Skills': 'gray'
  };

  // Get background color for race
  const getRaceBackgroundColor = (race) => {
    const colorMap = {
      'Human': 'bg-cyan-100',
      'Elf': 'bg-green-100',
      'Halfblood': 'bg-yellow-100',
      'Goblin': 'bg-slate-200',
      'Ogre': 'bg-stone-200',
      'Beast': 'bg-orange-100',
      'Outsider/Planes': 'bg-violet-100',
      'Angel/Celestial': 'bg-sky-100',
      'Dragons': 'bg-red-100',
      'Demons': 'bg-fuchsia-100',
      'Undead': 'bg-purple-100',
      'Special': 'bg-pink-50',
      'Skills': 'bg-gray-100'
    };
    return colorMap[race] || 'bg-gray-100';
  };

  // Get border color for race
  const getRaceBorderColor = (race) => {
    const colorMap = {
      'Human': 'border-cyan-500',
      'Elf': 'border-green-600',
      'Halfblood': 'border-yellow-500',
      'Goblin': 'border-slate-500',
      'Ogre': 'border-stone-700',
      'Beast': 'border-orange-500',
      'Outsider/Planes': 'border-violet-600',
      'Angel/Celestial': 'border-sky-400',
      'Dragons': 'border-red-600',
      'Demons': 'border-fuchsia-700',
      'Undead': 'border-purple-600',
      'Special': 'border-pink-500',
      'Skills': 'border-gray-500'
    };
    return colorMap[race] || 'border-gray-500';
  };

  // Get badge color for race
  const getRaceBadgeColor = (race) => {
    const color = raceColorMap[race] || 'gray';
    if (color === 'cyan') return 'bg-cyan-100 text-cyan-800 border-cyan-300';
    if (color === 'fuchsia') return 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300';
    if (color === 'violet') return 'bg-violet-100 text-violet-800 border-violet-300';
    if (color === 'stone') return 'bg-stone-100 text-stone-800 border-stone-300';
    return `bg-${color}-100 text-${color}-800 border-${color}-300`;
  };

  // Handle bidding checkbox change
  const handleBiddingChange = (checked) => {
    onUpdate({
      ...item,
      activelyBidding: checked
    });
  };

  // Safely get card race (with fallback)
  const cardRace = item.cardRace || 'Human';

  // Calculate time left based on end timestamp
  const calculateTimeRemaining = () => {
    if (!item.auctionEndTime) {
      // Fall back to the old method if no end timestamp is available
      return parseFloat(item.timeLeft) || 0;
    }

    const now = new Date();
    const endTime = new Date(item.auctionEndTime);
    const diffMs = endTime - now;
    const diffHours = diffMs / (1000 * 60 * 60); // Convert ms to hours

    return Math.max(0, diffHours); // Never show negative time
  };

  // Format time for display
  const formatTimeRemaining = (hours) => {
    if (hours === 0) return "Auction ended";

    if (hours < 1) {
      const minutes = Math.ceil(hours * 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} left`;
    }

    return `${hours.toFixed(1)} hour${hours !== 1 ? 's' : ''} left`;
  };

  const timeRemaining = calculateTimeRemaining();
  const isAuctionEnded = timeRemaining === 0;

  // Calculate time left percentage for progress bar
  const calculateTimeProgress = () => {
    // For new timestamp-based calculation
    if (item.auctionEndTime && item.auctionDuration) {
      const originalDuration = parseFloat(item.auctionDuration);
      const remaining = timeRemaining;
      const elapsed = originalDuration - remaining;
      const percentage = Math.max(0, Math.min(100, (elapsed / originalDuration) * 100));
      return percentage;
    }

    // Fallback to original calculation
    const timeLeft = parseFloat(item.timeLeft) || 0;
    // Assuming auctions typically last 24 hours max
    const maxTime = 24;
    const percentage = Math.max(0, Math.min(100, 100 - (timeLeft / maxTime * 100)));
    return percentage;
  };

  // Get appropriate color for time progress bar
  const getTimeProgressColor = () => {
    if (isAuctionEnded) return "bg-gray-500"; // Ended auctions
    if (timeRemaining <= 1) return "bg-red-500"; // Less than 1 hour
    if (timeRemaining <= 4) return "bg-yellow-500"; // Less than 4 hours
    return "bg-green-500"; // More than 4 hours
  };

  // Function to render stars based on rarity
  const renderStars = (count) => {
    if (!count || isNaN(parseInt(count))) return null;

    const rarity = parseInt(count);
    const colors = {
      1: 'text-gray-400',
      2: 'text-green-400',
      3: 'text-blue-400',
      4: 'text-purple-400',
      5: 'text-amber-400',
      6: 'text-red-500',
      7: 'text-yellow-500'
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
    <Card className={`overflow-hidden flex flex-col h-full border-2 ${getRaceBorderColor(cardRace)} ${getRaceBackgroundColor(cardRace)} hover:shadow-md transition-shadow`}>
      <CardHeader className="p-4 pb-2 flex flex-col items-center">
        {/* Rarity Stars at the top, prominently displayed */}
        <div className="mb-2 bg-white/80 px-3 py-1 rounded-full shadow-sm">
          {item.cardRarity && renderStars(item.cardRarity)}
        </div>

        {/* Card Name centered below the stars */}
        <CardTitle className="text-center text-lg font-bold">{item.cardName}</CardTitle>

        {/* Race as a badge */}
        {cardRace && (
          <Badge variant="outline" className={`mt-1 ${getRaceBadgeColor(cardRace)}`}>
            {cardRace}
          </Badge>
        )}

        {/* Options dropdown menu */}
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onDelete(item.id)} className="text-red-500">
                <Trash2 size={14} className="mr-2" />
                Remove from Watchlist
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-1 flex-grow">
        <div className="space-y-2 text-sm">
          {item.seller && (
            <div className="flex items-center gap-2">
              <User size={14} className="text-gray-500" />
              <span className="text-gray-700">{item.seller}</span>
            </div>
          )}

          {item.goldAmount && (
            <div className="flex items-center gap-2">
              <Coins size={14} className="text-yellow-500" />
              <span className="font-medium">{item.goldAmount} Gold</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Clock size={14} className={isAuctionEnded ? "text-gray-500" : timeRemaining <= 1 ? "text-red-500" : "text-blue-500"} />
            <div className="w-full">
              <div className="flex justify-between items-center mb-1">
                <span className={`text-xs font-medium ${isAuctionEnded
                  ? "text-gray-500"
                  : timeRemaining <= 1
                    ? "text-red-500"
                    : "text-gray-700"
                  }`}>
                  {formatTimeRemaining(timeRemaining)}
                </span>
              </div>
              <Progress
                value={calculateTimeProgress()}
                className="h-1.5"
                indicatorClassName={getTimeProgressColor()}
              />
            </div>
          </div>


        </div>

        {item.description && (
          <div className="mt-3 border-t pt-2 text-sm text-gray-600 line-clamp-2">
            {item.description}
          </div>
        )}

        {/* Bidding status toggle at bottom of content */}
        <div
          className={`mt-3 py-2 px-3 rounded cursor-pointer flex items-center gap-2 transition-colors ${item.activelyBidding ? 'bg-blue-100' : 'bg-gray-100'
            }`}
          onClick={() => handleBiddingChange(!item.activelyBidding)}
        >
          <Checkbox
            id={`bidding-${item.id}`}
            checked={item.activelyBidding || false}
            onCheckedChange={handleBiddingChange}
          />
          <span className={`text-sm ${item.activelyBidding ? 'text-blue-700 font-medium' : 'text-gray-600'}`}>
            {item.activelyBidding ? 'Currently Bidding' : 'Click to Bid'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default WatchCard;