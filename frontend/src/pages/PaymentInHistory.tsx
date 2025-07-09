import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';  // Updated import
import ActionButton from '@/components/dashboard/ActionButton';
import { Plus, Search, CircleChevronRight, ShoppingBag, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const PaymentInHistory: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [franchiseId, setFranchiseId] = useState(() => localStorage.getItem('franchiseId'));

  React.useEffect(() => {
    const handleStorage = () => {
      setFranchiseId(localStorage.getItem('franchiseId'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  React.useEffect(() => {
    if (!franchiseId) return;
    setLoading(true);
    setError(null);
    fetch(`http://localhost:8888/Zync-Franc/api/v1/payment-in?franchiseId=${franchiseId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Filter payments by franchiseId on frontend as a safeguard
          const filtered = (data.data || []).filter(
            (payment: any) => payment.franchiseId === franchiseId
          );
          setPayments(filtered);
        } else {
          setError(data.message || 'Failed to fetch payments');
        }
      })
      .catch(err => setError(err.message || 'Failed to fetch payments'))
      .finally(() => setLoading(false));
  }, [franchiseId]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  return (
    <MainLayout>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-2xl font-bold">Payment In History</h1>

        <div className="flex gap-2 mt-4 md:mt-0">
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-md px-6 py-2 font-semibold shadow-sm flex items-center gap-2"
            onClick={() => navigate(`/${franchiseId}/payment-in`)}
          >
            Add Payment In
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white rounded-md px-6 py-2 font-semibold shadow-sm flex items-center gap-2"
            onClick={() => navigate(`/${franchiseId}/sales/add`)}
          >
            Add Sales
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="relative mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <Input
              type="text"
              placeholder="Search payments"
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Payment In Date</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead className="text-right">View details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-red-500">{error}</TableCell>
                </TableRow>
              ) : payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No payments found.</TableCell>
                </TableRow>
              ) : (
                payments.map((payment) => (
                  <TableRow key={payment._id}>
                    <TableCell>{payment.invoiceNumber}</TableCell>
                    <TableCell>{payment.customerName}</TableCell>
                    <TableCell>{payment.billingDate ? new Date(payment.billingDate).toLocaleDateString() : ''}</TableCell>
                    <TableCell>₹{payment.amountReceived?.toLocaleString()}</TableCell>
                    <TableCell className="text-right relative"><div className="flex gap-2 justify-end">
                      <button
                        className="text-gray-500 hover:text-blue-600 transition-colors rounded-full p-1 hover:bg-gray-100"
                        onClick={() => navigate(`/${franchiseId}/payment-in`, { state: { payment } })}
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>
                    </div></TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-6">
          <div className="flex items-center mb-4 sm:mb-0">
            <span className="text-sm text-gray-500 mr-2">Showing</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={handleItemsPerPageChange}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={itemsPerPage.toString()} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-500 ml-2">
              of {payments.length}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((pageNumber) => (
              <Button
                key={pageNumber}
                variant={currentPage === pageNumber ? "default" : "outline"}
                size="sm"
                className="h-8 w-8 p-0 rounded-md"
                onClick={() => setCurrentPage(pageNumber)}
              >
                {pageNumber}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PaymentInHistory;
