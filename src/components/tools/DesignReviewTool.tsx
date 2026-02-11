import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Microscope, Plus, Trash2 } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";
import { useToast } from "@/hooks/use-toast";

interface ReviewItem {
  id: string;
  area: string;
  question: string;
  finding: string;
  severity: 'info' | 'minor' | 'major' | 'critical';
  actionRequired: string;
  owner: string;
  status: 'open' | 'in-progress' | 'closed';
}

export function DesignReviewTool() {
  const { currentProject, updateToolData, getToolData } = useProject();
  const { toast } = useToast();
  const savedData = currentProject ? getToolData('design-review') : null;

  const [reviewInfo, setReviewInfo] = useState({
    reviewDate: savedData?.reviewInfo?.reviewDate || '',
    designPhase: savedData?.reviewInfo?.designPhase || '',
    reviewTeam: savedData?.reviewInfo?.reviewTeam || '',
    objective: savedData?.reviewInfo?.objective || '',
  });
  const [items, setItems] = useState<ReviewItem[]>(savedData?.items || []);
  const [newItem, setNewItem] = useState<Omit<ReviewItem, 'id'>>({
    area: '', question: '', finding: '', severity: 'minor', actionRequired: '', owner: '', status: 'open'
  });

  const saveData = (data?: ReviewItem[]) => {
    if (currentProject) {
      updateToolData('design-review', { reviewInfo, items: data || items });
      toast({ title: "Saved", description: "Design review saved" });
    }
  };

  const addItem = () => {
    if (!newItem.area) return;
    const updated = [...items, { ...newItem, id: Date.now().toString() }];
    setItems(updated);
    setNewItem({ area: '', question: '', finding: '', severity: 'minor', actionRequired: '', owner: '', status: 'open' });
    saveData(updated);
  };

  const updateItem = (id: string, field: string, value: string) => {
    const updated = items.map(i => i.id === id ? { ...i, [field]: value } : i);
    setItems(updated);
    saveData(updated);
  };

  const sevColor = (s: string) => {
    switch (s) { case 'critical': return 'bg-destructive text-destructive-foreground'; case 'major': return 'bg-orange-500 text-white'; case 'minor': return 'bg-yellow-500 text-black'; default: return 'bg-blue-500 text-white'; }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10"><Microscope className="h-6 w-6 text-primary" /></div>
            <div>
              <CardTitle>Design Review</CardTitle>
              <CardDescription>Formal design evaluation and action tracking</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div><Label>Review Date</Label><Input type="date" value={reviewInfo.reviewDate} onChange={e => setReviewInfo({ ...reviewInfo, reviewDate: e.target.value })} /></div>
            <div><Label>Design Phase</Label><Input value={reviewInfo.designPhase} onChange={e => setReviewInfo({ ...reviewInfo, designPhase: e.target.value })} placeholder="e.g. Concept, Detail, Final" /></div>
            <div><Label>Review Team</Label><Input value={reviewInfo.reviewTeam} onChange={e => setReviewInfo({ ...reviewInfo, reviewTeam: e.target.value })} placeholder="Team members" /></div>
            <div><Label>Objective</Label><Input value={reviewInfo.objective} onChange={e => setReviewInfo({ ...reviewInfo, objective: e.target.value })} placeholder="Review objective" /></div>
          </div>

          <Card className="border-dashed">
            <CardHeader><CardTitle className="text-lg">Review Findings</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div><Label>Area *</Label><Input value={newItem.area} onChange={e => setNewItem({ ...newItem, area: e.target.value })} placeholder="Design area" /></div>
                <div><Label>Finding</Label><Input value={newItem.finding} onChange={e => setNewItem({ ...newItem, finding: e.target.value })} placeholder="What was found?" /></div>
                <div><Label>Severity</Label>
                  <Select value={newItem.severity} onValueChange={(v: any) => setNewItem({ ...newItem, severity: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="minor">Minor</SelectItem>
                      <SelectItem value="major">Major</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><Label>Action Required</Label><Input value={newItem.actionRequired} onChange={e => setNewItem({ ...newItem, actionRequired: e.target.value })} placeholder="What action is needed?" /></div>
                <div><Label>Owner</Label><Input value={newItem.owner} onChange={e => setNewItem({ ...newItem, owner: e.target.value })} placeholder="Responsible person" /></div>
              </div>
              <Button onClick={addItem} size="sm"><Plus className="h-4 w-4 mr-1" />Add Finding</Button>
            </CardContent>
          </Card>

          {items.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Area</TableHead>
                    <TableHead>Finding</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.area}</TableCell>
                      <TableCell>{item.finding}</TableCell>
                      <TableCell><Badge className={sevColor(item.severity)}>{item.severity}</Badge></TableCell>
                      <TableCell>{item.actionRequired}</TableCell>
                      <TableCell>{item.owner}</TableCell>
                      <TableCell>
                        <Select value={item.status} onValueChange={v => updateItem(item.id, 'status', v)}>
                          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell><Button variant="ghost" size="sm" onClick={() => { const u = items.filter(i => i.id !== item.id); setItems(u); saveData(u); }}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <Button onClick={() => saveData()}>Save Design Review</Button>
        </CardContent>
      </Card>
    </div>
  );
}
