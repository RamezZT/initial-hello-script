
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { VolunteersTable } from "@/components/volunteers/VolunteersTable";
import { VolunteerFilters } from "@/components/volunteers/VolunteerFilters";
import { getEvent } from "@/lib/api";
import { EventEntity, Volunteer } from "@/types";
import { ArrowLeft, Calendar, MapPin, Users } from "lucide-react";

export default function EventVolunteers() {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<EventEntity | null>(null);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]);

  useEffect(() => {
    if (event?.volunteers) {
      setVolunteers(event.volunteers);
      setFilteredVolunteers(event.volunteers);
      setLoading(false);
    }
  }, [event]);

  useEffect(() => {
    applyFilters();
  }, [volunteers, searchTerm, statusFilter]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const data = await getEvent(Number(eventId));
      setEvent(data);
    } catch (error) {
      console.error("Error fetching event details:", error);
      toast({
        title: "Error",
        description: "Failed to load event details",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...volunteers];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((volunteer) => 
        volunteer.donor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        volunteer.donor?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((volunteer) => volunteer.status === statusFilter);
    }

    setFilteredVolunteers(filtered);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilterStatus = (status: string) => {
    setStatusFilter(status);
  };

  const handleVolunteerStatusChange = () => {
    // Refresh event data to get updated volunteers
    fetchEventDetails();
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <DashboardLayout role="CHARITY">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Link to="/charity/events">
              <Button variant="outline" size="sm" className="mb-2">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">{event?.name || "Event"} - Volunteers</h1>
          </div>
        </div>

        {event && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{formatDate(event.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{event.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Volunteers</p>
                    <p className="font-medium">{volunteers.length}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Manage Volunteers</CardTitle>
          </CardHeader>
          <CardContent>
            <VolunteerFilters 
              onSearch={handleSearch}
              onFilterStatus={handleFilterStatus}
            />

            {loading ? (
              <div className="p-8 text-center">Loading volunteers...</div>
            ) : (
              <VolunteersTable 
                volunteers={filteredVolunteers} 
                onStatusChange={handleVolunteerStatusChange}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
