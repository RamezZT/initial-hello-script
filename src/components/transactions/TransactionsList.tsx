
import { Transaction } from "@/types";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TransactionsListProps {
  loading: boolean;
  filteredTransactions: Transaction[];
  searchTerm: string;
  filterPaymentMethod: string;
}

export default function TransactionsList({
  loading,
  filteredTransactions,
  searchTerm,
  filterPaymentMethod,
}: TransactionsListProps) {
  return (
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
  );
}
