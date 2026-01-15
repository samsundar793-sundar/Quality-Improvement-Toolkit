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
import { Shield, Plus, Trash2, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";
import { useToast } from "@/hooks/use-toast";

interface ContainmentAction {
  id: string;
  type: 'supplier' | 'in-process' | 'finished-goods' | 'in-transit' | 'at-customer';
  action: string;
  location: string;
  quantityAffected: string;
  responsible: string;
  startDate: string;
  targetDate: string;
  status: 'planned' | 'in-progress' | 'completed' | 'verified';
  verificationMethod: string;
  effectivenessResult: string;
  completed: boolean;
}

export function D3ContainmentTool() {
  const { currentProject, updateToolData, getToolData } = useProject();
  const { toast } = useToast();

  const savedData = currentProject ? getToolData('d3-containment') : null;
  
  const [containmentInfo, setContainmentInfo] = useState({
    problemReference: savedData?.containmentInfo?.problemReference || '',
    containmentObjective: savedData?.containmentInfo?.containmentObjective || '',
    containmentStartDate: savedData?.containmentInfo?.containmentStartDate || new Date().toISOString().split('T')[0],
    riskAssessment: savedData?.containmentInfo?.riskAssessment || ''
  });

  const [actions, setActions] = useState<ContainmentAction[]>(savedData?.actions || []);
  
  const [newAction, setNewAction] = useState({
    type: 'in-process' as const,
    action: '',
    location: '',
    quantityAffected: '',
    responsible: '',
    startDate: new Date().toISOString().split('T')[0],
    targetDate: '',
    status: 'planned' as const,
    verificationMethod: '',
    effectivenessResult: ''
  });

  const containmentTypes = [
    { value: 'supplier', label: 'Supplier Containment' },
    { value: 'in-process', label: 'In-Process Containment' },
    { value: 'finished-goods', label: 'Finished Goods' },
    { value: 'in-transit', label: 'In-Transit' },
    { value: 'at-customer', label: 'At Customer' }
  ];

  const addAction = () => {
    if (!newAction.action) {
      toast({ title: "Error", description: "Action description is required", variant: "destructive" });
      return;
    }

    const action: ContainmentAction = {
      ...newAction,
      id: Date.now().toString(),
      completed: false
    };

    const updated = [...actions, action];
    setActions(updated);
    setNewAction({
      type: 'in-process',
      action: '',
      location: '',
      quantityAffected: '',
      responsible: '',
      startDate: new Date().toISOString().split('T')[0],
      targetDate: '',
      status: 'planned',
      verificationMethod: '',
      effectivenessResult: ''
    });
    saveData(updated);
  };

  const removeAction = (id: string) => {
    const updated = actions.filter(a => a.id !== id);
    setActions(updated);
    saveData(updated);
  };

  const updateActionStatus = (id: string, status: ContainmentAction['status']) => {
    const updated = actions.map(a => 
      a.id === id ? { ...a, status, completed: status === 'completed' || status === 'verified' } : a
    );
    setActions(updated);
    saveData(updated);
  };

  const saveData = (actionsList?: ContainmentAction[]) => {
    if (currentProject) {
      updateToolData('d3-containment', {
        containmentInfo,
        actions: actionsList || actions
      });
      toast({ title: "Saved", description: "Containment actions saved successfully" });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-500 text-white';
      case 'completed': return 'bg-blue-500 text-white';
      case 'in-progress': return 'bg-yellow-500 text-black';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'at-customer': return 'bg-destructive text-destructive-foreground';
      case 'in-transit': return 'bg-orange-500 text-white';
      case 'finished-goods': return 'bg-yellow-500 text-black';
      case 'supplier': return 'bg-blue-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const completedCount = actions.filter(a => a.status === 'completed' || a.status === 'verified').length;
  const verifiedCount = actions.filter(a => a.status === 'verified').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-orange-500/10">
              <Shield className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <CardTitle>D3: Interim Containment Actions (ICA)</CardTitle>
              <CardDescription>Protect the customer from the problem while permanent solutions are developed</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Containment Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Problem Reference</Label>
              <Input
                value={containmentInfo.problemReference}
                onChange={(e) => setContainmentInfo({ ...containmentInfo, problemReference: e.target.value })}
                placeholder="Problem ID"
              />
            </div>
            <div>
              <Label>Containment Start Date</Label>
              <Input
                type="date"
                value={containmentInfo.containmentStartDate}
                onChange={(e) => setContainmentInfo({ ...containmentInfo, containmentStartDate: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <Label>Containment Objective</Label>
              <Textarea
                value={containmentInfo.containmentObjective}
                onChange={(e) => setContainmentInfo({ ...containmentInfo, containmentObjective: e.target.value })}
                placeholder="What is the goal of the containment? How will customer be protected?"
                rows={2}
              />
            </div>
          </div>

          {/* Status Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-muted/50">
              <CardContent className="pt-4 flex items-center gap-3">
                <Shield className="h-8 w-8 text-orange-500" />
                <div>
                  <div className="text-2xl font-bold">{actions.length}</div>
                  <p className="text-sm text-muted-foreground">Total Actions</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="pt-4 flex items-center gap-3">
                <Clock className="h-8 w-8 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold">{actions.filter(a => a.status === 'in-progress').length}</div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-blue-500/10">
              <CardContent className="pt-4 flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">{completedCount}</div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-green-500/10">
              <CardContent className="pt-4 flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">{verifiedCount}</div>
                  <p className="text-sm text-muted-foreground">Verified</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Containment by Type */}
          <div className="grid grid-cols-5 gap-2">
            {containmentTypes.map(type => (
              <Card key={type.value} className="text-center">
                <CardContent className="pt-4">
                  <Badge className={getTypeColor(type.value)}>
                    {actions.filter(a => a.type === type.value).length}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">{type.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add Containment Action */}
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Containment Action
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Containment Type</Label>
                  <Select value={newAction.type} onValueChange={(v: any) => setNewAction({ ...newAction, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {containmentTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label>Action Description *</Label>
                  <Input
                    value={newAction.action}
                    onChange={(e) => setNewAction({ ...newAction, action: e.target.value })}
                    placeholder="What action will be taken?"
                  />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    value={newAction.location}
                    onChange={(e) => setNewAction({ ...newAction, location: e.target.value })}
                    placeholder="Where?"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <Label>Quantity Affected</Label>
                  <Input
                    value={newAction.quantityAffected}
                    onChange={(e) => setNewAction({ ...newAction, quantityAffected: e.target.value })}
                    placeholder="e.g., 500 units"
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
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={newAction.startDate}
                    onChange={(e) => setNewAction({ ...newAction, startDate: e.target.value })}
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
                <div>
                  <Label>Verification Method</Label>
                  <Input
                    value={newAction.verificationMethod}
                    onChange={(e) => setNewAction({ ...newAction, verificationMethod: e.target.value })}
                    placeholder="How to verify?"
                  />
                </div>
              </div>

              <Button onClick={addAction}>
                <Plus className="h-4 w-4 mr-2" />
                Add Containment Action
              </Button>
            </CardContent>
          </Card>

          {/* Actions Table */}
          {actions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Containment Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Responsible</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {actions.map((action) => (
                        <TableRow key={action.id}>
                          <TableCell>
                            <Badge className={getTypeColor(action.type)}>
                              {action.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium max-w-[200px]">{action.action}</TableCell>
                          <TableCell>{action.location}</TableCell>
                          <TableCell>{action.quantityAffected}</TableCell>
                          <TableCell>{action.responsible}</TableCell>
                          <TableCell>{action.targetDate}</TableCell>
                          <TableCell>
                            <Select 
                              value={action.status} 
                              onValueChange={(v: any) => updateActionStatus(action.id, v)}
                            >
                              <SelectTrigger className="w-[120px]">
                                <Badge className={getStatusColor(action.status)}>
                                  {action.status}
                                </Badge>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="planned">Planned</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="verified">Verified</SelectItem>
                              </SelectContent>
                            </Select>
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
                </div>
              </CardContent>
            </Card>
          )}

          <Button onClick={() => saveData()}>Save Containment Actions</Button>
        </CardContent>
      </Card>
    </div>
  );
}
