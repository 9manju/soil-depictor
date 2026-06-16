export type Language = "en" | "te" | "hi";

export interface TranslationDict {
  title: string;
  tagline: string;
  selectLanguage: string;
  engName: string;
  telName: string;
  hinName: string;
  continueBtn: string;
  selectLocation: string;
  stateLabel: string;
  distLabel: string;
  mandalLabel: string;
  distPlaceholder: string;
  mandalPlaceholder: string;
  findSoilDetailsBtn: string;
  mandalNotice: string;
  backBtn: string;
  soilInfoTitle: string;
  soilDetailsText: string;
  checkSoilConditionBtn: string;
  waterRetention: string;
  fertility: string;
  Fertility: string;
  drainageCapacity: string;
  soilConditionTitle: string;
  viewAnalysisBtn: string;
  parameterLabel: string;
  currentLabel: string;
  idealLabel: string;
  statusLabel: string;
  analyticsTitle: string;
  chart1Title: string;
  chart2Title: string;
  chart3Title: string;
  cropRecTitle: string;
  chartDesc: string;
  recommendedCrops: string;
  recExplanation: string;
  restartBtn: string;
  subTitleText: string;
  moisture: string;
  Moisture: string;
  nitrogen: string;
  Nitrogen: string;
  phosphorus: string;
  Phosphorus: string;
  potassium: string;
  Potassium: string;
  organicCarbon: string;
  OrganicCarbon: string;
  soilHealthTrend: string;
  SoilHealthTrend: string;
  cropSuitabilityTrend: string;
  CropSuitabilityTrend: string;
  recommendationsBasedOn: string;
  districtsList: Record<string, string>;
  mandalsList: Record<string, string>;
  cropsList: Record<string, string>;
  soilNames: Record<string, string>;
  soilDescriptions: Record<string, string>;
  statusNames: Record<string, string>;
  levels: Record<string, string>;
}

