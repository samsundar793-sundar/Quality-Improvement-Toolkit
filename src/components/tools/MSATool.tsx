import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Gauge, Plus, Trash2 } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";
import { useToast } from "@/hooks/use-toast";

interface MSAStudy {
  id: string;
  gageId: string;
  characteristic: string;
  specification: string;
  resolution: string;
  studyType: 'gage-rr' | 'bias' | 'linearity' | 'stability';
  result: string;
  grr: string;
  ndc: string;
  status: 'acceptable' | 'marginal' | 'unacceptable' | 'pending';
}

export function MSATool() {
  const { currentProject, updateToolData, getToolData } = useProject();
  const { toast } = useToast();
  const savedData = currentProject ? getToolData('measurement-system-analysis') : null;

  const [studies, setStudies] = useState<MSAStudy[]>(savedData?.studies || []);
  const [newStudy, setNewStudy] = useState<Omit<MSAStudy, 'id'>>({
    gageId: '', characteristic: '', specification: '', resolution: '', studyType: 'gage-rr', result: '', grr: '', ndc: '', status: 'pending'
  });

  const saveData = (data?: MSAStudy[]) => {
    if (currentProject) {
      updateToolData('measurement-system-analysis', { studies: data || studies });
      toast({ title: "Saved", description: "MSA data saved" });
    }
  };

  const addStudy = () => {
    if (!newStudy.characteristic) return;
    const updated = [...studies, { ...newStudy, id: Date.now().toString() }];
    setStudies(updated);
    setNewStudy({ gageId: '', characteristic: '', specification: '', resolution: '', studyType: 'gage-rr', result: '', grr: '', ndc: '', status: 'pending' });
    saveData(updated);
  };

  const updateStudy = (id: string, field: string, value: string) => {
    const updated = studies.map(s => s.id === id ? { ...s, [field]: value } : s);
    setStudies(updated);
    saveData(updated);
  };

  const statusColor = (s: string) => {
    switch (s) { case 'acceptable': return 'bg-green-500 text-white'; case 'marginal': return 'bg-yellow-500 text-black'; case 'unacceptable': return 'bg-destructive text-destructive-foreground'; default: return 'bg-muted text-muted-foreground'; }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10"><Gauge className="h-6 w-6 text-primary" /></div>
            <div>
              <CardTitle>Measurement System Analysis (MSA)</CardTitle>
              <CardDescription>Evaluate measurement system capability and reliability</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div><Label>Characteristic *</Label><Input value={newStudy.characteristic} onChange={e => setNewStudy({ ...newStudy, characteristic: e.target.value })} placeholder="What is measured?" /></div>
            <div><Label>Gage ID</Label><Input value={newStudy.gageId} onChange={e => setNewStudy({ ...newStudy, gageId: e.target.value })} placeholder="Gage identifier" /></div>
            <div><Label>Specification</Label><Input value={newStudy.specification} onChange={e => setNewStudy({ ...newStudy, specification: e.target.value })} placeholder="Spec range" /></div>
            <div><Label>Study Type</Label>
              <Select value={newStudy.studyType} onValueChange={(v: any) => setNewStudy({ ...newStudy, studyType: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="gage-rr">Gage R&R</SelectItem>
                  <SelectItem value="bias">Bias</SelectItem>
                  <SelectItem value="linearity">Linearity</SelectItem>
                  <SelectItem value="stability">Stability</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={addStudy} size="sm"><Plus className="h-4 w-4 mr-1" />Add MSA Study</Button>

          {studies.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Characteristic</TableHead>
                    <TableHead>Gage ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>%GRR</TableHead>
                    <TableHead>ndc</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studies.map(s => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.characteristic}</TableCell>
                      <TableCell>{s.gageId}</TableCell>
                      <TableCell><Badge variant="outline">{s.studyType}</Badge></TableCell>
                      <TableCell><Input className="w-20" value={s.grr} onChange={e => updateStudy(s.id, 'grr', e.target.value)} placeholder="%" /></TableCell>
                      <TableCell><Input className="w-16" value={s.ndc} onChange={e => updateStudy(s.id, 'ndc', e.target.value)} placeholder="#" /></TableCell>
                      <TableCell>
                        <Select value={s.status} onValueChange={v => updateStudy(s.id, 'status', v)}>
                          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="acceptable">Acceptable</SelectItem>
                            <SelectItem value="marginal">Marginal</SelectItem>
                            <SelectItem value="unacceptable">Unacceptable</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell><Button variant="ghost" size="sm" onClick={() => { const u = studies.filter(x => x.id !== s.id); setStudies(u); saveData(u); }}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <Button onClick={() => saveData()}>Save MSA</Button>
        </CardContent>
      </Card>
    </div>
  );
}
