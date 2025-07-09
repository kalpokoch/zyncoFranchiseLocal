import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ActionButton from '@/components/dashboard/ActionButton';
import { Plus, Search, CircleChevronRight, ShoppingBag, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
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
import { getCustomers, type Customer } from '@/api/customer.api';
import AddCustomerModal from '@/components/customers/AddCustomerModal';

const Customer: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [franchiseId, setFranchiseId] = useState<string>('');
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Load franchiseId from localStorage and fetch customers
  useEffect(() => {
    const loadFranchiseId = () => {
      const storedFranchiseId = localStorage.getItem('franchiseId');
      if (storedFranchiseId) {
        setFranchiseId(storedFranchiseId);
        fetchCustomers(storedFranchiseId, currentPage, itemsPerPage, searchQuery);
      } else {
        toast.error('Franchise ID not found. Please log in again.');
      }
    };

    // Initial load
    loadFranchiseId();

    // Poll for franchiseId changes (since storage event only works across tabs)
    const franchiseIdCheck = setInterval(() => {
      const currentFranchiseId = localStorage.getItem('franchiseId');
      if (currentFranchiseId !== franchiseId) {
        loadFranchiseId();
      }
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(franchiseIdCheck);
  }, [franchiseId, currentPage, itemsPerPage, searchQuery]);



  const fetchCustomers = async (franchiseId: string, page: number, limit: number, search: string) => {
    if (!franchiseId) {
      console.warn('No franchiseId available, skipping customer fetch');
      return;
    }

    try {
      setIsLoading(true);
      const response = await getCustomers(franchiseId, page, limit, search);
      setCustomers(response.data);
      setFilteredCustomers(response.data);
      setTotalCustomers(response.total);
      setTotalPages(response.pages);
    } catch (error) {
      console.error('Error fetching customers:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load customers';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = Number(value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleAddNewCustomer = () => {
    if (!franchiseId) {
      toast.error('Please select a franchise first');
      return;
    }
    setIsAddModalOpen(true);
  };

  const handleCustomerAdded = () => {
    // Refresh the list after adding a customer
    fetchCustomers(franchiseId, 1, itemsPerPage, '');
    setCurrentPage(1);
    setSearchQuery('');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <MainLayout>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-2xl font-bold">Customer Information</h1>
        <div className="flex gap-2 mt-4 md:mt-0">
          <ActionButton
            icon={<Plus size={18} />}
            label="Add Sales"
            onClick={() => navigate('/add-sales')}
            className="bg-[#71DB1D] hover:bg-[#71DB7F]/90"
          />
          <ActionButton
            icon={<ShoppingBag size={18} />}
            label="Add Purchase"
            onClick={() => navigate('/add-purchase')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          />
          <ActionButton
            icon={<Plus size={18} />}
            label="Add New Customer"
            onClick={handleAddNewCustomer}
            className="bg-[#ADBAFF] hover:bg-[#ADBAFF]/90"
            disabled={!franchiseId}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="relative mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <Input
              type="text"
              placeholder="Search customers"
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
                <TableHead>Customer Name</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Last Purchase</TableHead>
                <TableHead>Amount Receivable</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex justify-center items-center space-x-2">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                      <span>Loading customers...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer._id}>
                    <TableCell className="font-medium">{customer.customerName}</TableCell>
                    <TableCell>{customer.phoneNumber}</TableCell>
                    <TableCell>{customer.email || '-'}</TableCell>
                    <TableCell>{customer.address || '-'}</TableCell>
                    <TableCell>
                      {customer.lastPurchase 
                        ? new Date(customer.lastPurchase).toLocaleDateString() 
                        : 'No purchases'}
                    </TableCell>
                    <TableCell>{formatCurrency(customer.amountReceivable || 0)}</TableCell>
                    <TableCell className="text-right">
                      <button
                        className="text-gray-500 hover:text-blue-600 transition-colors rounded-full p-1 hover:bg-gray-100"
                        onClick={() => navigate(`/customer/${customer._id}`)}
                      >
                        <CircleChevronRight size={18} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No customers found. Add a new customer to get started.
                  </TableCell>
                </TableRow>
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
              of {totalCustomers}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((pageNumber) => (
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
          <AddCustomerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCustomerAdded={handleCustomerAdded}
        franchiseId={franchiseId}
      />
    </MainLayout>
  );
};

export default Customer;
