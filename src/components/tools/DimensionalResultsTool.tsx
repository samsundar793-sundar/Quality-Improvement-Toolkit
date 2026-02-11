import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Gauge, Plus, Trash2 } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";
import { useToast } from "@/hooks/use-toast";

interface DimensionResult {
  id: string;
  dimNumber: string;
  characteristic: string;
  specification: string;
  tolerance: string;
  actual: string;
  deviation: string;
  status: 'ok' | 'nok' | 'pending';
}

export function DimensionalResultsTool() {
  const { currentProject, updateToolData, getToolData } = useProject();
  const { toast } = useToast();
  const savedData = currentProject ? getToolData('dimensional-results') : null;

  const [partInfo, setPartInfo] = useState({
    partNumber: savedData?.partInfo?.partNumber || '',
    partName: savedData?.partInfo?.partName || '',
    sampleSize: savedData?.partInfo?.sampleSize || '',
  });
  const [results, setResults] = useState<DimensionResult[]>(savedData?.results || []);
  const [newResult, setNewResult] = useState<Omit<DimensionResult, 'id'>>({
    dimNumber: '', characteristic: '', specification: '', tolerance: '', actual: '', deviation: '', status: 'pending'
  });

  const saveData = (data?: DimensionResult[]) => {
    if (currentProject) {
      updateToolData('dimensional-results', { partInfo, results: data || results });
      toast({ title: "Saved", description: "Dimensional results saved" });
    }
  };

  const addResult = () => {
    if (!newResult.characteristic) return;
    const updated = [...results, { ...newResult, id: Date.now().toString() }];
    setResults(updated);
    setNewResult({ dimNumber: '', characteristic: '', specification: '', tolerance: '', actual: '', deviation: '', status: 'pending' });
    saveData(updated);
  };

  const updateResult = (id: string, field: string, value: string) => {
    const updated = results.map(r => r.id === id ? { ...r, [field]: value } : r);
    setResults(updated);
    saveData(updated);
  };

  const okCount = results.filter(r => r.status === 'ok').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10"><Gauge className="h-6 w-6 text-primary" /></div>
            <div>
              <CardTitle>Dimensional Results</CardTitle>
              <CardDescription>Record and track measurement results for PPAP submission</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div><Label>Part Number</Label><Input value={partInfo.partNumber} onChange={e => setPartInfo({ ...partInfo, partNumber: e.target.value })} /></div>
            <div><Label>Part Name</Label><Input value={partInfo.partName} onChange={e => setPartInfo({ ...partInfo, partName: e.target.value })} /></div>
            <div><Label>Sample Size</Label><Input value={partInfo.sampleSize} onChange={e => setPartInfo({ ...partInfo, sampleSize: e.target.value })} /></div>
          </div>

          <div className="p-3 bg-muted/50 rounded-lg flex gap-6">
            <div><span className="text-2xl font-bold text-green-600">{okCount}</span> <span className="text-sm text-muted-foreground">OK</span></div>
            <div><span className="text-2xl font-bold text-destructive">{results.filter(r => r.status === 'nok').length}</span> <span className="text-sm text-muted-foreground">NOK</span></div>
            <div><span className="text-2xl font-bold">{results.filter(r => r.status === 'pending').length}</span> <span className="text-sm text-muted-foreground">Pending</span></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <div><Label>Dim #</Label><Input value={newResult.dimNumber} onChange={e => setNewResult({ ...newResult, dimNumber: e.target.value })} placeholder="#" /></div>
            <div className="md:col-span-2"><Label>Characteristic *</Label><Input value={newResult.characteristic} onChange={e => setNewResult({ ...newResult, characteristic: e.target.value })} placeholder="Dimension name" /></div>
            <div><Label>Specification</Label><Input value={newResult.specification} onChange={e => setNewResult({ ...newResult, specification: e.target.value })} placeholder="Nom ± tol" /></div>
            <div><Label>Actual</Label><Input value={newResult.actual} onChange={e => setNewResult({ ...newResult, actual: e.target.value })} placeholder="Measured" /></div>
            <div className="flex items-end"><Button onClick={addResult} size="sm"><Plus className="h-4 w-4 mr-1" />Add</Button></div>
          </div>

          {results.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Characteristic</TableHead>
                    <TableHead>Specification</TableHead>
                    <TableHead>Actual</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map(r => (
                    <TableRow key={r.id}>
                      <TableCell>{r.dimNumber}</TableCell>
                      <TableCell className="font-medium">{r.characteristic}</TableCell>
                      <TableCell>{r.specification}</TableCell>
                      <TableCell><Input className="w-24" value={r.actual} onChange={e => updateResult(r.id, 'actual', e.target.value)} /></TableCell>
                      <TableCell>
                        <select className="border rounded px-2 py-1 text-sm bg-background" value={r.status} onChange={e => updateResult(r.id, 'status', e.target.value)}>
                          <option value="pending">Pending</option>
                          <option value="ok">OK</option>
                          <option value="nok">NOK</option>
                        </select>
                      </TableCell>
                      <TableCell><Button variant="ghost" size="sm" onClick={() => { const u = results.filter(x => x.id !== r.id); setResults(u); saveData(u); }}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <Button onClick={() => saveData()}>Save Results</Button>
        </CardContent>
      </Card>
    </div>
  );
}
