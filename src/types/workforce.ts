export type DepartmentId =
  | "all"
  | "engineering"
  | "sales"
  | "support"
  | "operations"
  | "product"
  | "marketing";

export type RiskLevel = "low" | "moderate" | "high" | "critical";

export type TimeRange = "30d" | "90d" | "q3" | "ytd";

export interface SubTeamMetric {
  id: string;
  name: string;
  headcount: number;
  avgHours: number;
  overtimeRate: number; // percentage (e.g. 34.5)
  taskCompletionRate: number; // percentage (e.g. 71.2)
  absenteeismRate: number; // percentage (e.g. 8.4)
  burnoutRiskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  primaryBottleneck: string;
  leadTimeDays: number;
}

export interface DepartmentMetric {
  id: DepartmentId;
  name: string;
  headcount: number;
  avgHours: number;
  overtimeRate: number;
  taskCompletionRate: number;
  absenteeismRate: number;
  engagementScore: number; // eNPS -100 to 100 or 1-10 scale
  burnoutRiskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  productivityIndex: number; // 0 - 100
  primaryBottleneck: string;
  subTeams: SubTeamMetric[];
}

export interface WorkloadCorrelationPoint {
  hoursBand: string;
  weeklyHours: number;
  tasksCompleted: number;
  defectReworkRate: number; // percentage of rework/bugs caused by exhaustion
  burnoutProbability: number; // %
  efficiencyScore: number; // output per unit hour
  optimalZone: boolean;
}

export interface ScatterPoint {
  id: string;
  teamName: string;
  department: string;
  weeklyHours: number;
  tasksCompleted: number;
  burnoutScore: number;
  size: number;
}

export interface WeeklyTrendPoint {
  week: string;
  date: string;
  avgHours: number;
  overtimePercent: number;
  taskCompletionRate: number;
  absenteeismRate: number;
  productivityIndex: number;
}

export interface BottleneckFlag {
  id: string;
  team: string;
  department: string;
  headcount: number;
  severity: RiskLevel;
  avgHours: number;
  overtimeRate: number;
  absenteeismRate: number;
  taskDropPercent: number;
  headline: string;
  rootCauses: string[];
  recommendedIntervention: string;
}

export interface InterventionPolicy {
  id: string;
  title: string;
  category: "workload_cap" | "scope_adjustment" | "recovery_leave" | "resource_shift";
  department: DepartmentId;
  targetTeams: string[];
  description: string;
  status: "suggested" | "simulated" | "applied";
  projectedProductivityGain: number; // e.g. +14.5%
  projectedOvertimeReduction: number; // e.g. -28.0%
  projectedAbsenteeismDrop: number; // e.g. -4.2%
  projectedBurnoutDrop: number; // e.g. -35%
  urgency: "urgent" | "high" | "medium";
  appliedAt?: string;
}

export interface KpiSummary {
  headcount: number;
  headcountDelta: number;
  avgWeeklyHours: number;
  avgWeeklyHoursDelta: number;
  overtimeRate: number;
  overtimeRateDelta: number;
  absenteeismRate: number;
  absenteeismRateDelta: number;
  productivityIndex: number;
  productivityIndexDelta: number;
  burnoutAlertCount: number;
  burnoutAlertDelta: number;
}

export interface ActionChip {
  id: string;
  label: string;
  actionType: "filter_dept" | "switch_tab" | "simulate_policy" | "ask_query";
  payload: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  keyInsights?: string[];
  actionChips?: ActionChip[];
  suggestedInterventionId?: string;
}
