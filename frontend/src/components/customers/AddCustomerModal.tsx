import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { UserPlus, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createCustomer, Customer } from '@/api/customer.api';


interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerAdded: () => void;
  franchiseId: string;
}

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ isOpen, onClose, onCustomerAdded, franchiseId }) => {
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [gstin, setGstin] = useState(''); // Assuming GSTIN is a field, though not in the base model
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [amountReceivable, setAmountReceivable] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
    if (!isOpen) {
      // Reset form and messages when modal closes
      setCustomerName('');
      setPhoneNumber('');
      setEmail('');
      setAddress('');
      setGstin('');
      setAmountReceivable('');
      setSuccessMsg('');
      setErrorMsg('');
    }
  }, [isOpen]);

    const handleSubmit = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!customerName || !phoneNumber) {
      setErrorMsg('Customer Name and Mobile Number are required.');
      return;
    }
    if (!franchiseId) {
      setErrorMsg('Franchise ID is not available. Cannot add customer.');
      return;
    }

    setIsLoading(true);
    try {
      const customerData: Omit<Customer, '_id' | 'createdAt' | 'updatedAt'> = {
        franchiseId,
        customerName,
        phoneNumber,
        email: email || undefined,
        address: address || undefined,
        amountReceivable: amountReceivable ? Number(amountReceivable) : 0,
      };
      
      await createCustomer(customerData);
      setSuccessMsg('Customer added successfully!');
      
      setTimeout(() => {
        onCustomerAdded();
        onClose();
      }, 2000);

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to add customer.';
      setErrorMsg(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
        {successMsg && (
          <div className="bg-green-500 text-white p-3 rounded-md mb-4 text-center">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="bg-red-500 text-white p-3 rounded-md mb-4 text-center">
            {errorMsg}
          </div>
        )}
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 p-2 rounded-lg mr-3">
            <UserPlus className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold">Add a new Customer</h2>
        </div>
                <div className="space-y-4">
          <div>
            <Label className="block text-sm font-medium mb-1">Customer Name*</Label>
            <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Enter the full name of the customer" required />
          </div>
          <div>
            <Label className="block text-sm font-medium mb-1">Mobile Number*</Label>
            <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Enter a 10-digit contact number" required />
          </div>
          <div>
            <Label className="block text-sm font-medium mb-1">Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter a valid email address" />
          </div>
          <div>
            <Label className="block text-sm font-medium mb-1">Address</Label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="E.g., 123 Market Street, Kokrajhar" />
          </div>
          <div>
            <Label className="block text-sm font-medium mb-1">GSTIN</Label>
            <Input value={gstin} onChange={(e) => setGstin(e.target.value)} placeholder="Enter a valid GSTIN if applicable" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              'Adding...'
            ) : (
              <>
                Add the Customer <PlusCircle className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomerModal;
