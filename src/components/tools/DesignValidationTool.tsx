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

interface ValidationItem {
  id: string;
  customerNeed: string;
  testDescription: string;
  environment: string;
  sampleSize: string;
  result: string;
  status: 'pass' | 'fail' | 'pending';
  feedback: string;
}

export function DesignValidationTool() {
  const { currentProject, updateToolData, getToolData } = useProject();
  const { toast } = useToast();
  const savedData = currentProject ? getToolData('design-validation') : null;

  const [items, setItems] = useState<ValidationItem[]>(savedData?.items || []);
  const [newItem, setNewItem] = useState<Omit<ValidationItem, 'id'>>({
    customerNeed: '', testDescription: '', environment: '', sampleSize: '', result: '', status: 'pending', feedback: ''
  });

  const saveData = (data?: ValidationItem[]) => {
    if (currentProject) {
      updateToolData('design-validation', { items: data || items });
      toast({ title: "Saved", description: "Design validation saved" });
    }
  };

  const addItem = () => {
    if (!newItem.customerNeed) return;
    const updated = [...items, { ...newItem, id: Date.now().toString() }];
    setItems(updated);
    setNewItem({ customerNeed: '', testDescription: '', environment: '', sampleSize: '', result: '', status: 'pending', feedback: '' });
    saveData(updated);
  };

  const updateItem = (id: string, field: string, value: string) => {
    const updated = items.map(i => i.id === id ? { ...i, [field]: value } : i);
    setItems(updated);
    saveData(updated);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10"><CheckCircle className="h-6 w-6 text-primary" /></div>
            <div>
              <CardTitle>Design Validation</CardTitle>
              <CardDescription>Validate design meets customer needs under actual use conditions</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div><Label>Customer Need *</Label><Input value={newItem.customerNeed} onChange={e => setNewItem({ ...newItem, customerNeed: e.target.value })} placeholder="What customer need?" /></div>
            <div><Label>Test Description</Label><Input value={newItem.testDescription} onChange={e => setNewItem({ ...newItem, testDescription: e.target.value })} placeholder="How to validate?" /></div>
            <div><Label>Environment</Label><Input value={newItem.environment} onChange={e => setNewItem({ ...newItem, environment: e.target.value })} placeholder="Test conditions" /></div>
          </div>
          <Button onClick={addItem} size="sm"><Plus className="h-4 w-4 mr-1" />Add Validation Item</Button>

          {items.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer Need</TableHead>
                    <TableHead>Test</TableHead>
                    <TableHead>Environment</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Feedback</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.customerNeed}</TableCell>
                      <TableCell>{item.testDescription}</TableCell>
                      <TableCell>{item.environment}</TableCell>
                      <TableCell><Input className="w-24" value={item.result} onChange={e => updateItem(item.id, 'result', e.target.value)} /></TableCell>
                      <TableCell>
                        <Select value={item.status} onValueChange={v => updateItem(item.id, 'status', v)}>
                          <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="pass">Pass</SelectItem>
                            <SelectItem value="fail">Fail</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell><Input className="w-32" value={item.feedback} onChange={e => updateItem(item.id, 'feedback', e.target.value)} placeholder="Customer feedback" /></TableCell>
                      <TableCell><Button variant="ghost" size="sm" onClick={() => { const u = items.filter(i => i.id !== item.id); setItems(u); saveData(u); }}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <Button onClick={() => saveData()}>Save Validation</Button>
        </CardContent>
      </Card>
    </div>
  );
}
