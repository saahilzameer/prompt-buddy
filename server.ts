import { config } from "dotenv";
config();
import { GoogleGenAI } from "@google/genai";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, serverTimestamp, query, where, limit, documentId } from "firebase/firestore";
import fs from "fs";

const firebaseConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf8'));
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);


// Initialize Gemini
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Matching Endpoint
  app.post("/api/ai/match", async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) return res.status(400).json({ error: "User ID required" });

      const userDoc = await getDoc(doc(db, "users", userId));
      if (!userDoc.exists()) return res.status(404).json({ error: "User not found" });

      const userData = userDoc.data();
      
      // Get other users to match with
      const snapshot = await getDocs(query(collection(db, "users"), where(documentId(), "!=", userId), limit(20)));

      const candidates = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (candidates.length === 0) {
        return res.json({ message: "No candidates found yet" });
      }

      const prompt = `
        You are an AI Matching Engine for "Prompt Buddy", a professional networking platform.
        Compare the user below with the candidates and find the BEST match.
        
        User:
        ${JSON.stringify(userData)}
        
        Candidates:
        ${JSON.stringify(candidates)}
        
        Rules:
        - Prioritize shared skills (30%), interests (25%), experience (15%), location (10%), and goals (20%).
        - Output a JSON object ONLY with:
          {
            "matchedUserId": "string",
            "compatibilityScore": number (0-100),
            "commonSkills": ["string"],
            "commonInterests": ["string"],
            "icebreaker": "string"
          }
      `;

      console.log("Calling Gemini with model gemini-2.5-flash...");
      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      console.log("Gemini returned successfully");
      const responseText = result.text || "";
      const matchData = JSON.parse(responseText.trim());

      // Save match to DB
      const matchRef = await addDoc(collection(db, "matches"), {
        user_ids: [userId, matchData.matchedUserId],
        compatibility_score: matchData.compatibilityScore,
        common_skills: matchData.commonSkills,
        common_interests: matchData.commonInterests,
        icebreaker: matchData.icebreaker,
        status: "pending",
        created_at: serverTimestamp()
      });

      res.json({ id: matchRef.id, ...matchData });
    } catch (error: any) {
      console.error("AI Match Error:", error);
      res.status(500).json({ error: "Failed to generate match", details: error?.message || String(error) });
    }
  });

  // AI Semantic Search Endpoint
  app.post("/api/ai/search", async (req, res) => {
    try {
      const { query: searchQuery, userId } = req.body;
      if (!searchQuery) return res.status(400).json({ error: "Search query required" });

      // Get users to search through
      const snapshot = await getDocs(query(collection(db, "users"), where("is_discoverable", "==", true), limit(50)));

      const candidates = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(u => u.id !== userId);

      const prompt = `
        You are a semantic search engine for "Prompt Buddy", a professional networking platform.
        Find the most relevant users based on the search query: "${searchQuery}"
        
        Candidates:
        ${JSON.stringify(candidates)}
        
        Rules:
        - Return up to 5 users that BEST match the intent of the query.
        - Prioritize relevance over exact keyword matching.
        - Output a JSON array ONLY of user IDs: ["id1", "id2", ...]
      `;

      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      const matchedIds = JSON.parse((result.text || "").trim());
      
      const results = candidates.filter(u => matchedIds.includes(u.id));
      res.json(results);
    } catch (error) {
      console.error("AI Search Error:", error);
      res.status(500).json({ error: "Semantic search failed" });
    }
  });

  // AI Profile Analysis
  app.post("/api/ai/analyze-profile", async (req, res) => {
    try {
      const { profileData } = req.body;
      const prompt = `
        Analyze this professional profile and provide a networking score (0-100), 
        profile strength (low, medium, high), and collaboration potential.
        
        Profile:
        ${JSON.stringify(profileData)}
        
        Output JSON ONLY:
        {
          "score": number,
          "strength": "string",
          "potential": "string"
        }
      `;

      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      const analysis = JSON.parse((result.text || "").trim());
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ error: "Failed to analyze profile" });
    }
  });

  // Admin Middleware Helper
  const verifyAdmin = async (userId: string) => {
    if (!userId) throw new Error("No user ID provided");
    const adminDoc = await getDoc(doc(db, "users", userId));
    if (!adminDoc.exists() || adminDoc.data()?.is_admin !== true) {
      throw new Error("Unauthorized");
    }
  };

  // Admin: Get Stats & Analytics
  app.post("/api/admin/stats", async (req, res) => {
    try {
      await verifyAdmin(req.body.adminId);
      
      const usersSnap = await getDocs(collection(db, "users"));
      const matchesSnap = await getDocs(collection(db, "matches"));
      
      // Calculate active users (let's say users who are discoverable)
      const activeUsers = usersSnap.docs.filter(d => d.data().is_discoverable).length;

      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const days: { [key: string]: { users: number, matches: number, name: string } } = {};
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        days[formattedDate] = { users: 0, matches: 0, name: formattedDate };
      }

      usersSnap.docs.forEach(doc => {
        const data = doc.data();
        if (data.created_at && typeof data.created_at.toDate === 'function') {
          const d = data.created_at.toDate();
          if (d >= thirtyDaysAgo) {
            const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (days[formattedDate]) {
              days[formattedDate].users += 1;
            }
          }
        }
      });

      matchesSnap.docs.forEach(doc => {
        const data = doc.data();
        if (data.created_at && typeof data.created_at.toDate === 'function') {
          const d = data.created_at.toDate();
          if (d >= thirtyDaysAgo) {
            const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (days[formattedDate]) {
              days[formattedDate].matches += 1;
            }
          }
        }
      });

      const analyticsData = Object.values(days);

      res.json({
        totalUsers: usersSnap.size,
        totalMatches: matchesSnap.size,
        activeUsers,
        analyticsData
      });
    } catch (error: any) {
      res.status(403).json({ error: error.message });
    }
  });

  // Admin: Suspend User
  app.post("/api/admin/users/:id/suspend", async (req, res) => {
    try {
      await verifyAdmin(req.body.adminId);
      await updateDoc(doc(db, "users", req.params.id), {
        account_status: "suspended",
        is_discoverable: false
      });
      res.json({ success: true });
    } catch (error: any) {
      res.status(403).json({ error: error.message });
    }
  });

  // Admin: Delete User
  app.delete("/api/admin/users/:id", async (req, res) => {
    try {
      // For DELETE requests, adminId might be in query
      const adminId = req.query.adminId as string;
      await verifyAdmin(adminId);
      await deleteDoc(doc(db, "users", req.params.id));
      res.json({ success: true });
    } catch (error: any) {
      res.status(403).json({ error: error.message });
    }
  });

  // Admin: Run Global Match
  app.post("/api/admin/global-match", async (req, res) => {
    try {
      await verifyAdmin(req.body.adminId);
      
      const { skillsWeight, interestsWeight, goalsWeight, experienceWeight } = req.body;
      
      // Fetch all users to simulate global matching
      const usersSnap = await getDocs(query(collection(db, "users"), where("is_discoverable", "==", true)));
      const candidates = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      if (candidates.length < 2) {
        return res.json({ message: "Not enough users to run global match", matchesCreated: 0 });
      }

      const prompt = `
        You are a Global AI Matching Engine for "Prompt Buddy".
        Given these users, pair them up into the best possible matches based on their profiles.
        Weights to consider: Skills (${skillsWeight}%), Interests (${interestsWeight}%), Goals (${goalsWeight}%), Experience (${experienceWeight}%).
        
        Users:
        ${JSON.stringify(candidates.map((c: any) => ({ id: c.id, skills: c.skills, interests: c.interests, experience: c.experience_level, goals: c.goals })))}
        
        Output a JSON array ONLY with matches:
        [
          {
            "user1Id": "id",
            "user2Id": "id",
            "score": number (0-100),
            "reason": "string"
          }
        ]
        Limit to 5 best distinct matches.
      `;

      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      const matchData = JSON.parse((result.text || "").trim());
      
      let matchesCreated = 0;
      for (const match of matchData) {
        if (match.user1Id && match.user2Id && match.user1Id !== match.user2Id) {
          await addDoc(collection(db, "matches"), {
            user_ids: [match.user1Id, match.user2Id],
            compatibility_score: match.score,
            icebreaker: match.reason,
            status: "pending",
            created_at: serverTimestamp(),
            is_global_match: true
          });
          matchesCreated++;
        }
      }

      res.json({ success: true, matchesCreated });
    } catch (error: any) {
      console.error("Global Match Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
