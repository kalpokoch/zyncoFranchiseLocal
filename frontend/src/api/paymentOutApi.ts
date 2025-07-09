import axios from 'axios';
const API_URL = 'http://localhost:8888/Zync-Franc/api/v1';

export interface PaymentOutData {
  franchiseId: string;
  invoiceNumber: string;
  supplier: string;
  supplierName: string;
  billingAddress?: string;
  paymentDate: string; // ISO string
  amountPaid: number;
}

export interface PaymentOutResponse {
  success: boolean;
  message: string;
  data?: any;
}

export async function getPaymentOuts(franchiseId: string, token?: string): Promise<PaymentOutResponse> {
  try {
    const response = await axios.get(`${API_URL}/payment-out?franchiseId=${franchiseId}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    }
    throw error;
  }
}

export async function updatePaymentOut(id: string, paymentOut: Partial<PaymentOutData>, token?: string): Promise<PaymentOutResponse> {
  try {
    const response = await axios.put(`${API_URL}/payment-out/${id}`, paymentOut, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    }
    throw error;
  }
}

export async function createPaymentOut(paymentOut: PaymentOutData, token?: string): Promise<PaymentOutResponse> {
  try {
    const response = await axios.post(`${API_URL}/payment-out`, paymentOut, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    }
    throw error;
  }
}
