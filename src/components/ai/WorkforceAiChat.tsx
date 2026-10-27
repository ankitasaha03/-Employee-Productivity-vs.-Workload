"use client";

import * as React from "react";
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Maximize2,
  Minimize2,
  ChevronRight,
  TrendingDown,
  AlertTriangle,
  Zap,
  HelpCircle,
  RotateCcw,
  Dock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChatMessage, ActionChip, DepartmentId } from "@/types/workforce";
import { sampleChatMessages } from "@/lib/mock-data";

interface WorkforceAiChatProps {
  isOpen: boolean;
  onClose: () => void;
  isDocked: boolean;
  onToggleDock: () => void;
  onFilterDepartment: (dept: DepartmentId) => void;
  onSwitchTab: (tab: string) => void;
  onSimulatePolicy: (policyId: string) => void;
  selectedDepartment: DepartmentId;
}

export function WorkforceAiChat({
  isOpen,
  onClose,
  isDocked,
  onToggleDock,
  onFilterDepartment,
  onSwitchTab,
  onSimulatePolicy,
  selectedDepartment,
}: WorkforceAiChatProps) {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "ai",
      text: "Hello! I am **Workforce AI**, your real-time productivity & cognitive workload analytics assistant. I continuously analyze sprint velocity, overtime spikes, Git PR turnaround, and absenteeism telemetry.",
      timestamp: "Just now",
      keyInsights: [
        "Identified 46 high-risk pods suffering from diminishing returns past 46h/wk.",
        "Engineering & Customer Support have reached critical burnout thresholds.",
      ],
      actionChips: [
        {
          id: "chip-1",
          label: "Highest Burnout Dept?",
          actionType: "ask_query",
          payload: "Which department has the highest burnout risk this month?",
        },
        {
          id: "chip-2",
          label: "Engineering Productivity Drop",
          actionType: "ask_query",
          payload: "Summarize the root causes of the productivity drop in Engineering",
        },
        {
          id: "chip-3",
          label: "Simulate Overtime Cap",
          actionType: "simulate_policy",
          payload: "policy-overtime-cap",
        },
      ],
    },
  ]);

  const [inputVal, setInputVal] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputVal.trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputVal("");
    setIsTyping(true);

    // AI reasoning simulation
    setTimeout(() => {
      const lower = query.toLowerCase();
      let responseData: { answer: string; insights: string[]; chips: ActionChip[] };

      if (lower.includes("burnout") || lower.includes("highest") || lower.includes("risk")) {
        responseData = {
          answer: sampleChatMessages["burnout"].answer,
          insights: sampleChatMessages["burnout"].insights,
          chips: sampleChatMessages["burnout"].chips.map((c, i) => ({ ...c, id: `chip-b-${i}` })),
        };
      } else if (lower.includes("drop") || lower.includes("engineering") || lower.includes("productivity") || lower.includes("decline") || lower.includes("why")) {
        responseData = {
          answer: sampleChatMessages["drop"].answer,
          insights: sampleChatMessages["drop"].insights,
          chips: sampleChatMessages["drop"].chips.map((c, i) => ({ ...c, id: `chip-d-${i}` })),
        };
      } else if (lower.includes("intervention") || lower.includes("simulate") || lower.includes("cap") || lower.includes("solution") || lower.includes("recommend")) {
        responseData = {
          answer: sampleChatMessages["interventions"].answer,
          insights: sampleChatMessages["interventions"].insights,
          chips: sampleChatMessages["interventions"].chips.map((c, i) => ({ ...c, id: `chip-i-${i}` })),
        };
      } else {
        responseData = {
          answer: `Analyzing workforce metrics for **${selectedDepartment.toUpperCase()}**: telemetry confirms that current workload levels (avg 48.7h/wk) are triggering fatigue-induced defect rework (+31.5%). When employees exceed 44 hours, task completion degrades exponentially.`,
          insights: [
            "Current overtime rate: 32.4% (up 9.2% month-over-month).",
            "Lagging indicator: Absenteeism surges 2 to 3 weeks following crunch sprints.",
            "Recommended immediate intervention: Cap overtime at 44h and de-scope sprint backlog by 15%.",
          ],
          chips: [
            { id: "c1", label: "View Correlation Curve", actionType: "switch_tab", payload: "correlation" },
            { id: "c2", label: "Simulate Policy", actionType: "switch_tab", payload: "interventions" },
            { id: "c3", label: "Filter Engineering", actionType: "filter_dept", payload: "engineering" },
          ],
        };
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: responseData.answer,
        timestamp: "Just now",
        keyInsights: responseData.insights,
        actionChips: responseData.chips,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 700);
  };

  const handleChipClick = (chip: ActionChip) => {
    if (chip.actionType === "ask_query") {
      handleSend(chip.payload);
    } else if (chip.actionType === "filter_dept") {
      onFilterDepartment(chip.payload as DepartmentId);
    } else if (chip.actionType === "switch_tab") {
      onSwitchTab(chip.payload);
    } else if (chip.actionType === "simulate_policy") {
      onSimulatePolicy(chip.payload);
      onSwitchTab("interventions");
    }
  };

  if (!isOpen) return null;

  return (
    <aside
      className={`fixed top-16 bottom-0 right-0 z-40 flex flex-col border-l border-slate-800 bg-slate-950/95 backdrop-blur-2xl shadow-2xl transition-all duration-300 ${
        isDocked ? "w-full md:w-[420px] lg:w-[460px]" : "w-full sm:w-[420px]"
      }`}
    >
      {/* Chat Header */}
      <div className="flex h-14 items-center justify-between border-b border-slate-800 px-4 bg-slate-900/60">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 shadow-md shadow-blue-500/20">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white">Workforce AI</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-400">Context: {selectedDepartment.toUpperCase()}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Dock toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleDock}
            className="h-8 w-8 text-slate-400 hover:text-white hidden lg:flex"
            title={isDocked ? "Undock Chat (Slide-Over)" : "Dock to Dashboard"}
          >
            {isDocked ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>

          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-slate-400 hover:text-white"
            title="Close Assistant"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chat Messages Body */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isAi = msg.sender === "ai";
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAi ? "items-start" : "items-end"} space-y-1.5`}
            >
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 px-1">
                {isAi ? <Bot className="h-3 w-3 text-cyan-400" /> : <User className="h-3 w-3 text-blue-400" />}
                <span>{isAi ? "Workforce AI" : "You"}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`rounded-2xl p-3.5 text-xs max-w-[92%] leading-relaxed ${
                  isAi
                    ? "bg-slate-900 border border-slate-800 text-slate-200 shadow-md"
                    : "bg-blue-600 text-white shadow-md shadow-blue-600/20 font-medium"
                }`}
              >
                <div
                  className="prose prose-invert prose-xs leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: msg.text
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
                      .replace(/\n/g, "<br/>"),
                  }}
                />

                {/* Key Insights Callout for AI responses */}
                {isAi && msg.keyInsights && msg.keyInsights.length > 0 && (
                  <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/80 p-2.5 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-cyan-400" />
                      Key Telemetry Signals:
                    </span>
                    <ul className="space-y-1 text-[11px] text-slate-300">
                      {msg.keyInsights.map((insight, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-cyan-400">•</span>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Interactive Action Chips */}
                {isAi && msg.actionChips && msg.actionChips.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1.5">
                    <span className="text-[10px] text-slate-400 block font-semibold">
                      Suggested Actions:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.actionChips.map((chip) => (
                        <button
                          key={chip.id}
                          onClick={() => handleChipClick(chip)}
                          className="flex items-center gap-1 rounded-lg border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 text-[11px] font-semibold px-2.5 py-1 transition-all active:scale-95"
                        >
                          <span>{chip.label}</span>
                          <ChevronRight className="h-3 w-3" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 p-2 bg-slate-900/50 rounded-xl w-32 border border-slate-800">
            <Bot className="h-3.5 w-3.5 text-cyan-400 animate-spin" />
            <span className="text-[11px] animate-pulse">Analyzing logs...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Question Chips above input */}
      <div className="border-t border-slate-800/80 bg-slate-950/90 p-2.5 space-y-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px]">
          <button
            onClick={() => handleSend("Which department has the highest burnout risk this month?")}
            className="whitespace-nowrap rounded-md border border-slate-800 bg-slate-900 px-2 py-1 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            🔥 Highest Burnout Risk
          </button>
          <button
            onClick={() => handleSend("Why did Engineering productivity drop despite 52h?")}
            className="whitespace-nowrap rounded-md border border-slate-800 bg-slate-900 px-2 py-1 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            📉 Engineering Productivity Drop
          </button>
          <button
            onClick={() => handleSend("Recommend workload interventions for our team")}
            className="whitespace-nowrap rounded-md border border-slate-800 bg-slate-900 px-2 py-1 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            ⚡ Intervention Recommendations
          </button>
        </div>

        {/* Input box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask about workload, overtime, burnout..."
            className="flex-1 rounded-xl border border-slate-700/80 bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            type="submit"
            size="sm"
            disabled={!inputVal.trim() || isTyping}
            className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white h-9 px-3"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </form>
      </div>
    </aside>
  );
}
