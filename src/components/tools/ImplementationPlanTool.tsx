import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ClipboardList, Save, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProject } from "@/contexts/ProjectContext";

interface ActionItem {
  id: string;
  action: string;
  owner: string;
  startDate: string;
  dueDate: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Delayed';
  priority: 'Low' | 'Medium' | 'High';
  resources: string;
  notes: string;
  percentComplete: number;
}

interface ImplementationPlanData {
  projectName: string;
  objective: string;
  startDate: string;
  targetDate: string;
  sponsor: string;
  actions: ActionItem[];
}

export function ImplementationPlanTool() {
  const { toast } = useToast();
  const { currentProject, updateToolData, getToolData } = useProject();
  
  const [data, setData] = useState<ImplementationPlanData>(() => {
    const saved = currentProject ? getToolData("implementation-plan") : null;
    return saved || {
      projectName: "",
      objective: "",
      startDate: "",
      targetDate: "",
      sponsor: "",
      actions: []
    };
  });

  const handleSave = () => {
    if (currentProject) {
      updateToolData("implementation-plan", data);
      toast({ title: "Saved", description: "Implementation plan saved successfully" });
    }
  };

  const addAction = () => {
    const newAction: ActionItem = {
      id: Date.now().toString(),
      action: "",
      owner: "",
      startDate: "",
      dueDate: "",
      status: 'Not Started',
      priority: 'Medium',
      resources: "",
      notes: "",
      percentComplete: 0
    };
    setData(prev => ({ ...prev, actions: [...prev.actions, newAction] }));
  };

  const updateAction = (id: string, field: keyof ActionItem, value: any) => {
    setData(prev => ({
      ...prev,
      actions: prev.actions.map(a => a.id === id ? { ...a, [field]: value } : a)
    }));
  };

  const removeAction = (id: string) => {
    setData(prev => ({ ...prev, actions: prev.actions.filter(a => a.id !== id) }));
  };

  // Calculate overall progress
  const overallProgress = data.actions.length > 0
    ? data.actions.reduce((sum, a) => sum + a.percentComplete, 0) / data.actions.length
    : 0;

  const statusCounts = {
    notStarted: data.actions.filter(a => a.status === 'Not Started').length,
    inProgress: data.actions.filter(a => a.status === 'In Progress').length,
    completed: data.actions.filter(a => a.status === 'Completed').length,
    delayed: data.actions.filter(a => a.status === 'Delayed').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-500';
      case 'In Progress': return 'bg-blue-500';
      case 'Delayed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-500';
      case 'Medium': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary/10">
            <ClipboardList className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle>Implementation Plan</CardTitle>
            <CardDescription>Detailed action planning for solution implementation</CardDescription>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Project Name</Label>
            <Input
              value={data.projectName}
              onChange={(e) => setData(prev => ({ ...prev, projectName: e.target.value }))}
              placeholder="Implementation project name"
            />
          </div>
          <div className="space-y-2">
            <Label>Sponsor</Label>
            <Input
              value={data.sponsor}
              onChange={(e) => setData(prev => ({ ...prev, sponsor: e.target.value }))}
              placeholder="Project sponsor"
            />
          </div>
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Input
              type="date"
              value={data.startDate}
              onChange={(e) => setData(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Target Completion</Label>
            <Input
              type="date"
              value={data.targetDate}
              onChange={(e) => setData(prev => ({ ...prev, targetDate: e.target.value }))}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Implementation Objective</Label>
            <Textarea
              value={data.objective}
              onChange={(e) => setData(prev => ({ ...prev, objective: e.target.value }))}
              placeholder="What is the goal of this implementation?"
            />
          </div>
        </div>

        {/* Progress Summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-4 text-center col-span-2 md:col-span-1">
            <div className="text-2xl font-bold text-primary">{overallProgress.toFixed(0)}%</div>
            <Progress value={overallProgress} className="h-2 mt-2" />
            <div className="text-sm text-muted-foreground mt-1">Overall</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-500">{statusCounts.notStarted}</div>
            <div className="text-sm text-muted-foreground">Not Started</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">{statusCounts.inProgress}</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">{statusCounts.completed}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-red-500">{statusCounts.delayed}</div>
            <div className="text-sm text-muted-foreground">Delayed</div>
          </Card>
        </div>

        {/* Action Items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-semibold">Action Items</Label>
            <Button onClick={addAction} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add Action
            </Button>
          </div>

          {data.actions.map((action, index) => (
            <Card key={action.id} className="p-4 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(action.status)}`} />
                  <span className="font-medium">Action {index + 1}</span>
                  <span className={`text-sm ${getPriorityColor(action.priority)}`}>
                    [{action.priority}]
                  </span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeAction(action.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label>Action Description</Label>
                  <Textarea
                    value={action.action}
                    onChange={(e) => updateAction(action.id, "action", e.target.value)}
                    placeholder="What needs to be done?"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Owner</Label>
                  <Input
                    value={action.owner}
                    onChange={(e) => updateAction(action.id, "owner", e.target.value)}
                    placeholder="Responsible person"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Resources Needed</Label>
                  <Input
                    value={action.resources}
                    onChange={(e) => updateAction(action.id, "resources", e.target.value)}
                    placeholder="Budget, tools, people..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={action.startDate}
                    onChange={(e) => updateAction(action.id, "startDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={action.dueDate}
                    onChange={(e) => updateAction(action.id, "dueDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select 
                    value={action.status} 
                    onValueChange={(v) => updateAction(action.id, "status", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Not Started">Not Started</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Delayed">Delayed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select 
                    value={action.priority} 
                    onValueChange={(v) => updateAction(action.id, "priority", v)}
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
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Progress: {action.percentComplete}%</Label>
                </div>
                <Input
                  type="range"
                  min="0"
                  max="100"
                  value={action.percentComplete}
                  onChange={(e) => updateAction(action.id, "percentComplete", parseInt(e.target.value))}
                  className="w-full"
                />
                <Progress value={action.percentComplete} className="h-2" />
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={action.notes}
                  onChange={(e) => updateAction(action.id, "notes", e.target.value)}
                  placeholder="Additional notes, updates, blockers..."
                />
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
