
import { useState } from "react";
import { MapPin } from "lucide-react";
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
  
  // Load Google Maps JavaScript API with a consistent ID
  const { isLoaded } = useJsApiLoader({
    id: GOOGLE_MAPS_LOADER_ID,
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
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
          <DialogDescription>Click on the map to select your charity location.</DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="h-[400px] w-full rounded-md border">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={selectedLocation || defaultCenter}
                zoom={selectedLocation ? 8 : 2}
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
