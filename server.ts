// server.ts
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import type { Request, Response } from "express";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory vote store for testing
let reportVotes: { [key: string]: number } = {
  "1": 47,
  "2": 89,
  "3": 23,
  "4": 65
};

// POST /api/reports/:id/vote
// Body: { voted: boolean }
app.post("/api/reports/:id/vote", (req: Request, res: Response) => {
  const reportId = req.params.id;
  const { voted } = req.body as { voted: boolean };

  if (!(reportId in reportVotes)) {
    return res.status(404).json({ error: "Report not found" });
  }

  // Increment or decrement votes
  reportVotes[reportId] += voted ? 1 : -1;

  return res.json({ votes: reportVotes[reportId] });
});

// GET /api/reports/:id/vote
// Returns current vote count
app.get("/api/reports/:id/vote", (req: Request, res: Response) => {
  const reportId = req.params.id;
  if (!(reportId in reportVotes)) {
    return res.status(404).json({ error: "Report not found" });
  }
  return res.json({ votes: reportVotes[reportId] });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
