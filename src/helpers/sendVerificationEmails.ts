import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "../types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  fullName: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "SkillPay | Verification code",
      react: VerificationEmail({ fullName: fullName, otp: verifyCode }),
    });
    return {
      success: true,
      message: "Verification email sent successfully...",
    };
  } catch (error) {
    console.error("Error sending verification email", error);
    return { success: false, message: "Failed to send Verification email" };
  }
}
