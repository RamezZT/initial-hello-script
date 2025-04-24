
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllCharities } from "@/lib/api";
import { Charity } from "@/types";

interface CharityFilterProps {
  onFilterChange: (charityId: string) => void;
}

export function CharityFilter({ onFilterChange }: CharityFilterProps) {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [selectedCharityId, setSelectedCharityId] = useState<string>("");

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

  const handleFilterChange = (value: string) => {
    setSelectedCharityId(value);
    onFilterChange(value);
  };

  return (
    <div className="w-[200px]">
      <Select value={selectedCharityId} onValueChange={handleFilterChange}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by charity" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Charities</SelectItem>
          {charities.map((charity) => (
            <SelectItem key={charity.id} value={charity.id.toString()}>
              {charity.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
