import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";



const genAI = new GoogleGenerativeAI(process.env.GEMINI_AI_KEY);


async function generateAIResponse(prompt) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    const response = await result.response;
    return await response.text();
}

export async function POST(req) {
    try {
        const { message } = await req.json();        // Construct prompt with instructions for friendly, informative responses with markdown
        const prompt = `You are ChatNest AI, a helpful and friendly AI assistant. Please answer the following question in a clear, informative, and conversational manner. Format your response using Markdown for better readability:
- Use **bold** for emphasis
- Use \`code blocks\` for code or technical terms
- Use bullet points or numbered lists where appropriate
- Use ### for subheadings if needed
- Include relevant links if helpful
- Use tables if presenting structured data

Here's the question:

${message}`;

        // Generate AI response
        let aiResponse = await generateAIResponse(prompt);
        if (!aiResponse) {
            aiResponse = "I apologize, but I'm having trouble generating a response right now. Please try again.";
        }

        return NextResponse.json({
            aiResponse,
            success: true,
        }, { status: 200 });

    } catch (error) {
        console.error('Error generating AI response:', error);
        
        return NextResponse.json({
            message: "An error occurred while processing your request.",
            success: false,
        }, { status: 500 });
    }
}

