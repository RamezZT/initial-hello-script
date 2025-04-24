
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getAllCharities, deleteCharity } from "@/lib/api";
import { Charity } from "@/types";
import { Edit, Trash2, Eye } from "lucide-react";
import { EditCharityForm } from "@/components/charities/EditCharityForm";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from "@/components/ui/table";

export default function CharitiesList() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCharity, setSelectedCharity] = useState<Charity | null>(null);

  useEffect(() => {
    fetchCharities();
  }, []);

  const fetchCharities = async () => {
    try {
      setLoading(true);
      const data = await getAllCharities();
      setCharities(data);
    } catch (error) {
      console.error("Error fetching charities:", error);
      toast({
        title: "Error",
        description: "Failed to load charities",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this charity?")) {
      return;
    }
    
    try {
      await deleteCharity(id);
      toast({
        title: "Success",
        description: "Charity deleted successfully",
      });
      fetchCharities(); // Refresh the list
    } catch (error) {
      console.error("Error deleting charity:", error);
      toast({
        title: "Error",
        description: "Failed to delete charity",
        variant: "destructive",
      });
    }
  };

  const filteredCharities = charities.filter(charity =>
    charity.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout role="ADMIN">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Charities</h1>
          <div className="w-[200px]">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search charity"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </div>
        
        <Card>
          {loading ? (
            <div className="p-8 text-center">Loading charities...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Can Receive Funds</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCharities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      {searchTerm ? "No charities found" : "No charities available"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCharities.map((charity) => (
                    <TableRow key={charity.id}>
                      <TableCell>{charity.id}</TableCell>
                      <TableCell className="font-medium">{charity.name}</TableCell>
                      <TableCell>{charity.email}</TableCell>
                      <TableCell>{charity.address}</TableCell>
                      <TableCell>{charity.phone}</TableCell>
                      <TableCell>{charity.canReceiveFunds ? "Yes" : "No"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => setSelectedCharity(charity)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleDelete(charity.id)}
                          >
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
          )}
        </Card>

        <Dialog open={!!selectedCharity} onOpenChange={(open) => !open && setSelectedCharity(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Charity</DialogTitle>
            </DialogHeader>
            {selectedCharity && (
              <EditCharityForm 
                charity={selectedCharity}
                onSuccess={() => {
                  setSelectedCharity(null);
                  fetchCharities();
                }}
                onCancel={() => setSelectedCharity(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
