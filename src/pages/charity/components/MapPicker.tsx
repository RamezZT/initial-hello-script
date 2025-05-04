
import { useState, useEffect, useRef } from "react";
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
import { Input } from "@/components/ui/input";

// Define the Google Maps types
declare global {
  interface Window {
    initMap: () => void;
    google: any;
  }
}

interface MapPickerProps {
  onLocationSelect: (latitude: string, longitude: string) => void;
}

export function MapPicker({ onLocationSelect }: MapPickerProps) {
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<any>(null);
  const mapInstance = useRef<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(null);

  const loadMap = () => {
    if (!open || !mapRef.current || !apiKey) return;
    
    // Check if the API is already loaded
    if (window.google && window.google.maps) {
      initMap();
      return;
    }

    // Create function accessible from global scope
    window.initMap = initMap;

    // Load Google Maps API dynamically
    const googleMapsApiScript = document.createElement("script");
    googleMapsApiScript.src = 
      `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&libraries=places`;
    googleMapsApiScript.async = true;
    googleMapsApiScript.defer = true;
    document.head.appendChild(googleMapsApiScript);
  };

  // Initialize the map
  function initMap() {
    if (!mapRef.current) return;

    // Default location (center of the world)
    const defaultLocation = { lat: 0, lng: 0 };
    
    // Create map instance
    const map = new window.google.maps.Map(mapRef.current, {
      center: defaultLocation,
      zoom: 2,
      mapTypeControl: false,
    });
    
    mapInstance.current = map;
    setMapLoaded(true);
    
    // Create a marker for selection
    const marker = new window.google.maps.Marker({
      map,
      draggable: true,
      position: defaultLocation,
      visible: false,
    });
    
    markerRef.current = marker;
    
    // Add click event to the map
    map.addListener("click", (e: any) => {
      if (!e.latLng) return;
      
      const clickedLocation = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      
      marker.setPosition(clickedLocation);
      marker.setVisible(true);
      setSelectedLocation(clickedLocation);
    });
    
    // Handle marker drag end
    marker.addListener("dragend", () => {
      const position = marker.getPosition();
      if (position) {
        setSelectedLocation({
          lat: position.lat(),
          lng: position.lng(),
        });
      }
    });
  }

  // Call loadMap when the dialog is opened and API key is available
  useEffect(() => {
    if (open && apiKey) {
      loadMap();
    }
  }, [open, apiKey]);

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
          <DialogDescription>Click on the map to select your charity location or drag the marker to adjust.</DialogDescription>
        </DialogHeader>
        
        {!mapLoaded && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">Enter your Google Maps API key to load the map:</p>
            <div className="flex gap-2">
              <Input
                placeholder="Google Maps API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <Button onClick={loadMap} disabled={!apiKey}>Load Map</Button>
            </div>
          </div>
        )}
        
        <div className="mt-4">
          <div ref={mapRef} className="h-[400px] w-full rounded-md border"></div>
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
