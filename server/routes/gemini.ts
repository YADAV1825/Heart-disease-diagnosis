import { RequestHandler } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MedicalAnalysisRequest, MedicalAnalysisResponse } from "@shared/api";

// Gemini API Configuration
const API_KEY = "AIzaSyCU5a3YoiUTzmVCaNAvum9NGbxo2a-fdYQ";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

function buildPrompt(data: MedicalAnalysisRequest): string {
  return `
You are a clinical assistant AI for early detection of structural heart diseases (SHD), especially in low-resource settings.

User Demographics:
- Name: ${data.name}
- Age: ${data.age}
- Age Group: ${data.ageGroup}
- Gender: ${data.gender}
- Height: ${data.height} cm
- Weight: ${data.weight} kg
- City: ${data.city}

Vitals:
- Blood Pressure: ${data.bp}
- Heart Rate: ${data.hr} BPM
- SpO2: ${data.spo2}
- Allergies: ${data.allergies}

Lifestyle:
- Smoking: ${data.smoking}
- Alcohol: ${data.alcohol}
- Tobacco: ${data.tobacco}
- Hypertensive Drugs: ${data.hypertensive}
- Diabetes/High Sugar: ${data.diabetes}

SHD-Specific Symptoms:
- Cyanosis: ${data.cyanosis}
- Chest Pain: ${data.chestPain}
- Fatigue: ${data.fatigue}
- Shortness of Breath: ${data.sob}
- Syncope (Fainting): ${data.syncope}
- Palpitations: ${data.palpitations}
- Family History of SHD: ${data.familyHistory}
- Feeding Issues (newborns only): ${data.feeding}

General Symptoms:
${data.symptoms}

Your tasks:
1. Estimate risk score for structural heart disease (0-10).
2. Highlight if urgent cardiologist consult is needed.
3. Suggest next steps (tests like ECHO, ECG).
4. List possible SHD conditions (ASD, VSD, valve issues, etc.).
5. Suggest what to tell the doctor.
6. Show 3 cardiac hospitals in ${data.city} India.
7. If rural/low-resource, give alternative screening ideas.
8. Provide red flags & continuous care advice.
9. Doctor summary at the end.
`;
}

export const handleMedicalAnalysis: RequestHandler = async (req, res) => {
  try {
    const data = req.body as MedicalAnalysisRequest;

    // Validate required fields
    if (!data.name || !data.age || !data.gender) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: name, age, and gender are required."
      });
    }

    // Generate the prompt and call Gemini AI
    const prompt = buildPrompt(data);
    const result = await model.generateContent(prompt);
    const analysisText = result.response.text();

    const response: MedicalAnalysisResponse = {
      success: true,
      analysis: analysisText
    };

    res.json(response);
  } catch (error) {
    console.error("Error in medical analysis:", error);
    res.status(500).json({
      success: false,
      error: "Failed to analyze medical data. Please try again."
    });
  }
};
