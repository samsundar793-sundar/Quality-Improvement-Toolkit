import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Plus, Trash2, Download, FileUp } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";
import { useToast } from "@/hooks/use-toast";

interface DesignFailureMode {
  id: string;
  component: string;
  function: string;
  failureMode: string;
  effect: string;
  cause: string;
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

const initialFailureMode: Omit<DesignFailureMode, 'id' | 'rpn' | 'newRpn'> = {
  component: '',
  function: '',
  failureMode: '',
  effect: '',
  cause: '',
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

export function DesignFMEATool() {
  const { currentProject, updateToolData, getToolData } = useProject();
  const { toast } = useToast();

  const savedData = currentProject ? getToolData('design-fmea') : null;
  
  const [projectInfo, setProjectInfo] = useState({
    productName: savedData?.projectInfo?.productName || '',
    designTeam: savedData?.projectInfo?.designTeam || '',
    preparedBy: savedData?.projectInfo?.preparedBy || '',
    date: savedData?.projectInfo?.date || new Date().toISOString().split('T')[0]
  });

  const [failureModes, setFailureModes] = useState<DesignFailureMode[]>(
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
    if (!newMode.component || !newMode.failureMode) {
      toast({ title: "Error", description: "Component and Failure Mode are required", variant: "destructive" });
      return;
    }

    const rpn = calculateRPN(newMode.severity, newMode.occurrence, newMode.detection);
    const newRpn = calculateRPN(newMode.newSeverity, newMode.newOccurrence, newMode.newDetection);
    
    const mode: DesignFailureMode = {
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

  const saveData = (modes?: DesignFailureMode[]) => {
    if (currentProject) {
      updateToolData('design-fmea', {
        projectInfo,
        failureModes: modes || failureModes
      });
      toast({ title: "Saved", description: "DFMEA data saved successfully" });
    }
  };

  const exportToCSV = () => {
    const headers = ['Component', 'Function', 'Failure Mode', 'Effect', 'Cause', 'S', 'O', 'D', 'RPN', 'Recommended Action', 'New S', 'New O', 'New D', 'New RPN'];
    const rows = failureModes.map(m => [
      m.component, m.function, m.failureMode, m.effect, m.cause,
      m.severity, m.occurrence, m.detection, m.rpn,
      m.recommendedAction, m.newSeverity, m.newOccurrence, m.newDetection, m.newRpn
    ]);
    
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'design-fmea.csv';
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
              <AlertTriangle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Design FMEA (DFMEA)</CardTitle>
              <CardDescription>Analyze potential design failure modes and their effects</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Project Info */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Product/Design Name</Label>
              <Input
                value={projectInfo.productName}
                onChange={(e) => setProjectInfo({ ...projectInfo, productName: e.target.value })}
                placeholder="Product name"
              />
            </div>
            <div>
              <Label>Design Team</Label>
              <Input
                value={projectInfo.designTeam}
                onChange={(e) => setProjectInfo({ ...projectInfo, designTeam: e.target.value })}
                placeholder="Team members"
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
              <CardTitle className="text-lg">Add Design Failure Mode</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Component/Subsystem *</Label>
                  <Input
                    value={newMode.component}
                    onChange={(e) => setNewMode({ ...newMode, component: e.target.value })}
                    placeholder="e.g., Housing, Circuit Board"
                  />
                </div>
                <div>
                  <Label>Function</Label>
                  <Input
                    value={newMode.function}
                    onChange={(e) => setNewMode({ ...newMode, function: e.target.value })}
                    placeholder="What the component does"
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Potential Effect(s)</Label>
                  <Textarea
                    value={newMode.effect}
                    onChange={(e) => setNewMode({ ...newMode, effect: e.target.value })}
                    placeholder="Impact on customer/system"
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
                <CardTitle className="text-lg">Design Failure Modes</CardTitle>
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
                        <TableHead>Component</TableHead>
                        <TableHead>Failure Mode</TableHead>
                        <TableHead>Effect</TableHead>
                        <TableHead>Cause</TableHead>
                        <TableHead className="text-center">S</TableHead>
                        <TableHead className="text-center">O</TableHead>
                        <TableHead className="text-center">D</TableHead>
                        <TableHead className="text-center">RPN</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {failureModes.map((mode) => (
                        <TableRow key={mode.id}>
                          <TableCell className="font-medium">{mode.component}</TableCell>
                          <TableCell>{mode.failureMode}</TableCell>
                          <TableCell className="max-w-[150px] truncate">{mode.effect}</TableCell>
                          <TableCell className="max-w-[150px] truncate">{mode.cause}</TableCell>
                          <TableCell className="text-center">{mode.severity}</TableCell>
                          <TableCell className="text-center">{mode.occurrence}</TableCell>
                          <TableCell className="text-center">{mode.detection}</TableCell>
                          <TableCell className="text-center">
                            <Badge className={getRPNColor(mode.rpn)}>{mode.rpn}</Badge>
                          </TableCell>
                          <TableCell className="max-w-[150px] truncate">{mode.recommendedAction}</TableCell>
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

          <Button onClick={() => saveData()}>Save DFMEA</Button>
        </CardContent>
      </Card>
    </div>
  );
}
