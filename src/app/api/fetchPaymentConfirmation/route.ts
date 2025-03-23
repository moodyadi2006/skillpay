import dbConnect from "@/lib/dbConnect";
import { EmployerModel } from "@/model/Employer";
import EscrowModel from "@/model/Escrow";
import { FreelancerModel } from "@/model/Freelancer";

export async function GET(request: Request) {
  await dbConnect();
  try {
    // Extract query parameters from the URL
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    console.log(email);

    if (!email) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Email parameter is required",
          status: 400,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const user =
      (await EmployerModel.findOne({ email })) ||
      (await FreelancerModel.findOne({ email }));
    
    console.log(user);

    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User not found",
          status: 404,
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );

    }



    // const jobIds = user.jobIds || [];
    // if (!jobIds.length) {
    //   return new Response(
    //     JSON.stringify({
    //       success: false,
    //       message: "No job IDs found for user",
    //       status: 404,
    //     }),
    //     { status: 404, headers: { "Content-Type": "application/json" } }
    //   );
    // }

    const escrows = await EscrowModel.find({});
    // if (!escrows.length) {
    //   return new Response(
    //     JSON.stringify({
    //       success: false,
    //       message: "No records found",
    //       status: 404,
    //     }),
    //     { status: 404, headers: { "Content-Type": "application/json" } }
    //   );
    // }

    // return new Response(
    //   JSON.stringify({
    //     success: true,
    //     message: "Fetched Escrows",
    //     status: 200,
    //     data: escrows,
    //   }),
    //   { status: 200, headers: { "Content-Type": "application/json" } }
    // );
  } catch (error) {
    console.error("Error fetching escrows:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal Server Error",
        status: 500,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
