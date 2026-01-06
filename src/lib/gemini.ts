import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.warn("VITE_GEMINI_API_KEY is not set in .env");
}

const genAI = new GoogleGenerativeAI(API_KEY || "");

export const extractEmiratesIdData = async (file: File) => {
    try {
        if (!API_KEY) {
            alert("VITE_GEMINI_API_KEY is missing! Please check your .env file and restart the server.");
            throw new Error("Missing API Key");
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
        const base64Data = await fileToGenerativePart(file);

        const prompt = `
      Extract the following details from this Emirates ID card image.
      Return the output as a valid JSON object with these exact keys:
      - fullName (string) - Name as it appears on the card (English)
      - idNumber (string) - The extraction format should be 784-XXXX-XXXXXXX-X
      - nationality (string)
      - dateOfBirth (string) - Format as DD/MM/YYYY
      - expiryDate (string) - Format as DD/MM/YYYY
      - isValidEmiratesId (boolean) - true if the image contains "United Arab Emirates" AND "Identity Card" text or looks like a valid ID.
      - checks (array of strings) - List of passed checks e.g. ["Header Found", "Logo Detected"]

      If a field is not visible or cannot be read, return an empty string for that field.
      Do not include markdown formatting like \`\`\`json. Just the raw JSON.
    `;

        console.log("Using model: gemini-2.5-flash-lite");
        const result = await model.generateContent([prompt, base64Data]);
        const response = await result.response;
        const text = response.text();
        console.log("Gemini Raw Response:", text);

        return parseGeminiResponse(text);
    } catch (error) {
        console.error("Gemini Extraction Error:", error);
        throw error;
    }
};

export const extractAllTradeLicenseData = async (file: File) => {
    try {
        if (!API_KEY) throw new Error("Missing API Key");
        const base64Data = await fileToGenerativePart(file);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        const prompt = `
      Analyze this Trade License document and extract the following information into a strict JSON format.
      If a field is not found or unclear, return null. 
      Do NOT wrap the JSON in markdown code blocks.
      
      Fields to extract:
        - businessName(string): The name of the business(e.g., "Tech Solutions LLC")
            - licenseNumber(string): The license number
                - issuingAuthority(string): The authority that issued the license(e.g., "Dubai Economic Department")
                    - legalType(string): The legal structure(e.g., "Limited Liability Company")
                        - activities(array of strings): List of business activities
                            - expiryDate(string): The expiration date(e.g., "2025-12-31")
                                `;

        const result = await model.generateContent([prompt, base64Data]);
        const response = await result.response;
        return parseGeminiResponse(response.text());
    } catch (error) {
        console.error("Error extracting trade license data:", error);
        throw error;
    }
};

export const extractFreelancerPermitData = async (file: File) => {
    try {
        if (!API_KEY) throw new Error("Missing API Key");
        const base64Data = await fileToGenerativePart(file);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        const prompt = `
      Analyze this Freelancer Permit document and extract the following information into a strict JSON format.
      If a field is not found or unclear, return null. 
      Do NOT wrap the JSON in markdown code blocks.
      
      Fields to extract:
        - fullName(string): The full name of the freelancer
            - permitNumber(string): The permit number
                - issuingAuthority(string): The authority extracted from the top or title(e.g., "GDRFA", "DCCA")
                    - activity(string): The freelance activity or designation
                        - expiryDate(string): The expiration date
                            `;

        const result = await model.generateContent([prompt, base64Data]);
        const response = await result.response;
        return parseGeminiResponse(response.text());
    } catch (error) {
        console.error("Error extracting freelancer permit data:", error);
        throw error;
    }
};

export const extractMOAData = async (file: File) => {
    try {
        if (!API_KEY) throw new Error("Missing API Key");
        const base64Data = await fileToGenerativePart(file);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        const prompt = `
      Analyze this Memorandum of Association(MOA) and extract the shareholders and their ownership stakes.
      Return the output as a strict JSON object with a "shareholders" key containing an array of objects.
      Each object should have:
        - name(string): Full name of the shareholder
            - name(string): Full name of the shareholder
                - nationality(string): Nationality of the shareholder
                    - ownership(string): Ownership percentage(e.g. "51%", "49%")

      If data is not found, return an empty array.
    `;

        const result = await model.generateContent([prompt, base64Data]);
        const response = await result.response;
        return parseGeminiResponse(response.text());
    } catch (error) {
        console.error("Error extracting MOA data:", error);
        throw error;
    }
};

export const extractPOAData = async (file: File) => {
    try {
        if (!API_KEY) throw new Error("Missing API Key");
        const base64Data = await fileToGenerativePart(file);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        const prompt = `
      Analyze this Power of Attorney(POA) document and extract the following details into a strict JSON format.
      - grantedBy(string): Name of person / entity granting the power
            - grantedTo(string): Name of person receiving the power
                - scope(string): Brief description of the scope(e.g. "Full Banking Authority")
                    - dateIssued(string): DD / MM / YYYY
                        - expiryDate(string): DD / MM / YYYY
                            - notarized(boolean): true if notarized / stamped, else false
      
      If a field is not found, return null or empty string.
    `;

        const result = await model.generateContent([prompt, base64Data]);
        const response = await result.response;
        return parseGeminiResponse(response.text());
    } catch (error) {
        console.error("Error extracting POA data:", error);
        throw error;
    }
};

// Helper to parse leniently
function parseGeminiResponse(text: string) {
    const jsonStr = text.replace(/```json\n ?|\n ? ```/g, "").trim();
    const startIndex = jsonStr.indexOf('{');
    const endIndex = jsonStr.lastIndexOf('}');

    if (startIndex !== -1 && endIndex !== -1) {
        return JSON.parse(jsonStr.substring(startIndex, endIndex + 1));
    }
    return JSON.parse(jsonStr);
}

async function fileToGenerativePart(file: File): Promise<{ inlineData: { data: string; mimeType: string } }> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            const base64String = result.split(",")[1];
            resolve({
                inlineData: {
                    data: base64String,
                    mimeType: file.type,
                },
            });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
