import React, { useEffect, useState } from "react";
import { FaArrowUp, FaShareAlt } from "react-icons/fa";
import { hasVoted, setVotedLocal } from "../../utils/voteLocal";

interface ReportCardProps {
  id: string;
  title: string;
  description: string;
  location?: string;
  image?: string;
  initialVotes: number;
  initialVoted?: boolean; // If backend tells you user already voted
}

const ReportCard: React.FC<ReportCardProps> = ({
  id,
  title,
  description,
  location,
  image,
  initialVotes,
  initialVoted,
}) => {
  const [votes, setVotes] = useState<number>(initialVotes);
  const [voted, setVoted] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialVoted !== undefined) {
      setVoted(Boolean(initialVoted));
    } else {
      setVoted(hasVoted(id));
    }
  }, [id, initialVoted]);

  const apiVote = async (newVoted: boolean) => {
    try {
      const res = await fetch(`/api/reports/${id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voted: newVoted }),
      });
      if (!res.ok) throw new Error("Server error");
      const json = await res.json();
      if (typeof json.votes === "number") setVotes(json.votes);
      return true;
    } catch (err) {
      console.error("Vote API failed:", err);
      return false;
    }
  };

  const handleVote = async () => {
    if (loading) return;
    setLoading(true);

    const newVoted = !voted;
    const delta = newVoted ? 1 : -1;

    // Optimistic update
    setVotes((v) => v + delta);
    setVoted(newVoted);
    setVotedLocal(id, newVoted);

    const ok = await apiVote(newVoted);

    if (!ok) {
      // rollback if backend fails
      setVotes((v) => v - delta);
      setVoted(!newVoted);
      setVotedLocal(id, !newVoted);
      alert("Could not save vote to server — saved only locally.");
    }

    setLoading(false);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/reports/${id}`;
    const shareData = { title, text: description, url };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {}
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Could not copy link. URL: " + url);
    }
  };

  return (
    <div style={{ borderRadius: 10, overflow: "hidden", background: "#222", color: "#ddd" }}>
      {image && (
        <div style={{ height: 220, overflow: "hidden" }}>
          <img src={image} alt={title} style={{ width: "100%", objectFit: "cover", filter: "brightness(0.7)" }} />
        </div>
      )}
      <div style={{ padding: 20 }}>
        <h3 style={{ fontSize: 24, margin: "0 0 8px" }}>{title}</h3>
        <p style={{ color: "#bdbdbd", margin: "0 0 14px" }}>{description}</p>
        {location && <div style={{ color: "#b9a7ff", marginBottom: 18 }}>📍 {location}</div>}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <button
            onClick={handleVote}
            disabled={loading}
            aria-pressed={voted}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 12px",
              borderRadius: 8,
              background: voted ? "#5a8cff" : "transparent",
              color: voted ? "#fff" : "#ddd",
              border: "1px solid rgba(255,255,255,0.06)",
              cursor: loading ? "not-allowed" : "pointer",
            }}
            title={voted ? "Undo upvote" : "Upvote"}
          >
            <FaArrowUp />
            <span>{votes}</span>
          </button>

          <button
            onClick={handleShare}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 12px",
              borderRadius: 8,
              background: "transparent",
              color: "#ddd",
              border: "1px solid rgba(255,255,255,0.06)",
              cursor: "pointer",
            }}
            title="Share"
          >
            <FaShareAlt />
            <span>{copied ? "Copied" : "Share"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
