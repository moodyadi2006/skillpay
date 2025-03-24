import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "../types/ApiResponse";
import transporter from '@/lib/nodemailer';

export async function sendVerificationEmail(
  email: string,
  fullName: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await transporter.sendMail({
      from: '"Skill Pay" <jude.moen@ethereal.email>', 
      to: [email],
      subject: "SkillPay | Veriy Code", // Subject line
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
