import dbConnect from "@/lib/dbConnect";
import { ResumeModel } from "@/model/Freelancer";

export async function GET(request: Request) {
  await dbConnect();
  try {
    // Extract query parameters from the URL
    const url = new URL(request.url);
    const resumeIdsParam = url.searchParams.get("resume");

    if (!resumeIdsParam) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Resume IDs are required",
          status: 400,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Convert comma-separated string into an array of IDs
    const resumeIds = resumeIdsParam.split(",").map((id) => id.trim());

    // Fetch resumes matching the provided IDs
    const resumes = await ResumeModel.find({ _id: { $in: resumeIds } });

    if (!resumes.length) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "No resumes found",
          status: 404,
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Fetched Freelancers' Resumes",
        status: 200,
        data: resumes,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching resumes:", error);
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
