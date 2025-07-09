import { useState } from "react";
// Ensure the correct path to the franchiseApi file
import { createFranchise, FranchiseData } from "../../api/franchiseApi";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";

interface ErrorResponse {
  message: string;
}

// Define the Franchise response type
interface FranchiseResponse extends FranchiseData {
  franchiseId: string;
}

interface FranchiseFormProps {
  onClose?: () => void;
  onSuccess?: (franchise: FranchiseResponse) => void;
}

const FranchiseForm = ({ onClose, onSuccess }: FranchiseFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FranchiseData>({
    franchiseName: "",
    managerName: "",
    email: "",
    phoneNumber: "",
    totalInvestmentAmount: "",
    location: "",
    investmentDate: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await createFranchise(formData);
      setMessage(response.data.message || "Franchise created successfully");
      
      toast({
        title: "Success",
        description: "Franchise partner added successfully!",
      });
      
      if (onSuccess && response.data.franchise) {
        onSuccess(response.data.franchise as FranchiseResponse);
      }
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || "Error creating franchise";
      setMessage(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-[#FF5722] text-white p-1.5 rounded">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h2 className="text-lg font-medium text-gray-900">Add New Partner</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Franchise Name*</label>
          <input 
            type="text" 
            name="franchiseName" 
            placeholder="Enter franchise name"
            onChange={handleChange} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" 
            required 
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-700 mb-1">Owner/Manager Name*</label>
          <input 
            type="text" 
            name="managerName" 
            placeholder="Enter owner's or manager's full name"
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
            onChange={handleChange} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" 
            required 
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-700 mb-1">Total Investment Amount*</label>
          <input 
            type="number" 
            name="totalInvestmentAmount" 
            placeholder="Enter Invested Amount"
            onChange={handleChange} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" 
            required 
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-700 mb-1">Location*</label>
          <input 
            type="text" 
            name="location" 
            placeholder="Enter the Partner's Address" 
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" 
            required 
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-700 mb-1">Investment Date</label>
          <div className="relative">
            <input 
              type="date" 
              name="investmentDate" 
              placeholder="Select date"
              onChange={handleChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" 
              required 
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm text-gray-700 mb-1">Password</label>
          <input 
            type="password" 
            name="password" 
            placeholder="Enter Password"
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
            {loading ? "Adding..." : "Add Partner"}
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
  );
};

export default FranchiseForm; 