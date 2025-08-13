import type { Handler } from "@netlify/functions";

// Import GoogleGenerativeAI with a try-catch for better error handling
let GoogleGenerativeAI: any;
try {
  GoogleGenerativeAI = require("@google/generative-ai").GoogleGenerativeAI;
} catch (error) {
  console.error("Failed to import GoogleGenerativeAI:", error);
}

interface MedicalAnalysisRequest {
  name: string;
  age: string;
  ageGroup: string;
  gender: string;
  height: string;
  weight: string;
  city: string;
  bp: string;
  hr: string;
  spo2: string;
  allergies: string;
  smoking: string;
  alcohol: string;
  tobacco: string;
  hypertensive: string;
  diabetes: string;
  cyanosis: string;
  chestPain: string;
  fatigue: string;
  sob: string;
  syncope: string;
  palpitations: string;
  familyHistory: string;
  feeding: string;
  symptoms: string;
}

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

export const handler: Handler = async (event) => {
  // Set CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        error: "Method Not Allowed",
      }),
    };
  }

  try {
    console.log("Netlify Function: Received medical analysis request");

    // Parse request body
    const data: MedicalAnalysisRequest = JSON.parse(event.body || "{}");

    // Validate required fields
    if (!data.name || !data.age || !data.gender) {
      console.log("Validation failed - missing required fields");
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Missing required fields: name, age, and gender are required.",
        }),
      };
    }

    // Get API key from environment
    const API_KEY = process.env.GEMINI_API_KEY;
    console.log("API Key available:", !!API_KEY);

    // Try to call Gemini AI if available
    if (API_KEY) {
      try {
        console.log("Attempting to call Gemini AI...");
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = buildPrompt(data);
        const result = await model.generateContent(prompt);
        const analysisText = result.response.text();

        console.log("Gemini AI response received successfully");

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            analysis: analysisText,
          }),
        };
      } catch (aiError) {
        console.error("Gemini AI Error:", aiError);
        console.log("Falling back to sample analysis due to AI error");
      }
    } else {
      console.log(
        "Using fallback analysis - API key not available in environment",
      );
    }

    // Fallback analysis if AI fails or API key missing
    const mockAnalysis = `
**Disclaimer:** This is an AI assistant and not a medical doctor. This report is for informational purposes only and is not a substitute for a professional medical diagnosis. You must consult a qualified healthcare professional for any health concerns.

### **Preliminary SHD Assessment for ${data.name}**

Hello ${data.name}, thank you for providing your information. Based on the details you've shared, here is a comprehensive assessment.

**Patient Information:**
- Name: ${data.name}
- Age: ${data.age} years (${data.ageGroup})
- Gender: ${data.gender}
- Height: ${data.height} cm
- Weight: ${data.weight} kg
- Location: ${data.city}

**Vitals:**
- Blood Pressure: ${data.bp}
- Heart Rate: ${data.hr} BPM
- SpO2: ${data.spo2}%
- Allergies: ${data.allergies}

#### **1. Estimated Risk Score for Structural Heart Disease**

**Risk Score: 5/10 (Moderate Risk)**

**Note:** AI analysis temporarily unavailable. Please try again or consult a healthcare professional directly.

**Primary Risk Factors Considered:**
- Current symptoms reported
- Vital signs measurements
- Lifestyle factors
- Family history

#### **2. Urgency for Cardiologist Consultation**

**YES, consultation with a cardiologist is recommended** for proper medical evaluation.

#### **3. Suggested Next Steps & Diagnostic Tests**

1. **Clinical Examination:** Complete physical examination by a qualified physician
2. **Electrocardiogram (ECG/EKG):** To assess heart rhythm and electrical activity
3. **Echocardiogram (ECHO):** Essential for structural heart disease detection
4. **Blood Tests:** Complete blood panel including cardiac markers

#### **4. Possible Structural Heart Disease (SHD) Conditions**

A medical professional would evaluate for:
- Valvular heart disease
- Cardiomyopathy conditions
- Congenital heart defects
- Other cardiac abnormalities

#### **5. What to Tell Your Doctor**

Present your symptoms clearly:
- Describe any chest pain, shortness of breath, or other symptoms
- Mention your blood pressure readings
- Discuss your lifestyle factors
- Provide family medical history

#### **6. Cardiac Hospitals in ${data.city}, India**

Consult local medical directories for:
1. Government hospitals with cardiology departments
2. Private multi-specialty hospitals
3. Cardiac specialty centers

#### **7. Red Flags & Continuous Care Advice**

**Seek immediate medical attention if experiencing:**
- Severe chest pain
- Difficulty breathing
- Fainting or severe dizziness
- Irregular heartbeat

**General Health Advice:**
- Maintain healthy lifestyle
- Regular medical check-ups
- Follow medical advice
- Monitor blood pressure regularly

---

### **Doctor's Summary**

**Patient:** ${data.name}, ${data.age}-year-old ${data.gender} from ${data.city}.

**Assessment:** Requires professional medical evaluation for comprehensive cardiac assessment.

**Recommended Plan:**
1. Schedule consultation with cardiologist
2. Complete diagnostic workup as recommended
3. Follow medical advice for treatment plan
4. Regular monitoring and follow-up

**Important:** This is a sample analysis format. Please consult qualified healthcare professionals for actual medical diagnosis and treatment.
    `;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        analysis: mockAnalysis,
      }),
    };
  } catch (error) {
    console.error("Netlify Function Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: "Failed to analyze medical data. Please try again.",
      }),
    };
  }
};
