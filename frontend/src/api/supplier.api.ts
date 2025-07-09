import axios from 'axios';

const API_URL = 'http://localhost:8888/Zync-Franc/api/v1/suppliers';

// Types
export interface Supplier {
  _id?: string;
  franchiseId: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  gstin?: string;
  amountPayable?: number;
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

// Paginated supplier response type
export interface PaginatedSupplierResponse {
  success: boolean;
  count: number;
  data: Supplier[];
}

// Get supplier suggestions for search/autocomplete
export const getSupplierSuggestions = async (franchiseId: string, query: string): Promise<Supplier[]> => {
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
    console.error('Error fetching supplier suggestions:', error);
    return [];
  }
};

// Get all suppliers
// Returns either Supplier[] (legacy) or PaginatedSupplierResponse (new)
export const getSuppliers = async (
  franchiseId: string,
  page: number = 1,
  limit: number = 10,
  search: string = ''
): Promise<Supplier[] | PaginatedSupplierResponse> => {
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
    console.error('Error fetching suppliers:', error);
    throw error;
  }
};

// Get single supplier by ID
export const getSupplierById = async (id: string): Promise<Supplier> => {
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
    console.error('Error fetching supplier:', error);
    throw error;
  }
};

// Create new supplier
export const createSupplier = async (supplierData: Omit<Supplier, '_id' | 'createdAt' | 'updatedAt'> & { franchiseId: string }): Promise<Supplier> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(API_URL, supplierData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error creating supplier:', error);
    throw error.response?.data?.message || 'Failed to create supplier';
  }
};

// Update existing supplier
export const updateSupplier = async (
  id: string,
  supplierData: Partial<Omit<Supplier, '_id' | 'createdAt' | 'updatedAt'>>
): Promise<Supplier> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/${id}`, supplierData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error updating supplier:', error);
    throw error.response?.data?.message || 'Failed to update supplier';
  }
};

// Delete supplier
export const deleteSupplier = async (id: string): Promise<{ message: string }> => {
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
    console.error('Error deleting supplier:', error);
    throw error.response?.data?.message || 'Failed to delete supplier';
  }
};
