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
<div class="medical-report">
<div class="disclaimer">
<strong>⚠️ Disclaimer:</strong> This is a clinical assistance tool and not a substitute for professional medical diagnosis. You must consult a qualified healthcare professional for any health concerns.
</div>

<div class="report-header">
<h2 class="patient-title">🏥 Preliminary SHD Assessment for <span class="patient-name">${data.name}</span></h2>
</div>

<div class="intro-text">
Hello <strong>${data.name}</strong>, thank you for providing your information. Based on the details you've shared about your symptoms, lifestyle, and vitals, here is a detailed assessment.
</div>

<div class="info-section">
<h3 class="section-title">👤 Patient Information</h3>
<div class="info-grid">
<div class="info-item"><span class="label">Name:</span> <span class="value">${data.name}</span></div>
<div class="info-item"><span class="label">Age:</span> <span class="value">${data.age} years (${data.ageGroup})</span></div>
<div class="info-item"><span class="label">Gender:</span> <span class="value">${data.gender}</span></div>
<div class="info-item"><span class="label">Height:</span> <span class="value">${data.height} cm</span></div>
<div class="info-item"><span class="label">Weight:</span> <span class="value">${data.weight} kg</span></div>
<div class="info-item"><span class="label">BMI:</span> <span class="value bmi-value">${bmi}${bmi !== "Not calculated" ? (parseFloat(bmi) < 18.5 ? " (Underweight)" : parseFloat(bmi) < 25 ? " (Normal)" : parseFloat(bmi) < 30 ? " (Overweight)" : " (Obese)") : ""}</span></div>
<div class="info-item"><span class="label">Location:</span> <span class="value">${data.city}</span></div>
</div>
</div>

<div class="vitals-section">
<h3 class="section-title">💓 Vitals</h3>
<div class="vitals-grid">
<div class="vital-item"><span class="vital-label">Blood Pressure:</span> <span class="vital-value">${data.bp}</span></div>
<div class="vital-item"><span class="vital-label">Heart Rate:</span> <span class="vital-value">${data.hr} BPM</span></div>
<div class="vital-item"><span class="vital-label">SpO2:</span> <span class="vital-value">${data.spo2}%</span></div>
<div class="vital-item"><span class="vital-label">Allergies:</span> <span class="vital-value">${data.allergies || "None reported"}</span></div>
</div>
</div>

<div class="risk-factors-section">
<h3 class="section-title">⚠️ Risk Factors</h3>
<div class="risk-factors-grid">
<div class="risk-factor-item"><span class="risk-label">Smoking:</span> <span class="risk-value ${data.smoking === 'Yes' ? 'risk-high' : 'risk-low'}">${data.smoking}</span></div>
<div class="risk-factor-item"><span class="risk-label">Alcohol:</span> <span class="risk-value ${data.alcohol === 'Daily' || data.alcohol === 'Weekly' ? 'risk-high' : 'risk-low'}">${data.alcohol}</span></div>
<div class="risk-factor-item"><span class="risk-label">Tobacco:</span> <span class="risk-value ${data.tobacco === 'Yes' ? 'risk-high' : 'risk-low'}">${data.tobacco}</span></div>
<div class="risk-factor-item"><span class="risk-label">Hypertensive Drugs:</span> <span class="risk-value ${data.hypertensive === 'Yes' ? 'risk-moderate' : 'risk-low'}">${data.hypertensive}</span></div>
<div class="risk-factor-item"><span class="risk-label">Diabetes/High Sugar:</span> <span class="risk-value ${data.diabetes === 'Yes' ? 'risk-high' : 'risk-low'}">${data.diabetes}</span></div>
</div>
</div>

