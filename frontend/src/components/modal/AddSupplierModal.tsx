import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { createSupplier } from '@/api/supplier.api';
import { toast } from 'sonner';

interface AddSupplierModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSupplierAdded?: () => void;
}

const AddSupplierModal: React.FC<AddSupplierModalProps> = ({ open, onOpenChange, onSupplierAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    gstin: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    const franchiseId = localStorage.getItem('franchiseId');
    const supplierData = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      gstin: formData.gstin,
      franchiseId,
    };
    setLoading(true);
    try {
      if (!formData.name || !formData.phone) {
        toast.error('Name and phone are required');
        setLoading(false);
        return;
      }
      await createSupplier(supplierData);
      toast.success('Supplier added successfully');
      onOpenChange(false);
      setFormData({ name: '', phone: '', email: '', address: '', gstin: '' });
      if (onSupplierAdded) onSupplierAdded();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to add supplier');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', phone: '', email: '', address: '', gstin: '' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-6" aria-describedby="add-supplier-desc">
        <DialogHeader className="mb-4">
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
            {/* Accessibility description for Radix Dialog */}
            <p id="add-supplier-desc" className="sr-only">
              Fill in the supplier details and submit to add a new supplier.
            </p>
            <div className="bg-purple-100 p-2 rounded-lg">
              <Plus className="h-5 w-5 text-purple-600" />
            </div>
            Add a new supplier
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="supplierName" className="text-sm font-medium text-gray-700">
              Supplier Name*
            </Label>
            <Input
              id="supplierName"
              placeholder="Enter the supplier's business name (E.g., Rajesh Sharma)"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobileNumber" className="text-sm font-medium text-gray-700">
              Mobile Number*
            </Label>
            <Input
              id="mobileNumber"
              placeholder="Enter a 10-digit contact number (E.g., 9876543210)"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              placeholder="Enter a valid email address (E.g., rajesh@gmail.com)"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium text-gray-700">
              Address*
            </Label>
            <Input
              id="address"
              placeholder="E.g., 123 Market Street, Indrapura"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gstin" className="text-sm font-medium text-gray-700">
              GSTIN
            </Label>
            <Input
              id="gstin"
              placeholder="Enter a valid GSTIN (15 alphanumeric E.g., 29AAAAA0000A1Z5)"
              value={formData.gstin}
              onChange={(e) => handleInputChange('gstin', e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add the Supplier'}
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="px-6 py-2.5 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddSupplierModal;