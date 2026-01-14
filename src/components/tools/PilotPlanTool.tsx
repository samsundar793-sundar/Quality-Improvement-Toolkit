import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Compass, Download, RotateCcw, Plus, X, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PilotTask {
  id: string;
  task: string;
  responsible: string;
  startDate: string;
  endDate: string;
  status: "not-started" | "in-progress" | "completed" | "blocked";
  notes: string;
}

interface SuccessCriteria {
  id: string;
  metric: string;
  target: string;
  measurement: string;
  result?: string;
  status?: "pending" | "met" | "not-met";
}

interface Risk {
  id: string;
  risk: string;
  impact: "low" | "medium" | "high";
  mitigation: string;
}

export function PilotPlanTool() {
  const { toast } = useToast();
  const [pilotInfo, setPilotInfo] = useState({
    title: "",
    objective: "",
    scope: "",
    duration: "",
    location: "",
    teamLead: ""
  });
  
  const [tasks, setTasks] = useState<PilotTask[]>([
    {
      id: "1",
      task: "Prepare pilot environment",
      responsible: "Operations Lead",
      startDate: "",
      endDate: "",
      status: "not-started",
      notes: ""
    }
  ]);

  const [criteria, setCriteria] = useState<SuccessCriteria[]>([
    {
      id: "1",
      metric: "Defect Rate",
      target: "< 2%",
      measurement: "Daily inspection count",
      status: "pending"
    }
  ]);

  const [risks, setRisks] = useState<Risk[]>([
    {
      id: "1",
      risk: "Equipment availability",
      impact: "medium",
      mitigation: "Reserve backup equipment"
    }
  ]);

  const addTask = () => {
    setTasks([...tasks, {
      id: Date.now().toString(),
      task: "",
      responsible: "",
      startDate: "",
      endDate: "",
      status: "not-started",
      notes: ""
    }]);
  };

  const updateTask = (id: string, field: keyof PilotTask, value: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const addCriteria = () => {
    setCriteria([...criteria, {
      id: Date.now().toString(),
      metric: "",
      target: "",
      measurement: "",
      status: "pending"
    }]);
  };

  const updateCriteria = (id: string, field: keyof SuccessCriteria, value: string) => {
    setCriteria(criteria.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const removeCriteria = (id: string) => {
    setCriteria(criteria.filter(c => c.id !== id));
  };

  const addRisk = () => {
    setRisks([...risks, {
      id: Date.now().toString(),
      risk: "",
      impact: "medium",
      mitigation: ""
    }]);
  };

  const updateRisk = (id: string, field: keyof Risk, value: string) => {
    setRisks(risks.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const removeRisk = (id: string) => {
    setRisks(risks.filter(r => r.id !== id));
  };

  const getStatusIcon = (status: PilotTask["status"]) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress": return <Clock className="h-4 w-4 text-blue-500" />;
      case "blocked": return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getImpactColor = (impact: Risk["impact"]) => {
    switch (impact) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
    }
  };

  const exportPlan = () => {
    const exportData = `
PILOT PLAN
==========

PILOT INFORMATION
-----------------
Title: ${pilotInfo.title || "Not specified"}
Objective: ${pilotInfo.objective || "Not specified"}
Scope: ${pilotInfo.scope || "Not specified"}
Duration: ${pilotInfo.duration || "Not specified"}
Location: ${pilotInfo.location || "Not specified"}
Team Lead: ${pilotInfo.teamLead || "Not specified"}

${"=".repeat(60)}

PILOT TASKS
-----------
${tasks.map((t, i) => `
${i + 1}. ${t.task}
   Responsible: ${t.responsible}
   Timeline: ${t.startDate} to ${t.endDate}
   Status: ${t.status}
   Notes: ${t.notes}`).join('\n')}

${"=".repeat(60)}

SUCCESS CRITERIA
----------------
${criteria.map((c, i) => `
${i + 1}. ${c.metric}
   Target: ${c.target}
   Measurement: ${c.measurement}
   Result: ${c.result || "Pending"}
   Status: ${c.status || "Pending"}`).join('\n')}

${"=".repeat(60)}

RISKS & MITIGATIONS
-------------------
${risks.map((r, i) => `
${i + 1}. ${r.risk}
   Impact: ${r.impact}
   Mitigation: ${r.mitigation}`).join('\n')}

Generated: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pilot-plan-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setPilotInfo({ title: "", objective: "", scope: "", duration: "", location: "", teamLead: "" });
    setTasks([]);
    setCriteria([]);
    setRisks([]);
  };

  return (
    <Card className="card-professional">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Compass className="h-6 w-6 text-primary" />
            <CardTitle>Pilot Plan</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="analytics" onClick={exportPlan}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="criteria">Success Criteria</TabsTrigger>
            <TabsTrigger value="risks">Risks</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Pilot Title</Label>
                <Input
                  value={pilotInfo.title}
                  onChange={(e) => setPilotInfo({ ...pilotInfo, title: e.target.value })}
                  placeholder="Name of the pilot"
                />
              </div>
              <div>
                <Label>Team Lead</Label>
                <Input
                  value={pilotInfo.teamLead}
                  onChange={(e) => setPilotInfo({ ...pilotInfo, teamLead: e.target.value })}
                  placeholder="Person responsible"
                />
              </div>
            </div>
            <div>
              <Label>Objective</Label>
              <Textarea
                value={pilotInfo.objective}
                onChange={(e) => setPilotInfo({ ...pilotInfo, objective: e.target.value })}
                placeholder="What are you trying to validate or test?"
                rows={3}
              />
            </div>
            <div>
              <Label>Scope</Label>
              <Textarea
                value={pilotInfo.scope}
                onChange={(e) => setPilotInfo({ ...pilotInfo, scope: e.target.value })}
                placeholder="What's included and excluded from the pilot?"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Duration</Label>
                <Input
                  value={pilotInfo.duration}
                  onChange={(e) => setPilotInfo({ ...pilotInfo, duration: e.target.value })}
                  placeholder="e.g., 2 weeks, 30 days"
                />
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  value={pilotInfo.location}
                  onChange={(e) => setPilotInfo({ ...pilotInfo, location: e.target.value })}
                  placeholder="Where will the pilot run?"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-lg font-semibold">Pilot Tasks</Label>
              <Button variant="outline" onClick={addTask}>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>

            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="p-4 border border-border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(task.status)}
                      <Input
                        value={task.task}
                        onChange={(e) => updateTask(task.id, 'task', e.target.value)}
                        placeholder="Task description"
                        className="flex-1"
                      />
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeTask(task.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <Label className="text-xs">Responsible</Label>
                      <Input
                        value={task.responsible}
                        onChange={(e) => updateTask(task.id, 'responsible', e.target.value)}
                        placeholder="Who"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Start Date</Label>
                      <Input
                        type="date"
                        value={task.startDate}
                        onChange={(e) => updateTask(task.id, 'startDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">End Date</Label>
                      <Input
                        type="date"
                        value={task.endDate}
                        onChange={(e) => updateTask(task.id, 'endDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Status</Label>
                      <Select
                        value={task.status}
                        onValueChange={(v) => updateTask(task.id, 'status', v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not-started">Not Started</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="blocked">Blocked</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="criteria" className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-lg font-semibold">Success Criteria</Label>
              <Button variant="outline" onClick={addCriteria}>
                <Plus className="h-4 w-4 mr-2" />
                Add Criterion
              </Button>
            </div>

            <div className="space-y-3">
              {criteria.map((c) => (
                <div key={c.id} className="p-4 border border-border rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <Label className="text-xs">Metric</Label>
                      <Input
                        value={c.metric}
                        onChange={(e) => updateCriteria(c.id, 'metric', e.target.value)}
                        placeholder="What to measure"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Target</Label>
                      <Input
                        value={c.target}
                        onChange={(e) => updateCriteria(c.id, 'target', e.target.value)}
                        placeholder="Success threshold"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">How to Measure</Label>
                      <Input
                        value={c.measurement}
                        onChange={(e) => updateCriteria(c.id, 'measurement', e.target.value)}
                        placeholder="Measurement method"
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Label className="text-xs">Status</Label>
                        <Select
                          value={c.status || "pending"}
                          onValueChange={(v) => updateCriteria(c.id, 'status', v)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="met">Met</SelectItem>
                            <SelectItem value="not-met">Not Met</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeCriteria(c.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="risks" className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-lg font-semibold">Risks & Mitigations</Label>
              <Button variant="outline" onClick={addRisk}>
                <Plus className="h-4 w-4 mr-2" />
                Add Risk
              </Button>
            </div>

            <div className="space-y-3">
              {risks.map((risk) => (
                <div key={risk.id} className="p-4 border border-border rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="md:col-span-2">
                      <Label className="text-xs">Risk</Label>
                      <Input
                        value={risk.risk}
                        onChange={(e) => updateRisk(risk.id, 'risk', e.target.value)}
                        placeholder="Describe the risk"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Impact</Label>
                      <Select
                        value={risk.impact}
                        onValueChange={(v) => updateRisk(risk.id, 'impact', v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Badge className={getImpactColor(risk.impact)}>{risk.impact}</Badge>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Label className="text-xs">Mitigation Strategy</Label>
                    <Textarea
                      value={risk.mitigation}
                      onChange={(e) => updateRisk(risk.id, 'mitigation', e.target.value)}
                      placeholder="How will you address this risk?"
                      rows={2}
                    />
                  </div>
                  <div className="flex justify-end mt-2">
                    <Button variant="ghost" size="sm" onClick={() => removeRisk(risk.id)}>
                      <X className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
