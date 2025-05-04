
import { useState } from "react";
import { MapPin, Locate, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface MapPickerProps {
  onLocationSelect: (latitude: string, longitude: string) => void;
}

// Default map center (world view)
const defaultCenter = {
  lat: 20,
  lng: 0
};

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

// Use a consistent loader ID across the entire application
const GOOGLE_MAPS_LOADER_ID = "google-map-loader";
const GOOGLE_MAPS_API_KEY = "AIzaSyAzmf6d3cEi3aXZgVEsFYHV24dW9rUp3nA";

export function MapPicker({ onLocationSelect }: MapPickerProps) {
  const [open, setOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  // Load Google Maps JavaScript API with a consistent ID
  const { isLoaded } = useJsApiLoader({
    id: GOOGLE_MAPS_LOADER_ID,
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setSelectedLocation({ lat, lng });
    }
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onLocationSelect(
        selectedLocation.lat.toString(),
        selectedLocation.lng.toString()
      );
      setOpen(false);
    }
  };

  const handleFindMyLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setSelectedLocation(currentLocation);
          toast.success("Current location found!");
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Could not access your location. Please check your browser permissions.");
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
      setIsLocating(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a location to search");
      return;
    }

    setIsSearching(true);
    
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: searchQuery }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
        const location = results[0].geometry.location;
        const newLocation = {
          lat: location.lat(),
          lng: location.lng()
        };
        setSelectedLocation(newLocation);
        toast.success(`Found "${searchQuery}"`);
      } else {
        toast.error(`Could not find "${searchQuery}"`);
        console.error("Geocoding error:", status);
      }
      setIsSearching(false);
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" type="button" className="w-full">
          <MapPin className="mr-2 h-4 w-4" />
          Select Location on Map
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Select Charity Location</DialogTitle>
          <DialogDescription>Search for a location, use your current location, or click on the map.</DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="flex gap-2 mb-2">
            <div className="flex-1">
              <div className="flex gap-2">
                <Input
                  placeholder="Search for a location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="flex-1"
                  disabled={!isLoaded || isSearching}
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSearch}
                  disabled={!isLoaded || isSearching}
                >
                  <Search className="mr-2 h-4 w-4" />
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleFindMyLocation} 
              disabled={isLocating || !isLoaded}
            >
              <Locate className="mr-2 h-4 w-4" />
              {isLocating ? "Finding..." : "My Location"}
            </Button>
          </div>
          
          <div className="h-[400px] w-full rounded-md border">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={selectedLocation || defaultCenter}
                zoom={selectedLocation ? 13 : 2}
                onClick={handleMapClick}
              >
                {selectedLocation && (
                  <Marker position={selectedLocation} />
                )}
              </GoogleMap>
            ) : (
              <div className="flex items-center justify-center h-full">
                Loading map...
              </div>
            )}
          </div>
          
          <div className="mt-4 flex justify-between">
            {selectedLocation && (
              <div className="text-sm">
                <p>Selected coordinates:</p>
                <p>Latitude: {selectedLocation.lat.toFixed(6)}</p>
                <p>Longitude: {selectedLocation.lng.toFixed(6)}</p>
              </div>
            )}
            <Button 
              onClick={handleConfirmLocation}
              disabled={!selectedLocation}
              className="ml-auto"
            >
              Confirm Location
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
