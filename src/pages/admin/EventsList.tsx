
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getAllEvents, deleteEvent } from "@/lib/api";
import { EventEntity } from "@/types";
import { EditEventForm } from "@/components/events/EditEventForm";
import { CharityFilter } from "@/components/events/CharityFilter";
import { EventsTable } from "@/components/events/EventsTable";

export default function EventsList() {
  const [events, setEvents] = useState<EventEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCharityId, setSelectedCharityId] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<EventEntity | null>(null);

  useEffect(() => {
    fetchEvents();
  }, [selectedCharityId]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getAllEvents(selectedCharityId ? parseInt(selectedCharityId) : undefined);
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }
    
    try {
      await deleteEvent(id);
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <DashboardLayout role="ADMIN">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Events</h1>
          <CharityFilter onFilterChange={setSelectedCharityId} />
        </div>
        
        <Card>
          {loading ? (
            <div className="p-8 text-center">Loading events...</div>
          ) : (
            <EventsTable 
              events={events}
              onDelete={handleDelete}
              onEdit={setSelectedEvent}
              formatDate={formatDate}
            />
          )}
        </Card>
      </div>

      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <EditEventForm 
              event={selectedEvent}
              onSuccess={() => {
                setSelectedEvent(null);
                fetchEvents();
              }}
              onCancel={() => setSelectedEvent(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
