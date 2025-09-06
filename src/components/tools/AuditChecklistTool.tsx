import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, Download, RotateCcw, Plus, X, Upload, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as XLSX from "xlsx";

interface ChecklistItem {
  id: string;
  category: string;
  item: string;
  description: string;
  compliance: "Compliant" | "Non-Compliant" | "Not Applicable" | "Pending";
  severity: "Low" | "Medium" | "High" | "Critical";
  evidence: string;
  corrective_action: string;
  responsible: string;
  due_date: string;
  notes: string;
}

interface AuditTemplate {
  name: string;
  description: string;
  items: Omit<ChecklistItem, 'id' | 'compliance' | 'evidence' | 'corrective_action' | 'responsible' | 'due_date' | 'notes'>[];
}

export function AuditChecklistTool() {
  const { toast } = useToast();
  const [items, setItems] = useState<ChecklistItem[]>([
    {
      id: "1",
      category: "Process Documentation",
      item: "Standard Operating Procedures",
      description: "All critical processes have documented SOPs",
      compliance: "Compliant",
      severity: "High",
      evidence: "SOPs reviewed and current",
      corrective_action: "",
      responsible: "",
      due_date: "",
      notes: "All SOPs updated within last 6 months"
    },
    {
      id: "2",
      category: "Quality Control",
      item: "Calibration Records",
      description: "All measurement equipment properly calibrated",
      compliance: "Non-Compliant",
      severity: "Critical",
      evidence: "2 instruments overdue for calibration",
      corrective_action: "Schedule immediate calibration",
      responsible: "Maintenance Team",
      due_date: "2024-03-20",
      notes: "Equipment #A1023 and #B4056 require attention"
    }
  ]);

  const [auditInfo, setAuditInfo] = useState({
    title: "Process Audit",
    auditor: "",
    date: new Date().toISOString().split('T')[0],
    scope: "",
    objective: ""
  });

  const templates: AuditTemplate[] = [
    {
      name: "ISO 9001 Quality Management",
      description: "Basic ISO 9001 compliance checklist",
      items: [
        { category: "Documentation", item: "Quality Manual", description: "Quality manual is current and accessible", severity: "High" },
        { category: "Documentation", item: "Process Documentation", description: "Key processes are documented", severity: "High" },
        { category: "Training", item: "Staff Competency", description: "Staff training records are maintained", severity: "Medium" },
        { category: "Measurement", item: "Calibration", description: "Equipment calibration is current", severity: "Critical" }
      ]
    },
    {
      name: "5S Workplace Organization",
      description: "5S implementation audit",
      items: [
        { category: "Sort", item: "Unnecessary Items", description: "Unnecessary items removed from workspace", severity: "Medium" },
        { category: "Set in Order", item: "Organization", description: "Everything has a designated place", severity: "Medium" },
        { category: "Shine", item: "Cleanliness", description: "Work area is clean and maintained", severity: "Medium" },
        { category: "Standardize", item: "Standards", description: "Standard procedures are established", severity: "High" },
        { category: "Sustain", item: "Discipline", description: "5S practices are consistently followed", severity: "High" }
      ]
    },
    {
      name: "Safety Compliance",
      description: "General safety compliance checklist",
      items: [
        { category: "PPE", item: "Personal Protective Equipment", description: "Required PPE is available and used", severity: "Critical" },
        { category: "Emergency", item: "Emergency Procedures", description: "Emergency exits are clear and marked", severity: "Critical" },
        { category: "Training", item: "Safety Training", description: "Safety training is current", severity: "High" },
        { category: "Equipment", item: "Safety Equipment", description: "Safety equipment is functional", severity: "Critical" }
      ]
    }
  ];

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
          const newItems: ChecklistItem[] = [];
          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i] as any[];
            if (row[0] && row[1]) {
              newItems.push({
                id: i.toString(),
                category: row[0]?.toString() || "",
                item: row[1]?.toString() || "",
                description: row[2]?.toString() || "",
                compliance: (row[3]?.toString() as any) || "Pending",
                severity: (row[4]?.toString() as any) || "Medium",
                evidence: row[5]?.toString() || "",
                corrective_action: row[6]?.toString() || "",
                responsible: row[7]?.toString() || "",
                due_date: row[8]?.toString() || "",
                notes: row[9]?.toString() || ""
              });
            }
          }
          
          setItems(newItems);
          toast({
            title: "Excel Data Imported",
            description: `Imported ${newItems.length} checklist items.`
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

  const loadTemplate = (template: AuditTemplate) => {
    const newItems: ChecklistItem[] = template.items.map((item, index) => ({
      id: Date.now().toString() + index,
      ...item,
      compliance: "Pending" as const,
      evidence: "",
      corrective_action: "",
      responsible: "",
      due_date: "",
      notes: ""
    }));
    
    setItems(newItems);
    setAuditInfo(prev => ({ ...prev, title: template.name }));
    
    toast({
      title: "Template Loaded",
      description: `Loaded ${template.name} template with ${newItems.length} items.`
    });
  };

  const addItem = () => {
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      category: "",
      item: "",
      description: "",
      compliance: "Pending",
      severity: "Medium",
      evidence: "",
      corrective_action: "",
      responsible: "",
      due_date: "",
      notes: ""
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof ChecklistItem, value: any) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const exportResults = () => {
    const compliance = items.filter(i => i.compliance === 'Compliant').length;
    const nonCompliance = items.filter(i => i.compliance === 'Non-Compliant').length;
    const pending = items.filter(i => i.compliance === 'Pending').length;
    const complianceRate = (compliance / (compliance + nonCompliance)) * 100;

    const results = `
AUDIT CHECKLIST REPORT
=====================

AUDIT INFORMATION:
Title: ${auditInfo.title}
Auditor: ${auditInfo.auditor}
Date: ${auditInfo.date}
Scope: ${auditInfo.scope}
Objective: ${auditInfo.objective}

SUMMARY:
Total Items: ${items.length}
Compliant: ${compliance}
Non-Compliant: ${nonCompliance}
Pending: ${pending}
Not Applicable: ${items.filter(i => i.compliance === 'Not Applicable').length}
Compliance Rate: ${complianceRate.toFixed(1)}%

CRITICAL NON-COMPLIANCE ITEMS:
${items.filter(i => i.compliance === 'Non-Compliant' && i.severity === 'Critical').map(item => `
• ${item.item} (${item.category})
  Issue: ${item.description}
  Evidence: ${item.evidence}
  Corrective Action: ${item.corrective_action}
  Responsible: ${item.responsible}
  Due Date: ${item.due_date}
`).join('')}

DETAILED CHECKLIST:
${items.map((item, index) => `
${index + 1}. Category: ${item.category}
   Item: ${item.item}
   Description: ${item.description}
   Compliance: ${item.compliance}
   Severity: ${item.severity}
   Evidence: ${item.evidence}
   Corrective Action: ${item.corrective_action}
   Responsible: ${item.responsible}
   Due Date: ${item.due_date}
   Notes: ${item.notes}
`).join('')}

CORRECTIVE ACTION PLAN:
${items.filter(i => i.compliance === 'Non-Compliant' && i.corrective_action).map(item => `
• ${item.item}
  Action: ${item.corrective_action}
  Responsible: ${item.responsible}
  Due: ${item.due_date}
  Priority: ${item.severity}
`).join('')}

Report Generated: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([results], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-checklist-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setItems([
      {
        id: "1",
        category: "Process Documentation",
        item: "Standard Operating Procedures",
        description: "All critical processes have documented SOPs",
        compliance: "Compliant",
        severity: "High",
        evidence: "SOPs reviewed and current",
        corrective_action: "",
        responsible: "",
        due_date: "",
        notes: "All SOPs updated within last 6 months"
      },
      {
        id: "2",
        category: "Quality Control",
        item: "Calibration Records",
        description: "All measurement equipment properly calibrated",
        compliance: "Non-Compliant",
        severity: "Critical",
        evidence: "2 instruments overdue for calibration",
        corrective_action: "Schedule immediate calibration",
        responsible: "Maintenance Team",
        due_date: "2024-03-20",
        notes: "Equipment #A1023 and #B4056 require attention"
      }
    ]);
    setAuditInfo({
      title: "Process Audit",
      auditor: "",
      date: new Date().toISOString().split('T')[0],
      scope: "",
      objective: ""
    });
  };

  const getComplianceIcon = (compliance: string) => {
    switch (compliance) {
      case "Compliant": return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "Non-Compliant": return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "Pending": return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const getComplianceColor = (compliance: string) => {
    switch (compliance) {
      case "Compliant": return "bg-green-100 text-green-800";
      case "Non-Compliant": return "bg-red-100 text-red-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "bg-red-100 text-red-800";
      case "High": return "bg-orange-100 text-orange-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const compliance = items.filter(i => i.compliance === 'Compliant').length;
  const nonCompliance = items.filter(i => i.compliance === 'Non-Compliant').length;
  const complianceRate = items.length > 0 ? (compliance / (compliance + nonCompliance)) * 100 : 0;

  return (
    <Card className="card-professional">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ClipboardCheck className="h-6 w-6 text-primary" />
            <CardTitle>Audit Checklist Generator</CardTitle>
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
              Export Report
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="audit" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="audit">Audit Info</TabsTrigger>
            <TabsTrigger value="checklist">Checklist</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="guide">Guide</TabsTrigger>
          </TabsList>
          
          <TabsContent value="audit" className="space-y-4">
            <h4 className="font-semibold">Audit Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Audit Title</Label>
                <Input
                  id="title"
                  value={auditInfo.title}
                  onChange={(e) => setAuditInfo(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter audit title"
                />
              </div>
              <div>
                <Label htmlFor="auditor">Auditor</Label>
                <Input
                  id="auditor"
                  value={auditInfo.auditor}
                  onChange={(e) => setAuditInfo(prev => ({ ...prev, auditor: e.target.value }))}
                  placeholder="Enter auditor name"
                />
              </div>
              <div>
                <Label htmlFor="date">Audit Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={auditInfo.date}
                  onChange={(e) => setAuditInfo(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="scope">Scope</Label>
                <Input
                  id="scope"
                  value={auditInfo.scope}
                  onChange={(e) => setAuditInfo(prev => ({ ...prev, scope: e.target.value }))}
                  placeholder="Define audit scope"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="objective">Objective</Label>
                <Textarea
                  id="objective"
                  value={auditInfo.objective}
                  onChange={(e) => setAuditInfo(prev => ({ ...prev, objective: e.target.value }))}
                  placeholder="Describe audit objectives"
                  className="bg-background text-foreground"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="checklist" className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">Audit Checklist Items</h4>
              <Button onClick={addItem} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
            
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="p-4 border rounded-lg space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label>Category</Label>
                      <Input
                        value={item.category}
                        onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                        placeholder="Category"
                      />
                    </div>
                    <div>
                      <Label>Item</Label>
                      <Input
                        value={item.item}
                        onChange={(e) => updateItem(item.id, 'item', e.target.value)}
                        placeholder="Checklist item"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder="Detailed description"
                      className="bg-background text-foreground"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <Label>Compliance</Label>
                      <Select
                        value={item.compliance}
                        onValueChange={(value) => updateItem(item.id, 'compliance', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Compliant">Compliant</SelectItem>
                          <SelectItem value="Non-Compliant">Non-Compliant</SelectItem>
                          <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Severity</Label>
                      <Select
                        value={item.severity}
                        onValueChange={(value) => updateItem(item.id, 'severity', value)}
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
                      <Label>Responsible</Label>
                      <Input
                        value={item.responsible}
                        onChange={(e) => updateItem(item.id, 'responsible', e.target.value)}
                        placeholder="Responsible person"
                      />
                    </div>
                    <div>
                      <Label>Due Date</Label>
                      <Input
                        type="date"
                        value={item.due_date}
                        onChange={(e) => updateItem(item.id, 'due_date', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label>Evidence</Label>
                      <Textarea
                        value={item.evidence}
                        onChange={(e) => updateItem(item.id, 'evidence', e.target.value)}
                        placeholder="Evidence of compliance/non-compliance"
                        className="bg-background text-foreground"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label>Corrective Action</Label>
                      <Textarea
                        value={item.corrective_action}
                        onChange={(e) => updateItem(item.id, 'corrective_action', e.target.value)}
                        placeholder="Required corrective actions"
                        className="bg-background text-foreground"
                        rows={2}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Notes</Label>
                    <Textarea
                      value={item.notes}
                      onChange={(e) => updateItem(item.id, 'notes', e.target.value)}
                      placeholder="Additional notes"
                      className="bg-background text-foreground"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-4">
            <h4 className="font-semibold">Audit Templates</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">{template.name}</h5>
                  <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    {template.items.length} items
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadTemplate(template)}
                    className="w-full"
                  >
                    Load Template
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="dashboard" className="space-y-4">
            <h4 className="font-semibold">Audit Dashboard</h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{items.length}</div>
                <div className="text-sm text-blue-600">Total Items</div>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{compliance}</div>
                <div className="text-sm text-green-600">Compliant</div>
              </div>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-600">{nonCompliance}</div>
                <div className="text-sm text-red-600">Non-Compliant</div>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">{complianceRate.toFixed(1)}%</div>
                <div className="text-sm text-purple-600">Compliance Rate</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h5 className="font-medium">Critical Non-Compliance Items</h5>
              {items.filter(i => i.compliance === 'Non-Compliant' && i.severity === 'Critical').map(item => (
                <div key={item.id} className="p-3 border-l-4 border-red-500 bg-red-50">
                  <div className="flex items-center gap-2">
                    {getComplianceIcon(item.compliance)}
                    <span className="font-medium">{item.item}</span>
                    <Badge className={getSeverityColor(item.severity)}>{item.severity}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{item.description}</div>
                  {item.corrective_action && (
                    <div className="text-sm mt-2">
                      <strong>Action:</strong> {item.corrective_action}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="guide" className="space-y-4">
            <h4 className="font-semibold">Audit Checklist Guide</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <h5 className="font-semibold text-green-800">Compliant</h5>
                  <p className="text-sm text-green-600">Item meets all requirements</p>
                </div>
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <h5 className="font-semibold text-red-800">Non-Compliant</h5>
                  <p className="text-sm text-red-600">Item does not meet requirements</p>
                </div>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h5 className="font-semibold text-yellow-800">Pending</h5>
                  <p className="text-sm text-yellow-600">Assessment not yet completed</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <h5 className="font-semibold text-gray-800">Not Applicable</h5>
                  <p className="text-sm text-gray-600">Item does not apply to this audit</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <h5 className="font-semibold text-purple-800">Severity Levels</h5>
                  <ul className="text-sm text-purple-600 space-y-1">
                    <li><strong>Critical:</strong> Immediate action required</li>
                    <li><strong>High:</strong> Action required within 30 days</li>
                    <li><strong>Medium:</strong> Action required within 90 days</li>
                    <li><strong>Low:</strong> Monitor and improve when possible</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-muted/30 rounded-lg">
              <h5 className="font-semibold mb-2">Excel Import Format:</h5>
              <p className="text-sm mb-2">Columns: Category, Item, Description, Compliance, Severity, Evidence, Corrective Action, Responsible, Due Date, Notes</p>
              <div className="text-xs font-mono bg-background p-2 rounded">
                Category | Item | Description | Compliance | Severity | Evidence | Corrective Action | Responsible | Due Date | Notes
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}