import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Download, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Cause {
  id: string;
  category: string;
  description: string;
  subcauses: string[];
}

interface FishboneData {
  problemStatement: string;
  causes: Cause[];
}

export function FishboneTool() {
  const { toast } = useToast();
  const [data, setData] = useState<FishboneData>({
    problemStatement: "",
    causes: [
      { id: "1", category: "People", description: "", subcauses: [] },
      { id: "2", category: "Process", description: "", subcauses: [] },
      { id: "3", category: "Equipment", description: "", subcauses: [] },
      { id: "4", category: "Materials", description: "", subcauses: [] },
      { id: "5", category: "Environment", description: "", subcauses: [] },
      { id: "6", category: "Methods", description: "", subcauses: [] }
    ]
  });

  const updateCause = (id: string, field: keyof Cause, value: any) => {
    setData(prev => ({
      ...prev,
      causes: prev.causes.map(cause =>
        cause.id === id ? { ...cause, [field]: value } : cause
      )
    }));
  };

  const addSubcause = (causeId: string) => {
    setData(prev => ({
      ...prev,
      causes: prev.causes.map(cause =>
        cause.id === causeId 
          ? { ...cause, subcauses: [...cause.subcauses, ""] }
          : cause
      )
    }));
  };

  const updateSubcause = (causeId: string, subcauseIndex: number, value: string) => {
    setData(prev => ({
      ...prev,
      causes: prev.causes.map(cause =>
        cause.id === causeId 
          ? { 
              ...cause, 
              subcauses: cause.subcauses.map((sub, index) => 
                index === subcauseIndex ? value : sub
              )
            }
          : cause
      )
    }));
  };

  const removeSubcause = (causeId: string, subcauseIndex: number) => {
    setData(prev => ({
      ...prev,
      causes: prev.causes.map(cause =>
        cause.id === causeId 
          ? { 
              ...cause, 
              subcauses: cause.subcauses.filter((_, index) => index !== subcauseIndex)
            }
          : cause
      )
    }));
  };

  const loadTemplate = () => {
    setData({
      problemStatement: "Customer complaints about product quality defects",
      causes: [
        {
          id: "1",
          category: "People",
          description: "Training and skills",
          subcauses: ["Insufficient training", "Lack of experience", "Communication gaps"]
        },
        {
          id: "2",
          category: "Process",
          description: "Work procedures",
          subcauses: ["Unclear procedures", "Process variation", "Quality checks missing"]
        },
        {
          id: "3",
          category: "Equipment",
          description: "Machinery and tools",
          subcauses: ["Equipment wear", "Calibration issues", "Maintenance delays"]
        },
        {
          id: "4",
          category: "Materials",
          description: "Raw materials and supplies",
          subcauses: ["Material variation", "Supplier quality", "Storage conditions"]
        },
        {
          id: "5",
          category: "Environment",
          description: "Work environment",
          subcauses: ["Temperature variation", "Humidity issues", "Workspace layout"]
        },
        {
          id: "6",
          category: "Methods",
          description: "Work methods",
          subcauses: ["Outdated methods", "Inconsistent approach", "Method verification"]
        }
      ]
    });
    
    toast({
      title: "Template loaded",
      description: "Sample fishbone diagram has been loaded",
    });
  };

  const exportAnalysis = () => {
    const content = `Fishbone (Cause & Effect) Analysis
Generated on: ${new Date().toLocaleDateString()}

Problem Statement:
${data.problemStatement}

Root Cause Categories:
${data.causes.map(cause => `
${cause.category}:
Main Cause: ${cause.description}
Sub-causes:
${cause.subcauses.map(sub => `  • ${sub}`).join('\n')}
`).join('\n')}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fishbone-analysis.txt';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Analysis exported",
      description: "Fishbone analysis has been downloaded",
    });
  };

  const reset = () => {
    setData({
      problemStatement: "",
      causes: [
        { id: "1", category: "People", description: "", subcauses: [] },
        { id: "2", category: "Process", description: "", subcauses: [] },
        { id: "3", category: "Equipment", description: "", subcauses: [] },
        { id: "4", category: "Materials", description: "", subcauses: [] },
        { id: "5", category: "Environment", description: "", subcauses: [] },
        { id: "6", category: "Methods", description: "", subcauses: [] }
      ]
    });
  };

  return (
    <Card className="card-professional">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold text-primary">Fishbone (Cause & Effect) Diagram</CardTitle>
            <CardDescription>
              Systematic root cause analysis using the 6M categories
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={reset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={loadTemplate}>
              <FileText className="w-4 h-4 mr-2" />
              Load Template
            </Button>
            <Button variant="success" size="sm" onClick={exportAnalysis}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="problem" className="text-sm font-medium">Problem Statement</Label>
          <Textarea
            id="problem"
            placeholder="Describe the problem or effect you want to analyze..."
            value={data.problemStatement}
            onChange={(e) => setData(prev => ({ ...prev, problemStatement: e.target.value }))}
            className="min-h-20"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.causes.map((cause) => (
            <Card key={cause.id} className="border-muted">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-sm font-medium">
                    {cause.category}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addSubcause(cause.id)}
                    className="text-xs"
                  >
                    Add Sub-cause
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Main Cause</Label>
                  <Input
                    placeholder={`Primary ${cause.category.toLowerCase()} cause...`}
                    value={cause.description}
                    onChange={(e) => updateCause(cause.id, 'description', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Sub-causes</Label>
                  {cause.subcauses.map((subcause, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Contributing factor..."
                        value={subcause}
                        onChange={(e) => updateSubcause(cause.id, index, e.target.value)}
                        className="text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeSubcause(cause.id, index)}
                        className="px-2"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {data.problemStatement && data.causes.some(c => c.description) && (
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <strong>Problem:</strong> {data.problemStatement}
                </div>
                <div>
                  <strong>Categories with Identified Causes:</strong>{" "}
                  {data.causes.filter(c => c.description).length} of 6
                </div>
                <div>
                  <strong>Total Sub-causes:</strong>{" "}
                  {data.causes.reduce((sum, cause) => sum + cause.subcauses.filter(s => s).length, 0)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Focus on causes with the most sub-causes for deeper investigation.
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}