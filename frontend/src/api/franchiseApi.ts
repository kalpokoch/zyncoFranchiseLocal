import axios from "axios";

// Base API URL
const API_URL = "http://localhost:8888/Zync-Franc/api/v1";

// Define the FranchiseData interface
export interface FranchiseData {
  franchiseName: string;
  managerName: string;
  email: string;
  phoneNumber: string;
  totalInvestmentAmount: string | number;
  location: string;
  investmentDate: string;
  password: string;
}

// Get JWT Token from local storage (if using authentication)
const getAuthToken = () => localStorage.getItem("token") || localStorage.getItem("accessToken");

// Create an Axios instance with authorization
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add Authorization token dynamically
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API function to add a new franchise
export const createFranchise = async (data: FranchiseData) => {
  return apiClient.post("/franchises", data);
};

// API function to fetch all franchises
export const getFranchises = async () => {
  return apiClient.get("/franchises");
}; 