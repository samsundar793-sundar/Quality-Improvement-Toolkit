import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Download, Plus, X, RotateCcw, Upload, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { readExcelFile } from "@/lib/excelUtils";

interface CustomerRequirement {
  id: string;
  requirement: string;
  importance: "Low" | "Medium" | "High" | "Critical";
  currentRating: number;
  targetRating: number;
  gap: number;
}

export function VoiceOfCustomerTool() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [requirements, setRequirements] = useState<CustomerRequirement[]>([
    {
      id: "1",
      requirement: "",
      importance: "Medium",
      currentRating: 1,
      targetRating: 5,
      gap: 4
    }
  ]);

  const addRequirement = () => {
    const newId = (requirements.length + 1).toString();
    setRequirements(prev => [...prev, {
      id: newId,
      requirement: "",
      importance: "Medium",
      currentRating: 1,
      targetRating: 5,
      gap: 4
    }]);
  };

  const removeRequirement = (id: string) => {
    if (requirements.length > 1) {
      setRequirements(prev => prev.filter(req => req.id !== id));
    }
  };

  const updateRequirement = (id: string, field: keyof CustomerRequirement, value: any) => {
    setRequirements(prev => prev.map(req => {
      if (req.id === id) {
        const updated = { ...req, [field]: value };
        if (field === 'currentRating' || field === 'targetRating') {
          updated.gap = updated.targetRating - updated.currentRating;
        }
        return updated;
      }
      return req;
    }));
  };

  const loadTemplate = () => {
    setRequirements([
      {
        id: "1",
        requirement: "Fast delivery (within 24 hours)",
        importance: "Critical",
        currentRating: 3,
        targetRating: 5,
        gap: 2
      },
      {
        id: "2",
        requirement: "Product quality and reliability",
        importance: "Critical",
        currentRating: 4,
        targetRating: 5,
        gap: 1
      },
      {
        id: "3",
        requirement: "Competitive pricing",
        importance: "High",
        currentRating: 3,
        targetRating: 4,
        gap: 1
      },
      {
        id: "4",
        requirement: "Responsive customer service",
        importance: "High",
        currentRating: 2,
        targetRating: 5,
        gap: 3
      },
      {
        id: "5",
        requirement: "Easy ordering process",
        importance: "Medium",
        currentRating: 4,
        targetRating: 5,
        gap: 1
      }
    ]);
    
    toast({
      title: "Template Loaded",
      description: "Sample VOC requirements have been loaded."
    });
  };

  const exportVOC = () => {
    const vocData = `
VOICE OF CUSTOMER ANALYSIS
=========================

${requirements.map((req, index) => `
${index + 1}. ${req.requirement}
   Importance: ${req.importance}
   Current Rating: ${req.currentRating}/5
   Target Rating: ${req.targetRating}/5
   Gap: ${req.gap} points
`).join('')}

PRIORITIZATION MATRIX:
Critical Requirements:
${requirements.filter(r => r.importance === "Critical").map(r => `- ${r.requirement} (Gap: ${r.gap})`).join('\n')}

High Priority Requirements:
${requirements.filter(r => r.importance === "High").map(r => `- ${r.requirement} (Gap: ${r.gap})`).join('\n')}

GAPS ANALYSIS:
Largest Gaps (Priority for Improvement):
${requirements
  .sort((a, b) => b.gap - a.gap)
  .slice(0, 3)
  .map((r, i) => `${i + 1}. ${r.requirement} (${r.gap} point gap)`)
  .join('\n')}

Analysis Date: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([vocData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voc-analysis-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "VOC Analysis Exported",
      description: "Voice of Customer analysis has been downloaded."
    });
  };

  const reset = () => {
    setRequirements([{
      id: "1",
      requirement: "",
      importance: "Medium",
      currentRating: 1,
      targetRating: 5,
      gap: 4
    }]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const buffer = await file.arrayBuffer();
      const { jsonData } = await readExcelFile(buffer);

      const importedReqs: CustomerRequirement[] = jsonData.map((row: any, index: number) => ({
        id: (index + 1).toString(),
        requirement: row.requirement || row.Requirement || "",
        importance: (row.importance || row.Importance || "Medium") as any,
        currentRating: parseInt(row.currentRating || row["Current Rating"] || "1"),
        targetRating: parseInt(row.targetRating || row["Target Rating"] || "5"),
        gap: 0
      })).map(req => ({
        ...req,
        gap: req.targetRating - req.currentRating
      }));

      setRequirements(importedReqs.length > 0 ? importedReqs : [requirements[0]]);
      
      toast({
        title: "Data Imported",
        description: `Successfully imported ${importedReqs.length} requirements from Excel.`
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Could not read the Excel file. Please check the format.",
        variant: "destructive"
      });
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "Critical": return "text-red-500";
      case "High": return "text-orange-500";
      case "Medium": return "text-yellow-500";
      case "Low": return "text-green-500";
      default: return "text-muted-foreground";
    }
  };

  const getBarColor = (gap: number) => {
    if (gap > 2) return "#ef4444";
    if (gap > 1) return "#f59e0b";
    return "#22c55e";
  };

  const chartData = requirements
    .filter(r => r.requirement.trim())
    .map(r => ({
      name: r.requirement.substring(0, 20) + (r.requirement.length > 20 ? '...' : ''),
      gap: r.gap,
      current: r.currentRating,
      target: r.targetRating
    }));

  return (
    <Card className="card-professional">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-primary" />
            <CardTitle>Voice of Customer Analysis</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" onClick={loadTemplate}>
              Load Template
            </Button>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Import Excel
            </Button>
            <Button variant="analytics" onClick={exportVOC}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label className="text-lg font-semibold">Customer Requirements</Label>
          <Button variant="outline" onClick={addRequirement}>
            <Plus className="h-4 w-4 mr-2" />
            Add Requirement
          </Button>
        </div>

        <div className="space-y-4">
          {requirements.map((req) => (
            <div key={req.id} className="p-4 border border-border rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-primary font-medium">Requirement #{req.id}</Label>
                {requirements.length > 1 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => removeRequirement(req.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div>
                <Label>Customer Requirement</Label>
                <Textarea
                  value={req.requirement}
                  onChange={(e) => updateRequirement(req.id, 'requirement', e.target.value)}
                  placeholder="What does the customer want or need?"
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Importance Level</Label>
                  <Select
                    value={req.importance}
                    onValueChange={(value) => updateRequirement(req.id, 'importance', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Current Rating (1-5)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    value={req.currentRating}
                    onChange={(e) => updateRequirement(req.id, 'currentRating', parseInt(e.target.value) || 1)}
                  />
                </div>
                
                <div>
                  <Label>Target Rating (1-5)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    value={req.targetRating}
                    onChange={(e) => updateRequirement(req.id, 'targetRating', parseInt(e.target.value) || 5)}
                  />
                </div>
                
                <div>
                  <Label>Gap</Label>
                  <div className={`p-2 text-center font-bold rounded border ${
                    req.gap > 2 ? 'bg-red-50 text-red-700 border-red-200' :
                    req.gap > 1 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                    'bg-green-50 text-green-700 border-green-200'
                  }`}>
                    {req.gap} points
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gap Analysis Chart */}
        {chartData.length > 0 && (
          <div className="mt-8 p-4 border border-border rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h4 className="font-semibold">Gap Analysis Visualization</h4>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Legend />
                <Bar dataKey="gap" name="Gap" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.gap)} />
                  ))}
                </Bar>
                <Bar dataKey="current" name="Current" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} />
                <Bar dataKey="target" name="Target" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Summary */}
        {requirements.some(r => r.requirement.trim()) && (
          <div className="mt-8 p-4 bg-muted/30 rounded-lg">
            <h4 className="font-semibold mb-4">Priority Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-red-500 mb-2">Critical Requirements</h5>
                <div className="space-y-1 text-sm">
                  {requirements
                    .filter(r => r.importance === "Critical" && r.requirement.trim())
                    .map(r => (
                      <div key={r.id}>• {r.requirement} (Gap: {r.gap})</div>
                    ))}
                  {requirements.filter(r => r.importance === "Critical" && r.requirement.trim()).length === 0 && (
                    <div className="text-muted-foreground">No critical requirements</div>
                  )}
                </div>
              </div>
              <div>
                <h5 className="font-medium text-orange-500 mb-2">Largest Gaps</h5>
                <div className="space-y-1 text-sm">
                  {requirements
                    .filter(r => r.requirement.trim())
                    .sort((a, b) => b.gap - a.gap)
                    .slice(0, 3)
                    .map(r => (
                      <div key={r.id}>• {r.requirement} ({r.gap} points)</div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}