import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Plus, Trash2 } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";
import { useToast } from "@/hooks/use-toast";

interface Criterion {
  id: string;
  name: string;
  weight: number;
}

interface ConceptOption {
  id: string;
  name: string;
  scores: Record<string, number>; // criterionId -> score (1-5)
}

export function ConceptSelectionTool() {
  const { currentProject, updateToolData, getToolData } = useProject();
  const { toast } = useToast();
  const savedData = currentProject ? getToolData('concept-selection') : null;

  const [criteria, setCriteria] = useState<Criterion[]>(savedData?.criteria || []);
  const [concepts, setConcepts] = useState<ConceptOption[]>(savedData?.concepts || []);
  const [newCriterion, setNewCriterion] = useState({ name: '', weight: 1 });
  const [newConcept, setNewConcept] = useState('');

  const saveData = (crit?: Criterion[], con?: ConceptOption[]) => {
    if (currentProject) {
      updateToolData('concept-selection', { criteria: crit || criteria, concepts: con || concepts });
      toast({ title: "Saved", description: "Concept selection saved" });
    }
  };

  const addCriterion = () => {
    if (!newCriterion.name) return;
    const c: Criterion = { ...newCriterion, id: Date.now().toString() };
    const updated = [...criteria, c];
    setCriteria(updated);
    setNewCriterion({ name: '', weight: 1 });
    saveData(updated, concepts);
  };

  const addConcept = () => {
    if (!newConcept) return;
    const c: ConceptOption = { id: Date.now().toString(), name: newConcept, scores: {} };
    const updated = [...concepts, c];
    setConcepts(updated);
    setNewConcept('');
    saveData(criteria, updated);
  };

  const setScore = (conceptId: string, criterionId: string, score: number) => {
    const updated = concepts.map(c =>
      c.id === conceptId ? { ...c, scores: { ...c.scores, [criterionId]: score } } : c
    );
    setConcepts(updated);
    saveData(criteria, updated);
  };

  const getWeightedScore = (concept: ConceptOption) => {
    return criteria.reduce((sum, cr) => sum + (concept.scores[cr.id] || 0) * cr.weight, 0);
  };

  const bestConcept = concepts.length > 0 ? concepts.reduce((best, c) => getWeightedScore(c) > getWeightedScore(best) ? c : best) : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10"><CheckCircle className="h-6 w-6 text-primary" /></div>
            <div>
              <CardTitle>Concept Selection Matrix</CardTitle>
              <CardDescription>Evaluate and select the best design concept using weighted criteria</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-dashed">
              <CardHeader><CardTitle className="text-lg">Evaluation Criteria</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <div className="flex-1"><Input value={newCriterion.name} onChange={e => setNewCriterion({ ...newCriterion, name: e.target.value })} placeholder="Criterion name" /></div>
                  <div className="w-20"><Input type="number" min={1} max={10} value={newCriterion.weight} onChange={e => setNewCriterion({ ...newCriterion, weight: parseInt(e.target.value) || 1 })} /></div>
                  <Button onClick={addCriterion} size="sm"><Plus className="h-4 w-4" /></Button>
                </div>
                {criteria.map(c => (
                  <div key={c.id} className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
                    <span>{c.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Weight: {c.weight}</Badge>
                      <Button variant="ghost" size="sm" onClick={() => { const u = criteria.filter(x => x.id !== c.id); setCriteria(u); saveData(u, concepts); }}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-dashed">
              <CardHeader><CardTitle className="text-lg">Concepts</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input value={newConcept} onChange={e => setNewConcept(e.target.value)} placeholder="Concept name" />
                  <Button onClick={addConcept} size="sm"><Plus className="h-4 w-4" /></Button>
                </div>
                {concepts.map(c => (
                  <div key={c.id} className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
                    <span>{c.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={bestConcept?.id === c.id ? 'default' : 'outline'}>Score: {getWeightedScore(c).toFixed(1)}</Badge>
                      <Button variant="ghost" size="sm" onClick={() => { const u = concepts.filter(x => x.id !== c.id); setConcepts(u); saveData(criteria, u); }}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {criteria.length > 0 && concepts.length > 0 && (
            <Card className="border-dashed">
              <CardHeader><CardTitle className="text-lg">Scoring Matrix (1-5)</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Criterion (Weight)</TableHead>
                        {concepts.map(c => <TableHead key={c.id} className="text-center">{c.name}</TableHead>)}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {criteria.map(cr => (
                        <TableRow key={cr.id}>
                          <TableCell className="font-medium">{cr.name} ({cr.weight})</TableCell>
                          {concepts.map(co => (
                            <TableCell key={co.id} className="text-center">
                              <Input type="number" min={1} max={5} className="w-16 mx-auto text-center" value={co.scores[cr.id] || ''} onChange={e => setScore(co.id, cr.id, parseInt(e.target.value) || 0)} />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                      <TableRow className="font-bold bg-muted/50">
                        <TableCell>Weighted Total</TableCell>
                        {concepts.map(c => <TableCell key={c.id} className="text-center">{getWeightedScore(c).toFixed(1)}</TableCell>)}
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          <Button onClick={() => saveData()}>Save Selection Matrix</Button>
        </CardContent>
      </Card>
    </div>
  );
}
