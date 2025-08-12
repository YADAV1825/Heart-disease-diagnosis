import { RequestHandler } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MedicalAnalysisRequest, MedicalAnalysisResponse } from "@shared/api";

// Gemini API Configuration
const API_KEY = "AIzaSyCU5a3YoiUTzmVCaNAvum9NGbxo2a-fdYQ";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

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
    console.log("Received medical analysis request:", req.body);
    const data = req.body as MedicalAnalysisRequest;

    // Validate required fields
    if (!data.name || !data.age || !data.gender) {
      console.log("Validation failed - missing required fields");
      return res.status(400).json({
        success: false,
        error: "Missing required fields: name, age, and gender are required.",
      });
    }

    console.log("Calling Gemini AI...");
    // Generate the prompt and call Gemini AI
    const prompt = buildPrompt(data);

    try {
      const result = await model.generateContent(prompt);
      const analysisText = result.response.text();
      console.log("Gemini AI response received successfully");

      const response: MedicalAnalysisResponse = {
        success: true,
        analysis: analysisText,
      };

      res.json(response);
    } catch (aiError) {
      console.error("Gemini AI Error:", aiError);
      // Fallback to mock analysis if AI fails
      const mockAnalysis = `
🏥 CARDIOAI SCREENING ANALYSIS

👤 Patient: ${data.name} (${data.age} years, ${data.gender})
📍 Location: ${data.city || "Not specified"}

⚠️ Note: AI analysis temporarily unavailable. Showing sample analysis format.

🎯 RISK ASSESSMENT
Risk Score: 5/10 (Moderate Risk - Sample)
⚠️ Recommend cardiologist consultation for proper evaluation

🔬 RECOMMENDED TESTS
1. Echocardiogram (ECHO) - Priority
2. 12-lead ECG
3. Chest X-ray
4. Complete Blood Count (CBC)

🩺 POSSIBLE CONDITIONS TO INVESTIGATE
- Atrial Septal Defect (ASD)
- Ventricular Septal Defect (VSD)
- Mitral Valve conditions
- General cardiac screening

💬 NEXT STEPS
Please consult with a cardiologist for professional medical evaluation.

🏥 GENERAL RECOMMENDATIONS
1. Schedule cardiac consultation
2. Prepare medical history
3. Follow up as recommended by physician

📋 IMPORTANT
This is a sample format. Please consult healthcare professionals for actual medical advice.
      `;

      const response: MedicalAnalysisResponse = {
        success: true,
        analysis: mockAnalysis,
      };

      res.json(response);
    }
  } catch (error) {
    console.error("Server Error in medical analysis:", error);
    res.status(500).json({
      success: false,
      error: "Failed to analyze medical data. Please try again.",
    });
  }
};
