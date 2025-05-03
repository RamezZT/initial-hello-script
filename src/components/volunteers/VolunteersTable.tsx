
import { useState } from "react";
import { Volunteer } from "@/types";
import { updateVolunteerStatus } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserCheck, UserX, User } from "lucide-react";

interface VolunteersTableProps {
  volunteers: Volunteer[];
  onStatusChange: () => void;
}

export function VolunteersTable({ volunteers, onStatusChange }: VolunteersTableProps) {
  const [processingId, setProcessingId] = useState<number | null>(null);

  const handleStatusChange = async (volunteerId: number, status: "ACCEPTED" | "REJECTED" | "IDLE") => {
    try {
      setProcessingId(volunteerId);
      await updateVolunteerStatus(volunteerId, status);
      toast({
        title: "Status updated",
        description: `Volunteer status updated to ${status.toLowerCase()}.`,
      });
      onStatusChange();
    } catch (error) {
      console.error("Error updating volunteer status:", error);
      toast({
        title: "Error",
        description: "Failed to update volunteer status.",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return <UserCheck className="h-4 w-4 text-green-500" />;
      case "REJECTED":
        return <UserX className="h-4 w-4 text-red-500" />;
      default:
        return <User className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Joined At</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {volunteers.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center">
              No volunteers found
            </TableCell>
          </TableRow>
        ) : (
          volunteers.map((volunteer) => (
            <TableRow key={volunteer.id}>
              <TableCell>{volunteer.id}</TableCell>
              <TableCell className="font-medium">{volunteer.donor?.name || "N/A"}</TableCell>
              <TableCell>{volunteer.donor?.email || "N/A"}</TableCell>
              <TableCell>{volunteer.donor?.phone || "N/A"}</TableCell>
              <TableCell>{new Date(volunteer.joinedAt).toLocaleDateString()}</TableCell>
              <TableCell className="flex items-center gap-1">
                {getStatusIcon(volunteer.status)} {volunteer.status}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" disabled={processingId === volunteer.id}>
                      {processingId === volunteer.id ? "Updating..." : "Change Status"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-background">
                    <DropdownMenuItem 
                      onClick={() => handleStatusChange(volunteer.id, "ACCEPTED")}
                      disabled={volunteer.status === "ACCEPTED"}
                      className="flex items-center gap-2"
                    >
                      <UserCheck className="h-4 w-4" /> Accept
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleStatusChange(volunteer.id, "REJECTED")}
                      disabled={volunteer.status === "REJECTED"}
                      className="flex items-center gap-2"
                    >
                      <UserX className="h-4 w-4" /> Reject
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleStatusChange(volunteer.id, "IDLE")}
                      disabled={volunteer.status === "IDLE"}
                      className="flex items-center gap-2"
                    >
                      <User className="h-4 w-4" /> Reset to Idle
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
