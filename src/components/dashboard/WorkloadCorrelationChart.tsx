"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceArea,
  ReferenceLine,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  workloadCorrelationData,
  teamScatterData,
} from "@/lib/mock-data";
import { Info, TrendingDown, AlertTriangle, Sparkles, CheckCircle2 } from "lucide-react";

export function WorkloadCorrelationChart() {
  const [viewMode, setViewMode] = React.useState<"curve" | "scatter">("curve");
  const [highlightZone, setHighlightZone] = React.useState(true);

  // Custom Tooltip for the curve
  const CustomCurveTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-md text-xs space-y-2 max-w-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-white text-sm">{label}</span>
            {data.optimalZone ? (
              <Badge variant="success">Optimal Peak</Badge>
            ) : data.weeklyHours > 46 ? (
              <Badge variant="destructive">Fatigue Collapse</Badge>
            ) : (
              <Badge variant="secondary">Ramp-Up</Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-slate-300">
            <div>
              <span className="text-slate-400">Weekly Output:</span>
              <p className="font-bold text-white text-sm">{data.tasksCompleted} tasks</p>
            </div>
            <div>
              <span className="text-slate-400">Rework / Bugs:</span>
              <p className="font-bold text-rose-400 text-sm">{data.defectReworkRate}%</p>
            </div>
            <div>
              <span className="text-slate-400">Burnout Risk:</span>
              <p className="font-bold text-amber-400 text-sm">{data.burnoutProbability}%</p>
            </div>
            <div>
              <span className="text-slate-400">Unit Efficiency:</span>
              <p className="font-bold text-blue-400 text-sm">{data.efficiencyScore} pts/hr</p>
            </div>
          </div>

          {data.weeklyHours > 46 && (
            <div className="mt-1 rounded bg-rose-950/40 border border-rose-500/30 p-1.5 text-[11px] text-rose-300">
              ⚠️ <strong>Diminishing Return:</strong> Output decreases by{" "}
              {Math.round(((98 - data.tasksCompleted) / 98) * 100)}% due to exhaustion and cognitive bugs.
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Scatter
  const CustomScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      return (
        <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3.5 shadow-2xl backdrop-blur-md text-xs space-y-1.5 max-w-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="font-bold text-white">{point.teamName}</span>
            <span className="text-[10px] text-slate-400">{point.department}</span>
          </div>
          <div className="space-y-1 text-slate-300 text-[11px]">
            <div className="flex justify-between">
              <span>Avg Weekly Hours:</span>
              <strong className="text-white">{point.weeklyHours}h</strong>
            </div>
            <div className="flex justify-between">
              <span>Task Completion Rate:</span>
              <strong className="text-blue-400">{point.tasksCompleted}%</strong>
            </div>
            <div className="flex justify-between">
              <span>Burnout Severity:</span>
              <strong className={point.burnoutScore > 80 ? "text-rose-400" : "text-emerald-400"}>
                {point.burnoutScore} / 100
              </strong>
            </div>
            <div className="flex justify-between">
              <span>Team Size:</span>
              <span className="text-slate-400">{point.size} employees</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-md overflow-hidden">
      <CardHeader className="p-5 sm:p-6 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-bold text-white">
              Workload vs. Output Correlation (The Diminishing Returns Law)
            </CardTitle>
            <Badge variant="warning" className="hidden sm:inline-flex">
              Yerkes-Dodson Threshold
            </Badge>
          </div>
          <CardDescription className="mt-1">
            Visualizing the tipping point: how excessive overtime beyond 44h/wk paradoxically triggers defect spikes and collapses net throughput.
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg bg-slate-800/90 p-1 border border-slate-700/80 text-xs">
            <button
              onClick={() => setViewMode("curve")}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                viewMode === "curve"
                  ? "bg-blue-600 text-white shadow-sm font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Curve & Dual-Axis
            </button>
            <button
              onClick={() => setViewMode("scatter")}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                viewMode === "scatter"
                  ? "bg-blue-600 text-white shadow-sm font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Team Scatter
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setHighlightZone(!highlightZone)}
            className="text-xs text-slate-300 border-slate-700/80 hidden sm:flex"
          >
            {highlightZone ? "Hide Zones" : "Highlight Zones"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-6">
        {viewMode === "curve" ? (
          <div className="space-y-4">
            <div className="h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={workloadCorrelationData}
                  margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id="outputGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis
                    dataKey="hoursBand"
                    stroke="#64748b"
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    dy={5}
                  />
                  {/* Left Y Axis: Tasks Completed */}
                  <YAxis
                    yAxisId="left"
                    stroke="#3b82f6"
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    domain={[40, 110]}
                    label={{
                      value: "Tasks Completed / Sprint",
                      angle: -90,
                      position: "insideLeft",
                      fill: "#94a3b8",
                      fontSize: 11,
                    }}
                  />
                  {/* Right Y Axis: Defect & Burnout Rate % */}
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#f43f5e"
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    domain={[0, 100]}
                    label={{
                      value: "Defect / Burnout Rate (%)",
                      angle: 90,
                      position: "insideRight",
                      fill: "#94a3b8",
                      fontSize: 11,
                    }}
                  />
                  <Tooltip content={<CustomCurveTooltip />} />
                  <Legend
                    verticalAlign="top"
                    wrapperStyle={{ paddingBottom: 15, fontSize: 12 }}
                  />

                  {/* Shaded Reference Area for Optimal Performance Zone */}
                  {highlightZone && (
                    <ReferenceArea
                      yAxisId="left"
                      x1="36-40 hrs"
                      x2="40-44 hrs"
                      strokeOpacity={0.3}
                      fill="#10b981"
                      fillOpacity={0.12}
                    />
                  )}

                  {/* Threshold Line at 44h: Diminishing returns starts */}
                  {highlightZone && (
                    <ReferenceLine
                      yAxisId="left"
                      x="40-44 hrs"
                      stroke="#f59e0b"
                      strokeDasharray="4 4"
                      label={{
                        value: "Peak Efficiency (42h)",
                        position: "top",
                        fill: "#fbbf24",
                        fontSize: 11,
                      }}
                    />
                  )}

                  {/* Tasks Completed (Area + Line) */}
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="tasksCompleted"
                    name="Completed Tasks (Throughput)"
                    fill="url(#outputGradient)"
                    stroke="#3b82f6"
                    strokeWidth={3}
                  />

                  {/* Defect Rework Rate % */}
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="defectReworkRate"
                    name="Defect Rework Rate %"
                    stroke="#f43f5e"
                    strokeWidth={2.5}
                    strokeDasharray="5 5"
                    dot={{ fill: "#f43f5e", r: 4 }}
                  />

                  {/* Burnout Probability % */}
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="burnoutProbability"
                    name="Burnout Probability %"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ fill: "#f59e0b", r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Bottom Insight Callouts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-xs mb-1">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>The Sweet Spot: 38 - 42h</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Maximum output efficiency (2.33 pts/hr) with sub-7% defect rates and low burnout probability (&lt;24%).
                </p>
              </div>

              <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-3">
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-xs mb-1">
                  <AlertTriangle className="h-4 w-4" />
                  <span>The Tipping Point: 44 - 48h</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Defect rework surges to 12.4%. Engineers begin spending 1 in every 4 hours fixing bugs introduced under fatigue.
                </p>
              </div>

              <div className="rounded-xl border border-rose-500/20 bg-rose-950/20 p-3">
                <div className="flex items-center gap-1.5 text-rose-400 font-semibold text-xs mb-1">
                  <TrendingDown className="h-4 w-4" />
                  <span>The Collapse Zone: 48h+</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Net throughput plummets by 48%. Fatigue induces critical incidents, high absenteeism, and demoralizing review bottlenecks.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Team Scatter Plot */
          <div className="space-y-4">
            <div className="h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis
                    type="number"
                    dataKey="weeklyHours"
                    name="Weekly Hours"
                    unit="h"
                    domain={[38, 58]}
                    stroke="#64748b"
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    label={{
                      value: "Average Weekly Hours",
                      position: "insideBottom",
                      offset: -10,
                      fill: "#94a3b8",
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="tasksCompleted"
                    name="Task Completion"
                    unit="%"
                    domain={[50, 95]}
                    stroke="#64748b"
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    label={{
                      value: "Task Completion Rate (%)",
                      angle: -90,
                      position: "insideLeft",
                      fill: "#94a3b8",
                      fontSize: 11,
                    }}
                  />
                  <ZAxis type="number" dataKey="size" range={[60, 400]} name="Headcount" />
                  <Tooltip content={<CustomScatterTooltip />} />
                  <ReferenceLine
                    x={44}
                    stroke="#f59e0b"
                    strokeDasharray="3 3"
                    label={{ value: "Fatigue Threshold (44h)", fill: "#f59e0b", fontSize: 10 }}
                  />
                  <ReferenceLine
                    y={70}
                    stroke="#f43f5e"
                    strokeDasharray="3 3"
                    label={{ value: "Target Delivery (70%)", fill: "#f43f5e", fontSize: 10 }}
                  />
                  <Scatter
                    name="Pods & Teams"
                    data={teamScatterData}
                    fill="#3b82f6"
                    shape={(props: any) => {
                      const { cx, cy, payload } = props;
                      const isHighBurnout = payload.burnoutScore > 80;
                      const isModerate = payload.burnoutScore > 50;
                      const fillColor = isHighBurnout
                        ? "#f43f5e"
                        : isModerate
                        ? "#f59e0b"
                        : "#10b981";

                      return (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={Math.sqrt(payload.size) * 1.5}
                          fill={fillColor}
                          fillOpacity={0.75}
                          stroke={fillColor}
                          strokeWidth={2}
                          className="cursor-pointer transition-transform hover:scale-125"
                        />
                      );
                    }}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-rose-500" />
                  <span>High Burnout (&gt;80)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-amber-500" />
                  <span>Moderate Risk (50-80)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span>Healthy (&lt;50)</span>
                </span>
              </div>
              <span className="text-[11px] text-slate-500">
                Bubble radius represents team headcount size.
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
