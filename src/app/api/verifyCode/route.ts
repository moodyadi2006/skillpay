import { NextResponse } from "next/server"; // Correct Next.js response handling
import dbConnect from "@/lib/dbConnect";
import { FreelancerModel } from "@/model/Freelancer";
import { EmployerModel } from "@/model/Employer";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json(); // Correctly parsing JSON
    const { email, verifyCode } = body;

    if (!email || !verifyCode) {
      return NextResponse.json(
        { success: false, message: "Email and verification code are required" },
        { status: 400 }
      );
    }

    const decodedEmail = decodeURIComponent(email);

    // Find user in either Freelancer or Employer model
    const existingUser =
      (await EmployerModel.findOne({ email: decodedEmail })) ||
      (await FreelancerModel.findOne({ email: decodedEmail }));

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    // Check if verification code is correct and not expired
    const isCodeValid = verifyCode === existingUser.verifyCode;
    const isCodeExpired = new Date(existingUser.verifyCodeExpiry).getTime() < Date.now();

    if (isCodeValid && !isCodeExpired) {
      existingUser.isVerified = true;
      await existingUser.save();

      return NextResponse.json(
        { success: true, message: "User verified successfully" },
        { status: 200 }
      );
    } else if (isCodeExpired) {
      return NextResponse.json(
        { success: false, message: "Verification code has expired, please request a new one" },
        { status: 402 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Verification code is invalid" },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error("Error verifying user:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
