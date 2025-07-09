import axios from 'axios';

export interface PaymentInData {
  franchiseId: string;
  invoiceNumber: string;
  customerName: string;
  billingAddress?: string;
  billingDate: string; // ISO string
  amountReceived: number;
}

export interface PaymentInResponse {
  success: boolean;
  message: string;
  data?: any;
}

const API_URL = 'http://localhost:8888/Zync-Franc/api/v1';

export async function createPaymentIn(paymentIn: PaymentInData, token?: string): Promise<PaymentInResponse> {
  try {
    const response = await axios.post(`${API_URL}/payment-in`, paymentIn, {
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

export async function getPaymentIns(franchiseId: string, token?: string): Promise<PaymentInResponse> {
  try {
    const response = await axios.get(`${API_URL}/payment-in?franchiseId=${franchiseId}`, {
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

export async function updatePaymentIn(id: string, paymentIn: Partial<PaymentInData>, token?: string): Promise<PaymentInResponse> {
  try {
    const response = await axios.put(`${API_URL}/payment-in/${id}`, paymentIn, {
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

export async function getPaymentInByInvoice(invoiceNumber: string, token?: string): Promise<PaymentInResponse> {
  try {
    const response = await axios.get(`${API_URL}/payment-in/${invoiceNumber}`, {
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
