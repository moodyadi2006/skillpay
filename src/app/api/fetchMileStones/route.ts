import dbConnect from "@/lib/dbConnect";
import { JobModel } from "@/model/Employer";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();
  try {
      const url = new URL(request.url);
      const id = url.searchParams.get("id");
      if (!id) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Email is required",
            status: 400,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      const response = await JobModel.findOne({
        _id: new mongoose.Types.ObjectId(id),
      });
      return new Response(
        JSON.stringify({
          success: true,
          message: "Fetched Job Milestones",
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