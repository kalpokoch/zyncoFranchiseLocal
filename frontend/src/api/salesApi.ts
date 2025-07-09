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

// Define the Sale data interface (based on sale.model.js)
export interface SaleProduct {
  productName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  gst: number;
  priceWithTax: number;
  amount: number;
}

export interface SaleData {
  _id?: string;
  franchiseId: string;
  invoiceNumber: string;
  customer: string; // Reference to Customer ObjectId
  billingAddress?: string;
  billingDate: string | Date;
  salesItems: SaleProduct[];
  totalQuantity: number;
  totalAmount: number;
  paymentStatus?: 'Paid' | 'Pending';
  createdAt?: Date;
}

// Helper to get franchiseId from localStorage
function getFranchiseId() {
  return localStorage.getItem('franchiseId') || '';
}


// Create a new Sale
export const createSale = async (data: SaleData) => {
  const franchiseId = data.franchiseId || getFranchiseId();
  if (!franchiseId || !data.invoiceNumber || !data.customer || !data.salesItems || data.salesItems.length === 0) {
    throw new Error('Missing required Sale fields');
  }
  try {
    console.log('Payload to backend:', { ...data, franchiseId });
    return await apiClient.post("/sales", { ...data, franchiseId });
  } catch (error: any) {
    console.error('Backend error:', error?.response?.data || error.message);
    throw error;
  }
};

// Get all Sales by franchise
export const getSales = async (franchiseId: string) => {
  return apiClient.get(`/sales?franchiseId=${franchiseId}`);
};

// Get Sale by ID
export const getSaleById = async (id: string) => {
  return apiClient.get(`/sales/${id}`);
};

// Update Sale
export const updateSale = async (id: string, data: Partial<SaleData>) => {
  const franchiseId = data.franchiseId || getFranchiseId();
  return apiClient.put(`/sales/${id}`, { ...data, franchiseId });
};

// Delete Sale
export const deleteSale = async (id: string) => {
  return apiClient.delete(`/sales/${id}`);
};