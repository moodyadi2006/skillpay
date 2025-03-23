import dbConnect from "@/lib/dbConnect";
import EscrowModel from "@/model/Escrow";

export async function PATCH() {
  await dbConnect();
  try {
    const { reviewId } = await request.json();
    // Delete the escrow document after updating milestones
    await EscrowModel.findByIdAndDelete(reviewId);

    return Response.json(
      { message: "Milestones updated and Escrow deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error approving work:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
