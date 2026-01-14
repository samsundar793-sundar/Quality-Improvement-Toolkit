import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { GitBranch, Download, RotateCcw, Plus, X, ArrowDown, Circle, Square, Diamond, Hexagon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type StepType = "start-end" | "process" | "decision" | "inspection" | "storage" | "transport";

interface ProcessStep {
  id: string;
  stepNumber: number;
  type: StepType;
  description: string;
  responsible: string;
  inputs: string;
  outputs: string;
  notes: string;
  valueAdded: boolean;
}

export function ProcessFlowTool() {
  const { toast } = useToast();
  const [processName, setProcessName] = useState("");
  const [steps, setSteps] = useState<ProcessStep[]>([
    {
      id: "1",
      stepNumber: 1,
      type: "start-end",
      description: "Start",
      responsible: "",
      inputs: "",
      outputs: "",
      notes: "",
      valueAdded: false
    },
    {
      id: "2",
      stepNumber: 2,
      type: "process",
      description: "Receive order",
      responsible: "Sales",
      inputs: "Customer order",
      outputs: "Order entry",
      notes: "",
      valueAdded: true
    }
  ]);

  const stepTypeConfig: Record<StepType, { label: string; color: string; icon: any }> = {
    "start-end": { label: "Start/End", color: "bg-gray-500", icon: Circle },
    "process": { label: "Process", color: "bg-blue-500", icon: Square },
    "decision": { label: "Decision", color: "bg-yellow-500", icon: Diamond },
    "inspection": { label: "Inspection", color: "bg-purple-500", icon: Hexagon },
    "storage": { label: "Storage", color: "bg-orange-500", icon: Square },
    "transport": { label: "Transport", color: "bg-green-500", icon: ArrowDown }
  };

  const addStep = () => {
    const newStep: ProcessStep = {
      id: Date.now().toString(),
      stepNumber: steps.length + 1,
      type: "process",
      description: "",
      responsible: "",
      inputs: "",
      outputs: "",
      notes: "",
      valueAdded: true
    };
    setSteps([...steps, newStep]);
  };

  const updateStep = (id: string, field: keyof ProcessStep, value: any) => {
    setSteps(steps.map(step =>
      step.id === id ? { ...step, [field]: value } : step
    ));
  };

  const removeStep = (id: string) => {
    const newSteps = steps
      .filter(step => step.id !== id)
      .map((step, index) => ({ ...step, stepNumber: index + 1 }));
    setSteps(newSteps);
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const newSteps = [...steps];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newSteps.length) return;
    
    [newSteps[index], newSteps[newIndex]] = [newSteps[newIndex], newSteps[index]];
    newSteps.forEach((step, i) => step.stepNumber = i + 1);
    setSteps(newSteps);
  };

  const valueAddedSteps = steps.filter(s => s.valueAdded && s.type === "process").length;
  const nonValueAddedSteps = steps.filter(s => !s.valueAdded && s.type === "process").length;
  const decisionPoints = steps.filter(s => s.type === "decision").length;
  const inspectionPoints = steps.filter(s => s.type === "inspection").length;

  const exportDiagram = () => {
    const exportData = `
PROCESS FLOW DIAGRAM
====================

Process: ${processName || "Not specified"}

SUMMARY
-------
Total Steps: ${steps.length}
Value-Added Steps: ${valueAddedSteps}
Non-Value-Added Steps: ${nonValueAddedSteps}
Decision Points: ${decisionPoints}
Inspection Points: ${inspectionPoints}

${"=".repeat(60)}

PROCESS FLOW
------------
${steps.map(step => {
  const config = stepTypeConfig[step.type];
  return `
[${step.stepNumber}] ${config.label.toUpperCase()}
    ${step.description}
    ├─ Responsible: ${step.responsible || "Not specified"}
    ├─ Inputs: ${step.inputs || "None specified"}
    ├─ Outputs: ${step.outputs || "None specified"}
    ├─ Value Added: ${step.valueAdded ? "Yes" : "No"}
    └─ Notes: ${step.notes || "None"}
         ↓`;
}).join('\n')}

${"=".repeat(60)}

STEP TYPE LEGEND
----------------
○ Start/End - Begin or end of process
□ Process - Value-adding or transformation step
◇ Decision - Decision point or branch
⬡ Inspection - Quality check or verification
□ Storage - Inventory or waiting
→ Transport - Movement or transfer

Generated: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `process-flow-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setProcessName("");
    setSteps([
      {
        id: "1",
        stepNumber: 1,
        type: "start-end",
        description: "Start",
        responsible: "",
        inputs: "",
        outputs: "",
        notes: "",
        valueAdded: false
      }
    ]);
  };

  const loadTemplate = () => {
    setProcessName("Order Fulfillment Process");
    setSteps([
      { id: "1", stepNumber: 1, type: "start-end", description: "Customer places order", responsible: "Customer", inputs: "Product selection", outputs: "Order request", notes: "", valueAdded: false },
      { id: "2", stepNumber: 2, type: "process", description: "Receive and log order", responsible: "Sales", inputs: "Order request", outputs: "Order in system", notes: "", valueAdded: true },
      { id: "3", stepNumber: 3, type: "decision", description: "In stock?", responsible: "Warehouse", inputs: "Inventory check", outputs: "Stock status", notes: "", valueAdded: false },
      { id: "4", stepNumber: 4, type: "process", description: "Pick items from warehouse", responsible: "Warehouse", inputs: "Pick list", outputs: "Picked items", notes: "", valueAdded: true },
      { id: "5", stepNumber: 5, type: "inspection", description: "Quality check", responsible: "QC", inputs: "Picked items", outputs: "Verified items", notes: "", valueAdded: false },
      { id: "6", stepNumber: 6, type: "process", description: "Pack order", responsible: "Shipping", inputs: "Verified items", outputs: "Packed order", notes: "", valueAdded: true },
      { id: "7", stepNumber: 7, type: "transport", description: "Ship to customer", responsible: "Shipping", inputs: "Packed order", outputs: "Shipped package", notes: "", valueAdded: true },
      { id: "8", stepNumber: 8, type: "start-end", description: "Customer receives order", responsible: "Customer", inputs: "Delivered package", outputs: "Satisfied customer", notes: "", valueAdded: false }
    ]);
    toast({
      title: "Template Loaded",
      description: "Sample process flow has been loaded."
    });
  };

  return (
    <Card className="card-professional">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GitBranch className="h-6 w-6 text-primary" />
            <CardTitle>Process Flow Diagram</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadTemplate}>
              Load Template
            </Button>
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="analytics" onClick={exportDiagram}>
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
          <div className="grid grid-cols-4 gap-2">
            <Card className="p-2 text-center">
              <div className="text-xl font-bold text-primary">{steps.length}</div>
              <div className="text-xs text-muted-foreground">Steps</div>
            </Card>
            <Card className="p-2 text-center">
              <div className="text-xl font-bold text-green-500">{valueAddedSteps}</div>
              <div className="text-xs text-muted-foreground">Value Add</div>
            </Card>
            <Card className="p-2 text-center">
              <div className="text-xl font-bold text-yellow-500">{decisionPoints}</div>
              <div className="text-xs text-muted-foreground">Decisions</div>
            </Card>
            <Card className="p-2 text-center">
              <div className="text-xl font-bold text-purple-500">{inspectionPoints}</div>
              <div className="text-xs text-muted-foreground">Inspections</div>
            </Card>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Label className="text-lg font-semibold">Process Steps</Label>
          <Button variant="outline" onClick={addStep}>
            <Plus className="h-4 w-4 mr-2" />
            Add Step
          </Button>
        </div>

        <div className="space-y-2">
          {steps.map((step, index) => {
            const config = stepTypeConfig[step.type];
            const IconComponent = config.icon;
            
            return (
              <div key={step.id}>
                <div className="flex items-stretch gap-3 p-4 border border-border rounded-lg bg-card">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveStep(index, 'up')}
                        disabled={index === 0}
                        className="h-6 px-2"
                      >
                        ▲
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveStep(index, 'down')}
                        disabled={index === steps.length - 1}
                        className="h-6 px-2"
                      >
                        ▼
                      </Button>
                    </div>
                    <div className={`w-10 h-10 rounded-lg ${config.color} flex items-center justify-center text-white`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-mono">{step.stepNumber}</span>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div>
                        <Label className="text-xs">Step Type</Label>
                        <Select
                          value={step.type}
                          onValueChange={(v) => updateStep(step.id, 'type', v)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(stepTypeConfig).map(([key, { label }]) => (
                              <SelectItem key={key} value={key}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-xs">Description</Label>
                        <Input
                          value={step.description}
                          onChange={(e) => updateStep(step.id, 'description', e.target.value)}
                          placeholder="What happens in this step"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Responsible</Label>
                        <Input
                          value={step.responsible}
                          onChange={(e) => updateStep(step.id, 'responsible', e.target.value)}
                          placeholder="Who performs this"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs">Inputs</Label>
                        <Input
                          value={step.inputs}
                          onChange={(e) => updateStep(step.id, 'inputs', e.target.value)}
                          placeholder="What goes in"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Outputs</Label>
                        <Input
                          value={step.outputs}
                          onChange={(e) => updateStep(step.id, 'outputs', e.target.value)}
                          placeholder="What comes out"
                        />
                      </div>
                      <div className="flex items-end gap-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={step.valueAdded}
                            onChange={(e) => updateStep(step.id, 'valueAdded', e.target.checked)}
                            className="h-4 w-4"
                          />
                          <Label className="text-xs">Value Added</Label>
                        </div>
                        {step.valueAdded && (
                          <Badge className="bg-green-500">VA</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="sm" onClick={() => removeStep(step.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {index < steps.length - 1 && (
                  <div className="flex justify-center py-1">
                    <ArrowDown className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <Card className="bg-muted/30">
          <CardContent className="pt-4">
            <h4 className="font-semibold mb-3">Step Type Legend</h4>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
              {Object.entries(stepTypeConfig).map(([key, { label, color, icon: Icon }]) => (
                <div key={key} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded ${color} flex items-center justify-center text-white`}>
                    <Icon className="h-3 w-3" />
                  </div>
                  <span className="text-xs">{label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
