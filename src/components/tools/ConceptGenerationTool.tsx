import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Plus, Trash2 } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";
import { useToast } from "@/hooks/use-toast";

interface Concept {
  id: string;
  name: string;
  description: string;
  advantages: string;
  disadvantages: string;
  feasibility: 'high' | 'medium' | 'low';
  innovationLevel: 'incremental' | 'moderate' | 'breakthrough';
}

export function ConceptGenerationTool() {
  const { currentProject, updateToolData, getToolData } = useProject();
  const { toast } = useToast();
  const savedData = currentProject ? getToolData('concept-generation') : null;

  const [designChallenge, setDesignChallenge] = useState(savedData?.designChallenge || '');
  const [concepts, setConcepts] = useState<Concept[]>(savedData?.concepts || []);
  const [newConcept, setNewConcept] = useState<Omit<Concept, 'id'>>({
    name: '', description: '', advantages: '', disadvantages: '', feasibility: 'medium', innovationLevel: 'moderate'
  });

  const saveData = (c?: Concept[], challenge?: string) => {
    if (currentProject) {
      updateToolData('concept-generation', { designChallenge: challenge ?? designChallenge, concepts: c || concepts });
      toast({ title: "Saved", description: "Concepts saved successfully" });
    }
  };

  const addConcept = () => {
    if (!newConcept.name) return;
    const concept: Concept = { ...newConcept, id: Date.now().toString() };
    const updated = [...concepts, concept];
    setConcepts(updated);
    setNewConcept({ name: '', description: '', advantages: '', disadvantages: '', feasibility: 'medium', innovationLevel: 'moderate' });
    saveData(updated);
  };

  const removeConcept = (id: string) => {
    const updated = concepts.filter(c => c.id !== id);
    setConcepts(updated);
    saveData(updated);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10"><Lightbulb className="h-6 w-6 text-primary" /></div>
            <div>
              <CardTitle>Concept Generation</CardTitle>
              <CardDescription>Generate and document design concepts for evaluation</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Design Challenge / Problem Statement</Label>
            <Textarea value={designChallenge} onChange={e => setDesignChallenge(e.target.value)} placeholder="What design challenge are we solving?" rows={2} />
          </div>

          <Card className="border-dashed">
            <CardHeader><CardTitle className="text-lg">Add New Concept</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><Label>Concept Name *</Label><Input value={newConcept.name} onChange={e => setNewConcept({ ...newConcept, name: e.target.value })} placeholder="Name this concept" /></div>
                <div><Label>Description</Label><Input value={newConcept.description} onChange={e => setNewConcept({ ...newConcept, description: e.target.value })} placeholder="Brief description" /></div>
                <div><Label>Advantages</Label><Textarea value={newConcept.advantages} onChange={e => setNewConcept({ ...newConcept, advantages: e.target.value })} placeholder="Key advantages" rows={2} /></div>
                <div><Label>Disadvantages</Label><Textarea value={newConcept.disadvantages} onChange={e => setNewConcept({ ...newConcept, disadvantages: e.target.value })} placeholder="Key disadvantages" rows={2} /></div>
              </div>
              <Button onClick={addConcept} size="sm"><Plus className="h-4 w-4 mr-1" />Add Concept</Button>
            </CardContent>
          </Card>

          {concepts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {concepts.map(c => (
                <Card key={c.id}>
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle className="text-lg">{c.name}</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => removeConcept(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                    <CardDescription>{c.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {c.advantages && <div><span className="font-medium text-green-600">✓ Advantages:</span> {c.advantages}</div>}
                    {c.disadvantages && <div><span className="font-medium text-destructive">✗ Disadvantages:</span> {c.disadvantages}</div>}
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">Feasibility: {c.feasibility}</Badge>
                      <Badge variant="outline">Innovation: {c.innovationLevel}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Button onClick={() => saveData()}>Save Concepts</Button>
        </CardContent>
      </Card>
    </div>
  );
}
