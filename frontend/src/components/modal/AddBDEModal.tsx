import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddBDEModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BDEFormData) => void;
  franchises: Array<{ franchiseId: string; franchiseName: string }>;
}

export interface BDEFormData {
  employeeName: string;
  email: string;
  phoneNumber: string;
  franchiseId: string;
  password: string;
}

const AddBDEModal: React.FC<AddBDEModalProps> = ({ isOpen, onClose, onSubmit, franchises }) => {
  const [formData, setFormData] = useState<BDEFormData>({
    employeeName: '',
    email: '',
    phoneNumber: '',
    franchiseId: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFranchiseChange = (value: string) => {
    setFormData({ ...formData, franchiseId: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      setMessage('BDE added successfully!');
      if (onClose) onClose();
    } catch (error) {
      setMessage('Error adding BDE');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="p-6 bg-white rounded-lg max-w-[430px] w-full">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-[#FF5722] text-white p-1.5 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 className="text-lg font-medium text-gray-900">Add New BDE</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Employee Name*</label>
            <input
              type="text"
              name="employeeName"
              placeholder="Enter Employee name"
              value={formData.employeeName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">E-mail*</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email id"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Phone Number*</label>
            <input
              type="text"
              name="phoneNumber"
              placeholder="Enter Contact Number (Eg: +91 9876543210)"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Select Franchise*</label>
            <Select value={formData.franchiseId} onValueChange={handleFranchiseChange}>
              <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                <SelectValue placeholder="Select Franchise" />
              </SelectTrigger>
              <SelectContent>
                {franchises.map(f => (
                  <SelectItem key={f.franchiseId} value={f.franchiseId}>{f.franchiseName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Password*</label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              required
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-grow bg-[#FF5722] text-white px-4 py-2 rounded-md hover:bg-[#E64A19] flex items-center justify-center text-sm"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add BDE"}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <button
              type="button"
              className="w-24 bg-white text-gray-700 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
        {message && !loading && <p className="mt-4 text-green-500 text-sm">{message}</p>}
      </div>
    </div>
  );
};

export default AddBDEModal;
