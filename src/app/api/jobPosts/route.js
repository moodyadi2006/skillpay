import dbConnect from "@/lib/dbConnect";
import { EmployerModel, JobModel } from "@/model/Employer";
import mongoose from "mongoose";

export async function GET() {
  await dbConnect();
  try {
    // Extract email from query parameters
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    if (!email) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Email is required",
          status: 400,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const employer = await EmployerModel.findOne({ email });

    if (!employer) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Employer does not exist",
          status: 400,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const response = await JobModel.find({
      postedBy: new mongoose.Types.ObjectId(employer?._id),
    });
    return new Response(
      JSON.stringify({
        success: true,
        message: "Fetched Employer job posts",
        status: 200,
        data: response,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching employer jobs:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal Server Error",
        status: 500,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
