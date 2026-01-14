import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Download, RotateCcw, Plus, X, Bell, Clock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResponseAction {
  id: string;
  trigger: string;
  condition: string;
  severity: "low" | "medium" | "high" | "critical";
  immediateAction: string;
  responsible: string;
  escalationPath: string;
  timeframe: string;
  documentation: string;
}

export function ResponsePlanTool() {
  const { toast } = useToast();
  const [processName, setProcessName] = useState("");
  const [lastReviewDate, setLastReviewDate] = useState("");
  
  const [actions, setActions] = useState<ResponseAction[]>([
    {
      id: "1",
      trigger: "Control Chart Out of Control",
      condition: "Point outside control limits or 7+ consecutive points on one side",
      severity: "high",
      immediateAction: "Stop production, isolate affected units, notify supervisor",
      responsible: "Line Operator",
      escalationPath: "Supervisor → Quality Engineer → Plant Manager",
      timeframe: "Within 15 minutes",
      documentation: "Log in deviation report, photograph evidence"
    },
    {
      id: "2",
      trigger: "Customer Complaint",
      condition: "Any customer-reported quality issue",
      severity: "critical",
      immediateAction: "Acknowledge within 4 hours, begin investigation",
      responsible: "Quality Manager",
      escalationPath: "Quality Manager → Director → VP Operations",
      timeframe: "Initial response within 4 hours",
      documentation: "Open CAPA, notify relevant stakeholders"
    }
  ]);

  const addAction = () => {
    setActions([...actions, {
      id: Date.now().toString(),
      trigger: "",
      condition: "",
      severity: "medium",
      immediateAction: "",
      responsible: "",
      escalationPath: "",
      timeframe: "",
      documentation: ""
    }]);
  };

  const updateAction = (id: string, field: keyof ResponseAction, value: string) => {
    setActions(actions.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const removeAction = (id: string) => {
    setActions(actions.filter(a => a.id !== id));
  };

  const getSeverityColor = (severity: ResponseAction["severity"]) => {
    switch (severity) {
      case "critical": return "bg-red-100 text-red-800 border-red-300";
      case "high": return "bg-orange-100 text-orange-800 border-orange-300";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low": return "bg-green-100 text-green-800 border-green-300";
    }
  };

  const getSeverityBadge = (severity: ResponseAction["severity"]) => {
    switch (severity) {
      case "critical": return <Badge className="bg-red-500">Critical</Badge>;
      case "high": return <Badge className="bg-orange-500">High</Badge>;
      case "medium": return <Badge className="bg-yellow-500">Medium</Badge>;
      case "low": return <Badge className="bg-green-500">Low</Badge>;
    }
  };

  const exportPlan = () => {
    const exportData = `
OUT-OF-CONTROL RESPONSE PLAN
============================

Process: ${processName || "Not specified"}
Last Review: ${lastReviewDate || "Not specified"}

${"=".repeat(60)}

RESPONSE ACTIONS
----------------
${actions.map((action, i) => `
${i + 1}. TRIGGER: ${action.trigger}
   Severity: ${action.severity.toUpperCase()}
   
   Condition:
   ${action.condition}
   
   Immediate Action:
   ${action.immediateAction}
   
   Responsible: ${action.responsible}
   Timeframe: ${action.timeframe}
   
   Escalation Path:
   ${action.escalationPath}
   
   Documentation Required:
   ${action.documentation}
${"─".repeat(40)}`).join('\n')}

${"=".repeat(60)}

QUICK REFERENCE SUMMARY
-----------------------
${actions.map((a, i) => `${i + 1}. [${a.severity.toUpperCase()}] ${a.trigger} → ${a.immediateAction.substring(0, 50)}...`).join('\n')}

Generated: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `response-plan-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setProcessName("");
    setLastReviewDate("");
    setActions([]);
  };

  const loadTemplate = () => {
    setProcessName("Manufacturing Process XYZ");
    setLastReviewDate(new Date().toISOString().split('T')[0]);
    setActions([
      {
        id: "1",
        trigger: "Control Chart Signal",
        condition: "Point outside control limits, 7 consecutive points above/below centerline, or trending pattern",
        severity: "high",
        immediateAction: "1. Stop production\n2. Isolate suspect units\n3. Notify supervisor\n4. Begin investigation",
        responsible: "Line Operator",
        escalationPath: "Operator → Supervisor (15 min) → Quality Engineer (30 min) → Plant Manager (1 hr)",
        timeframe: "Immediate (within 15 minutes)",
        documentation: "Complete deviation log, photograph evidence, record all lot numbers"
      },
      {
        id: "2",
        trigger: "Measurement Out of Spec",
        condition: "Any measurement outside specification limits",
        severity: "critical",
        immediateAction: "1. Stop production immediately\n2. Quarantine all units since last good check\n3. Call Quality Engineer",
        responsible: "Quality Inspector",
        escalationPath: "Inspector → Quality Engineer → Quality Manager → Customer notification if shipped",
        timeframe: "Immediate production stop, full investigation within 24 hours",
        documentation: "NCR form, containment action log, disposition decision"
      },
      {
        id: "3",
        trigger: "Equipment Malfunction",
        condition: "Any abnormal equipment behavior, unusual sounds, or error codes",
        severity: "high",
        immediateAction: "1. Safe shutdown procedure\n2. Tag out equipment\n3. Notify maintenance\n4. Check last production for quality",
        responsible: "Machine Operator",
        escalationPath: "Operator → Maintenance Tech → Maintenance Supervisor → Production Manager",
        timeframe: "Immediate shutdown, maintenance response within 30 minutes",
        documentation: "Equipment log, work order, affected lot numbers"
      },
      {
        id: "4",
        trigger: "Process Capability Drop",
        condition: "Cpk falls below 1.33 or significant degradation from baseline",
        severity: "medium",
        immediateAction: "1. Increase inspection frequency\n2. Review recent process changes\n3. Schedule improvement meeting",
        responsible: "Quality Engineer",
        escalationPath: "Quality Engineer → Process Owner → Improvement Team",
        timeframe: "Investigation within 48 hours, action plan within 1 week",
        documentation: "Capability study, trend analysis, action plan"
      }
    ]);
    toast({
      title: "Template Loaded",
      description: "Sample response plan has been loaded."
    });
  };

  return (
    <Card className="card-professional">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-primary" />
            <CardTitle>Out-of-Control Response Plan</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadTemplate}>
              Load Template
            </Button>
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
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Process Name</Label>
            <Input
              value={processName}
              onChange={(e) => setProcessName(e.target.value)}
              placeholder="Name of the process"
            />
          </div>
          <div>
            <Label>Last Review Date</Label>
            <Input
              type="date"
              value={lastReviewDate}
              onChange={(e) => setLastReviewDate(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Label className="text-lg font-semibold">Response Actions</Label>
          <Button variant="outline" onClick={addAction}>
            <Plus className="h-4 w-4 mr-2" />
            Add Response Action
          </Button>
        </div>

        <div className="space-y-4">
          {actions.map((action, index) => (
            <Card key={action.id} className={`border-2 ${getSeverityColor(action.severity)}`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-muted-foreground">#{index + 1}</span>
                    {getSeverityBadge(action.severity)}
                    <Input
                      value={action.trigger}
                      onChange={(e) => updateAction(action.id, 'trigger', e.target.value)}
                      placeholder="Trigger event"
                      className="font-semibold text-lg border-none bg-transparent p-0 h-auto"
                    />
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeAction(action.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Condition / When to Trigger</Label>
                    <Textarea
                      value={action.condition}
                      onChange={(e) => updateAction(action.id, 'condition', e.target.value)}
                      placeholder="Specific conditions that trigger this response"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label>Severity Level</Label>
                    <Select
                      value={action.severity}
                      onValueChange={(v) => updateAction(action.id, 'severity', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Monitor</SelectItem>
                        <SelectItem value="medium">Medium - Investigate</SelectItem>
                        <SelectItem value="high">High - Stop & Investigate</SelectItem>
                        <SelectItem value="critical">Critical - Stop & Escalate Immediately</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Immediate Action Steps
                  </Label>
                  <Textarea
                    value={action.immediateAction}
                    onChange={(e) => updateAction(action.id, 'immediateAction', e.target.value)}
                    placeholder="Step-by-step immediate actions to take"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Responsible
                    </Label>
                    <Input
                      value={action.responsible}
                      onChange={(e) => updateAction(action.id, 'responsible', e.target.value)}
                      placeholder="Primary responsible person/role"
                    />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Timeframe
                    </Label>
                    <Input
                      value={action.timeframe}
                      onChange={(e) => updateAction(action.id, 'timeframe', e.target.value)}
                      placeholder="Response time requirement"
                    />
                  </div>
                  <div>
                    <Label>Escalation Path</Label>
                    <Input
                      value={action.escalationPath}
                      onChange={(e) => updateAction(action.id, 'escalationPath', e.target.value)}
                      placeholder="Who to escalate to if needed"
                    />
                  </div>
                </div>

                <div>
                  <Label>Documentation Required</Label>
                  <Textarea
                    value={action.documentation}
                    onChange={(e) => updateAction(action.id, 'documentation', e.target.value)}
                    placeholder="What records/forms need to be completed"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {actions.length > 0 && (
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">Quick Reference Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {actions.map((action, index) => (
                  <div key={action.id} className="flex items-center gap-3 p-2 rounded border border-border">
                    <span className="font-mono text-sm text-muted-foreground">#{index + 1}</span>
                    {getSeverityBadge(action.severity)}
                    <span className="font-medium">{action.trigger || "Untitled"}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-sm truncate flex-1">
                      {action.immediateAction.split('\n')[0] || "No action defined"}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
