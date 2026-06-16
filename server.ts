import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const districts = [
  "Anakapalli",
  "Anantapur",
  "Annamayya",
  "Bapatla",
  "Chittoor",
  "Dr. B.R. Ambedkar Konaseema",
  "East Godavari",
  "Eluru",
  "Guntur",
  "Kakinada",
  "Krishna",
  "Kurnool",
  "Nandyal",
  "NTR",
  "Palnadu",
  "Parvathipuram Manyam",
  "Prakasam",
  "Srikakulam",
  "Sri Potti Sriramulu Nellore",
  "Sri Sathya Sai",
  "Tirupati",
  "Visakhapatnam",
  "Vizianagaram",
  "West Godavari",
  "YSR Kadapa",
  "Alluri Sitarama Raju"
].sort();

const mandalsOfVisakhapatnam = [
  "Anandapuram",
  "Bheemunipatnam",
  "Gajuwaka",
  "Gopalapatnam",
  "Maharanipeta",
  "Mulagada",
  "Padmanabham",
  "Pedagantyada",
  "Pendurthi",
  "Seethammadhara",
  "Visakhapatnam Rural"
].sort();

// Soil type database by mandal
const soilDataMap: Record<string, {
  name: string;
  typeKey: "red_loamy" | "sandy_loamy" | "coastal_sandy" | "mixed";
  description: string;
  waterRetention: "Low" | "Medium" | "High";
  fertility: "Moderate" | "Medium" | "High";
  drainageCapacity: "Moderate" | "Good" | "Excellent";
}> = {
  "Anandapuram": {
    name: "Red Loamy Soil",
    typeKey: "red_loamy",
    description: "Rich in iron content, highly porous, and ideal for deep-rooting plants. Perfect for multi-tier cropping.",
    waterRetention: "Medium",
    fertility: "High",
    drainageCapacity: "Good"
  },
  "Bheemunipatnam": {
    name: "Sandy Loamy Soil",
    typeKey: "sandy_loamy",
    description: "Combines the warming ease of sand with the structural stability of loam. Excellent for tuber and root crops.",
    waterRetention: "Medium",
    fertility: "Medium",
    drainageCapacity: "Excellent"
  },
  "Gajuwaka": {
    name: "Sandy Loamy Soil",
    typeKey: "sandy_loamy",
    description: "Combines the warming ease of sand with the structural stability of loam. Excellent for tuber and root crops.",
    waterRetention: "Medium",
    fertility: "Medium",
    drainageCapacity: "Excellent"
  },
  "Gopalapatnam": {
    name: "Red Loamy Soil",
    typeKey: "red_loamy",
    description: "Rich in iron content, highly porous, and ideal for deep-rooting plants. Perfect for multi-tier cropping.",
    waterRetention: "Medium",
    fertility: "High",
    drainageCapacity: "Good"
  },
  "Maharanipeta": {
    name: "Coastal Sandy Loamy Soil",
    typeKey: "coastal_sandy",
    description: "Salty maritime coastal sand with organic loam layers. Requires balanced irrigation and organic fertilization.",
    waterRetention: "Low",
    fertility: "Moderate",
    drainageCapacity: "Excellent"
  },
  "Mulagada": {
    name: "Sandy Loamy Soil",
    typeKey: "sandy_loamy",
    description: "Combines the warming ease of sand with the structural stability of loam. Excellent for tuber and root crops.",
    waterRetention: "Medium",
    fertility: "Medium",
    drainageCapacity: "Excellent"
  },
  "Padmanabham": {
    name: "Red Loamy Soil",
    typeKey: "red_loamy",
    description: "Rich in iron content, highly porous, and ideal for deep-rooting plants. Perfect for multi-tier cropping.",
    waterRetention: "Medium",
    fertility: "High",
    drainageCapacity: "Good"
  },
  "Pedagantyada": {
    name: "Sandy Loamy Soil",
    typeKey: "sandy_loamy",
    description: "Combines the warming ease of sand with the structural stability of loam. Excellent for tuber and root crops.",
    waterRetention: "Medium",
    fertility: "Medium",
    drainageCapacity: "Excellent"
  },
  "Pendurthi": {
    name: "Red Loamy Soil",
    typeKey: "red_loamy",
    description: "Rich in iron content, highly porous, and ideal for deep-rooting plants. Perfect for multi-tier cropping.",
    waterRetention: "Medium",
    fertility: "High",
    drainageCapacity: "Good"
  },
  "Seethammadhara": {
    name: "Sandy Loamy Soil",
    typeKey: "sandy_loamy",
    description: "Combines the warming ease of sand with the structural stability of loam. Excellent for tuber and root crops.",
    waterRetention: "Medium",
    fertility: "Medium",
    drainageCapacity: "Excellent"
  },
  "Visakhapatnam Rural": {
    name: "Mixed Soil (Red Loamy + Sandy Loamy)",
    typeKey: "mixed",
    description: "A rich dynamic zone combining porous red clay particles with aerated sandy loam layers. Highly versatile crop support.",
    waterRetention: "Medium",
    fertility: "High",
    drainageCapacity: "Good"
  }
};

