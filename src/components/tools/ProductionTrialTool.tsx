import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Factory, Plus, Trash2 } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";
import { useToast } from "@/hooks/use-toast";

interface TrialMetric {
  id: string;
  metric: string;
  target: string;
  actual: string;
  unit: string;
  status: 'pass' | 'fail' | 'pending';
}

export function ProductionTrialTool() {
  const { currentProject, updateToolData, getToolData } = useProject();
  const { toast } = useToast();
  const savedData = currentProject ? getToolData('production-trial') : null;

  const [trialInfo, setTrialInfo] = useState({
    trialDate: savedData?.trialInfo?.trialDate || '',
    trialQuantity: savedData?.trialInfo?.trialQuantity || '',
    lineRate: savedData?.trialInfo?.lineRate || '',
    duration: savedData?.trialInfo?.duration || '',
    overallResult: savedData?.trialInfo?.overallResult || 'pending',
    observations: savedData?.trialInfo?.observations || '',
  });
  const [metrics, setMetrics] = useState<TrialMetric[]>(savedData?.metrics || []);
  const [newMetric, setNewMetric] = useState<Omit<TrialMetric, 'id'>>({
    metric: '', target: '', actual: '', unit: '', status: 'pending'
  });

  const saveData = (data?: TrialMetric[]) => {
    if (currentProject) {
      updateToolData('production-trial', { trialInfo, metrics: data || metrics });
      toast({ title: "Saved", description: "Production trial data saved" });
    }
  };

  const addMetric = () => {
    if (!newMetric.metric) return;
    const updated = [...metrics, { ...newMetric, id: Date.now().toString() }];
    setMetrics(updated);
    setNewMetric({ metric: '', target: '', actual: '', unit: '', status: 'pending' });
    saveData(updated);
  };

  const updateMetric = (id: string, field: string, value: string) => {
    const updated = metrics.map(m => m.id === id ? { ...m, [field]: value } : m);
    setMetrics(updated);
    saveData(updated);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10"><Factory className="h-6 w-6 text-primary" /></div>
            <div>
              <CardTitle>Production Trial Run</CardTitle>
              <CardDescription>Document and evaluate production trial run results</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div><Label>Trial Date</Label><Input type="date" value={trialInfo.trialDate} onChange={e => setTrialInfo({ ...trialInfo, trialDate: e.target.value })} /></div>
            <div><Label>Trial Quantity</Label><Input value={trialInfo.trialQuantity} onChange={e => setTrialInfo({ ...trialInfo, trialQuantity: e.target.value })} placeholder="# of parts" /></div>
            <div><Label>Line Rate</Label><Input value={trialInfo.lineRate} onChange={e => setTrialInfo({ ...trialInfo, lineRate: e.target.value })} placeholder="Parts/hour" /></div>
            <div><Label>Duration</Label><Input value={trialInfo.duration} onChange={e => setTrialInfo({ ...trialInfo, duration: e.target.value })} placeholder="Hours" /></div>
          </div>

          <div>
            <Label>Overall Result</Label>
            <Select value={trialInfo.overallResult} onValueChange={v => setTrialInfo({ ...trialInfo, overallResult: v })}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="pass">Pass</SelectItem>
                <SelectItem value="conditional">Conditional</SelectItem>
                <SelectItem value="fail">Fail</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card className="border-dashed">
            <CardHeader><CardTitle className="text-lg">Trial Metrics</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div><Label>Metric *</Label><Input value={newMetric.metric} onChange={e => setNewMetric({ ...newMetric, metric: e.target.value })} placeholder="e.g. Yield Rate" /></div>
                <div><Label>Target</Label><Input value={newMetric.target} onChange={e => setNewMetric({ ...newMetric, target: e.target.value })} placeholder="Target value" /></div>
                <div><Label>Actual</Label><Input value={newMetric.actual} onChange={e => setNewMetric({ ...newMetric, actual: e.target.value })} placeholder="Actual value" /></div>
                <div><Label>Unit</Label><Input value={newMetric.unit} onChange={e => setNewMetric({ ...newMetric, unit: e.target.value })} placeholder="%, ppm" /></div>
                <div className="flex items-end"><Button onClick={addMetric} size="sm"><Plus className="h-4 w-4 mr-1" />Add</Button></div>
              </div>

              {metrics.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Actual</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {metrics.map(m => (
                      <TableRow key={m.id}>
                        <TableCell className="font-medium">{m.metric}</TableCell>
                        <TableCell>{m.target}</TableCell>
                        <TableCell><Input className="w-24" value={m.actual} onChange={e => updateMetric(m.id, 'actual', e.target.value)} /></TableCell>
                        <TableCell>{m.unit}</TableCell>
                        <TableCell>
                          <Select value={m.status} onValueChange={v => updateMetric(m.id, 'status', v)}>
                            <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="pass">Pass</SelectItem>
                              <SelectItem value="fail">Fail</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell><Button variant="ghost" size="sm" onClick={() => { const u = metrics.filter(x => x.id !== m.id); setMetrics(u); saveData(u); }}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <div><Label>Observations & Notes</Label><Textarea value={trialInfo.observations} onChange={e => setTrialInfo({ ...trialInfo, observations: e.target.value })} placeholder="Key observations from the trial run" rows={3} /></div>

          <Button onClick={() => saveData()}>Save Trial Run</Button>
        </CardContent>
      </Card>
    </div>
  );
}