export const translations: Record<Language, TranslationDict> = {
  en: {
    title: "SOIL DEPICTOR",
    tagline: "Know Your Soil, Grow the Right Crop",
    selectLanguage: "Choose Language",
    engName: "English",
    telName: "Telugu (తెలుగు)",
    hinName: "Hindi (हिन्दी)",
    continueBtn: "Continue",
    selectLocation: "Select Region / Location",
    stateLabel: "State",
    distLabel: "District",
    mandalLabel: "Region / Mandal",
    distPlaceholder: "Select a District",
    mandalPlaceholder: "Select a Mandal",
    findSoilDetailsBtn: "Find Soil Details",
    mandalNotice: "Detailed regional soil data is highly calibrated for Visakhapatnam district mandals. Please select Visakhapatnam to experience full soil depth analytics.",
    backBtn: "Back",
    soilInfoTitle: "Soil Information",
    soilDetailsText: "The specialized soil composition in your selected region has been retrieved from regional profiles.",
    checkSoilConditionBtn: "Check Soil Condition",
    waterRetention: "Water Retention Capacity",
    fertility: "Fertility Index",
    Fertility: "Soil Fertility",
    drainageCapacity: "Drainage Efficiency",
    soilConditionTitle: "Soil Condition Analysis",
    viewAnalysisBtn: "View Analytics Dashboard",
    parameterLabel: "Soil Property Parameter",
    currentLabel: "Current",
    idealLabel: "Ideal",
    statusLabel: "Status Rating",
    analyticsTitle: "Soil Analytics Dashboard",
    chart1Title: "Soil Nutrient Concentrations (Current vs Ideal)",
    chart2Title: "Historical Soil Health & Suitability Index",
    chart3Title: "Multifactor Soil Profile Matrix",
    cropRecTitle: "Crop Suitability Recommendation",
    chartDesc: "Visual comparison of essential soil parameters, organic compounds, and micro-nutrient ratios.",
    recommendedCrops: "Highly Recommended Crops to Grow",
    recExplanation: "These crops are highly suitable and biologically optimized for your region's specific soil properties, drainage efficiency, and organic carbon ratio.",
    restartBtn: "Restart Analysis",
    subTitleText: "Agricultural intelligence system analyzing soil chemistry and microclimatic crop fit.",
    moisture: "Moisture",
    Moisture: "Moisture",
    nitrogen: "Nitrogen",
    Nitrogen: "Nitrogen",
    phosphorus: "Phosphorus",
    Phosphorus: "Phosphorus",
    potassium: "Potassium",
    Potassium: "Potassium",
    organicCarbon: "Organic Carbon",
    OrganicCarbon: "Organic Carbon",
    soilHealthTrend: "Soil Health Trend",
    SoilHealthTrend: "Soil Health Trend",
    cropSuitabilityTrend: "Crop Suitability Trend",
    CropSuitabilityTrend: "Crop Suitability Trend",
    recommendationsBasedOn: "Crop recommendations based on soil suitability percentage",
    districtsList: {
      "Anakapalli": "Anakapalli",
      "Anantapur": "Anantapur",
      "Annamayya": "Annamayya",
      "Bapatla": "Bapatla",
      "Chittoor": "Chittoor",
      "Dr. B.R. Ambedkar Konaseema": "Dr. B.R. Ambedkar Konaseema",
      "East Godavari": "East Godavari",
      "Eluru": "Eluru",
      "Guntur": "Guntur",
      "Kakinada": "Kakinada",
      "Krishna": "Krishna",
      "Kurnool": "Kurnool",
      "Nandyal": "Nandyal",
      "NTR": "NTR",
      "Palnadu": "Palnadu",
      "Parvathipuram Manyam": "Parvathipuram Manyam",
      "Prakasam": "Prakasam",
      "Srikakulam": "Srikakulam",
      "Sri Potti Sriramulu Nellore": "Sri Potti Sriramulu Nellore",
      "Sri Sathya Sai": "Sri Sathya Sai",
      "Tirupati": "Tirupati",
      "Visakhapatnam": "Visakhapatnam",
      "Vizianagaram": "Vizianagaram",
      "West Godavari": "West Godavari",
      "YSR Kadapa": "YSR Kadapa",
      "Alluri Sitarama Raju": "Alluri Sitarama Raju"
    },
    mandalsList: {
      "Anandapuram": "Anandapuram",
      "Bheemunipatnam": "Bheemunipatnam",
      "Gajuwaka": "Gajuwaka",
      "Gopalapatnam": "Gopalapatnam",
      "Maharanipeta": "Maharanipeta",
      "Mulagada": "Mulagada",
      "Padmanabham": "Padmanabham",
      "Pedagantyada": "Pedagantyada",
      "Pendurthi": "Pendurthi",
      "Seethammadhara": "Seethammadhara",
      "Visakhapatnam Rural": "Visakhapatnam Rural"
    },
    cropsList: {
      "Paddy": "🌾 Paddy",
      "Groundnut": "🥜 Groundnut",
      "Sugarcane": "🎋 Sugarcane",
      "Cashew": "🌰 Cashew",
      "Mango": "🥭 Mango",
      "Coconut": "🥥 Coconut",
      "Ragi": "🌱 Ragi"
    },
    soilNames: {
      "red_loamy": "Red Loamy Soil",
      "sandy_loamy": "Sandy Loamy Soil",
      "coastal_sandy": "Coastal Sandy Loamy Soil",
      "mixed": "Mixed Soil (Red Loamy + Sandy Loamy)"
    },
    soilDescriptions: {
      "red_loamy": "Rich in iron oxides with porous loamy texture. Highly dynamic for crop root exploration. Responds excellently to organic mulching and nitrogen enrichment.",
      "sandy_loamy": "Finely aerated sand and rich organic loam blend. Keeps root zones warm and well-drained. Excellent for legumes, groundnut crops, and root tubers.",
      "coastal_sandy": "Slick coastal sands with moderate salt spray minerals. Lightweight structure that warms instantly. Benefits highly from split fertilizer applications.",
      "mixed": "High-fertility union of nourishing red clay minerals and aerated sandy soil. Highly adaptive, holding moist organic inputs while allowing robust drainage."
    },
    statusNames: {
      "Excellent": "Excellent ✨",
      "Good": "Good 👍",
      "Moderate": "Moderate ⚖️",
      "Poor": "Poor ⚠️"
    },
    levels: {
      "Low": "Low",
      "Medium": "Medium",
      "High": "High",
      "Excellent": "Excellent",
      "Good": "Good",
      "Moderate": "Moderate",
      "Poor": "Poor"
    }
  },
  te: {
    title: "సాయిల్ డిపిక్టర్",
    tagline: "మీ నేలను తెలుసుకోండి, సరైన పంటను పండించండి",
    selectLanguage: "భాషను ఎంచుకోండి",
    engName: "ఇంగ్లీష్ (English)",
    telName: "తెలుగు",
    hinName: "హిందీ (Hindi)",
    continueBtn: "కొనసాగించండి",
    selectLocation: "రాష్ట్రం మరియు జిల్లా ఎంపిక",
    stateLabel: "రాష్ట్రం",
    distLabel: "జిల్లా",
    mandalLabel: "ప్రాంతం / మండలం",
    distPlaceholder: "జిల్లాను ఎంచుకోండి",
    mandalPlaceholder: "మండలాన్ని ఎంచుకోండి",
    findSoilDetailsBtn: "నేల వివరాలను కనుగొనండి",
    mandalNotice: "విశాఖపట్నం జిల్లాలోని మండలాలకు మాత్రమే అత్యంత ఖచ్చితమైన నేల విశ్లేషణ వివరాలు సిద్ధంగా ఉన్నాయి. దయచేసి పూర్తి విశ్లేషణను అనుభవించడానికి విశాఖపట్నంను ఎంచుకోండి.",
    backBtn: "వెనుకకు",
    soilInfoTitle: "నేల సమాచారం",
    soilDetailsText: "మీరు ఎంచుకున్న మండలంలోని ప్రాంతీయ నేల నమూనా శాస్త్రీయ వివరాలు విశ్లేషించబడ్డాయి.",
    checkSoilConditionBtn: "నేల పరిస్థితిని తనిఖీ చేయండి",
    waterRetention: "నీటిని నిలుపుకునే సామర్థ్యం",
    fertility: "నేల సారవంతం",
    Fertility: "నేల సారవంతం",
    drainageCapacity: "నీటి పారుదల సామర్థ్యం",
    soilConditionTitle: "నేల పోషకాల పరిస్థితి విశ్లేషణ",
    viewAnalysisBtn: "నేల విశ్లేషణ డాష్‌బోర్డ్",
    parameterLabel: "రాసాయన / భౌతిక గుణాలు",
    currentLabel: "ప్రస్తుత స్థాయి",
    idealLabel: "ఆదర్శ స్థాయి",
    statusLabel: "నేల రేటింగ్ పరిస్థితి",
    analyticsTitle: "నేల విశ్లేషణల డాష్‌బోర్డ్",
    chart1Title: "నేల పోషకాల నిష్పత్తి (ప్రస్తుత వర్సెస్ ఆదర్శం)",
    chart2Title: "చారిత్రక నేల ఆరోగ్యం మరియు పంట అనుకూలత సూచిక",
    chart3Title: "నేల బహుళ గుణాల చార్ట్",
    cropRecTitle: "సిఫార్సు చేయబడిన పంటలు",
    chartDesc: "ప్రధాన నత్రజని, రంజకం, పొటాష్ మరియు ఇతర మౌలిక పోషక విలువల పోలిక చిత్రపటం.",
    recommendedCrops: "పండించడానికి అత్యంత అనుకూలమైన పంటలు",
    recExplanation: "ఈ పంటలు మీ ప్రాంతంలోని నేల రకానికి, స్వభావానికి మరియు తేమ నిల్వకు జీవశాస్త్ర పరంగా అత్యుత్తమ దిగుబడిని ఇస్తాయి.",
    restartBtn: "మొదటి నుండి ప్రారంభించండి",
    subTitleText: "నేల రసాయన శాస్త్రం మరియు పంట అనుకూలతను అంచనా వేసే వ్యవసాయ మేధో వ్యవస్థ.",
    moisture: "తేమ (Moisture)",
    Moisture: "తేమ (Moisture)",
    nitrogen: "నత్రజని (Nitrogen)",
    Nitrogen: "నత్రజని (Nitrogen)",
    phosphorus: "భాస్వరం (Phosphorus)",
    Phosphorus: "భాస్వరం (Phosphorus)",
    potassium: "పొటాషియం (Potassium)",
    Potassium: "పొటాషియం (Potassium)",
    organicCarbon: "సేంద్రీయ కర్బనం (Organic Carbon)",
    OrganicCarbon: "సేంద్రీయ కర్బనం (Organic Carbon)",
    soilHealthTrend: "నేల ఆరోగ్యం సరళి",
    SoilHealthTrend: "నేల ఆరోగ్యం సరళి",
    cropSuitabilityTrend: "పంట అనుకూలత సూచిక సరళి",
    CropSuitabilityTrend: "పంట అనుకూలత సూచిక సరళి",
    recommendationsBasedOn: "నేల అనుకూలత శాతం ఆధారంగా పంటల సిఫార్సులు",
    districtsList: {
      "Anakapalli": "అనకాపల్లి",
      "Anantapur": "అనంతపురం",
      "Annamayya": "అన్నమయ్య",
      "Bapatla": "బాపట్ల",
      "Chittoor": "చిత్తూరు",
      "Dr. B.R. Ambedkar Konaseema": "డా. బి.ఆర్. అంబేద్కర్ కోనసీమ",
      "East Godavari": "తూర్పు గోదావరి",
      "Eluru": "ఏలూరు",
      "Guntur": "గుంటూరు",
      "Kakinada": "కాకినాడ",
      "Krishna": "కృష్ణా",
      "Kurnool": "కర్నూలు",
      "Nandyal": "నంద్యాల",
      "NTR": "ఎన్టీఆర్",
      "Palnadu": "పల్నాడు",
      "Parvathipuram Manyam": "పార్వతీపురం మన్యం",
      "Prakasam": "ప్రకాశం",
      "Srikakulam": "శ్రీకాకుళం",
      "Sri Potti Sriramulu Nellore": "శ్రీ పొట్టి శ్రీరాములు నెల్లూరు",
      "Sri Sathya Sai": "శ్రీ సత్యసాయి",
      "Tirupati": "తిరుపతి",
      "Visakhapatnam": "విశాఖపట్నం",
      "Vizianagaram": "విజయనగరం",
      "West Godavari": "పశ్చిమ గోదావరి",
      "YSR Kadapa": "వైఎస్ఆర్ కడప",
      "Alluri Sitarama Raju": "అల్లూరి సీతారామరాజు"
    },
    mandalsList: {
      "Anandapuram": "ఆనందాపురం",
      "Bheemunipatnam": "భీమునిపట్నం",
      "Gajuwaka": "గాజువాక",
      "Gopalapatnam": "గోపాలపట్నం",
      "Maharanipeta": "మహారాణిపేట",
      "Mulagada": "ములగాడ",
      "Padmanabham": "పద్మనాభం",
      "Pedagantyada": "పెదగంట్యాడ",
      "Pendurthi": "పెందుర్తి",
      "Seethammadhara": "సీతామధర",
      "Visakhapatnam Rural": "విశాఖపట్నం రూరల్"
    },
    cropsList: {
      "Paddy": "🌾 వరి",
      "Groundnut": "🥜 వేరుశనగ",
      "Sugarcane": "🎋 చెరకు",
      "Cashew": "🌰 జీడిమామిడి",
      "Mango": "🥭 మామిడి",
      "Coconut": "🥥 కొబ్బరి",
      "Ragi": "🌱 రాగులు"
    },
    soilNames: {
      "red_loamy": "ఎర్ర రాతి నేల (Red Loamy)",
      "sandy_loamy": "ఇసుక దోమ నేల (Sandy Loamy)",
      "coastal_sandy": "తీరప్రాంత ఇసుక నేల (Coastal Sandy)",
      "mixed": "మిశ్రమ నేల (ఎర్ర రాతి + ఇసుక దోమ)"
    },
    soilDescriptions: {
      "red_loamy": "ఇనుము ఆక్సైడ్లు అధికంగా ఉండి బాగా గాలి చొరబడే లక్షణాన్ని కలిగి ఉంటుంది. లోతైన వేర్లు కలిగిన మొక్కలకు, జీడిమామిడికి మరియు రాగులకు అత్యంత శ్రేష్ఠమైనది.",
      "sandy_loamy": "ఇసుక మరియు ఒండ్రు మట్టి సమ్మేళనం. కాంతివంతంగా ఉండి నీటిని త్వరగా నిష్క్రమిస్తుంది. వేరుశనగ పంటకు ప్రధాన ప్రాధాన్యత.",
      "coastal_sandy": "సముద్ర తీరప్రాంత లవణ ఖనిజాలతో కూడిన తేలికపాటి ఇసుక నేల. కొబ్బరి తోటలకు మరియు సముద్రపు గాలితో పెరిగే తోటలకు చక్కగా సరిపోతుంది.",
      "mixed": "ఎర్రమట్టి మరియు ఇసుక ఒండ్రు కలిసిన అత్యంత సారవంతమైన నేల. అన్ని రకాల పంటలకు అనువైన సార్వత్రిక నేల రకం."
    },
    statusNames: {
      "Excellent": "అద్భుతం ✨",
      "Good": "మంచిది 👍",
      "Moderate": "మధ్యస్థంగా ఉంది ⚖️",
      "Poor": "బలహీనంగా ఉంది ⚠️"
    },
    levels: {
      "Low": "తక్కువ",
      "Medium": "మధ్యస్థం",
      "High": "ఎక్కువ",
      "Excellent": "చాలా బాగుంది",
      "Good": "బాగుంది",
      "Moderate": "మధ్యస్థం",
      "Poor": "తక్కువ సారవంతం"
    }
  },
  hi: {
    title: "सॉइल डिपिक्टर",
    tagline: "अपनी मिट्टी को जानें, सही फसल उगाएं",
    selectLanguage: "भाषा का चयन करें",
    engName: "अंग्रेजी (English)",
    telName: "तेलुगु (Telugu)",
    hinName: "हिन्दी",
    continueBtn: "आगे बढ़ें",
    selectLocation: "राज्य और जिला चयन",
    stateLabel: "राज्य",
    distLabel: "ज़िला",
    mandalLabel: "क्षेत्र / मंडल",
    distPlaceholder: "ज़िले का चयन करें",
    mandalPlaceholder: "मंडल का चयन करें",
    findSoilDetailsBtn: "मिट्टी का विवरण देखें",
    mandalNotice: "विस्तृत मिट्टी विश्लेषण डेटा केवल विशाखापत्तनम जिले के मंडलों के लिए सक्रिय है। कृपया गहन मिट्टी विश्लेषण के लिए विशाखापत्तनम चुनें।",
    backBtn: "पीछे जाएं",
    soilInfoTitle: "मृदा की जानकारी",
    soilDetailsText: "आपके चयनित मंडल क्षेत्र की रासायनिक और जैविक मिट्टी संरचना का विवरण पुनः प्राप्त किया गया है।",
    checkSoilConditionBtn: "मिट्टी की स्थिति जांचें",
    waterRetention: "जल धारण क्षमता",
    fertility: "उर्वरता सूचकांक",
    Fertility: "मिट्टी की उर्वरकता",
    drainageCapacity: "जल निकासी क्षमता",
    soilConditionTitle: "मृदा स्वास्थ्य और पोषक तत्व विश्लेषण",
    viewAnalysisBtn: "एनालिटिक्स डैशबोर्ड देखें",
    parameterLabel: "रासायनिक गुण पैरामीटर",
    currentLabel: "वर्तमान स्तर",
    idealLabel: "आदर्श स्तर",
    statusLabel: "मिट्टी की स्थिति रेटिंग",
    analyticsTitle: "मृदा स्वास्थ्य डैशबोर्ड",
    chart1Title: "मिट्टी के प्रमुख पोषक तत्व स्तर (वर्तमान बनाम आदर्श)",
    chart2Title: "समय के साथ मिट्टी की गुणवत्ता एवं फसल अनुकूलता सूचकांक",
    chart3Title: "बहु-कारक मृदा गुणवत्ता मैट्रिक्स",
    cropRecTitle: "फसल अनुकूलता अनुशंसाएँ",
    chartDesc: "आवश्यक नाइट्रोजन, फास्फोरस, पोटेशियम और जैविक कार्बन पैरामीटरों का तुलनात्मक चित्रण।",
    recommendedCrops: "उगाने के लिए सर्वोत्तम अनुशंसित फसलें",
    recExplanation: "ये फसलें आपके क्षेत्र की मिट्टी की अम्लता (pH), जल धारण क्षमता और जैविक कार्बन के अनुसार वैज्ञानिक रूप से अनुकूलित हैं।",
    restartBtn: "पुनः विश्लेषण करें",
    subTitleText: "मिट्टी के रसायन विज्ञान और जलवायु के अनुकूल फसल चयन का विश्लेषण करने वाली कृषि खुफिया प्रणाली।",
    moisture: "नमी (Moisture)",
    Moisture: "नमी (Moisture)",
    nitrogen: "नाइट्रोजन (Nitrogen)",
    Nitrogen: "नाइट्रोजन (Nitrogen)",
    phosphorus: "फास्फोरस (Phosphorus)",
    Phosphorus: "फास्फोरस (Phosphorus)",
    potassium: "पोटेशियम (Potassium)",
    Potassium: "पोटेशियम (Potassium)",
    organicCarbon: "जैविक कार्बन (Organic Carbon)",
    OrganicCarbon: "जैविक कार्बन (Organic Carbon)",
    soilHealthTrend: "मिट्टी स्वास्थ्य रुझान",
    SoilHealthTrend: "मिट्टी स्वास्थ्य रुझान",
    cropSuitabilityTrend: "फसल अनुकूलता रुझान",
    CropSuitabilityTrend: "फसल अनुकूलता रुझान",
    recommendationsBasedOn: "मिट्टी की उपयुक्तता प्रतिशत के आधार पर फसलों की सिफारिशें",
    districtsList: {
      "Anakapalli": "अनकापल्ली",
      "Anantapur": "अनंतपुर",
      "Annamayya": "अन्नमय्या",
      "Bapatla": "बापटला",
      "Chittoor": "चित्तूर",
      "Dr. B.R. Ambedkar Konaseema": "डॉ. बी.आर. अंबेडकर कोनसीमा",
      "East Godavari": "पूर्वी गोदावरी",
      "Eluru": "एलुरु",
      "Guntur": "गुंटूर",
      "Kakinada": "काकीनाडा",
      "Krishna": "कृष्णा",
      "Kurnool": "कुरनूल",
      "Nandyal": "नंदयाल",
      "NTR": "एनटीआर",
      "Palnadu": "पलनाडु",
      "Parvathipuram Manyam": "पार्वतीपुरम मान्यम",
      "Prakasam": "प्रकाशम",
      "Srikakulam": "श्रीकाकुलम",
      "Sri Potti Sriramulu Nellore": "श्री पोट्टि श्रीरामुलु नेल्लोर",
      "Sri Sathya Sai": "श्री सत्य साई",
      "Tirupati": "तिरुपति",
      "Visakhapatnam": "विशाखापत्तनम",
      "Vizianagaram": "विजयनगरम",
      "West Godavari": "पश्चिम गोदावरी",
      "YSR Kadapa": "वाईएसआर कड़पा",
      "Alluri Sitarama Raju": "अल्लूरी सीताराम राजू"
    },
    mandalsList: {
      "Anandapuram": "आनंदापुरम",
      "Bheemunipatnam": "भीमुनिपटनम",
      "Gajuwaka": "गाज़ुवाका",
      "Gopalapatnam": "गोपालपटनम",
      "Maharanipeta": "महारानीपेटा",
      "Mulagada": "मुलागाड़ा",
      "Padmanabham": "पद्मनाभम",
      "Pedagantyada": "पेदागंट्याड़ा",
      "Pendurthi": "पेनदुर्ति",
      "Seethammadhara": "सीतामधारा",
      "Visakhapatnam Rural": "विशाखापत्तनम ग्रामीण"
    },
    cropsList: {
      "Paddy": "🌾 धान/चावल",
      "Groundnut": "🥜 मूंगफली",
      "Sugarcane": "🎋 गन्ना",
      "Cashew": "🌰 काजू",
      "Mango": "🥭 आम",
      "Coconut": "🥥 नारियल",
      "Ragi": "🌱 रागी"
    },
    soilNames: {
      "red_loamy": "लाल दोमट मिट्टी (Red Loamy)",
      "sandy_loamy": "बलुई दोमट मिट्टी (Sandy Loamy)",
      "coastal_sandy": "तटीय रेतीली मिट्टी (Coastal Sandy)",
      "mixed": "मिश्रित मिट्टी (लाल दोमट + बलुई दोमट)"
    },
    soilDescriptions: {
      "red_loamy": "आयरन ऑक्साइड से भरपूर लाल मिट्टी जिसमें छिद्रयुक्त संरचना होती है। गहरी जड़ों वाली फसलों और बागवानी के लिए उत्कृष्ट।",
      "sandy_loamy": "रेत और उपजाऊ दोमट का संतुलित मिश्रण। जड़ों के श्वसन और जल निकासी के लिए सबसे उत्तम। औषधीय पौधे एवं मूंगफली के अनुकूल।",
      "coastal_sandy": "खारे समुद्री हवा के खनिजों से युक्त हल्की रेतीली मिट्टी। नारियल के बागानों और रेतीली फसलों के बढ़ने के लिए अत्यंत अनुकूल।",
      "mixed": "लाल कछार और बलुई दोमट का अद्भुत मिश्रण। नमी भी बनी रहती है और जलभराव भी नहीं होता। बहुमुखी कृषि योग्य।"
    },
    statusNames: {
      "Excellent": "उत्कृष्ट ✨",
      "Good": "अच्छा 👍",
      "Moderate": "सामान्य ⚖️",
      "Poor": "कमजोर ⚠️"
    },
    levels: {
      "Low": "कम",
      "Medium": "मध्यम",
      "High": "उच्च",
      "Excellent": "उत्कृष्ट",
      "Good": "अच्छा",
      "Moderate": "सामान्य",
      "Poor": "कमजोर"
    }
  }
};
