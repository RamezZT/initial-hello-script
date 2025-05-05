
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { toggleCharityFundReceiving } from "@/lib/api";

interface DonationSettingsProps {
  charityId: number | undefined;
  canReceiveFunds: boolean;
  refreshUserData: () => void;
}

export default function DonationSettings({
  charityId,
  canReceiveFunds,
  refreshUserData,
}: DonationSettingsProps) {
  const [toggleLoading, setToggleLoading] = useState(false);

  // Toggle fund receiving status
  const handleToggleFundReceiving = async () => {
    if (!charityId) return;
    
    try {
      setToggleLoading(true);
      const newStatus = !canReceiveFunds;
      
      const result = await toggleCharityFundReceiving(charityId, newStatus);
      
      // Update the user in localStorage with the new charity status
      refreshUserData();
      
      toast({
        title: "Success",
        description: `Donations are now ${result.canReceiveFunds ? 'enabled' : 'disabled'} for your charity`,
      });
      
    } catch (error) {
      console.error("Error toggling fund receiving:", error);
      toast({
        title: "Error",
        description: "Failed to update fund receiving status",
        variant: "destructive",
      });
    } finally {
      setToggleLoading(false);
    }
  };

  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Donation Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row items-center justify-between">
          <div>
            <h3 className="font-medium">Accept Donations</h3>
            <p className="text-sm text-muted-foreground">
              {canReceiveFunds 
                ? "Your charity can receive donations" 
                : "Your charity cannot receive donations"}
            </p>
          </div>
          <Button 
            variant={canReceiveFunds ? "outline" : "default"}
            onClick={handleToggleFundReceiving}
            disabled={toggleLoading}
            className="min-w-[120px]"
          >
            {toggleLoading ? "Updating..." : (canReceiveFunds ? "Disable" : "Enable")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
