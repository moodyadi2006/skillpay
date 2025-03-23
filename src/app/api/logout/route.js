import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (session) {
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Set-Cookie": [
          `next-auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
          `next-auth.csrf-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
        ],
      },
    });
  }

  return new Response(
    JSON.stringify({ success: false, message: "Not logged in" }),
    {
      status: 401,
    }
  );
}
