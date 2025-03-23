import dbConnect from "@/lib/dbConnect";
import EscrowModel from "@/model/Escrow";
import { JobModel } from "@/model/Employer"; // Ensure JobModel is imported if used

export async function PATCH(request) {
  await dbConnect();
  try {
    const body = await request.json();

    const { reviewId } = body;
    if (!reviewId) {
      return new Response(JSON.stringify({ error: "reviewId is required" }), {
        status: 400,
      });
    }

    // Find the escrow document
    const escrow = await EscrowModel.findById(reviewId).populate("jobId");

    if (!escrow) {
      return new Response(JSON.stringify({ error: "Escrow not found" }), {
        status: 404,
      });
    }

    // Ensure jobId exists
    if (!escrow.jobId) {
      return new Response(JSON.stringify({ error: "Job not found" }), {
        status: 404,
      });
    }

    // Fetch the actual job document to make it editable
    const job = await JobModel.findById(escrow.jobId._id);
    if (!job) {
      return new Response(JSON.stringify({ error: "Job details not found" }), {
        status: 404,
      });
    }

    let totalAmount = 0;
    let freelancerId = null;

    // Update milestones
    job.mileStones = job.mileStones.map((milestone) => {
      if (milestone.status === "in-review") {
        milestone.status = "completed";
      }
      if (milestone.status === "completed" && !milestone.paid) {
        totalAmount += milestone.amount;
      }
      return milestone;
    });

    // Get freelancer ID from the first milestone if available
    if (job.mileStones.length > 0 && job.mileStones[0].freelancer) {
      freelancerId = job.mileStones[0].freelancer._id;
    }

    // Save the updated job document
    await job.save();

    // Delete the escrow document
    await EscrowModel.findByIdAndDelete(reviewId);

    return new Response(
      JSON.stringify({
        message: "Milestones updated and Escrow deleted successfully",
        data: { totalAmount, freelancerId },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error approving work:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
