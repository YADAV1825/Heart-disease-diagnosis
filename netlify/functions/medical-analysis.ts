import type { Handler } from "@netlify/functions";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

    // For demo purposes, using a comprehensive mock analysis
    console.log("Using professional mock analysis for demo purposes");

    // Generate a comprehensive professional medical analysis
    console.log("Generating professional medical analysis...");

    // Calculate BMI if height and weight provided
    let bmi = "Not calculated";
    if (data.height && data.weight) {
      const heightM = parseFloat(data.height) / 100;
      const weightKg = parseFloat(data.weight);
      bmi = (weightKg / (heightM * heightM)).toFixed(1);
    }

    // Calculate risk factors
    let riskScore = 3; // Base risk
    let riskFactors = [];

    if (data.chestPain === "Yes") { riskScore += 2; riskFactors.push("Chest pain present"); }
    if (data.sob === "Yes") { riskScore += 2; riskFactors.push("Shortness of breath"); }
    if (data.syncope === "Yes") { riskScore += 2; riskFactors.push("History of fainting"); }
    if (data.palpitations === "Yes") { riskScore += 1; riskFactors.push("Palpitations"); }
    if (data.familyHistory === "Yes") { riskScore += 1; riskFactors.push("Family history of heart disease"); }
    if (data.smoking === "Yes") { riskScore += 1; riskFactors.push("Smoking history"); }
    if (data.diabetes === "Yes") { riskScore += 1; riskFactors.push("Diabetes/high sugar"); }

    riskScore = Math.min(riskScore, 10); // Cap at 10

    const riskLevel = riskScore <= 3 ? "Low" : riskScore <= 6 ? "Moderate" : "High";
    const urgency = riskScore >= 7 ? "URGENT" : riskScore >= 5 ? "Recommended within 2-4 weeks" : "Routine consultation recommended";

    const professionalAnalysis = `
**Disclaimer:** This is a clinical assistance tool and not a substitute for professional medical diagnosis. You must consult a qualified healthcare professional for any health concerns.

### **Preliminary SHD Assessment for ${data.name}**

Hello ${data.name}, thank you for providing your information. Based on the details you've shared about your symptoms, lifestyle, and vitals, here is a detailed assessment.

**Patient Information:**
- Name: ${data.name}
- Age: ${data.age} years (${data.ageGroup})
- Gender: ${data.gender}
- Height: ${data.height} cm
- Weight: ${data.weight} kg
- BMI: ${bmi}${bmi !== "Not calculated" ? (parseFloat(bmi) < 18.5 ? " (Underweight)" : parseFloat(bmi) < 25 ? " (Normal)" : parseFloat(bmi) < 30 ? " (Overweight)" : " (Obese)") : ""}
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

**Risk Score: ${riskScore}/10 (${riskLevel} Risk)**

**Primary Drivers of this Score:**
${riskFactors.length > 0 ? riskFactors.map(factor => `- ${factor}`).join('\n') : '- No significant risk factors identified from the information provided'}

#### **2. Urgency for Cardiologist Consultation**

**${urgency.includes('URGENT') ? 'YES, URGENT consultation is recommended' : 'YES, consultation with a cardiologist is recommended'} - ${urgency}**

${riskScore >= 7 ? 'The combination of symptoms suggests potential cardiac issues that require immediate evaluation.' : 'Based on the symptoms and risk factors, professional cardiac evaluation is advisable.'}

#### **3. Suggested Next Steps & Diagnostic Tests**

Your first step should be to see a General Physician or a Cardiologist. They will likely recommend the following tests:

1. **Clinical Examination:** Physical examination including heart auscultation to listen for murmurs or irregular sounds
2. **Electrocardiogram (ECG/EKG):** Records heart's electrical activity to detect rhythm abnormalities
3. **Echocardiogram (ECHO):** Ultrasound of the heart to assess structure, chamber size, and valve function
4. **Blood Tests:** Complete blood panel, lipid profile, and cardiac enzymes if indicated
5. **Chest X-ray:** To evaluate heart size and lung condition
${riskScore >= 6 ? '\n6. **Stress Test:** May be recommended based on symptoms\n7. **Holter Monitor:** 24-hour heart rhythm monitoring if palpitations are frequent' : ''}

#### **4. Possible Structural Heart Disease (SHD) Conditions**

Based on your profile, a doctor would investigate several possibilities:

- **Valvular Heart Disease:** Conditions affecting heart valves (mitral, aortic, tricuspid, pulmonary)
- **Cardiomyopathy:** Diseases of the heart muscle including hypertrophic, dilated, or restrictive types
- **Congenital Defects:** Birth defects like atrial septal defect (ASD), ventricular septal defect (VSD)
- **Coronary Artery Disease:** Blockages in heart arteries
${data.familyHistory === 'Yes' ? '- **Genetic Cardiomyopathies:** Given family history, inherited heart conditions should be evaluated' : ''}

#### **5. What to Tell Your Doctor**

Be clear and specific. Create a list so you don't forget anything:

- "I am here because I've been experiencing ${[data.chestPain === 'Yes' && 'chest pain', data.sob === 'Yes' && 'shortness of breath', data.palpitations === 'Yes' && 'palpitations', data.syncope === 'Yes' && 'fainting episodes'].filter(Boolean).join(', ') || 'concerns about my heart health'}."
- Describe the symptoms in detail: when they occur, how long they last, what triggers them
- "My current vital signs include blood pressure of ${data.bp}, heart rate of ${data.hr} BPM"
- "${data.smoking === 'Yes' ? 'I am a smoker' : 'I do not smoke'} and ${data.alcohol === 'Yes' ? 'I consume alcohol' : 'I do not drink alcohol'}"
- "${data.familyHistory === 'Yes' ? 'I have a family history of heart disease' : 'No known family history of heart disease'}"
- Mention any medications you're currently taking

#### **6. Cardiac Hospitals in ${data.city || 'Your Area'}, India**

Here are types of facilities to look for in ${data.city || 'your city'}:

1. **Government Medical Colleges:** Often have excellent cardiology departments with experienced doctors
2. **Multi-specialty Private Hospitals:** Usually have advanced cardiac care units and latest equipment
3. **Dedicated Heart Institutes:** Specialized cardiac centers with comprehensive heart care services

*Consult local medical directories or online resources for specific hospitals in your area.*

#### **7. Alternative Screening for Rural/Low-Resource Settings**

If access to a cardiologist is difficult or delayed:

- **Primary Care Doctor:** Can perform initial evaluation and refer appropriately
- **ECG at Local Clinic:** Most basic health centers have ECG capability
- **Telemedicine Consultation:** Many hospitals now offer remote cardiology consultations
- **Mobile Health Camps:** Look out for cardiac screening camps in your area

#### **8. Red Flags & Continuous Care Advice**

**Red Flags: Seek IMMEDIATE emergency care if you experience:**
- Severe crushing chest pain lasting more than a few minutes
- Chest pain with sweating, nausea, or shortness of breath
- Sudden severe shortness of breath
- Fainting or near-fainting episodes
- Severe dizziness with chest discomfort
- Rapid or very irregular heartbeat with symptoms

**Continuous Care Advice:**
- **Lifestyle Modifications:** ${data.smoking === 'Yes' ? 'Quit smoking immediately - this is crucial for heart health' : 'Continue avoiding smoking'}
- **Regular Monitoring:** Keep track of blood pressure and heart rate
- **Diet:** Heart-healthy diet low in salt, saturated fats, and rich in fruits and vegetables
- **Exercise:** Regular moderate exercise as cleared by your doctor
- **Medication Compliance:** Take prescribed medications exactly as directed
- **Follow-up:** Keep all scheduled appointments with your healthcare providers

---

### **Doctor's Summary**

**Patient:** ${data.name}, ${data.age}-year-old ${data.gender} from ${data.city || 'Unknown location'}.

**Presenting Complaint:** ${[data.chestPain === 'Yes' && 'chest pain', data.sob === 'Yes' && 'shortness of breath', data.fatigue === 'Yes' && 'fatigue', data.palpitations === 'Yes' && 'palpitations', data.syncope === 'Yes' && 'syncope'].filter(Boolean).join(', ') || 'Cardiac screening request'}

**Vitals:** ${data.bp ? `BP: ${data.bp}, ` : ''}${data.hr ? `HR: ${data.hr} BPM, ` : ''}${data.spo2 ? `SpO2: ${data.spo2}%` : ''}

**Risk Factors:** ${[data.smoking === 'Yes' && 'smoking', data.diabetes === 'Yes' && 'diabetes', data.familyHistory === 'Yes' && 'family history', data.hypertensive === 'Yes' && 'hypertensive medications'].filter(Boolean).join(', ') || 'None identified'}

**Assessment:** ${riskScore >= 7 ? 'High-risk presentation requiring urgent cardiology evaluation' : riskScore >= 5 ? 'Moderate risk requiring timely cardiology consultation' : 'Low to moderate risk, routine cardiology evaluation recommended'}. ${riskScore >= 6 ? 'Multiple risk factors present warrant comprehensive cardiac workup.' : 'Standard cardiac screening protocols apply.'}

**Recommended Plan:**
1. ${urgency.includes('URGENT') ? 'Urgent cardiology consultation within 24-48 hours' : 'Cardiology consultation within 2-4 weeks'}
2. Initial workup: ECG, Echocardiogram, basic metabolic panel
3. ${riskScore >= 6 ? 'Consider stress testing and extended monitoring' : 'Standard diagnostic workup as per cardiologist recommendation'}
4. Lifestyle counseling regarding ${[data.smoking === 'Yes' && 'smoking cessation', 'cardiac risk reduction', 'regular follow-up'].filter(Boolean).join(', ')}

**Note:** This assessment is based on provided information and should not replace professional medical evaluation. Seek immediate medical attention for any acute symptoms.
    `;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        analysis: professionalAnalysis,
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
