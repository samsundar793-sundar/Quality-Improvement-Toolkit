import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, RotateCcw, Plus, X, GripVertical, Clock, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WorkStep {
  id: string;
  stepNumber: number;
  action: string;
  keyPoints: string;
  safetyNotes: string;
  qualityChecks: string;
  cycleTime: number; // seconds
  tools: string;
}

interface StandardWorkDoc {
  processName: string;
  workArea: string;
  preparedBy: string;
  approvedBy: string;
  effectiveDate: string;
  revision: string;
  taktTime: number;
  cycleTIme: number;
  steps: WorkStep[];
}

export function StandardWorkTool() {
  const { toast } = useToast();
  const [doc, setDoc] = useState<StandardWorkDoc>({
    processName: "",
    workArea: "",
    preparedBy: "",
    approvedBy: "",
    effectiveDate: "",
    revision: "1.0",
    taktTime: 60,
    cycleTIme: 0,
    steps: [
      {
        id: "1",
        stepNumber: 1,
        action: "Prepare materials and tools",
        keyPoints: "Verify all items present before starting",
        safetyNotes: "Wear appropriate PPE",
        qualityChecks: "Visual inspection of materials",
        cycleTime: 30,
        tools: "Checklist, PPE"
      }
    ]
  });

  const updateDoc = (field: keyof StandardWorkDoc, value: any) => {
    setDoc({ ...doc, [field]: value });
  };

  const addStep = () => {
    const newStep: WorkStep = {
      id: Date.now().toString(),
      stepNumber: doc.steps.length + 1,
      action: "",
      keyPoints: "",
      safetyNotes: "",
      qualityChecks: "",
      cycleTime: 0,
      tools: ""
    };
    setDoc({ ...doc, steps: [...doc.steps, newStep] });
  };

  const updateStep = (id: string, field: keyof WorkStep, value: any) => {
    setDoc({
      ...doc,
      steps: doc.steps.map(step =>
        step.id === id ? { ...step, [field]: value } : step
      )
    });
  };

  const removeStep = (id: string) => {
    const newSteps = doc.steps
      .filter(step => step.id !== id)
      .map((step, index) => ({ ...step, stepNumber: index + 1 }));
    setDoc({ ...doc, steps: newSteps });
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const newSteps = [...doc.steps];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newSteps.length) return;
    
    [newSteps[index], newSteps[newIndex]] = [newSteps[newIndex], newSteps[index]];
    newSteps.forEach((step, i) => step.stepNumber = i + 1);
    setDoc({ ...doc, steps: newSteps });
  };

  const totalCycleTime = doc.steps.reduce((sum, step) => sum + step.cycleTime, 0);
  const efficiencyRatio = doc.taktTime > 0 ? ((totalCycleTime / doc.taktTime) * 100).toFixed(1) : 0;

  const exportDocument = () => {
    const exportData = `
STANDARD WORK DOCUMENT
======================

HEADER INFORMATION
------------------
Process Name: ${doc.processName || "Not specified"}
Work Area: ${doc.workArea || "Not specified"}
Prepared By: ${doc.preparedBy || "Not specified"}
Approved By: ${doc.approvedBy || "Not specified"}
Effective Date: ${doc.effectiveDate || "Not specified"}
Revision: ${doc.revision}

TIME ANALYSIS
-------------
Takt Time: ${doc.taktTime} seconds
Total Cycle Time: ${totalCycleTime} seconds
Efficiency: ${efficiencyRatio}%

${"=".repeat(60)}

WORK SEQUENCE
-------------
${doc.steps.map(step => `
STEP ${step.stepNumber}: ${step.action}
${"─".repeat(40)}
Key Points: ${step.keyPoints || "None specified"}
Safety Notes: ${step.safetyNotes || "None specified"}
Quality Checks: ${step.qualityChecks || "None specified"}
Tools Required: ${step.tools || "None specified"}
Cycle Time: ${step.cycleTime} seconds
`).join('\n')}

${"=".repeat(60)}

SUMMARY
-------
Total Steps: ${doc.steps.length}
Total Cycle Time: ${totalCycleTime} seconds (${(totalCycleTime / 60).toFixed(1)} minutes)
Steps with Safety Notes: ${doc.steps.filter(s => s.safetyNotes).length}
Steps with Quality Checks: ${doc.steps.filter(s => s.qualityChecks).length}

Generated: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `standard-work-${doc.processName || 'document'}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setDoc({
      processName: "",
      workArea: "",
      preparedBy: "",
      approvedBy: "",
      effectiveDate: "",
      revision: "1.0",
      taktTime: 60,
      cycleTIme: 0,
      steps: []
    });
  };

  const loadTemplate = () => {
    setDoc({
      processName: "Assembly Station A",
      workArea: "Final Assembly",
      preparedBy: "",
      approvedBy: "",
      effectiveDate: new Date().toISOString().split('T')[0],
      revision: "1.0",
      taktTime: 120,
      cycleTIme: 0,
      steps: [
        {
          id: "1",
          stepNumber: 1,
          action: "Retrieve components from staging area",
          keyPoints: "Verify part numbers match work order",
          safetyNotes: "Use proper lifting technique for heavy items",
          qualityChecks: "Visual inspection for damage",
          cycleTime: 15,
          tools: "Part cart, work order"
        },
        {
          id: "2",
          stepNumber: 2,
          action: "Position base assembly in fixture",
          keyPoints: "Ensure alignment pins engage fully",
          safetyNotes: "Keep hands clear of pinch points",
          qualityChecks: "Verify fixture indicator shows green",
          cycleTime: 10,
          tools: "Assembly fixture"
        },
        {
          id: "3",
          stepNumber: 3,
          action: "Install sub-assembly components",
          keyPoints: "Follow torque sequence pattern",
          safetyNotes: "Wear safety glasses",
          qualityChecks: "Torque wrench click verification",
          cycleTime: 45,
          tools: "Torque wrench, component tray"
        },
        {
          id: "4",
          stepNumber: 4,
          action: "Perform functional test",
          keyPoints: "Complete all test steps in sequence",
          safetyNotes: "Stand clear during automated test",
          qualityChecks: "All test results must show PASS",
          cycleTime: 30,
          tools: "Test equipment, test log"
        },
        {
          id: "5",
          stepNumber: 5,
          action: "Apply label and move to next station",
          keyPoints: "Scan barcode to complete station tracking",
          safetyNotes: "",
          qualityChecks: "Verify label is properly adhered",
          cycleTime: 10,
          tools: "Label printer, scanner"
        }
      ]
    });
    toast({
      title: "Template Loaded",
      description: "Sample standard work document has been loaded."
    });
  };

  return (
    <Card className="card-professional">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            <CardTitle>Standard Work Document</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadTemplate}>
              Load Template
            </Button>
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="analytics" onClick={exportDocument}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="header" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="header">Header Info</TabsTrigger>
            <TabsTrigger value="steps">Work Sequence</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="header" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Process Name</Label>
                <Input
                  value={doc.processName}
                  onChange={(e) => updateDoc('processName', e.target.value)}
                  placeholder="Name of the process"
                />
              </div>
              <div>
                <Label>Work Area</Label>
                <Input
                  value={doc.workArea}
                  onChange={(e) => updateDoc('workArea', e.target.value)}
                  placeholder="Location or area"
                />
              </div>
              <div>
                <Label>Prepared By</Label>
                <Input
                  value={doc.preparedBy}
                  onChange={(e) => updateDoc('preparedBy', e.target.value)}
                  placeholder="Author name"
                />
              </div>
              <div>
                <Label>Approved By</Label>
                <Input
                  value={doc.approvedBy}
                  onChange={(e) => updateDoc('approvedBy', e.target.value)}
                  placeholder="Approver name"
                />
              </div>
              <div>
                <Label>Effective Date</Label>
                <Input
                  type="date"
                  value={doc.effectiveDate}
                  onChange={(e) => updateDoc('effectiveDate', e.target.value)}
                />
              </div>
              <div>
                <Label>Revision</Label>
                <Input
                  value={doc.revision}
                  onChange={(e) => updateDoc('revision', e.target.value)}
                  placeholder="Version number"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
              <div>
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Takt Time (seconds)
                </Label>
                <Input
                  type="number"
                  value={doc.taktTime}
                  onChange={(e) => updateDoc('taktTime', parseInt(e.target.value) || 0)}
                  placeholder="Customer demand rate"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Time available / Customer demand
                </p>
              </div>
              <div>
                <Label>Calculated Cycle Time</Label>
                <div className="p-3 bg-background rounded border border-border mt-1">
                  <span className="text-2xl font-bold text-primary">{totalCycleTime}</span>
                  <span className="text-muted-foreground ml-2">seconds</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Sum of all step times
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="steps" className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-lg font-semibold">Work Sequence ({doc.steps.length} steps)</Label>
              <Button variant="outline" onClick={addStep}>
                <Plus className="h-4 w-4 mr-2" />
                Add Step
              </Button>
            </div>

            <div className="space-y-4">
              {doc.steps.map((step, index) => (
                <Card key={step.id} className="border-2 border-border">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
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
                            disabled={index === doc.steps.length - 1}
                            className="h-6 px-2"
                          >
                            ▼
                          </Button>
                        </div>
                        <Badge variant="outline" className="text-lg font-bold">
                          Step {step.stepNumber}
                        </Badge>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {step.cycleTime}s
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeStep(step.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label>Action</Label>
                      <Textarea
                        value={step.action}
                        onChange={(e) => updateStep(step.id, 'action', e.target.value)}
                        placeholder="What to do in this step"
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label>Key Points</Label>
                        <Textarea
                          value={step.keyPoints}
                          onChange={(e) => updateStep(step.id, 'keyPoints', e.target.value)}
                          placeholder="Important details to remember"
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          Safety Notes
                        </Label>
                        <Textarea
                          value={step.safetyNotes}
                          onChange={(e) => updateStep(step.id, 'safetyNotes', e.target.value)}
                          placeholder="Safety precautions"
                          rows={2}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label>Quality Checks</Label>
                        <Input
                          value={step.qualityChecks}
                          onChange={(e) => updateStep(step.id, 'qualityChecks', e.target.value)}
                          placeholder="Verification points"
                        />
                      </div>
                      <div>
                        <Label>Tools Required</Label>
                        <Input
                          value={step.tools}
                          onChange={(e) => updateStep(step.id, 'tools', e.target.value)}
                          placeholder="Equipment needed"
                        />
                      </div>
                      <div>
                        <Label>Cycle Time (seconds)</Label>
                        <Input
                          type="number"
                          value={step.cycleTime}
                          onChange={(e) => updateStep(step.id, 'cycleTime', parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-primary">{doc.steps.length}</div>
                  <div className="text-sm text-muted-foreground">Total Steps</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-primary">{totalCycleTime}s</div>
                  <div className="text-sm text-muted-foreground">Total Cycle Time</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-primary">{doc.taktTime}s</div>
                  <div className="text-sm text-muted-foreground">Takt Time</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className={`text-3xl font-bold ${Number(efficiencyRatio) > 100 ? 'text-red-500' : 'text-green-500'}`}>
                    {efficiencyRatio}%
                  </div>
                  <div className="text-sm text-muted-foreground">Load Ratio</div>
                </CardContent>
              </Card>
            </div>

            {Number(efficiencyRatio) > 100 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                <div className="font-semibold">⚠️ Cycle Time Exceeds Takt Time</div>
                <p className="text-sm">
                  Current cycle time ({totalCycleTime}s) exceeds takt time ({doc.taktTime}s). 
                  Consider process improvements or additional resources.
                </p>
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Step Time Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {doc.steps.map(step => (
                    <div key={step.id} className="flex items-center gap-3">
                      <span className="w-16 text-sm font-medium">Step {step.stepNumber}</span>
                      <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full"
                          style={{ width: `${(step.cycleTime / Math.max(totalCycleTime, 1)) * 100}%` }}
                        />
                      </div>
                      <span className="w-12 text-sm text-right">{step.cycleTime}s</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
