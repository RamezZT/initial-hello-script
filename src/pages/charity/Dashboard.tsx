
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getAllEvents, getAllDonations } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { User } from "@/types";
import { Calendar, BarChart2 } from "lucide-react";

export default function CharityDashboard() {
  const [stats, setStats] = useState({
    events: 0,
    donations: 0,
  });
  const [loading, setLoading] = useState(true);
  const user = getUser() as User;
  const charityId = user?.charity?.id;

  useEffect(() => {
    if (!charityId) return;

    const fetchStats = async () => {
      try {
        const [events, donations] = await Promise.all([
          getAllEvents(charityId),
          getAllDonations(), // This should be filtered for charity's donations
        ]);

        setStats({
          events: events.length,
          donations: donations.filter(d => d.charity.id === charityId).length,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [charityId]);

  return (
    <DashboardLayout role="CHARITY">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Welcome to your charity dashboard. Here's an overview of your activity.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "Loading..." : stats.events}
              </div>
              <p className="text-xs text-muted-foreground">
                Events created by your charity
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Donations</CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "Loading..." : stats.donations}
              </div>
              <p className="text-xs text-muted-foreground">
                Donations to your charity
              </p>
            </CardContent>
          </Card>
        </div>

        {/* You can add more dashboard content here */}
      </div>
    </DashboardLayout>
  );
}
