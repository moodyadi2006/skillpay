import dbConnect from "@/lib/dbConnect";
import { JobModel } from "@/model/Employer";
import { FreelancerModel } from "@/model/Freelancer";

export async function GET(request: Request) {
  await dbConnect();
  try {
    // Extract query parameters from the URL
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

    // Find the freelancer by email
    const freelancer = await FreelancerModel.findOne({ email }).populate(
      "resume"
    );

    if (!freelancer) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "No Freelancer found",
          status: 404,
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get the resume ID to compare with milestone freelancer IDs
    const resumeId = freelancer.resume._id;
    // Find jobs where the freelancer's resume ID matches a milestone's freelancer ID
    const jobs = await JobModel.find({
      "mileStones.freelancer._id": resumeId.toString()
    });

    if (jobs.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Freelancer is not part of any job milestones",
          status: 403,
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Fetched jobs associated with freelancer",
        status: 200,
        data: jobs,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching jobs:", error);
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