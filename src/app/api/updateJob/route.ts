import dbConnect from "@/lib/dbConnect";
import { JobModel } from "@/model/Employer";

export async function PATCH(request: Request) {
  await dbConnect();

  try {
    const { resume } = await request.json();
    console.log(resume);
    const job = await JobModel.findById(resume.jobId);

    if (!job) {
      return new Response(
        JSON.stringify({ success: false, error: "Job not found" }),
        { status: 401 }
      );
    }

    console.log(job.mileStones, "   ", resume._id);

    // Update every milestone's freelancer with the given resume
    job.mileStones = job.mileStones.map((milestone) => ({
      ...milestone,
      freelancer: resume, // Directly replacing freelancer with resume
    }));

    // Remove the resume from freelancersResume where resume._id matches
    job.freelancersResume = job.freelancersResume.filter(
      (freelancerResume) => freelancerResume._id.toString() !== resume._id
    );

    // Save the updated job document
    await job.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Job Updated Successfully",
        data: job,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating job post:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
