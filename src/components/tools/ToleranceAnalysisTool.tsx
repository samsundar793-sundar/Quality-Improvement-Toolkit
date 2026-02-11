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

interface Dimension {
  id: string;
  name: string;
  nominal: number;
  upperTol: number;
  lowerTol: number;
  distribution: 'normal' | 'uniform';
}

export function ToleranceAnalysisTool() {
  const { currentProject, updateToolData, getToolData } = useProject();
  const { toast } = useToast();
  const savedData = currentProject ? getToolData('tolerance-analysis') : null;

  const [assemblyName, setAssemblyName] = useState(savedData?.assemblyName || '');
  const [dimensions, setDimensions] = useState<Dimension[]>(savedData?.dimensions || []);
  const [newDim, setNewDim] = useState({ name: '', nominal: 0, upperTol: 0, lowerTol: 0, distribution: 'normal' as const });

  const saveData = (dims?: Dimension[]) => {
    if (currentProject) {
      updateToolData('tolerance-analysis', { assemblyName, dimensions: dims || dimensions });
      toast({ title: "Saved", description: "Tolerance analysis saved" });
    }
  };

  const addDimension = () => {
    if (!newDim.name) return;
    const dim: Dimension = { ...newDim, id: Date.now().toString() };
    const updated = [...dimensions, dim];
    setDimensions(updated);
    setNewDim({ name: '', nominal: 0, upperTol: 0, lowerTol: 0, distribution: 'normal' });
    saveData(updated);
  };

  const removeDimension = (id: string) => {
    const updated = dimensions.filter(d => d.id !== id);
    setDimensions(updated);
    saveData(updated);
  };

  // Worst-case stackup
  const worstCaseNominal = dimensions.reduce((sum, d) => sum + d.nominal, 0);
  const worstCaseUpperTol = dimensions.reduce((sum, d) => sum + d.upperTol, 0);
  const worstCaseLowerTol = dimensions.reduce((sum, d) => sum + d.lowerTol, 0);

  // RSS (Root Sum of Squares) stackup
  const rssUpperTol = Math.sqrt(dimensions.reduce((sum, d) => sum + d.upperTol ** 2, 0));
  const rssLowerTol = Math.sqrt(dimensions.reduce((sum, d) => sum + d.lowerTol ** 2, 0));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10"><Gauge className="h-6 w-6 text-primary" /></div>
            <div>
              <CardTitle>Tolerance Analysis</CardTitle>
              <CardDescription>Design tolerance stackup analysis (Worst-Case & RSS)</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div><Label>Assembly Name</Label><Input value={assemblyName} onChange={e => setAssemblyName(e.target.value)} placeholder="Name of assembly" /></div>

          <Card className="border-dashed">
            <CardHeader><CardTitle className="text-lg">Dimensions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div><Label>Name *</Label><Input value={newDim.name} onChange={e => setNewDim({ ...newDim, name: e.target.value })} placeholder="Dimension" /></div>
                <div><Label>Nominal</Label><Input type="number" step="0.001" value={newDim.nominal} onChange={e => setNewDim({ ...newDim, nominal: parseFloat(e.target.value) || 0 })} /></div>
                <div><Label>Upper Tol (+)</Label><Input type="number" step="0.001" value={newDim.upperTol} onChange={e => setNewDim({ ...newDim, upperTol: parseFloat(e.target.value) || 0 })} /></div>
                <div><Label>Lower Tol (-)</Label><Input type="number" step="0.001" value={newDim.lowerTol} onChange={e => setNewDim({ ...newDim, lowerTol: parseFloat(e.target.value) || 0 })} /></div>
                <div className="flex items-end"><Button onClick={addDimension} size="sm"><Plus className="h-4 w-4 mr-1" />Add</Button></div>
              </div>

              {dimensions.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dimension</TableHead>
                      <TableHead>Nominal</TableHead>
                      <TableHead>Upper (+)</TableHead>
                      <TableHead>Lower (-)</TableHead>
                      <TableHead>Range</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dimensions.map(d => (
                      <TableRow key={d.id}>
                        <TableCell className="font-medium">{d.name}</TableCell>
                        <TableCell>{d.nominal.toFixed(3)}</TableCell>
                        <TableCell>+{d.upperTol.toFixed(3)}</TableCell>
                        <TableCell>-{d.lowerTol.toFixed(3)}</TableCell>
                        <TableCell>{(d.upperTol + d.lowerTol).toFixed(3)}</TableCell>
                        <TableCell><Button variant="ghost" size="sm" onClick={() => removeDimension(d.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {dimensions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-muted/50">
                <CardHeader><CardTitle className="text-lg">Worst-Case Stackup</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between"><span>Nominal:</span><span className="font-bold">{worstCaseNominal.toFixed(3)}</span></div>
                  <div className="flex justify-between"><span>Max:</span><span className="font-bold">{(worstCaseNominal + worstCaseUpperTol).toFixed(3)}</span></div>
                  <div className="flex justify-between"><span>Min:</span><span className="font-bold">{(worstCaseNominal - worstCaseLowerTol).toFixed(3)}</span></div>
                  <div className="flex justify-between"><span>Total Tolerance:</span><Badge variant="outline">{(worstCaseUpperTol + worstCaseLowerTol).toFixed(3)}</Badge></div>
                </CardContent>
              </Card>
              <Card className="bg-primary/5">
                <CardHeader><CardTitle className="text-lg">RSS Statistical Stackup</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between"><span>Nominal:</span><span className="font-bold">{worstCaseNominal.toFixed(3)}</span></div>
                  <div className="flex justify-between"><span>Max:</span><span className="font-bold">{(worstCaseNominal + rssUpperTol).toFixed(3)}</span></div>
                  <div className="flex justify-between"><span>Min:</span><span className="font-bold">{(worstCaseNominal - rssLowerTol).toFixed(3)}</span></div>
                  <div className="flex justify-between"><span>Total Tolerance:</span><Badge>{(rssUpperTol + rssLowerTol).toFixed(3)}</Badge></div>
                </CardContent>
              </Card>
            </div>
          )}

          <Button onClick={() => saveData()}>Save Tolerance Analysis</Button>
        </CardContent>
      </Card>
    </div>
  );
}
