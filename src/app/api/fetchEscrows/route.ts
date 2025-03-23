import dbConnect from "@/lib/dbConnect";
import EscrowModel from "@/model/Escrow";

export async function GET(request: Request) {
  await dbConnect();
  try {
    // Extract query parameters from the URL
    const url = new URL(request.url);
    const jobIdsParam = url.searchParams.get("jobIds");

    if (!jobIdsParam || jobIdsParam.trim() === "") {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Job IDs are required",
          status: 400,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Convert comma-separated string into an array of IDs
    const jobIds = jobIdsParam.split(",").map((id) => id.trim());
    // Fetch records where jobId matches any of the provided IDs
    const escrows = await EscrowModel.find({ jobId: { $in: jobIds } });
    if (!escrows.length) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "No records found",
          status: 404,
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Fetched Escrows",
        status: 200,
        data: escrows,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
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
