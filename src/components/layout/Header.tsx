"use client";

import * as React from "react";
import {
  Activity,
  AlertTriangle,
  Bot,
  Download,
  Calendar,
  Layers,
  Sparkles,
  ChevronDown,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TimeRange, DepartmentId } from "@/types/workforce";
import { Modal } from "@/components/ui/dialog";

interface HeaderProps {
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  selectedDepartment: DepartmentId;
  onDepartmentChange: (dept: DepartmentId) => void;
  alertCount: number;
  isAiDrawerOpen: boolean;
  onToggleAiDrawer: () => void;
  isAiDocked: boolean;
  onToggleAiDock: () => void;
}

export function Header({
  timeRange,
  onTimeRangeChange,
  selectedDepartment,
  onDepartmentChange,
  alertCount,
  isAiDrawerOpen,
  onToggleAiDrawer,
  isAiDocked,
  onToggleAiDock,
}: HeaderProps) {
  const [isExportOpen, setIsExportOpen] = React.useState(false);
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setIsExportOpen(false);
      alert("Executive Workforce Telemetry Brief (PDF) downloaded successfully!");
    }, 1500);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-4 sm:px-6 backdrop-blur-xl">
      {/* Left: Branding & Status */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
              <Activity className="h-5 w-5 text-blue-400" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                WorkPulse <span className="text-blue-400 font-semibold text-xs px-1.5 py-0.5 rounded bg-blue-500/15 border border-blue-500/30">AI</span>
              </h1>
              <span className="hidden md:inline-flex text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Telemetry Active
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Productivity vs. Workload Intelligence System
            </p>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Time Range Selector */}
        <div className="hidden lg:flex items-center rounded-lg bg-slate-900 border border-slate-800 p-1 text-xs font-medium text-slate-300">
          <Calendar className="ml-2 mr-1 h-3.5 w-3.5 text-slate-400" />
          <button
            onClick={() => onTimeRangeChange("30d")}
            className={`px-2.5 py-1 rounded-md transition-all ${
              timeRange === "30d"
                ? "bg-blue-600 text-white shadow-sm font-semibold"
                : "hover:text-white"
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => onTimeRangeChange("90d")}
            className={`px-2.5 py-1 rounded-md transition-all ${
              timeRange === "90d"
                ? "bg-blue-600 text-white shadow-sm font-semibold"
                : "hover:text-white"
            }`}
          >
            90 Days
          </button>
          <button
            onClick={() => onTimeRangeChange("q3")}
            className={`px-2.5 py-1 rounded-md transition-all ${
              timeRange === "q3"
                ? "bg-blue-600 text-white shadow-sm font-semibold"
                : "hover:text-white"
            }`}
          >
            Q3 2026
          </button>
          <button
            onClick={() => onTimeRangeChange("ytd")}
            className={`px-2.5 py-1 rounded-md transition-all ${
              timeRange === "ytd"
                ? "bg-blue-600 text-white shadow-sm font-semibold"
                : "hover:text-white"
            }`}
          >
            YTD
          </button>
        </div>

        {/* Department Quick Filter */}
        <div className="relative">
          <select
            value={selectedDepartment}
            onChange={(e) => onDepartmentChange(e.target.value as DepartmentId)}
            className="h-9 rounded-lg border border-slate-700/80 bg-slate-900/90 px-3 pr-8 text-xs font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
          >
            <option value="all">All Departments (1,420 emp)</option>
            <option value="engineering">Engineering (480 emp)</option>
            <option value="support">Customer Support (310 emp)</option>
            <option value="operations">Operations (240 emp)</option>
            <option value="sales">Sales & RevOps (190 emp)</option>
            <option value="product">Product & Design (110 emp)</option>
            <option value="marketing">Growth & Marketing (90 emp)</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-4 w-4 text-slate-400" />
        </div>

        {/* Burnout Risk Alerts badge */}
        <button
          onClick={() => {
            const el = document.getElementById("bottleneck-section");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
          className="hidden sm:flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition-all cursor-pointer"
          title="Click to view high-risk pods"
        >
          <AlertTriangle className="h-3.5 w-3.5 text-rose-400 animate-bounce" />
          <span>{alertCount} Risk Flags</span>
        </button>

        {/* Export Executive Report Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExportOpen(true)}
          className="hidden md:flex items-center gap-1.5 text-xs text-slate-300 border-slate-700/80 hover:text-white"
        >
          <Download className="h-3.5 w-3.5 text-blue-400" />
          <span>Export Brief</span>
        </Button>

        {/* Workforce AI Chatbot Toggle */}
        <Button
          onClick={onToggleAiDrawer}
          size="sm"
          className="relative flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-medium shadow-md shadow-blue-500/20 text-xs px-3.5"
        >
          <Sparkles className="h-3.5 w-3.5 text-cyan-200 animate-pulse" />
          <span className="font-semibold">Workforce AI</span>
          <span className="flex h-2 w-2 rounded-full bg-cyan-300 animate-ping" />
        </Button>
      </div>

      {/* Export Report Modal */}
      <Modal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        title="Generate Executive Workforce Intelligence Brief"
        description="Compile operational bottleneck diagnosis, Yerkes-Dodson diminishing return analysis, and projected intervention impacts into an executive-ready brief."
      >
        <div className="space-y-4 py-2 text-sm text-slate-300">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-2">
              <span>Report Scope</span>
              <span className="font-semibold text-white">
                {selectedDepartment === "all" ? "Organization-Wide (1,420 Employees)" : selectedDepartment.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-2">
              <span>Timeframe</span>
              <span className="font-semibold text-white">{timeRange.toUpperCase()}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-2">
              <span>Key Finding</span>
              <span className="font-semibold text-rose-400">-13.8% Output Drop @ 48.7h Avg Workload</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Recommended Action</span>
              <span className="font-semibold text-emerald-400">Cap Overtime at 44h + Backlog De-scoping</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            This brief will synthesize live telemetry from Jira/Linear, Git repositories, PagerDuty, and HRIS systems to provide leadership with clear rationale on why increasing hours is counter-productive.
          </p>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <Button variant="ghost" size="sm" onClick={() => setIsExportOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              disabled={isExporting}
              onClick={handleExport}
              className="flex items-center gap-2"
            >
              {isExporting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download Executive PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </header>
  );
}
