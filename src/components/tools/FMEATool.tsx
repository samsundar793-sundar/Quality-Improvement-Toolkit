import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Download, RotateCcw, Plus, X, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

interface FMEAItem {
  id: string;
  processStep: string;
  potentialFailure: string;
  potentialEffect: string;
  severity: number; // 1-10
  potentialCause: string;
  occurrence: number; // 1-10
  currentControls: string;
  detection: number; // 1-10
  rpn: number; // Risk Priority Number
  recommendedActions: string;
  responsibility: string;
  targetDate: string;
  actionsTaken: string;
  newSeverity?: number;
  newOccurrence?: number;
  newDetection?: number;
  newRPN?: number;
}

export function FMEATool() {
  const { toast } = useToast();
  const [fmeaItems, setFmeaItems] = useState<FMEAItem[]>([
    {
      id: "1",
      processStep: "Material Preparation",
      potentialFailure: "Wrong material selected",
      potentialEffect: "Product does not meet specifications",
      severity: 8,
      potentialCause: "Labeling error",
      occurrence: 3,
      currentControls: "Visual inspection",
      detection: 6,
      rpn: 144,
      recommendedActions: "Implement barcode scanning",
      responsibility: "Material Handler",
      targetDate: "2024-03-01",
      actionsTaken: ""
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
          const newItems: FMEAItem[] = [];
          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i] as any[];
            if (row[0] && row[1]) {
              const severity = parseInt(row[3]?.toString() || '5') || 5;
              const occurrence = parseInt(row[5]?.toString() || '5') || 5;
              const detection = parseInt(row[7]?.toString() || '5') || 5;
              
              newItems.push({
                id: i.toString(),
                processStep: row[0]?.toString() || '',
                potentialFailure: row[1]?.toString() || '',
                potentialEffect: row[2]?.toString() || '',
                severity,
                potentialCause: row[4]?.toString() || '',
                occurrence,
                currentControls: row[6]?.toString() || '',
                detection,
                rpn: severity * occurrence * detection,
                recommendedActions: row[8]?.toString() || '',
                responsibility: row[9]?.toString() || '',
                targetDate: row[10]?.toString() || '',
                actionsTaken: row[11]?.toString() || ''
              });
            }
          }
          
          setFmeaItems(newItems);
          toast({
            title: "Excel Data Imported",
            description: `Imported ${newItems.length} FMEA items.`
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

  const addFmeaItem = () => {
    const newItem: FMEAItem = {
      id: Date.now().toString(),
      processStep: "",
      potentialFailure: "",
      potentialEffect: "",
      severity: 5,
      potentialCause: "",
      occurrence: 5,
      currentControls: "",
      detection: 5,
      rpn: 125,
      recommendedActions: "",
      responsibility: "",
      targetDate: "",
      actionsTaken: ""
    };
    setFmeaItems([...fmeaItems, newItem]);
  };

  const updateFmeaItem = (id: string, field: keyof FMEAItem, value: string | number) => {
    setFmeaItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        // Recalculate RPN when severity, occurrence, or detection changes
        if (field === 'severity' || field === 'occurrence' || field === 'detection') {
          updated.rpn = updated.severity * updated.occurrence * updated.detection;
        }
        // Recalculate new RPN
        if (field === 'newSeverity' || field === 'newOccurrence' || field === 'newDetection') {
          const newS = updated.newSeverity || updated.severity;
          const newO = updated.newOccurrence || updated.occurrence;
          const newD = updated.newDetection || updated.detection;
          updated.newRPN = newS * newO * newD;
        }
        return updated;
      }
      return item;
    }));
  };

  const removeFmeaItem = (id: string) => {
    setFmeaItems(prev => prev.filter(item => item.id !== id));
  };

  const getRiskLevel = (rpn: number) => {
    if (rpn >= 200) return { level: "High", color: "bg-destructive/20 text-destructive" };
    if (rpn >= 100) return { level: "Medium", color: "bg-warning/20 text-warning" };
    return { level: "Low", color: "bg-green-100 text-green-800" };
  };

  const exportResults = () => {
    const results = `
FMEA (FAILURE MODE AND EFFECTS ANALYSIS)
========================================

Total Items Analyzed: ${fmeaItems.length}
High Risk Items (RPN ≥ 200): ${fmeaItems.filter(item => item.rpn >= 200).length}
Medium Risk Items (RPN 100-199): ${fmeaItems.filter(item => item.rpn >= 100 && item.rpn < 200).length}
Low Risk Items (RPN < 100): ${fmeaItems.filter(item => item.rpn < 100).length}

DETAILED FMEA ANALYSIS:
${fmeaItems.map((item, i) => `
${i + 1}. PROCESS STEP: ${item.processStep}
   Potential Failure Mode: ${item.potentialFailure}
   Potential Effect of Failure: ${item.potentialEffect}
   Severity (S): ${item.severity}
   
   Potential Cause: ${item.potentialCause}
   Occurrence (O): ${item.occurrence}
   
   Current Process Controls: ${item.currentControls}
   Detection (D): ${item.detection}
   
   RISK PRIORITY NUMBER (RPN): ${item.rpn} [${getRiskLevel(item.rpn).level} Risk]
   
   Recommended Action(s): ${item.recommendedActions}
   Responsibility: ${item.responsibility}
   Target Date: ${item.targetDate}
   Actions Taken: ${item.actionsTaken || 'Pending'}
   
   ${item.newRPN ? `Post-Action RPN: ${item.newRPN} (Improvement: ${((item.rpn - item.newRPN) / item.rpn * 100).toFixed(1)}%)` : ''}
`).join('')}

RISK SUMMARY:
Highest RPN: ${Math.max(...fmeaItems.map(item => item.rpn))}
Average RPN: ${(fmeaItems.reduce((sum, item) => sum + item.rpn, 0) / fmeaItems.length).toFixed(1)}

PRIORITY ACTIONS NEEDED:
${fmeaItems
  .filter(item => item.rpn >= 200)
  .sort((a, b) => b.rpn - a.rpn)
  .map(item => `• ${item.processStep}: ${item.potentialFailure} (RPN: ${item.rpn})`)
  .join('\n')}

Analysis Date: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([results], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fmea-analysis-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFmeaItems([{
      id: "1",
      processStep: "Material Preparation",
      potentialFailure: "Wrong material selected",
      potentialEffect: "Product does not meet specifications",
      severity: 8,
      potentialCause: "Labeling error",
      occurrence: 3,
      currentControls: "Visual inspection",
      detection: 6,
      rpn: 144,
      recommendedActions: "Implement barcode scanning",
      responsibility: "Material Handler",
      targetDate: "2024-03-01",
      actionsTaken: ""
    }]);
  };

  return (
    <Card className="card-professional">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-primary" />
            <CardTitle>FMEA (Failure Mode and Effects Analysis)</CardTitle>
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
        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analysis">FMEA Analysis</TabsTrigger>
            <TabsTrigger value="summary">Risk Summary</TabsTrigger>
            <TabsTrigger value="guide">Guide</TabsTrigger>
          </TabsList>
          
          <TabsContent value="analysis" className="space-y-4">
            <Button onClick={addFmeaItem}>
              <Plus className="h-4 w-4 mr-2" />
              Add FMEA Item
            </Button>
            
            <div className="space-y-4">
              {fmeaItems.map((item) => (
                <Card key={item.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {/* Basic Information */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Process Step</Label>
                          <Input
                            value={item.processStep}
                            onChange={(e) => updateFmeaItem(item.id, 'processStep', e.target.value)}
                            placeholder="Process step"
                          />
                        </div>
                        <div>
                          <Label>Potential Failure Mode</Label>
                          <Input
                            value={item.potentialFailure}
                            onChange={(e) => updateFmeaItem(item.id, 'potentialFailure', e.target.value)}
                            placeholder="What could go wrong"
                          />
                        </div>
                        <div>
                          <Label>Potential Effect</Label>
                          <Input
                            value={item.potentialEffect}
                            onChange={(e) => updateFmeaItem(item.id, 'potentialEffect', e.target.value)}
                            placeholder="Impact of failure"
                          />
                        </div>
                      </div>

                      {/* Risk Assessment */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <Label>Severity (1-10)</Label>
                          <Select 
                            value={item.severity.toString()} 
                            onValueChange={(value) => updateFmeaItem(item.id, 'severity', parseInt(value))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({length: 10}, (_, i) => (
                                <SelectItem key={i+1} value={(i+1).toString()}>{i+1}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Occurrence (1-10)</Label>
                          <Select 
                            value={item.occurrence.toString()} 
                            onValueChange={(value) => updateFmeaItem(item.id, 'occurrence', parseInt(value))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({length: 10}, (_, i) => (
                                <SelectItem key={i+1} value={(i+1).toString()}>{i+1}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Detection (1-10)</Label>
                          <Select 
                            value={item.detection.toString()} 
                            onValueChange={(value) => updateFmeaItem(item.id, 'detection', parseInt(value))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({length: 10}, (_, i) => (
                                <SelectItem key={i+1} value={(i+1).toString()}>{i+1}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>RPN</Label>
                          <div className={`p-2 rounded text-center font-bold ${getRiskLevel(item.rpn).color}`}>
                            {item.rpn}
                          </div>
                          <div className="text-xs text-center text-muted-foreground">
                            {getRiskLevel(item.rpn).level} Risk
                          </div>
                        </div>
                      </div>

                      {/* Cause and Controls */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Potential Cause</Label>
                          <Input
                            value={item.potentialCause}
                            onChange={(e) => updateFmeaItem(item.id, 'potentialCause', e.target.value)}
                            placeholder="Root cause of failure"
                          />
                        </div>
                        <div>
                          <Label>Current Controls</Label>
                          <Input
                            value={item.currentControls}
                            onChange={(e) => updateFmeaItem(item.id, 'currentControls', e.target.value)}
                            placeholder="Existing controls"
                          />
                        </div>
                      </div>

                      {/* Action Plan */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Recommended Actions</Label>
                          <Input
                            value={item.recommendedActions}
                            onChange={(e) => updateFmeaItem(item.id, 'recommendedActions', e.target.value)}
                            placeholder="Improvement actions"
                          />
                        </div>
                        <div>
                          <Label>Responsibility</Label>
                          <Input
                            value={item.responsibility}
                            onChange={(e) => updateFmeaItem(item.id, 'responsibility', e.target.value)}
                            placeholder="Who is responsible"
                          />
                        </div>
                        <div>
                          <Label>Target Date</Label>
                          <Input
                            type="date"
                            value={item.targetDate}
                            onChange={(e) => updateFmeaItem(item.id, 'targetDate', e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Actions Taken and Post-Action Assessment */}
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label>Actions Taken</Label>
                          <Input
                            value={item.actionsTaken}
                            onChange={(e) => updateFmeaItem(item.id, 'actionsTaken', e.target.value)}
                            placeholder="What actions have been completed"
                          />
                        </div>
                        
                        {item.actionsTaken && (
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3 bg-muted/30 rounded-lg">
                            <div>
                              <Label>New Severity</Label>
                              <Select 
                                value={item.newSeverity?.toString() || ""} 
                                onValueChange={(value) => updateFmeaItem(item.id, 'newSeverity', parseInt(value))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.from({length: 10}, (_, i) => (
                                    <SelectItem key={i+1} value={(i+1).toString()}>{i+1}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>New Occurrence</Label>
                              <Select 
                                value={item.newOccurrence?.toString() || ""} 
                                onValueChange={(value) => updateFmeaItem(item.id, 'newOccurrence', parseInt(value))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.from({length: 10}, (_, i) => (
                                    <SelectItem key={i+1} value={(i+1).toString()}>{i+1}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>New Detection</Label>
                              <Select 
                                value={item.newDetection?.toString() || ""} 
                                onValueChange={(value) => updateFmeaItem(item.id, 'newDetection', parseInt(value))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.from({length: 10}, (_, i) => (
                                    <SelectItem key={i+1} value={(i+1).toString()}>{i+1}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>New RPN</Label>
                              <div className={`p-2 rounded text-center font-bold ${item.newRPN ? getRiskLevel(item.newRPN).color : 'bg-muted'}`}>
                                {item.newRPN || 'TBD'}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFmeaItem(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="summary">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{fmeaItems.length}</div>
                  <div className="text-sm text-muted-foreground">Total Items</div>
                </div>
                <div className="text-center p-4 bg-destructive/20 rounded-lg">
                  <div className="text-2xl font-bold text-destructive">{fmeaItems.filter(item => item.rpn >= 200).length}</div>
                  <div className="text-sm text-muted-foreground">High Risk</div>
                </div>
                <div className="text-center p-4 bg-warning/20 rounded-lg">
                  <div className="text-2xl font-bold text-warning">{fmeaItems.filter(item => item.rpn >= 100 && item.rpn < 200).length}</div>
                  <div className="text-sm text-muted-foreground">Medium Risk</div>
                </div>
                <div className="text-center p-4 bg-green-100 rounded-lg">
                  <div className="text-2xl font-bold text-green-800">{fmeaItems.filter(item => item.rpn < 100).length}</div>
                  <div className="text-sm text-muted-foreground">Low Risk</div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Priority Items (High Risk)</h4>
                {fmeaItems
                  .filter(item => item.rpn >= 200)
                  .sort((a, b) => b.rpn - a.rpn)
                  .map(item => (
                    <div key={item.id} className="p-4 border-l-4 border-l-destructive bg-destructive/10 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-semibold">{item.processStep}</h5>
                          <p className="text-sm text-muted-foreground">{item.potentialFailure}</p>
                          <p className="text-sm mt-1"><strong>Effect:</strong> {item.potentialEffect}</p>
                          <p className="text-sm"><strong>Recommended Action:</strong> {item.recommendedActions}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-destructive">{item.rpn}</div>
                          <div className="text-xs text-muted-foreground">S:{item.severity} O:{item.occurrence} D:{item.detection}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                
                {fmeaItems.filter(item => item.rpn >= 200).length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No high-risk items identified.</p>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="guide">
            <div className="space-y-4">
              <h4 className="font-semibold">FMEA Guide</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <h5 className="font-semibold">Severity Scale (1-10):</h5>
                  <ul className="text-sm space-y-1">
                    <li><strong>1-3:</strong> Minor effect on performance</li>
                    <li><strong>4-6:</strong> Moderate effect, some dissatisfaction</li>
                    <li><strong>7-8:</strong> High degree of customer dissatisfaction</li>
                    <li><strong>9-10:</strong> Hazardous, safety concerns</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h5 className="font-semibold">Occurrence Scale (1-10):</h5>
                  <ul className="text-sm space-y-1">
                    <li><strong>1-2:</strong> Very unlikely (&lt;0.01%)</li>
                    <li><strong>3-5:</strong> Low to moderate (0.01-1%)</li>
                    <li><strong>6-8:</strong> Moderate to high (1-5%)</li>
                    <li><strong>9-10:</strong> Very high (&gt;5%)</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h5 className="font-semibold">Detection Scale (1-10):</h5>
                  <ul className="text-sm space-y-1">
                    <li><strong>1-2:</strong> Very high detection capability</li>
                    <li><strong>3-5:</strong> High detection capability</li>
                    <li><strong>6-8:</strong> Moderate detection capability</li>
                    <li><strong>9-10:</strong> Very low detection capability</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-4 bg-muted/30 rounded-lg">
                <h5 className="font-semibold mb-2">RPN Risk Levels:</h5>
                <ul className="text-sm space-y-1">
                  <li><strong>High Risk (≥200):</strong> Immediate action required</li>
                  <li><strong>Medium Risk (100-199):</strong> Action should be taken</li>
                  <li><strong>Low Risk (&lt;100):</strong> Monitor and review</li>
                </ul>
              </div>
              
              <div className="p-4 bg-muted/30 rounded-lg">
                <h5 className="font-semibold mb-2">Excel Import Format:</h5>
                <p className="text-sm mb-2">Columns: Process Step, Failure Mode, Effect, Severity, Cause, Occurrence, Controls, Detection, Actions, Responsibility, Target Date, Actions Taken</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}