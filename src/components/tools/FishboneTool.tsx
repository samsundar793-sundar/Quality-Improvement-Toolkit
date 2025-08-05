import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Download, FileText, Share2 } from "lucide-react";
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

        {/* Visual Fishbone Diagram */}
        {data.problemStatement && data.causes.some(c => c.description) && (
          <Card className="bg-muted/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Visual Fishbone Diagram
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <svg width="800" height="500" viewBox="0 0 800 500" className="border rounded-lg bg-background">
                  {/* Main spine (horizontal line) */}
                  <line x1="150" y1="250" x2="650" y2="250" stroke="hsl(var(--foreground))" strokeWidth="3"/>
                  
                  {/* Problem box (fish head) */}
                  <rect x="650" y="220" width="120" height="60" fill="hsl(var(--primary))" fillOpacity="0.1" stroke="hsl(var(--primary))" strokeWidth="2" rx="5"/>
                  <text x="710" y="235" textAnchor="middle" className="fill-primary text-xs font-medium">PROBLEM</text>
                  <foreignObject x="655" y="240" width="110" height="35">
                    <div className="text-xs text-center p-1 overflow-hidden">
                      {data.problemStatement.substring(0, 50)}...
                    </div>
                  </foreignObject>
                  
                  {/* Top causes (People, Process, Equipment) */}
                  {[
                    { cause: data.causes[0], x: 200, y: 150, label: "PEOPLE" },
                    { cause: data.causes[1], x: 350, y: 120, label: "PROCESS" },
                    { cause: data.causes[2], x: 500, y: 150, label: "EQUIPMENT" }
                  ].map(({ cause, x, y, label }) => (
                    <g key={cause.id}>
                      {/* Diagonal line from spine */}
                      <line x1={x} y1="250" x2={x} y2={y + 40} stroke="hsl(var(--foreground))" strokeWidth="2"/>
                      <line x1={x} y1={y + 40} x2={x + 80} y2={y} stroke="hsl(var(--foreground))" strokeWidth="2"/>
                      
                      {/* Category label */}
                      <rect x={x + 80} y={y - 10} width="80" height="20" fill="hsl(var(--secondary))" fillOpacity="0.8" stroke="hsl(var(--border))" rx="3"/>
                      <text x={x + 120} y={y + 4} textAnchor="middle" className="fill-foreground text-xs font-bold">{label}</text>
                      
                      {/* Main cause */}
                      {cause.description && (
                        <foreignObject x={x + 85} y={y + 15} width="75" height="30">
                          <div className="text-xs p-1 bg-background border rounded text-center">
                            {cause.description.substring(0, 20)}...
                          </div>
                        </foreignObject>
                      )}
                      
                      {/* Sub-causes */}
                      {cause.subcauses.slice(0, 2).map((subcause, index) => (
                        subcause && (
                          <foreignObject key={index} x={x + 10} y={y + 50 + index * 25} width="60" height="20">
                            <div className="text-xs p-1 bg-muted border rounded">
                              {subcause.substring(0, 12)}...
                            </div>
                          </foreignObject>
                        )
                      ))}
                    </g>
                  ))}
                  
                  {/* Bottom causes (Materials, Environment, Methods) */}
                  {[
                    { cause: data.causes[3], x: 200, y: 350, label: "MATERIALS" },
                    { cause: data.causes[4], x: 350, y: 380, label: "ENVIRONMENT" },
                    { cause: data.causes[5], x: 500, y: 350, label: "METHODS" }
                  ].map(({ cause, x, y, label }) => (
                    <g key={cause.id}>
                      {/* Diagonal line from spine */}
                      <line x1={x} y1="250" x2={x} y2={y - 40} stroke="hsl(var(--foreground))" strokeWidth="2"/>
                      <line x1={x} y1={y - 40} x2={x + 80} y2={y} stroke="hsl(var(--foreground))" strokeWidth="2"/>
                      
                      {/* Category label */}
                      <rect x={x + 80} y={y - 10} width="80" height="20" fill="hsl(var(--secondary))" fillOpacity="0.8" stroke="hsl(var(--border))" rx="3"/>
                      <text x={x + 120} y={y + 4} textAnchor="middle" className="fill-foreground text-xs font-bold">{label}</text>
                      
                      {/* Main cause */}
                      {cause.description && (
                        <foreignObject x={x + 85} y={y - 45} width="75" height="30">
                          <div className="text-xs p-1 bg-background border rounded text-center">
                            {cause.description.substring(0, 20)}...
                          </div>
                        </foreignObject>
                      )}
                      
                      {/* Sub-causes */}
                      {cause.subcauses.slice(0, 2).map((subcause, index) => (
                        subcause && (
                          <foreignObject key={index} x={x + 10} y={y - 100 - index * 25} width="60" height="20">
                            <div className="text-xs p-1 bg-muted border rounded">
                              {subcause.substring(0, 12)}...
                            </div>
                          </foreignObject>
                        )
                      ))}
                    </g>
                  ))}
                </svg>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                This visual diagram shows the relationship between causes and the problem. Use the detailed analysis above for complete information.
              </p>
            </CardContent>
          </Card>
        )}

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