import dbConnect from "@/lib/dbConnect";
import { FreelancerModel } from "@/model/Freelancer";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmails";
import { EmployerModel } from "@/model/Employer";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { fullName, email, password } = await request.json();
    const existingFreelancerVerifiedByEmail =
      (await FreelancerModel.findOne({
        email,
        isVerified: true,
      })) ||
      (await EmployerModel.findOne({
        email,
        isVerified: true,
      }));
    if (existingFreelancerVerifiedByEmail) {
      return Response.json({
        success: false,
        message: "Email already exists",
        status: 400,
      });
    }

    const existingFreelancerByEmail = await FreelancerModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (existingFreelancerByEmail) {
      if (existingFreelancerByEmail.isVerified) {
        return Response.json({
          success: false,
          message: "Freelancer Already exist with this email",
          status: 401,
        });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);
        existingFreelancerByEmail.password = hashedPassword;
        existingFreelancerByEmail.verifyCode = verifyCode;
        existingFreelancerByEmail.verifyCodeExpiry = expiryDate;
        await existingFreelancerByEmail.save();
      }
    } else {
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);
        const newFreelancer = new FreelancerModel({
          fullName,
          email,
          password: hashedPassword,
          verifyCode,
          verifyCodeExpiry: expiryDate,
          isVerified: false,
        });
        await newFreelancer.save();
      } catch (error: unknown) {
        console.error("Error saving Freelancer:", error);
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
      message: "Freelancer registered successfully.. Please verify your email",
      status: 200,
    });
  } catch (error: unknown) {
    console.error("Error regsitering Freelancer", error);
    return Response.json({
      success: false,
      message: "Error registering Freelancer",
      status: 500,
    });
  }
}
