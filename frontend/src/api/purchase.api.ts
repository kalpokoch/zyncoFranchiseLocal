import axios from 'axios';

const API_URL = "http://localhost:8888/Zync-Franc/api/v1"; // Changed port to 8888 to match product API

export interface Product {
    productName: string;
    quality: number;
    unit: string;
    pricePerUnit: number;
    gst: number;
    priceWithTax: number;
    amount: number;
}

export interface Purchase {
    _id?: string;
    invoiceNumber: string;
    supplierName: string;
    billingAddress: string;
    billingDate: Date;
    product: Product[];
    totalAmount: number;
    balance: number;
    paymentStatus: 'Paid' | 'Pending' | 'Not Paid';
}

interface ApiResponse {
    success: boolean;
    purchases: Purchase[];
    message?: string;
}

// Get JWT Token from local storage
const getAuthToken = () => localStorage.getItem("token") || localStorage.getItem("accessToken");

// Create an Axios instance with authorization
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true
});

// Add Authorization token dynamically
apiClient.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const purchaseApi = {
    getAllPurchases: async (franchiseId?: string): Promise<Purchase[]> => {
        try {
            const params = franchiseId ? { franchiseId } : {};
            const response = await apiClient.get('/purchases', {
                headers: {
                    'Accept': 'application/json'
                },
                params
            });
            console.log('Raw API Response:', response);
            
            if (typeof response.data === 'string') {
                console.error('Received HTML instead of JSON');
                return [];
            }
            
            return response.data?.purchases || response.data || [];
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('API Error:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status
                });
                throw new Error(error.response?.data?.message || 'Failed to fetch purchases');
            }
            throw error;
        }
    },

    getPurchaseById: async (id: string) => {
        const response = await apiClient.get(`/purchases/${id}`);
        return response.data;
    },

    createPurchase: async (purchase: Omit<Purchase, '_id'>) => {
        const response = await apiClient.post('/purchases', purchase);
        return response.data;
    },

    updatePurchase: async (id: string, purchase: Partial<Purchase>) => {
        const response = await apiClient.put(`/purchases/${id}`, purchase);
        return response.data;
    },

    deletePurchase: async (id: string) => {
        await apiClient.delete(`/purchases/${id}`);
    }
};
