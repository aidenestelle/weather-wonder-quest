
import React, { useState } from 'react';
import { WeatherLocation } from '@/types/weather';
import { searchLocations } from '@/utils/weatherApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Search, 
  Plus, 
  X, 
  MapPinOff, 
  LocateFixed,
  RefreshCw 
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LocationManagerProps {
  savedLocations: WeatherLocation[];
  selectedLocation: WeatherLocation;
  onSelectLocation: (location: WeatherLocation) => void;
  onAddLocation: (location: WeatherLocation) => void;
  onRemoveLocation: (locationId: string) => void;
}

const LocationManager: React.FC<LocationManagerProps> = ({
  savedLocations,
  selectedLocation,
  onSelectLocation,
  onAddLocation,
  onRemoveLocation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<WeatherLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setIsSearching(true);
      const results = await searchLocations(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching locations:', error);
      toast({
        title: 'Search Error',
        description: 'Unable to search for locations. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleAddLocation = (location: WeatherLocation) => {
    onAddLocation(location);
    setSearchQuery('');
    setSearchResults([]);
    setAddDialogOpen(false);
    
    toast({
      title: 'Location Added',
      description: `${location.name} has been added to your saved locations.`,
    });
  };

  const handleRemoveLocation = (locationId: string, locationName: string) => {
    onRemoveLocation(locationId);
    
    toast({
      title: 'Location Removed',
      description: `${locationName} has been removed from your saved locations.`,
    });
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // Generate a unique ID for this location
            const locationId = `current-${latitude.toFixed(4)}-${longitude.toFixed(4)}`;
            
            // Create a location object
            const currentLocation: WeatherLocation = {
              id: locationId,
              name: 'Current Location',
              lat: latitude,
              lon: longitude,
            };
            
            // Add this location
            onAddLocation(currentLocation);
            onSelectLocation(currentLocation);
            
            toast({
              title: 'Location Updated',
              description: 'Using your current location.',
            });
          } catch (error) {
            console.error('Error getting current location:', error);
            toast({
              title: 'Location Error',
              description: 'Unable to get your current location. Please try again.',
              variant: 'destructive',
            });
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast({
            title: 'Location Access Denied',
            description: 'Please allow location access or add locations manually.',
            variant: 'destructive',
          });
        }
      );
    } else {
      toast({
        title: 'Geolocation Not Supported',
        description: 'Your browser does not support geolocation. Please add locations manually.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            <span>Locations</span>
          </CardTitle>
          
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8">
                <Plus className="h-4 w-4 mr-1" /> Add Location
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Location</DialogTitle>
              </DialogHeader>
              
              <div className="flex items-center space-x-2 my-4">
                <Input
                  placeholder="Search for a city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
                <Button 
                  onClick={handleSearch} 
                  disabled={isSearching || !searchQuery.trim()}
                  size="icon"
                >
                  {isSearching ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
              
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleGetCurrentLocation}
                >
                  <LocateFixed className="h-4 w-4 mr-2" />
                  Use Current Location
                </Button>
              </div>
              
              {searchResults.length > 0 ? (
                <ScrollArea className="h-60">
                  <div className="space-y-2 mt-4">
                    {searchResults.map((location) => (
                      <div
                        key={location.id}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-blue-50 cursor-pointer"
                        onClick={() => handleAddLocation(location)}
                      >
                        <div>
                          <div className="font-medium">{location.name}</div>
                          <div className="text-xs text-gray-500">
                            {location.state && `${location.state}, `}
                            {location.country}
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : searchQuery && !isSearching ? (
                <div className="flex flex-col items-center justify-center py-6">
                  <MapPinOff className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">No locations found. Try a different search.</p>
                </div>
              ) : null}
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {savedLocations.length > 0 ? (
          <div className="space-y-2">
            {savedLocations.map((location) => (
              <div
                key={location.id}
                className={`
                  flex items-center justify-between p-3 rounded-lg transition-colors
                  ${selectedLocation.id === location.id 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'border hover:border-blue-200 cursor-pointer'}
                `}
                onClick={() => onSelectLocation(location)}
              >
                <div className="flex items-center gap-2">
                  <MapPin 
                    className={`h-5 w-5 ${selectedLocation.id === location.id ? 'text-blue-500' : 'text-gray-500'}`} 
                  />
                  <div>
                    <div className="font-medium">{location.name}</div>
                    {location.country && (
                      <div className="text-xs text-gray-500">
                        {location.state && `${location.state}, `}
                        {location.country}
                      </div>
                    )}
                  </div>
                </div>
                
                {savedLocations.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveLocation(location.id, location.name);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <MapPinOff className="h-10 w-10 text-gray-300 mb-2" />
            <p className="text-sm text-gray-500 mb-2">No saved locations</p>
            <Button size="sm" onClick={() => setAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-1" /> Add Location
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationManager;
