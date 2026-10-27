"use client";

import * as React from "react";
import confetti from "canvas-confetti";
import {
  Sliders,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Clock,
  ArrowRight,
  Flame,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { InterventionPolicy, KpiSummary } from "@/types/workforce";
import { interventionPolicies, initialKpis } from "@/lib/mock-data";

interface InterventionCenterProps {
  onApplyInterventions: (simulatedKpis: KpiSummary) => void;
  onResetInterventions: () => void;
}

export function InterventionCenter({
  onApplyInterventions,
  onResetInterventions,
}: InterventionCenterProps) {
  // Policies state
  const [policies, setPolicies] = React.useState<InterventionPolicy[]>(interventionPolicies);
  const [activePolicyIds, setActivePolicyIds] = React.useState<Set<string>>(
    new Set(["policy-overtime-cap", "policy-scope-descope"])
  );

  // Simulation Sliders
  const [overtimeCap, setOvertimeCap] = React.useState<number>(44); // 40 - 52
  const [scopeReduction, setScopeReduction] = React.useState<number>(15); // 0 - 30%
  const [focusDays, setFocusDays] = React.useState<number>(1); // 0 - 2 days
  const [isApplied, setIsApplied] = React.useState<boolean>(false);

  // Calculate dynamic projected metrics based on active policies and sliders
  const projections = React.useMemo(() => {
    // Baseline
    let baseProd = initialKpis.productivityIndex;
    let baseOt = initialKpis.overtimeRate;
    let baseAbs = initialKpis.absenteeismRate;
    let baseAlerts = initialKpis.burnoutAlertCount;

    // Overtime cap effect: Lower cap below 48 brings high gains
    const otGap = Math.max(48.7 - overtimeCap, 0);
    const otGain = otGap * 2.8; // +2.8 prod per hour capped
    const otDrop = otGap * 5.2; // -5.2% overtime rate per hour capped
    const absDrop = otGap * 0.9;
    const alertDrop = Math.round(otGap * 6);

    // Scope reduction effect
    const scopeGain = (scopeReduction / 10) * 3.4;
    const scopeOtDrop = (scopeReduction / 10) * 4.0;

    // Focus day effect
    const focusGain = focusDays * 4.2;

    // Sum active policy bonuses
    let policyProdGain = 0;
    let policyOtDrop = 0;
    let policyAbsDrop = 0;
    let policyBurnoutDrop = 0;

    activePolicyIds.forEach((id) => {
      const p = policies.find((pol) => pol.id === id);
      if (p) {
        policyProdGain += p.projectedProductivityGain * 0.4;
        policyOtDrop += Math.abs(p.projectedOvertimeReduction) * 0.3;
        policyAbsDrop += Math.abs(p.projectedAbsenteeismDrop) * 0.35;
        policyBurnoutDrop += Math.abs(p.projectedBurnoutDrop) * 0.35;
      }
    });

    const projectedProd = Math.min(baseProd + otGain + scopeGain + focusGain + policyProdGain, 94.5);
    const projectedOt = Math.max(baseOt - otDrop - scopeOtDrop - policyOtDrop, 10.5);
    const projectedAbs = Math.max(baseAbs - absDrop - policyAbsDrop, 3.2);
    const projectedAlerts = Math.max(baseAlerts - alertDrop - Math.round(policyBurnoutDrop * 0.5), 8);

    return {
      productivityIndex: Number(projectedProd.toFixed(1)),
      productivityIndexDelta: Number((projectedProd - baseProd).toFixed(1)),
      overtimeRate: Number(projectedOt.toFixed(1)),
      overtimeRateDelta: Number((projectedOt - baseOt).toFixed(1)),
      absenteeismRate: Number(projectedAbs.toFixed(1)),
      absenteeismRateDelta: Number((projectedAbs - baseAbs).toFixed(1)),
      burnoutAlertCount: projectedAlerts,
      burnoutAlertDelta: projectedAlerts - baseAlerts,
    };
  }, [overtimeCap, scopeReduction, focusDays, activePolicyIds, policies]);

  const togglePolicy = (id: string) => {
    setActivePolicyIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExecute = () => {
    setIsApplied(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    const simulatedKpis: KpiSummary = {
      headcount: initialKpis.headcount,
      headcountDelta: initialKpis.headcountDelta,
      avgWeeklyHours: overtimeCap,
      avgWeeklyHoursDelta: Number(((overtimeCap - 48.7) / 48.7 * 100).toFixed(1)),
      overtimeRate: projections.overtimeRate,
      overtimeRateDelta: projections.overtimeRateDelta,
      absenteeismRate: projections.absenteeismRate,
      absenteeismRateDelta: projections.absenteeismRateDelta,
      productivityIndex: projections.productivityIndex,
      productivityIndexDelta: projections.productivityIndexDelta,
      burnoutAlertCount: projections.burnoutAlertCount,
      burnoutAlertDelta: projections.burnoutAlertDelta,
    };

    onApplyInterventions(simulatedKpis);
  };

  const handleReset = () => {
    setIsApplied(false);
    setOvertimeCap(44);
    setScopeReduction(15);
    setFocusDays(1);
    setActivePolicyIds(new Set(["policy-overtime-cap"]));
    onResetInterventions();
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-md">
        <CardHeader className="p-5 sm:p-6 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Sliders className="h-5 w-5 text-emerald-400" />
                Workload Intervention Action Center & Simulation Engine
              </CardTitle>
              <Badge variant="success">Predictive Impact Model</Badge>
            </div>
            <CardDescription className="mt-1">
              Test and deploy algorithmic interventions to eliminate cognitive fatigue, redistribute operational bottlenecks, and recover team velocity.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            {isApplied && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="text-xs text-slate-300 border-slate-700 hover:text-white"
              >
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                Reset Baseline
              </Button>
            )}
            <Button
              onClick={handleExecute}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/25 flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              <span>{isApplied ? "Update Live Telemetry" : "Execute & Deploy Policies"}</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-6 space-y-6">
          {/* Top: Live Impact Projection Banner */}
          <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-blue-950/40 p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-400" />
                <span className="font-bold text-white text-sm">
                  Projected 30-Day Organizational Recovery Forecast
                </span>
              </div>
              <span className="text-[11px] text-emerald-300/80 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Confidence: 94.2%
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5">
                <span className="text-xs text-slate-400">Productivity Index</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white">
                    {projections.productivityIndex}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center">
                    <TrendingUp className="mr-0.5 h-3 w-3" />
                    +{projections.productivityIndexDelta}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500">From 68.2 baseline</span>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5">
                <span className="text-xs text-slate-400">Overtime Rate</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white">
                    {projections.overtimeRate}%
                  </span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center">
                    <TrendingDown className="mr-0.5 h-3 w-3" />
                    {projections.overtimeRateDelta}%
                  </span>
                </div>
                <span className="text-[10px] text-slate-500">From 32.4% baseline</span>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5">
                <span className="text-xs text-slate-400">Absenteeism Rate</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white">
                    {projections.absenteeismRate}%
                  </span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center">
                    <TrendingDown className="mr-0.5 h-3 w-3" />
                    {projections.absenteeismRateDelta}%
                  </span>
                </div>
                <span className="text-[10px] text-slate-500">From 7.9% baseline</span>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5">
                <span className="text-xs text-slate-400">High-Risk Pods</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white">
                    {projections.burnoutAlertCount}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center">
                    <TrendingDown className="mr-0.5 h-3 w-3" />
                    {projections.burnoutAlertDelta} pods
                  </span>
                </div>
                <span className="text-[10px] text-slate-500">Down from 46 pods</span>
              </div>
            </div>
          </div>

          {/* Interactive Simulation Sliders */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Interactive Policy Tuning Controls
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Slider 1: Overtime Cap */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">Overtime Hard Cap</span>
                  <span className="font-bold text-blue-400">{overtimeCap} hrs / week</span>
                </div>
                <Slider
                  min={40}
                  max={52}
                  step={1}
                  value={overtimeCap}
                  onValueChange={setOvertimeCap}
                />
                <span className="text-[11px] text-slate-500">
                  Current average is 48.7h. Setting to 42-44h halts cognitive degradation.
                </span>
              </div>

              {/* Slider 2: Sprint Scope Reduction */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">Sprint Backlog De-scoping</span>
                  <span className="font-bold text-emerald-400">-{scopeReduction}% load</span>
                </div>
                <Slider
                  min={0}
                  max={30}
                  step={5}
                  value={scopeReduction}
                  onValueChange={setScopeReduction}
                />
                <span className="text-[11px] text-slate-500">
                  Trims low-priority backlog items to protect core sprint velocity.
                </span>
              </div>

              {/* Slider 3: Meeting-Free Focus Days */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">Meeting-Free Focus Days</span>
                  <span className="font-bold text-purple-400">{focusDays} day / week</span>
                </div>
                <Slider
                  min={0}
                  max={2}
                  step={1}
                  value={focusDays}
                  onValueChange={setFocusDays}
                />
                <span className="text-[11px] text-slate-500">
                  Recovers uninterrupted deep work blocks, eliminating context switching.
                </span>
              </div>
            </div>
          </div>

          {/* Actionable Policy Catalog */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Algorithmic Policy Catalog & Guardrails
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {policies.map((policy) => {
                const isActive = activePolicyIds.has(policy.id);

                return (
                  <div
                    key={policy.id}
                    onClick={() => togglePolicy(policy.id)}
                    className={`rounded-xl border p-4 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                      isActive
                        ? "border-blue-500/50 bg-blue-950/20 shadow-md shadow-blue-950/50"
                        : "border-slate-800 bg-slate-950/60 opacity-70 hover:opacity-100 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          variant={
                            policy.urgency === "urgent"
                              ? "critical"
                              : policy.urgency === "high"
                              ? "warning"
                              : "secondary"
                          }
                        >
                          {policy.urgency.toUpperCase()}
                        </Badge>
                        <div
                          className={`h-5 w-5 rounded-md flex items-center justify-center border transition-all ${
                            isActive
                              ? "bg-blue-600 border-blue-500 text-white"
                              : "border-slate-700 bg-slate-900"
                          }`}
                        >
                          {isActive && <CheckCircle2 className="h-4 w-4" />}
                        </div>
                      </div>

                      <h5 className="text-sm font-bold text-white mb-1.5">{policy.title}</h5>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-3">
                        {policy.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 space-y-1.5 text-[11px]">
                      <div className="flex justify-between text-slate-300">
                        <span>Target Units:</span>
                        <span className="font-semibold text-slate-200 truncate max-w-[140px]">
                          {policy.targetTeams.join(", ")}
                        </span>
                      </div>
                      <div className="flex justify-between text-emerald-400 font-semibold">
                        <span>Projected Output Lift:</span>
                        <span>+{policy.projectedProductivityGain}%</span>
                      </div>
                      <div className="flex justify-between text-rose-400 font-semibold">
                        <span>Burnout Risk Drop:</span>
                        <span>{policy.projectedBurnoutDrop}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
