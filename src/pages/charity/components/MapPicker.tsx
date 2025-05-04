
import { useState, useEffect } from "react";
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
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icon issue
// This is needed because the default marker icons in Leaflet have relative paths
// that don't work properly in a bundled application
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapPickerProps {
  onLocationSelect: (latitude: string, longitude: string) => void;
}

// Component to handle map clicks and update marker position
function LocationMarker({ onLocationUpdate }: { onLocationUpdate: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationUpdate(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : (
    <Marker position={position} />
  );
}

export function MapPicker({ onLocationSelect }: MapPickerProps) {
  const [open, setOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(null);

  const handleLocationUpdate = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
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
            <MapContainer 
              center={[20, 0] as L.LatLngExpression} 
              zoom={2} 
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationMarker onLocationUpdate={handleLocationUpdate} />
            </MapContainer>
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
