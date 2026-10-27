"use client";

import * as React from "react";
import {
  Search,
  ChevronDown,
  ChevronRight,
  ArrowUpDown,
  Building2,
  AlertTriangle,
  Flame,
  CheckCircle2,
  SlidersHorizontal,
  ExternalLink,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DepartmentMetric, DepartmentId, RiskLevel } from "@/types/workforce";
import { departmentMetrics } from "@/lib/mock-data";

interface DepartmentTableProps {
  selectedDepartment: DepartmentId;
  onSelectDepartment: (dept: DepartmentId) => void;
  onTriggerInterventionForDept?: (deptId: DepartmentId) => void;
}

type SortField =
  | "name"
  | "headcount"
  | "avgHours"
  | "overtimeRate"
  | "taskCompletionRate"
  | "absenteeismRate"
  | "engagementScore"
  | "burnoutRiskScore";

export function DepartmentTable({
  selectedDepartment,
  onSelectDepartment,
  onTriggerInterventionForDept,
}: DepartmentTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortField, setSortField] = React.useState<SortField>("burnoutRiskScore");
  const [sortAsc, setSortAsc] = React.useState(false);
  const [expandedDepts, setExpandedDepts] = React.useState<Record<string, boolean>>({
    engineering: true, // open by default to highlight the main bottleneck
    support: true,
  });

  const toggleExpand = (id: string) => {
    setExpandedDepts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const filteredDepts = React.useMemo(() => {
    return departmentMetrics
      .filter((dept) => {
        if (selectedDepartment !== "all" && dept.id !== selectedDepartment) {
          return false;
        }
        if (searchTerm.trim() === "") return true;
        const term = searchTerm.toLowerCase();
        return (
          dept.name.toLowerCase().includes(term) ||
          dept.primaryBottleneck.toLowerCase().includes(term) ||
          dept.subTeams.some((st) => st.name.toLowerCase().includes(term))
        );
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === "string") {
          return sortAsc
            ? (valA as string).localeCompare(valB as string)
            : (valB as string).localeCompare(valA as string);
        }
        return sortAsc
          ? (valA as number) - (valB as number)
          : (valB as number) - (valA as number);
      });
  }, [selectedDepartment, searchTerm, sortField, sortAsc]);

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case "critical":
        return <Badge variant="critical">Critical</Badge>;
      case "high":
        return <Badge variant="destructive">High Risk</Badge>;
      case "moderate":
        return <Badge variant="warning">Moderate</Badge>;
      case "low":
        return <Badge variant="success">Healthy</Badge>;
    }
  };

  return (
    <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-md">
      <CardHeader className="p-5 sm:p-6 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-bold text-white">
              Department Telemetry & Operational Bottleneck Breakdown
            </CardTitle>
            <Badge variant="secondary">{filteredDepts.length} Departments</Badge>
          </div>
          <CardDescription className="mt-1">
            Compare average logged hours against task velocity, absenteeism, and employee sentiment to diagnose unit bottlenecks.
          </CardDescription>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search dept or team..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-700/80 bg-slate-950/80 pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {selectedDepartment !== "all" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelectDepartment("all")}
              className="text-xs text-blue-400 border-blue-500/30 hover:bg-blue-500/10"
            >
              Reset Filter
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3.5 pl-6 pr-3">
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center gap-1 hover:text-white"
                >
                  <span>Department & Pods</span>
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="py-3.5 px-3">
                <button
                  onClick={() => handleSort("headcount")}
                  className="flex items-center gap-1 hover:text-white"
                >
                  <span>Headcount</span>
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="py-3.5 px-3">
                <button
                  onClick={() => handleSort("avgHours")}
                  className="flex items-center gap-1 hover:text-white"
                >
                  <span>Avg Hours/Wk</span>
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="py-3.5 px-3">
                <button
                  onClick={() => handleSort("overtimeRate")}
                  className="flex items-center gap-1 hover:text-white"
                >
                  <span>Overtime %</span>
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="py-3.5 px-3">
                <button
                  onClick={() => handleSort("taskCompletionRate")}
                  className="flex items-center gap-1 hover:text-white"
                >
                  <span>Task Velocity %</span>
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="py-3.5 px-3">
                <button
                  onClick={() => handleSort("absenteeismRate")}
                  className="flex items-center gap-1 hover:text-white"
                >
                  <span>Absenteeism %</span>
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="py-3.5 px-3">
                <button
                  onClick={() => handleSort("engagementScore")}
                  className="flex items-center gap-1 hover:text-white"
                >
                  <span>eNPS Score</span>
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="py-3.5 px-3">
                <button
                  onClick={() => handleSort("burnoutRiskScore")}
                  className="flex items-center gap-1 hover:text-white"
                >
                  <span>Burnout Severity</span>
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="py-3.5 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredDepts.map((dept) => {
              const isExpanded = !!expandedDepts[dept.id];

              return (
                <React.Fragment key={dept.id}>
                  <tr className="hover:bg-slate-800/40 transition-colors group cursor-pointer">
                    <td
                      className="py-3.5 pl-6 pr-3 font-semibold text-white flex items-center gap-2"
                      onClick={() => toggleExpand(dept.id)}
                    >
                      <button
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 group-hover:text-white transition-colors"
                        aria-label="Expand subteams"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{dept.name}</span>
                          {getRiskBadge(dept.riskLevel)}
                        </div>
                        <span className="text-[11px] text-slate-400 line-clamp-1 font-normal mt-0.5">
                          {dept.primaryBottleneck}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-300 font-medium">{dept.headcount}</td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`font-bold ${
                          dept.avgHours > 50
                            ? "text-rose-400"
                            : dept.avgHours > 44
                            ? "text-amber-400"
                            : "text-slate-200"
                        }`}
                      >
                        {dept.avgHours.toFixed(1)}h
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`font-semibold ${
                          dept.overtimeRate > 30 ? "text-rose-400" : "text-slate-300"
                        }`}
                      >
                        {dept.overtimeRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-semibold ${
                            dept.taskCompletionRate < 70
                              ? "text-rose-400"
                              : "text-emerald-400"
                          }`}
                        >
                          {dept.taskCompletionRate.toFixed(1)}%
                        </span>
                        <div className="w-12 bg-slate-800 h-1.5 rounded-full overflow-hidden hidden lg:block">
                          <div
                            className={`h-full ${
                              dept.taskCompletionRate < 70
                                ? "bg-rose-500"
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${dept.taskCompletionRate}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`font-semibold ${
                          dept.absenteeismRate > 8 ? "text-rose-400" : "text-slate-300"
                        }`}
                      >
                        {dept.absenteeismRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`font-semibold ${
                          dept.engagementScore < 0
                            ? "text-rose-400"
                            : dept.engagementScore > 30
                            ? "text-emerald-400"
                            : "text-amber-400"
                        }`}
                      >
                        {dept.engagementScore > 0 ? `+${dept.engagementScore}` : dept.engagementScore}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold ${
                            dept.burnoutRiskScore > 80
                              ? "text-rose-400"
                              : dept.burnoutRiskScore > 60
                              ? "text-amber-400"
                              : "text-emerald-400"
                          }`}
                        >
                          {dept.burnoutRiskScore} / 100
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-6 text-right">
                      {onTriggerInterventionForDept && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onTriggerInterventionForDept(dept.id)}
                          className="text-[11px] h-7 px-2.5 border-slate-700/80 text-blue-400 hover:text-white"
                        >
                          Intervene
                        </Button>
                      )}
                    </td>
                  </tr>

                  {/* Sub-teams Expansion Rows */}
                  {isExpanded &&
                    dept.subTeams.map((sub) => (
                      <tr
                        key={sub.id}
                        className="bg-slate-950/40 border-l-2 border-l-blue-500/50 hover:bg-slate-900/50 transition-colors text-[11px]"
                      >
                        <td className="py-2.5 pl-12 pr-3 text-slate-300">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-200">↳ {sub.name}</span>
                            {getRiskBadge(sub.riskLevel)}
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            {sub.primaryBottleneck} • Lead time: {sub.leadTimeDays}d
                          </p>
                        </td>
                        <td className="py-2.5 px-3 text-slate-400">{sub.headcount}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-300">
                          {sub.avgHours.toFixed(1)}h
                        </td>
                        <td className="py-2.5 px-3 text-slate-300">
                          {sub.overtimeRate.toFixed(1)}%
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={
                              sub.taskCompletionRate < 65
                                ? "text-rose-400 font-semibold"
                                : "text-slate-300"
                            }
                          >
                            {sub.taskCompletionRate.toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={
                              sub.absenteeismRate > 10
                                ? "text-rose-400 font-semibold"
                                : "text-slate-300"
                            }
                          >
                            {sub.absenteeismRate.toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-500">—</td>
                        <td className="py-2.5 px-3 font-bold text-slate-300">
                          {sub.burnoutRiskScore} / 100
                        </td>
                        <td className="py-2.5 pr-6 text-right">
                          <span className="text-[10px] text-slate-500">Pod Sub-tier</span>
                        </td>
                      </tr>
                    ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
