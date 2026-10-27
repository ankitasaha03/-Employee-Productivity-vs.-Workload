"use client";

import * as React from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { WorkloadCorrelationChart } from "@/components/dashboard/WorkloadCorrelationChart";
import { DepartmentTable } from "@/components/dashboard/DepartmentTable";
import { BurnoutRiskMatrix } from "@/components/dashboard/BurnoutRiskMatrix";
import { TrendTimelineChart } from "@/components/dashboard/TrendTimelineChart";
import { InterventionCenter } from "@/components/dashboard/InterventionCenter";
import { WorkforceAiChat } from "@/components/ai/WorkforceAiChat";
import { DepartmentId, TimeRange, KpiSummary } from "@/types/workforce";
import { initialKpis, bottleneckAlerts } from "@/lib/mock-data";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingDown,
  Building2,
  AlertOctagon,
  History,
  Sliders,
  Sparkles,
  Bot,
} from "lucide-react";

export default function WorkforceAnalyticsApp() {
  const [timeRange, setTimeRange] = React.useState<TimeRange>("30d");
  const [selectedDepartment, setSelectedDepartment] = React.useState<DepartmentId>("all");
  const [activeTab, setActiveTab] = React.useState<string>("overview");

  // AI Assistant Drawer & Dock State
  const [isAiOpen, setIsAiOpen] = React.useState<boolean>(false);
  const [isAiDocked, setIsAiDocked] = React.useState<boolean>(false);

  // Intervention simulation state
  const [currentKpis, setCurrentKpis] = React.useState<KpiSummary>(initialKpis);
  const [isSimulated, setIsSimulated] = React.useState<boolean>(false);

  const handleApplyInterventions = (simulatedKpis: KpiSummary) => {
    setCurrentKpis(simulatedKpis);
    setIsSimulated(true);
  };

  const handleResetInterventions = () => {
    setCurrentKpis(initialKpis);
    setIsSimulated(false);
  };

  const handleSelectIntervention = (policyId?: string) => {
    setActiveTab("interventions");
  };

  const handleTriggerInterventionForDept = (deptId: DepartmentId) => {
    setSelectedDepartment(deptId);
    setActiveTab("interventions");
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <Header
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        selectedDepartment={selectedDepartment}
        onDepartmentChange={setSelectedDepartment}
        alertCount={bottleneckAlerts.length}
        isAiDrawerOpen={isAiOpen}
        onToggleAiDrawer={() => setIsAiOpen((prev) => !prev)}
        isAiDocked={isAiDocked}
        onToggleAiDock={() => setIsAiDocked((prev) => !prev)}
      />

      <div className="flex flex-1 relative overflow-x-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeSection={activeTab}
          onSelectSection={(sec) => setActiveTab(sec)}
          selectedDepartment={selectedDepartment}
          onSelectDepartment={(dept) => setSelectedDepartment(dept)}
          alertCount={bottleneckAlerts.length}
        />

        {/* Main Content Area */}
        <main
          className={`flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto transition-all duration-300 ${
            isAiOpen && isAiDocked ? "lg:mr-[460px]" : ""
          }`}
        >
          {/* Top KPI Header Cards */}
          <KpiCards kpis={currentKpis} isSimulated={isSimulated} />

          {/* Tab Navigation for Views */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <TabsList className="bg-slate-900/90 border-slate-800">
                <TabsTrigger value="overview" className="flex items-center gap-1.5">
                  <BarChart3 className="h-3.5 w-3.5" />
                  <span>Overview</span>
                </TabsTrigger>
                <TabsTrigger value="correlation" className="flex items-center gap-1.5">
                  <TrendingDown className="h-3.5 w-3.5" />
                  <span>Diminishing Returns</span>
                </TabsTrigger>
                <TabsTrigger value="departments" className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>Departments</span>
                </TabsTrigger>
                <TabsTrigger value="bottlenecks" className="flex items-center gap-1.5">
                  <AlertOctagon className="h-3.5 w-3.5" />
                  <span>Bottlenecks & Burnout</span>
                </TabsTrigger>
                <TabsTrigger value="trends" className="flex items-center gap-1.5">
                  <History className="h-3.5 w-3.5" />
                  <span>12-Week Trends</span>
                </TabsTrigger>
                <TabsTrigger value="interventions" className="flex items-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-300 font-semibold">Intervention Center</span>
                </TabsTrigger>
              </TabsList>

              {/* Quick AI Trigger button */}
              {!isAiOpen && (
                <button
                  onClick={() => setIsAiOpen(true)}
                  className="hidden xl:flex items-center gap-1.5 text-xs text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1.5 rounded-lg hover:bg-cyan-500/20 transition-colors"
                >
                  <Bot className="h-3.5 w-3.5" />
                  <span>Ask Workforce AI</span>
                </button>
              )}
            </div>

            {/* Overview Tab Content */}
            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* Correlation Summary Chart */}
              <WorkloadCorrelationChart />

              {/* Department Breakdown Table */}
              <DepartmentTable
                selectedDepartment={selectedDepartment}
                onSelectDepartment={setSelectedDepartment}
                onTriggerInterventionForDept={handleTriggerInterventionForDept}
              />

              {/* Burnout Risk Matrix */}
              <BurnoutRiskMatrix onSelectIntervention={handleSelectIntervention} />

              {/* Longitudinal Trends */}
              <TrendTimelineChart />
            </TabsContent>

            {/* Dedicated Correlation Tab */}
            <TabsContent value="correlation" className="space-y-6 mt-6">
              <WorkloadCorrelationChart />
              <TrendTimelineChart />
            </TabsContent>

            {/* Dedicated Departments Tab */}
            <TabsContent value="departments" className="space-y-6 mt-6">
              <DepartmentTable
                selectedDepartment={selectedDepartment}
                onSelectDepartment={setSelectedDepartment}
                onTriggerInterventionForDept={handleTriggerInterventionForDept}
              />
            </TabsContent>

            {/* Dedicated Bottlenecks Tab */}
            <TabsContent value="bottlenecks" className="space-y-6 mt-6">
              <BurnoutRiskMatrix onSelectIntervention={handleSelectIntervention} />
            </TabsContent>

            {/* Dedicated Trends Tab */}
            <TabsContent value="trends" className="space-y-6 mt-6">
              <TrendTimelineChart />
            </TabsContent>

            {/* Dedicated Intervention Center Tab */}
            <TabsContent value="interventions" className="space-y-6 mt-6">
              <InterventionCenter
                onApplyInterventions={handleApplyInterventions}
                onResetInterventions={handleResetInterventions}
              />
            </TabsContent>
          </Tabs>
        </main>

        {/* Integrated AI Chatbot Slide-over / Docked Drawer */}
        <WorkforceAiChat
          isOpen={isAiOpen}
          onClose={() => setIsAiOpen(false)}
          isDocked={isAiDocked}
          onToggleDock={() => setIsAiDocked((prev) => !prev)}
          onFilterDepartment={setSelectedDepartment}
          onSwitchTab={setActiveTab}
          onSimulatePolicy={(policyId) => {
            setActiveTab("interventions");
          }}
          selectedDepartment={selectedDepartment}
        />
      </div>

      {/* Floating Action Button for Mobile / when chat is closed */}
      {!isAiOpen && (
        <button
          onClick={() => setIsAiOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 p-3.5 text-white shadow-2xl shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all"
          aria-label="Open Workforce AI Assistant"
        >
          <Sparkles className="h-5 w-5 text-cyan-200 animate-pulse" />
          <span className="font-bold text-xs sm:text-sm pr-1">Workforce AI</span>
        </button>
      )}
    </div>
  );
}