<div class="symptoms-section">
<h3 class="section-title">🩺 Symptoms Assessment</h3>
<div class="symptoms-grid">
<div class="symptom-item"><span class="symptom-label">Cyanosis (Blue lips/skin):</span> <span class="symptom-value ${data.cyanosis === 'Yes' ? 'symptom-present' : 'symptom-absent'}">${data.cyanosis}</span></div>
<div class="symptom-item"><span class="symptom-label">Chest Pain:</span> <span class="symptom-value ${data.chestPain === 'Yes' ? 'symptom-present' : 'symptom-absent'}">${data.chestPain}</span></div>
<div class="symptom-item"><span class="symptom-label">Fatigue:</span> <span class="symptom-value ${data.fatigue === 'Yes' ? 'symptom-present' : 'symptom-absent'}">${data.fatigue}</span></div>
<div class="symptom-item"><span class="symptom-label">Shortness of Breath:</span> <span class="symptom-value ${data.sob === 'Yes' ? 'symptom-present' : 'symptom-absent'}">${data.sob}</span></div>
<div class="symptom-item"><span class="symptom-label">Syncope (Fainting):</span> <span class="symptom-value ${data.syncope === 'Yes' ? 'symptom-present' : 'symptom-absent'}">${data.syncope}</span></div>
<div class="symptom-item"><span class="symptom-label">Palpitations:</span> <span class="symptom-value ${data.palpitations === 'Yes' ? 'symptom-present' : 'symptom-absent'}">${data.palpitations}</span></div>
<div class="symptom-item"><span class="symptom-label">Family History of SHD:</span> <span class="symptom-value ${data.familyHistory === 'Yes' ? 'symptom-present' : 'symptom-absent'}">${data.familyHistory}</span></div>
<div class="symptom-item"><span class="symptom-label">Feeding Issues:</span> <span class="symptom-value ${data.feeding === 'Yes' ? 'symptom-present' : 'symptom-absent'}">${data.feeding}</span></div>
<div class="symptom-item"><span class="symptom-label">Additional Symptoms:</span> <span class="symptom-value">${data.symptoms || "None reported"}</span></div>
</div>
</div>

<div class="risk-assessment-section">
<h3 class="section-title">📊 1. Estimated Risk Score for Structural Heart Disease</h3>
<div class="risk-score-card">
<div class="score-display">
<span class="score-label">Risk Score:</span>
<span class="score-value risk-${riskLevel.toLowerCase()}">${riskScore}/10</span>
<span class="risk-badge risk-${riskLevel.toLowerCase()}">${riskLevel} Risk</span>
</div>
</div>

<div class="risk-drivers">
<h4 class="subsection-title">Primary Drivers of this Score:</h4>
<div class="drivers-list">
${riskFactors.length > 0 ? riskFactors.map((factor) => `<div class="driver-item">🔹 ${factor}</div>`).join("") : "<div class='driver-item'>🔹 No significant risk factors identified from the information provided</div>"}
</div>
</div>
</div>

<div class="urgency-section">
<h3 class="section-title">🚨 2. Urgency for Cardiologist Consultation</h3>
<div class="urgency-card ${urgency.includes('URGENT') ? 'urgent-high' : 'urgent-moderate'}">
<div class="urgency-text">
<strong>${urgency.includes("URGENT") ? "YES, URGENT consultation is recommended" : "YES, consultation with a cardiologist is recommended"}</strong>
</div>
<div class="urgency-timeline">${urgency}</div>
</div>
<div class="urgency-explanation">
${riskScore >= 7 ? "The combination of symptoms suggests potential cardiac issues that require immediate evaluation." : "Based on the symptoms and risk factors, professional cardiac evaluation is advisable."}
</div>
</div>

<div class="tests-section">
<h3 class="section-title">🔬 3. Suggested Next Steps & Diagnostic Tests</h3>
<div class="tests-intro">
Your first step should be to see a General Physician or a Cardiologist. They will likely recommend the following tests:
</div>
<div class="tests-list">
<div class="test-item"><span class="test-number">1.</span> <span class="test-name">Clinical Examination:</span> <span class="test-description">Physical examination including heart auscultation to listen for murmurs or irregular sounds</span></div>
<div class="test-item"><span class="test-number">2.</span> <span class="test-name">Electrocardiogram (ECG/EKG):</span> <span class="test-description">Records heart's electrical activity to detect rhythm abnormalities</span></div>
<div class="test-item"><span class="test-number">3.</span> <span class="test-name">Echocardiogram (ECHO):</span> <span class="test-description">Ultrasound of the heart to assess structure, chamber size, and valve function</span></div>
<div class="test-item"><span class="test-number">4.</span> <span class="test-name">Blood Tests:</span> <span class="test-description">Complete blood panel, lipid profile, and cardiac enzymes if indicated</span></div>
<div class="test-item"><span class="test-number">5.</span> <span class="test-name">Chest X-ray:</span> <span class="test-description">To evaluate heart size and lung condition</span></div>
${riskScore >= 6 ? '<div class="test-item"><span class="test-number">6.</span> <span class="test-name">Stress Test:</span> <span class="test-description">May be recommended based on symptoms</span></div><div class="test-item"><span class="test-number">7.</span> <span class="test-name">Holter Monitor:</span> <span class="test-description">24-hour heart rhythm monitoring if palpitations are frequent</span></div>' : ""}
</div>
</div>

