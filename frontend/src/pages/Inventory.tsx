import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import ActionButton from '@/components/dashboard/ActionButton';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import AddProductModal, { ProductData } from '@/components/products/AddProductModal';
import { useToast } from '@/components/ui/use-toast';
import { getProducts, addProduct } from '../api/productApi';
import { useQuery } from '@tanstack/react-query';

const Inventory: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);  // Add this line

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await getProducts();
      return response.data.map((item: any) => ({
        ...item, // preserve all original fields for filtering
        productId: item.productId,
        productName: item.productName,
        category: item.category,
        base_unit: item.base_unit,
        // Keep the original franchise field for filtering
        conversion_factor: item.conversion_factor, // keep as object for filtering
        conversion_factor_display: Object.entries(item.conversion_factor || {})
          .map(([unit, factor]) => `${unit}: ${factor}`)
          .join(', '),
        stock_quantity: item.stock_quantity,
        total_stock: Object.entries(item.conversion_factor || {})
          .map(([unit, factor]) => `${item.stock_quantity * Number(factor)} ${unit}`)
          .join(' / '),
        gst: `${item.gst}%`,
        price: item.sellingPrice ? `₹${item.sellingPrice}` : (item.price ? `₹${item.price}` : ''),
      }));
    },
  });

  // Get selected franchiseId from localStorage
  // React state for franchiseId to trigger re-render on change
  const [franchiseId, setFranchiseId] = useState(() => localStorage.getItem('franchiseId'));

  // Listen for changes to franchiseId in localStorage
  React.useEffect(() => {
    const handleStorage = () => {
      setFranchiseId(localStorage.getItem('franchiseId'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const filteredProducts = useMemo(() => {
    console.log('DEBUG franchiseId from localStorage:', franchiseId);
    console.log('DEBUG products:', products);
    if (!products) return [];
    // Only show products for the selected franchise
    const franchiseProducts = franchiseId
      ? products.filter(product => {
          // Debug log for each product's franchise field
          console.log('DEBUG product.franchise:', product.franchise);
          // If franchise is an object, match by its franchiseId property
          if (product.franchise && typeof product.franchise === 'object' && product.franchise.franchiseId) {
            return String(product.franchise.franchiseId) === String(franchiseId);
          }
          // If franchiseId is present directly on the product
          if (product.franchiseId) {
            return String(product.franchiseId) === String(franchiseId);
          }
          // If franchise is a string (legacy or fallback)
          if (typeof product.franchise === 'string') {
            return String(product.franchise) === String(franchiseId);
          }
          return false;
        })
      : products;
    console.log('DEBUG filtered franchiseProducts:', franchiseProducts);
    if (!searchQuery.trim()) {
      setIsSearching(false);
      return franchiseProducts;
    }
    setIsSearching(true);
    return franchiseProducts.filter(product =>
      product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery, franchiseId]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handleAddProduct = async (productData: ProductData) => {
    // Get franchiseId from localStorage.franchiseId
    let franchiseId = localStorage.getItem('franchiseId') || undefined;
    console.log('Extracted franchiseId from localStorage:', franchiseId);
    // Only add franchiseId if it exists and is non-empty
    // Map frontend fields to backend schema
    const { purchase_price, selling_price, ...rest } = productData;
    const productDataWithFranchise = {
      ...rest,
      purchasePrice: purchase_price,
      sellingPrice: selling_price,
      franchiseId,
    };
    console.log('Submitting product data:', productDataWithFranchise);
    try {
      const response = await addProduct(productDataWithFranchise);
      
      if (response.data) {
        // Refresh the products list
        // Use window.location.reload() as a simple way to refresh, or use React Query's refetch if available
        window.location.reload();

        toast({
          title: "Product Added",
          description: `${productData.productName} has been added successfully.`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsAddProductModalOpen(false);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{typeof error === 'object' && error !== null && 'message' in error ? (error as any).message : String(error)}</div>;

  return (
    <MainLayout>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-2xl font-bold">Inventory</h1>
        <div className="flex mt-4 md:mt-0">
          <ActionButton 
            icon={<Plus size={18} />} 
            label="Add a new Product" 
            onClick={() => setIsAddProductModalOpen(true)} 
            variant="accent"
            className="bg-yellow-400 hover:bg-yellow-500 text-black"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search Products"
            className="w-full pl-10 h-11"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Base Unit</TableHead>
                <TableHead>Conversion</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total Stock</TableHead>
                <TableHead>GST</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Edit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <TableRow key={item._id || item.productId || `${item.productName}-${item.category}`}>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.base_unit}</TableCell>
                    <TableCell>{item.conversion_factor_display}</TableCell>
                    <TableCell>{item.stock_quantity}</TableCell>
                    <TableCell>{item.total_stock}</TableCell>
                    <TableCell>{item.gst}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>
                      <button 
                        className="text-gray-500 hover:text-blue-600 transition-colors"
                        onClick={() => navigate(`/${item.productId}/inventory/edit/${item.productId}`)}
                      >
                        <Edit size={18} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-4">
                    {isLoading ? (
                      'Loading products...'
                    ) : error ? (
                      <span className="text-red-500">{typeof error === 'object' && error !== null && 'message' in error ? (error as any).message : String(error)}</span>
                    ) : isSearching ? (
                      'No products match your search criteria.'
                    ) : (
                      'No products available.'
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4 px-2">
          <div className="text-sm text-gray-500">
            Showing 
            <span className="relative mx-2">
              <select 
                className="appearance-none bg-white border rounded px-3 py-1 pr-8"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                </svg>
              </div>
            </span>
            products
          </div>

          <Pagination className="flex gap-1 items-center">
            <PaginationPrevious 
              className="px-4 py-2 rounded-md cursor-pointer" 
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            />
            {pageNumbers.map((number) => (
              <PaginationItem 
                key={number} 
                className={`px-4 py-2 cursor-pointer ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setCurrentPage(number)}
              >
                {number}
              </PaginationItem>
            ))}
            <PaginationNext 
              className="px-4 py-2 rounded-md cursor-pointer" 
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            />
          </Pagination>
        </div>
      </div>

      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onSubmit={handleAddProduct}
      />
    </MainLayout>
  );
};

export default React.memo(Inventory);
