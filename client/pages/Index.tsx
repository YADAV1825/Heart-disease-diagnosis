import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Heart, Activity, User, FileText, Download, RotateCcw, Moon, Sun } from "lucide-react";
import { MedicalAnalysisRequest, MedicalAnalysisResponse } from "@shared/api";

export default function Index() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string>("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState<MedicalAnalysisRequest>({
    name: "",
    age: "",
    ageGroup: "",
    gender: "",
    height: "",
    weight: "",
    city: "",
    bp: "",
    hr: "",
    spo2: "",
    allergies: "",
    smoking: "",
    alcohol: "",
    tobacco: "",
    hypertensive: "",
    diabetes: "",
    cyanosis: "",
    chestPain: "",
    fatigue: "",
    sob: "",
    syncope: "",
    palpitations: "",
    familyHistory: "",
    feeding: "",
    symptoms: ""
  });

  const updateField = (field: keyof MedicalAnalysisRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/medical-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      const data: MedicalAnalysisResponse = await response.json();
      
      if (data.success) {
        setAnalysis(data.analysis);
      } else {
        setAnalysis(`Error: ${data.error}`);
      }
    } catch (error) {
      setAnalysis("Failed to analyze medical data. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearAll = () => {
    setFormData({
      name: "",
      age: "",
      ageGroup: "",
      gender: "",
      height: "",
      weight: "",
      city: "",
      bp: "",
      hr: "",
      spo2: "",
      allergies: "",
      smoking: "",
      alcohol: "",
      tobacco: "",
      hypertensive: "",
      diabetes: "",
      cyanosis: "",
      chestPain: "",
      fatigue: "",
      sob: "",
      syncope: "",
      palpitations: "",
      familyHistory: "",
      feeding: "",
      symptoms: ""
    });
    setAnalysis("");
  };

  const generatePDF = () => {
    const content = `
Structural Heart Disease Screening Report

Patient: ${formData.name}
Age: ${formData.age} years
Gender: ${formData.gender}
City: ${formData.city}

Analysis Results:
${analysis}

Generated on: ${new Date().toLocaleDateString()}
    `;
    
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "SHD_AI_Report.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('light');
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDarkMode ? '' : 'light'}`}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-medical-blue/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-medical-green/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-3/4 w-56 h-56 bg-medical-purple/10 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/20 medical-glow animate-pulse-glow">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-medical-blue bg-clip-text text-transparent">
                CardioAI Screening
              </h1>
              <p className="text-muted-foreground">Advanced Structural Heart Disease Detection</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full border-primary/20 hover:bg-primary/10"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card className="medical-card border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Patient Information
                </CardTitle>
                <CardDescription>Complete medical screening form for AI analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Basic Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-primary/20">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-primary">Basic Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-primary">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        className="bg-background/50 border-primary/20 focus:border-primary"
                        placeholder="Enter patient name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-primary">Age *</Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.age}
                        onChange={(e) => updateField("age", e.target.value)}
                        className="bg-background/50 border-primary/20 focus:border-primary"
                        placeholder="Enter age"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender" className="text-primary">Gender *</Label>
                      <Select value={formData.gender} onValueChange={(value) => updateField("gender", value)}>
                        <SelectTrigger className="bg-background/50 border-primary/20">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ageGroup" className="text-primary">Age Group</Label>
                      <Select value={formData.ageGroup} onValueChange={(value) => updateField("ageGroup", value)}>
                        <SelectTrigger className="bg-background/50 border-primary/20">
                          <SelectValue placeholder="Select age group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Newborn">Newborn</SelectItem>
                          <SelectItem value="Child">Child</SelectItem>
                          <SelectItem value="Adult">Adult</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height" className="text-primary">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={formData.height}
                        onChange={(e) => updateField("height", e.target.value)}
                        className="bg-background/50 border-primary/20 focus:border-primary"
                        placeholder="170"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight" className="text-primary">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={formData.weight}
                        onChange={(e) => updateField("weight", e.target.value)}
                        className="bg-background/50 border-primary/20 focus:border-primary"
                        placeholder="70"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="city" className="text-primary">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        className="bg-background/50 border-primary/20 focus:border-primary"
                        placeholder="Enter city name"
                      />
                    </div>
                  </div>
                </div>

                {/* Vitals Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-medical-red/20">
                    <div className="p-2 rounded-lg bg-medical-red/10">
                      <Activity className="w-5 h-5 text-medical-red" />
                    </div>
                    <h3 className="text-xl font-semibold text-medical-red">Vital Signs</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bp" className="text-medical-red">Blood Pressure</Label>
                      <Input
                        id="bp"
                        value={formData.bp}
                        onChange={(e) => updateField("bp", e.target.value)}
                        className="bg-background/50 border-medical-red/20 focus:border-medical-red"
                        placeholder="120/80"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hr" className="text-medical-red">Heart Rate (BPM)</Label>
                      <Input
                        id="hr"
                        type="number"
                        value={formData.hr}
                        onChange={(e) => updateField("hr", e.target.value)}
                        className="bg-background/50 border-medical-red/20 focus:border-medical-red"
                        placeholder="72"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="spo2" className="text-medical-blue">SpO2 (%)</Label>
                      <Input
                        id="spo2"
                        type="number"
                        value={formData.spo2}
                        onChange={(e) => updateField("spo2", e.target.value)}
                        className="bg-background/50 border-medical-blue/20 focus:border-medical-blue"
                        placeholder="98"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="allergies" className="text-medical-orange">Allergies</Label>
                      <Input
                        id="allergies"
                        value={formData.allergies}
                        onChange={(e) => updateField("allergies", e.target.value)}
                        className="bg-background/50 border-medical-orange/20 focus:border-medical-orange"
                        placeholder="None / List allergies"
                      />
                    </div>
                  </div>
                </div>

                {/* Lifestyle Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-medical-purple/20">
                    <div className="p-2 rounded-lg bg-medical-purple/10">
                      <Heart className="w-5 h-5 text-medical-purple" />
                    </div>
                    <h3 className="text-xl font-semibold text-medical-purple">Lifestyle & Medical History</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: "smoking", label: "Smoking" },
                      { key: "alcohol", label: "Alcohol" },
                      { key: "tobacco", label: "Tobacco" },
                      { key: "hypertensive", label: "Hypertensive Drugs" },
                      { key: "diabetes", label: "Diabetes/High Sugar" }
                    ].map(({ key, label }) => (
                      <div key={key} className="space-y-2">
                        <Label htmlFor={key} className="text-medical-purple">{label}</Label>
                        <Select
                          value={formData[key as keyof MedicalAnalysisRequest]}
                          onValueChange={(value) => updateField(key as keyof MedicalAnalysisRequest, value)}
                        >
                          <SelectTrigger className="bg-background/50 border-medical-purple/20">
                            <SelectValue placeholder="Select Yes/No" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Symptoms Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-medical-green/20">
                    <div className="p-2 rounded-lg bg-medical-green/10">
                      <FileText className="w-5 h-5 text-medical-green" />
                    </div>
                    <h3 className="text-xl font-semibold text-medical-green">Symptoms Assessment</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {[
                      { key: "cyanosis", label: "Cyanosis (Blue lips/skin)" },
                      { key: "chestPain", label: "Chest Pain" },
                      { key: "fatigue", label: "Fatigue" },
                      { key: "sob", label: "Shortness of Breath" },
                      { key: "syncope", label: "Syncope (Fainting)" },
                      { key: "palpitations", label: "Palpitations" },
                      { key: "familyHistory", label: "Family History of SHD" },
                      { key: "feeding", label: "Feeding Issues (newborn only)" }
                    ].map(({ key, label }) => (
                      <div key={key} className="space-y-2">
                        <Label htmlFor={key} className="text-medical-green">{label}</Label>
                        <Select
                          value={formData[key as keyof MedicalAnalysisRequest]}
                          onValueChange={(value) => updateField(key as keyof MedicalAnalysisRequest, value)}
                        >
                          <SelectTrigger className="bg-background/50 border-medical-green/20">
                            <SelectValue placeholder="Select Yes/No" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="symptoms" className="text-medical-green">Additional Symptoms & Notes</Label>
                    <Textarea
                      id="symptoms"
                      value={formData.symptoms}
                      onChange={(e) => updateField("symptoms", e.target.value)}
                      className="bg-background/50 border-medical-green/20 focus:border-medical-green min-h-[120px]"
                      placeholder="Describe any other symptoms, concerns, or relevant medical history..."
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <Button
                    onClick={handleAnalysis}
                    disabled={isAnalyzing || !formData.name || !formData.age || !formData.gender}
                    className="flex-1 bg-gradient-to-r from-primary to-medical-blue hover:from-primary/80 hover:to-medical-blue/80 medical-glow"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Activity className="w-4 h-4 mr-2" />
                        Analyze Heart Health
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={clearAll}
                    variant="outline"
                    className="border-destructive/20 text-destructive hover:bg-destructive/10"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-1">
            <Card className="medical-card border-medical-blue/20 h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-medical-blue" />
                  AI Analysis Results
                </CardTitle>
                <CardDescription>
                  Comprehensive structural heart disease assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analysis ? (
                  <div className="space-y-4">
                    <div className="bg-secondary/20 rounded-lg p-4 border border-medical-blue/20">
                      <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
                        {analysis}
                      </pre>
                    </div>
                    
                    <Button
                      onClick={generatePDF}
                      variant="outline"
                      className="w-full border-medical-green/20 text-medical-green hover:bg-medical-green/10"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Report
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Complete the form and click "Analyze Heart Health" to see AI-powered medical insights.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
