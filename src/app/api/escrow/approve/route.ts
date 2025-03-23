import dbConnect from "@/lib/dbConnect";
import EscrowModel from "@/model/Escrow";

export async function PATCH(request: Request) {
  await dbConnect();
  try {
    const { reviewId } = await request.json();
    const escrow = await EscrowModel.findById(reviewId).populate("jobId");
    const freelancerId =
      escrow?.jobId?.mileStones?.[0]?.freelancer?._id || null;

    if (!escrow) {
      return Response.json({ message: "Escrow not found" }, { status: 404 });
    }

    let totalAmount = 0;

    // Ensure jobId exists and contains milestones
    if (escrow.jobId && escrow.jobId.mileStones) {
      escrow.jobId.mileStones = escrow.jobId.mileStones.map((milestone) => {
        if (milestone.status === "in-review") {
          milestone.status = "completed"; // Updating status
        }

        if (milestone.status === "completed" && !milestone.paid) {
          totalAmount += milestone.amount; // Sum up unpaid completed milestones
        }

        return milestone;
      });

      await escrow.jobId.save(); // Save the updated job document
    }

    await EscrowModel.findByIdAndDelete(reviewId);

    return Response.json(
      {
        message: "Milestones updated and Escrow deleted successfully",
        data: { totalAmount, freelancerId },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error approving work:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
