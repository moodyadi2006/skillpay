import Razorpay from "razorpay";
import ShortUniqueId from "short-unique-id";
import { NextRequest, NextResponse } from "next/server";

type OrderRequestBody = {
  amount: number;
};

const uid = new ShortUniqueId({ length: 10 });

export async function POST(request: NextRequest) {
  try {
    const { amount }: OrderRequestBody = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid amount" },
        { status: 400 }
      );
    }

    const razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_PUBLIC_KEY as string,
      key_secret: process.env.RAZORPAY_PRIVATE_KEY as string,
    });

    const order = await razorpayInstance.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${uid.rnd()}`,
    });

    return NextResponse.json(
      { success: true, message: order },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}