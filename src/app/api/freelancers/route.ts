import dbConnect from "@/lib/dbConnect";
import { FreelancerModel } from "@/model/Freelancer";

export async function GET() {
  await dbConnect();
  try {
    const freelancers = await FreelancerModel.find({}).populate("resume");
    return new Response(JSON.stringify(freelancers), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Error fetching freelancers" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
