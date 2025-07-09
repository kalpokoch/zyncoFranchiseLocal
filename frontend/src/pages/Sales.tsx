import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ActionButton from '@/components/dashboard/ActionButton';
import { Plus, Search, ExternalLink, CircleChevronRight, Pencil} from 'lucide-react';
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
import AddProductModal, { ProductData } from '@/components/products/AddProductModal';
import { useToast } from '@/components/ui/use-toast';
import { addProduct } from '../api/productApi';

import { useEffect } from 'react';
import { getSales } from '@/api/salesApi';
import { getCustomerById, Customer } from '@/api/customer.api';

interface SaleRow {
  _id: string;
  franchiseId?: string;
  invoiceNumber?: string;
  customer?: string | { customerName: string } | null;
  billingDate?: string;
  billingAddress?: string;
  totalQuantity?: number;
  totalAmount?: number;
  paymentStatus?: string;
  createdAt?: string;
}

// Type guard for customer (populated)
function isCustomerObj(customer: unknown): customer is { customerName: string } {
  return typeof customer === 'object' && customer !== null && 'customerName' in customer;
}

// Helper to format time from date string
function formatTime(date: string | Date) {
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
}

import { Trash2 } from 'lucide-react';

const Sales: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sales, setSales] = useState<SaleRow[]>([]);
  const [filteredSales, setFilteredSales] = useState<SaleRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  // Delete sale handler
  const handleDeleteSale = async (saleId: string) => {
    if (!window.confirm('Are you sure you want to delete this sale?')) return;
    try {
      // Call backend API
      await import('@/api/salesApi').then(mod => mod.deleteSale(saleId));
      setSales(prev => prev.filter(sale => sale._id !== saleId));
      setFilteredSales(prev => prev.filter(sale => sale._id !== saleId));
      toast({
        title: 'Sale Deleted',
        description: 'The sale has been deleted.',
        variant: 'default',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to delete sale. Please try again.',
        variant: 'destructive',
      });
    }
  };


  // Fetch sales data on mount
  useEffect(() => {
    const fetchSales = async () => {
      setIsLoading(true);
      setError('');
      try {
        const franchiseId = localStorage.getItem('franchiseId');
        if (!franchiseId) {
          setError('Franchise ID missing. Please select a franchise.');
          setIsLoading(false);
          return;
        }
        const response = await getSales(franchiseId);
        // Assume response.data is an array of sales
        let salesList = Array.isArray(response.data?.data) ? response.data.data : [];
        // Filter sales by franchiseId in case backend returns more
        salesList = salesList.filter((sale: SaleRow) => sale.franchiseId === franchiseId);
        setSales(salesList);
        setFilteredSales(salesList);
      } catch (err: any) {
        setError('Failed to fetch sales data.');
        setSales([]);
        setFilteredSales([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSales();
  }, []);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredSales(sales);
    } else {
      const filtered = sales.filter(sale => {
        const customerName =
  typeof sale.customer === 'object' && sale.customer && 'customerName' in sale.customer
    ? sale.customer.customerName
    : typeof sale.customer === 'string'
      ? sale.customer
      : '';
        return (
          sale.invoiceNumber?.toLowerCase().includes(query.toLowerCase()) ||
          customerName.toLowerCase().includes(query.toLowerCase()) ||
          sale.paymentStatus?.toLowerCase().includes(query.toLowerCase())
        );
      });
      setFilteredSales(filtered);
    }
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  // Handle adding a new product
  const handleAddProduct = async (productData: ProductData) => {
    let franchiseId = localStorage.getItem('franchiseId') || undefined;
    const { purchase_price, selling_price, ...rest } = productData;
    const productDataWithFranchise = {
      ...rest,
      purchasePrice: purchase_price,
      sellingPrice: selling_price,
      franchiseId,
    };
    try {
      const response = await addProduct(productDataWithFranchise);
      if (response.data) {
        window.location.reload();
        toast({
          title: "Product Added",
          description: `${productData.productName} has been added successfully.`,
          variant: "default",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    }
    setIsAddProductModalOpen(false);
  };


  // Calculate pagination
  const safeFilteredSales = Array.isArray(filteredSales) ? filteredSales : [];
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = safeFilteredSales.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(safeFilteredSales.length / itemsPerPage);

  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= Math.min(totalPages, 5); i++) {
    pageNumbers.push(i);
  }

  return (
    <MainLayout>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-2xl font-bold">Sales Management</h1>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button
  className="bg-purple-600 hover:bg-purple-700 text-white rounded-md px-6 py-2 font-semibold shadow-sm flex items-center gap-2"
  onClick={() => {
    const pathParts = window.location.pathname.split('/');
    const franchiseIdFromUrl = pathParts[1];
    navigate(`/${franchiseIdFromUrl}/payment-in`);
  }}
>
  Payment In
</Button>
<Button
  className="bg-green-600 hover:bg-green-700 text-white rounded-md px-6 py-2 font-semibold shadow-sm flex items-center gap-2"
  onClick={() => {
    const pathParts = window.location.pathname.split('/');
    const franchiseIdFromUrl = pathParts[1];
    navigate(`/${franchiseIdFromUrl}/sales/add`);
  }}
>
  Add Sales
</Button>
<Button
  className="bg-yellow-400 hover:bg-yellow-500 text-black rounded-md px-6 py-2 font-semibold shadow-sm flex items-center gap-2"
  onClick={() => setIsAddProductModalOpen(true)}
>
  Add a new Product
</Button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="sales-search"
            name="sales-search"
            type="text"
            placeholder="Search Sales"
            className="w-full pl-10 h-11"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-4 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Billing Address</TableHead>
                <TableHead>Total Quantity</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>View Details</TableHead>
                <TableHead>Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((sale) => (
                <TableRow key={sale._id}>
                  <TableCell>{sale.invoiceNumber}</TableCell>
                  <TableCell>{isCustomerObj(sale.customer) ? sale.customer.customerName : (sale.customer ?? '')}</TableCell>
                  <TableCell>{sale.createdAt ? formatTime(sale.createdAt) : ''}</TableCell>
                  <TableCell>{sale.billingDate ? new Date(sale.billingDate).toLocaleDateString() : ''}</TableCell>
                  <TableCell>{sale.billingAddress ?? ''}</TableCell>
                  <TableCell>{sale.totalQuantity ?? ''}</TableCell>
                  <TableCell>₹{sale.totalAmount?.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      sale.paymentStatus === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {sale.paymentStatus}
                    </span>
                  </TableCell>
                  <TableCell>
                    <button
                      className="text-gray-500 hover:text-blue-600 transition-colors rounded-full p-1 hover:bg-gray-100"
                      onClick={() => {
  const franchiseId = localStorage.getItem('franchiseId');
  if (franchiseId) {
    navigate(`/${franchiseId}/sales/add`, { state: { sale } });
  } else {
    alert('Franchise ID not found. Please select a franchise.');
  }
}}
                    >
                      <Pencil size={18} />
                    </button>
                  </TableCell>
                  <TableCell>
                    <button
                      className="text-red-500 hover:text-red-700 transition-colors rounded-full p-1 hover:bg-red-100"
                      onClick={() => handleDeleteSale(sale._id)}
                      title="Delete Sale"
                    >
                      <ExternalLink size={0} style={{display:'none'}} /> {/* To preserve import if unused */}
                      <Trash2 size={18} />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex items-center justify-between mt-4 px-2">
          <div className="text-sm text-gray-500 flex items-center">
            Showing
            <div className="relative mx-2">
              <Select
                value={String(itemsPerPage)}
                onValueChange={handleItemsPerPageChange}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue placeholder={String(itemsPerPage)} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            of {filteredSales.length}
          </div>
          
          <div className="flex items-center space-x-1">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-md"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            >
              <span className="sr-only">Go to previous page</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </Button>
            {pageNumbers.map((pageNumber) => (
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
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-md"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            >
              <span className="sr-only">Go to next page</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
      {isAddProductModalOpen && (
        <AddProductModal 
          isOpen={isAddProductModalOpen} 
          onClose={() => setIsAddProductModalOpen(false)} 
          onSubmit={handleAddProduct} 
        />
      )}
    </MainLayout>
  );
};

export default Sales;
