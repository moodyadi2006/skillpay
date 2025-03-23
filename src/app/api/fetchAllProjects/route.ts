import dbConnect from "@/lib/dbConnect";
import { JobModel } from "@/model/Employer";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();
  try {
    const response = await JobModel.find({});
    return new Response(
      JSON.stringify({
        success: true,
        message: "Fetched All Projects",
        status: 200,
        data: response,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching Mile Stones:", error);
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
