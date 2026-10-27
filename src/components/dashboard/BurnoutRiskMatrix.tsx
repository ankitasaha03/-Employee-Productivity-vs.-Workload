"use client";

import * as React from "react";
import {
  AlertOctagon,
  Flame,
  TrendingDown,
  UserX,
  Clock,
  ArrowRight,
  ShieldAlert,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { bottleneckAlerts } from "@/lib/mock-data";
import { BottleneckFlag } from "@/types/workforce";

interface BurnoutRiskMatrixProps {
  onSelectIntervention: (policyId?: string) => void;
}

export function BurnoutRiskMatrix({ onSelectIntervention }: BurnoutRiskMatrixProps) {
  const [selectedAlert, setSelectedAlert] = React.useState<BottleneckFlag>(bottleneckAlerts[0]);

  return (
    <div id="bottleneck-section" className="space-y-4">
      <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-md">
        <CardHeader className="p-5 sm:p-6 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-rose-500" />
                Bottleneck & Burnout Risk Triage Matrix
              </CardTitle>
              <Badge variant="critical">Danger Triad Detected</Badge>
            </div>
            <CardDescription className="mt-1">
              Automated telemetry flags teams exhibiting simultaneous{" "}
              <strong className="text-rose-400">High Overtime (&gt;35%)</strong> +{" "}
              <strong className="text-rose-400">High Absenteeism (&gt;8%)</strong> +{" "}
              <strong className="text-rose-400">Declining Task Velocity (&gt;20% drop)</strong>.
            </CardDescription>
          </div>

          <span className="text-xs text-slate-400 font-medium">
            {bottleneckAlerts.length} High-Risk Pods Triaged
          </span>
        </CardHeader>

        <CardContent className="p-5 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left list of flagged units */}
            <div className="lg:col-span-5 space-y-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Flagged Operational Units
              </p>
              {bottleneckAlerts.map((flag) => {
                const isSelected = selectedAlert.id === flag.id;
                return (
                  <div
                    key={flag.id}
                    onClick={() => setSelectedAlert(flag)}
                    className={`rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "border-rose-500/60 bg-rose-950/30 shadow-lg shadow-rose-950/40"
                        : "border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/60"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{flag.team}</span>
                        <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                          {flag.department}
                        </span>
                      </div>
                      <Badge variant={flag.severity === "critical" ? "critical" : "destructive"}>
                        {flag.severity.toUpperCase()}
                      </Badge>
                    </div>

                    <p className="text-xs font-medium text-rose-300 mb-3">{flag.headline}</p>

                    {/* Metrics snapshot pill */}
                    <div className="grid grid-cols-3 gap-2 text-[11px] bg-slate-900/90 rounded-lg p-2 border border-slate-800/80">
                      <div>
                        <span className="text-slate-400 flex items-center gap-1">
                          <Clock className="h-3 w-3 text-slate-400" />
                          Workload:
                        </span>
                        <strong className="text-white">{flag.avgHours}h/wk</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 flex items-center gap-1">
                          <UserX className="h-3 w-3 text-rose-400" />
                          Sick Leave:
                        </span>
                        <strong className="text-rose-400">{flag.absenteeismRate}%</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 flex items-center gap-1">
                          <TrendingDown className="h-3 w-3 text-amber-400" />
                          Drop:
                        </span>
                        <strong className="text-amber-400">-{flag.taskDropPercent}%</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Detailed Deep-Dive & Root-Cause Diagnosis */}
            <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-slate-950/80 p-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-white">
                        {selectedAlert.team} Diagnosis
                      </h4>
                      <Badge variant="critical">Triaged Alert</Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Division: {selectedAlert.department} • Headcount: {selectedAlert.headcount} specialists
                    </p>
                  </div>
                </div>

                {/* Root Causes */}
                <div className="space-y-2.5">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Telemetric Root Causes Identified:
                  </span>
                  <div className="space-y-2">
                    {selectedAlert.rootCauses.map((cause, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 rounded-lg border border-slate-800 bg-slate-900/90 p-2.5 text-xs text-slate-200"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500/15 text-[10px] font-bold text-rose-400">
                          {idx + 1}
                        </span>
                        <p className="leading-relaxed">{cause}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Interventions */}
                <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-blue-300 font-semibold text-xs">
                    <Zap className="h-4 w-4 text-blue-400" />
                    <span>Algorithmic Recommendation:</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {selectedAlert.recommendedIntervention}
                  </p>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Ready to deploy corrective guardrails?
                </span>
                <Button
                  onClick={() => onSelectIntervention()}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/20"
                >
                  <span>Launch Intervention Simulator</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
