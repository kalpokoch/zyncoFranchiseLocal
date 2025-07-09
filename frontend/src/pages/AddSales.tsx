import React, { useState, useRef, useEffect } from 'react';
import { Calendar, CalendarIcon, Trash2 } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
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
import { createSale, updateSale } from '@/api/salesApi';
import { getCustomerSuggestions, Customer } from '@/api/customer.api';

interface SalesItem {
  id: string;
  productName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  gst: number;
  priceWithTax: number;
  amount: number;
}

import { useLocation, useNavigate } from 'react-router-dom';
import AddProductModal, { ProductData } from '@/components/products/AddProductModal';
import { addProduct } from '../api/productApi';
import { useToast } from '@/components/ui/use-toast';

const AddSales: React.FC = () => {
  const { toast } = useToast();
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  // Add Product handler (same as Inventory/Sales)
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

  const navigate = useNavigate();
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const franchiseIdFromUrl = pathParts[1];
  const editingSale = (location.state && (location.state as any).sale) as any | undefined;

  const [customer, setCustomer] = useState<{ _id: string, customerName: string } | null>(editingSale && editingSale.customer && editingSale.customer._id ? { _id: editingSale.customer._id, customerName: editingSale.customer.customerName } : null);
  const [customerInput, setCustomerInput] = useState(editingSale && editingSale.customer && editingSale.customer.customerName ? editingSale.customer.customerName : '');
  const [customerSuggestions, setCustomerSuggestions] = useState<(Customer & { _id: string; customerName: string })[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [billingAddress, setBillingAddress] = useState(editingSale?.billingAddress || '');
  const [billingDate, setBillingDate] = useState<Date | undefined>(editingSale?.billingDate ? new Date(editingSale.billingDate) : undefined);
  const [salesItems, setSalesItems] = useState<SalesItem[]>(editingSale?.salesItems?.map((item: any, idx: number) => ({ id: idx.toString(), ...item })) || []);
  const [franchiseId, setFranchiseId] = useState(editingSale?.franchiseId || '');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const id = localStorage.getItem('franchiseId') || '';
    setFranchiseId(id);
  }, []);

  const handleSave = async () => {
    if (!customer || !customer._id) {
      alert('Please select a valid customer.');
      return;
    }
    try {
      const saleData = {
        franchiseId,
        invoiceNumber: editingSale?.invoiceNumber || `INV-${Date.now()}`,
        customer: customer._id,
        billingAddress,
        billingDate: billingDate ? billingDate.toISOString() : '',
        salesItems: salesItems.map(({ id, ...rest }) => rest),
        totalQuantity: salesItems.reduce((sum, item) => sum + item.quantity, 0),
        totalAmount: salesItems.reduce((sum, item) => sum + item.amount, 0),
        paymentStatus: editingSale?.paymentStatus || 'Pending',
      };
      if (editingSale && editingSale._id) {
        await updateSale(editingSale._id, saleData);
        setSuccessMsg('Sale updated successfully!');
      } else {
        await createSale(saleData);
        setSuccessMsg('Sale saved successfully!');
        // Reset all form fields after save
        setCustomer(null);
        setCustomerInput('');
        setBillingAddress('');
        setBillingDate(undefined);
        setSalesItems([]);
      }
      setTimeout(() => setSuccessMsg(''), 2500);
    } catch (err: any) {
      console.error('Error saving sale:', err);
    }
  };

  const addNewRow = () => {
    const newItem: SalesItem = {
      id: Date.now().toString(),
      productName: '',
      quantity: 1,
      unit: 'Kg',
      pricePerUnit: 0,
      gst: 5,
      priceWithTax: 0,
      amount: 0
    };
    setSalesItems([...salesItems, newItem]);
  };

  const removeRow = (id: string) => {
    setSalesItems(salesItems.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof SalesItem, value: any) => {
    setSalesItems(salesItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        // Recalculate priceWithTax and amount when relevant fields change
        if (['quantity', 'pricePerUnit', 'gst'].includes(field)) {
          updatedItem.priceWithTax = updatedItem.pricePerUnit + (updatedItem.pricePerUnit * updatedItem.gst / 100);
          updatedItem.amount = updatedItem.quantity * updatedItem.priceWithTax;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const totalQuantity = salesItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = salesItems.reduce((sum, item) => sum + item.amount, 0);

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
          <h1 className="text-2xl font-bold">Add new Sales</h1>
          <div className="flex gap-3">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-md px-6 py-2 font-semibold shadow-sm flex items-center gap-2" onClick={() => navigate(`/${franchiseIdFromUrl}/payment-in`)}>
  <Calendar className="w-4 h-4" />
  Add Payment In
</Button>
<Button className="bg-yellow-400 hover:bg-yellow-500 text-black rounded-md px-6 py-2 font-semibold shadow-sm flex items-center gap-2" onClick={() => setIsAddProductModalOpen(true)}>
  Add a new Product
</Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Invoice Number */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Invoice number : #104</h2>
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
                  <CalendarComponent
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

          {/* Products Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Product Name</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Quantity</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Unit</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Price/Unit</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Gst%</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Price with Tax</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Amount</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {salesItems.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-3 px-2">
                      <Input
                        value={item.productName}
                        onChange={(e) => updateItem(item.id, 'productName', e.target.value)}
                        className="w-full min-w-[150px]"
                      />
                    </td>
                    <td className="py-3 px-2">
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-20"
                      />
                    </td>
                    <td className="py-3 px-2">
                      <Select value={item.unit} onValueChange={(value) => updateItem(item.id, 'unit', value)}>
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Kg">Kg</SelectItem>
                          <SelectItem value="g">g</SelectItem>
                          <SelectItem value="L">L</SelectItem>
                          <SelectItem value="ml">ml</SelectItem>
                          <SelectItem value="Pcs">Pcs</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-3 px-2">
                      <Input
                        type="number"
                        value={item.pricePerUnit}
                        onChange={(e) => updateItem(item.id, 'pricePerUnit', parseFloat(e.target.value) || 0)}
                        className="w-32"
                        placeholder="₹22"
                      />
                    </td>
                    <td className="py-3 px-2">
                      <Input
                        type="number"
                        value={item.gst}
                        onChange={(e) => updateItem(item.id, 'gst', parseFloat(e.target.value) || 0)}
                        className="w-24"
                      />
                    </td>
                    <td className="py-3 px-2">
                      <Input
                        type="number"
                        value={item.priceWithTax}
                        readOnly
                        className="w-32 bg-gray-50"
                        placeholder="₹22"
                      />
                    </td>
                    <td className="py-3 px-2">
                      <Input
                        type="number"
                        value={item.amount}
                        readOnly
                        className="w-20 bg-gray-50"
                        placeholder="₹22"
                      />
                    </td>
                    <td className="py-3 px-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRow(item.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Row Button */}
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={addNewRow}
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              + Add Row
            </Button>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center mb-6 py-4 border-t">
            <div className="text-lg font-semibold">
              Total: {totalQuantity}
            </div>
            <div className="text-lg font-semibold">
              ₹{totalAmount.toLocaleString()}
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
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8" onClick={handleSave}>
                Save
              </Button>
              <Button variant="outline" className="px-8">
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

export default AddSales;