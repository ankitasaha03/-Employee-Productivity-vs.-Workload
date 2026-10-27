"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { longitudinalTrends } from "@/lib/mock-data";
import { History, Clock, TrendingDown, UserX, Zap } from "lucide-react";

export function TrendTimelineChart() {
  const [selectedMetrics, setSelectedMetrics] = React.useState<Record<string, boolean>>({
    avgHours: true,
    taskCompletionRate: true,
    absenteeismRate: true,
    productivityIndex: true,
  });

  const toggleMetric = (key: string) => {
    setSelectedMetrics((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3.5 shadow-2xl backdrop-blur-md text-xs space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="font-bold text-white">{data.week} ({data.date})</span>
            <span className="text-[10px] text-slate-400">12-Week Telemetry</span>
          </div>
          <div className="space-y-1 text-slate-300">
            <div className="flex justify-between gap-4">
              <span className="text-amber-400 flex items-center gap-1">
                <Clock className="h-3 w-3" /> Avg Hours:
              </span>
              <strong className="text-white">{data.avgHours}h</strong>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-blue-400 flex items-center gap-1">
                <Zap className="h-3 w-3" /> Task Velocity:
              </span>
              <strong className="text-white">{data.taskCompletionRate}%</strong>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-rose-400 flex items-center gap-1">
                <UserX className="h-3 w-3" /> Absenteeism:
              </span>
              <strong className="text-white">{data.absenteeismRate}%</strong>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-emerald-400 flex items-center gap-1">
                <TrendingDown className="h-3 w-3" /> Productivity Index:
              </span>
              <strong className="text-white">{data.productivityIndex} / 100</strong>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-md">
      <CardHeader className="p-5 sm:p-6 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <History className="h-5 w-5 text-blue-400" />
              12-Week Longitudinal Telemetry (The Lagging Impact Timeline)
            </CardTitle>
            <Badge variant="outline">Q3 Retrospective</Badge>
          </div>
          <CardDescription className="mt-1">
            Tracking the progression: Overtime spikes in Week 08 initially masked fatigue before causing a steep task velocity drop and delayed absenteeism spike in Week 03-01.
          </CardDescription>
        </div>

        {/* Metric Toggles */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => toggleMetric("avgHours")}
            className={`px-2.5 py-1 rounded-md border text-[11px] font-medium transition-all ${
              selectedMetrics.avgHours
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-slate-900 text-slate-500 border-slate-800"
            }`}
          >
            Weekly Hours
          </button>
          <button
            onClick={() => toggleMetric("taskCompletionRate")}
            className={`px-2.5 py-1 rounded-md border text-[11px] font-medium transition-all ${
              selectedMetrics.taskCompletionRate
                ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                : "bg-slate-900 text-slate-500 border-slate-800"
            }`}
          >
            Task Velocity %
          </button>
          <button
            onClick={() => toggleMetric("absenteeismRate")}
            className={`px-2.5 py-1 rounded-md border text-[11px] font-medium transition-all ${
              selectedMetrics.absenteeismRate
                ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                : "bg-slate-900 text-slate-500 border-slate-800"
            }`}
          >
            Absenteeism %
          </button>
          <button
            onClick={() => toggleMetric("productivityIndex")}
            className={`px-2.5 py-1 rounded-md border text-[11px] font-medium transition-all ${
              selectedMetrics.productivityIndex
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                : "bg-slate-900 text-slate-500 border-slate-800"
            }`}
          >
            Productivity Index
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-6">
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={longitudinalTrends}
              margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="week"
                stroke="#64748b"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                dy={5}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 15, fontSize: 12 }} />

              <ReferenceLine
                x="W-08"
                stroke="#f59e0b"
                strokeDasharray="3 3"
                label={{ value: "Crunch Period Begins", fill: "#fbbf24", fontSize: 10, position: "top" }}
              />

              {selectedMetrics.avgHours && (
                <Line
                  type="monotone"
                  dataKey="avgHours"
                  name="Avg Hours Worked (h)"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              )}

              {selectedMetrics.taskCompletionRate && (
                <Line
                  type="monotone"
                  dataKey="taskCompletionRate"
                  name="Task Completion Rate (%)"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              )}

              {selectedMetrics.absenteeismRate && (
                <Line
                  type="monotone"
                  dataKey="absenteeismRate"
                  name="Absenteeism Rate (%)"
                  stroke="#f43f5e"
                  strokeWidth={2.5}
                  strokeDasharray="4 4"
                  dot={{ r: 3 }}
                />
              )}

              {selectedMetrics.productivityIndex && (
                <Line
                  type="monotone"
                  dataKey="productivityIndex"
                  name="Overall Productivity Index"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
