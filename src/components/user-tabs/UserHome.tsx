import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ArrowUp, Share2, MapPin, Clock, CheckCircle, AlertCircle, Users, Zap, Award, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useLanguage } from '../../contexts/LanguageContext';
import { hasVoted, setVotedLocal } from "../../utils/voteLocal";

// ===== Helper Functions =====
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Resolved': return 'bg-green-500/20 text-green-300 border-green-500/30 neon-glow-hover';
    case 'In Progress': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30 neon-glow-hover';
    case 'Pending': return 'bg-red-500/20 text-red-300 border-red-500/30 neon-glow-hover';
    default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Resolved': return <CheckCircle className="h-4 w-4" />;
    case 'In Progress': return <Clock className="h-4 w-4" />;
    case 'Pending': return <AlertCircle className="h-4 w-4" />;
    default: return <Clock className="h-4 w-4" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50';
    case 'medium': return 'bg-yellow-500 animate-pulse shadow-lg shadow-yellow-500/50';
    case 'low': return 'bg-green-500 shadow-lg shadow-green-500/50';
    default: return 'bg-gray-500';
  }
};

export function UserHome() {
  const { t, language } = useLanguage();
  const [recentReports, setRecentReports] = React.useState([
    {
      id: 1,
      title: language === 'hi' ? "स्ट्रीट लाइट खराब" : "Broken Street Light",
      description: language === 'hi'
        ? `${t.names.areas[1]} के पास मुख्य सड़क पर स्ट्रीट लाइट काम नहीं कर रही`
        : `Street light not working on main road near ${t.names.areas[1]}`,
      location: t.names.areas[1],
      status: "In Progress",
      statusText: t.active,
      upvotes: 47,
      timeAgo: 3,
      image: "https://images.unsplash.com/photo-1696245916884-73713e066842?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBsaWdodCUyMHJlcGFpciUyMG5pZ2h0fGVufDF8fHx8MTc1ODIwMjMxMnww&ixlib=rb-4.1.0&q=80&w=1080",
      priority: "medium",
      ward: language === 'hi' ? "A वार्ड" : "Ward A",
      reportedBy: t.names.users[0]
    },
    {
      id: 2,
      title: language === 'hi' ? "सड़क में गड्ढा" : "Road Pothole",
      description: language === 'hi'
        ? `${t.names.areas[2]} हाईवे पर बड़ा गड्ढा, वाहनों को नुकसान हो रहा`
        : `Large pothole on ${t.names.areas[2]} highway causing vehicle damage`,
      location: t.names.areas[2],
      status: "Pending",
      statusText: t.pending,
      upvotes: 89,
      timeAgo: 6,
      image: "https://images.unsplash.com/photo-1709934730506-fba12664d4e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2FkJTIwcG90aG9sZSUyMGRhbWFnZXxlbnwxfHx8fDE3NTgxNjgwNDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      priority: "high",
      ward: language === 'hi' ? "K पश्चिम वार्ड" : "K West Ward",
      reportedBy: t.names.users[1]
    },
    {
      id: 3,
      title: language === 'hi' ? "कचरा संग्रह नहीं हुआ" : "Garbage Collection Missed",
      description: language === 'hi'
        ? `${t.names.areas[3]} के आवासीय क्षेत्र में 4 दिन से कचरा संग्रह नहीं हुआ`
        : `Garbage not collected for 4 days in ${t.names.areas[3]} residential area`,
      location: t.names.areas[3],
      status: "Resolved",
      statusText: t.resolved,
      upvotes: 23,
      timeAgo: 24,
      image: "https://images.unsplash.com/photo-1740635313618-35636018c870?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxnYXJiYWdlJTIwY29sbGVjdGlvbiUyMHRydWNrfGVufDF8fHx8MTc1ODIwMjMxOHww&ixlib=rb-4.1.0&q=80&w=1080",
      priority: "medium",
      ward: language === 'hi' ? "H पूर्व वार्ड" : "H East Ward",
      reportedBy: t.names.users[2]
    },
    {
      id: 4,
      title: language === 'hi' ? "पानी का रिसाव" : "Water Leakage",
      description: language === 'hi'
        ? `${t.names.areas[4]} कम्युनिटी सेंटर के पास पानी की पाइप फटी हुई है`
        : `Water pipe burst near ${t.names.areas[4]} Community Center`,
      location: t.names.areas[4],
      status: "In Progress",
      statusText: t.active,
      upvotes: 65,
      timeAgo: 8,
      image: "https://images.unsplash.com/photo-1708561159079-d4d9a40881f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlciUyMHBpcGUlMjBsZWFrJTIwYnVyc3R8ZW58MXx8fHwxNzU4MjAyMzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      priority: "high",
      ward: language === 'hi' ? "L वार्ड" : "L Ward",
      reportedBy: t.names.users[3]
    }
  ]);

const [reportVotes, setReportVotes] = React.useState<{ [key: number]: { votes: number } }>({});

  // ===== Initialize votes from backend + local storage =====
 React.useEffect(() => {
  const initVotes = async () => {
    const init: { [key: number]: { votes: number } } = {};
    for (const r of recentReports) {
      try {
        const res = await fetch(`http://localhost:5000/api/reports/${r.id}/vote`);
        const json = await res.json();
        init[r.id] = { votes: json.votes ?? r.upvotes }; // remove `voted`
      } catch (err) {
        init[r.id] = { votes: r.upvotes }; // remove `voted`
      }
    }
    setReportVotes(init);
  };
  initVotes();
}, [recentReports]);


  // ===== Format time ago =====
  const formatTimeAgo = (num: number, unit: 'hours' | 'days') => {
    if (language === 'hi') return unit === 'hours' ? `${num} घंटे पहले` : `${num} दिन पहले`;
    return `${num} ${unit === 'hours' ? t.hoursAgo ?? 'hours ago' : t.daysAgo ?? 'days ago'}`;
  };

  // ===== Upvote =====
 const handleUpvote = async (reportId: number) => {
  // Optional: generate voterId for analytics
  let voterId = localStorage.getItem("voterId");
  if (!voterId) {
    voterId = crypto.randomUUID();
    localStorage.setItem("voterId", voterId);
  }

  // Optimistic UI: increment vote immediately
  const current = reportVotes[reportId] ?? { votes: recentReports.find(r => r.id === reportId)?.upvotes ?? 0 };
  setReportVotes(prev => ({
    ...prev,
    [reportId]: { votes: current.votes + 1 }
  }));

  // Send vote to backend
  try {
    const res = await fetch(`http://localhost:5000/api/reports/${reportId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ voterId })
    });

    const json = await res.json();
    if (typeof json.votes === "number") {
      setReportVotes(prev => ({
        ...prev,
        [reportId]: { votes: json.votes }
      }));
    }
  } catch (err) {
    console.error("Vote API failed:", err);
    // rollback if backend fails
    setReportVotes(prev => ({
      ...prev,
      [reportId]: current
    }));
    alert("Could not save vote to server.");
  }
};


  // ===== Share =====
  const handleShare = async (reportId: number) => {
    const report = recentReports.find(r => r.id === reportId);
    if (!report) return;

    const url = `${window.location.origin}/reports/${reportId}`;
    if (navigator.share) {
      try { await navigator.share({ title: report.title, text: report.description, url }); } catch {}
    } else {
      try { await navigator.clipboard.writeText(url); alert("Copied link: " + url); } catch { alert("Copy manually: " + url); }
    }
  };

  // ===== Render =====
  return (
    <div className="space-y-6">
      {/* Welcome & Stats */}
      <Card className="relative glass-card hover:glass-card-hover neon-glow-hover transition-all duration-500 overflow-hidden group">
        <CardHeader className="relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
            <div className="space-y-2">
              <CardTitle className="text-2xl lg:text-3xl bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                {t.welcomeBack}, {t.names.users[0]}!
              </CardTitle>
              <p className="text-gray-400 text-base lg:text-lg">{t.stayUpdated}</p>
              <p className="text-sm text-gray-500">{t.ourCityResponsibility}</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full lg:w-auto">
              <div className="text-center glass-card p-4 rounded-lg neon-glow-hover group-hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-center mb-2"><Zap className="h-5 w-5 text-blue-400 mr-1" /><div className="text-xl lg:text-2xl font-bold text-blue-400 animate-pulse">23</div></div>
                <div className="text-xs lg:text-sm text-gray-400">{t.totalReports}</div>
              </div>
              <div className="text-center glass-card p-4 rounded-lg neon-glow-hover group-hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-center mb-2"><CheckCircle className="h-5 w-5 text-green-400 mr-1" /><div className="text-xl lg:text-2xl font-bold text-green-400 animate-pulse">18</div></div>
                <div className="text-xs lg:text-sm text-gray-400">{t.resolvedIssues}</div>
              </div>
              <div className="text-center glass-card p-4 rounded-lg neon-glow-hover group-hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-center mb-2"><Award className="h-5 w-5 text-purple-400 mr-1" /><div className="text-xl lg:text-2xl font-bold text-purple-400 animate-pulse">342</div></div>
                <div className="text-xs lg:text-sm text-gray-400">{t.civicScore}</div>
              </div>
              <div className="text-center glass-card p-4 rounded-lg neon-glow-hover group-hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-center mb-2"><TrendingUp className="h-5 w-5 text-orange-400 mr-1" /><div className="text-xl lg:text-2xl font-bold text-orange-400 animate-pulse">87%</div></div>
                <div className="text-xs lg:text-sm text-gray-400">{t.successRate}</div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Recent Reports */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl lg:text-2xl font-semibold text-white flex items-center"><Users className="h-6 w-6 mr-3 text-blue-400 animate-pulse" />{t.recentActivity}</h2>
          <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 animate-pulse">🇮🇳 {t.mumbaiMunicipalCorporation}</Badge>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {recentReports.map((report, index) => (
            <Card key={report.id} className="glass-card hover:glass-card-hover neon-glow-hover transition-all duration-500 group cursor-pointer overflow-hidden" style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="p-0">
                <div className="relative h-48 sm:h-56 overflow-hidden rounded-t-lg">
                  <ImageWithFallback src={report.image} alt={report.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-4 right-4 space-y-2">
                    <Badge className={`${getStatusColor(report.status)} backdrop-blur-sm`}>{getStatusIcon(report.status)}<span className="ml-1">{report.statusText}</span></Badge>
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 backdrop-blur-sm">{report.ward}</Badge>
                  </div>
                  <div className="absolute top-4 left-4"><div className={`w-4 h-4 rounded-full ${getPriorityColor(report.priority)}`}><div className="w-2 h-2 bg-white rounded-full absolute top-1 left-1 animate-pulse"></div></div></div>
                </div>

                <div className="p-4 sm:p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg lg:text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">{report.title}</h3>
                    <p className="text-gray-400 text-sm lg:text-base line-clamp-2">{report.description}</p>
                    <p className="text-xs text-gray-500">{t.reportedBy}: {report.reportedBy}</p>
                  </div>

                  <div className="flex items-center text-sm text-gray-400">
                    <MapPin className="h-4 w-4 mr-2 text-purple-400" />
                    <span className="font-medium">{report.location}</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpvote(report.id)}
                        className="text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-300"
                      >
                        <ArrowUp className="h-4 w-4 mr-1" />
                        <span className="font-semibold">{reportVotes[report.id]?.votes ?? report.upvotes}</span>
                      </Button>


                      <Button variant="ghost" size="sm" onClick={() => handleShare(report.id)} className="text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 neon-glow-hover transition-all duration-300 hover:scale-105">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-right"><div className="text-xs text-gray-500">{formatTimeAgo(report.timeAgo, report.timeAgo > 24 ? 'days' : 'hours')}</div></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Card className="glass-card text-center p-6 border-dashed border-white/20">
        <p className="text-gray-400 text-sm">🏙️ {language === 'hi' ? 'मुंबई स्मार्ट सिटी पहल के तहत • Mumbai Smart City Initiative के साथ मिलकर बनाएं बेहतर मुंबई' : 'Mumbai Smart City Initiative • Together, let\'s build a better Mumbai'}</p>
      </Card>
    </div>
  );
}
