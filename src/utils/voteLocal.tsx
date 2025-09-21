// src/utils/voteLocal.ts
const VOTED_KEY = "votedReports_v1";
let votedCache: Set<string> | null = null;

function loadVotedSet(): Set<string> {
  if (votedCache) return votedCache;
  try {
    const raw = localStorage.getItem(VOTED_KEY);
    votedCache = raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    votedCache = new Set();
  }
  return votedCache;
}

function saveVotedSet(set: Set<string>) {
  try {
    localStorage.setItem(VOTED_KEY, JSON.stringify(Array.from(set)));
    votedCache = set;
  } catch {}
}

export function hasVoted(reportId: string): boolean {
  return loadVotedSet().has(reportId);
}

export function setVotedLocal(reportId: string, voted: boolean) {
  const set = loadVotedSet();
  if (voted) set.add(reportId);
  else set.delete(reportId);
  saveVotedSet(set);
}

export function getAllVoted(): string[] {
  return Array.from(loadVotedSet());
}
