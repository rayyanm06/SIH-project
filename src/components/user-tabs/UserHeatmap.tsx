import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Map, Eye, AlertTriangle, Zap, Droplets, Car, TreePine } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

// Mock heatmap data
const heatmapZones = [
  { id: 1, name: 'Downtown Core', intensity: 95, reports: 127, x: 30, y: 20, size: 80, category: 'high' },
  { id: 2, name: 'Industrial Area', intensity: 78, reports: 89, x: 60, y: 35, size: 60, category: 'medium' },
  { id: 3, name: 'Residential North', intensity: 45, reports: 34, x: 25, y: 50, size: 40, category: 'low' },
  { id: 4, name: 'Shopping District', intensity: 82, reports: 98, x: 45, y: 25, size: 65, category: 'high' },
  { id: 5, name: 'Suburban East', intensity: 32, reports: 23, x: 70, y: 60, size: 35, category: 'low' },
  { id: 6, name: 'University Area', intensity: 67, reports: 56, x: 35, y: 70, size: 50, category: 'medium' },
  { id: 7, name: 'Airport Zone', intensity: 88, reports: 103, x: 80, y: 40, size: 70, category: 'high' },
  { id: 8, name: 'Park District', intensity: 28, reports: 18, x: 50, y: 80, size: 30, category: 'low' },
];

export function UserHeatmap() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [timeFilter, setTimeFilter] = useState('24h');
  const [selectedZone, setSelectedZone] = useState<number | null>(null);

  const issueCategories = [
    { id: 'all', name: t.allIssues, icon: Eye, color: 'text-white' },
    { id: 'infrastructure', name: t.infrastructure, icon: AlertTriangle, color: 'text-red-400' },
    { id: 'utilities', name: t.utilities, icon: Zap, color: 'text-yellow-400' },
    { id: 'water', name: t.waterSanitation, icon: Droplets, color: 'text-blue-400' },
    { id: 'traffic', name: t.traffic, icon: Car, color: 'text-green-400' },
    { id: 'environment', name: t.environment, icon: TreePine, color: 'text-purple-400' },
  ];

  const recentActivity = [
    { time: t.twoMinutesAgo, type: t.infrastructure, location: 'Downtown Core', severity: 'high' },
    { time: t.fifteenMinutesAgo, type: t.traffic, location: 'Shopping District', severity: 'medium' },
    { time: t.thirtyTwoMinutesAgo, type: t.waterSanitation, location: 'Industrial Area', severity: 'high' },
    { time: t.oneHourAgo, type: t.environment, location: 'Park District', severity: 'low' },
    { time: t.twoHoursAgo, type: t.utilities, location: 'University Area', severity: 'medium' },
  ];

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 80) return 'from-red-500/80 to-orange-500/80';
    if (intensity >= 60) return 'from-orange-500/70 to-yellow-500/70';
    if (intensity >= 40) return 'from-yellow-500/60 to-green-500/60';
    return 'from-green-500/50 to-blue-500/50';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="bg-black/20 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <Map className="h-5 w-5 mr-2 text-blue-400" />
              {t.interactiveCityHeatmap}
            </CardTitle>
            <div className="flex items-center space-x-4">
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-32 bg-black/30 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/90 backdrop-blur-xl border-white/20">
                  <SelectItem value="1h">{t.lastHour}</SelectItem>
                  <SelectItem value="24h">{t.last24Hours}</SelectItem>
                  <SelectItem value="7d">{t.last7Days}</SelectItem>
                  <SelectItem value="30d">{t.last30Days}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {issueCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-black/30 border-white/20 text-gray-300 hover:bg-white/10'
                  } transition-all duration-300`}
                >
                  <Icon className={`h-4 w-4 mr-1 ${category.color}`} />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Heatmap and Side Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heatmap */}
        <Card className="lg:col-span-2 bg-black/20 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white">{t.activityDensityMap}</CardTitle>
            <p className="text-gray-400 text-sm">{t.clickZonesInfo}</p>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-96 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden border border-white/10">
              {/* Zones */}
              {heatmapZones.map((zone) => (
                <div
                  key={zone.id}
                  className={`absolute cursor-pointer transition-all duration-500 hover:scale-110 ${
                    selectedZone === zone.id ? 'scale-110 z-10' : ''
                  }`}
                  style={{
                    left: `${zone.x}%`,
                    top: `${zone.y}%`,
                    width: `${zone.size}px`,
                    height: `${zone.size}px`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
                >
                  <div
                    className={`w-full h-full rounded-full bg-gradient-to-br ${getIntensityColor(
                      zone.intensity
                    )} shadow-lg animate-pulse`}
                    style={{
                      boxShadow: `0 0 ${zone.intensity}px rgba(59, 130, 246, 0.6)`,
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-xs bg-black/50 px-1 py-0.5 rounded">
                      {zone.reports}
                    </span>
                  </div>
                  {selectedZone === zone.id && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black/90 backdrop-blur-xl text-white p-3 rounded-lg border border-white/20 whitespace-nowrap z-20">
                      <div className="font-semibold">{zone.name}</div>
                      <div className="text-sm text-gray-300">
                        {zone.reports} {t.reports} • {zone.intensity}% {t.intensity}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center justify-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-blue-500"></div>
                <span className="text-sm text-gray-400">{t.lowActivity}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500"></div>
                <span className="text-sm text-gray-400">{t.mediumActivity}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-orange-500"></div>
                <span className="text-sm text-gray-400">{t.highActivity}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Zone Stats */}
          <Card className="bg-black/20 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white">{t.zoneStatistics}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {heatmapZones.slice(0, 4).map((zone) => (
                <div
                  key={zone.id}
                  className={`p-3 rounded-lg border transition-all duration-300 cursor-pointer ${
                    selectedZone === zone.id
                      ? 'bg-blue-500/20 border-blue-500/50'
                      : 'bg-black/30 border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium text-white">{zone.name}</div>
                      <div className="text-xs text-gray-400">{zone.reports} {t.reports}</div>
                    </div>
                    <Badge className={getSeverityColor(zone.category)}>
                      {zone.intensity}%
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-black/20 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white">{t.recentActivity}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-black/30 hover:bg-black/40 transition-colors">
                  <div>
                    <div className="text-sm text-white">{activity.location}</div>
                    <div className="text-xs text-gray-400">{activity.time}</div>
                  </div>
                  <Badge className={getSeverityColor(activity.severity)}>
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