<div class="conditions-section">
<h3 class="section-title">🏥 4. Possible Structural Heart Disease (SHD) Conditions</h3>

<div class="conditions-intro">
Based on your profile, a doctor would investigate several possibilities:
</div>
<div class="conditions-list">
<div class="condition-item"><span class="condition-name">Valvular Heart Disease:</span> <span class="condition-description">Conditions affecting heart valves (mitral, aortic, tricuspid, pulmonary)</span></div>
<div class="condition-item"><span class="condition-name">Cardiomyopathy:</span> <span class="condition-description">Diseases of the heart muscle including hypertrophic, dilated, or restrictive types</span></div>
<div class="condition-item"><span class="condition-name">Congenital Defects:</span> <span class="condition-description">Birth defects like atrial septal defect (ASD), ventricular septal defect (VSD)</span></div>
<div class="condition-item"><span class="condition-name">Coronary Artery Disease:</span> <span class="condition-description">Blockages in heart arteries</span></div>
${data.familyHistory === "Yes" ? '<div class="condition-item"><span class="condition-name">Genetic Cardiomyopathies:</span> <span class="condition-description">Given family history, inherited heart conditions should be evaluated</span></div>' : ""}
</div>
</div>

<div class="doctor-advice-section">
<h3 class="section-title">💬 5. What to Tell Your Doctor</h3>
<div class="advice-intro">
Be clear and specific. Create a list so you don't forget anything:
</div>
<div class="advice-list">
<div class="advice-item">🗣️ "I am here because I've been experiencing ${[data.chestPain === "Yes" && "chest pain", data.sob === "Yes" && "shortness of breath", data.palpitations === "Yes" && "palpitations", data.syncope === "Yes" && "fainting episodes"].filter(Boolean).join(", ") || "concerns about my heart health"}."</div>
<div class="advice-item">📝 Describe the symptoms in detail: when they occur, how long they last, what triggers them</div>
<div class="advice-item">📊 "My current vital signs include blood pressure of ${data.bp}, heart rate of ${data.hr} BPM"</div>
<div class="advice-item">🚭 "${data.smoking === "Yes" ? "I am a smoker" : "I do not smoke"} and ${data.alcohol === "Yes" ? "I consume alcohol" : "I do not drink alcohol"}"</div>
<div class="advice-item">👪 "${data.familyHistory === "Yes" ? "I have a family history of heart disease" : "No known family history of heart disease"}"</div>
<div class="advice-item">💊 Mention any medications you're currently taking</div>
</div>
</div>

<div class="hospitals-section">
<h3 class="section-title">🏥 6. Cardiac Hospitals in ${data.city || "Your Area"}, India</h3>
<div class="hospitals-intro">
Here are types of facilities to look for in ${data.city || "your city"}:
</div>
<div class="hospitals-list">
<div class="hospital-item"><span class="hospital-type">Government Medical Colleges:</span> <span class="hospital-description">Often have excellent cardiology departments with experienced doctors</span></div>
<div class="hospital-item"><span class="hospital-type">Multi-specialty Private Hospitals:</span> <span class="hospital-description">Usually have advanced cardiac care units and latest equipment</span></div>
<div class="hospital-item"><span class="hospital-type">Dedicated Heart Institutes:</span> <span class="hospital-description">Specialized cardiac centers with comprehensive heart care services</span></div>
</div>
<div class="hospitals-note">
<em>Consult local medical directories or online resources for specific hospitals in your area.</em>
</div>
</div>

