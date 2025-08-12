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

**Disclaimer:** You are an AI assistant and not a medical doctor. This report is for informational purposes only and is not a substitute for a professional medical diagnosis. The patient must consult a qualified healthcare professional for any health concerns.

Please provide a comprehensive clinical assistance report following this exact structure:

### **Preliminary SHD Assessment for ${data.name}**

Hello ${data.name}, thank you for providing your information. Based on the details you've shared about your symptoms, lifestyle, and vitals, here is a detailed assessment.

**Patient Information:**
- Name: ${data.name}
- Age: ${data.age} years (${data.ageGroup})
- Gender: ${data.gender}
- Height: ${data.height} cm
- Weight: ${data.weight} kg
- BMI: [Calculate BMI if height and weight provided]
- Location: ${data.city}

**Vitals:**
- Blood Pressure: ${data.bp}
- Heart Rate: ${data.hr} BPM
- SpO2: ${data.spo2}%
- Allergies: ${data.allergies}

**Risk Factors:**
- Smoking: ${data.smoking}
- Alcohol: ${data.alcohol}
- Tobacco: ${data.tobacco}
- Hypertensive Drugs: ${data.hypertensive}
- Diabetes/High Sugar: ${data.diabetes}

**Symptoms Assessment:**
- Cyanosis (Blue lips/skin): ${data.cyanosis}
- Chest Pain: ${data.chestPain}
- Fatigue: ${data.fatigue}
- Shortness of Breath: ${data.sob}
- Syncope (Fainting): ${data.syncope}
- Palpitations: ${data.palpitations}
- Family History of SHD: ${data.familyHistory}
- Feeding Issues: ${data.feeding}
- Additional Symptoms: ${data.symptoms}

#### **1. Estimated Risk Score for Structural Heart Disease**

**Risk Score: [X]/10**

**Primary Drivers of this Score:**
- [Provide detailed analysis of each risk factor]
- [Explain how symptoms contribute to risk]
- [Discuss lifestyle factors impact]
- [Consider family history implications]

#### **2. Urgency for Cardiologist Consultation**

**[YES/NO], [urgency level] consultation is recommended.**

[Provide detailed reasoning for the urgency level based on symptoms and risk factors]

#### **3. Suggested Next Steps & Diagnostic Tests**

Your first step should be to see a General Physician or a Cardiologist. They will likely recommend the following tests:

1. **Clinical Examination:** [Detailed explanation]
2. **Electrocardiogram (ECG/EKG):** [Purpose and what it detects]
3. **Echocardiogram (ECHO):** [Importance for SHD detection]
4. **Blood Tests:** [Specific tests and their purposes]
5. **Additional Tests:** [Based on specific symptoms]

#### **4. Possible Structural Heart Disease (SHD) Conditions**

Based on your profile, a doctor would investigate several possibilities:

- **Valvular Heart Disease:** [Detailed explanation of possibilities]
- **Cardiomyopathy:** [Types and symptoms]
- **Congenital Defects:** [Common defects and their presentation]
- **Other Cardiac Issues:** [Additional considerations]

#### **5. What to Tell Your Doctor**

Be clear and specific. Create a list so you don't forget anything:

- [Provide detailed script of what to tell doctor]
- [Include specific symptom descriptions]
- [Mention all relevant medical history]
- [Include vital signs and measurements]

#### **6. Cardiac Hospitals in ${data.city}, India**

Here are three well-regarded hospitals in ${data.city} with cardiology departments:

1. **[Hospital Name 1]:** [Description of services]
2. **[Hospital Name 2]:** [Description of services]
3. **[Hospital Name 3]:** [Description of services]

#### **7. Alternative Screening for Rural/Low-Resource Settings**

If access to a cardiologist is difficult:

- **Auscultation by Primary Care Doctor:** [Detailed explanation]
- **ECG:** [Availability and usefulness]
- **Telemedicine Consultation:** [How to access]
- **Community Health Camps:** [What to look for]

#### **8. Red Flags & Continuous Care Advice**

**Red Flags: Go to an emergency room immediately if you experience:**
- [List specific emergency symptoms]
- [Explain severity indicators]

**Continuous Care Advice:**
- [Specific lifestyle modifications]
- [Monitoring recommendations]
- [Prevention strategies]

---

### **Doctor's Summary**

**Patient:** ${data.name}, ${data.age}-year-old ${data.gender} from ${data.city}.

**Presenting Complaint:** [Summarize main symptoms]

**Vitals:** [Key vital signs]

**Risk Factors:** [List significant risk factors]

**Family History:** [Relevant family history]

**Assessment:** [Professional clinical assessment]

**Recommended Plan:**
1. [Immediate actions]
2. [Diagnostic workup]
3. [Follow-up recommendations]
4. [Lifestyle modifications]

Generate this complete detailed report following this exact structure and format.
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
