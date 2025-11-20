/**
 * Payment Service
 * Handles VNPay payment integration for campaign donations
 */

import { apiClient, API_ENDPOINTS } from "@/lib/api-config";

export interface CreatePaymentRequest {
  amount: number;
  campaignId: number;
  email?: string;
  phoneNumber?: string;
  message?: string;
  isAnonymous?: boolean;
}

export interface PaymentCheckParams {
  vnp_Amount: string;
  vnp_BankCode: string;
  vnp_BankTranNo: string;
  vnp_CardType: string;
  vnp_OrderInfo: string;
  vnp_PayDate: string;
  vnp_ResponseCode: string;
  vnp_TmnCode: string;
  vnp_TransactionNo: string;
  vnp_TransactionStatus: string;
  vnp_TxnRef: string;
  vnp_SecureHash: string;
}

export interface PaymentCheckResponse {
  data: {
    message: string;
    data: {
      vnp_Amount: string;
      vnp_BankCode: string;
      vnp_BankTranNo: string;
      vnp_CardType: string;
      vnp_OrderInfo: string;
      vnp_PayDate: string;
      vnp_ResponseCode: string;
      vnp_TmnCode: string;
      vnp_TransactionNo: string;
      vnp_TransactionStatus: string;
      vnp_TxnRef: string;
    };
  };
}

/**
 * Create a payment and get VNPay URL
 * @param paymentData - Payment request data
 * @returns Payment URL to redirect user to
 */
export async function createPayment(
  paymentData: CreatePaymentRequest
): Promise<string> {
  try {
    const result = await apiClient<string>(
      API_ENDPOINTS.PAYMENTS.CREATE,
      {
        method: "POST",
        body: JSON.stringify(paymentData),
      }
    );

    if (result.error) {
      throw new Error(result.error.message || "Failed to create payment");
    }

    console.log(result.data)

    if (!result.data) {
      throw new Error("No payment URL received");
    }

    return result.data;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
}

/**
 * Check payment status after VNPay callback
 * @param params - Query parameters from VNPay redirect
 * @returns Payment status information
 */
export async function checkPayment(
  params: PaymentCheckParams
): Promise<PaymentCheckResponse> {
  try {
    // Build query string from params
    const queryParams = new URLSearchParams(params as any);
    const url = `${API_ENDPOINTS.PAYMENTS.CHECK}?${queryParams.toString()}`;

    const result = await apiClient<PaymentCheckResponse>(url, {
      method: "GET",
    });

    if (result.error) {
      throw new Error(result.error.message || "Failed to check payment");
    }

    if (!result.data) {
      throw new Error("No payment data received");
    }

    return result.data;
  } catch (error) {
    console.error("Error checking payment:", error);
    throw error;
  }
}

/**
 * Format VND currency
 */
export function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

/**
 * Check if payment was successful based on response code
 * VNPay response codes:
 * - 00: Success
 * - Others: Failed
 */
export function isPaymentSuccessful(responseCode: string): boolean {
  return responseCode === "00";
}
