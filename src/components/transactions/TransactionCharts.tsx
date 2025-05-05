
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/types";
import { format } from "date-fns";
import { PAYMENT_METHODS } from "@/lib/api";
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
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";

interface TransactionChartsProps {
  transactions: Transaction[];
}

export default function TransactionCharts({ transactions }: TransactionChartsProps) {
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

  const paymentMethodData = PAYMENT_METHODS.map((method) => {
    const totalAmount = transactions
      .filter((t) => t.paymentMethod === method)
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    return {
      name: method,
      amount: totalAmount,
    };
  });

  return (
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
  );
}
