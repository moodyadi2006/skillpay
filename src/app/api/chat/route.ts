import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    if (!message) {
      return Response.json({ error: "Message is required" }, { status: 400 });
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
      model: "llama3-8b-8192",
    });
    const responseMessage =
      chatCompletion.choices[0]?.message?.content || "No response from llama";
    return Response.json({ response: responseMessage });
  } catch (error) {
    console.error("Error in chat API: ", error);
    return Response.json({ error: "Internal Server error" }, { status: 500 });
  }
}
