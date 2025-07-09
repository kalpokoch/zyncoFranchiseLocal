import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, MapPin, User , Warehouse} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import zyncoLogo from '@/assets/icons/zyncoLogoText.png';
import { useToast } from "@/hooks/use-toast";
import { getFranchises, FranchiseData } from '../api/franchiseApi';
import { createBDE } from '@/api/bdeApi';
import AddPartnerModal from '@/components/modal/addPartnerModal';
import AddBDEModal from '@/components/modal/AddBDEModal';
import { AxiosError } from 'axios';
import FranchiseForm from './FranchiseForm';

interface Franchise {
  franchiseId: string;
  franchiseName: string;
  managerName: string;
  location: string;
}

interface FranchiseResponse extends FranchiseData {
  franchiseId: string;
}

const FranchiseSelect = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch franchises from API
  useEffect(() => {
    fetchFranchises();
  }, []);

  const fetchFranchises = async () => {
    try {
      console.log('Fetching franchises...');
      const response = await getFranchises();
      console.log('Franchise response:', response);
      
      if (response.data && response.data.franchises) {
        setFranchises(response.data.franchises);
        toast({
          title: "Success",
          description: "Franchises loaded successfully",
        });
      } else {
        console.error('Unexpected response format:', response);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Unexpected response format from server",
        });
      }
    } catch (error) {
      console.error('Error fetching franchises:', error);
      const axiosError = error as AxiosError<{ message: string }>;
      
      // Check if it's an authentication error
      if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please log in again to access this page",
        });
        // Redirect to login page
        navigate('/login');
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: axiosError.response?.data?.message || "Failed to fetch franchises",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddFranchiseClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFranchiseCreated = async (newFranchise: FranchiseResponse) => {
    await fetchFranchises(); // Refresh the list
    handleCloseModal();
  };

  const handleFranchiseClick = (franchiseId: string) => {
    // Store selected franchiseId in localStorage
    localStorage.setItem('franchiseId', franchiseId);
    navigate(`/${franchiseId}/dashboard`);
  };

  // Filter franchises based on search term
  const filteredFranchises = franchises.filter(franchise =>
    franchise.franchiseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    franchise.managerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    franchise.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // State for controlling AddPartnerModal (franchise) and AddBDEModal
  const [isAddPartnerModalOpen, setIsAddPartnerModalOpen] = useState(false);
  const [isAddBDEModalOpen, setIsAddBDEModalOpen] = useState(false);

  // Handler for BDE creation (stub for now)
  const handleAddBDE = async (data: any) => {
    try {
      await createBDE({
        name: data.employeeName,
        email: data.email,
        phone: data.phoneNumber,
        franchiseId: data.franchiseId,
        password: data.password,
      });
      setIsAddBDEModalOpen(false);
      toast({
        title: 'Success',
        description: 'BDE added successfully!'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to add BDE'
      });
      console.error('Error adding BDE:', error);
    }
  };


  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logo */}
      <div className="px-4 py-3 flex justify-between items-center border-b bg-white">
        <img src={zyncoLogo} alt="Zynco Logo" className="h-8" />
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="bg-[#7C3AED] hover:bg-[#7C3AED]/90 text-white"
            onClick={() => setIsAddBDEModalOpen(true)}
          >
            Add a new BDE
          </Button>
          <Button
            onClick={() => setIsAddPartnerModalOpen(true)}
            className="bg-[#FF5A1F] hover:bg-[#FF5A1F]/90 text-white flex items-center"
          >
            <Clock className="mr-2 h-4 w-4" />
            Add a new Franchise
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search Partner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full bg-white border-gray-200"
          />
        </div>
      </div>

      {/* Franchise Cards */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFranchises.map((franchise) => (
            <div
              key={franchise.franchiseId}
              className="bg-white rounded-lg p-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
  <div className="flex items-center gap-2">
    <MapPin className="h-6 w-6 text-gray-700" />
    <span className="text-xl font-bold text-gray-900">{franchise.location}</span>
  </div>
  <span className="text-gray-400 text-sm">franchise id : #{franchise.franchiseId}</span>
</div>
                
                <div className="flex items-center gap-2 mt-2 ml-1">
  <User className="h-5 w-5 text-gray-500" />
  <span className="text-gray-700 text-base">{franchise.managerName}</span>
</div>
<div className="flex items-center gap-2 mt-1 ml-1">
  <Warehouse className="h-5 w-5 text-gray-500" />
  <span className="text-gray-700 text-base">{franchise.franchiseName}</span>
</div>

                <button
                  onClick={() => handleFranchiseClick(franchise.franchiseId)}
                  className="w-full bg-[#7C3AED] text-white py-4 rounded-md hover:bg-[#7C3AED]/90 flex items-center justify-center mt-2"
                >
                  <span>Manage here</span>
                  <span className="ml-2 text-lg leading-none">›</span>
                </button>
              </div>
            </div>
          ))}
          {filteredFranchises.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              No franchises found
            </div>
          )}
        </div>
      )}

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="max-w-2xl w-full mx-4">
            <AddPartnerModal
              onClose={handleCloseModal}
              onSuccess={handleFranchiseCreated}
            />
          </div>
        </div>
      )}
      {/* AddBDEModal overlay */}
      <AddBDEModal
        isOpen={isAddBDEModalOpen}
        onClose={() => setIsAddBDEModalOpen(false)}
        onSubmit={handleAddBDE}
        franchises={franchises}
      />
      {/* AddPartnerModal overlay */}
      {isAddPartnerModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-0">
            <FranchiseForm
              onClose={() => setIsAddPartnerModalOpen(false)}
              onSuccess={() => setIsAddPartnerModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FranchiseSelect;
