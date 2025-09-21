// server.ts
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// ===== In-memory vote store =====
let reportVotes: { [key: string]: { count: number; voters: string[] } } = {
  "1": { count: 47, voters: [] },
  "2": { count: 89, voters: [] },
  "3": { count: 23, voters: [] },
  "4": { count: 65, voters: [] },
};

// ===== Root endpoint =====
app.get("/", (req, res) => {
  res.send("✅ Server running. Use /api/reports/:id/vote");
});

// ===== GET vote count =====
app.get("/api/reports/:id/vote", (req, res) => {
  const reportId = req.params.id;
  const report = reportVotes[reportId];
  if (!report) return res.status(404).json({ error: "Report not found" });

  res.json({ votes: report.count });
});

// ===== POST upvote =====
app.post("/api/reports/:id/vote", (req, res) => {
  const reportId = req.params.id;
  const { voterId } = req.body; // not used for now, but kept for future uniqueness

  const report = reportVotes[reportId];
  if (!report) return res.status(404).json({ error: "Report not found" });

  // always increment — every click adds 1
  report.count += 1;

  res.json({ votes: report.count });
});

// ===== Start server =====
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
