
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getAllTransactions, getAllCharities } from "@/lib/api";
import { Charity, Transaction, PaymentMethod } from "@/types";
import { format } from "date-fns";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface ChartData {
  name: string;
  amount: number;
}

export default function TransactionsList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [charities, setCharities] = useState<Charity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCharity, setFilterCharity] = useState("all");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState<string>("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [transactionsData, charitiesData] = await Promise.all([
        getAllTransactions(),
        getAllCharities(),
      ]);
      setTransactions(transactionsData);
      setCharities(charitiesData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load transactions data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter transactions based on search and filter criteria
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.charity.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.donor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.amount.toString().includes(searchTerm);

    const matchesCharity =
      filterCharity === "all" ||
      transaction.charity.id.toString() === filterCharity;

    const matchesPaymentMethod =
      filterPaymentMethod === "all" ||
      transaction.paymentMethod === filterPaymentMethod;

    return matchesSearch && matchesCharity && matchesPaymentMethod;
  });

  // Prepare data for charts
  const charityChartData: ChartData[] = charities
    .map((charity) => {
      const totalAmount = transactions
        .filter((t) => t.charity.id === charity.id)
        .reduce((sum, t) => sum + Number(t.amount), 0);

      return {
        name: charity.name,
        amount: totalAmount,
      };
    })
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5); // Top 5 charities by donation amount

  const paymentMethodChartData = Object.values(PaymentMethod).map((method) => {
    const totalAmount = transactions
      .filter((t) => t.paymentMethod === method)
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    return {
      name: method,
      amount: totalAmount,
    };
  });

  return (
    <DashboardLayout role="ADMIN">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Transactions</h1>

        <Tabs defaultValue="list" className="w-full">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="w-full sm:w-[300px]">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search transactions"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Select
                  value={filterCharity}
                  onValueChange={setFilterCharity}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by charity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Charities</SelectItem>
                    {charities.map((charity) => (
                      <SelectItem key={charity.id} value={charity.id.toString()}>
                        {charity.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filterPaymentMethod}
                  onValueChange={setFilterPaymentMethod}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Payment Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="VISA">VISA</SelectItem>
                    <SelectItem value="MASTERCARD">MASTERCARD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card>
              {loading ? (
                <div className="p-8 text-center">Loading transactions...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Donor</TableHead>
                      <TableHead>Charity</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          {searchTerm || filterCharity !== "all" || filterPaymentMethod !== "all"
                            ? "No transactions found matching your filters"
                            : "No transactions available"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.id}</TableCell>
                          <TableCell>{transaction.donor?.name || "N/A"}</TableCell>
                          <TableCell>{transaction.charity.name}</TableCell>
                          <TableCell>${Number(transaction.amount).toFixed(2)}</TableCell>
                          <TableCell>{transaction.paymentMethod}</TableCell>
                          <TableCell>
                            {format(new Date(transaction.createdAt), "MMM d, yyyy")}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="charts">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Charities by Donations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      charity: { theme: { light: "#2563eb", dark: "#3b82f6" } },
                    }}
                    className="aspect-[4/3]"
                  >
                    <BarChart data={charityChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        tickFormatter={(value) => value.substring(0, 10) + (value.length > 10 ? '...' : '')}
                      />
                      <YAxis />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border bg-background p-2 shadow-sm">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                      Charity
                                    </span>
                                    <span className="font-bold text-xs">
                                      {payload[0].payload.name}
                                    </span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                      Amount
                                    </span>
                                    <span className="font-bold text-xs">
                                      ${payload[0].value}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend />
                      <Bar dataKey="amount" name="Total Donations" fill="var(--color-charity)" />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Donations by Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      method: { theme: { light: "#7c3aed", dark: "#8b5cf6" } },
                    }}
                    className="aspect-[4/3]"
                  >
                    <BarChart data={paymentMethodChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border bg-background p-2 shadow-sm">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                      Method
                                    </span>
                                    <span className="font-bold text-xs">
                                      {payload[0].payload.name}
                                    </span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                      Amount
                                    </span>
                                    <span className="font-bold text-xs">
                                      ${payload[0].value}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend />
                      <Bar dataKey="amount" name="Total Amount" fill="var(--color-method)" />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
