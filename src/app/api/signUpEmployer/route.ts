import dbConnect from "@/lib/dbConnect";
import { EmployerModel } from "@/model/Employer";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmails";
import { FreelancerModel } from "@/model/Freelancer";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { fullName, email, password } = await request.json();
    const existingEmployerVerifiedByEmail =
      (await EmployerModel.findOne({
        email,
        isVerified: true,
      })) ||
      (await FreelancerModel.findOne({
        email,
        isVerified: true,
      }));
    if (existingEmployerVerifiedByEmail) {
      return Response.json({
        success: false,
        message: "Email already exists",
        status: 400,
      });
    }
    const existingEmployerByEmail = await EmployerModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (existingEmployerByEmail) {
      if (existingEmployerByEmail.isVerified) {
        return Response.json({
          success: false,
          message: "Employer Already exist with this email",
          status: 401,
        });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);
        existingEmployerByEmail.password = hashedPassword;
        existingEmployerByEmail.verifyCode = verifyCode;
        existingEmployerByEmail.verifyCodeExpiry = expiryDate;
        await existingEmployerByEmail.save();
      }
    } else {
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);
        const newEmployer = await EmployerModel.create({
          fullName,
          email,
          password: hashedPassword,
          verifyCode,
          verifyCodeExpiry: expiryDate,
          isVerified: false,
        });
        await newEmployer.save();
      } catch (error: unknown) {
        console.error("Error saving Employer:", error);
        return Response.json({
          success: false,
          message: error,
          status: 410,
        });
      }
    }
    const emailResponse = await sendVerificationEmail(
      email,
      fullName,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json({
        success: false,
        message: emailResponse.message,
        status: 402,
      });
    }
    return Response.json({
      success: true,
      message: "Employer registered successfully.. Please verify your email",
      status: 200,
    });
  } catch (error: unknown) {
    console.error("Error saving Employer: ", error);
    return Response.json({
      success: false,
      message: error,
      status: 500,
    });
  }
}
