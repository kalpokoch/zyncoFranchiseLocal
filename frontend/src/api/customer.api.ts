import axios from 'axios';

const API_URL = 'http://localhost:8888/Zync-Franc/api/v1/customers';

// Types
export interface Customer {
  _id?: string;
  franchiseId: string;
  customerName: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  lastPurchase?: string | Date;
  amountReceivable?: number;
  isActive?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface PaginatedResponse<T> {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: T[];
}

// Get all customers
export const getCustomers = async (
  franchiseId: string,
  page: number = 1,
  limit: number = 10,
  search: string = ''
): Promise<PaginatedResponse<Customer>> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      params: {
        franchiseId,
        page,
        limit,
        search,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

// Get single customer by ID
export const getCustomerById = async (id: string): Promise<{ success: boolean; data: Customer }> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching customer:', error);
    throw error;
  }
};

// Create new customer
export const createCustomer = async (customerData: Omit<Customer, '_id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; data: Customer; message: string }> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(API_URL, customerData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error creating customer:', error);
    throw error.response?.data?.message || 'Failed to create customer';
  }
};

// Update existing customer
export const updateCustomer = async (
  id: string,
  customerData: Partial<Omit<Customer, '_id' | 'franchiseId' | 'createdAt' | 'updatedAt'>>
): Promise<{ success: boolean; data: Customer; message: string }> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/${id}`, customerData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error updating customer:', error);
    throw error.response?.data?.message || 'Failed to update customer';
  }
};

// Delete customer (soft delete)
export const deleteCustomer = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error deleting customer:', error);
    throw error.response?.data?.message || 'Failed to delete customer';
  }
};

// Get customer suggestions for search/autocomplete
export const getCustomerSuggestions = async (franchiseId: string, query: string): Promise<Customer[]> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      params: {
        franchiseId,
        search: query,
        limit: 5, // Limit suggestions to 5
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching customer suggestions:', error);
    return [];
  }
};
