import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, Plus, Trash2 } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";
import { useToast } from "@/hooks/use-toast";

interface ScorecardItem {
  id: string;
  metric: string;
  target: string;
  actual: string;
  unit: string;
  status: 'on-track' | 'at-risk' | 'off-track' | 'not-started';
  weight: number;
}

export function DesignScorecardTool() {
  const { currentProject, updateToolData, getToolData } = useProject();
  const { toast } = useToast();
  const savedData = currentProject ? getToolData('design-scorecard') : null;

  const [items, setItems] = useState<ScorecardItem[]>(savedData?.items || []);
  const [newItem, setNewItem] = useState({ metric: '', target: '', actual: '', unit: '', status: 'not-started' as const, weight: 1 });

  const saveData = (data?: ScorecardItem[]) => {
    if (currentProject) {
      updateToolData('design-scorecard', { items: data || items });
      toast({ title: "Saved", description: "Design Scorecard saved successfully" });
    }
  };

  const addItem = () => {
    if (!newItem.metric) return;
    const item: ScorecardItem = { ...newItem, id: Date.now().toString() };
    const updated = [...items, item];
    setItems(updated);
    setNewItem({ metric: '', target: '', actual: '', unit: '', status: 'not-started', weight: 1 });
    saveData(updated);
  };

  const removeItem = (id: string) => {
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    saveData(updated);
  };

  const updateItem = (id: string, field: string, value: string | number) => {
    const updated = items.map(i => i.id === id ? { ...i, [field]: value } : i);
    setItems(updated);
    saveData(updated);
  };

  const statusColor = (s: string) => {
    switch (s) {
      case 'on-track': return 'bg-green-500 text-white';
      case 'at-risk': return 'bg-yellow-500 text-black';
      case 'off-track': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const overallScore = items.length > 0
    ? (items.filter(i => i.status === 'on-track').length / items.length * 100).toFixed(0)
    : '0';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10"><ClipboardCheck className="h-6 w-6 text-primary" /></div>
            <div>
              <CardTitle>Design Scorecard</CardTitle>
              <CardDescription>Track design performance metrics against targets</CardDescription>
            </div>
          </div>
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground">Overall Score</div>
            <div className="text-3xl font-bold">{overallScore}%</div>
            <div className="text-xs text-muted-foreground">{items.filter(i => i.status === 'on-track').length} of {items.length} metrics on track</div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <div className="md:col-span-2"><Label>Metric *</Label><Input value={newItem.metric} onChange={e => setNewItem({ ...newItem, metric: e.target.value })} placeholder="Performance metric" /></div>
            <div><Label>Target</Label><Input value={newItem.target} onChange={e => setNewItem({ ...newItem, target: e.target.value })} placeholder="Target value" /></div>
            <div><Label>Actual</Label><Input value={newItem.actual} onChange={e => setNewItem({ ...newItem, actual: e.target.value })} placeholder="Actual value" /></div>
            <div><Label>Unit</Label><Input value={newItem.unit} onChange={e => setNewItem({ ...newItem, unit: e.target.value })} placeholder="mm, %, etc." /></div>
            <div className="flex items-end"><Button onClick={addItem} size="sm"><Plus className="h-4 w-4 mr-1" />Add</Button></div>
          </div>

          {items.length > 0 && (
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
                {items.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.metric}</TableCell>
                    <TableCell>{item.target}</TableCell>
                    <TableCell>
                      <Input className="w-24" value={item.actual} onChange={e => updateItem(item.id, 'actual', e.target.value)} />
                    </TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>
                      <Select value={item.status} onValueChange={v => updateItem(item.id, 'status', v)}>
                        <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not-started">Not Started</SelectItem>
                          <SelectItem value="on-track">On Track</SelectItem>
                          <SelectItem value="at-risk">At Risk</SelectItem>
                          <SelectItem value="off-track">Off Track</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell><Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <Button onClick={() => saveData()}>Save Scorecard</Button>
        </CardContent>
      </Card>
    </div>
  );
}
