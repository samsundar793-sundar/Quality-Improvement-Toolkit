import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Repeat, Download, RotateCcw, Plus, X, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HandoffItem {
  id: string;
  category: string;
  item: string;
  description: string;
  responsible: string;
  dueDate: string;
  completed: boolean;
}

interface TrainingItem {
  id: string;
  topic: string;
  audience: string;
  trainer: string;
  date: string;
  completed: boolean;
}

export function HandoffPlanTool() {
  const { toast } = useToast();
  const [projectInfo, setProjectInfo] = useState({
    projectName: "",
    projectLead: "",
    processOwner: "",
    handoffDate: "",
    summary: ""
  });

  const [handoffItems, setHandoffItems] = useState<HandoffItem[]>([
    {
      id: "1",
      category: "Documentation",
      item: "Control Plan",
      description: "Updated control plan with all control points and response plans",
      responsible: "",
      dueDate: "",
      completed: false
    },
    {
      id: "2",
      category: "Documentation",
      item: "Standard Operating Procedures",
      description: "All SOPs updated to reflect new process",
      responsible: "",
      dueDate: "",
      completed: false
    },
    {
      id: "3",
      category: "Training",
      item: "Operator Training",
      description: "All operators trained on new process",
      responsible: "",
      dueDate: "",
      completed: false
    },
    {
      id: "4",
      category: "Systems",
      item: "Monitoring Dashboard",
      description: "Dashboard configured and accessible to process owner",
      responsible: "",
      dueDate: "",
      completed: false
    }
  ]);

  const [trainingItems, setTrainingItems] = useState<TrainingItem[]>([
    {
      id: "1",
      topic: "New Process Overview",
      audience: "All operators",
      trainer: "",
      date: "",
      completed: false
    }
  ]);

  const [keyContacts, setKeyContacts] = useState<{ id: string; role: string; name: string; contact: string }[]>([
    { id: "1", role: "Process Owner", name: "", contact: "" },
    { id: "2", role: "Technical Support", name: "", contact: "" },
    { id: "3", role: "Quality Lead", name: "", contact: "" }
  ]);

  const addHandoffItem = () => {
    setHandoffItems([...handoffItems, {
      id: Date.now().toString(),
      category: "Other",
      item: "",
      description: "",
      responsible: "",
      dueDate: "",
      completed: false
    }]);
  };

  const updateHandoffItem = (id: string, field: keyof HandoffItem, value: any) => {
    setHandoffItems(handoffItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeHandoffItem = (id: string) => {
    setHandoffItems(handoffItems.filter(item => item.id !== id));
  };

  const addTrainingItem = () => {
    setTrainingItems([...trainingItems, {
      id: Date.now().toString(),
      topic: "",
      audience: "",
      trainer: "",
      date: "",
      completed: false
    }]);
  };

  const updateTrainingItem = (id: string, field: keyof TrainingItem, value: any) => {
    setTrainingItems(trainingItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeTrainingItem = (id: string) => {
    setTrainingItems(trainingItems.filter(item => item.id !== id));
  };

  const addContact = () => {
    setKeyContacts([...keyContacts, {
      id: Date.now().toString(),
      role: "",
      name: "",
      contact: ""
    }]);
  };

  const updateContact = (id: string, field: string, value: string) => {
    setKeyContacts(keyContacts.map(c =>
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const removeContact = (id: string) => {
    setKeyContacts(keyContacts.filter(c => c.id !== id));
  };

  const completionPercentage = () => {
    const total = handoffItems.length + trainingItems.length;
    if (total === 0) return 0;
    const completed = handoffItems.filter(i => i.completed).length +
                      trainingItems.filter(i => i.completed).length;
    return Math.round((completed / total) * 100);
  };

  const exportPlan = () => {
    const exportData = `
HANDOFF PLAN
============

PROJECT INFORMATION
-------------------
Project Name: ${projectInfo.projectName || "Not specified"}
Project Lead: ${projectInfo.projectLead || "Not specified"}
Process Owner: ${projectInfo.processOwner || "Not specified"}
Handoff Date: ${projectInfo.handoffDate || "Not specified"}

Summary:
${projectInfo.summary || "Not specified"}

Completion Status: ${completionPercentage()}%

${"=".repeat(60)}

HANDOFF CHECKLIST
-----------------
${handoffItems.map((item, i) => `
${i + 1}. [${item.completed ? 'X' : ' '}] ${item.item}
   Category: ${item.category}
   Description: ${item.description}
   Responsible: ${item.responsible}
   Due Date: ${item.dueDate}`).join('\n')}

${"=".repeat(60)}

TRAINING PLAN
-------------
${trainingItems.map((item, i) => `
${i + 1}. [${item.completed ? 'X' : ' '}] ${item.topic}
   Audience: ${item.audience}
   Trainer: ${item.trainer}
   Date: ${item.date}`).join('\n')}

${"=".repeat(60)}

KEY CONTACTS
------------
${keyContacts.map(c => `${c.role}: ${c.name} (${c.contact})`).join('\n')}

Generated: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `handoff-plan-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setProjectInfo({ projectName: "", projectLead: "", processOwner: "", handoffDate: "", summary: "" });
    setHandoffItems([]);
    setTrainingItems([]);
    setKeyContacts([]);
  };

  const categories = [...new Set(handoffItems.map(i => i.category))];

  return (
    <Card className="card-professional">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Repeat className="h-6 w-6 text-primary" />
            <CardTitle>Handoff Plan</CardTitle>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">Completion:</div>
              <Badge variant={completionPercentage() === 100 ? "default" : "secondary"}>
                {completionPercentage()}%
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={reset}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button variant="analytics" onClick={exportPlan}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="checklist">Checklist</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Project Name</Label>
                <Input
                  value={projectInfo.projectName}
                  onChange={(e) => setProjectInfo({ ...projectInfo, projectName: e.target.value })}
                  placeholder="Project name"
                />
              </div>
              <div>
                <Label>Handoff Date</Label>
                <Input
                  type="date"
                  value={projectInfo.handoffDate}
                  onChange={(e) => setProjectInfo({ ...projectInfo, handoffDate: e.target.value })}
                />
              </div>
              <div>
                <Label>Project Lead</Label>
                <Input
                  value={projectInfo.projectLead}
                  onChange={(e) => setProjectInfo({ ...projectInfo, projectLead: e.target.value })}
                  placeholder="Who led the improvement project"
                />
              </div>
              <div>
                <Label>Process Owner</Label>
                <Input
                  value={projectInfo.processOwner}
                  onChange={(e) => setProjectInfo({ ...projectInfo, processOwner: e.target.value })}
                  placeholder="Who will own the process going forward"
                />
              </div>
            </div>
            <div>
              <Label>Project Summary</Label>
              <Textarea
                value={projectInfo.summary}
                onChange={(e) => setProjectInfo({ ...projectInfo, summary: e.target.value })}
                placeholder="Brief summary of what was accomplished and key changes made"
                rows={4}
              />
            </div>

            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">{handoffItems.length}</div>
                    <div className="text-sm text-muted-foreground">Checklist Items</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-500">
                      {handoffItems.filter(i => i.completed).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{trainingItems.length}</div>
                    <div className="text-sm text-muted-foreground">Training Sessions</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-500">
                      {trainingItems.filter(i => i.completed).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="checklist" className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-lg font-semibold">Handoff Checklist</Label>
              <Button variant="outline" onClick={addHandoffItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            {categories.map(category => (
              <div key={category} className="space-y-2">
                <h4 className="font-medium text-muted-foreground">{category}</h4>
                {handoffItems.filter(i => i.category === category).map(item => (
                  <div key={item.id} className="flex items-start gap-3 p-3 border border-border rounded-lg">
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={(checked) => updateHandoffItem(item.id, 'completed', checked)}
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Input
                          value={item.item}
                          onChange={(e) => updateHandoffItem(item.id, 'item', e.target.value)}
                          placeholder="Item name"
                          className={item.completed ? "line-through text-muted-foreground" : ""}
                        />
                        {item.completed && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                      </div>
                      <Textarea
                        value={item.description}
                        onChange={(e) => updateHandoffItem(item.id, 'description', e.target.value)}
                        placeholder="Description"
                        rows={2}
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          value={item.category}
                          onChange={(e) => updateHandoffItem(item.id, 'category', e.target.value)}
                          placeholder="Category"
                        />
                        <Input
                          value={item.responsible}
                          onChange={(e) => updateHandoffItem(item.id, 'responsible', e.target.value)}
                          placeholder="Responsible"
                        />
                        <Input
                          type="date"
                          value={item.dueDate}
                          onChange={(e) => updateHandoffItem(item.id, 'dueDate', e.target.value)}
                        />
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeHandoffItem(item.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="training" className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-lg font-semibold">Training Plan</Label>
              <Button variant="outline" onClick={addTrainingItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add Training
              </Button>
            </div>

            <div className="space-y-3">
              {trainingItems.map(item => (
                <div key={item.id} className="flex items-start gap-3 p-4 border border-border rounded-lg">
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={(checked) => updateTrainingItem(item.id, 'completed', checked)}
                  />
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <Label className="text-xs">Topic</Label>
                      <Input
                        value={item.topic}
                        onChange={(e) => updateTrainingItem(item.id, 'topic', e.target.value)}
                        placeholder="Training topic"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Audience</Label>
                      <Input
                        value={item.audience}
                        onChange={(e) => updateTrainingItem(item.id, 'audience', e.target.value)}
                        placeholder="Who needs training"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Trainer</Label>
                      <Input
                        value={item.trainer}
                        onChange={(e) => updateTrainingItem(item.id, 'trainer', e.target.value)}
                        placeholder="Who will train"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Date</Label>
                      <Input
                        type="date"
                        value={item.date}
                        onChange={(e) => updateTrainingItem(item.id, 'date', e.target.value)}
                      />
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeTrainingItem(item.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-lg font-semibold">Key Contacts</Label>
              <Button variant="outline" onClick={addContact}>
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </div>

            <div className="space-y-3">
              {keyContacts.map(contact => (
                <div key={contact.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 border border-border rounded-lg items-end">
                  <div>
                    <Label className="text-xs">Role</Label>
                    <Input
                      value={contact.role}
                      onChange={(e) => updateContact(contact.id, 'role', e.target.value)}
                      placeholder="Role/Title"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Name</Label>
                    <Input
                      value={contact.name}
                      onChange={(e) => updateContact(contact.id, 'name', e.target.value)}
                      placeholder="Contact name"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Contact Info</Label>
                    <Input
                      value={contact.contact}
                      onChange={(e) => updateContact(contact.id, 'contact', e.target.value)}
                      placeholder="Email or phone"
                    />
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeContact(contact.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
