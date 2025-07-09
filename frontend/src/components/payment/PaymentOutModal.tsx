import React, { useState } from 'react';
import { createPaymentOut, updatePaymentOut } from '@/api/paymentOutApi';
import { getSupplierSuggestions, Supplier } from '@/api/supplier.api';
import { CalendarIcon } from 'lucide-react';
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

interface PaymentOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const PaymentOutModal: React.FC<PaymentOutModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const isEditMode = !!initialData && !!initialData._id; // editing if _id exists
  const [successMsg, setSuccessMsg] = useState('');
  const [supplier, setSupplier] = useState<{ _id?: string; name: string } | null>(initialData?.supplier ? { _id: initialData.supplier, name: initialData.supplierName || '' } : null);
  const [supplierInput, setSupplierInput] = useState(initialData?.supplierName || '');
  const [supplierSuggestions, setSupplierSuggestions] = useState<Supplier[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = React.useRef<HTMLDivElement>(null);
  const [billingAddress, setBillingAddress] = useState(initialData?.billingAddress || '');
  const [billingDate, setBillingDate] = useState<Date | undefined>(initialData?.paymentDate ? new Date(initialData.paymentDate) : (initialData?.billingDate ? new Date(initialData.billingDate) : undefined));
  const [amountPaid, setAmountPaid] = useState(initialData?.amountPaid || '');
  const [loading, setLoading] = useState(false);

  // Reset form fields whenever initialData changes (for edit mode)
  React.useEffect(() => {
    setSupplier(initialData?.supplier ? { _id: initialData.supplier, name: initialData.supplierName || '' } : null);
    setSupplierInput(initialData?.supplierName || '');
    setBillingAddress(initialData?.billingAddress || '');
    setBillingDate(initialData?.paymentDate ? new Date(initialData.paymentDate) : (initialData?.billingDate ? new Date(initialData.billingDate) : undefined));
    setAmountPaid(initialData?.amountPaid || '');
  }, [initialData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto relative">
        <h2 className="text-xl font-semibold mb-6">{isEditMode ? 'Edit Payment Out' : 'Add Payment Out'}</h2>
        {successMsg && (
          <div className="fixed left-1/2 top-20 transform -translate-x-1/2 z-50">
            <div className="bg-green-500 text-white px-6 py-3 rounded shadow-lg animate-fade-in-out">
              {successMsg}
            </div>
          </div>
        )}
        <form
          onSubmit={async e => {
            e.preventDefault();
            setLoading(true);
            try {
              const franchiseId = localStorage.getItem('franchiseId');
              if (!franchiseId) throw new Error('Franchise ID not found');
              const paymentOut = {
                franchiseId,
                invoiceNumber: isEditMode ? initialData.invoiceNumber : `POUT-${Date.now()}`,
                supplier: supplier?._id || supplierInput, // send id if selected, else raw input
                supplierName: supplier ? supplier.name : supplierInput,
                billingAddress,
                paymentDate: billingDate ? billingDate.toISOString() : '',
                amountPaid: parseFloat(amountPaid),
              };
              let res;
              if (isEditMode && initialData._id) {
                res = await updatePaymentOut(initialData._id, paymentOut);
              } else {
                res = await createPaymentOut(paymentOut);
              }
              if (res.success) {
                setSuccessMsg(isEditMode ? 'Payment Out updated successfully!' : 'Payment Out saved successfully!');
                setSupplier(null);
                setSupplierInput('');
                setBillingAddress('');
                setBillingDate(undefined);
                setAmountPaid('');
                setTimeout(() => {
                  setSuccessMsg('');
                  onSubmit(paymentOut);
                  onClose();
                }, 1000);
              }
            } catch (err) {
              alert('Error saving Payment Out: ' + (err.message || err));
            } finally {
              setLoading(false);
            }
          }}
          className="space-y-4"
        >
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supplier Name*
            </label>
            <Input
              placeholder="Search Supplier by name"
              value={supplierInput}
              onChange={async (e) => {
                const value = e.target.value;
                setSupplierInput(value);
                setShowSuggestions(true);
                setSupplier(null);
                const franchiseId = localStorage.getItem('franchiseId');
                if (value.length > 1 && franchiseId) {
                  const suggestions = await getSupplierSuggestions(franchiseId, value);
                  setSupplierSuggestions(suggestions.filter(s => s._id && s.name));
                } else {
                  setSupplierSuggestions([]);
                }
              }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="w-full"
              required
            />
            {showSuggestions && supplierSuggestions.length > 0 && (
              <div ref={suggestionsRef} className="absolute left-0 top-full bg-white border border-gray-200 rounded shadow-md z-20 w-full max-h-48 overflow-y-auto">
                {supplierSuggestions.map((suggestion) => (
                  <div
                    key={suggestion._id}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                    onMouseDown={() => {
                      setSupplier({ _id: suggestion._id, name: suggestion.name });
                      setSupplierInput(suggestion.name);
                      setShowSuggestions(false);
                    }}
                  >
                    {suggestion.name}
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Billing Address
            </label>
            <Input
              placeholder="Enter billing address"
              value={billingAddress}
              onChange={e => setBillingAddress(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount Paid*
            </label>
            <Input
              type="number"
              placeholder="Enter amount paid"
              value={amountPaid}
              onChange={e => setAmountPaid(e.target.value)}
              required
              className="w-full text-lg p-4"
            />
          </div>
          <div className="flex justify-between mt-8">
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
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                disabled={loading || !supplier || !billingDate || !amountPaid}
              >
                {loading ? 'Saving...' : 'Save'}
              </Button>
              {successMsg && (
                <span className="text-green-600 ml-4 self-center">{successMsg}</span>
              )}
              <Button type="button" variant="outline" className="px-8" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentOutModal;
