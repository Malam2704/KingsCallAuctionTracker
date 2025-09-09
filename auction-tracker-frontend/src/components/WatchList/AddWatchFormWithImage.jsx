import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Plus, Upload, X, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function AddWatchFormWithImage({ onAddWatch }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const fileInputRef = useRef(null);

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

  const raceOptions = [
    'Human', 'Elf', 'Halfblood', 'Goblin', 'Ogre', 'Beast',
    'Outsider/Planes', 'Angel/Celestial', 'Dragons', 'Demons', 'Undead', 'Special', 'Skills'
  ];

  // Simple OCR parsing function for auction screenshots
  const parseAuctionImage = async (imageFile) => {
    try {
      // Try to use Tesseract.js if available
      const Tesseract = await import('tesseract.js');

      const { data: { text } } = await Tesseract.recognize(imageFile, 'eng');

      // Parse the text for auction data
      const result = {};

      // Look for card names (common patterns from your screenshots)
      const cardNameMatch = text.match(/(Coral Blue|Archangel Israp|ARK Sniper|Prime Valkyrie|Santoryu|Chariot Reversed|Queen Reversed|Strength Reversed|Xihai Lunu|Garden Guard|[A-Za-z\s]{3,25})/i);
      if (cardNameMatch) {
        result.cardName = cardNameMatch[1].trim();
      }

      // Look for time (format: "4Hours", "20Hours", etc.)
      const timeMatch = text.match(/(\d+)\s*Hours?/i);
      if (timeMatch) {
        result.timeLeft = timeMatch[1];
      }

      // Look for gold amount (number before "Max.")
      const goldMatch = text.match(/(\d+)\s*(?=Max\.?)/i);
      if (goldMatch) {
        result.goldAmount = goldMatch[1];
      }

      // Look for seller names (between time and bidder)
      const sellerMatch = text.match(/Hours?\s+([A-Za-z0-9]{3,15})/i);
      if (sellerMatch) {
        result.seller = sellerMatch[1];
      }

      return result;
    } catch (error) {
      console.warn('OCR not available or failed:', error);
      return {}; // Return empty object if OCR fails
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleImageFile = async (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setIsProcessing(true);
    setUploadedImage(URL.createObjectURL(file));

    try {
      const extractedData = await parseAuctionImage(file);

      // Update form fields with extracted data
      setNewItem(prev => ({
        ...prev,
        ...extractedData
      }));

    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  };

  const clearImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewItem({
      ...newItem,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSelectChange = (name, value) => {
    setNewItem({
      ...newItem,
      [name]: value
    });
  };

  const handleSubmit = () => {
    if (newItem.cardName.trim()) {
      const hoursLeft = parseFloat(newItem.timeLeft) || 0;
      const auctionEndTime = new Date(
        new Date().getTime() + hoursLeft * 60 * 60 * 1000
      ).toISOString();

      const itemWithTimestamp = {
        ...newItem,
        auctionEndTime: auctionEndTime,
        auctionDuration: newItem.timeLeft
      };

      onAddWatch(itemWithTimestamp);

      // Reset form
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
      setUploadedImage(null);
      setIsOpen(false);
    }
  };

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
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add to Watchlist</DialogTitle>
          <DialogDescription>
            Drop a screenshot below to auto-fill, or enter details manually.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Image Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${dragActive ? 'border-primary bg-primary/10' : 'border-gray-300'
              }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {uploadedImage ? (
              <div className="space-y-2">
                <img
                  src={uploadedImage}
                  alt="Uploaded screenshot"
                  className="max-w-full max-h-32 mx-auto rounded"
                />
                <div className="flex items-center justify-center gap-2">
                  {isProcessing && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <Loader2 size={16} className="animate-spin" />
                      Processing...
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={clearImage}
                  >
                    <X size={16} className="mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <p className="text-sm">Drop auction screenshot here</p>
                <p className="text-xs text-gray-500">or</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Manual Form Fields */}
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
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add to Watchlist</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddWatchFormWithImage;