import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ActionButton from '@/components/dashboard/ActionButton';
import { Plus, Search, CircleChevronRight, ShoppingBag } from 'lucide-react';
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
import AddPurchaseForm from '@/components/purchase/AddPurchaseForm';
import { useToast } from '@/components/ui/use-toast';
import { purchaseApi, Purchase as PurchaseType } from '@/api/purchase.api';

const Purchase: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [purchases, setPurchases] = useState<PurchaseType[]>([]);
  const [filteredPurchases, setFilteredPurchases] = useState<PurchaseType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isAddPurchaseFormOpen, setIsAddPurchaseFormOpen] = useState(false);
  const [editPurchase, setEditPurchase] = useState<PurchaseType | null>(null);

  useEffect(() => {
    fetchPurchases();
  }, []);

  // Get franchiseId from localStorage
  const franchiseId = localStorage.getItem('franchiseId') || '';

  const fetchPurchases = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching purchases...');
      const franchiseId = localStorage.getItem('franchiseId') || '';
      const purchases = await purchaseApi.getAllPurchases(); // fetch all
      console.log('Received purchases:', purchases);
      let purchasesList = Array.isArray(purchases) ? purchases : [];
      purchasesList = purchasesList.filter(
        (purchase: any) =>
          purchase.supplier &&
          typeof purchase.supplier === 'object' &&
          purchase.supplier.franchiseId === franchiseId
      );
      setPurchases(purchasesList);
      setFilteredPurchases(purchasesList);
    } catch (error: any) {
      console.error('Fetch error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      toast({
        title: "Connection Error",
        description: `Could not connect to server: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredPurchases(purchases);
    } else {
      const filtered = purchases.filter(purchase =>
        purchase.invoiceNumber.toLowerCase().includes(query) ||
        purchase.supplierName.toLowerCase().includes(query) ||
        purchase.paymentStatus.toLowerCase().includes(query)
      );
      setFilteredPurchases(filtered);
    }
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const handleAddProduct = (productData: ProductData) => {
    console.log('Adding product:', productData);

    toast({
      title: "Product Added",
      description: `${productData.productName} has been added successfully.`,
      variant: "default",
    });

    setIsAddProductModalOpen(false);
  };

  const handleAddPurchase = async (purchaseData: Omit<PurchaseType, '_id'>) => {
    try {
      await purchaseApi.createPurchase(purchaseData);
      toast({
        title: "Purchase Added",
        description: `Purchase invoice ${purchaseData.invoiceNumber} has been added successfully.`,
      });
      fetchPurchases();
      setIsAddPurchaseFormOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add purchase",
        variant: "destructive",
      });
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPurchases.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);

  const pageNumbers = [];
  for (let i = 1; i <= Math.min(totalPages, 5); i++) {
    pageNumbers.push(i);
  }

  return (
    <MainLayout>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-2xl font-bold">Purchase History</h1>

        <div className="flex gap-2 mt-4 md:mt-0">
          {/* <Button
            className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
            onClick={() => navigate('/payment-out')}
          >
            <span>Payment Out</span>
          </Button> */}
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
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="relative mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <Input
              type="text"
              placeholder="Search Products"
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
                <TableHead>Purchase Date</TableHead>
                <TableHead>Total Amount</TableHead>
                
                <TableHead>Payment Status</TableHead>
                <TableHead className="text-right">View details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">Loading...</TableCell>
                </TableRow>
              ) : filteredPurchases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">No purchases found</TableCell>
                </TableRow>
              ) : (
                currentItems.map((purchase) => (
                  <TableRow key={purchase._id}>
                    <TableCell>{purchase.invoiceNumber}</TableCell>
                    <TableCell>{purchase.supplier && typeof purchase.supplier === 'object' ? purchase.supplier.name : purchase.supplierName || ''}</TableCell>
                    <TableCell>{new Date(purchase.billingDate).toLocaleDateString()}</TableCell>
                    <TableCell>₹{purchase.totalAmount.toLocaleString()}</TableCell>
                    
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        purchase.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                        purchase.paymentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {purchase.paymentStatus}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        className="text-gray-500 hover:text-blue-600 transition-colors rounded-full p-1 hover:bg-gray-100"
                        onClick={() => {
                          setEditPurchase(purchase);
                          setIsAddPurchaseFormOpen(true);
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
              of {filteredPurchases.length}
            </span>
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
      {isAddPurchaseFormOpen && (
        <AddPurchaseForm
          isOpen={isAddPurchaseFormOpen}
          onClose={() => {
            setIsAddPurchaseFormOpen(false);
            setEditPurchase(null);
          }}
          onSubmit={async (data) => {
            if (editPurchase && editPurchase._id) {
              // Update
              await purchaseApi.updatePurchase(editPurchase._id, data);
              toast({
                title: "Purchase Updated",
                description: `Purchase ${data.invoiceNumber} updated successfully.`,
                variant: "default",
              });
            } else {
              // Add new
              await handleAddPurchase(data);
            }
            setIsAddPurchaseFormOpen(false);
            setEditPurchase(null);
            fetchPurchases();
          }}
          initialData={editPurchase}
        />
      )}
    </MainLayout>
  );
};

export default Purchase;
