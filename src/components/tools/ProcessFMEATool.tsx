import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Plus, Trash2, Download, Factory } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";
import { useToast } from "@/hooks/use-toast";

interface ProcessFailureMode {
  id: string;
  processStep: string;
  function: string;
  failureMode: string;
  effect: string;
  cause: string;
  currentControls: string;
  severity: number;
  occurrence: number;
  detection: number;
  rpn: number;
  recommendedAction: string;
  responsibility: string;
  targetDate: string;
  actionsTaken: string;
  newSeverity: number;
  newOccurrence: number;
  newDetection: number;
  newRpn: number;
}

const initialFailureMode: Omit<ProcessFailureMode, 'id' | 'rpn' | 'newRpn'> = {
  processStep: '',
  function: '',
  failureMode: '',
  effect: '',
  cause: '',
  currentControls: '',
  severity: 1,
  occurrence: 1,
  detection: 1,
  recommendedAction: '',
  responsibility: '',
  targetDate: '',
  actionsTaken: '',
  newSeverity: 1,
  newOccurrence: 1,
  newDetection: 1
};

export function ProcessFMEATool() {
  const { currentProject, updateToolData, getToolData } = useProject();
  const { toast } = useToast();

  const savedData = currentProject ? getToolData('process-fmea') : null;
  
  const [projectInfo, setProjectInfo] = useState({
    processName: savedData?.projectInfo?.processName || '',
    processOwner: savedData?.projectInfo?.processOwner || '',
    preparedBy: savedData?.projectInfo?.preparedBy || '',
    date: savedData?.projectInfo?.date || new Date().toISOString().split('T')[0]
  });

  const [failureModes, setFailureModes] = useState<ProcessFailureMode[]>(
    savedData?.failureModes || []
  );

  const [newMode, setNewMode] = useState(initialFailureMode);

  const calculateRPN = (s: number, o: number, d: number) => s * o * d;

  const getRPNColor = (rpn: number) => {
    if (rpn >= 200) return 'bg-destructive text-destructive-foreground';
    if (rpn >= 120) return 'bg-orange-500 text-white';
    if (rpn >= 80) return 'bg-yellow-500 text-black';
    return 'bg-green-500 text-white';
  };

  const addFailureMode = () => {
    if (!newMode.processStep || !newMode.failureMode) {
      toast({ title: "Error", description: "Process Step and Failure Mode are required", variant: "destructive" });
      return;
    }

    const rpn = calculateRPN(newMode.severity, newMode.occurrence, newMode.detection);
    const newRpn = calculateRPN(newMode.newSeverity, newMode.newOccurrence, newMode.newDetection);
    
    const mode: ProcessFailureMode = {
      ...newMode,
      id: Date.now().toString(),
      rpn,
      newRpn
    };

    const updated = [...failureModes, mode];
    setFailureModes(updated);
    setNewMode(initialFailureMode);
    saveData(updated);
  };

  const removeFailureMode = (id: string) => {
    const updated = failureModes.filter(m => m.id !== id);
    setFailureModes(updated);
    saveData(updated);
  };

  const saveData = (modes?: ProcessFailureMode[]) => {
    if (currentProject) {
      updateToolData('process-fmea', {
        projectInfo,
        failureModes: modes || failureModes
      });
      toast({ title: "Saved", description: "PFMEA data saved successfully" });
    }
  };

  const exportToCSV = () => {
    const headers = ['Process Step', 'Function', 'Failure Mode', 'Effect', 'Cause', 'Current Controls', 'S', 'O', 'D', 'RPN', 'Recommended Action'];
    const rows = failureModes.map(m => [
      m.processStep, m.function, m.failureMode, m.effect, m.cause, m.currentControls,
      m.severity, m.occurrence, m.detection, m.rpn, m.recommendedAction
    ]);
    
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'process-fmea.csv';
    a.click();
  };

  const highRPNCount = failureModes.filter(m => m.rpn >= 120).length;
  const avgRPN = failureModes.length > 0 
    ? Math.round(failureModes.reduce((sum, m) => sum + m.rpn, 0) / failureModes.length)
    : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <Factory className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Process FMEA (PFMEA)</CardTitle>
              <CardDescription>Analyze potential process failure modes and their effects</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Project Info */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Process Name</Label>
              <Input
                value={projectInfo.processName}
                onChange={(e) => setProjectInfo({ ...projectInfo, processName: e.target.value })}
                placeholder="Process name"
              />
            </div>
            <div>
              <Label>Process Owner</Label>
              <Input
                value={projectInfo.processOwner}
                onChange={(e) => setProjectInfo({ ...projectInfo, processOwner: e.target.value })}
                placeholder="Owner"
              />
            </div>
            <div>
              <Label>Prepared By</Label>
              <Input
                value={projectInfo.preparedBy}
                onChange={(e) => setProjectInfo({ ...projectInfo, preparedBy: e.target.value })}
                placeholder="Author"
              />
            </div>
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={projectInfo.date}
                onChange={(e) => setProjectInfo({ ...projectInfo, date: e.target.value })}
              />
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">{failureModes.length}</div>
                <p className="text-sm text-muted-foreground">Failure Modes</p>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">{avgRPN}</div>
                <p className="text-sm text-muted-foreground">Average RPN</p>
              </CardContent>
            </Card>
            <Card className="bg-destructive/10">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-destructive">{highRPNCount}</div>
                <p className="text-sm text-muted-foreground">High Risk (RPN ≥ 120)</p>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">
                  {failureModes.length > 0 ? Math.max(...failureModes.map(m => m.rpn)) : 0}
                </div>
                <p className="text-sm text-muted-foreground">Max RPN</p>
              </CardContent>
            </Card>
          </div>

          {/* Add New Failure Mode */}
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-lg">Add Process Failure Mode</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Process Step/Operation *</Label>
                  <Input
                    value={newMode.processStep}
                    onChange={(e) => setNewMode({ ...newMode, processStep: e.target.value })}
                    placeholder="e.g., Assembly, Inspection"
                  />
                </div>
                <div>
                  <Label>Function/Requirement</Label>
                  <Input
                    value={newMode.function}
                    onChange={(e) => setNewMode({ ...newMode, function: e.target.value })}
                    placeholder="Purpose of the step"
                  />
                </div>
                <div>
                  <Label>Potential Failure Mode *</Label>
                  <Input
                    value={newMode.failureMode}
                    onChange={(e) => setNewMode({ ...newMode, failureMode: e.target.value })}
                    placeholder="How it could fail"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Potential Effect(s)</Label>
                  <Textarea
                    value={newMode.effect}
                    onChange={(e) => setNewMode({ ...newMode, effect: e.target.value })}
                    placeholder="Impact on next operation/customer"
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Potential Cause(s)</Label>
                  <Textarea
                    value={newMode.cause}
                    onChange={(e) => setNewMode({ ...newMode, cause: e.target.value })}
                    placeholder="What could cause the failure"
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Current Process Controls</Label>
                  <Textarea
                    value={newMode.currentControls}
                    onChange={(e) => setNewMode({ ...newMode, currentControls: e.target.value })}
                    placeholder="Prevention or detection controls"
                    rows={2}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                <div>
                  <Label>Severity (1-10)</Label>
                  <Select value={newMode.severity.toString()} onValueChange={(v) => setNewMode({ ...newMode, severity: parseInt(v) })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6,7,8,9,10].map(n => (
                        <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Occurrence (1-10)</Label>
                  <Select value={newMode.occurrence.toString()} onValueChange={(v) => setNewMode({ ...newMode, occurrence: parseInt(v) })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6,7,8,9,10].map(n => (
                        <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Detection (1-10)</Label>
                  <Select value={newMode.detection.toString()} onValueChange={(v) => setNewMode({ ...newMode, detection: parseInt(v) })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6,7,8,9,10].map(n => (
                        <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-3 md:col-span-3 flex items-end">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">RPN:</span>
                    <Badge className={getRPNColor(calculateRPN(newMode.severity, newMode.occurrence, newMode.detection))}>
                      {calculateRPN(newMode.severity, newMode.occurrence, newMode.detection)}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Recommended Action</Label>
                  <Input
                    value={newMode.recommendedAction}
                    onChange={(e) => setNewMode({ ...newMode, recommendedAction: e.target.value })}
                    placeholder="Corrective action"
                  />
                </div>
                <div>
                  <Label>Responsibility</Label>
                  <Input
                    value={newMode.responsibility}
                    onChange={(e) => setNewMode({ ...newMode, responsibility: e.target.value })}
                    placeholder="Owner"
                  />
                </div>
                <div>
                  <Label>Target Date</Label>
                  <Input
                    type="date"
                    value={newMode.targetDate}
                    onChange={(e) => setNewMode({ ...newMode, targetDate: e.target.value })}
                  />
                </div>
              </div>

              <Button onClick={addFailureMode}>
                <Plus className="h-4 w-4 mr-2" />
                Add Failure Mode
              </Button>
            </CardContent>
          </Card>

          {/* Failure Modes Table */}
          {failureModes.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Process Failure Modes</CardTitle>
                <Button variant="outline" size="sm" onClick={exportToCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Process Step</TableHead>
                        <TableHead>Failure Mode</TableHead>
                        <TableHead>Effect</TableHead>
                        <TableHead>Cause</TableHead>
                        <TableHead>Controls</TableHead>
                        <TableHead className="text-center">S</TableHead>
                        <TableHead className="text-center">O</TableHead>
                        <TableHead className="text-center">D</TableHead>
                        <TableHead className="text-center">RPN</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {failureModes.map((mode) => (
                        <TableRow key={mode.id}>
                          <TableCell className="font-medium">{mode.processStep}</TableCell>
                          <TableCell>{mode.failureMode}</TableCell>
                          <TableCell className="max-w-[120px] truncate">{mode.effect}</TableCell>
                          <TableCell className="max-w-[120px] truncate">{mode.cause}</TableCell>
                          <TableCell className="max-w-[120px] truncate">{mode.currentControls}</TableCell>
                          <TableCell className="text-center">{mode.severity}</TableCell>
                          <TableCell className="text-center">{mode.occurrence}</TableCell>
                          <TableCell className="text-center">{mode.detection}</TableCell>
                          <TableCell className="text-center">
                            <Badge className={getRPNColor(mode.rpn)}>{mode.rpn}</Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => removeFailureMode(mode.id)}>
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

          <Button onClick={() => saveData()}>Save PFMEA</Button>
        </CardContent>
      </Card>
    </div>
  );
}
