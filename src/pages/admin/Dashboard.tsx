
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getAllCharities, getAllDonations, getAllEvents } from "@/lib/api";
import { Charity, Donation, EventEntity } from "@/types";
import { BarChart2, Calendar, Users } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    charities: 0,
    donations: 0,
    events: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [charities, donations, events] = await Promise.all([
          getAllCharities(),
          getAllDonations(),
          getAllEvents(),
        ]);

        setStats({
          charities: charities.length,
          donations: donations.length,
          events: events.length,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <DashboardLayout role="ADMIN">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Welcome to the administrator dashboard. Here's an overview of your system.
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Charities</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "Loading..." : stats.charities}
              </div>
              <p className="text-xs text-muted-foreground">
                Registered charities in the system
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "Loading..." : stats.donations}
              </div>
              <p className="text-xs text-muted-foreground">
                Donations processed through the platform
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "Loading..." : stats.events}
              </div>
              <p className="text-xs text-muted-foreground">
                Events created by charities
              </p>
            </CardContent>
          </Card>
        </div>

        {/* You can add more dashboard content here */}
      </div>
    </DashboardLayout>
  );
}
