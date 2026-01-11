import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GitBranch, Save, Plus, Trash2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProject } from "@/contexts/ProjectContext";

interface ProcessStep {
  id: string;
  name: string;
  cycleTime: number;
  waitTime: number;
  inventory: number;
  operators: number;
  uptime: number;
  valueAdded: boolean;
}

interface ValueStreamData {
  productFamily: string;
  customerDemand: number;
  taktTime: number;
  steps: ProcessStep[];
}

export function ValueStreamMapTool() {
  const { toast } = useToast();
  const { currentProject, updateToolData, getToolData } = useProject();
  
  const [data, setData] = useState<ValueStreamData>(() => {
    const saved = currentProject ? getToolData("value-stream-map") : null;
    return saved || {
      productFamily: "",
      customerDemand: 0,
      taktTime: 0,
      steps: []
    };
  });

  const handleSave = () => {
    if (currentProject) {
      updateToolData("value-stream-map", data);
      toast({ title: "Saved", description: "Value stream map saved successfully" });
    }
  };

  const addStep = () => {
    const newStep: ProcessStep = {
      id: Date.now().toString(),
      name: "",
      cycleTime: 0,
      waitTime: 0,
      inventory: 0,
      operators: 1,
      uptime: 100,
      valueAdded: true
    };
    setData(prev => ({ ...prev, steps: [...prev.steps, newStep] }));
  };

  const updateStep = (id: string, field: keyof ProcessStep, value: any) => {
    setData(prev => ({
      ...prev,
      steps: prev.steps.map(s => s.id === id ? { ...s, [field]: value } : s)
    }));
  };

  const removeStep = (id: string) => {
    setData(prev => ({ ...prev, steps: prev.steps.filter(s => s.id !== id) }));
  };

  // Calculations
  const totalCycleTime = data.steps.reduce((sum, s) => sum + s.cycleTime, 0);
  const totalWaitTime = data.steps.reduce((sum, s) => sum + s.waitTime, 0);
  const totalLeadTime = totalCycleTime + totalWaitTime;
  const valueAddedTime = data.steps.filter(s => s.valueAdded).reduce((sum, s) => sum + s.cycleTime, 0);
  const pcePercent = totalLeadTime > 0 ? ((valueAddedTime / totalLeadTime) * 100).toFixed(1) : 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary/10">
            <GitBranch className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle>Value Stream Map</CardTitle>
            <CardDescription>Visualize and analyze process flow and waste</CardDescription>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Product/Service Family</Label>
            <Input
              value={data.productFamily}
              onChange={(e) => setData(prev => ({ ...prev, productFamily: e.target.value }))}
              placeholder="Product family name"
            />
          </div>
          <div className="space-y-2">
            <Label>Customer Demand (units/day)</Label>
            <Input
              type="number"
              value={data.customerDemand || ""}
              onChange={(e) => setData(prev => ({ ...prev, customerDemand: parseFloat(e.target.value) || 0 }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Takt Time (seconds)</Label>
            <Input
              type="number"
              value={data.taktTime || ""}
              onChange={(e) => setData(prev => ({ ...prev, taktTime: parseFloat(e.target.value) || 0 }))}
            />
          </div>
        </div>

        {/* Process Steps */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-semibold">Process Steps</Label>
            <Button onClick={addStep} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add Step
            </Button>
          </div>

          {/* Visual Flow */}
          {data.steps.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto p-4 bg-muted/30 rounded-lg">
              {data.steps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-2">
                  <div className={`p-3 rounded-lg border-2 min-w-[120px] text-center ${
                    step.valueAdded ? 'border-green-500 bg-green-500/10' : 'border-orange-500 bg-orange-500/10'
                  }`}>
                    <div className="font-medium text-sm">{step.name || `Step ${index + 1}`}</div>
                    <div className="text-xs text-muted-foreground">CT: {step.cycleTime}s</div>
                    <div className="text-xs text-muted-foreground">WT: {step.waitTime}s</div>
                  </div>
                  {index < data.steps.length - 1 && (
                    <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Step Name</TableHead>
                <TableHead>Cycle Time (s)</TableHead>
                <TableHead>Wait Time (s)</TableHead>
                <TableHead>Inventory</TableHead>
                <TableHead>Operators</TableHead>
                <TableHead>Uptime %</TableHead>
                <TableHead>Value Added</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.steps.map((step) => (
                <TableRow key={step.id}>
                  <TableCell>
                    <Input
                      value={step.name}
                      onChange={(e) => updateStep(step.id, "name", e.target.value)}
                      placeholder="Step name"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={step.cycleTime || ""}
                      onChange={(e) => updateStep(step.id, "cycleTime", parseFloat(e.target.value) || 0)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={step.waitTime || ""}
                      onChange={(e) => updateStep(step.id, "waitTime", parseFloat(e.target.value) || 0)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={step.inventory || ""}
                      onChange={(e) => updateStep(step.id, "inventory", parseFloat(e.target.value) || 0)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={step.operators || ""}
                      onChange={(e) => updateStep(step.id, "operators", parseFloat(e.target.value) || 0)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={step.uptime || ""}
                      onChange={(e) => updateStep(step.id, "uptime", parseFloat(e.target.value) || 0)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant={step.valueAdded ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateStep(step.id, "valueAdded", !step.valueAdded)}
                    >
                      {step.valueAdded ? "VA" : "NVA"}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => removeStep(step.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{totalCycleTime}s</div>
            <div className="text-sm text-muted-foreground">Total Cycle Time</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-500">{totalWaitTime}s</div>
            <div className="text-sm text-muted-foreground">Total Wait Time</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold">{totalLeadTime}s</div>
            <div className="text-sm text-muted-foreground">Total Lead Time</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">{valueAddedTime}s</div>
            <div className="text-sm text-muted-foreground">Value Added Time</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">{pcePercent}%</div>
            <div className="text-sm text-muted-foreground">PCE</div>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
