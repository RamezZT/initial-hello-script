
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EventEntity } from "@/types";
import { Edit, Trash2, Eye } from "lucide-react";

interface EventsTableProps {
  events: EventEntity[];
  onDelete: (id: number) => void;
  onEdit: (event: EventEntity) => void;
  formatDate: (date: Date) => string;
}

export function EventsTable({ events, onDelete, onEdit, formatDate }: EventsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Charity</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center">
              No events found
            </TableCell>
          </TableRow>
        ) : (
          events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>{event.id}</TableCell>
              <TableCell className="font-medium">{event.name}</TableCell>
              <TableCell>{formatDate(event.date)}</TableCell>
              <TableCell>{event.location}</TableCell>
              <TableCell>{event.charity?.name || "N/A"}</TableCell>
              <TableCell>{event.finished ? "Finished" : "Active"}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => onEdit(event)}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => onDelete(event.id)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
