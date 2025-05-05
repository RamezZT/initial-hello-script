
import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { getUser } from "@/lib/auth";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useTransactions } from "@/hooks/useTransactions";
import DonationSettings from "@/components/transactions/DonationSettings";
import TransactionStats from "@/components/transactions/TransactionStats";
import TransactionFilters from "@/components/transactions/TransactionFilters";
import TransactionsList from "@/components/transactions/TransactionsList";
import TransactionCharts from "@/components/transactions/TransactionCharts";

export default function CharityTransactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState<string>("all");
  const [user, setUser] = useState(getUser());
  const charityId = user?.charity?.id;
  const [canReceiveFunds, setCanReceiveFunds] = useState(user?.charity?.canReceiveFunds || false);

  const { transactions, loading, getFilteredTransactions } = useTransactions(charityId);
  const filteredTransactions = getFilteredTransactions(searchTerm, filterPaymentMethod);

  // Refresh user data to get updated charity information
  const refreshUserData = () => {
    const updatedUser = getUser();
    setUser(updatedUser);
    if (updatedUser?.charity) {
      setCanReceiveFunds(updatedUser.charity.canReceiveFunds || false);
    }
  };

  return (
    <DashboardLayout role="CHARITY">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Your Transactions</h1>
        
        <div className="flex flex-col md:flex-row gap-4 items-stretch">
          <DonationSettings 
            charityId={charityId}
            canReceiveFunds={canReceiveFunds}
            refreshUserData={refreshUserData}
          />
        </div>
        
        <TransactionStats transactions={transactions} />

        <Tabs defaultValue="list" className="w-full">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <TransactionFilters 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterPaymentMethod={filterPaymentMethod}
              setFilterPaymentMethod={setFilterPaymentMethod}
            />

            <TransactionsList 
              loading={loading}
              filteredTransactions={filteredTransactions}
              searchTerm={searchTerm}
              filterPaymentMethod={filterPaymentMethod}
            />
          </TabsContent>

          <TabsContent value="charts">
            <TransactionCharts transactions={transactions} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
