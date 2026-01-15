import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, Plus, Trash2, Shield, Clock } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";
import { useToast } from "@/hooks/use-toast";

interface EmergencyAction {
  id: string;
  action: string;
  responsible: string;
  targetDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  completed: boolean;
}

interface Symptom {
  id: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  frequency: string;
  firstNoticed: string;
  affectedArea: string;
}

export function D0SymptomsTool() {
  const { currentProject, updateToolData, getToolData } = useProject();
  const { toast } = useToast();

  const savedData = currentProject ? getToolData('d0-symptoms') : null;
  
  const [problemInfo, setProblemInfo] = useState({
    problemTitle: savedData?.problemInfo?.problemTitle || '',
    reportedBy: savedData?.problemInfo?.reportedBy || '',
    reportDate: savedData?.problemInfo?.reportDate || new Date().toISOString().split('T')[0],
    customerImpact: savedData?.problemInfo?.customerImpact || '',
    immediateRisk: savedData?.problemInfo?.immediateRisk || 'medium'
  });

  const [symptoms, setSymptoms] = useState<Symptom[]>(savedData?.symptoms || []);
  const [emergencyActions, setEmergencyActions] = useState<EmergencyAction[]>(savedData?.emergencyActions || []);
  
  const [newSymptom, setNewSymptom] = useState({
    description: '',
    severity: 'medium' as const,
    frequency: '',
    firstNoticed: '',
    affectedArea: ''
  });

  const [newAction, setNewAction] = useState({
    action: '',
    responsible: '',
    targetDate: '',
    status: 'pending' as const
  });

  const addSymptom = () => {
    if (!newSymptom.description) {
      toast({ title: "Error", description: "Symptom description is required", variant: "destructive" });
      return;
    }

    const symptom: Symptom = {
      ...newSymptom,
      id: Date.now().toString()
    };

    const updated = [...symptoms, symptom];
    setSymptoms(updated);
    setNewSymptom({ description: '', severity: 'medium', frequency: '', firstNoticed: '', affectedArea: '' });
    saveData(updated, emergencyActions);
  };

  const addEmergencyAction = () => {
    if (!newAction.action) {
      toast({ title: "Error", description: "Action description is required", variant: "destructive" });
      return;
    }

    const action: EmergencyAction = {
      ...newAction,
      id: Date.now().toString(),
      completed: false
    };

    const updated = [...emergencyActions, action];
    setEmergencyActions(updated);
    setNewAction({ action: '', responsible: '', targetDate: '', status: 'pending' });
    saveData(symptoms, updated);
  };

  const toggleActionComplete = (id: string) => {
    const updated = emergencyActions.map(a => 
      a.id === id ? { ...a, completed: !a.completed, status: !a.completed ? 'completed' as const : 'pending' as const } : a
    );
    setEmergencyActions(updated);
    saveData(symptoms, updated);
  };

  const removeSymptom = (id: string) => {
    const updated = symptoms.filter(s => s.id !== id);
    setSymptoms(updated);
    saveData(updated, emergencyActions);
  };

  const removeAction = (id: string) => {
    const updated = emergencyActions.filter(a => a.id !== id);
    setEmergencyActions(updated);
    saveData(symptoms, updated);
  };

  const saveData = (symp?: Symptom[], actions?: EmergencyAction[]) => {
    if (currentProject) {
      updateToolData('d0-symptoms', {
        problemInfo,
        symptoms: symp || symptoms,
        emergencyActions: actions || emergencyActions
      });
      toast({ title: "Saved", description: "D0 data saved successfully" });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-destructive text-destructive-foreground';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      default: return 'bg-green-500 text-white';
    }
  };

  const completedActions = emergencyActions.filter(a => a.completed).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <CardTitle>D0: Symptom Analysis & Emergency Response</CardTitle>
              <CardDescription>Document symptoms and implement immediate containment actions</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Problem Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <Label>Problem Title *</Label>
              <Input
                value={problemInfo.problemTitle}
                onChange={(e) => setProblemInfo({ ...problemInfo, problemTitle: e.target.value })}
                placeholder="Brief description of the problem"
              />
            </div>
            <div>
              <Label>Immediate Risk Level</Label>
              <Select 
                value={problemInfo.immediateRisk} 
                onValueChange={(v) => setProblemInfo({ ...problemInfo, immediateRisk: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Reported By</Label>
              <Input
                value={problemInfo.reportedBy}
                onChange={(e) => setProblemInfo({ ...problemInfo, reportedBy: e.target.value })}
                placeholder="Name"
              />
            </div>
            <div>
              <Label>Report Date</Label>
              <Input
                type="date"
                value={problemInfo.reportDate}
                onChange={(e) => setProblemInfo({ ...problemInfo, reportDate: e.target.value })}
              />
            </div>
            <div>
              <Label>Customer Impact</Label>
              <Input
                value={problemInfo.customerImpact}
                onChange={(e) => setProblemInfo({ ...problemInfo, customerImpact: e.target.value })}
                placeholder="How is the customer affected?"
              />
            </div>
          </div>

          {/* Status Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-muted/50">
              <CardContent className="pt-4 flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-orange-500" />
                <div>
                  <div className="text-2xl font-bold">{symptoms.length}</div>
                  <p className="text-sm text-muted-foreground">Symptoms Identified</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="pt-4 flex items-center gap-3">
                <Shield className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">{emergencyActions.length}</div>
                  <p className="text-sm text-muted-foreground">Emergency Actions</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-green-500/10">
              <CardContent className="pt-4 flex items-center gap-3">
                <Clock className="h-8 w-8 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">{completedActions}/{emergencyActions.length}</div>
                  <p className="text-sm text-muted-foreground">Actions Completed</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Symptoms Section */}
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Symptoms Observed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2">
                  <Label>Symptom Description *</Label>
                  <Input
                    value={newSymptom.description}
                    onChange={(e) => setNewSymptom({ ...newSymptom, description: e.target.value })}
                    placeholder="What was observed?"
                  />
                </div>
                <div>
                  <Label>Severity</Label>
                  <Select value={newSymptom.severity} onValueChange={(v: any) => setNewSymptom({ ...newSymptom, severity: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Frequency</Label>
                  <Input
                    value={newSymptom.frequency}
                    onChange={(e) => setNewSymptom({ ...newSymptom, frequency: e.target.value })}
                    placeholder="How often?"
                  />
                </div>
                <div>
                  <Label>Affected Area</Label>
                  <Input
                    value={newSymptom.affectedArea}
                    onChange={(e) => setNewSymptom({ ...newSymptom, affectedArea: e.target.value })}
                    placeholder="Location/Department"
                  />
                </div>
              </div>
              <Button onClick={addSymptom} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Symptom
              </Button>

              {symptoms.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symptom</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Affected Area</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {symptoms.map((symptom) => (
                      <TableRow key={symptom.id}>
                        <TableCell className="font-medium">{symptom.description}</TableCell>
                        <TableCell>
                          <Badge className={getSeverityColor(symptom.severity)}>
                            {symptom.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>{symptom.frequency}</TableCell>
                        <TableCell>{symptom.affectedArea}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => removeSymptom(symptom.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Emergency Response Actions */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-destructive" />
                Emergency Response Actions (ERA)
              </CardTitle>
              <CardDescription>Immediate actions to protect the customer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <Label>Action *</Label>
                  <Input
                    value={newAction.action}
                    onChange={(e) => setNewAction({ ...newAction, action: e.target.value })}
                    placeholder="What needs to be done immediately?"
                  />
                </div>
                <div>
                  <Label>Responsible</Label>
                  <Input
                    value={newAction.responsible}
                    onChange={(e) => setNewAction({ ...newAction, responsible: e.target.value })}
                    placeholder="Owner"
                  />
                </div>
                <div>
                  <Label>Target Date</Label>
                  <Input
                    type="date"
                    value={newAction.targetDate}
                    onChange={(e) => setNewAction({ ...newAction, targetDate: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={addEmergencyAction} size="sm" variant="destructive">
                <Plus className="h-4 w-4 mr-2" />
                Add Emergency Action
              </Button>

              {emergencyActions.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Done</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Responsible</TableHead>
                      <TableHead>Target Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {emergencyActions.map((action) => (
                      <TableRow key={action.id} className={action.completed ? 'opacity-60' : ''}>
                        <TableCell>
                          <Checkbox 
                            checked={action.completed} 
                            onCheckedChange={() => toggleActionComplete(action.id)}
                          />
                        </TableCell>
                        <TableCell className={`font-medium ${action.completed ? 'line-through' : ''}`}>
                          {action.action}
                        </TableCell>
                        <TableCell>{action.responsible}</TableCell>
                        <TableCell>{action.targetDate}</TableCell>
                        <TableCell>
                          <Badge variant={action.completed ? 'default' : 'secondary'}>
                            {action.completed ? 'Completed' : action.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => removeAction(action.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Button onClick={() => saveData()}>Save D0 Analysis</Button>
        </CardContent>
      </Card>
    </div>
  );
}
