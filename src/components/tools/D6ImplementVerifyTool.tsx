import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, ClipboardCheck, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface VerificationItem {
  id: string;
  action: string;
  implementationDate: string;
  verificationMethod: string;
  expectedResult: string;
  actualResult: string;
  isEffective: boolean | null;
  evidence: string;
}

const D6ImplementVerifyTool: React.FC = () => {
  const [items, setItems] = useState<VerificationItem[]>([]);
  const [newItem, setNewItem] = useState<Partial<VerificationItem>>({});
  const [containmentRemoved, setContainmentRemoved] = useState(false);
  const [containmentNotes, setContainmentNotes] = useState('');

  const addItem = () => {
    if (newItem.action && newItem.verificationMethod) {
      setItems([...items, {
        id: Date.now().toString(),
        action: newItem.action || '',
        implementationDate: newItem.implementationDate || '',
        verificationMethod: newItem.verificationMethod || '',
        expectedResult: newItem.expectedResult || '',
        actualResult: newItem.actualResult || '',
        isEffective: null,
        evidence: newItem.evidence || ''
      }]);
      setNewItem({});
    }
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const updateItem = (id: string, updates: Partial<VerificationItem>) => {
    setItems(items.map(i => i.id === id ? { ...i, ...updates } : i));
  };

  const effectiveCount = items.filter(i => i.isEffective === true).length;
  const ineffectiveCount = items.filter(i => i.isEffective === false).length;
  const pendingCount = items.filter(i => i.isEffective === null).length;
  const effectivenessRate = items.length > 0 ? (effectiveCount / items.length) * 100 : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            D6 - Implement & Verify Corrective Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Implement permanent corrective actions and verify their effectiveness through measurable results.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/30">
            <div>
              <Label>Corrective Action</Label>
              <Textarea
                placeholder="Which corrective action was implemented?"
                value={newItem.action || ''}
                onChange={(e) => setNewItem({ ...newItem, action: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Implementation Date</Label>
              <Input
                type="date"
                value={newItem.implementationDate || ''}
                onChange={(e) => setNewItem({ ...newItem, implementationDate: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Verification Method</Label>
              <Input
                placeholder="How will you verify effectiveness?"
                value={newItem.verificationMethod || ''}
                onChange={(e) => setNewItem({ ...newItem, verificationMethod: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Expected Result</Label>
              <Input
                placeholder="What result indicates success?"
                value={newItem.expectedResult || ''}
                onChange={(e) => setNewItem({ ...newItem, expectedResult: e.target.value })}
                className="mt-1"
              />
            </div>
            <div className="md:col-span-2">
              <Button onClick={addItem} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Verification Item
              </Button>
            </div>
          </div>

          {items.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Implemented</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead>Expected</TableHead>
                  <TableHead>Actual Result</TableHead>
                  <TableHead>Effective?</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="max-w-[150px] truncate">{item.action}</TableCell>
                    <TableCell>{item.implementationDate}</TableCell>
                    <TableCell className="max-w-[120px] truncate">{item.verificationMethod}</TableCell>
                    <TableCell className="max-w-[100px] truncate">{item.expectedResult}</TableCell>
                    <TableCell>
                      <Input
                        placeholder="Enter result"
                        value={item.actualResult}
                        onChange={(e) => updateItem(item.id, { actualResult: e.target.value })}
                        className="w-[120px]"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={item.isEffective === true ? 'default' : 'outline'}
                          onClick={() => updateItem(item.id, { isEffective: true })}
                          className="w-12"
                        >
                          Yes
                        </Button>
                        <Button
                          size="sm"
                          variant={item.isEffective === false ? 'destructive' : 'outline'}
                          onClick={() => updateItem(item.id, { isEffective: false })}
                          className="w-12"
                        >
                          No
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <Card className="p-4 bg-muted/30">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5" />
              <span className="font-medium">Verification Summary</span>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{items.length}</div>
                <div className="text-xs text-muted-foreground">Total Actions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{effectiveCount}</div>
                <div className="text-xs text-muted-foreground">Effective</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{ineffectiveCount}</div>
                <div className="text-xs text-muted-foreground">Ineffective</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Effectiveness Rate</span>
                <span>{effectivenessRate.toFixed(0)}%</span>
              </div>
              <Progress value={effectivenessRate} className="h-2" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <Checkbox
                id="containment"
                checked={containmentRemoved}
                onCheckedChange={(checked) => setContainmentRemoved(checked as boolean)}
              />
              <Label htmlFor="containment" className="font-medium">
                Containment actions have been removed
              </Label>
            </div>
            <div>
              <Label>Containment Removal Notes</Label>
              <Textarea
                placeholder="Document the removal of interim containment actions..."
                value={containmentNotes}
                onChange={(e) => setContainmentNotes(e.target.value)}
                className="mt-1"
              />
            </div>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default D6ImplementVerifyTool;
