
import React, { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { getCustomerSuggestions, Customer } from '@/api/customer.api';
import { useLocation, useNavigate } from 'react-router-dom';
import { updatePaymentIn } from '@/api/paymentInApi';
import AddProductModal, { ProductData } from '@/components/products/AddProductModal';
import { addProduct } from '../api/productApi';
import { useToast } from '@/components/ui/use-toast';
import MainLayout from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { createPaymentIn } from '@/api/paymentInApi';

const PaymentIn: React.FC = () => {
  const { toast } = useToast();
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  // Add Product handler (same as Inventory/Sales/AddSales)
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

  const location = useLocation();
  const navigate = useNavigate();
  const editingPayment = (location.state && (location.state as any).payment) as any | undefined;
  const [customer, setCustomer] = useState<{ _id: string, customerName: string } | null>(editingPayment && editingPayment.customer ? { _id: editingPayment.customer._id || '', customerName: editingPayment.customer.customerName || editingPayment.customerName || '' } : null);
  const [customerInput, setCustomerInput] = useState(editingPayment && (editingPayment.customerName || (editingPayment.customer && editingPayment.customer.customerName)) ? (editingPayment.customerName || (editingPayment.customer && editingPayment.customer.customerName)) : '');
  const [customerSuggestions, setCustomerSuggestions] = useState<(Customer & { _id: string; customerName: string })[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = React.useRef<HTMLDivElement>(null);
  const [billingAddress, setBillingAddress] = useState(editingPayment?.billingAddress || '');
  const [billingDate, setBillingDate] = useState<Date>(editingPayment?.billingDate ? new Date(editingPayment.billingDate) : undefined);
  const [amountReceived, setAmountReceived] = useState(editingPayment?.amountReceived ? editingPayment.amountReceived.toString() : '');
  const [loading, setLoading] = useState(false);
  const [franchiseId, setFranchiseId] = useState(() => localStorage.getItem('franchiseId'));
  const [successMsg, setSuccessMsg] = useState('');

  React.useEffect(() => {
    const handleStorage = () => {
      setFranchiseId(localStorage.getItem('franchiseId'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleSave = async () => {
    if (!franchiseId || !customerInput || !billingDate || !amountReceived) return;
    setLoading(true);
    try {
      let res;
      if (editingPayment && editingPayment._id) {
        // Update existing
        const paymentIn = {
          franchiseId,
          invoiceNumber: editingPayment.invoiceNumber || `PINV-${Date.now()}`,
          customer: customer?._id || undefined,
          customerName: customer ? customer.customerName : customerInput,
          billingAddress,
          billingDate: billingDate.toISOString(),
          amountReceived: parseFloat(amountReceived),
        };
        res = await updatePaymentIn(editingPayment._id, paymentIn);
      } else {
        // Create new
        const paymentIn = {
          franchiseId,
          invoiceNumber: `PINV-${Date.now()}`,
          customer: customer?._id || undefined,
          customerName: customer ? customer.customerName : customerInput,
          billingAddress,
          billingDate: billingDate.toISOString(),
          amountReceived: parseFloat(amountReceived),
        };
        res = await createPaymentIn(paymentIn);
      }
      if (res.success) {
        setSuccessMsg(editingPayment ? 'Payment In updated successfully!' : 'Payment In saved successfully!');
        setTimeout(() => setSuccessMsg(''), 1500);
        navigate(`/${franchiseId}/payment-in-history`);
        if (!editingPayment) {
          setCustomer(null);
          setCustomerInput('');
          setBillingAddress('');
          setBillingDate(undefined);
          setAmountReceived('');
        }
      }
    } catch (err) {
      console.error('Error saving Payment In:', err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <MainLayout>
      {successMsg && (
        <div className="fixed left-1/2 top-20 transform -translate-x-1/2 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded shadow-lg animate-fade-in-out">
            {successMsg}
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Payment In</h1>
          <div className="flex gap-3">
            <Button className="bg-green-600 hover:bg-green-700 text-white rounded-md px-6 py-2 font-semibold shadow-sm flex items-center gap-2" onClick={() => {
  const pathParts = location.pathname.split('/');
  const franchiseIdFromUrl = pathParts[1];
  navigate(`/${franchiseIdFromUrl}/sales/add`);
}}>
  Add Sales
</Button>
<Button className="bg-yellow-400 hover:bg-yellow-500 text-black rounded-md px-6 py-2 font-semibold shadow-sm flex items-center gap-2" onClick={() => setIsAddProductModalOpen(true)}>
  Add a new Product
</Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Invoice Number */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Invoice number : #</h2>
          </div>

          {/* Customer Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name*
              </label>
              <Input
                placeholder="Search Customer by name or phone"
                value={customerInput}
                onChange={async (e) => {
                  const value = e.target.value;
                  setCustomerInput(value);
                  setShowSuggestions(true);
                  setCustomer(null);
                  if (value.length > 1 && franchiseId) {
                    const suggestions = await getCustomerSuggestions(franchiseId, value);
                    setCustomerSuggestions(
                      suggestions
                        .filter(s => s._id && s.customerName)
                        .map(s => ({ ...s, _id: s._id as string, customerName: s.customerName as string }))
                    );
                  } else {
                    setCustomerSuggestions([]);
                  }
                }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full sm:w-64"
              />
              {showSuggestions && customerSuggestions.length > 0 && (
                <div ref={suggestionsRef} className="absolute bg-white border border-gray-200 rounded shadow-md z-10 w-full sm:max-w-xs max-h-48 overflow-y-auto">
                  {customerSuggestions.map((suggestion) => (
                    <div
                      key={suggestion._id}
                      className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                      onMouseDown={() => {
                        setCustomer(suggestion);
                        setCustomerInput(suggestion.customerName);
                        setShowSuggestions(false);
                      }}
                    >
                      {suggestion.customerName}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Billing Date*
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !billingDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {billingDate ? format(billingDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={billingDate}
                    onSelect={setBillingDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Billing Address
            </label>
            <Input
              placeholder="Enter billing Address"
              value={billingAddress}
              onChange={(e) => setBillingAddress(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Amount Received Section */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount Received
            </label>
            <div className="max-w-md">
              <Input
                type="number"
                value={amountReceived}
                onChange={(e) => setAmountReceived(e.target.value)}
                className="w-full text-lg p-4"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Select defaultValue="print">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="print">Print</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-3">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                onClick={handleSave}
                disabled={loading || !customerInput || !billingDate || !amountReceived}
              >
                {loading ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="outline" className="px-8" onClick={() => navigate(`/${franchiseId}/payment-in-history`)}>
                Cancel
              </Button>
            </div>
          </div>
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

export default PaymentIn;