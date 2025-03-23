import dbConnect from "@/lib/dbConnect";
import { EmployerModel } from "@/model/Employer";
import EscrowModel from "@/model/Escrow";
import { FreelancerModel } from "@/model/Freelancer";

export async function PATCH(request: Request) {
  await dbConnect();
  try {
    const { reviewId, feedback } = await request.json();
    const escrow = await EscrowModel.findById(reviewId).populate("jobId");
    if (!escrow) {
      return Response.json({ message: "Escrow not found" }, { status: 404 });
    }

    const resumeId = escrow?.jobId?.mileStones?.[0]?.freelancer?._id || null;
    if (!resumeId) {
      return Response.json(
        { message: "Freelancer resume not found" },
        { status: 404 }
      );
    }

    const employerId = escrow?.jobId?.postedBy;
    const title = escrow?.jobId?.title;

    const employer = await EmployerModel.findById(employerId);
    if (!employer) {
      return Response.json({ message: "Employer not found" }, { status: 404 });
    }

    // Update the freelancer by pushing the feedback to the feedbacks array
    const freelancer = await FreelancerModel.findOneAndUpdate(
      { resume: resumeId },
      {
        $push: {
          feedbacks: {
            sender: employer.fullName, // Changed from sender to senderEmail to match schema
            feedback,
            title,
            time: new Date(), // Using new Date() instead of Date.now() for proper Date object
          },
        },
      },
      { new: true } // Return the updated document
    );

    if (!freelancer) {
      return Response.json(
        { message: "Freelancer not found" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        message: "Feedback added successfully",
        data: { freelancer: freelancer.feedbacks },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding feedback:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
