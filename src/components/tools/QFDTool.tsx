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

interface Requirement {
  id: string;
  description: string;
  importance: number;
}

interface TechnicalSpec {
  id: string;
  description: string;
  direction: 'maximize' | 'minimize' | 'target';
}

interface Relationship {
  reqId: string;
  specId: string;
  strength: number; // 0, 1, 3, 9
}

export function QFDTool() {
  const { currentProject, updateToolData, getToolData } = useProject();
  const { toast } = useToast();
  const savedData = currentProject ? getToolData('qfd') : null;

  const [requirements, setRequirements] = useState<Requirement[]>(savedData?.requirements || []);
  const [specs, setSpecs] = useState<TechnicalSpec[]>(savedData?.specs || []);
  const [relationships, setRelationships] = useState<Relationship[]>(savedData?.relationships || []);
  const [newReq, setNewReq] = useState({ description: '', importance: 5 });
  const [newSpec, setNewSpec] = useState({ description: '', direction: 'maximize' as const });

  const saveData = (reqs?: Requirement[], sps?: TechnicalSpec[], rels?: Relationship[]) => {
    if (currentProject) {
      updateToolData('qfd', {
        requirements: reqs || requirements,
        specs: sps || specs,
        relationships: rels || relationships,
      });
      toast({ title: "Saved", description: "QFD data saved successfully" });
    }
  };

  const addRequirement = () => {
    if (!newReq.description) return;
    const req: Requirement = { ...newReq, id: Date.now().toString() };
    const updated = [...requirements, req];
    setRequirements(updated);
    setNewReq({ description: '', importance: 5 });
    saveData(updated, specs, relationships);
  };

  const addSpec = () => {
    if (!newSpec.description) return;
    const spec: TechnicalSpec = { ...newSpec, id: Date.now().toString() };
    const updated = [...specs, spec];
    setSpecs(updated);
    setNewSpec({ description: '', direction: 'maximize' });
    saveData(requirements, updated, relationships);
  };

  const setRelationship = (reqId: string, specId: string, strength: number) => {
    const updated = relationships.filter(r => !(r.reqId === reqId && r.specId === specId));
    if (strength > 0) updated.push({ reqId, specId, strength });
    setRelationships(updated);
    saveData(requirements, specs, updated);
  };

  const getRelationship = (reqId: string, specId: string) => {
    return relationships.find(r => r.reqId === reqId && r.specId === specId)?.strength || 0;
  };

  const strengthSymbol = (s: number) => s === 9 ? '●' : s === 3 ? '○' : s === 1 ? '△' : '';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10"><Factory className="h-6 w-6 text-primary" /></div>
            <div>
              <CardTitle>QFD - House of Quality</CardTitle>
              <CardDescription>Map customer requirements to technical specifications</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Customer Requirements */}
          <Card className="border-dashed">
            <CardHeader><CardTitle className="text-lg">Customer Requirements (WHATs)</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-1">
                  <Label>Requirement</Label>
                  <Input value={newReq.description} onChange={e => setNewReq({ ...newReq, description: e.target.value })} placeholder="What does the customer need?" />
                </div>
                <div className="w-32">
                  <Label>Importance (1-10)</Label>
                  <Input type="number" min={1} max={10} value={newReq.importance} onChange={e => setNewReq({ ...newReq, importance: parseInt(e.target.value) || 5 })} />
                </div>
                <div className="flex items-end"><Button onClick={addRequirement} size="sm"><Plus className="h-4 w-4 mr-1" />Add</Button></div>
              </div>
              {requirements.map(r => (
                <div key={r.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span>{r.description}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Importance: {r.importance}</Badge>
                    <Button variant="ghost" size="sm" onClick={() => { const u = requirements.filter(x => x.id !== r.id); setRequirements(u); saveData(u, specs, relationships); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Technical Specifications */}
          <Card className="border-dashed">
            <CardHeader><CardTitle className="text-lg">Technical Specifications (HOWs)</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-1">
                  <Label>Specification</Label>
                  <Input value={newSpec.description} onChange={e => setNewSpec({ ...newSpec, description: e.target.value })} placeholder="Technical measure" />
                </div>
                <div className="w-40">
                  <Label>Direction</Label>
                  <Select value={newSpec.direction} onValueChange={(v: any) => setNewSpec({ ...newSpec, direction: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maximize">↑ Maximize</SelectItem>
                      <SelectItem value="minimize">↓ Minimize</SelectItem>
                      <SelectItem value="target">◎ Target</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end"><Button onClick={addSpec} size="sm"><Plus className="h-4 w-4 mr-1" />Add</Button></div>
              </div>
              {specs.map(s => (
                <div key={s.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span>{s.description}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{s.direction === 'maximize' ? '↑' : s.direction === 'minimize' ? '↓' : '◎'}</Badge>
                    <Button variant="ghost" size="sm" onClick={() => { const u = specs.filter(x => x.id !== s.id); setSpecs(u); saveData(requirements, u, relationships); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Relationship Matrix */}
          {requirements.length > 0 && specs.length > 0 && (
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="text-lg">Relationship Matrix</CardTitle>
                <CardDescription>● Strong (9) ○ Moderate (3) △ Weak (1)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Requirement</TableHead>
                        {specs.map(s => <TableHead key={s.id} className="text-center text-xs min-w-[80px]">{s.description}</TableHead>)}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requirements.map(r => (
                        <TableRow key={r.id}>
                          <TableCell className="font-medium">{r.description}</TableCell>
                          {specs.map(s => (
                            <TableCell key={s.id} className="text-center">
                              <Select value={String(getRelationship(r.id, s.id))} onValueChange={v => setRelationship(r.id, s.id, parseInt(v))}>
                                <SelectTrigger className="w-16 mx-auto"><SelectValue>{strengthSymbol(getRelationship(r.id, s.id)) || '-'}</SelectValue></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="0">None</SelectItem>
                                  <SelectItem value="1">△ Weak</SelectItem>
                                  <SelectItem value="3">○ Moderate</SelectItem>
                                  <SelectItem value="9">● Strong</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          <Button onClick={() => saveData()}>Save QFD</Button>
        </CardContent>
      </Card>
    </div>
  );
}
