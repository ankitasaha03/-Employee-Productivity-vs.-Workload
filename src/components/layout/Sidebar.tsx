"use client";

import * as React from "react";
import {
  BarChart3,
  TrendingDown,
  Layers,
  AlertOctagon,
  Sliders,
  History,
  Building2,
  Users,
  ShieldAlert,
  Flame,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { DepartmentId } from "@/types/workforce";
import { Badge } from "@/components/ui/badge";

interface SidebarProps {
  activeSection: string;
  onSelectSection: (section: string) => void;
  selectedDepartment: DepartmentId;
  onSelectDepartment: (dept: DepartmentId) => void;
  alertCount: number;
}

export function Sidebar({
  activeSection,
  onSelectSection,
  selectedDepartment,
  onSelectDepartment,
  alertCount,
}: SidebarProps) {
  const navItems = [
    {
      id: "overview",
      label: "Overview & KPIs",
      icon: BarChart3,
      badge: null,
    },
    {
      id: "correlation",
      label: "Workload vs Output",
      icon: TrendingDown,
      badge: "Diminishing Returns",
      badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      id: "departments",
      label: "Department Breakdown",
      icon: Building2,
      badge: "6 Depts",
      badgeColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      id: "bottlenecks",
      label: "Bottleneck & Burnout",
      icon: AlertOctagon,
      badge: `${alertCount} Alerts`,
      badgeColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    },
    {
      id: "trends",
      label: "12-Week Telemetry",
      icon: History,
      badge: null,
    },
    {
      id: "interventions",
      label: "Intervention Center",
      icon: Sliders,
      badge: "Simulator",
      badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
  ];

  const departments: { id: DepartmentId; label: string; count: number; risk: "critical" | "high" | "moderate" | "low" }[] = [
    { id: "all", label: "All Teams", count: 1420, risk: "high" },
    { id: "engineering", label: "Engineering", count: 480, risk: "critical" },
    { id: "support", label: "Customer Support", count: 310, risk: "critical" },
    { id: "operations", label: "Operations", count: 240, risk: "high" },
    { id: "sales", label: "Sales & RevOps", count: 190, risk: "moderate" },
    { id: "product", label: "Product & Design", count: 110, risk: "low" },
    { id: "marketing", label: "Growth & Mktg", count: 90, risk: "low" },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-800/80 bg-slate-950/70 p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        {/* Navigation Sections */}
        <div>
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Intelligence Views
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectSection(item.id)}
                  className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-blue-600/15 text-blue-400 border border-blue-500/30 font-semibold"
                      : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                        isActive ? "text-blue-400" : "text-slate-500"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
                        item.badgeColor || "text-slate-400 bg-slate-800 border-slate-700"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Department Filter Selector */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Department Scopes
            </p>
            <Users className="h-3 w-3 text-slate-500" />
          </div>
          <div className="space-y-1">
            {departments.map((dept) => {
              const isSelected = selectedDepartment === dept.id;
              return (
                <button
                  key={dept.id}
                  onClick={() => onSelectDepartment(dept.id)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-xs transition-colors ${
                    isSelected
                      ? "bg-slate-800 text-white font-semibold border border-slate-700"
                      : "text-slate-400 hover:bg-slate-900 hover:text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        dept.risk === "critical"
                          ? "bg-red-500 animate-pulse"
                          : dept.risk === "high"
                          ? "bg-amber-500"
                          : dept.risk === "moderate"
                          ? "bg-blue-500"
                          : "bg-emerald-500"
                      }`}
                    />
                    <span>{dept.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{dept.count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Diagnostic Alert Card at the bottom */}
      <div className="rounded-xl border border-rose-500/25 bg-rose-950/20 p-3.5 space-y-2 mt-6">
        <div className="flex items-center gap-2 text-rose-300 font-semibold text-xs">
          <Flame className="h-4 w-4 text-rose-400 animate-pulse" />
          <span>Fatigue Inflexion Detected</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          Hours &gt; 46h/wk currently correlating with a <strong className="text-white">+31.5% defect rework spike</strong>.
        </p>
        <button
          onClick={() => onSelectSection("interventions")}
          className="w-full text-center text-[11px] font-semibold text-blue-400 hover:text-blue-300 pt-1 border-t border-rose-500/20 flex items-center justify-center gap-1"
        >
          <span>Open Simulation Engine</span>
          <span>→</span>
        </button>
      </div>
    </aside>
  );
}
