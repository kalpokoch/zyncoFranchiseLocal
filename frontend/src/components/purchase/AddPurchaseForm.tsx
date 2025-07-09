import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface ProductItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  gst: number;
  priceWithTax: number;
  amount: number;
}

import { getSuppliers, Supplier } from '@/api/supplier.api';

interface PurchaseFormData {
  invoiceNumber: string;
  supplier: string; // supplier ObjectId
  billingDate: Date;
  billingAddress: string;
  products: ProductItem[];
  total: {
    quantity: number;
    amount: number;
  };
}

interface AddPurchaseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (purchaseData: any) => void; // Accept backend payload shape
  initialData?: any; // For editing
}

const generatePurchaseInvoiceNumber = (): string => {
  // Generate a short invoice number like PUR-XXXXX
  const rand = Math.floor(10000 + Math.random() * 90000); // 5-digit random
  return `PUR-${rand}`;
};

const calculatePriceWithTax = (price: number, gst: number): number => {
  return price + (price * gst) / 100;
};

const calculateAmount = (quantity: number, priceWithTax: number): number => {
  return quantity * priceWithTax;
};

const AddPurchaseForm: React.FC<AddPurchaseFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [purchaseData, setPurchaseData] = useState<PurchaseFormData>(() => {
    if (initialData) {
      // Map initialData to PurchaseFormData shape if needed
      return {
        invoiceNumber: initialData.invoiceNumber || '',
        supplier: initialData.supplier?._id || initialData.supplier || '',
        billingDate: initialData.billingDate ? new Date(initialData.billingDate) : new Date(),
        billingAddress: initialData.billingAddress || '',
        products: (initialData.product || []).map((prod: any, idx: number) => ({
          id: String(idx + 1),
          name: prod.productName || '',
          quantity: prod.quantity || 1,
          unit: prod.unit || '',
          pricePerUnit: prod.pricePerUnit || 0,
          gst: prod.gst || 0,
          priceWithTax: prod.priceWithTax || 0,
          amount: prod.amount || 0,
        })),
        total: {
          quantity: (initialData.product || []).reduce((sum: number, p: any) => sum + (p.quantity || 0), 0),
          amount: (initialData.product || []).reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
        },
      };
    }
    return {
      invoiceNumber: generatePurchaseInvoiceNumber(),
      supplier: '',
      billingDate: new Date(),
      billingAddress: '',
      products: [
        {
          id: '1',
          name: '',
          quantity: 1,
          unit: '',
          pricePerUnit: 0,
          gst: 0,
          priceWithTax: 0,
          amount: 0,
        }
      ],
      total: {
        quantity: 1,
        amount: 0,
      },
    };
  });

  // If initialData changes, update state
  React.useEffect(() => {
    if (initialData) {
      setPurchaseData({
        invoiceNumber: initialData.invoiceNumber || '',
        supplier: initialData.supplier?._id || initialData.supplier || '',
        billingDate: initialData.billingDate ? new Date(initialData.billingDate) : new Date(),
        billingAddress: initialData.billingAddress || '',
        products: (initialData.product || []).map((prod: any, idx: number) => ({
          id: String(idx + 1),
          name: prod.productName || '',
          quantity: prod.quantity || 1,
          unit: prod.unit || '',
          pricePerUnit: prod.pricePerUnit || 0,
          gst: prod.gst || 0,
          priceWithTax: prod.priceWithTax || 0,
          amount: prod.amount || 0,
        })),
        total: {
          quantity: (initialData.product || []).reduce((sum: number, p: any) => sum + (p.quantity || 0), 0),
          amount: (initialData.product || []).reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
        },
      });
    }
  }, [initialData]);

  // Supplier dropdown & autocomplete state
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplierLoading, setSupplierLoading] = useState(false);
  const [supplierError, setSupplierError] = useState('');
  const [supplierQuery, setSupplierQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const filteredSuppliers = supplierQuery
    ? suppliers.filter(s => s.name.toLowerCase().includes(supplierQuery.toLowerCase()))
    : suppliers;

  // Use React state for franchiseId, update on storage event (matches Inventory.tsx pattern)
  const [franchiseId, setFranchiseId] = useState(() => localStorage.getItem('franchiseId'));
  React.useEffect(() => {
    const handleStorage = () => {
      setFranchiseId(localStorage.getItem('franchiseId'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    const fetchSuppliers = async () => {
      setSupplierLoading(true);
      try {
        // Use franchiseId from state (robust to changes)
        const data = await getSuppliers(franchiseId || '', 1, 100, '');
        // Use type guard to avoid lint errors
        if (Array.isArray(data)) {
          setSuppliers(data);
        } else if (data && Array.isArray((data as any).data)) {
          setSuppliers((data as any).data);
        } else {
          setSuppliers([]);
        }
      } catch (err: any) {
        setSupplierError('Failed to load suppliers');
      } finally {
        setSupplierLoading(false);
      }
    };
    if (franchiseId) fetchSuppliers();
  }, [franchiseId]);

  const updateTotals = (products: ProductItem[]): { quantity: number; amount: number } => {
    const totals = products.reduce(
      (acc, product) => {
        return {
          quantity: acc.quantity + product.quantity,
          amount: acc.amount + product.amount,
        };
      },
      { quantity: 0, amount: 0 }
    );
    
    // Round off the total amount to the nearest integer
    totals.amount = Math.round(totals.amount);
    
    return totals;
  };

  const handleSupplierChange = (supplierId: string) => {
    setPurchaseData({ ...purchaseData, supplier: supplierId });
  };

  const handleBillingAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPurchaseData({ ...purchaseData, billingAddress: e.target.value });
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setPurchaseData({ ...purchaseData, billingDate: date });
    }
  };

  const handleProductNameChange = (id: string, value: string) => {
    const updatedProducts = purchaseData.products.map(product => 
      product.id === id ? { ...product, name: value } : product
    );
    setPurchaseData({ ...purchaseData, products: updatedProducts });
  };

  const handleQuantityChange = (id: string, value: string) => {
    const quantity = parseInt(value) || 0;
    const updatedProducts = purchaseData.products.map(product => {
      if (product.id === id) {
        const amount = calculateAmount(quantity, product.priceWithTax);
        return { ...product, quantity, amount };
      }
      return product;
    });
    
    setPurchaseData({
      ...purchaseData,
      products: updatedProducts,
      total: updateTotals(updatedProducts),
    });
  };

  const handleUnitChange = (id: string, value: string) => {
    const updatedProducts = purchaseData.products.map(product => 
      product.id === id ? { ...product, unit: value } : product
    );
    setPurchaseData({ ...purchaseData, products: updatedProducts });
  };

  const handlePricePerUnitChange = (id: string, value: string) => {
    const price = parseFloat(value) || 0;
    const updatedProducts = purchaseData.products.map(product => {
      if (product.id === id) {
        const priceWithTax = calculatePriceWithTax(price, product.gst);
        const amount = calculateAmount(product.quantity, priceWithTax);
        return { ...product, pricePerUnit: price, priceWithTax, amount };
      }
      return product;
    });
    
    setPurchaseData({
      ...purchaseData,
      products: updatedProducts,
      total: updateTotals(updatedProducts),
    });
  };

  const handleGstChange = (id: string, value: string) => {
    const gst = parseFloat(value) || 0;
    const updatedProducts = purchaseData.products.map(product => {
      if (product.id === id) {
        const priceWithTax = calculatePriceWithTax(product.pricePerUnit, gst);
        const amount = calculateAmount(product.quantity, priceWithTax);
        return { ...product, gst, priceWithTax, amount };
      }
      return product;
    });
    
    setPurchaseData({
      ...purchaseData,
      products: updatedProducts,
      total: updateTotals(updatedProducts),
    });
  };

  const addNewProduct = () => {
    const newProduct: ProductItem = {
      id: Date.now().toString(),
      name: '',
      quantity: 1,
      unit: 'Kg',
      pricePerUnit: 0,
      gst: 5,
      priceWithTax: 0,
      amount: 0,
    };
    
    const updatedProducts = [...purchaseData.products, newProduct];
    
    setPurchaseData({
      ...purchaseData,
      products: updatedProducts,
      total: updateTotals(updatedProducts),
    });
  };

  const removeProduct = (id: string) => {
    if (purchaseData.products.length <= 1) return;
    
    const updatedProducts = purchaseData.products.filter(product => product.id !== id);
    
    setPurchaseData({
      ...purchaseData,
      products: updatedProducts,
      total: updateTotals(updatedProducts),
    });
  };

  const handleSubmit = () => {
    // Map products to backend schema
    const mappedProducts = purchaseData.products.map(({ id, name, ...rest }) => ({
      productName: name,
      ...rest
    }));
    // Find the supplier name from the loaded suppliers list
    const supplierObj = suppliers.find(s => s._id === purchaseData.supplier);
    const payload = {
      invoiceNumber: purchaseData.invoiceNumber,
      supplier: purchaseData.supplier, // ObjectId
      franchiseId: franchiseId || '', // <-- required by backend
      billingAddress: purchaseData.billingAddress,
      billingDate: purchaseData.billingDate,
      product: mappedProducts,
      totalAmount: Math.round(purchaseData.total.amount),
      balance: Math.round(purchaseData.total.amount),
      paymentStatus: 'Pending',
    };
    onSubmit(payload);
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add new Purchase</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new purchase.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="mb-4">
            <Label htmlFor="supplier">Supplier</Label>
            <div className="relative">
              <Input
                type="text"
                value={
                  suppliers.find(s => s._id === purchaseData.supplier)?.name || supplierQuery || ''
                }
                placeholder="Type supplier name"
                onChange={e => {
                  setSupplierQuery(e.target.value);
                  setShowSuggestions(true);
                  setPurchaseData(prev => ({ ...prev, supplier: '' }));
                }}
                onFocus={() => setShowSuggestions(true)}
                autoComplete="off"
              />
              {showSuggestions && supplierQuery && filteredSuppliers.length > 0 && (
                <div className="absolute z-10 bg-white border rounded shadow w-full max-h-48 overflow-auto">
                  {filteredSuppliers.map(supplier => (
                    <div
                      key={supplier._id}
                      className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        setSupplierQuery(supplier.name);
                        setShowSuggestions(false);
                        setPurchaseData(prev => ({ ...prev, supplier: supplier._id }));
                      }}
                    >
                      {supplier.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {supplierError && <div className="text-red-500 text-sm mt-1">{supplierError}</div>}
          </div>
          <div className="mb-4">
            <Label htmlFor="billingDate" className="block mb-2">
              Billing Date<span className="text-red-500">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !purchaseData.billingDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {purchaseData.billingDate ? format(purchaseData.billingDate, "PPP") : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={purchaseData.billingDate}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="mb-6">
            <Label htmlFor="billingAddress" className="block mb-2">
              Billing Address
            </Label>
            <Input
              id="billingAddress"
              placeholder="Enter Billing Address"
              value={purchaseData.billingAddress}
              onChange={handleBillingAddressChange}
              className="w-full"
            />
          </div>
          
          <div className="mb-4">
            <div className="grid grid-cols-12 gap-2 mb-2 text-sm font-medium">
              <div className="col-span-3">Product Name</div>
              <div className="col-span-1">Quantity</div>
              <div className="col-span-1">Unit</div>
              <div className="col-span-2">Price/Unit</div>
              <div className="col-span-1">GST%</div>
              <div className="col-span-2">Price with Tax</div>
              <div className="col-span-2">Amount</div>
            </div>
            
            {purchaseData.products.map((product, index) => (
              <div key={product.id} className="grid grid-cols-12 gap-2 mb-3 items-center">
                <div className="col-span-3">
                  <Input
                    value={product.name}
                    onChange={(e) => handleProductNameChange(product.id, e.target.value)}
                    placeholder="Product name"
                    className="h-9 w-full"
                  />
                </div>
                <div className="col-span-1">
                  <Input
                    type="number"
                    min="1"
                    value={product.quantity}
                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                    className="h-9 w-full"
                  />
                </div>
                <div className="col-span-1">
                  <Select
                    value={product.unit}
                    onValueChange={(value) => handleUnitChange(product.id, value)}
                  >
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Kg">Kg</SelectItem>
                      <SelectItem value="g">g</SelectItem>
                      <SelectItem value="L">L</SelectItem>
                      <SelectItem value="ml">ml</SelectItem>
                      <SelectItem value="Pcs">Pcs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2">₹</span>
                    <Input
                      type="number"
                      min="0"
                      className="pl-8 h-9 w-full"
                      value={product.pricePerUnit}
                      onChange={(e) => handlePricePerUnitChange(product.id, e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-span-1">
                  <Select
                    value={product.gst.toString()}
                    onValueChange={(value) => handleGstChange(product.id, value)}
                  >
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue placeholder="GST %" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0%</SelectItem>
                      <SelectItem value="5">5%</SelectItem>
                      <SelectItem value="12">12%</SelectItem>
                      <SelectItem value="18">18%</SelectItem>
                      <SelectItem value="28">28%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2">₹</span>
                    <Input
                      type="number"
                      min="0"
                      className="pl-8 h-9 w-full"
                      value={product.priceWithTax.toFixed(2)}
                      readOnly
                    />
                  </div>
                </div>
                <div className="col-span-2 flex items-center">
                  <div className="relative flex-grow mr-2">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2">₹</span>
                    <Input
                      type="number"
                      min="0"
                      className="pl-8 h-9 w-full"
                      value={product.amount.toFixed(2)}
                      readOnly
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeProduct(product.id)}
                    disabled={purchaseData.products.length <= 1}
                    className="flex-shrink-0"
                  >
                    <Trash2 size={18} className="text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={addNewProduct}
              className="mt-2"
            >
              <Plus size={16} className="mr-2" /> Add Product
            </Button>
          </div>
          
          <div className="flex justify-between items-center mt-6 font-medium">
            <div>Total:</div>
            <div className="flex gap-8">
              <div>{purchaseData.total.quantity}</div>
              <div>₹{Math.round(purchaseData.total.amount)}</div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between mt-6">
          <div>
            <Button variant="outline" className="mr-2">
              Print
            </Button>
          </div>
          <div>
            <Button variant="outline" onClick={onClose} className="mr-2">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-blue-600 text-white">
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPurchaseForm;
