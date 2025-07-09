import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';  // Updated import
import ActionButton from '@/components/dashboard/ActionButton';
import { Plus, Search, CircleChevronRight, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AddPurchaseForm from '@/components/purchase/AddPurchaseForm';
import AddProductModal from '@/components/products/AddProductModal';
import PaymentOutModal from '@/components/payment/PaymentOutModal';
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

const PaymentOut: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddPurchaseFormOpen, setIsAddPurchaseFormOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isPaymentOutModalOpen, setIsPaymentOutModalOpen] = useState(false);
const [selectedPayment, setSelectedPayment] = useState<any | null>(null);

  // Dummy data for demonstration

  // Payment out data state
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch payment outs
  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const franchiseId = localStorage.getItem('franchiseId');
      if (!franchiseId) throw new Error('Franchise ID not found');
      const res = await import('@/api/paymentOutApi').then(m => m.getPaymentOuts(franchiseId));
      if (res.success && Array.isArray(res.data)) {
        setPayments(res.data);
      } else {
        setPayments([]);
        setError(res.message || 'Failed to load payment outs');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load payment outs');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line
  }, []);


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  // Filter payments by franchiseId for display
  const franchiseId = localStorage.getItem('franchiseId');
  const filteredPayments = payments.filter(p => p.franchiseId === franchiseId);

  return (
    <MainLayout>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-2xl font-bold">Payment Out History</h1>

        <div className="flex gap-2 mt-4 md:mt-0">
  <Button
    className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
    onClick={() => {
      setSelectedPayment(null);
      setIsPaymentOutModalOpen(true);
    }}
  >
    <span>Payment Out</span>
  </Button>
  <ActionButton
    icon={<ShoppingBag size={18} />}
    label="Add Purchase"
    onClick={() => setIsAddPurchaseFormOpen(true)}
    className="bg-blue-600 hover:bg-purple-700 text-white"
  />
  <ActionButton
    icon={<Plus size={18} />}
    label="Add a new Product"
    onClick={() => setIsAddProductModalOpen(true)}
    variant="accent"
    className="bg-yellow-400 hover:bg-yellow-500 text-black"
  />
</div>

      {/* Modals */}
      <AddPurchaseForm
        isOpen={isAddPurchaseFormOpen}
        onClose={() => setIsAddPurchaseFormOpen(false)}
        onSubmit={() => setIsAddPurchaseFormOpen(false)}
      />
      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onSubmit={() => setIsAddProductModalOpen(false)}
      />
      <PaymentOutModal
        isOpen={isPaymentOutModalOpen}
        initialData={selectedPayment}
        onClose={() => {
          setIsPaymentOutModalOpen(false);
          setSelectedPayment(null);
        }}
        onSubmit={() => {
          setIsPaymentOutModalOpen(false);
          setSelectedPayment(null);
          fetchPayments(); // Refresh table after add/edit
        }}
      />
      
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
                <TableHead>Supplier Name</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Amount Paid</TableHead>

                <TableHead className="text-right">View details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-red-500">{error}</TableCell>
                </TableRow>
              ) : filteredPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">No payment out records found.</TableCell>
                </TableRow>
              ) : (
                filteredPayments.map((payment: any) => (
                  <TableRow key={payment._id || payment.invoiceNumber}>
                    <TableCell>{payment.invoiceNumber}</TableCell>
                    <TableCell>{payment.supplierName}</TableCell>
                    <TableCell>{payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : ''}</TableCell>
                    <TableCell>₹{payment.amountPaid?.toLocaleString?.() ?? payment.amountPaid}</TableCell>
                    <TableCell className="text-right">
                      <button
                        className="text-gray-500 hover:text-blue-600 transition-colors rounded-full p-1 hover:bg-gray-100"
                        onClick={() => {
                          setSelectedPayment(payment);
                          setIsPaymentOutModalOpen(true);
                        }}
                        title="Edit/View Details"
                      >
                        <CircleChevronRight size={18} />
                      </button>
                    </TableCell>
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

export default PaymentOut;
