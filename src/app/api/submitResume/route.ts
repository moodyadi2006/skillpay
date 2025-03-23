import { JobModel } from "@/model/Employer";
import { FreelancerModel, ResumeModel } from "@/model/Freelancer";

export async function POST(request: Request) {
  try {
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Invalid JSON format in request body" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { data, userId } = requestBody;

    if (!data || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing data or userId in request body" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const {
      fullName,
      email,
      phoneNumber,
      careerObjective,
      education,
      workExperience,
      extraCurricularActivities,
      trainings,
      projects,
      skills,
      workSamples,
      additionalDetails,
      jobId,
    } = data;

    if (!fullName || !email || !jobId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: fullName, email, jobId" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    let newResume;
    try {
      newResume = await ResumeModel.create({
        fullName,
        email,
        phoneNumber,
        careerObjective,
        education,
        workExperience,
        extraCurricularActivities,
        trainings,
        projects,
        skills,
        workSamples,
        additionalDetails,
        jobId,
      });
    } catch (error) {
      console.error("Error creating resume:", error);
      return new Response(
        JSON.stringify({ error: "Failed to create resume" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    let freelancer;
    try {
      freelancer = await FreelancerModel.findByIdAndUpdate(userId, {
        resume: newResume._id,  
      });
      
      if (!freelancer) {
        return new Response(
          JSON.stringify({ error: "Freelancer not found" }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    } catch (error) {
      console.error("Error updating freelancer:", error);
      return new Response(
        JSON.stringify({ error: "Failed to update freelancer profile" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    let freelancersResume;
    try {
      freelancersResume = await JobModel.findByIdAndUpdate(jobId,{
        $push: { freelancersResume : newResume._id }, // Assuming FreelancerModel has a "resumes" array field
      });
      
      if (!freelancersResume) {
        return new Response(
          JSON.stringify({ error: "Freelancer Resume not found" }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    } catch (error) {
      console.error("Error updating freelancer Resume in Job Post:", error);
      return new Response(
        JSON.stringify({ error: "Failed to update Job Post" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Resume submitted successfully",
        data: newResume,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Unexpected server error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
