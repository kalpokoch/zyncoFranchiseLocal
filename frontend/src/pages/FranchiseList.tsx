import { useEffect, useState } from "react";
import { getFranchises } from "../api/franchiseApi";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

// Define the Franchise interface for the response
interface Franchise {
  franchiseId: string;
  franchiseName: string;
  managerName: string;
  email: string;
  phoneNumber: string;
  location: string;
}

const FranchiseList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFranchises() {
      try {
        const response = await getFranchises();
        setFranchises(response.data.franchises || []);
        toast({
          title: "Success",
          description: "Franchises loaded successfully",
        });
      } catch (error) {
        console.error("Error fetching franchises", error);
        const axiosError = error as AxiosError<{ message: string }>;
        toast({
          variant: "destructive",
          title: "Error",
          description: axiosError.response?.data?.message || "Failed to load franchises",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchFranchises();
  }, [toast]);

  const handleCreateFranchise = () => {
    navigate('/franchise/create');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Franchise List</h2>
        <Button 
          onClick={handleCreateFranchise}
          className="bg-[#5E17EB] hover:bg-[#5E17EB]/90 text-white"
        >
          Create New Franchise
        </Button>
      </div>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Franchise Name</th>
                <th className="border p-2">Manager</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Location</th>
              </tr>
            </thead>
            <tbody>
              {franchises.length > 0 ? (
                franchises.map((franchise) => (
                  <tr key={franchise.franchiseId} className="text-center">
                    <td className="border p-2">{franchise.franchiseName}</td>
                    <td className="border p-2">{franchise.managerName}</td>
                    <td className="border p-2">{franchise.email}</td>
                    <td className="border p-2">{franchise.phoneNumber}</td>
                    <td className="border p-2">{franchise.location}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="border p-2 text-center">
                    No franchises found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FranchiseList; 