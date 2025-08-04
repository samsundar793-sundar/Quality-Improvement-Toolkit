import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RotateCcw, Download, Plus, Trash2, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface KaizenAction {
  id: string;
  description: string;
  category: string;
  priority: string;
  effort: string;
  impact: string;
  responsible: string;
  deadline: string;
  status: string;
  notes: string;
}

interface KaizenEvent {
  title: string;
  area: string;
  currentState: string;
  targetState: string;
  benefits: string;
  actions: KaizenAction[];
}

export function KaizenTool() {
  const { toast } = useToast();
  const [event, setEvent] = useState<KaizenEvent>({
    title: "",
    area: "",
    currentState: "",
    targetState: "",
    benefits: "",
    actions: []
  });

  const addAction = () => {
    const newAction: KaizenAction = {
      id: Date.now().toString(),
      description: "",
      category: "process",
      priority: "medium",
      effort: "medium",
      impact: "medium",
      responsible: "",
      deadline: "",
      status: "not-started",
      notes: ""
    };
    
    setEvent(prev => ({
      ...prev,
      actions: [...prev.actions, newAction]
    }));
  };

  const removeAction = (id: string) => {
    setEvent(prev => ({
      ...prev,
      actions: prev.actions.filter(action => action.id !== id)
    }));
  };

  const updateAction = (id: string, field: keyof KaizenAction, value: string) => {
    setEvent(prev => ({
      ...prev,
      actions: prev.actions.map(action =>
        action.id === id ? { ...action, [field]: value } : action
      )
    }));
  };

  const loadTemplate = () => {
    setEvent({
      title: "Reduce Setup Time for Production Line A",
      area: "Manufacturing - Line A",
      currentState: "Current setup time averages 45 minutes with significant variation. Multiple manual adjustments required. Tools scattered in different locations.",
      targetState: "Achieve consistent 15-minute setup time with standardized procedure. Organized tool layout and quick-change fixtures.",
      benefits: "Increased production capacity, reduced labor costs, improved quality consistency, enhanced operator satisfaction",
      actions: [
        {
          id: "1",
          description: "Create visual tool organization system (5S)",
          category: "workplace-organization",
          priority: "high",
          effort: "low",
          impact: "high",
          responsible: "Production Team",
          deadline: "2024-03-15",
          status: "in-progress",
          notes: "Shadow boards already designed"
        },
        {
          id: "2",
          description: "Design and install quick-change fixtures",
          category: "equipment",
          priority: "high",
          effort: "high",
          impact: "high",
          responsible: "Maintenance",
          deadline: "2024-04-01",
          status: "not-started",
          notes: "Waiting for engineering approval"
        },
        {
          id: "3",
          description: "Develop standard work instructions with photos",
          category: "documentation",
          priority: "medium",
          effort: "medium",
          impact: "medium",
          responsible: "Quality Team",
          deadline: "2024-03-20",
          status: "completed",
          notes: "Instructions posted at workstation"
        }
      ]
    });

    toast({
      title: "Template loaded",
      description: "Sample Kaizen event has been loaded",
    });
  };

  const exportEvent = () => {
    const content = `Kaizen Event Report
Generated on: ${new Date().toLocaleDateString()}

Event Title: ${event.title}
Area: ${event.area}

Current State:
${event.currentState}

Target State:
${event.targetState}

Expected Benefits:
${event.benefits}

Action Items (${event.actions.length} total):
${event.actions.map((action, index) => `
${index + 1}. ${action.description}
   Category: ${action.category}
   Priority: ${action.priority} | Effort: ${action.effort} | Impact: ${action.impact}
   Responsible: ${action.responsible}
   Deadline: ${action.deadline}
   Status: ${action.status}
   Notes: ${action.notes}
`).join('\n')}

Status Summary:
- Not Started: ${event.actions.filter(a => a.status === 'not-started').length}
- In Progress: ${event.actions.filter(a => a.status === 'in-progress').length}
- Completed: ${event.actions.filter(a => a.status === 'completed').length}
- On Hold: ${event.actions.filter(a => a.status === 'on-hold').length}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kaizen-event.txt';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Event exported",
      description: "Kaizen event report has been downloaded",
    });
  };

  const reset = () => {
    setEvent({
      title: "",
      area: "",
      currentState: "",
      targetState: "",
      benefits: "",
      actions: []
    });
  };

  const getProgressValue = () => {
    if (event.actions.length === 0) return 0;
    const completed = event.actions.filter(a => a.status === 'completed').length;
    return (completed / event.actions.length) * 100;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success text-success-foreground';
      case 'in-progress': return 'bg-warning text-warning-foreground';
      case 'on-hold': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="card-professional">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold text-primary">Kaizen Event Planner</CardTitle>
            <CardDescription>
              Plan and track continuous improvement activities
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={reset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={loadTemplate}>
              <Target className="w-4 h-4 mr-2" />
              Load Template
            </Button>
            <Button variant="success" size="sm" onClick={exportEvent}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Event Overview</TabsTrigger>
            <TabsTrigger value="actions">Action Items</TabsTrigger>
            <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Event Title</Label>
                <Input
                  placeholder="Brief description of the improvement"
                  value={event.title}
                  onChange={(e) => setEvent(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Area/Department</Label>
                <Input
                  placeholder="Where the improvement will take place"
                  value={event.area}
                  onChange={(e) => setEvent(prev => ({ ...prev, area: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Current State</Label>
                <Textarea
                  placeholder="Describe the current situation, problems, and pain points..."
                  value={event.currentState}
                  onChange={(e) => setEvent(prev => ({ ...prev, currentState: e.target.value }))}
                  className="min-h-24"
                />
              </div>

              <div className="space-y-2">
                <Label>Target State</Label>
                <Textarea
                  placeholder="Describe the desired future state after improvement..."
                  value={event.targetState}
                  onChange={(e) => setEvent(prev => ({ ...prev, targetState: e.target.value }))}
                  className="min-h-24"
                />
              </div>

              <div className="space-y-2">
                <Label>Expected Benefits</Label>
                <Textarea
                  placeholder="List the expected benefits and quantify where possible..."
                  value={event.benefits}
                  onChange={(e) => setEvent(prev => ({ ...prev, benefits: e.target.value }))}
                  className="min-h-20"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="actions" className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Action Items</Label>
              <Button variant="outline" size="sm" onClick={addAction}>
                <Plus className="w-4 h-4 mr-2" />
                Add Action
              </Button>
            </div>

            <div className="space-y-4">
              {event.actions.length === 0 ? (
                <Card className="text-center py-8">
                  <CardContent>
                    <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Actions Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Add action items to track the steps needed for your Kaizen event.
                    </p>
                    <Button variant="outline" onClick={addAction}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Action
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                event.actions.map((action) => (
                  <Card key={action.id} className="border-muted">
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-2">
                            <Label className="text-sm">Action Description</Label>
                            <Textarea
                              placeholder="Describe the action to be taken..."
                              value={action.description}
                              onChange={(e) => updateAction(action.id, 'description', e.target.value)}
                              className="min-h-16"
                            />
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeAction(action.id)}
                            className="ml-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="space-y-2">
                            <Label className="text-sm">Category</Label>
                            <Select value={action.category} onValueChange={(value) => updateAction(action.id, 'category', value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="process">Process</SelectItem>
                                <SelectItem value="equipment">Equipment</SelectItem>
                                <SelectItem value="workplace-organization">5S/Organization</SelectItem>
                                <SelectItem value="documentation">Documentation</SelectItem>
                                <SelectItem value="training">Training</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm">Priority</Label>
                            <Select value={action.priority} onValueChange={(value) => updateAction(action.id, 'priority', value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm">Effort</Label>
                            <Select value={action.effort} onValueChange={(value) => updateAction(action.id, 'effort', value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm">Impact</Label>
                            <Select value={action.impact} onValueChange={(value) => updateAction(action.id, 'impact', value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="space-y-2">
                            <Label className="text-sm">Responsible Person</Label>
                            <Input
                              placeholder="Who will do this?"
                              value={action.responsible}
                              onChange={(e) => updateAction(action.id, 'responsible', e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm">Deadline</Label>
                            <Input
                              type="date"
                              value={action.deadline}
                              onChange={(e) => updateAction(action.id, 'deadline', e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm">Status</Label>
                            <Select value={action.status} onValueChange={(value) => updateAction(action.id, 'status', value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="not-started">Not Started</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="on-hold">On Hold</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm">Notes</Label>
                          <Input
                            placeholder="Additional notes or comments..."
                            value={action.notes}
                            onChange={(e) => updateAction(action.id, 'notes', e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            {event.actions.length > 0 ? (
              <div className="space-y-6">
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Overall Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Completion</span>
                        <span>{Math.round(getProgressValue())}%</span>
                      </div>
                      <Progress value={getProgressValue()} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold">{event.actions.filter(a => a.status === 'not-started').length}</div>
                        <div className="text-sm text-muted-foreground">Not Started</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-warning">{event.actions.filter(a => a.status === 'in-progress').length}</div>
                        <div className="text-sm text-muted-foreground">In Progress</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-success">{event.actions.filter(a => a.status === 'completed').length}</div>
                        <div className="text-sm text-muted-foreground">Completed</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-destructive">{event.actions.filter(a => a.status === 'on-hold').length}</div>
                        <div className="text-sm text-muted-foreground">On Hold</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-3">
                  <Label className="text-lg font-semibold">Action Status</Label>
                  {event.actions.map((action) => (
                    <Card key={action.id} className="border-muted">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium mb-1">{action.description}</div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant={getPriorityColor(action.priority)} className="text-xs">
                                {action.priority} priority
                              </Badge>
                              <span>•</span>
                              <span>{action.responsible}</span>
                              {action.deadline && (
                                <>
                                  <span>•</span>
                                  <span>Due: {action.deadline}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <Badge className={`${getStatusColor(action.status)} text-xs`}>
                            {action.status.replace('-', ' ')}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Actions to Track</h3>
                  <p className="text-muted-foreground mb-4">
                    Add action items to see progress tracking.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}