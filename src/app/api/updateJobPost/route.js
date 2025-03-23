import dbConnect from "@/lib/dbConnect";
import { JobModel } from "@/model/Employer";
import mongoose from "mongoose";

export async function POST(request) {
  await dbConnect();

  try {
    const formData = await request.formData();

    // Create job post with arrays
    // Extract milestones dynamically
    const mileStones = [];
    let index = 0;

    while (formData.has(`mileStones[${index}][task]`)) {
      const task = formData.get(`mileStones[${index}][task]`);
      // Only add milestones with non-empty tasks
      if (task && task.toString().trim() !== "") {
        mileStones.push({
          task: task.toString(),
          amount: Number(formData.get(`mileStones[${index}][amount]`) || 0),
          workCompletion: Number(formData.get(`mileStones[${index}][workCompletion]`) || 0),
        });
      }
      index++;
    }

    // Add a check to ensure at least one valid milestone exists
    if (mileStones.length === 0) {
      throw new Error(
        "At least one milestone with a non-empty task is required"
      );
    }

    const jobPost = await JobModel.create({
      title: formData.get("title"),
      description: formData.get("description"),
      techStack: formData.getAll("techStack[]"),
      reqExperience: Number(formData.get("reqExperience")),
      employmentType: formData.get("employmentType"),
      salaryRange: {
        min: formData.get("salaryMin"),
        max: formData.get("salaryMax"),
      },
      location: formData.get("location"),
      isRemote: formData.get("isRemote") === "true",
      companyName: formData.get("companyName"),
      companyLogo: formData.get("companyLogo"),
      applicationDeadline: formData.get("applicationDeadline"),
      postedBy: new mongoose.Types.ObjectId(formData.get("postedBy")),
      postedAt: new Date(formData.get("postedAt") || Date.now()),
      mileStones: mileStones,
      responsibilities: formData.getAll("responsibilities[]"),
      requirements: formData.getAll("requirements[]"),
      perksAndBenefits: formData.getAll("perksAndBenefits[]"),
      applicationLink: formData.get("applicationLink"),
      status: formData.get("status"),
    });

    console.log(jobPost);
    return new Response(JSON.stringify({ success: true, jobPost }), {
      status: 201,
    });
  } catch (error) {
    console.error("Error creating job post:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
      }
    );
  }
}
