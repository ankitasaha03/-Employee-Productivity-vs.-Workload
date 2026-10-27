"use client";

import * as React from "react";
import {
  Users,
  Clock,
  Zap,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Flame,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { KpiSummary } from "@/types/workforce";
import { formatHours, formatPercent } from "@/lib/utils";

interface KpiCardsProps {
  kpis: KpiSummary;
  isSimulated?: boolean;
}

export function KpiCards({ kpis, isSimulated = false }: KpiCardsProps) {
  const cards = [
    {
      id: "productivity",
      title: "Productivity Index",
      value: `${kpis.productivityIndex.toFixed(1)} / 100`,
      delta: kpis.productivityIndexDelta,
      deltaLabel: "vs benchmark",
      isPositiveGood: true,
      icon: Zap,
      statusColor: kpis.productivityIndex < 70 ? "text-rose-400" : "text-emerald-400",
      accentBg: "from-blue-600/20 to-indigo-600/10 border-blue-500/30",
      description: "Aggregated task velocity, PR completion & SLA compliance score",
      progress: kpis.productivityIndex,
      progressColor: kpis.productivityIndex < 70 ? "bg-rose-500" : "bg-emerald-500",
    },
    {
      id: "avgHours",
      title: "Avg Weekly Hours",
      value: formatHours(kpis.avgWeeklyHours),
      delta: kpis.avgWeeklyHoursDelta,
      deltaLabel: "workload spike",
      isPositiveGood: false, // More hours when productivity is dropping is BAD
      icon: Clock,
      statusColor: kpis.avgWeeklyHours > 45 ? "text-amber-400" : "text-slate-200",
      accentBg: "from-amber-600/20 to-orange-600/10 border-amber-500/30",
      description: "Standard benchmark is 40.0h. Excess creates cognitive fatigue",
      progress: Math.min((kpis.avgWeeklyHours / 60) * 100, 100),
      progressColor: "bg-amber-500",
    },
    {
      id: "overtime",
      title: "Overtime Rate",
      value: `${kpis.overtimeRate.toFixed(1)}%`,
      delta: kpis.overtimeRateDelta,
      deltaLabel: "of total hours",
      isPositiveGood: false,
      icon: Flame,
      statusColor: kpis.overtimeRate > 25 ? "text-rose-400" : "text-slate-200",
      accentBg: "from-rose-600/20 to-red-600/10 border-rose-500/30",
      description: "% of logged hours beyond 40h standard threshold",
      progress: kpis.overtimeRate,
      progressColor: "bg-rose-500",
    },
    {
      id: "absenteeism",
      title: "Absenteeism Rate",
      value: `${kpis.absenteeismRate.toFixed(1)}%`,
      delta: kpis.absenteeismRateDelta,
      deltaLabel: "unplanned leave",
      isPositiveGood: false,
      icon: TrendingDown,
      statusColor: kpis.absenteeismRate > 6 ? "text-rose-400" : "text-emerald-400",
      accentBg: "from-purple-600/20 to-pink-600/10 border-purple-500/30",
      description: "Unplanned sick days & sudden leaves (lagging burnout indicator)",
      progress: Math.min((kpis.absenteeismRate / 15) * 100, 100),
      progressColor: "bg-purple-500",
    },
    {
      id: "burnoutAlerts",
      title: "Burnout Risk Pods",
      value: `${kpis.burnoutAlertCount} Pods`,
      delta: kpis.burnoutAlertDelta,
      deltaLabel: "high-risk units",
      isPositiveGood: false,
      icon: AlertTriangle,
      statusColor: kpis.burnoutAlertCount > 20 ? "text-red-400" : "text-emerald-400",
      accentBg: "from-red-600/20 to-rose-600/10 border-red-500/40",
      description: "Teams with simultaneous High Overtime + High Absenteeism",
      progress: Math.min((kpis.burnoutAlertCount / 60) * 100, 100),
      progressColor: "bg-red-500",
    },
    {
      id: "headcount",
      title: "Total Headcount",
      value: kpis.headcount.toLocaleString(),
      delta: kpis.headcountDelta,
      deltaLabel: "net capacity",
      isPositiveGood: true,
      icon: Users,
      statusColor: "text-blue-400",
      accentBg: "from-slate-800 to-slate-900 border-slate-700/60",
      description: "Active employees tracked across 6 enterprise divisions",
      progress: 88,
      progressColor: "bg-blue-500",
    },
  ];

  return (
    <div className="space-y-2">
      {isSimulated && (
        <div className="flex items-center justify-between rounded-lg bg-emerald-950/40 border border-emerald-500/40 px-3.5 py-2 text-xs text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span className="font-semibold">Simulated Intervention Mode Active</span>
            <span className="text-emerald-400/80">
              — Displaying projected metric changes if policies are enacted.
            </span>
          </div>
          <Badge variant="success">Projections Applied</Badge>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {cards.map((card) => {
          const Icon = card.icon;
          const isFavorable = card.isPositiveGood
            ? card.delta > 0
            : card.delta < 0;

          return (
            <Card
              key={card.id}
              className={`relative overflow-hidden border bg-gradient-to-b ${card.accentBg} hover:border-slate-600 transition-all duration-200 group`}
            >
              <CardContent className="p-4 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      {card.title}
                    </span>
                    <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 group-hover:scale-105 transition-transform">
                      <Icon className={`h-4 w-4 ${card.statusColor}`} />
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <div className="text-2xl font-extrabold tracking-tight text-white">
                      {card.value}
                    </div>
                  </div>

                  {/* Delta indicator */}
                  <div className="mt-2 flex items-center gap-1.5 text-xs">
                    <span
                      className={`inline-flex items-center font-bold px-1.5 py-0.5 rounded text-[11px] ${
                        isFavorable
                          ? "text-emerald-300 bg-emerald-500/15 border border-emerald-500/20"
                          : "text-rose-300 bg-rose-500/15 border border-rose-500/20"
                      }`}
                    >
                      {card.delta > 0 ? (
                        <TrendingUp className="mr-0.5 h-3 w-3 inline" />
                      ) : (
                        <TrendingDown className="mr-0.5 h-3 w-3 inline" />
                      )}
                      {formatPercent(card.delta)}
                    </span>
                    <span className="text-[11px] text-slate-400 truncate">
                      {card.deltaLabel}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3.5 pt-2 border-t border-slate-800/70">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>Threshold</span>
                    <span className="text-slate-300 font-medium">
                      {Math.round(card.progress)}%
                    </span>
                  </div>
                  <Progress
                    value={card.progress}
                    indicatorColor={card.progressColor}
                    className="h-1.5 bg-slate-800/90"
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