// Soil condition analyses
const soilConditionMap: Record<string, {
  status: "Excellent" | "Good" | "Moderate" | "Poor";
  parameters: {
    pH: { current: number; ideal: number };
    nitrogen: { current: number; ideal: number }; // out of 100%
    phosphorus: { current: number; ideal: number };
    potassium: { current: number; ideal: number };
    organicCarbon: { current: number; ideal: number };
    moisture: { current: number; ideal: number };
  }
}> = {
  "red_loamy": {
    status: "Good",
    parameters: {
      pH: { current: 6.8, ideal: 7.0 },
      nitrogen: { current: 78, ideal: 100 },
      phosphorus: { current: 72, ideal: 100 },
      potassium: { current: 85, ideal: 100 },
      organicCarbon: { current: 65, ideal: 100 },
      moisture: { current: 60, ideal: 100 }
    }
  },
  "sandy_loamy": {
    status: "Moderate",
    parameters: {
      pH: { current: 6.3, ideal: 6.5 },
      nitrogen: { current: 65, ideal: 100 },
      phosphorus: { current: 60, ideal: 100 },
      potassium: { current: 70, ideal: 100 },
      organicCarbon: { current: 52, ideal: 100 },
      moisture: { current: 45, ideal: 100 }
    }
  },
  "coastal_sandy": {
    status: "Poor",
    parameters: {
      pH: { current: 7.4, ideal: 7.0 },
      nitrogen: { current: 50, ideal: 100 },
      phosphorus: { current: 45, ideal: 100 },
      potassium: { current: 60, ideal: 100 },
      organicCarbon: { current: 38, ideal: 100 },
      moisture: { current: 40, ideal: 100 }
    }
  },
  "mixed": {
    status: "Excellent",
    parameters: {
      pH: { current: 6.9, ideal: 7.0 },
      nitrogen: { current: 83, ideal: 100 },
      phosphorus: { current: 78, ideal: 100 },
      potassium: { current: 88, ideal: 100 },
      organicCarbon: { current: 70, ideal: 100 },
      moisture: { current: 62, ideal: 100 }
    }
  }
};

// Crop recommendations based on soil types
const cropRecommendationMap: Record<string, Array<{ crop: string; percentage: number }>> = {
  "red_loamy": [
    { crop: "Mango", percentage: 95 },
    { crop: "Groundnut", percentage: 92 },
    { crop: "Ragi", percentage: 90 },
    { crop: "Cashew", percentage: 88 },
    { crop: "Paddy", percentage: 85 },
    { crop: "Sugarcane", percentage: 80 },
    { crop: "Coconut", percentage: 75 }
  ],
  "sandy_loamy": [
    { crop: "Groundnut", percentage: 95 },
    { crop: "Cashew", percentage: 94 },
    { crop: "Mango", percentage: 90 },
    { crop: "Coconut", percentage: 88 },
    { crop: "Ragi", percentage: 82 },
    { crop: "Paddy", percentage: 78 },
    { crop: "Sugarcane", percentage: 72 }
  ],
  "coastal_sandy": [
    { crop: "Coconut", percentage: 95 },
    { crop: "Cashew", percentage: 92 },
    { crop: "Groundnut", percentage: 88 },
    { crop: "Mango", percentage: 85 },
    { crop: "Ragi", percentage: 74 },
    { crop: "Paddy", percentage: 65 },
    { crop: "Sugarcane", percentage: 60 }
  ],
  "mixed": [
    { crop: "Mango", percentage: 93 },
    { crop: "Cashew", percentage: 90 },
    { crop: "Groundnut", percentage: 90 },
    { crop: "Ragi", percentage: 86 },
    { crop: "Paddy", percentage: 82 },
    { crop: "Coconut", percentage: 82 },
    { crop: "Sugarcane", percentage: 76 }
  ]
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to log API requests
  app.use((req, res, next) => {
    console.log(`[API] ${req.method} ${req.url}`);
    next();
  });

  // API REST Endpoints
  // Express endpoints
  app.get("/api/districts", (req, res) => {
    res.json({ districts });
  });

  app.get("/api/mandals", (req, res) => {
    const { district } = req.query;
    if (district === "Visakhapatnam") {
      res.json({ mandals: mandalsOfVisakhapatnam });
    } else {
      res.json({ mandals: [] });
    }
  });

  app.get("/api/soil/:mandal", (req, res) => {
    const mandal = req.params.mandal;
    const soil = soilDataMap[mandal];
    if (soil) {
      res.json({ mandal, ...soil });
    } else {
      // Return default Red Loamy if not matched
      res.status(404).json({ error: "Mandal soil data not found" });
    }
  });

  app.get("/api/soil-condition/:mandal", (req, res) => {
    const mandal = req.params.mandal;
    const soil = soilDataMap[mandal];
    if (soil) {
      const condition = soilConditionMap[soil.typeKey];
      res.json({ mandal, soilType: soil.name, ...condition });
    } else {
      res.status(404).json({ error: "Mandal soil condition not found" });
    }
  });

  app.get("/api/crop-recommendation/:soilType", (req, res) => {
    const soilType = req.params.soilType; // expects 'red_loamy', 'sandy_loamy', etc.
    const recommendations = cropRecommendationMap[soilType] || cropRecommendationMap["red_loamy"];
    res.json({ soilType, recommendations });
  });

  // Vite Integration & Static File Serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server", err);
});
