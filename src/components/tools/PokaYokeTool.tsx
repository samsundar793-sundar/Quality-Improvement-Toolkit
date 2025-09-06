import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Shield, Download, RotateCcw, Plus, X, Upload, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as XLSX from "xlsx";

interface PokaYokeItem {
  id: string;
  processStep: string;
  potentialError: string;
  errorType: "Prevention" | "Detection";
  mechanism: string;
  implementation: string;
  status: "Planned" | "In Progress" | "Implemented" | "Tested";
  effectiveness: "Low" | "Medium" | "High";
  cost: "Low" | "Medium" | "High";
  priority: "Low" | "Medium" | "High" | "Critical";
  responsible: string;
  dueDate: string;
  notes: string;
}

export function PokaYokeTool() {
  const { toast } = useToast();
  const [items, setItems] = useState<PokaYokeItem[]>([
    {
      id: "1",
      processStep: "Material Loading",
      potentialError: "Wrong material type",
      errorType: "Prevention",
      mechanism: "Color-coded bins",
      implementation: "Install different colored bins for each material type",
      status: "Implemented",
      effectiveness: "High",
      cost: "Low",
      priority: "High",
      responsible: "Operations Team",
      dueDate: "2024-03-15",
      notes: "Successfully reduced material mix-ups by 95%"
    },
    {
      id: "2",
      processStep: "Quality Check",
      potentialError: "Missing inspection",
      errorType: "Detection",
      mechanism: "Mandatory checklist",
      implementation: "Digital checklist that must be completed before proceeding",
      status: "In Progress",
      effectiveness: "Medium",
      cost: "Medium",
      priority: "High",
      responsible: "Quality Team",
      dueDate: "2024-04-01",
      notes: "Developing digital checklist interface"
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
          const newItems: PokaYokeItem[] = [];
          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i] as any[];
            if (row[0] && row[1]) {
              newItems.push({
                id: i.toString(),
                processStep: row[0]?.toString() || "",
                potentialError: row[1]?.toString() || "",
                errorType: (row[2]?.toString() as any) || "Prevention",
                mechanism: row[3]?.toString() || "",
                implementation: row[4]?.toString() || "",
                status: (row[5]?.toString() as any) || "Planned",
                effectiveness: (row[6]?.toString() as any) || "Medium",
                cost: (row[7]?.toString() as any) || "Medium",
                priority: (row[8]?.toString() as any) || "Medium",
                responsible: row[9]?.toString() || "",
                dueDate: row[10]?.toString() || "",
                notes: row[11]?.toString() || ""
              });
            }
          }
          
          setItems(newItems);
          toast({
            title: "Excel Data Imported",
            description: `Imported ${newItems.length} Poka-Yoke items.`
          });
        }
      } catch (error) {
        toast({
          title: "Import Error",
          description: "Failed to parse Excel file. Please check the format.",
          variant: "destructive"
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const addItem = () => {
    const newItem: PokaYokeItem = {
      id: Date.now().toString(),
      processStep: "",
      potentialError: "",
      errorType: "Prevention",
      mechanism: "",
      implementation: "",
      status: "Planned",
      effectiveness: "Medium",
      cost: "Medium",
      priority: "Medium",
      responsible: "",
      dueDate: "",
      notes: ""
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof PokaYokeItem, value: any) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const exportResults = () => {
    const results = `
POKA-YOKE CHECKLIST
==================

SUMMARY:
Total Items: ${items.length}
Implemented: ${items.filter(i => i.status === 'Implemented').length}
In Progress: ${items.filter(i => i.status === 'In Progress').length}
Planned: ${items.filter(i => i.status === 'Planned').length}
Critical Priority: ${items.filter(i => i.priority === 'Critical').length}

DETAILED CHECKLIST:
${items.map((item, index) => `
${index + 1}. Process Step: ${item.processStep}
   Potential Error: ${item.potentialError}
   Error Type: ${item.errorType}
   Mechanism: ${item.mechanism}
   Implementation: ${item.implementation}
   Status: ${item.status}
   Effectiveness: ${item.effectiveness}
   Cost: ${item.cost}
   Priority: ${item.priority}
   Responsible: ${item.responsible}
   Due Date: ${item.dueDate}
   Notes: ${item.notes}
   
   □ Planning Complete
   □ Resources Allocated
   □ Implementation Started
   □ Testing Complete
   □ Training Completed
   □ Documentation Updated
   □ Effectiveness Verified
`).join('')}

HIGH PRIORITY ITEMS:
${items.filter(i => i.priority === 'Critical' || i.priority === 'High').map(item => `
• ${item.processStep}: ${item.potentialError}
  Mechanism: ${item.mechanism}
  Status: ${item.status}
  Due: ${item.dueDate}
`).join('')}

Analysis Date: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([results], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `poka-yoke-checklist-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setItems([
      {
        id: "1",
        processStep: "Material Loading",
        potentialError: "Wrong material type",
        errorType: "Prevention",
        mechanism: "Color-coded bins",
        implementation: "Install different colored bins for each material type",
        status: "Implemented",
        effectiveness: "High",
        cost: "Low",
        priority: "High",
        responsible: "Operations Team",
        dueDate: "2024-03-15",
        notes: "Successfully reduced material mix-ups by 95%"
      },
      {
        id: "2",
        processStep: "Quality Check",
        potentialError: "Missing inspection",
        errorType: "Detection",
        mechanism: "Mandatory checklist",
        implementation: "Digital checklist that must be completed before proceeding",
        status: "In Progress",
        effectiveness: "Medium",
        cost: "Medium",
        priority: "High",
        responsible: "Quality Team",
        dueDate: "2024-04-01",
        notes: "Developing digital checklist interface"
      }
    ]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Implemented": return "bg-green-100 text-green-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Tested": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "bg-red-100 text-red-800";
      case "High": return "bg-orange-100 text-orange-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getEffectivenessColor = (effectiveness: string) => {
    switch (effectiveness) {
      case "High": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      default: return "bg-red-100 text-red-800";
    }
  };

  return (
    <Card className="card-professional">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <CardTitle>Poka-Yoke Checklist (Mistake-Proofing)</CardTitle>
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
        <Tabs defaultValue="checklist" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="checklist">Checklist</TabsTrigger>
            <TabsTrigger value="add">Add Item</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="guide">Guide</TabsTrigger>
          </TabsList>
          
          <TabsContent value="checklist" className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">Mistake-Proofing Items</h4>
              <Button onClick={addItem} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
            
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h5 className="font-medium">{item.processStep}</h5>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <strong>Error:</strong> {item.potentialError}
                      </p>
                      <p className="text-sm">
                        <strong>Mechanism:</strong> {item.mechanism}
                      </p>
                      <p className="text-sm">
                        <strong>Implementation:</strong> {item.implementation}
                      </p>
                      <div className="flex gap-4 text-sm">
                        <span>Type: <Badge variant="outline">{item.errorType}</Badge></span>
                        <span>Effectiveness: <Badge className={getEffectivenessColor(item.effectiveness)}>{item.effectiveness}</Badge></span>
                        <span>Cost: <Badge variant="outline">{item.cost}</Badge></span>
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>Responsible: {item.responsible}</span>
                        <span>Due: {item.dueDate}</span>
                      </div>
                      {item.notes && (
                        <p className="text-sm bg-muted/30 p-2 rounded">
                          <strong>Notes:</strong> {item.notes}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="add" className="space-y-4">
            <h4 className="font-semibold">Add New Poka-Yoke Item</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Process Step</Label>
                <Input placeholder="Enter process step name" />
              </div>
              <div>
                <Label>Potential Error</Label>
                <Input placeholder="Describe the potential error" />
              </div>
              <div>
                <Label>Error Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select error type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Prevention">Prevention</SelectItem>
                    <SelectItem value="Detection">Detection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Mechanism</Label>
                <Input placeholder="Describe the mistake-proofing mechanism" />
              </div>
              <div className="md:col-span-2">
                <Label>Implementation</Label>
                <Textarea placeholder="Detail how this will be implemented" />
              </div>
              <div>
                <Label>Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planned">Planned</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Implemented">Implemented</SelectItem>
                    <SelectItem value="Tested">Tested</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
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
                <Label>Responsible Person</Label>
                <Input placeholder="Who is responsible for implementation" />
              </div>
              <div>
                <Label>Due Date</Label>
                <Input type="date" />
              </div>
            </div>
            <Button onClick={addItem}>Add Item</Button>
          </TabsContent>
          
          <TabsContent value="dashboard" className="space-y-4">
            <h4 className="font-semibold">Implementation Dashboard</h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{items.length}</div>
                <div className="text-sm text-blue-600">Total Items</div>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">
                  {items.filter(i => i.status === 'Implemented').length}
                </div>
                <div className="text-sm text-green-600">Implemented</div>
              </div>
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {items.filter(i => i.status === 'In Progress').length}
                </div>
                <div className="text-sm text-orange-600">In Progress</div>
              </div>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-600">
                  {items.filter(i => i.priority === 'Critical').length}
                </div>
                <div className="text-sm text-red-600">Critical</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h5 className="font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                High Priority Items
              </h5>
              {items.filter(i => i.priority === 'Critical' || i.priority === 'High').map(item => (
                <div key={item.id} className="p-3 border-l-4 border-red-500 bg-red-50">
                  <div className="font-medium">{item.processStep}</div>
                  <div className="text-sm text-muted-foreground">{item.potentialError}</div>
                  <div className="flex gap-2 mt-1">
                    <Badge className={getPriorityColor(item.priority)}>{item.priority}</Badge>
                    <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="guide" className="space-y-4">
            <h4 className="font-semibold">Poka-Yoke Guide</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h5 className="font-semibold text-blue-800">Prevention Type</h5>
                  <p className="text-sm text-blue-600">Prevents errors from occurring in the first place</p>
                  <p className="text-xs text-blue-500 mt-1">Examples: Physical constraints, guides, fixtures</p>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <h5 className="font-semibold text-green-800">Detection Type</h5>
                  <p className="text-sm text-green-600">Detects errors when they occur</p>
                  <p className="text-xs text-green-500 mt-1">Examples: Sensors, alarms, checklists</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <h5 className="font-semibold text-purple-800">Implementation Steps</h5>
                  <ol className="text-sm text-purple-600 list-decimal list-inside space-y-1">
                    <li>Identify potential errors</li>
                    <li>Analyze root causes</li>
                    <li>Design mistake-proofing method</li>
                    <li>Implement and test</li>
                    <li>Train staff</li>
                    <li>Monitor effectiveness</li>
                  </ol>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-muted/30 rounded-lg">
              <h5 className="font-semibold mb-2">Excel Import Format:</h5>
              <p className="text-sm mb-2">Columns: Process Step, Potential Error, Error Type, Mechanism, Implementation, Status, Effectiveness, Cost, Priority, Responsible, Due Date, Notes</p>
              <div className="text-xs font-mono bg-background p-2 rounded">
                Process Step | Potential Error | Error Type | Mechanism | Implementation | Status | Effectiveness | Cost | Priority | Responsible | Due Date | Notes
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}