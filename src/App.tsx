import React, { useState, useEffect } from "react";
import { 
  Sprout, 
  MapPin, 
  Droplets, 
  Flame, 
  Compass, 
  TrendingUp, 
  Share2, 
  Activity, 
  Globe, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  RotateCcw,
  BarChart4,
  LineChart,
  HelpCircle,
  Sparkles,
  Search,
  Check,
  Percent
} from "lucide-react";
import { translations, Language, TranslationDict } from "./translations";

import soil3dCrossSection from "./assets/images/soil_3d_cross_section_1781601233437.jpg";
import soil2dAnalysisChart from "./assets/images/soil_2d_analysis_chart_1781601252378.jpg";

interface SoilInfo {
  mandal: string;
  name: string;
  typeKey: string;
  description: string;
  waterRetention: string;
  fertility: string;
  drainageCapacity: string;
}

interface SoilCondition {
  mandal: string;
  soilType: string;
  status: "Excellent" | "Good" | "Moderate" | "Poor";
  parameters: {
    pH: { current: number; ideal: number };
    nitrogen: { current: number; ideal: number };
    phosphorus: { current: number; ideal: number };
    potassium: { current: number; ideal: number };
    organicCarbon: { current: number; ideal: number };
    moisture: { current: number; ideal: number };
  };
}

interface CropRec {
  crop: string;
  percentage: number;
}

