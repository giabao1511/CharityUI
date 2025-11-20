"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import {
  checkPayment,
  isPaymentSuccessful,
  formatVND,
  type PaymentCheckParams,
} from "@/lib/services/payment.service";
import { Heading, BodyText } from "@/components/ui/typography";
import Link from "next/link";

export default function CheckPaymentPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function verifyPayment() {
      try {
        // Extract all VNPay parameters from URL
        const params: PaymentCheckParams = {
          vnp_Amount: searchParams.get("vnp_Amount") || "",
          vnp_BankCode: searchParams.get("vnp_BankCode") || "",
          vnp_BankTranNo: searchParams.get("vnp_BankTranNo") || "",
          vnp_CardType: searchParams.get("vnp_CardType") || "",
          vnp_OrderInfo: searchParams.get("vnp_OrderInfo") || "",
          vnp_PayDate: searchParams.get("vnp_PayDate") || "",
          vnp_ResponseCode: searchParams.get("vnp_ResponseCode") || "",
          vnp_TmnCode: searchParams.get("vnp_TmnCode") || "",
          vnp_TransactionNo: searchParams.get("vnp_TransactionNo") || "",
          vnp_TransactionStatus:
            searchParams.get("vnp_TransactionStatus") || "",
          vnp_TxnRef: searchParams.get("vnp_TxnRef") || "",
          vnp_SecureHash: searchParams.get("vnp_SecureHash") || "",
        };

        // Check if we have the necessary parameters
        // if (!params.vnp_ResponseCode || !params.vnp_TxnRef) {
        //   throw new Error("Missing payment parameters");
        // }

        // Call backend to verify payment
        const response = await checkPayment(params);
        setPaymentData(response);

        console.log(response);
      } catch (err) {
        console.error("Payment verification error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to verify payment"
        );
      } finally {
        setLoading(false);
      }
    }

    verifyPayment();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="container py-12 md:py-16">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-12 pb-12">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <Heading level={2}>Verifying Payment...</Heading>
              <BodyText muted>
                Please wait while we confirm your transaction
              </BodyText>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !paymentData) {
    return (
      <div className="container py-12 md:py-16">
        <Card className="max-w-2xl mx-auto border-red-200 dark:border-red-800">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <XCircle className="h-16 w-16 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-2xl">
              Payment Verification Failed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <BodyText muted>
                {error ||
                  "Unable to verify your payment. Please contact support if you believe this is an error."}
              </BodyText>
            </div>
            <div className="flex gap-3 justify-center">
              <Link href="/">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const success = isPaymentSuccessful(paymentData.data.vnp_ResponseCode);
  const amount = parseInt(paymentData.data?.vnp_Amount) / 100; // VNPay returns amount in smallest unit

  return (
    <div className="container py-12 md:py-16">
      <Card
        className={`max-w-2xl mx-auto ${
          success
            ? "border-green-200 dark:border-green-800"
            : "border-red-200 dark:border-red-800"
        }`}
      >
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {success ? (
              <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400" />
            ) : (
              <XCircle className="h-16 w-16 text-red-600 dark:text-red-400" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {success ? "Payment Successful!" : "Payment Failed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <BodyText className="mb-2">{paymentData.message}</BodyText>
            {success && (
              <BodyText muted>
                Thank you for your generous donation! Your contribution will
                make a real difference.
              </BodyText>
            )}
          </div>

          <div className="bg-muted/50 rounded-lg p-6 space-y-3">
            <div className="flex justify-between items-center">
              <BodyText muted>Transaction ID:</BodyText>
              <BodyText weight="semibold">
                {paymentData.data.vnp_TxnRef}
              </BodyText>
            </div>
            <div className="flex justify-between items-center">
              <BodyText muted>Amount:</BodyText>
              <BodyText weight="semibold" className="text-lg">
                {formatVND(amount)}
              </BodyText>
            </div>
            <div className="flex justify-between items-center">
              <BodyText muted>Bank:</BodyText>
              <BodyText weight="semibold">
                {paymentData.data.vnp_BankCode} ({paymentData.data.vnp_CardType})
              </BodyText>
            </div>
            <div className="flex justify-between items-center">
              <BodyText muted>Transaction No:</BodyText>
              <BodyText weight="semibold">
                {paymentData.data.vnp_TransactionNo}
              </BodyText>
            </div>
            <div className="flex justify-between items-center">
              <BodyText muted>Message:</BodyText>
              <BodyText weight="semibold">
                {paymentData.data.vnp_OrderInfo}
              </BodyText>
            </div>
            <div className="flex justify-between items-center">
              <BodyText muted>Date:</BodyText>
              <BodyText weight="semibold">
                {paymentData.data?.vnp_PayDate.replace(
                  /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
                  "$1-$2-$3 $4:$5:$6"
                )}
              </BodyText>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <Link href="/campaigns">
              <Button>Explore More Campaigns</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
