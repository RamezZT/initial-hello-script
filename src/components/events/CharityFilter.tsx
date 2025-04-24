
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { getAllCharities } from "@/lib/api";
import { Charity } from "@/types";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CharityFilterProps {
  onFilterChange: (charityId: string) => void;
}

export function CharityFilter({ onFilterChange }: CharityFilterProps) {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    fetchCharities();
  }, []);

  const fetchCharities = async () => {
    try {
      const data = await getAllCharities();
      setCharities(data);
    } catch (error) {
      console.error("Error fetching charities:", error);
      toast({
        title: "Error",
        description: "Failed to load charities",
        variant: "destructive",
      });
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const matchingCharity = charities.find(charity => 
      charity.name.toLowerCase().includes(value.toLowerCase())
    );
    
    setNoResults(value !== "" && !matchingCharity);
    onFilterChange(matchingCharity ? matchingCharity.id.toString() : "");
  };

  return (
    <div className="w-[200px]">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search charity"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-8"
        />
      </div>
      {noResults && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>
            No charities found
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
