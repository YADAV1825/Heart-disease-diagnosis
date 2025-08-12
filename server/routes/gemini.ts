import { RequestHandler } from "express";

export interface MedicalAnalysisRequest {
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

export interface MedicalAnalysisResponse {
  analysis: string;
  success: boolean;
  error?: string;
}

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

    // For demo purposes, we'll return a mock analysis
    // In production, you would integrate with Google's Gemini AI API here
    const mockAnalysis = `
🏥 STRUCTURAL HEART DISEASE SCREENING ANALYSIS

👤 Patient: ${data.name} (${data.age} years, ${data.gender})
📍 Location: ${data.city}

🎯 RISK ASSESSMENT
Risk Score: 6/10 (Moderate Risk)
⚠️ Cardiologist consultation recommended within 2-4 weeks

🔬 RECOMMENDED TESTS
1. Echocardiogram (ECHO) - Priority
2. 12-lead ECG
3. Chest X-ray
4. Complete Blood Count (CBC)
5. Lipid Profile

🩺 POSSIBLE CONDITIONS TO INVESTIGATE
- Atrial Septal Defect (ASD)
- Ventricular Septal Defect (VSD)
- Mitral Valve Prolapse
- Hypertrophic Cardiomyopathy

💬 WHAT TO TELL YOUR DOCTOR
"I've been experiencing [${data.symptoms}]. I'm concerned about potential structural heart disease. Could you please evaluate me for conditions like ASD, VSD, or valve issues?"

🏥 RECOMMENDED CARDIAC HOSPITALS IN ${data.city}
1. All India Institute of Medical Sciences (AIIMS)
2. Fortis Hospital - Cardiology Department
3. Apollo Hospital - Heart Institute

🚨 RED FLAGS - SEEK IMMEDIATE CARE IF:
- Severe chest pain
- Difficulty breathing at rest
- Fainting episodes
- Blue lips or fingernails

📋 DOCTOR SUMMARY
${data.age}-year-old ${data.gender} presenting with moderate risk factors for structural heart disease. Recommend echocardiogram and cardiology consultation for comprehensive evaluation.
`;

    const response: MedicalAnalysisResponse = {
      success: true,
      analysis: mockAnalysis
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
