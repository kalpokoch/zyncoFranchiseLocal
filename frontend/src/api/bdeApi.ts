import axios from "axios";

const API_URL = "http://localhost:8888/Zync-Franc/api/v1";

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

// Define the BDE data interface
export interface BDEData {
  name: string;
  email: string;
  phone: string;
  franchiseId: string;
  password: string;
}

// API function to add a new BDE
export const createBDE = async (data: BDEData) => {
  // Debug: log outgoing payload
  if (!data.name || !data.email || !data.phone || !data.franchiseId || !data.password) {
    console.error('Missing required BDE fields:', data);
    throw new Error('Missing required BDE fields');
  }
  console.log('Sending BDE payload:', data);
  return apiClient.post("/bdes", data);
};

// API function to fetch all BDEs
export const getBDEs = async () => {
  return apiClient.get("/bdes");
};
