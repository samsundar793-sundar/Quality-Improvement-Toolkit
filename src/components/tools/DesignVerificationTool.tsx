import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Plus, Trash2 } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";
import { useToast } from "@/hooks/use-toast";

interface VerificationItem {
  id: string;
  requirement: string;
  method: 'test' | 'analysis' | 'inspection' | 'demonstration';
  acceptanceCriteria: string;
  result: string;
  status: 'pass' | 'fail' | 'pending' | 'conditional';
  verifiedBy: string;
  date: string;
}

export function DesignVerificationTool() {
  const { currentProject, updateToolData, getToolData } = useProject();
  const { toast } = useToast();
  const savedData = currentProject ? getToolData('design-verification') : null;

  const [items, setItems] = useState<VerificationItem[]>(savedData?.items || []);
  const [newItem, setNewItem] = useState<Omit<VerificationItem, 'id'>>({
    requirement: '', method: 'test', acceptanceCriteria: '', result: '', status: 'pending', verifiedBy: '', date: ''
  });

  const saveData = (data?: VerificationItem[]) => {
    if (currentProject) {
      updateToolData('design-verification', { items: data || items });
      toast({ title: "Saved", description: "Design verification saved" });
    }
  };

  const addItem = () => {
    if (!newItem.requirement) return;
    const item: VerificationItem = { ...newItem, id: Date.now().toString() };
    const updated = [...items, item];
    setItems(updated);
    setNewItem({ requirement: '', method: 'test', acceptanceCriteria: '', result: '', status: 'pending', verifiedBy: '', date: '' });
    saveData(updated);
  };

  const updateItem = (id: string, field: string, value: string) => {
    const updated = items.map(i => i.id === id ? { ...i, [field]: value } : i);
    setItems(updated);
    saveData(updated);
  };

  const statusColor = (s: string) => {
    switch (s) { case 'pass': return 'bg-green-500 text-white'; case 'fail': return 'bg-destructive text-destructive-foreground'; case 'conditional': return 'bg-yellow-500 text-black'; default: return 'bg-muted text-muted-foreground'; }
  };

  const passed = items.filter(i => i.status === 'pass').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10"><CheckCircle className="h-6 w-6 text-primary" /></div>
            <div>
              <CardTitle>Design Verification</CardTitle>
              <CardDescription>Verify design meets all requirements through TAID methods</CardDescription>
            </div>
          </div>
          <div className="mt-4 p-4 bg-muted/50 rounded-lg flex gap-6">
            <div><div className="text-2xl font-bold">{passed}/{items.length}</div><div className="text-xs text-muted-foreground">Passed</div></div>
            <div><div className="text-2xl font-bold">{items.filter(i => i.status === 'fail').length}</div><div className="text-xs text-muted-foreground">Failed</div></div>
            <div><div className="text-2xl font-bold">{items.filter(i => i.status === 'pending').length}</div><div className="text-xs text-muted-foreground">Pending</div></div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2"><Label>Requirement *</Label><Input value={newItem.requirement} onChange={e => setNewItem({ ...newItem, requirement: e.target.value })} placeholder="Design requirement to verify" /></div>
            <div><Label>Method</Label>
              <Select value={newItem.method} onValueChange={(v: any) => setNewItem({ ...newItem, method: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="test">Test</SelectItem>
                  <SelectItem value="analysis">Analysis</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                  <SelectItem value="demonstration">Demonstration</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2"><Label>Acceptance Criteria</Label><Input value={newItem.acceptanceCriteria} onChange={e => setNewItem({ ...newItem, acceptanceCriteria: e.target.value })} placeholder="How do we know it passes?" /></div>
            <div className="flex items-end"><Button onClick={addItem} size="sm"><Plus className="h-4 w-4 mr-1" />Add</Button></div>
          </div>

          {items.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Requirement</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Acceptance Criteria</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.requirement}</TableCell>
                      <TableCell><Badge variant="outline">{item.method}</Badge></TableCell>
                      <TableCell>{item.acceptanceCriteria}</TableCell>
                      <TableCell><Input className="w-32" value={item.result} onChange={e => updateItem(item.id, 'result', e.target.value)} placeholder="Result" /></TableCell>
                      <TableCell>
                        <Select value={item.status} onValueChange={v => updateItem(item.id, 'status', v)}>
                          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="pass">Pass</SelectItem>
                            <SelectItem value="fail">Fail</SelectItem>
                            <SelectItem value="conditional">Conditional</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell><Button variant="ghost" size="sm" onClick={() => { setItems(items.filter(i => i.id !== item.id)); saveData(items.filter(i => i.id !== item.id)); }}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <Button onClick={() => saveData()}>Save Verification</Button>
        </CardContent>
      </Card>
    </div>
  );
}
