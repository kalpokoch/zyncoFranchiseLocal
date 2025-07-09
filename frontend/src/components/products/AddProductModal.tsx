import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: ProductData) => void;
}

export interface ProductData {
  productId?: string;
  productName: string;
  category: string;
  purchase_price: number;
  selling_price: number;
  gst: string;
  base_unit: string;
  conversion_factor: { [key: string]: number };
  stock_quantity: number;
  total_stock?: string;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [productData, setProductData] = useState<ProductData>({
    productName: '',
    category: '',
    purchase_price: 0,
    selling_price: 0,
    gst: '',
    base_unit: '',
    conversion_factor: {},
    stock_quantity: 0,
    total_stock: '',
  });

  const [unitType, setUnitType] = useState('');
  const [factor, setFactor] = useState('');

  // Auto-calculate total stock in child unit
  React.useEffect(() => {
    if (
      productData.stock_quantity &&
      factor &&
      unitType
    ) {
      const total = Number(productData.stock_quantity) * Number(factor);
      setProductData(prev => ({
        ...prev,
        total_stock: `${total} ${unitType}`
      }));
    } else {
      setProductData(prev => ({
        ...prev,
        total_stock: ''
      }));
    }
  }, [productData.stock_quantity, factor, unitType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const conversion_factor: { [key: string]: number } = {};
    if (unitType && factor) {
      conversion_factor[unitType] = parseFloat(factor);
    }

    const formattedData: ProductData = {
      ...productData,
      stock_quantity: Number(productData.stock_quantity),
      purchase_price: Number(productData.purchase_price),
      selling_price: Number(productData.selling_price),
      conversion_factor,
    };

    onSubmit(formattedData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center mb-6">
          <div className="bg-yellow-400 p-2 rounded-lg mr-3">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold">Add New Product</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Product Name*</label>
              <Input
                name="productName"
                placeholder="Enter product name"
                value={productData.productName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Category*</label>
              <Select
                value={productData.category}
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grains">Grains</SelectItem>
                  <SelectItem value="pulses">Pulses</SelectItem>
                  <SelectItem value="snacks">Snacks</SelectItem>
                  <SelectItem value="beverages">Beverages</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Purchase Price*</label>
              <Input
                name="purchase_price"
                type="number"
                placeholder="₹0.00"
                value={productData.purchase_price}
                onChange={handleChange}
                required
                className="text-right"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Selling Price*</label>
              <Input
                name="selling_price"
                type="number"
                placeholder="₹0.00"
                value={productData.selling_price}
                onChange={handleChange}
                required
                className="text-right"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">GST %*</label>
              <Select
                value={productData.gst}
                onValueChange={(value) => handleSelectChange('gst', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select GST" />
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

            <div>
              <label className="block text-sm font-medium mb-1">Base Unit*</label>
              <Select
                value={productData.base_unit}
                onValueChange={(value) => handleSelectChange('base_unit', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bag">Bag</SelectItem>
                  <SelectItem value="carton">Carton</SelectItem>
                  <SelectItem value="box">Box</SelectItem>
                  <SelectItem value="pack">Pack</SelectItem>
                  <SelectItem value="piece">Piece</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Conversion Factor*</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Unit (e.g., kg)"
                  value={unitType}
                  onChange={(e) => setUnitType(e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="Value"
                  value={factor}
                  onChange={(e) => setFactor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Stock Quantity*</label>
              <div className="flex items-center gap-2">
                <Input
                  name="stock_quantity"
                  type="number"
                  placeholder="0"
                  value={productData.stock_quantity}
                  onChange={handleChange}
                  required
                  className="flex-1"
                />
                <span className="text-gray-500 text-sm">
                  {unitType ? unitType : 'child unit'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Total Stock</label>
              <Input
                value={(() => {
                  const qty = Number(productData.stock_quantity);
                  const fac = Number(factor);
                  if (qty && fac && unitType && productData.productName) {
                    const total = qty * fac;
                    return `${total} ${unitType} for ${productData.productName}`;
                  }
                  return '';
                })()}
                readOnly
                placeholder="Auto-calculated"
                className="bg-gray-50"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-grow bg-yellow-400 hover:bg-yellow-500 text-black"
            >
              Add Product
            </Button>
            <Button
              type="button"
              onClick={onClose}
              className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