<div class="alternative-section">
<h3 class="section-title">🌍 7. Alternative Screening for Rural/Low-Resource Settings</h3>
<div class="alternative-intro">
If access to a cardiologist is difficult or delayed:
</div>
<div class="alternative-list">
<div class="alternative-item"><span class="alternative-type">Primary Care Doctor:</span> <span class="alternative-description">Can perform initial evaluation and refer appropriately</span></div>
<div class="alternative-item"><span class="alternative-type">ECG at Local Clinic:</span> <span class="alternative-description">Most basic health centers have ECG capability</span></div>
<div class="alternative-item"><span class="alternative-type">Telemedicine Consultation:</span> <span class="alternative-description">Many hospitals now offer remote cardiology consultations</span></div>
<div class="alternative-item"><span class="alternative-type">Mobile Health Camps:</span> <span class="alternative-description">Look out for cardiac screening camps in your area</span></div>
</div>
</div>

<div class="red-flags-section">
<h3 class="section-title">🚨 8. Red Flags & Continuous Care Advice</h3>
<div class="red-flags">
<h4 class="red-flags-title">Red Flags: Seek IMMEDIATE emergency care if you experience:</h4>
<div class="red-flags-list">
<div class="red-flag-item">⚠️ Severe crushing chest pain lasting more than a few minutes</div>
<div class="red-flag-item">⚠️ Chest pain with sweating, nausea, or shortness of breath</div>
<div class="red-flag-item">⚠️ Sudden severe shortness of breath</div>
<div class="red-flag-item">⚠️ Fainting or near-fainting episodes</div>
<div class="red-flag-item">⚠️ Severe dizziness with chest discomfort</div>
<div class="red-flag-item">⚠️ Rapid or very irregular heartbeat with symptoms</div>
</div>
</div>

<div class="continuous-care">
<h4 class="continuous-care-title">Continuous Care Advice:</h4>
- **Lifestyle Modifications:** ${data.smoking === "Yes" ? "Quit smoking immediately - this is crucial for heart health" : "Continue avoiding smoking"}
- **Regular Monitoring:** Keep track of blood pressure and heart rate
- **Diet:** Heart-healthy diet low in salt, saturated fats, and rich in fruits and vegetables
- **Exercise:** Regular moderate exercise as cleared by your doctor
- **Medication Compliance:** Take prescribed medications exactly as directed
- **Follow-up:** Keep all scheduled appointments with your healthcare providers

---

### **Doctor's Summary**

**Patient:** ${data.name}, ${data.age}-year-old ${data.gender} from ${data.city || "Unknown location"}.

**Presenting Complaint:** ${[data.chestPain === "Yes" && "chest pain", data.sob === "Yes" && "shortness of breath", data.fatigue === "Yes" && "fatigue", data.palpitations === "Yes" && "palpitations", data.syncope === "Yes" && "syncope"].filter(Boolean).join(", ") || "Cardiac screening request"}

**Vitals:** ${data.bp ? `BP: ${data.bp}, ` : ""}${data.hr ? `HR: ${data.hr} BPM, ` : ""}${data.spo2 ? `SpO2: ${data.spo2}%` : ""}

**Risk Factors:** ${[data.smoking === "Yes" && "smoking", data.diabetes === "Yes" && "diabetes", data.familyHistory === "Yes" && "family history", data.hypertensive === "Yes" && "hypertensive medications"].filter(Boolean).join(", ") || "None identified"}

**Assessment:** ${riskScore >= 7 ? "High-risk presentation requiring urgent cardiology evaluation" : riskScore >= 5 ? "Moderate risk requiring timely cardiology consultation" : "Low to moderate risk, routine cardiology evaluation recommended"}. ${riskScore >= 6 ? "Multiple risk factors present warrant comprehensive cardiac workup." : "Standard cardiac screening protocols apply."}

**Recommended Plan:**
1. ${urgency.includes("URGENT") ? "Urgent cardiology consultation within 24-48 hours" : "Cardiology consultation within 2-4 weeks"}
2. Initial workup: ECG, Echocardiogram, basic metabolic panel
3. ${riskScore >= 6 ? "Consider stress testing and extended monitoring" : "Standard diagnostic workup as per cardiologist recommendation"}
4. Lifestyle counseling regarding ${[data.smoking === "Yes" && "smoking cessation", "cardiac risk reduction", "regular follow-up"].filter(Boolean).join(", ")}

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
