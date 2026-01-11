import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Save, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProject } from "@/contexts/ProjectContext";

interface WasteItem {
  id: string;
  wasteType: string;
  description: string;
  location: string;
  impact: 'Low' | 'Medium' | 'High';
  frequency: 'Rare' | 'Occasional' | 'Frequent';
  rootCause: string;
  countermeasure: string;
  status: 'Identified' | 'In Progress' | 'Eliminated';
}

interface WasteAnalysisData {
  processName: string;
  analysisDate: string;
  items: WasteItem[];
}

const WASTE_TYPES = [
  { id: 'defects', name: 'Defects', description: 'Rework, scrap, corrections' },
  { id: 'overproduction', name: 'Overproduction', description: 'Making more than needed' },
  { id: 'waiting', name: 'Waiting', description: 'Idle time, delays' },
  { id: 'non-utilized-talent', name: 'Non-Utilized Talent', description: 'Underutilized skills' },
  { id: 'transportation', name: 'Transportation', description: 'Unnecessary movement of materials' },
  { id: 'inventory', name: 'Inventory', description: 'Excess stock, WIP' },
  { id: 'motion', name: 'Motion', description: 'Unnecessary movement of people' },
  { id: 'extra-processing', name: 'Extra Processing', description: 'Over-engineering, redundant steps' }
];

export function WasteAnalysisTool() {
  const { toast } = useToast();
  const { currentProject, updateToolData, getToolData } = useProject();
  
  const [data, setData] = useState<WasteAnalysisData>(() => {
    const saved = currentProject ? getToolData("waste-analysis") : null;
    return saved || {
      processName: "",
      analysisDate: new Date().toISOString().split('T')[0],
      items: []
    };
  });

  const handleSave = () => {
    if (currentProject) {
      updateToolData("waste-analysis", data);
      toast({ title: "Saved", description: "Waste analysis saved successfully" });
    }
  };

  const addItem = () => {
    const newItem: WasteItem = {
      id: Date.now().toString(),
      wasteType: 'defects',
      description: "",
      location: "",
      impact: 'Medium',
      frequency: 'Occasional',
      rootCause: "",
      countermeasure: "",
      status: 'Identified'
    };
    setData(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const updateItem = (id: string, field: keyof WasteItem, value: any) => {
    setData(prev => ({
      ...prev,
      items: prev.items.map(i => i.id === id ? { ...i, [field]: value } : i)
    }));
  };

  const removeItem = (id: string) => {
    setData(prev => ({ ...prev, items: prev.items.filter(i => i.id !== id) }));
  };

  // Summary by waste type
  const wasteSummary = WASTE_TYPES.map(type => ({
    ...type,
    count: data.items.filter(i => i.wasteType === type.id).length,
    highImpact: data.items.filter(i => i.wasteType === type.id && i.impact === 'High').length
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-orange-500/10">
            <AlertTriangle className="h-6 w-6 text-orange-500" />
          </div>
          <div className="flex-1">
            <CardTitle>Waste Analysis (8 Wastes)</CardTitle>
            <CardDescription>Identify and eliminate the 8 types of waste (DOWNTIME)</CardDescription>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Process Name</Label>
            <Input
              value={data.processName}
              onChange={(e) => setData(prev => ({ ...prev, processName: e.target.value }))}
              placeholder="Name of the process being analyzed"
            />
          </div>
          <div className="space-y-2">
            <Label>Analysis Date</Label>
            <Input
              type="date"
              value={data.analysisDate}
              onChange={(e) => setData(prev => ({ ...prev, analysisDate: e.target.value }))}
            />
          </div>
        </div>

        {/* Waste Type Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {wasteSummary.map(waste => (
            <Card key={waste.id} className={`p-3 ${waste.count > 0 ? 'border-orange-500/50' : ''}`}>
              <div className="text-sm font-medium">{waste.name}</div>
              <div className="text-xs text-muted-foreground mb-1">{waste.description}</div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">{waste.count}</span>
                {waste.highImpact > 0 && (
                  <span className="text-xs bg-destructive/20 text-destructive px-1.5 py-0.5 rounded">
                    {waste.highImpact} high
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Waste Items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-semibold">Identified Wastes</Label>
            <Button onClick={addItem} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add Waste
            </Button>
          </div>

          {data.items.map((item) => (
            <Card key={item.id} className="p-4 space-y-4">
              <div className="flex items-start justify-between">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                  <div className="space-y-2">
                    <Label>Waste Type</Label>
                    <Select value={item.wasteType} onValueChange={(v) => updateItem(item.id, "wasteType", v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {WASTE_TYPES.map(type => (
                          <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Impact</Label>
                    <Select value={item.impact} onValueChange={(v) => updateItem(item.id, "impact", v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={item.status} onValueChange={(v) => updateItem(item.id, "status", v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Identified">Identified</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Eliminated">Eliminated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    placeholder="Describe the waste..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={item.location}
                    onChange={(e) => updateItem(item.id, "location", e.target.value)}
                    placeholder="Where does this occur?"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Root Cause</Label>
                  <Textarea
                    value={item.rootCause}
                    onChange={(e) => updateItem(item.id, "rootCause", e.target.value)}
                    placeholder="What causes this waste?"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Countermeasure</Label>
                  <Textarea
                    value={item.countermeasure}
                    onChange={(e) => updateItem(item.id, "countermeasure", e.target.value)}
                    placeholder="How will this be eliminated?"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
