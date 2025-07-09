import axios from "axios";

// Base API URL
const API_URL = "http://localhost:8888/Zync-Franc/api/v1";

// Define the FranchiseData interface
export interface ProductData {
  productId?: string;
  productName: string;
  category: string;
  base_unit: string;
  conversion_factor: Map<string, number> | { [key: string]: number };
  stock_quantity: number;
  total_stock?: Map<string, number> | { [key: string]: number } | string;
  unit_pricing?: Map<string, number> | { [key: string]: number };
  gst: string;
  price?: number;
  purchase_price?: number;
  selling_price?: number;
  expirationDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  franchiseId?: string;
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
export const addProduct = async (data: ProductData) => {
  try {
    const response = await apiClient.post("/products", data);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to add product');
    }
    throw new Error('An unexpected error occurred');
  }
};

// API function to fetch all franchises
export const getProducts = async () => {
  try {
    const response = await apiClient.get("/products");
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch products');
    }
    throw new Error('An unexpected error occurred');
  }
};