export default function App() {
  const [lang, setLang] = useState<Language>("en");
  
  // Farmer authentication state
  const [user, setUser] = useState<{ name: string; mobile: string; pin: string; isLoggedIn: boolean } | null>(() => {
    try {
      const saved = localStorage.getItem("soil_depictor_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Login Form States
  const [loginName, setLoginName] = useState<string>("");
  const [loginMobile, setLoginMobile] = useState<string>("");
  const [loginPin, setLoginPin] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [isLogining, setIsLogining] = useState<boolean>(false);

  const [step, setStep] = useState<number>(0); // 0: Lang, 0.5: Login, 1: Location, 2: Soil Info, 3: Soil Condition, 4: Analytics, 5: Crop Recommendation

  // Location State
  const [districts, setDistricts] = useState<string[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [mandals, setMandals] = useState<string[]>([]);
  const [selectedMandal, setSelectedMandal] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetched Data State
  const [soilInfo, setSoilInfo] = useState<SoilInfo | null>(null);
  const [soilCondition, setSoilCondition] = useState<SoilCondition | null>(null);
  const [cropRecs, setCropRecs] = useState<CropRec[]>([]);

  // Hover states for tooltips in SVG Charts
  const [barHovered, setBarHovered] = useState<{ param: string; current: number; ideal: number } | null>(null);
  const [lineHovered, setLineHovered] = useState<{ month: string; health: number; crop: number } | null>(null);
  const [radarHovered, setRadarHovered] = useState<{ label: string; val: number; ideal: number } | null>(null);

  const t: TranslationDict = translations[lang];

  // Fetch districts on mount
  useEffect(() => {
    fetch("/api/districts")
      .then((res) => res.json())
      .then((data) => {
        if (data.districts) {
          setDistricts(data.districts);
        }
      })
      .catch((err) => {
        console.error("Districts fetch error, fallback to local:", err);
        // Fallback lists
        setDistricts([
          "Anakapalli", "Anantapur", "Annamayya", "Bapatla", "Chittoor", "Dr. B.R. Ambedkar Konaseema",
          "East Godavari", "Eluru", "Guntur", "Kakinada", "Krishna", "Kurnool", "Nandyal", "NTR", "Palnadu",
          "Parvathipuram Manyam", "Prakasam", "Srikakulam", "Sri Potti Sriramulu Nellore", "Sri Sathya Sai",
          "Tirupati", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa", "Alluri Sitarama Raju"
        ].sort());
      });
  }, []);

  // Fetch mandals when selectedDistrict changes
  useEffect(() => {
    if (!selectedDistrict) {
      setMandals([]);
      setSelectedMandal("");
      return;
    }

    setIsLoading(true);
    fetch(`/api/mandals?district=${selectedDistrict}`)
      .then((res) => res.json())
      .then((data) => {
        setMandals(data.mandals || []);
        setSelectedMandal("");
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Mandals fetch error", err);
        // Fallback for Visakhapatnam
        if (selectedDistrict === "Visakhapatnam") {
          setMandals([
            "Anandapuram", "Bheemunipatnam", "Gajuwaka", "Gopalapatnam", "Maharanipeta", "Mulagada",
            "Padmanabham", "Pedagantyada", "Pendurthi", "Seethammadhara", "Visakhapatnam Rural"
          ].sort());
        } else {
          setMandals([]);
        }
        setSelectedMandal("");
        setIsLoading(false);
      });
  }, [selectedDistrict]);

  // Handle Find Soil Details (Move to Step 2)
  const handleFindSoilDetails = async () => {
    if (!selectedDistrict || (selectedDistrict === "Visakhapatnam" && !selectedMandal)) {
      return;
    }

    setIsLoading(true);

    // If Visakhapatnam, load soil details from express backend
    const targetMandal = selectedDistrict === "Visakhapatnam" ? selectedMandal : "Anandapuram"; // default mock mandal for other districts

    try {
      // 1. Fetch soil info
      const soilRes = await fetch(`/api/soil/${encodeURIComponent(targetMandal)}`);
      const soilData = await soilRes.json();
      setSoilInfo(soilData);

      // 2. Fetch soil condition analysis
      const condRes = await fetch(`/api/soil-condition/${encodeURIComponent(targetMandal)}`);
      const condData = await condRes.json();
      setSoilCondition(condData);

      // 3. Fetch crop recommendations based on soil type key
      const recRes = await fetch(`/api/crop-recommendation/${encodeURIComponent(soilData.typeKey)}`);
      const recData = await recRes.json();
      setCropRecs(recData.recommendations || []);

      setStep(2);
    } catch (err) {
      console.error("Error retrieving full soil stack, using smart mock system:", err);
      // Fallback fallback client safety data
      const mockSoil: SoilInfo = {
        mandal: targetMandal,
        name: "Red Loamy Soil",
        typeKey: "red_loamy",
        description: "Rich in iron oxides with porous loamy texture. Highly optimal for deep-rooting systems.",
        waterRetention: "Medium",
        fertility: "High",
        drainageCapacity: "Good"
      };
      setSoilInfo(mockSoil);

      const mockCondition: SoilCondition = {
        mandal: targetMandal,
        soilType: "Red Loamy Soil",
        status: "Good",
        parameters: {
          pH: { current: 6.8, ideal: 7.0 },
          nitrogen: { current: 78, ideal: 100 },
          phosphorus: { current: 72, ideal: 100 },
          potassium: { current: 85, ideal: 100 },
          organicCarbon: { current: 65, ideal: 100 },
          moisture: { current: 60, ideal: 100 }
        }
      };
      setSoilCondition(mockCondition);

      setCropRecs([
        { crop: "Mango", percentage: 95 },
        { crop: "Groundnut", percentage: 92 },
        { crop: "Ragi", percentage: 90 },
        { crop: "Cashew", percentage: 88 },
        { crop: "Paddy", percentage: 85 },
        { crop: "Sugarcane", percentage: 80 },
        { crop: "Coconut", percentage: 75 }
      ]);
      setStep(2);
    } finally {
      setIsLoading(false);
    }
  };

  // Restarts the analysis pipeline
  const handleRestart = () => {
    setSelectedDistrict("");
    setSelectedMandal("");
    setSoilInfo(null);
    setSoilCondition(null);
    setCropRecs([]);
    setStep(1);
  };

  // Custom visual components for Soil Condition display
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Excellent": return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "Good": return "text-green-600 bg-green-50 border-green-200";
      case "Moderate": return "text-amber-600 bg-amber-50 border-amber-200";
      case "Poor": return "text-rose-600 bg-rose-50 border-rose-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getPercentageColor = (percent: number) => {
    if (percent >= 90) return "stroke-emerald-600 text-emerald-600 bg-emerald-50";
    if (percent >= 80) return "stroke-green-500 text-green-600 bg-green-50";
    if (percent >= 70) return "stroke-yellow-500 text-yellow-600 bg-yellow-50";
    return "stroke-amber-500 text-amber-600 bg-amber-50";
  };

  return (
    <div id="soil-depictor-root" className="min-h-screen bg-[#f3f6f1] text-[#2d3a24] relative flex flex-col font-sans transition-colors duration-300 overflow-x-hidden">
      
      {/* Decorative Floating Leaves & Field Lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20 z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cfded0" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          {/* Decorative agricultural contours */}
          <path d="M-100,200 Q200,400 400,200 T900,400 T1400,100" fill="none" stroke="#bcd4bd" strokeWidth="1.5" />
          <path d="M-50,300 Q250,500 500,250 T1000,500 T1500,200" fill="none" stroke="#a3c4a4" strokeWidth="1" strokeDasharray="5,5" />
        </svg>
      </div>

      {/* Dynamic Header */}
      <header id="app-header" className="sticky top-0 bg-[#f3f6f1]/90 backdrop-blur-md border-b border-[#e2eae3] z-50 transition-all">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#4c7c4f] text-white rounded-2xl shadow-md shadow-[#4c7c4f]/20 animate-pulse">
              <Sprout className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-[#1c3822]">
                {t.title}
              </h1>
              <p className="text-xs text-[#527055] font-medium tracking-wide italic">
                "{t.tagline}"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user && user.isLoggedIn && (
              <div className="flex items-center gap-2 bg-emerald-50/90 border border-emerald-200/60 rounded-xl px-2.5 py-1 shadow-sm transition-all animate-fade-in">
                <div className="w-5 h-5 rounded-full bg-[#4c7c4f] text-white flex items-center justify-center font-black text-[10px] uppercase shrink-0">
                  {user.name.charAt(0)}
                </div>
                <div className="text-left leading-none hidden sm:block">
                  <span className="text-[8px] text-emerald-800 font-extrabold uppercase block">{t.farmerProfile}</span>
                  <span className="text-[11px] text-[#1c3822] font-black max-w-[100px] truncate block">{user.name}</span>
                </div>
                <button 
                  onClick={() => {
                    setUser(null);
                    localStorage.removeItem("soil_depictor_user");
                    setStep(0);
                  }}
                  className="ml-1 text-[10px] font-black text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100/50 px-1.5 py-1 rounded-md transition-colors cursor-pointer uppercase tracking-wider"
                  title={t.logoutBtn}
                >
                  {t.logoutBtn}
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 bg-white/80 p-1 rounded-xl border border-[#dfe7e0] shadow-sm">
              <Globe className="w-4 h-4 text-[#527055] ml-2" />
              <button
                onClick={() => setLang("en")}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  lang === "en" ? "bg-[#4c7c4f] text-white shadow-sm" : "text-[#527055] hover:bg-gray-100"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang("te")}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  lang === "te" ? "bg-[#4c7c4f] text-white shadow-sm" : "text-[#527055] hover:bg-gray-100"
                }`}
              >
                తెలుగు
              </button>
              <button
                onClick={() => setLang("hi")}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  lang === "hi" ? "bg-[#4c7c4f] text-white shadow-sm" : "text-[#527055] hover:bg-gray-100"
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main id="app-main-content" className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 md:py-10 z-10">
        
        {/* Step Stepper Indicator - only shown if past initial language select & login */}
        {step >= 1 && (
          <div id="step-bubbles" className="mb-8 bg-white/70 p-4 rounded-2xl border border-[#e2eae3] shadow-sm backdrop-blur-sm max-w-4xl mx-auto">
            <div className="flex justify-between items-center relative">
              <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[3px] bg-[#d3dfd5] z-0"></div>
              <div 
                className="absolute left-6 top-1/2 -translate-y-1/2 h-[3px] bg-[#4c7c4f] transition-all duration-500 z-0"
                style={{ width: `${((step - 1) / 4) * 100}%` }}
              ></div>

              {[
                { label: t.selectLocation, num: 1 },
                { label: t.soilInfoTitle, num: 2 },
                { label: t.soilConditionTitle, num: 3 },
                { label: t.analyticsTitle, num: 4 },
                { label: t.cropRecTitle, num: 5 }
              ].map((s) => (
                <button
                  key={s.num}
                  onClick={() => s.num < step && setStep(s.num)}
                  disabled={s.num >= step}
                  className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${
                    step === s.num 
                      ? "bg-[#4c7c4f] text-white border-[#4c7c4f] scale-110 shadow-lg shadow-[#4c7c4f]/20" 
                      : step > s.num 
                        ? "bg-[#eaf5eb] text-[#37613a] border-[#4c7c4f]" 
                        : "bg-white text-gray-400 border-gray-200"
                  }`}>
                    {step > s.num ? <Check className="w-5 h-5 stroke-[2.5]" /> : s.num}
                  </div>
                  <span className={`hidden md:block absolute top-12 text-[10px] font-bold tracking-tight whitespace-nowrap uppercase ${
                    step === s.num ? "text-[#1c3822]" : "text-gray-400"
                  }`}>
                    {s.label.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content Wrapper */}
        <div id="views-viewport" className="min-h-[460px] flex flex-col">
          
          {/* ==============================================
              PAGE 1: LANGUAGE SELECTION (Step 0)
             ============================================== */}
          {step === 0 && (
            <div id="step-language" className="max-w-xl mx-auto w-full text-center py-6 animate-fade-in">
              {/* Faded Background Pattern with India Map Concept */}
              <div className="relative bg-white/90 rounded-3xl p-8 shadow-xl shadow-green-900/[0.04] border border-[#e2eae3] backdrop-blur-md overflow-hidden">
                {/* Visual Map Accent */}
                <div className="absolute -right-16 -top-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
                <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

                <div className="relative flex justify-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-tr from-[#3b633e] to-[#609966] text-white rounded-3xl shadow-lg flex items-center justify-center animate-bounce">
                    <Globe className="w-10 h-10" />
                  </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-[#1c3822] tracking-tight mb-2">
                  {t.selectLanguage}
                </h2>
                <p className="text-sm text-[#527055] font-semibold mb-8">
                  నమస్కారం • నమస్తే • Welcome
                </p>

                {/* Interactive Language Cards Selection */}
                <div className="grid grid-cols-1 gap-4 mb-8">
                  {[
                    { key: "en", label: "English", desc: "View the app in English", subtitle: "International Dialect" },
                    { key: "te", label: "తెలుగు (Telugu)", desc: "తెలుగు భాషలో వీక్షించండి", subtitle: "ఆంధ్రప్రదేశ్ మాతృభాష" },
                    { key: "hi", label: "हिन्दी (Hindi)", desc: "हिन्दी भाषा में अनुवादित", subtitle: "राष्ट्रीय संपर्क भाषा" }
                  ].map((item) => (
                    <div
                      key={item.key}
                      id={`lang-card-${item.key}`}
                      onClick={() => setLang(item.key as Language)}
                      className={`group cursor-pointer p-4 rounded-2xl text-left border-2 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-between ${
                        lang === item.key
                          ? "bg-[#edf6ee] border-[#4c7c4f] shadow-md shadow-[#4c7c4f]/5"
                          : "bg-white border-[#e3ebe4] hover:shadow-md hover:border-[#6da370]"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                          lang === item.key ? "border-[#4c7c4f] bg-[#4c7c4f]" : "border-gray-300"
                        }`}>
                          {lang === item.key && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                        </div>
                        <div>
                          <p className={`font-bold transition-all text-base ${lang === item.key ? "text-[#1c3822]" : "text-[#4b5563]"}`}>
                            {item.label}
                          </p>
                          <p className="text-xs text-[#6e7d70] mt-0.5 font-medium">{item.desc}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-700/60 transition-opacity bg-emerald-500/5 group-hover:bg-emerald-500/10 px-2.5 py-1 rounded-md">
                        {item.subtitle}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  id="btn-lang-continue"
                  onClick={() => {
                    if (user && user.isLoggedIn) {
                      setStep(1);
                    } else {
                      setStep(0.5);
                    }
                  }}
                  className="w-full bg-gradient-to-r from-[#4c7c4f] to-[#3f6742] hover:from-[#3f6742] hover:to-[#2e4d31] text-white py-4 px-6 rounded-2xl font-bold tracking-wide shadow-lg shadow-[#4c7c4f]/20 transition-all transform active:scale-95 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>{t.continueBtn}</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* ==============================================
              PAGE 1.5: FARMER LOGIN / REGISTRATION (Step 0.5)
             ============================================== */}
          {step === 0.5 && (
            <div id="step-login" className="max-w-2xl mx-auto w-full animate-fade-in">
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-green-900/[0.04] border border-[#e2eae3] backdrop-blur-md relative overflow-hidden">
                
                {/* Visual Background Accents */}
                <div className="absolute -right-24 -top-24 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -left-24 -bottom-24 w-60 h-60 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

                {/* Back Button */}
                <button
                  onClick={() => setStep(0)}
                  className="mb-6 flex items-center gap-2 text-sm font-bold text-[#527055] hover:text-[#1c3822] cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{t.backBtn}</span>
                </button>

                {/* Header info */}
                <div className="flex items-center gap-3.5 mb-6">
                  <div className="p-3 bg-gradient-to-br from-emerald-50 to-emerald-100/50 text-[#4c7c4f] rounded-2xl border border-emerald-100">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-[#1c3822] tracking-tight">
                      {t.loginTitle}
                    </h2>
                    <p className="text-xs text-[#527055] font-semibold mt-0.5">
                      {t.loginSubtitle}
                    </p>
                  </div>
                </div>

                {/* Banner explaining pre-authorization */}
                <div className="mb-6 p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl text-xs text-[#2a4d2e] font-semibold flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0"></div>
                  <p>{t.anyUserNotice}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left part: Quick Auto-Fill Profiles */}
                  <div className="lg:col-span-5 space-y-4">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">
                      Quick Profile Selection
                    </h3>
                    <p className="text-[11px] text-[#527055] font-medium leading-relaxed">
                      Tap a pre-approved farmer profile to login instantly:
                    </p>
                    
                    <div className="space-y-2.5">
                      {[
                        { name: "Rama Rao", mobile: "9848012345", pin: "1234", bio: "👨‍🌾 Anakapalli • Groundnut Specialist" },
                        { name: "Anitha Devi", mobile: "9490123456", pin: "5678", bio: "👩‍🌾 Bheemunipatnam • Cashew Expert" },
                        { name: "Satish Kumar", mobile: "8008123456", pin: "9999", bio: "👨‍🌾 Anandapuram • Paddy Cultivator" }
                      ].map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setLoginName(p.name);
                            setLoginMobile(p.mobile);
                            setLoginPin(p.pin);
                            setLoginError("");
                          }}
                          className={`w-full text-left p-3 rounded-xl border transition-all duration-300 flex flex-col hover:border-[#4c7c4f] hover:bg-emerald-50/30 ${
                            loginName === p.name 
                              ? "bg-emerald-50/50 border-emerald-500/85 ring-2 ring-emerald-500/10" 
                              : "bg-white border-gray-200"
                          }`}
                        >
                          <span className="text-xs font-bold text-[#1c3822]">{p.name}</span>
                          <span className="text-[10px] font-bold text-gray-500 font-mono mt-0.5">{p.bio}</span>
                          <span className="text-[9px] text-[#527055] font-medium mt-1">Mobile: {p.mobile} • PIN: {p.pin}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Right part: Login form */}
                  <div className="lg:col-span-7 bg-[#f7faf8] border border-[#eff4ef] p-5 rounded-2xl flex flex-col justify-between">
                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-[#1c3822] uppercase tracking-wider">
                        Custom Registration Form
                      </h3>

                      {/* Username input */}
                      <div>
                        <label className="block text-[11px] font-bold text-[#1c3822] uppercase tracking-wider mb-1.5">
                          {t.farmerNameLabel} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={loginName}
                            onChange={(e) => {
                              setLoginName(e.target.value);
                              if (loginError) setLoginError("");
                            }}
                            placeholder={t.farmerNamePlaceholder}
                            className="w-full pl-3 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                          />
                        </div>
                      </div>

                      {/* Mobile input */}
                      <div>
                        <label className="block text-[11px] font-bold text-[#1c3822] uppercase tracking-wider mb-1.5">
                          {t.mobileLabel}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={loginMobile}
                            onChange={(e) => {
                              setLoginMobile(e.target.value.replace(/\D/g, "").slice(0, 10));
                              if (loginError) setLoginError("");
                            }}
                            placeholder={t.mobilePlaceholder}
                            className="w-full pl-3 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-mono"
                          />
                        </div>
                      </div>

                      {/* Security PIN input */}
                      <div>
                        <label className="block text-[11px] font-bold text-[#1c3822] uppercase tracking-wider mb-1.5">
                          {t.pinLabel} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="password"
                            maxLength={4}
                            value={loginPin}
                            onChange={(e) => {
                              setLoginPin(e.target.value.replace(/\D/g, ""));
                              if (loginError) setLoginError("");
                            }}
                            placeholder={t.pinPlaceholder}
                            className="w-full pl-3 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-800 tracking-widest placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-mono"
                          />
                        </div>
                      </div>

                      {/* Error panel */}
                      {loginError && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold leading-normal">
                          ⚠️ {loginError}
                        </div>
                      )}
                    </div>

                    <div className="mt-6 space-y-2.5">
                      {/* Standard Login Submit Button */}
                      <button
                        id="btn-login-submit"
                        disabled={isLogining}
                        onClick={() => {
                          if (!loginName.trim() || loginName.trim().length < 2) {
                            setLoginError(lang === "te" ? "దయచేసి కనీసం 2 అక్షరాల రైతు పేరును నమోదు చేయండి." : lang === "hi" ? "कृपया कम से कम 2 अक्षरों का किसान नाम दर्ज करें।" : "Please enter a valid farmer name (at least 2 characters).");
                            return;
                          }
                          if (!loginPin || loginPin.length !== 4) {
                            setLoginError(lang === "te" ? "దయచేసి 4 అంకెల సెక్యూరిటీ పిన్ నమోదు చేయండి." : lang === "hi" ? "कृपया 4-अंकीय सुरक्षा पिन दर्ज करें।" : "Please enter a valid 4-digit security PIN.");
                            return;
                          }

                          setIsLogining(true);
                          setLoginError("");

                          // Pre-authorized instant delay
                          setTimeout(() => {
                            const loggedUser = {
                              name: loginName.trim(),
                              mobile: loginMobile,
                              pin: loginPin,
                              isLoggedIn: true
                            };
                            setUser(loggedUser);
                            localStorage.setItem("soil_depictor_user", JSON.stringify(loggedUser));
                            setIsLogining(false);
                            setStep(1); // Proceed to location search!
                          }, 800);
                        }}
                        className="w-full bg-gradient-to-r from-[#4c7c4f] to-[#3f6742] hover:from-[#3f6742] hover:to-[#2e4d31] disabled:from-[#a0b0a2] disabled:to-[#91a093] text-white py-3.5 px-6 rounded-2xl font-bold tracking-wide shadow-md shadow-[#4c7c4f]/10 transition-all transform active:scale-95 flex items-center justify-center gap-2 group cursor-pointer"
                      >
                        {isLogining ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-xs uppercase tracking-widest font-black">Syncing Agricultural ID...</span>
                          </div>
                        ) : (
                          <>
                            <span>{t.loginBtn}</span>
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>

                      {/* Guest login button */}
                      <button
                        type="button"
                        disabled={isLogining}
                        onClick={() => {
                          setIsLogining(true);
                          setTimeout(() => {
                            const randomIds = ["Rama Swamy", "Appa Rao", "Venkat", "Kalyani", "Nageswara Rao", "Satyanarayana", "Laxmi"];
                            const nameIdx = Math.floor(Math.random() * randomIds.length);
                            const guestName = `${randomIds[nameIdx]} (Guest)`;
                            const loggedUser = {
                              name: guestName,
                              mobile: "9999999999",
                              pin: "0000",
                              isLoggedIn: true
                            };
                            setUser(loggedUser);
                            localStorage.setItem("soil_depictor_user", JSON.stringify(loggedUser));
                            setIsLogining(false);
                            setStep(1);
                          }, 500);
                        }}
                        className="w-full bg-white border border-[#cfdfd0] text-[#345b36] hover:bg-emerald-50/20 py-3 px-6 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all transform active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Sprout className="w-4 h-4 text-emerald-600" />
                        <span>{t.guestLoginBtn}</span>
                      </button>
                    </div>

                  </div>

                </div>

              </div>
            </div>
          )}


          {/* ==============================================
              PAGE 2: LOCATION SELECTION (Step 1)
             ============================================== */}
          {step === 1 && (
            <div id="step-location" className="max-w-2xl mx-auto w-full animate-fade-in">
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-green-900/[0.04] border border-[#e2eae3] backdrop-blur-sm relative">
                
                {/* Custom Decorative India Map Grid Overlay */}
                <div className="absolute right-6 top-6 opacity-5 pointer-events-none">
                  <Activity className="w-32 h-32 text-emerald-800" />
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-green-50 text-[#4c7c4f] rounded-xl border border-green-100">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-[#1c3822] tracking-tight">
                      {t.selectLocation}
                    </h2>
                    <p className="text-xs text-[#527055] font-medium mt-0.5">
                      {t.subTitleText}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 mb-6">
                  {/* State selection - locked to Andhra Pradesh */}
                  <div>
                    <label className="block text-xs font-bold text-[#374e3a] uppercase tracking-wider mb-2">
                      {t.stateLabel}
                    </label>
                    <div className="relative">
                      <select 
                        disabled 
                        className="w-full bg-[#f8faf8] border-2 border-[#e8ebe8] text-[#3c4a3d] py-3.5 px-4 rounded-xl font-bold text-sm cursor-not-allowed uppercase"
                      >
                        <option>Andhra Pradesh (ఆంధ్రప్రదేశ్)</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                        <span className="text-[9px] font-black tracking-widest bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md uppercase">LOCKED</span>
                      </div>
                    </div>
                  </div>

                  {/* District selection */}
                  <div>
                    <label className="block text-xs font-bold text-[#374e3a] uppercase tracking-wider mb-2">
                      {t.distLabel}
                    </label>
                    <div className="relative">
                      <select
                        id="select-district"
                        value={selectedDistrict}
                        onChange={(e) => {
                          setSelectedDistrict(e.target.value);
                          setSelectedMandal("");
                        }}
                        className="w-full bg-white border-2 border-[#dfe3df] hover:border-[#6da370] text-[#1c3822] py-3.5 px-4 rounded-xl font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#4c7c4f]/20 focus:border-[#4c7c4f] appearance-none"
                      >
                        <option value="">-- {t.distPlaceholder} --</option>
                        {districts.map((d) => (
                          <option key={d} value={d}>
                            {t.districtsList[d] || d}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <Search className="w-4 h-4 ml-2" />
                      </div>
                    </div>
                  </div>

                  {/* Mandal / Region selection */}
                  <div>
                    <label className="block text-xs font-bold text-[#374e3a] uppercase tracking-wider mb-2">
                      {t.mandalLabel}
                    </label>
                    <div className="relative">
                      <select
                        id="select-mandal"
                        disabled={!selectedDistrict || isLoading}
                        value={selectedMandal}
                        onChange={(e) => setSelectedMandal(e.target.value)}
                        className={`w-full bg-white border-2 border-[#dfe3df] hover:border-[#6da370] text-[#1c3822] py-3.5 px-4 rounded-xl font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#4c7c4f]/20 focus:border-[#4c7c4f] appearance-none ${
                          (!selectedDistrict || isLoading) ? "opacity-60 bg-[#fbfdfb] cursor-not-allowed" : ""
                        }`}
                      >
                        <option value="">-- {t.mandalPlaceholder} --</option>
                        {mandals.map((m) => (
                          <option key={m} value={m}>
                            {t.mandalsList[m] || m}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-[#4c7c4f] border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <MapPin className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mandal Notice / System warning info */}
                <div className="mb-6 p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                    {t.mandalNotice}
                  </p>
                </div>

                {/* Action Button */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(0)}
                    className="px-5 py-4 bg-[#f1f5f2] hover:bg-[#e4ece5] text-[#425445] rounded-2xl font-bold transition-all border border-[#dfe5e0]"
                  >
                    {t.backBtn}
                  </button>
                  <button
                    id="btn-find-soil"
                    onClick={handleFindSoilDetails}
                    disabled={!selectedDistrict || (selectedDistrict === "Visakhapatnam" && !selectedMandal)}
                    className={`flex-1 py-4 px-6 rounded-2xl font-black text-sm tracking-wide transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
                      selectedDistrict && (selectedDistrict !== "Visakhapatnam" || selectedMandal)
                        ? "bg-[#4c7c4f] hover:bg-[#3d6540] text-white shadow-lg shadow-[#4c7c4f]/25"
                        : "bg-[#cfdec2] text-[#869675] cursor-not-allowed"
                    }`}
                  >
                    <span>{t.findSoilDetailsBtn}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}


          {/* ==============================================
              PAGE 3: SOIL INFORMATION (Step 2)
             ============================================== */}
          {step === 2 && soilInfo && (
            <div id="step-soil-info" className="max-w-3xl mx-auto w-full animate-fade-in">
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-green-900/[0.04] border border-[#e2eae3] backdrop-blur-sm relative overflow-hidden">
                
                {/* Visual Accent */}
                <div className="absolute right-0 top-0 w-32 h-32 bg-[#4c7c4f]/5 rounded-bl-full pointer-events-none" />

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 border-b border-[#f1f6f1] pb-6">
                  <div>
                    <div className="text-xs font-bold text-emerald-700/80 bg-emerald-50 border border-emerald-100 max-w-max px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                      {selectedDistrict === "Visakhapatnam" ? `${t.districtsList[selectedDistrict]} → ${t.mandalsList[selectedMandal]}` : `${t.districtsList[selectedDistrict]} District`}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-[#1c3822] tracking-tight">
                      {t.soilInfoTitle}
                    </h2>
                    <p className="text-sm text-[#527055] font-medium leading-relaxed mt-1 max-w-xl">
                      {t.soilDetailsText}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleRestart}
                      className="p-2.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
                      title="Reset / Check other location"
                    >
                      <RotateCcw className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Primary Soil Block and 3D Strata Analysis Map */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                  {/* Left Column: Soil Info Details */}
                  <div className="lg:col-span-7 flex flex-col justify-between">
                    <div className="bg-[#f7faf8] border border-[#eff4ef] rounded-2xl p-6 flex flex-col sm:flex-row gap-5 items-center h-full">
                      <div className="w-16 h-16 rounded-full bg-[#e8efe9] border border-[#cfdfd0] text-[#4c7c4f] flex items-center justify-center shrink-0">
                        <Sprout className="w-8 h-8" />
                      </div>
                      <div className="text-center sm:text-left">
                        <h3 className="text-xl font-bold text-[#1c3822] mb-1">
                          {t.soilNames[soilInfo.typeKey] || soilInfo.name}
                        </h3>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">
                          Region Index: {selectedMandal ? t.mandalsList[selectedMandal] : "Default Calibrated Frame"}
                        </p>
                        <p id="soil-description-text" className="text-sm text-[#405443] font-medium leading-relaxed">
                          {t.soilDescriptions[soilInfo.typeKey] || soilInfo.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: 3D Strata Graph Image */}
                  <div className="lg:col-span-5 bg-white border border-[#e2eae3] rounded-2xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group">
                    <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-[#f7faf8] border border-[#edf3ed] mb-3">
                      <img 
                        src={soil3dCrossSection} 
                        alt="3D Soil Strata Analysis" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md text-white font-mono text-[9px] font-black tracking-widest px-2.5 py-1 rounded-full uppercase">
                        3D Soil Strata Plot
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1c3822] uppercase tracking-wide mb-1 flex items-center justify-between">
                        <span>3D Strata Structure</span>
                        <span className="text-[9px] bg-emerald-50 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded">CALIBRATED</span>
                      </h4>
                      <p className="text-[11px] text-[#527055] leading-relaxed">
                        Cross-sectional representation showing topsoil root aeration development, clay-to-loam permeability, and bedrock subsoil moisture content.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Properties Trio Cards */}
                <div id="soil-properties-grid" className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {/* Card 1: Water Retention */}
                  <div className="bg-white border-2 border-[#eff4ef] p-5 rounded-2xl flex flex-col items-center text-center hover:border-[#6da370] transition-colors relative">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                      <Droplets className="w-5 h-5" />
                    </div>
                    <h4 className="text-xs font-bold text-[#627664] uppercase tracking-wider mb-1">
                      {t.waterRetention}
                    </h4>
                    <p className="text-lg font-extrabold text-blue-900 leading-none">
                      {t.levels[soilInfo.waterRetention] || soilInfo.waterRetention}
                    </p>
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full mt-3 font-semibold uppercase">Calibrated</span>
                  </div>

                  {/* Card 2: Fertility */}
                  <div className="bg-white border-2 border-[#eff4ef] p-5 rounded-2xl flex flex-col items-center text-center hover:border-[#6da370] transition-colors relative">
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                      <Flame className="w-5 h-5" />
                    </div>
                    <h4 className="text-xs font-bold text-[#627664] uppercase tracking-wider mb-1">
                      {t.fertility}
                    </h4>
                    <p className="text-lg font-extrabold text-emerald-900 leading-none">
                      {t.levels[soilInfo.fertility] || soilInfo.fertility}
                    </p>
                    <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded-full mt-3 font-semibold uppercase">Optimized</span>
                  </div>

                  {/* Card 3: Drainage */}
                  <div className="bg-white border-2 border-[#eff4ef] p-5 rounded-2xl flex flex-col items-center text-center hover:border-[#6da370] transition-colors relative">
                    <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                      <Compass className="w-5 h-5" />
                    </div>
                    <h4 className="text-xs font-bold text-[#627664] uppercase tracking-wider mb-1">
                      {t.drainageCapacity}
                    </h4>
                    <p className="text-lg font-extrabold text-amber-950 leading-none">
                      {t.levels[soilInfo.drainageCapacity] || soilInfo.drainageCapacity}
                    </p>
                    <span className="text-[10px] bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full mt-3 font-semibold uppercase">Active Flow</span>
                  </div>
                </div>

                {/* Buttons Navigation */}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setStep(1)}
                    className="px-5 py-4 bg-[#f1f5f2] hover:bg-[#e4ece5] text-[#425445] rounded-2xl font-bold transition-all border border-[#dfe5e0] flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>{t.backBtn}</span>
                  </button>
                  <button
                    id="btn-trigger-condition"
                    onClick={() => setStep(3)}
                    className="flex-1 bg-gradient-to-r from-[#4c7c4f] to-[#3f6742] hover:from-[#3f6742] hover:to-[#2e4d31] text-white py-4 px-6 rounded-2xl font-black tracking-wide shadow-lg shadow-[#4c7c4f]/20 transition-all transform active:scale-95 flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span>{t.checkSoilConditionBtn}</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          )}


          {/* ==============================================
              PAGE 4: SOIL CONDITION ANALYSIS (Step 3)
             ============================================== */}
          {step === 3 && soilCondition && (
            <div id="step-soil-condition" className="max-w-3xl mx-auto w-full animate-fade-in">
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-green-900/[0.04] border border-[#e2eae3] backdrop-blur-sm">
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-[#f1f6f1] pb-5">
                  <div>
                    <h2 className="text-2xl font-black text-[#1c3822] tracking-tight">
                      {t.soilConditionTitle}
                    </h2>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">
                      {t.soilNames[soilInfo?.typeKey || ""] || soilCondition.soilType}
                    </p>
                  </div>
                  <div className={`px-4 py-2 rounded-2xl border text-sm font-black text-center ${getStatusColor(soilCondition.status)}`}>
                    {t.statusLabel}: {t.statusNames[soilCondition.status] || soilCondition.status}
                  </div>
                </div>

                {/* Parameters block with comparison progress bars */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                  {[
                    { label: t.Moisture, key: "moisture", sym: "%", val: soilCondition.parameters.moisture.current, max: 100, color: "bg-blue-500" },
                    { label: t.Nitrogen, key: "nitrogen", sym: "%", val: soilCondition.parameters.nitrogen.current, max: 100, color: "bg-green-600" },
                    { label: t.Phosphorus, key: "phosphorus", sym: "%", val: soilCondition.parameters.phosphorus.current, max: 100, color: "bg-indigo-500" },
                    { label: t.Potassium, key: "potassium", sym: "%", val: soilCondition.parameters.potassium.current, max: 100, color: "bg-amber-500" },
                    { label: t.OrganicCarbon, key: "organicCarbon", sym: "%", val: soilCondition.parameters.organicCarbon.current, max: 100, color: "bg-orange-500" },
                    { label: "pH Level", key: "pH", sym: "", val: soilCondition.parameters.pH.current, max: 14, scaleScale: true, color: "bg-teal-500" }
                  ].map((p) => {
                    const currentPercent = (p.val / p.max) * 100;
                    // Find matching Ideal
                    const idealVal = (soilCondition.parameters as any)[p.key]?.ideal || 100;
                    const idealPercent = (idealVal / p.max) * 100;

                    return (
                      <div key={p.key} id={`param-container-${p.key}`} className="p-4 bg-[#f8faf8] border border-[#eff4ef] rounded-2xl space-y-3">
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-bold text-[#1c3822] uppercase tracking-wide">
                            {p.label === "pH Level" ? "pH Level" : (t as any)[p.key.charAt(0).toUpperCase() + p.key.slice(1)] || p.label}
                          </p>
                          <div className="flex items-center gap-1.5 text-xs text-[#527055] font-bold">
                            <span className="text-[#1c3822]">{p.val}{p.sym}</span>
                            <span className="text-gray-300">/</span>
                            <span className="text-gray-400">{idealVal}{p.sym}</span>
                          </div>
                        </div>

                        {/* Comparative Visual Segmented Bar */}
                        <div className="relative pt-1">
                          
                          {/* Standard track */}
                          <div className="h-2.5 w-full bg-gray-200 rounded-full relative overflow-hidden">
                            {/* Ideal target range point */}
                            <div 
                              className="absolute top-0 bottom-0 w-1 bg-emerald-700/80 z-20"
                              style={{ left: `${idealPercent}%` }}
                              title="Target Ideal Marker"
                            />
                            
                            {/* Current Value Fill */}
                            <div 
                              className={`h-full ${p.color} transition-all duration-1000 rounded-full`}
                              style={{ width: `${currentPercent}%` }}
                            />
                          </div>

                          <div className="flex justify-between items-center mt-1.5 text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
                            <span className="flex items-center gap-1">
                              <span className={`w-2 h-2 rounded-full ${p.color}`} />
                              {t.currentLabel}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-emerald-700" />
                              {t.idealLabel}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Interactive Status Indicator Details */}
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                  <div className="flex gap-2 items-center text-emerald-800 font-extrabold text-sm mb-1.5">
                    <CheckCircle2 className="w-4.5 h-4.5" />
                    <span>Agronomist Recommendation Note:</span>
                  </div>
                  <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                    Based on {soilInfo?.name || "the local soil profile"}, the organic properties indicate that minor fertilizer modifications can push standard indices closer to 100% ideal standards. The condition index is currently rated as <strong className="underline text-emerald-800">{t.statusNames[soilCondition.status] || soilCondition.status}</strong>.
                  </p>
                </div>

                {/* Back / Next Navigation */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="px-5 py-4 bg-[#f1f5f2] hover:bg-[#e4ece5] text-[#425445] rounded-2xl font-bold transition-all border border-[#dfe5e0] flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>{t.backBtn}</span>
                  </button>
                  <button
                    id="btn-view-analysis"
                    onClick={() => setStep(4)}
                    className="flex-1 bg-gradient-to-r from-[#4c7c4f] to-[#3f6742] hover:from-[#3f6742] hover:to-[#2e4d31] text-white py-4 px-6 rounded-2xl font-black tracking-wide shadow-lg shadow-[#4c7c4f]/20 transition-all transform active:scale-95 flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span>{t.viewAnalysisBtn}</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          )}


          {/* ==============================================
              PAGE 5: SOIL ANALYTICS DASHBOARD (Step 4)
             ============================================== */}
          {step === 4 && soilCondition && (
            <div id="step-dashboard" className="max-w-4xl mx-auto w-full animate-fade-in">
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-green-900/[0.04] border border-[#e2eae3]">
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-[#f1f6f1] pb-5">
                  <div>
                    <h2 className="text-2xl font-black text-[#1c3822] tracking-tight">
                      {t.analyticsTitle}
                    </h2>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">
                      {t.chartDesc}
                    </p>
                  </div>
                  <div className="text-xs text-[#527055] font-extrabold bg-[#edf5ee] border border-[#cfdfd0] py-2 px-4 rounded-xl">
                    Region Mandal: {selectedMandal ? t.mandalsList[selectedMandal] : "Anandapuram Standard Entry"}
                  </div>
                </div>

                {/* Bento Grid layout of multi-graphs */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  
                  {/* CHART 1: Multi-Bar Graph (Current vs Ideal) */}
                  <div className="p-4 bg-white border border-[#e7eee8] rounded-2xl shadow-sm">
                    <h3 className="text-xs font-extrabold text-[#1c3822] uppercase tracking-wider mb-4 flex items-center gap-1.5">
                      <BarChart4 className="w-4.5 h-4.5 text-emerald-600" />
                      {t.chart1Title}
                    </h3>
                    
                    {/* SVG Bar Chart Body */}
                    <div className="relative pt-2 h-64 w-full flex items-end justify-between">
                      {[
                        { label: t.Fertility || "Fertility", key: "fertility", cur: 75, idl: 95, color1: "#10b981", color2: "#047857" },
                        { label: t.Moisture || "Moisture", key: "moisture", cur: soilCondition.parameters.moisture.current, idl: soilCondition.parameters.moisture.ideal, color1: "#3b82f6", color2: "#1d4ed8" },
                        { label: t.Nitrogen || "Nitrogen", key: "nitrogen", cur: soilCondition.parameters.nitrogen.current, idl: soilCondition.parameters.nitrogen.ideal, color1: "#16a34a", color2: "#15803d" },
                        { label: t.Phosphorus || "Phosphorus", key: "phosphorus", cur: soilCondition.parameters.phosphorus.current, idl: soilCondition.parameters.phosphorus.ideal, color1: "#6366f1", color2: "#4f46e5" },
                        { label: t.Potassium || "Potassium", key: "potassium", cur: soilCondition.parameters.potassium.current, idl: soilCondition.parameters.potassium.ideal, color1: "#f59e0b", color2: "#d97706" }
                      ].map((item, index) => {
                        return (
                          <div 
                            key={index} 
                            className="flex flex-col items-center h-full justify-end group/bar cursor-pointer relative"
                            style={{ width: "18%" }}
                            onMouseEnter={() => setBarHovered({ param: item.label, current: item.cur, ideal: item.idl })}
                            onMouseLeave={() => setBarHovered(null)}
                          >
                            {/* The comparative twin bars */}
                            <div className="flex items-end gap-1.5 h-44 w-full justify-center pb-2 relative">
                              {/* Current Bar */}
                              <div 
                                className="w-3 rounded-t-md transition-all duration-700 hover:brightness-105"
                                style={{ 
                                  height: `${(item.cur / 100) * 100}%`,
                                  backgroundColor: item.color1
                                }}
                              />
                              {/* Ideal Bar */}
                              <div 
                                className="w-3 rounded-t-md opacity-45 transition-all duration-700 hover:opacity-85"
                                style={{ 
                                  height: `${(item.idl / 100) * 100}%`,
                                  backgroundColor: item.color2
                                }}
                              />
                            </div>
                            {/* Short Name Label */}
                            <span className="text-[10px] font-bold text-[#527055] text-center w-full truncate pointer-events-none mt-1">
                              {item.label.substring(0, 7)}
                            </span>
                          </div>
                        );
                      })}

                      {/* Bar Graph Tooltip overlay */}
                      {barHovered && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gray-900/95 text-white p-2.5 rounded-lg text-[10px] shadow-lg pointer-events-none flex flex-col gap-0.5 border border-gray-800 z-30">
                          <p className="font-bold border-b border-gray-700 pb-1 mb-1 text-emerald-400">{barHovered.param}</p>
                          <p>{t.currentLabel}: <span className="font-black text-amber-300">{barHovered.current}%</span></p>
                          <p>{t.idealLabel}: <span className="font-black text-emerald-400">{barHovered.ideal}%</span></p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-center items-center gap-4 mt-4 text-[10px] font-bold uppercase tracking-wider text-[#527055]">
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-1.5 rounded-sm bg-emerald-500" />
                        {t.currentLabel} Level
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-1.5 rounded-sm bg-[#527055]/40" />
                        {t.idealLabel} Standard
                      </span>
                    </div>
                  </div>

                  {/* CHART 2: Trend Line Graph (Historical Index) */}
                  <div className="p-4 bg-white border border-[#e7eee8] rounded-2xl shadow-sm">
                    <h3 className="text-xs font-extrabold text-[#1c3822] uppercase tracking-wider mb-4 flex items-center gap-1.5">
                      <LineChart className="w-4.5 h-4.5 text-emerald-600" />
                      {t.chart2Title}
                    </h3>
                    
                    {/* SVG Line Graph */}
                    <div className="relative pt-2 h-64 w-full">
                      {/* Grid background lines */}
                      <div className="absolute left-6 right-2 top-4 bottom-8 flex flex-col justify-between pointer-events-none opacity-40">
                        <div className="border-t border-dashed border-gray-200 w-full" />
                        <div className="border-t border-dashed border-gray-200 w-full" />
                        <div className="border-t border-dashed border-gray-200 w-full" />
                        <div className="border-t border-dashed border-gray-200 w-full" />
                      </div>

                      {/* Chart container overlay */}
                      <svg className="w-full h-full p-2" viewBox="0 0 320 200" preserveAspectRatio="none">
                        {/* Define linear gradient for aesthetic line glowes */}
                        <defs>
                          <linearGradient id="gradient-health" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#4c7c4f" stopOpacity="0.2"/>
                            <stop offset="100%" stopColor="#4c7c4f" stopOpacity="0"/>
                          </linearGradient>
                        </defs>

                        {/* Line 1 Area & Line: Soil Health Trend */}
                        {/* coordinates map to months: Jan (30,130), Feb (90,115), Mar (150, 95), Apr (210, 65), May (270, 45) */}
                        <path 
                          d="M 30 140 Q 90 120 150 95 T 270 45 L 270 180 L 30 180 Z" 
                          fill="url(#gradient-health)"
                        />
                        <path 
                          d="M 30 140 Q 90 120 150 95 T 270 45" 
                          fill="none" 
                          stroke="#4c7c4f" 
                          strokeWidth="2.5" 
                        />

                        {/* Line 2: Crop Suitability Trend (steeper surge) */}
                        <path 
                          d="M 30 160 Q 90 140 150 110 T 270 30" 
                          fill="none" 
                          stroke="#e59828" 
                          strokeWidth="2.5" 
                          strokeDasharray="4,3"
                        />

                        {/* Interactive Invisible hover hot zones over monthly axis nodes */}
                        {[
                          { m: "Jan", h: 42, c: 35, x: 30, yH: 140, yC: 160 },
                          { m: "Mar", h: 68, c: 55, x: 150, yH: 95, yC: 110 },
                          { m: "Jun", h: 88, c: 92, x: 270, yH: 45, yC: 30 }
                        ].map((node, nIdx) => (
                          <g key={nIdx} className="cursor-pointer group/node"
                             onMouseEnter={() => setLineHovered({ month: node.m, health: node.h, crop: node.c })}
                             onMouseLeave={() => setLineHovered(null)}
                          >
                            <circle cx={node.x} cy={node.yH} r="4" fill="#4c7c4f" stroke="#fff" strokeWidth="2" className="transition-all group-hover/node:r-6" />
                            <circle cx={node.x} cy={node.yC} r="4" fill="#e59828" stroke="#fff" strokeWidth="2" className="transition-all group-hover/node:r-6" />
                            
                            {/* Hover zone pill */}
                            <rect x={node.x - 20} y="0" width="40" height="180" fill="transparent" />
                          </g>
                        ))}
                      </svg>

                      {/* X Axis monthly text labels */}
                      <div className="absolute left-0 right-0 bottom-1 flex justify-between px-6 text-[9px] font-bold text-gray-400 uppercase tracking-widest pointer-events-none">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May</span>
                        <span>Jun</span>
                      </div>

                      {/* Line graph dynamic tooltip */}
                      {lineHovered && (
                        <div className="absolute top-2 left-6 bg-gray-900/95 text-white p-2.5 rounded-lg text-[9px] shadow-lg pointer-events-none flex flex-col gap-0.5 border border-gray-800 z-30">
                          <p className="font-bold border-b border-gray-700 pb-1 mb-1 text-emerald-400">Timeframe: {lineHovered.month}</p>
                          <p>{t.SoilHealthTrend || "Soil Quality"}: <span className="font-black text-emerald-400">{lineHovered.health}%</span></p>
                          <p>{t.CropSuitabilityTrend || "Crop Fit"}: <span className="font-black text-amber-300">{lineHovered.crop}%</span></p>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-center items-center gap-4 mt-4 text-[10px] font-bold uppercase tracking-wider text-[#527055]">
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-0.5 bg-[#4c7c4f]" />
                        {t.SoilHealthTrend} (%)
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-0.5 border-t border-dashed border-[#e59828]" />
                        {t.CropSuitabilityTrend} (%)
                      </span>
                    </div>
                  </div>

                  {/* CHART 3: Multifactor Radar Pentagon Profile Chart */}
                  <div className="p-4 bg-white border border-[#e7eee8] rounded-2xl shadow-sm lg:col-span-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-extrabold text-[#1c3822] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Compass className="w-4.5 h-4.5 text-emerald-600" />
                        {t.chart3Title}
                      </h3>
                      
                      <div className="flex flex-col sm:flex-row items-center justify-around gap-2 my-auto">
                        
                        {/* Radar diagram drawing using plain responsive SVG */}
                        <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
                          <svg className="w-full h-full" viewBox="0 0 200 200">
                            {/* Pentagon background grid skeleton rings */}
                            {/* Centers around (100, 100), R = 80 */}
                            {[0.25, 0.5, 0.75, 1.0].map((scale) => {
                              const R = 80 * scale;
                              const pts = [];
                              for (let i = 0; i < 5; i++) {
                                const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                                const x = 100 + R * Math.cos(angle);
                                const y = 100 + R * Math.sin(angle);
                                pts.push(`${x},${y}`);
                              }
                              return (
                                <polygon 
                                  key={scale}
                                  points={pts.join(" ")}
                                  fill="none"
                                  stroke="#dfe5df"
                                  strokeWidth="1"
                                  strokeDasharray={scale === 1 ? "0" : "2,2"}
                                />
                              );
                            })}

                            {/* Radar Axes spokes drawing */}
                            {[0, 1, 2, 3, 4].map((i) => {
                              const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                              const xOuter = 100 + 80 * Math.cos(angle);
                              const yOuter = 100 + 80 * Math.sin(angle);
                              return (
                                <line 
                                  key={i}
                                  x1="100" y1="100"
                                  x2={xOuter} y2={yOuter}
                                  stroke="#dfe5df"
                                  strokeWidth="1"
                                />
                              );
                            })}

                            {/* Ideal Boundary Line polygon */}
                            <polygon 
                              points="100,20 176,75 147,164 53,164 24,75"
                              fill="none"
                              stroke="#527055"
                              strokeWidth="1.5"
                              strokeDasharray="4,3"
                              opacity="0.6"
                            />

                            {/* Current Profile Polygon Area */}
                            {/* Fertility factor, Drainage, Moisture, Nutrients, Organic Matter */}
                            {/* Red Loamy, Sandy Loamy etc impacts radar sizes */}
                            {(() => {
                              const factors = soilInfo?.typeKey === "mixed" 
                                ? [0.9, 0.85, 0.8, 0.88, 0.85] // mixed
                                : soilInfo?.typeKey === "coastal_sandy"
                                  ? [0.6, 0.95, 0.45, 0.55, 0.5] // coastal
                                  : soilInfo?.typeKey === "sandy_loamy"
                                    ? [0.75, 0.9, 0.65, 0.7, 0.6] // sandy
                                    : [0.85, 0.8, 0.75, 0.82, 0.78]; // default red

                              const pointsStr = factors.map((f, i) => {
                                const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                                const R = 80 * f;
                                const x = 100 + R * Math.cos(angle);
                                const y = 100 + R * Math.sin(angle);
                                return `${x},${y}`;
                              }).join(" ");

                              return (
                                <polygon 
                                  points={pointsStr}
                                  fill="#4c7c4f"
                                  fillOpacity="0.25"
                                  stroke="#4c7c4f"
                                  strokeWidth="2.5"
                                />
                              );
                            })()}

                            {/* Radar Axis Bullet Labels */}
                            {[
                              { label: t.Fertility, x: 100, y: 12 },
                              { label: t.drainageCapacity.split(" ")[0], x: 185, y: 78 },
                              { label: t.Moisture, x: 155, y: 178 },
                              { label: "Nutrients", x: 45, y: 178 },
                              { label: "Organic C", x: 12, y: 78 }
                            ].map((lbl, idx) => (
                              <text 
                                key={idx}
                                x={lbl.x} y={lbl.y}
                                textAnchor="middle"
                                fill="#3a4f3c"
                                fontSize="8"
                                fontWeight="black"
                                className="uppercase tracking-wider"
                              >
                                {lbl.label}
                              </text>
                            ))}
                          </svg>
                        </div>

                        {/* Explanation Legend */}
                        <div className="space-y-2">
                          <div className="p-2.5 bg-emerald-50/50 rounded-xl border border-emerald-100/30 text-[10px] leading-normal font-semibold text-emerald-950">
                            The shaded area indicates balance of nutrients. High overlap with the ideal standard guarantees maximal yield efficiency.
                          </div>
                          <ul className="text-[10px] font-bold text-gray-400 uppercase tracking-wider space-y-1 ml-2">
                            <li>• OC target &gt; 80%</li>
                            <li>• Potassium: {soilCondition.parameters.potassium.current}%</li>
                          </ul>
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* CHART 4: 2D Chemical Speciation laboratory-grade analysis infographic image */}
                  <div className="p-4 bg-white border border-[#e7eee8] rounded-2xl shadow-sm lg:col-span-1 flex flex-col justify-between group">
                    <div>
                      <h3 className="text-xs font-extrabold text-[#1c3822] uppercase tracking-wider mb-2 flex items-center gap-1.5 justify-between">
                        <span className="flex items-center gap-1.5">
                          <Activity className="w-4.5 h-4.5 text-emerald-600" />
                          2D Chemical Analysis Speciation
                        </span>
                        <span className="text-[9px] bg-blue-50 text-blue-800 font-extrabold px-1.5 py-0.5 rounded">REPORT</span>
                      </h3>
                      <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-[#f7faf8] border border-[#edf3ed] mb-2.5">
                        <img 
                          src={soil2dAnalysisChart} 
                          alt="2D Scientific soil chemical analysis report" 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                    <div className="p-2.5 bg-[#f8faf8] rounded-xl border border-[#eff4ef] text-[10px] leading-relaxed text-[#527055] font-semibold">
                      Spectrometry scan proving mineral concentration balances of secondary nutrients (Mg, S, Ca) and trace organics. Highly aligned with targeted crop micro-nutritional safety standards.
                    </div>
                  </div>

                </div>

                {/* Navigation Controls */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(3)}
                    className="px-5 py-4 bg-[#f1f5f2] hover:bg-[#e4ece5] text-[#425445] rounded-2xl font-bold transition-all border border-[#dfe5e0] flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>{t.backBtn}</span>
                  </button>
                  <button
                    id="btn-trigger-recommendation"
                    onClick={() => setStep(5)}
                    className="flex-1 bg-gradient-to-r from-[#4c7c4f] to-[#3f6742] hover:from-[#3f6742] hover:to-[#2e4d31] text-white py-4 px-6 rounded-2xl font-black tracking-wide shadow-lg shadow-[#4c7c4f]/20 transition-all transform active:scale-95 flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span>{t.cropRecTitle}</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

              </div>
            </div>
          )}


          {/* ==============================================
              PAGE 6: CROP RECOMMENDATION (Step 5)
             ============================================== */}
          {step === 5 && cropRecs.length > 0 && (
            <div id="step-crop-recommendations" className="max-w-4xl mx-auto w-full animate-fade-in">
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-green-900/[0.04] border border-[#e2eae3] relative">
                
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8 border-b border-[#f1f6f1] pb-6">
                  <div>
                    <h2 className="text-2xl font-black text-[#1c3822] tracking-tight">
                      {t.cropRecTitle}
                    </h2>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1 block">
                      {t.recommendationsBasedOn}
                    </p>
                  </div>
                  <button
                    onClick={handleRestart}
                    className="py-2 px-4 bg-[#f1f5f2] hover:bg-[#e4ece5] text-[#3c4a3d] border border-[#dfe5e0] font-black text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    {t.restartBtn}
                  </button>
                </div>

                {/* Circular progress bar grids */}
                <div id="circular-gauges-grid" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-8">
                  {cropRecs.map((rec, index) => {
                    const colorClass = getPercentageColor(rec.percentage);
                    // Circle parameter formulas: R = 36, C = 2 * PI * R = 226.2
                    const strokeDashOffset = 226.2 - (226.2 * rec.percentage) / 100;

                    return (
                      <div 
                        key={index} 
                        id={`crop-gauge-${index}`}
                        className="bg-[#fcfdfc] border border-gray-100 hover:border-emerald-300 p-4 rounded-3xl flex flex-col items-center shadow-sm hover:shadow-md transition-all group"
                      >
                        {/* Circle Progress Bar */}
                        <div className="relative w-24 h-24 mb-4">
                          <svg className="w-full h-full transform -rotate-90">
                            {/* Muted Track Circle */}
                            <circle 
                              cx="48" cy="48" r="36" 
                              stroke="#eff6f0" 
                              strokeWidth="7" 
                              fill="transparent" 
                            />
                            {/* Animated Value Circle */}
                            <circle 
                              cx="48" cy="48" r="36" 
                              strokeWidth="7" 
                              fill="transparent" 
                              className={`transition-all duration-1000 ${colorClass}`}
                              strokeDasharray="226.2"
                              strokeDashoffset={strokeDashOffset}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span className="text-base font-black text-[#1c3822]">
                              {rec.percentage}%
                            </span>
                            <span className="text-[8px] font-black tracking-wider text-gray-400 uppercase">SUITABILITY</span>
                          </div>
                        </div>

                        <span className="text-sm font-extrabold text-[#1c3822] text-center w-full truncate">
                          {t.cropsList[rec.crop] || rec.crop}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Final Recommendation Section Card */}
                <div id="recommended-summary-box" className="p-6 bg-gradient-to-tr from-[#edf5ee] to-[#f4fbf5] border border-emerald-100 rounded-3xl mb-8 flex flex-col md:flex-row items-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-600 shadow-md shadow-emerald-600/20 text-white flex items-center justify-center shrink-0">
                    <Sparkles className="w-8 h-8 animate-spin" style={{ animationDuration: '9s' }} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#1c3822] uppercase tracking-wide mb-1.5">
                      🏆 {t.recommendedCrops}
                    </h3>
                    <p className="text-xs text-[#4c6e4f] font-medium leading-relaxed max-w-2xl mb-3">
                      {t.recExplanation}
                    </p>
                    <div id="best-crop-pills" className="flex flex-wrap gap-2">
                      {cropRecs.slice(0, 3).map((item) => (
                        <span key={item.crop} className="px-3 py-1.5 bg-[#4c7c4f] text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center gap-1.5">
                          {t.cropsList[item.crop] || item.crop}
                          <span className="bg-white/20 px-1.5 py-0.5 rounded-md font-black text-[10px]">{item.percentage}%</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Buttons controls */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(4)}
                    className="px-5 py-4 bg-[#f1f5f2] hover:bg-[#e4ece5] text-[#425445] rounded-2xl font-bold transition-all border border-[#dfe5e0] flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>{t.backBtn}</span>
                  </button>
                  <button
                    onClick={handleRestart}
                    className="flex-1 bg-gradient-to-r from-[#4c7c4f] to-[#3f6742] hover:from-[#3f6742] hover:to-[#2e4d31] text-white py-4 px-6 rounded-2xl font-black tracking-wide shadow-lg shadow-[#4c7c4f]/20 transition-all transform active:scale-95 flex items-center justify-center gap-2 group cursor-pointer text-center"
                  >
                    <RotateCcw className="w-4.5 h-4.5" />
                    <span>{t.restartBtn}</span>
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      </main>

      {/* Dynamic Theme Footer */}
      <footer id="app-footer" className="mt-auto bg-[#eef3ef] border-t border-[#e2eae3] py-4 text-center text-xs text-[#527055] font-semibold tracking-wide transition-all uppercase">
        © 2026 {t.title} — {t.tagline}
      </footer>
    </div>
  );
}
