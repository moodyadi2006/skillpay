import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

type GenerateSignatureFunction = (
  razorpayOrderId: string,
  razorpayPaymentId: string
) => string;

const generatedSignature: GenerateSignatureFunction = (
  razorpayOrderId,
  razorpayPaymentId
) => {
  const keySecret = process.env.RAZORPAY_PRIVATE_KEY;
  if (!keySecret) {
    throw new Error("RAZORPAY_PRIVATE_KEY is not defined");
  }

  return crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");
};

export async function POST(request: NextRequest) {
  try {
    const { razorpayPaymentId, orderId, razorpaySignature } = await request.json();

    if (!razorpayPaymentId || !orderId || !razorpaySignature) {
      return NextResponse.json(
        { message: "Missing required fields", isOk: false },
        { status: 400 }
      );
    }

    const signature = generatedSignature(orderId, razorpayPaymentId);
    if (signature !== razorpaySignature) {
      return NextResponse.json(
        { message: "Payment verification failed", isOk: false },
        { status: 400 }
      );
    }

    // Probably some database calls here to update order or add premium status to user
    return NextResponse.json(
      { message: "Payment verified successfully", isOk: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message, isOk: false },
      { status: 500 }
    );
  }
}
