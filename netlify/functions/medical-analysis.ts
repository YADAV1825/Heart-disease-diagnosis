import type { Handler } from "@netlify/functions";

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

    if (data.chestPain === "Yes") {
      riskScore += 2;
      riskFactors.push("Chest pain present");
    }
    if (data.sob === "Yes") {
      riskScore += 2;
      riskFactors.push("Shortness of breath");
    }
    if (data.syncope === "Yes") {
      riskScore += 2;
      riskFactors.push("History of fainting");
    }
    if (data.palpitations === "Yes") {
      riskScore += 1;
      riskFactors.push("Palpitations");
    }
    if (data.familyHistory === "Yes") {
      riskScore += 1;
      riskFactors.push("Family history of heart disease");
    }
    if (data.smoking === "Yes") {
      riskScore += 1;
      riskFactors.push("Smoking history");
    }
    if (data.diabetes === "Yes") {
      riskScore += 1;
      riskFactors.push("Diabetes/high sugar");
    }

    riskScore = Math.min(riskScore, 10); // Cap at 10

    const riskLevel =
      riskScore <= 3 ? "Low" : riskScore <= 6 ? "Moderate" : "High";
    const urgency =
      riskScore >= 7
        ? "URGENT"
        : riskScore >= 5
          ? "Recommended within 2-4 weeks"
          : "Routine consultation recommended";

    const professionalAnalysis = `
<div style="color: #dc2626; font-weight: bold; padding: 12px; background-color: #fef2f2; border-radius: 8px; margin-bottom: 16px;">
⚠️ Disclaimer: This is a clinical assistance tool and not a substitute for professional medical diagnosis. You must consult a qualified healthcare professional for any health concerns.
</div>

<h2 style="color: #0891b2; font-size: 24px; font-weight: bold; margin: 20px 0;">🏥 Preliminary SHD Assessment for ${data.name}</h2>

Hello ${data.name}, thank you for providing your information. Based on the details you've shared about your symptoms, lifestyle, and vitals, here is a detailed assessment.

<h3 style="color: #059669; font-size: 18px; font-weight: bold; margin: 16px 0;">👤 Patient Information:</h3>
- Name: ${data.name}
- Age: ${data.age} years (${data.ageGroup})
- Gender: ${data.gender}
- Height: ${data.height} cm
- Weight: ${data.weight} kg
- BMI: ${bmi}${bmi !== "Not calculated" ? (parseFloat(bmi) < 18.5 ? " (Underweight)" : parseFloat(bmi) < 25 ? " (Normal)" : parseFloat(bmi) < 30 ? " (Overweight)" : " (Obese)") : ""}
- Location: ${data.city}

<h3 style="color: #dc2626; font-size: 18px; font-weight: bold; margin: 16px 0;">💓 Vitals:</h3>
- Blood Pressure: ${data.bp}
- Heart Rate: ${data.hr} BPM
- SpO2: ${data.spo2}%
- Allergies: ${data.allergies}

<h3 style="color: #ea580c; font-size: 18px; font-weight: bold; margin: 16px 0;">⚠️ Risk Factors:</h3>
- Smoking: ${data.smoking}
- Alcohol: ${data.alcohol}
- Tobacco: ${data.tobacco}
- Hypertensive Drugs: ${data.hypertensive}
- Diabetes/High Sugar: ${data.diabetes}

<h3 style="color: #7c3aed; font-size: 18px; font-weight: bold; margin: 16px 0;">🩺 Symptoms Assessment:</h3>
- Cyanosis (Blue lips/skin): ${data.cyanosis}
- Chest Pain: ${data.chestPain}
- Fatigue: ${data.fatigue}
- Shortness of Breath: ${data.sob}
- Syncope (Fainting): ${data.syncope}
- Palpitations: ${data.palpitations}
- Family History of SHD: ${data.familyHistory}
- Feeding Issues: ${data.feeding}
- Additional Symptoms: ${data.symptoms}

<h3 style="color: #9333ea; font-size: 20px; font-weight: bold; margin: 20px 0;">📊 1. Estimated Risk Score for Structural Heart Disease</h3>

<div style="color: #dc2626; font-size: 16px; font-weight: bold;">Risk Score: ${riskScore}/10 (${riskLevel} Risk)</div>

<div style="color: #059669; font-weight: bold; margin: 12px 0;">Primary Drivers of this Score:</div>
${riskFactors.length > 0 ? riskFactors.map((factor) => `- ${factor}`).join("\n") : "- No significant risk factors identified from the information provided"}

<h3 style="color: #dc2626; font-size: 20px; font-weight: bold; margin: 20px 0;">🚨 2. Urgency for Cardiologist Consultation</h3>

<div style="color: ${urgency.includes("URGENT") ? "#dc2626" : "#ea580c"}; font-size: 16px; font-weight: bold;">${urgency.includes("URGENT") ? "YES, URGENT consultation is recommended" : "YES, consultation with a cardiologist is recommended"} - ${urgency}</div>

${riskScore >= 7 ? "The combination of symptoms suggests potential cardiac issues that require immediate evaluation." : "Based on the symptoms and risk factors, professional cardiac evaluation is advisable."}

<h3 style="color: #0891b2; font-size: 18px; font-weight: bold; margin: 16px 0;">🔬 3. Suggested Next Steps & Diagnostic Tests</h3>

Your first step should be to see a General Physician or a Cardiologist. They will likely recommend the following tests:

1. <strong>Clinical Examination:</strong> Physical examination including heart auscultation to listen for murmurs or irregular sounds
2. <strong>Electrocardiogram (ECG/EKG):</strong> Records heart's electrical activity to detect rhythm abnormalities
3. <strong>Echocardiogram (ECHO):</strong> Ultrasound of the heart to assess structure, chamber size, and valve function
4. <strong>Blood Tests:</strong> Complete blood panel, lipid profile, and cardiac enzymes if indicated
5. <strong>Chest X-ray:</strong> To evaluate heart size and lung condition
${riskScore >= 6 ? '<br>6. <strong>Stress Test:</strong> May be recommended based on symptoms<br>7. <strong>Holter Monitor:</strong> 24-hour heart rhythm monitoring if palpitations are frequent' : ""}

<h3 style="color: #7c3aed; font-size: 18px; font-weight: bold; margin: 16px 0;">🏥 4. Possible Structural Heart Disease (SHD) Conditions</h3>

Based on your profile, a doctor would investigate several possibilities:

- <strong>Valvular Heart Disease:</strong> Conditions affecting heart valves (mitral, aortic, tricuspid, pulmonary)
- <strong>Cardiomyopathy:</strong> Diseases of the heart muscle including hypertrophic, dilated, or restrictive types
- <strong>Congenital Defects:</strong> Birth defects like atrial septal defect (ASD), ventricular septal defect (VSD)
- <strong>Coronary Artery Disease:</strong> Blockages in heart arteries
${data.familyHistory === "Yes" ? "- <strong>Genetic Cardiomyopathies:</strong> Given family history, inherited heart conditions should be evaluated" : ""}

<h3 style="color: #059669; font-size: 18px; font-weight: bold; margin: 16px 0;">💬 5. What to Tell Your Doctor</h3>

Be clear and specific. Create a list so you don't forget anything:

- "I am here because I've been experiencing ${[data.chestPain === "Yes" && "chest pain", data.sob === "Yes" && "shortness of breath", data.palpitations === "Yes" && "palpitations", data.syncope === "Yes" && "fainting episodes"].filter(Boolean).join(", ") || "concerns about my heart health"}."
- Describe the symptoms in detail: when they occur, how long they last, what triggers them
- "My current vital signs include blood pressure of ${data.bp}, heart rate of ${data.hr} BPM"
- "${data.smoking === "Yes" ? "I am a smoker" : "I do not smoke"} and ${data.alcohol === "Yes" ? "I consume alcohol" : "I do not drink alcohol"}"
- "${data.familyHistory === "Yes" ? "I have a family history of heart disease" : "No known family history of heart disease"}"
- Mention any medications you're currently taking

<h3 style="color: #dc2626; font-size: 18px; font-weight: bold; margin: 16px 0;">🏥 6. Cardiac Hospitals in ${data.city || "Your Area"}, India</h3>

Here are types of facilities to look for in ${data.city || "your city"}:

1. <strong>Government Medical Colleges:</strong> Often have excellent cardiology departments with experienced doctors
2. <strong>Multi-specialty Private Hospitals:</strong> Usually have advanced cardiac care units and latest equipment
3. <strong>Dedicated Heart Institutes:</strong> Specialized cardiac centers with comprehensive heart care services

<em>Consult local medical directories or online resources for specific hospitals in your area.</em>

<h3 style="color: #ea580c; font-size: 18px; font-weight: bold; margin: 16px 0;">🌍 7. Alternative Screening for Rural/Low-Resource Settings</h3>

If access to a cardiologist is difficult or delayed:

- <strong>Primary Care Doctor:</strong> Can perform initial evaluation and refer appropriately
- <strong>ECG at Local Clinic:</strong> Most basic health centers have ECG capability
- <strong>Telemedicine Consultation:</strong> Many hospitals now offer remote cardiology consultations
- <strong>Mobile Health Camps:</strong> Look out for cardiac screening camps in your area

<h3 style="color: #dc2626; font-size: 18px; font-weight: bold; margin: 16px 0;">🚨 8. Red Flags & Continuous Care Advice</h3>

<div style="color: #dc2626; font-weight: bold; margin: 12px 0;">Red Flags: Seek IMMEDIATE emergency care if you experience:</div>
- Severe crushing chest pain lasting more than a few minutes
- Chest pain with sweating, nausea, or shortness of breath
- Sudden severe shortness of breath
- Fainting or near-fainting episodes
- Severe dizziness with chest discomfort
- Rapid or very irregular heartbeat with symptoms

<div style="color: #059669; font-weight: bold; margin: 12px 0;">Continuous Care Advice:</div>
- <strong>Lifestyle Modifications:</strong> ${data.smoking === "Yes" ? "Quit smoking immediately - this is crucial for heart health" : "Continue avoiding smoking"}
- <strong>Regular Monitoring:</strong> Keep track of blood pressure and heart rate
- <strong>Diet:</strong> Heart-healthy diet low in salt, saturated fats, and rich in fruits and vegetables
- <strong>Exercise:</strong> Regular moderate exercise as cleared by your doctor
- <strong>Medication Compliance:</strong> Take prescribed medications exactly as directed
- <strong>Follow-up:</strong> Keep all scheduled appointments with your healthcare providers

<hr style="margin: 20px 0; border: 1px solid #ccc;">

<h3 style="color: #0891b2; font-size: 20px; font-weight: bold; margin: 20px 0;">👨‍⚕️ Doctor's Summary</h3>

<strong>Patient:</strong> ${data.name}, ${data.age}-year-old ${data.gender} from ${data.city || "Unknown location"}.

<strong>Presenting Complaint:</strong> ${[data.chestPain === "Yes" && "chest pain", data.sob === "Yes" && "shortness of breath", data.fatigue === "Yes" && "fatigue", data.palpitations === "Yes" && "palpitations", data.syncope === "Yes" && "syncope"].filter(Boolean).join(", ") || "Cardiac screening request"}

<strong>Vitals:</strong> ${data.bp ? `BP: ${data.bp}, ` : ""}${data.hr ? `HR: ${data.hr} BPM, ` : ""}${data.spo2 ? `SpO2: ${data.spo2}%` : ""}

<strong>Risk Factors:</strong> ${[data.smoking === "Yes" && "smoking", data.diabetes === "Yes" && "diabetes", data.familyHistory === "Yes" && "family history", data.hypertensive === "Yes" && "hypertensive medications"].filter(Boolean).join(", ") || "None identified"}

<strong>Assessment:</strong> ${riskScore >= 7 ? "High-risk presentation requiring urgent cardiology evaluation" : riskScore >= 5 ? "Moderate risk requiring timely cardiology consultation" : "Low to moderate risk, routine cardiology evaluation recommended"}. ${riskScore >= 6 ? "Multiple risk factors present warrant comprehensive cardiac workup." : "Standard cardiac screening protocols apply."}

<div style="color: #059669; font-weight: bold; margin: 12px 0;">Recommended Plan:</div>
1. ${urgency.includes("URGENT") ? "Urgent cardiology consultation within 24-48 hours" : "Cardiology consultation within 2-4 weeks"}
2. Initial workup: ECG, Echocardiogram, basic metabolic panel
3. ${riskScore >= 6 ? "Consider stress testing and extended monitoring" : "Standard diagnostic workup as per cardiologist recommendation"}
4. Lifestyle counseling regarding ${[data.smoking === "Yes" && "smoking cessation", "cardiac risk reduction", "regular follow-up"].filter(Boolean).join(", ")}

<div style="color: #dc2626; font-style: italic; margin-top: 16px;"><strong>Note:</strong> This assessment is based on provided information and should not replace professional medical evaluation. Seek immediate medical attention for any acute symptoms.</div>
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
