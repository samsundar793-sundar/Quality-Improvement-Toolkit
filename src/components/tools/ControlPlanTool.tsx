import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Shield, Plus, Trash2, RotateCcw, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ControlPoint {
  id: string;
  processStep: string;
  characteristic: string;
  specification: string;
  measurementMethod: string;
  frequency: string;
  responsible: string;
  reactionPlan: string;
  controlType: "prevention" | "detection";
}

export function ControlPlanTool() {
  const { toast } = useToast();
  const [projectInfo, setProjectInfo] = useState({
    projectName: "",
    processName: "",
    owner: "",
    date: new Date().toISOString().split('T')[0]
  });
  const [controlPoints, setControlPoints] = useState<ControlPoint[]>([]);
  const [newControlPoint, setNewControlPoint] = useState<Partial<ControlPoint>>({
    controlType: "prevention"
  });

  const addControlPoint = () => {
    if (!newControlPoint.processStep || !newControlPoint.characteristic) {
      toast({ title: "Error", description: "Please fill in required fields.", variant: "destructive" });
      return;
    }

    const controlPoint: ControlPoint = {
      id: Date.now().toString(),
      processStep: newControlPoint.processStep || "",
      characteristic: newControlPoint.characteristic || "",
      specification: newControlPoint.specification || "",
      measurementMethod: newControlPoint.measurementMethod || "",
      frequency: newControlPoint.frequency || "",
      responsible: newControlPoint.responsible || "",
      reactionPlan: newControlPoint.reactionPlan || "",
      controlType: newControlPoint.controlType || "prevention"
    };

    setControlPoints([...controlPoints, controlPoint]);
    setNewControlPoint({ controlType: "prevention" });
    toast({ title: "Control Point Added", description: "New control point has been added to the plan." });
  };

  const removeControlPoint = (id: string) => {
    setControlPoints(controlPoints.filter(cp => cp.id !== id));
  };

  const updateControlPoint = (id: string, field: keyof ControlPoint, value: string) => {
    setControlPoints(controlPoints.map(cp => 
      cp.id === id ? { ...cp, [field]: value } : cp
    ));
  };

  const generateSampleControlPlan = () => {
    const samplePoints: ControlPoint[] = [
      {
        id: "1",
        processStep: "Material Receipt",
        characteristic: "Raw Material Quality",
        specification: "Vendor certification required",
        measurementMethod: "Visual inspection + Certificate review",
        frequency: "Every batch",
        responsible: "Quality Inspector",
        reactionPlan: "Reject non-conforming material, contact supplier",
        controlType: "prevention"
      },
      {
        id: "2",
        processStep: "Assembly",
        characteristic: "Torque Specification",
        specification: "25 ± 2 Nm",
        measurementMethod: "Torque wrench measurement",
        frequency: "Every 50 units",
        responsible: "Production Operator",
        reactionPlan: "Stop production, adjust torque, re-measure",
        controlType: "detection"
      },
      {
        id: "3",
        processStep: "Final Inspection",
        characteristic: "Dimensional Tolerance",
        specification: "±0.1mm",
        measurementMethod: "Caliper measurement",
        frequency: "100% inspection",
        responsible: "QA Technician",
        reactionPlan: "Rework or scrap non-conforming units",
        controlType: "detection"
      }
    ];

    setControlPoints(samplePoints);
    setProjectInfo({
      projectName: "Sample Quality Control Plan",
      processName: "Manufacturing Process",
      owner: "Quality Manager",
      date: new Date().toISOString().split('T')[0]
    });
    toast({ title: "Sample Data Loaded", description: "Sample control plan has been generated." });
  };

  const exportControlPlan = () => {
    // Create a simple text export (in a real app, this would generate PDF/Excel)
    const content = `
CONTROL PLAN
============
Project: ${projectInfo.projectName}
Process: ${projectInfo.processName}
Owner: ${projectInfo.owner}
Date: ${projectInfo.date}

CONTROL POINTS:
${controlPoints.map((cp, index) => `
${index + 1}. ${cp.processStep}
   Characteristic: ${cp.characteristic}
   Specification: ${cp.specification}
   Method: ${cp.measurementMethod}
   Frequency: ${cp.frequency}
   Responsible: ${cp.responsible}
   Type: ${cp.controlType}
   Reaction Plan: ${cp.reactionPlan}
`).join('')}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `control-plan-${projectInfo.projectName.replace(/\s+/g, '-').toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ title: "Control Plan Exported", description: "Control plan has been exported successfully." });
  };

  return (
    <Card className="card-professional">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <CardTitle>Control Plan Generator</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={generateSampleControlPlan}>
              Load Sample
            </Button>
            <Button variant="outline" onClick={() => { setControlPoints([]); setProjectInfo({ projectName: "", processName: "", owner: "", date: new Date().toISOString().split('T')[0] }); }}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Project Info</TabsTrigger>
            <TabsTrigger value="controls">Control Points</TabsTrigger>
            <TabsTrigger value="plan">Control Plan</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input 
                  id="projectName"
                  value={projectInfo.projectName}
                  onChange={(e) => setProjectInfo({...projectInfo, projectName: e.target.value})}
                  placeholder="Enter project name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="processName">Process Name</Label>
                <Input 
                  id="processName"
                  value={projectInfo.processName}
                  onChange={(e) => setProjectInfo({...projectInfo, processName: e.target.value})}
                  placeholder="Enter process name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner">Process Owner</Label>
                <Input 
                  id="owner"
                  value={projectInfo.owner}
                  onChange={(e) => setProjectInfo({...projectInfo, owner: e.target.value})}
                  placeholder="Enter process owner"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date"
                  type="date"
                  value={projectInfo.date}
                  onChange={(e) => setProjectInfo({...projectInfo, date: e.target.value})}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="controls" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-semibold">Add Control Point</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Process Step *</Label>
                  <Input 
                    value={newControlPoint.processStep || ""}
                    onChange={(e) => setNewControlPoint({...newControlPoint, processStep: e.target.value})}
                    placeholder="e.g., Material Receipt"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Characteristic *</Label>
                  <Input 
                    value={newControlPoint.characteristic || ""}
                    onChange={(e) => setNewControlPoint({...newControlPoint, characteristic: e.target.value})}
                    placeholder="e.g., Dimensional accuracy"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Specification</Label>
                  <Input 
                    value={newControlPoint.specification || ""}
                    onChange={(e) => setNewControlPoint({...newControlPoint, specification: e.target.value})}
                    placeholder="e.g., ±0.1mm"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Measurement Method</Label>
                  <Input 
                    value={newControlPoint.measurementMethod || ""}
                    onChange={(e) => setNewControlPoint({...newControlPoint, measurementMethod: e.target.value})}
                    placeholder="e.g., Caliper measurement"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Select 
                    value={newControlPoint.frequency || ""} 
                    onValueChange={(value) => setNewControlPoint({...newControlPoint, frequency: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="continuous">Continuous</SelectItem>
                      <SelectItem value="every-unit">Every Unit</SelectItem>
                      <SelectItem value="every-10">Every 10 Units</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="shift">Per Shift</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Responsible Person</Label>
                  <Input 
                    value={newControlPoint.responsible || ""}
                    onChange={(e) => setNewControlPoint({...newControlPoint, responsible: e.target.value})}
                    placeholder="e.g., Quality Inspector"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Control Type</Label>
                <Select 
                  value={newControlPoint.controlType || "prevention"} 
                  onValueChange={(value: "prevention" | "detection") => setNewControlPoint({...newControlPoint, controlType: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prevention">Prevention</SelectItem>
                    <SelectItem value="detection">Detection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Reaction Plan</Label>
                <Textarea 
                  value={newControlPoint.reactionPlan || ""}
                  onChange={(e) => setNewControlPoint({...newControlPoint, reactionPlan: e.target.value})}
                  placeholder="What to do when specification is not met..."
                  rows={3}
                />
              </div>
              
              <Button onClick={addControlPoint}>
                <Plus className="h-4 w-4 mr-2" />
                Add Control Point
              </Button>
            </div>
            
            {controlPoints.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold">Control Points ({controlPoints.length})</h4>
                {controlPoints.map((cp) => (
                  <div key={cp.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h5 className="font-medium">{cp.processStep}</h5>
                        <Badge variant={cp.controlType === "prevention" ? "default" : "outline"}>
                          {cp.controlType}
                        </Badge>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeControlPoint(cp.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div><strong>Characteristic:</strong> {cp.characteristic}</div>
                      <div><strong>Specification:</strong> {cp.specification}</div>
                      <div><strong>Method:</strong> {cp.measurementMethod}</div>
                      <div><strong>Frequency:</strong> {cp.frequency}</div>
                      <div><strong>Responsible:</strong> {cp.responsible}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="plan">
            {controlPoints.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Control Plan Summary</h4>
                  <Button onClick={exportControlPlan}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Plan
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <div className="font-semibold">Project</div>
                    <div className="text-sm text-muted-foreground">{projectInfo.projectName}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Process</div>
                    <div className="text-sm text-muted-foreground">{projectInfo.processName}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Owner</div>
                    <div className="text-sm text-muted-foreground">{projectInfo.owner}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Control Points</div>
                    <div className="text-sm text-muted-foreground">{controlPoints.length} total</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {controlPoints.map((cp, index) => (
                    <div key={cp.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-semibold text-primary">#{index + 1}</span>
                        <h5 className="font-medium">{cp.processStep}</h5>
                        <Badge variant={cp.controlType === "prevention" ? "default" : "outline"}>
                          {cp.controlType}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-medium">Characteristic</div>
                          <div className="text-muted-foreground">{cp.characteristic}</div>
                        </div>
                        <div>
                          <div className="font-medium">Specification</div>
                          <div className="text-muted-foreground">{cp.specification}</div>
                        </div>
                        <div>
                          <div className="font-medium">Method</div>
                          <div className="text-muted-foreground">{cp.measurementMethod}</div>
                        </div>
                        <div>
                          <div className="font-medium">Frequency</div>
                          <div className="text-muted-foreground">{cp.frequency}</div>
                        </div>
                        <div>
                          <div className="font-medium">Responsible</div>
                          <div className="text-muted-foreground">{cp.responsible}</div>
                        </div>
                        <div>
                          <div className="font-medium">Reaction Plan</div>
                          <div className="text-muted-foreground">{cp.reactionPlan}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No control points added yet. Please add control points to generate the plan.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}