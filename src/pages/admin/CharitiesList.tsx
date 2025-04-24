
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
import { getAllCharities, deleteCharity, updateCharityStatus } from "@/lib/api";
import { Charity, CHARITY_STATUS } from "@/types";
import { Edit, Trash2, Eye, Check, X, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";
import { EditCharityForm } from "@/components/charities/EditCharityForm";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CharitiesList() {
  const [charities, setCharities] = useState<{
    [CHARITY_STATUS.PENDING]: Charity[];
    [CHARITY_STATUS.ACCEPTED]: Charity[];
    [CHARITY_STATUS.REJECTED]: Charity[];
  }>({
    [CHARITY_STATUS.PENDING]: [],
    [CHARITY_STATUS.ACCEPTED]: [],
    [CHARITY_STATUS.REJECTED]: [],
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCharity, setSelectedCharity] = useState<Charity | null>(null);
  const [activeTab, setActiveTab] = useState<CHARITY_STATUS>(CHARITY_STATUS.PENDING);

  useEffect(() => {
    fetchCharities();
  }, []);

  const fetchCharities = async () => {
    try {
      setLoading(true);
      const [pendingCharities, acceptedCharities, rejectedCharities] = await Promise.all([
        getAllCharities(CHARITY_STATUS.PENDING),
        getAllCharities(CHARITY_STATUS.ACCEPTED),
        getAllCharities(CHARITY_STATUS.REJECTED),
      ]);

      setCharities({
        [CHARITY_STATUS.PENDING]: pendingCharities || [],
        [CHARITY_STATUS.ACCEPTED]: acceptedCharities || [],
        [CHARITY_STATUS.REJECTED]: rejectedCharities || [],
      });
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

  const handleStatusChange = async (id: number, newStatus: CHARITY_STATUS) => {
    try {
      await updateCharityStatus(id, newStatus);
      toast({
        title: "Success",
        description: `Charity status updated to ${newStatus}`,
      });
      fetchCharities(); // Refresh the list
    } catch (error) {
      console.error("Error updating charity status:", error);
      toast({
        title: "Error",
        description: "Failed to update charity status",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: CHARITY_STATUS | undefined) => {
    switch(status) {
      case CHARITY_STATUS.PENDING: 
        return <ShieldAlert className="h-4 w-4 text-yellow-500" />;
      case CHARITY_STATUS.ACCEPTED: 
        return <ShieldCheck className="h-4 w-4 text-green-500" />;
      case CHARITY_STATUS.REJECTED: 
        return <ShieldX className="h-4 w-4 text-red-500" />;
      default: 
        return <ShieldAlert className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusActions = (charity: Charity) => {
    switch(charity.status) {
      case CHARITY_STATUS.PENDING:
        return (
          <>
            <Button 
              variant="outline" 
              size="sm"
              className="text-green-600"
              onClick={() => handleStatusChange(charity.id, CHARITY_STATUS.ACCEPTED)}
            >
              <Check className="h-4 w-4 mr-1" /> Accept
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="text-red-600"
              onClick={() => handleStatusChange(charity.id, CHARITY_STATUS.REJECTED)}
            >
              <X className="h-4 w-4 mr-1" /> Reject
            </Button>
          </>
        );
      case CHARITY_STATUS.ACCEPTED:
        return (
          <Button 
            variant="outline" 
            size="sm"
            className="text-red-600"
            onClick={() => handleStatusChange(charity.id, CHARITY_STATUS.REJECTED)}
          >
            <X className="h-4 w-4 mr-1" /> Reject
          </Button>
        );
      case CHARITY_STATUS.REJECTED:
        return (
          <Button 
            variant="outline" 
            size="sm"
            className="text-green-600"
            onClick={() => handleStatusChange(charity.id, CHARITY_STATUS.ACCEPTED)}
          >
            <Check className="h-4 w-4 mr-1" /> Accept
          </Button>
        );
      default:
        return null;
    }
  };

  const filteredCharities = (status: CHARITY_STATUS) => {
    return charities[status]?.filter(charity =>
      searchTerm === "" || charity.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];
  };

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
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as CHARITY_STATUS)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value={CHARITY_STATUS.PENDING} className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              Pending ({charities[CHARITY_STATUS.PENDING]?.length || 0})
            </TabsTrigger>
            <TabsTrigger value={CHARITY_STATUS.ACCEPTED} className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Accepted ({charities[CHARITY_STATUS.ACCEPTED]?.length || 0})
            </TabsTrigger>
            <TabsTrigger value={CHARITY_STATUS.REJECTED} className="flex items-center gap-2">
              <ShieldX className="h-4 w-4" />
              Rejected ({charities[CHARITY_STATUS.REJECTED]?.length || 0})
            </TabsTrigger>
          </TabsList>

          {Object.values(CHARITY_STATUS).map(status => (
            <TabsContent key={status} value={status}>
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
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCharities(status).length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center">
                            {searchTerm ? "No charities found" : `No ${status} charities available`}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredCharities(status).map((charity) => (
                          <TableRow key={charity.id}>
                            <TableCell>{charity.id}</TableCell>
                            <TableCell className="font-medium">{charity.name}</TableCell>
                            <TableCell>{charity.email}</TableCell>
                            <TableCell>{charity.address}</TableCell>
                            <TableCell>{charity.phone}</TableCell>
                            <TableCell>{charity.canReceiveFunds ? "Yes" : "No"}</TableCell>
                            <TableCell className="flex items-center gap-2">
                              {getStatusIcon(charity.status)}
                              <span className="capitalize">{charity.status || "pending"}</span>
                            </TableCell>
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
                                {getStatusActions(charity)}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </Card>
            </TabsContent>
          ))}
        </Tabs>

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
