import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Download, RotateCcw, Plus, X, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

interface Stakeholder {
  id: string;
  name: string;
  role: string;
  influence: "Low" | "Medium" | "High";
  interest: "Low" | "Medium" | "High";
  attitude: "Supporter" | "Neutral" | "Opponent";
  impact: string;
  engagementStrategy: string;
}

export function StakeholderAnalysisTool() {
  const { toast } = useToast();
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([
    {
      id: "1",
      name: "Project Sponsor",
      role: "Executive",
      influence: "High",
      interest: "High", 
      attitude: "Supporter",
      impact: "Project funding and resources",
      engagementStrategy: "Regular executive updates"
    }
  ]);

  const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length > 1) {
          const newStakeholders: Stakeholder[] = [];
          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i] as any[];
            if (row[0] && row[1]) {
              newStakeholders.push({
                id: i.toString(),
                name: row[0]?.toString() || '',
                role: row[1]?.toString() || '',
                influence: (row[2]?.toString() || 'Medium') as any,
                interest: (row[3]?.toString() || 'Medium') as any,
                attitude: (row[4]?.toString() || 'Neutral') as any,
                impact: row[5]?.toString() || '',
                engagementStrategy: row[6]?.toString() || ''
              });
            }
          }
          
          setStakeholders(newStakeholders);
          toast({
            title: "Excel Data Imported",
            description: `Imported ${newStakeholders.length} stakeholders.`
          });
        }
      } catch (error) {
        toast({
          title: "Import Error",
          description: "Failed to parse Excel file.",
          variant: "destructive"
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const addStakeholder = () => {
    const newStakeholder: Stakeholder = {
      id: Date.now().toString(),
      name: "",
      role: "",
      influence: "Medium",
      interest: "Medium",
      attitude: "Neutral",
      impact: "",
      engagementStrategy: ""
    };
    setStakeholders([...stakeholders, newStakeholder]);
  };

  const updateStakeholder = (id: string, field: keyof Stakeholder, value: string) => {
    setStakeholders(prev => prev.map(stakeholder => 
      stakeholder.id === id ? { ...stakeholder, [field]: value } : stakeholder
    ));
  };

  const removeStakeholder = (id: string) => {
    setStakeholders(prev => prev.filter(s => s.id !== id));
  };

  const getInfluenceInterestQuadrant = (influence: string, interest: string) => {
    if (influence === "High" && interest === "High") return "Manage Closely";
    if (influence === "High" && interest === "Low") return "Keep Satisfied";
    if (influence === "Low" && interest === "High") return "Keep Informed";
    return "Monitor";
  };

  const getQuadrantColor = (quadrant: string) => {
    const colors = {
      "Manage Closely": "bg-destructive/20 border-destructive",
      "Keep Satisfied": "bg-warning/20 border-warning",
      "Keep Informed": "bg-primary/20 border-primary",
      "Monitor": "bg-muted border-border"
    };
    return colors[quadrant as keyof typeof colors] || "bg-muted border-border";
  };

  const exportResults = () => {
    const results = `
STAKEHOLDER ANALYSIS REPORT
===========================

Total Stakeholders: ${stakeholders.length}

STAKEHOLDER DETAILS:
${stakeholders.map(s => `
${s.name} (${s.role})
  Influence: ${s.influence}
  Interest: ${s.interest}
  Attitude: ${s.attitude}
  Quadrant: ${getInfluenceInterestQuadrant(s.influence, s.interest)}
  Impact: ${s.impact}
  Engagement Strategy: ${s.engagementStrategy}
`).join('')}

QUADRANT SUMMARY:
${Object.entries(
  stakeholders.reduce((acc, s) => {
    const quad = getInfluenceInterestQuadrant(s.influence, s.interest);
    acc[quad] = (acc[quad] || 0) + 1;
    return acc;
  }, {} as Record<string, number>)
).map(([quad, count]) => `${quad}: ${count} stakeholders`).join('\n')}

Analysis Date: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([results], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stakeholder-analysis-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setStakeholders([{
      id: "1",
      name: "Project Sponsor",
      role: "Executive",
      influence: "High",
      interest: "High",
      attitude: "Supporter",
      impact: "Project funding and resources",
      engagementStrategy: "Regular executive updates"
    }]);
  };

  return (
    <Card className="card-professional">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-primary" />
            <CardTitle>Stakeholder Analysis</CardTitle>
          </div>
          <div className="flex gap-2">
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleExcelUpload}
                className="hidden"
              />
              <Button variant="outline" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Excel
                </span>
              </Button>
            </label>
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="analytics" onClick={exportResults}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="stakeholders" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
            <TabsTrigger value="matrix">Influence-Interest Matrix</TabsTrigger>
            <TabsTrigger value="guide">Guide</TabsTrigger>
          </TabsList>
          
          <TabsContent value="stakeholders" className="space-y-4">
            <Button onClick={addStakeholder}>
              <Plus className="h-4 w-4 mr-2" />
              Add Stakeholder
            </Button>
            
            <div className="space-y-4">
              {stakeholders.map((stakeholder) => (
                <Card key={stakeholder.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <Label>Name</Label>
                          <Input
                            value={stakeholder.name}
                            onChange={(e) => updateStakeholder(stakeholder.id, 'name', e.target.value)}
                            placeholder="Stakeholder name"
                          />
                        </div>
                        <div>
                          <Label>Role</Label>
                          <Input
                            value={stakeholder.role}
                            onChange={(e) => updateStakeholder(stakeholder.id, 'role', e.target.value)}
                            placeholder="Position/Role"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <Label>Influence</Label>
                            <Select 
                              value={stakeholder.influence} 
                              onValueChange={(value) => updateStakeholder(stakeholder.id, 'influence', value)}
                            >
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
                          <div>
                            <Label>Interest</Label>
                            <Select 
                              value={stakeholder.interest} 
                              onValueChange={(value) => updateStakeholder(stakeholder.id, 'interest', value)}
                            >
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
                          <div>
                            <Label>Attitude</Label>
                            <Select 
                              value={stakeholder.attitude} 
                              onValueChange={(value) => updateStakeholder(stakeholder.id, 'attitude', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Supporter">Supporter</SelectItem>
                                <SelectItem value="Neutral">Neutral</SelectItem>
                                <SelectItem value="Opponent">Opponent</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <Label>Impact on Project</Label>
                          <Input
                            value={stakeholder.impact}
                            onChange={(e) => updateStakeholder(stakeholder.id, 'impact', e.target.value)}
                            placeholder="How they impact the project"
                          />
                        </div>
                        <div>
                          <Label>Engagement Strategy</Label>
                          <Input
                            value={stakeholder.engagementStrategy}
                            onChange={(e) => updateStakeholder(stakeholder.id, 'engagementStrategy', e.target.value)}
                            placeholder="How to engage this stakeholder"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getQuadrantColor(getInfluenceInterestQuadrant(stakeholder.influence, stakeholder.interest))}`}>
                            {getInfluenceInterestQuadrant(stakeholder.influence, stakeholder.interest)}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeStakeholder(stakeholder.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="matrix">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Influence-Interest Matrix</h4>
              <div className="grid grid-cols-2 gap-4 h-96">
                {["Manage Closely", "Keep Satisfied", "Keep Informed", "Monitor"].map((quadrant, index) => {
                  const quadrantStakeholders = stakeholders.filter(s => 
                    getInfluenceInterestQuadrant(s.influence, s.interest) === quadrant
                  );
                  
                  return (
                    <div key={quadrant} className={`p-4 rounded-lg border-2 ${getQuadrantColor(quadrant)}`}>
                      <h5 className="font-semibold mb-2">{quadrant}</h5>
                      <div className="space-y-1">
                        {quadrantStakeholders.map(s => (
                          <div key={s.id} className="text-sm p-2 bg-background/50 rounded">
                            <div className="font-medium">{s.name}</div>
                            <div className="text-xs text-muted-foreground">{s.role}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="guide">
            <div className="space-y-4">
              <h4 className="font-semibold">Stakeholder Analysis Guide</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h5 className="font-semibold">Influence Levels:</h5>
                  <ul className="text-sm space-y-1">
                    <li><strong>High:</strong> Can significantly impact project decisions</li>
                    <li><strong>Medium:</strong> Some influence on project outcomes</li>
                    <li><strong>Low:</strong> Limited influence on project</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h5 className="font-semibold">Interest Levels:</h5>
                  <ul className="text-sm space-y-1">
                    <li><strong>High:</strong> Actively interested in project outcomes</li>
                    <li><strong>Medium:</strong> Moderately interested</li>
                    <li><strong>Low:</strong> Little interest in project</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-4 bg-muted/30 rounded-lg">
                <h5 className="font-semibold mb-2">Excel Import Format:</h5>
                <p className="text-sm mb-2">Columns: Name, Role, Influence, Interest, Attitude, Impact, Strategy</p>
                <div className="text-xs font-mono bg-background p-2 rounded">
                  Name | Role | Influence | Interest | Attitude | Impact | Strategy<br/>
                  John Doe | Manager | High | Medium | Supporter | Budget decisions | Weekly updates
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}