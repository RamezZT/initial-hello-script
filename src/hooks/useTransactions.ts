
import { useState, useEffect } from "react";
import { Transaction } from "@/types";
import { getAllTransactions } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

export function useTransactions(charityId: number | undefined) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (charityId) {
      fetchTransactions();
    }
  }, [charityId]);

  const fetchTransactions = async () => {
    if (!charityId) return;
    
    try {
      setLoading(true);
      // Using getAllTransactions instead of getCharityTransactions which is causing a 404
      const data = await getAllTransactions();
      // Filter transactions for the current charity on the client side
      const filteredTransactions = data.filter(transaction => 
        transaction.charity && transaction.charity.id === charityId
      );
      setTransactions(filteredTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast({
        title: "Error",
        description: "Failed to load transactions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter transactions based on search and payment method
  const getFilteredTransactions = (searchTerm: string, filterPaymentMethod: string) => {
    return transactions.filter((transaction) => {
      const matchesSearch =
        transaction.donor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.amount.toString().includes(searchTerm);

      const matchesPaymentMethod =
        filterPaymentMethod === "all" ||
        transaction.paymentMethod === filterPaymentMethod;

      return matchesSearch && matchesPaymentMethod;
    });
  };

  return {
    transactions,
    loading,
    fetchTransactions,
    getFilteredTransactions
  };
}
