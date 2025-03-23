import EscrowModel from "@/model/Escrow";
import { EmployerModel } from "@/model/Employer";
import { JobModel } from "@/model/Employer";
import dbConnect from "@/lib/dbConnect";

export async function PATCH(request) {
  await dbConnect();
  try {
    const { email, recipentId, amount, orderId } = await request.json();

    if (!email || !recipentId || !amount || !orderId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    // Find employer by email
    const employer = await EmployerModel.findOne({ email });
    if (!employer) {
      return new Response(JSON.stringify({ error: "Employer not found" }), {
        status: 404,
      });
    }

    const jobs = await JobModel.find({ postedBy: employer._id });

    if (!jobs.length) {
      return new Response(
        JSON.stringify({ error: "No jobs found for this employer" }),
        { status: 404 }
      );
    }

    // Update milestones for jobs where status is "completed"
    for (const job of jobs) {
      job.mileStones.forEach((mileStone) => {
        if (mileStone?.status === "completed") {
          mileStone.paid = true;
        }
      });

      await job.save(); // Save updated job
    }

    // Create new escrow entry
    const newEscrow = await EscrowModel.create({
      payments: [
        {
          senderEmail: email,
          receiverId: recipentId,
          amount,
          orderId,
        },
      ],
    });

    await newEscrow.save();

    // Update employer's payments array
    employer.payments.push({
      recipentId: recipentId,
      orderId,
      amount,
    });

    await employer.save();

    return new Response(
      JSON.stringify({
        message:
          "New escrow created successfully, milestones updated, and employer payments updated",
        escrow: newEscrow,
        employerPayments: employer.payments,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
