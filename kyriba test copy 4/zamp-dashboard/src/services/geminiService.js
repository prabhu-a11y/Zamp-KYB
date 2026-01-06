import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "YOUR_API_KEY_HERE";
const genAI = new GoogleGenerativeAI(API_KEY);

export const chatWithKnowledgeBase = async (userMessage, knowledgeBaseContent, conversationHistory = []) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const context = `You are a helpful assistant for AEPC Reporting. Answer questions based ONLY on the following knowledge base content. If the answer is not in the knowledge base, say "I don't have information about that in the knowledge base."

Knowledge Base:
${knowledgeBaseContent}

Previous conversation:
${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}
`;

        const prompt = `${context}\n\nUser: ${userMessage}\nAssistant:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
};