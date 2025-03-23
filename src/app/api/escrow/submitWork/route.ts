import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import EscrowModel from "@/model/Escrow";
import { JobModel } from "@/model/Employer";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const formData = await request.formData();
    const description = formData.get("description") as string;
    const githubRepoLink = formData.get("githubRepoLink") as string;
    const modifications = formData.get("modifications") as string;
    const videoDemoLink = formData.get("videoDemoLink") as string;
    const file = formData.get("uploadImage") as File | null;
    const milestone = formData.get("milestone") as string;

    if (
      !description ||
      !githubRepoLink ||
      !modifications ||
      !videoDemoLink ||
      !file ||
      !milestone
    ) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    const mileStone = JSON.parse(milestone); // Parse milestone object
    const jobId = mileStone.freelancer.jobId
    // ✅ Update the specific milestone inside mileStones[] to "in-review"
    const job = await JobModel.findById(jobId);

    if (!job) {
      return NextResponse.json(
        { success: false, error: "Job not found" },
        { status: 404 }
      );
    }

    // ✅ Loop over mileStones[] and update the specific milestone
    job.mileStones = job.mileStones.map((m) =>
      m._id.toString() === mileStone._id ? { ...m, status: "in-review" } : m
    );

    // ✅ Save the updated job
    await job.save();

    const uploadImageFile = {
      size: file.size,
      type: file.type,
      name: file.name,
      lastModified: file.lastModified,
    };

    const escrowModel = await EscrowModel.create({
      description,
      githubRepoLink,
      modifications,
      videoDemoLink,
      uploadImageFile,
      jobId
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Work submitted successfully and milestone updated to 'in-review'",
        data: escrowModel,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting work:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
