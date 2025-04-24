
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
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
import { getCharityTransactions } from "@/lib/api";
import { Transaction, PaymentMethod } from "@/types";
import { format } from "date-fns";
import { getUser } from "@/lib/auth";
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
  LineChart,
  Line,
} from "recharts";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function CharityTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState<string>("all");
  const user = getUser();
  const charityId = user?.charity?.id;

  useEffect(() => {
    if (charityId) {
      fetchTransactions();
    }
  }, [charityId]);

  const fetchTransactions = async () => {
    if (!charityId) return;
    
    try {
      setLoading(true);
      const data = await getCharityTransactions(charityId);
      setTransactions(data);
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
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.donor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.amount.toString().includes(searchTerm);

    const matchesPaymentMethod =
      filterPaymentMethod === "all" ||
      transaction.paymentMethod === filterPaymentMethod;

    return matchesSearch && matchesPaymentMethod;
  });

  // Prepare chart data
  const monthlyData = () => {
    const months: Record<string, number> = {};
    const now = new Date();
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthYear = format(date, "MMM yyyy");
      months[monthYear] = 0;
    }

    // Sum up transactions by month
    transactions.forEach(transaction => {
      const monthYear = format(new Date(transaction.createdAt), "MMM yyyy");
      if (months[monthYear] !== undefined) {
        months[monthYear] += Number(transaction.amount);
      }
    });

    return Object.entries(months).map(([month, amount]) => ({
      name: month,
      amount: amount
    }));
  };

  const paymentMethodData = Object.values(PaymentMethod).map((method) => {
    const totalAmount = transactions
      .filter((t) => t.paymentMethod === method)
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    return {
      name: method,
      amount: totalAmount,
    };
  });

  const totalAmount = transactions.reduce((sum, t) => sum + Number(t.amount), 0);

  return (
    <DashboardLayout role="CHARITY">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Your Transactions</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Received</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transaction Count</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transactions.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${transactions.length ? (totalAmount / transactions.length).toFixed(2) : "0.00"}
              </div>
            </CardContent>
          </Card>
        </div>

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

              <div className="w-full sm:w-[180px]">
                <Select
                  value={filterPaymentMethod}
                  onValueChange={setFilterPaymentMethod}
                >
                  <SelectTrigger>
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
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">
                          {searchTerm || filterPaymentMethod !== "all"
                            ? "No transactions found matching your filters"
                            : "No transactions available"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.id}</TableCell>
                          <TableCell>{transaction.donor?.name || "Anonymous"}</TableCell>
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
                  <CardTitle>Monthly Donations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      monthly: { theme: { light: "#2563eb", dark: "#3b82f6" } },
                    }}
                    className="aspect-[4/3]"
                  >
                    <LineChart data={monthlyData()}>
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
                                      Month
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
                      <Line
                        type="monotone"
                        dataKey="amount"
                        name="Monthly Donations"
                        stroke="var(--color-monthly)"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
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
                    <BarChart data={paymentMethodData}>
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
