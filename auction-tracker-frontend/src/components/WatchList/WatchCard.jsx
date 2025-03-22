import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, User, Coins, Star, Eye, ShoppingCart, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

function WatchCard({ item, onUpdate, onDelete, onMoveToBids }) {
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
  };

  // Get badge color for race
  const getRaceBadgeColor = (race) => {
    const color = raceColorMap[race] || 'gray';
    return `bg-${color}-100 text-${color}-800 border-${color}-300`;
  };

  // Calculate time left percentage for progress bar
  const calculateTimeProgress = () => {
    const timeLeft = parseFloat(item.timeLeft) || 0;
    // Assuming auctions typically last 24 hours max
    const maxTime = 24;
    const percentage = Math.max(0, Math.min(100, 100 - (timeLeft / maxTime * 100)));
    return percentage;
  };

  // Get appropriate color for time progress bar
  const getTimeProgressColor = () => {
    const timeLeft = parseFloat(item.timeLeft) || 0;
    if (timeLeft <= 1) return "bg-red-500";
    if (timeLeft <= 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Render stars based on rarity
  const renderStars = (count) => {
    if (!count || isNaN(parseInt(count))) return null;

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
          <Star key={i} size={14} className={`${colors[rarity]} fill-current`} />
        ))}
      </div>
    );
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-bold truncate">{item.cardName}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onMoveToBids(item)}>
                <ShoppingCart size={14} className="mr-2" />
                Bid on Card
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(item.id)} className="text-red-500">
                <Eye size={14} className="mr-2" />
                Remove from Watchlist
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-1">
          {item.cardRace && (
            <Badge variant="outline" className={getRaceBadgeColor(item.cardRace)}>
              {item.cardRace}
            </Badge>
          )}
          {item.cardRarity && renderStars(item.cardRarity)}
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
            <Clock size={14} className={parseFloat(item.timeLeft) <= 1 ? "text-red-500" : "text-blue-500"} />
            <div className="w-full">
              <div className="flex justify-between items-center mb-1">
                <span className={`text-xs font-medium ${parseFloat(item.timeLeft) <= 1 ? "text-red-500" : "text-gray-700"}`}>
                  {item.timeLeft} hours left
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
      </CardContent>

      <CardFooter className="p-3 pt-0 flex-shrink-0">
        <Button
          className="w-full text-sm h-8"
          variant={item.hasBids ? "secondary" : "default"}
          onClick={() => onMoveToBids(item)}
        >
          {item.hasBids ? "Has Bids" : "Bid Now"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default WatchCard;