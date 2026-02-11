import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TestTube, Plus, Trash2 } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";
import { useToast } from "@/hooks/use-toast";

interface TestResult {
  id: string;
  testName: string;
  specification: string;
  method: string;
  result: string;
  unit: string;
  status: 'pass' | 'fail' | 'pending';
  certNumber: string;
}

export function MaterialTestTool() {
  const { currentProject, updateToolData, getToolData } = useProject();
  const { toast } = useToast();
  const savedData = currentProject ? getToolData('material-test') : null;

  const [materialInfo, setMaterialInfo] = useState({
    materialName: savedData?.materialInfo?.materialName || '',
    materialSpec: savedData?.materialInfo?.materialSpec || '',
    supplier: savedData?.materialInfo?.supplier || '',
    lotNumber: savedData?.materialInfo?.lotNumber || '',
  });
  const [tests, setTests] = useState<TestResult[]>(savedData?.tests || []);
  const [newTest, setNewTest] = useState<Omit<TestResult, 'id'>>({
    testName: '', specification: '', method: '', result: '', unit: '', status: 'pending', certNumber: ''
  });

  const saveData = (data?: TestResult[]) => {
    if (currentProject) {
      updateToolData('material-test', { materialInfo, tests: data || tests });
      toast({ title: "Saved", description: "Material test results saved" });
    }
  };

  const addTest = () => {
    if (!newTest.testName) return;
    const updated = [...tests, { ...newTest, id: Date.now().toString() }];
    setTests(updated);
    setNewTest({ testName: '', specification: '', method: '', result: '', unit: '', status: 'pending', certNumber: '' });
    saveData(updated);
  };

  const updateTest = (id: string, field: string, value: string) => {
    const updated = tests.map(t => t.id === id ? { ...t, [field]: value } : t);
    setTests(updated);
    saveData(updated);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10"><TestTube className="h-6 w-6 text-primary" /></div>
            <div>
              <CardTitle>Material Test Results</CardTitle>
              <CardDescription>Material certification and testing documentation</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div><Label>Material Name</Label><Input value={materialInfo.materialName} onChange={e => setMaterialInfo({ ...materialInfo, materialName: e.target.value })} placeholder="Material" /></div>
            <div><Label>Material Spec</Label><Input value={materialInfo.materialSpec} onChange={e => setMaterialInfo({ ...materialInfo, materialSpec: e.target.value })} placeholder="e.g. ASTM A36" /></div>
            <div><Label>Supplier</Label><Input value={materialInfo.supplier} onChange={e => setMaterialInfo({ ...materialInfo, supplier: e.target.value })} placeholder="Supplier name" /></div>
            <div><Label>Lot Number</Label><Input value={materialInfo.lotNumber} onChange={e => setMaterialInfo({ ...materialInfo, lotNumber: e.target.value })} placeholder="Lot/Heat #" /></div>
          </div>

          <Card className="border-dashed">
            <CardHeader><CardTitle className="text-lg">Test Results</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div><Label>Test Name *</Label><Input value={newTest.testName} onChange={e => setNewTest({ ...newTest, testName: e.target.value })} placeholder="e.g. Tensile Strength" /></div>
                <div><Label>Specification</Label><Input value={newTest.specification} onChange={e => setNewTest({ ...newTest, specification: e.target.value })} placeholder="Required range" /></div>
                <div><Label>Method</Label><Input value={newTest.method} onChange={e => setNewTest({ ...newTest, method: e.target.value })} placeholder="Test method" /></div>
                <div><Label>Unit</Label><Input value={newTest.unit} onChange={e => setNewTest({ ...newTest, unit: e.target.value })} placeholder="MPa, %, etc." /></div>
                <div className="flex items-end"><Button onClick={addTest} size="sm"><Plus className="h-4 w-4 mr-1" />Add</Button></div>
              </div>

              {tests.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Test</TableHead>
                      <TableHead>Specification</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tests.map(t => (
                      <TableRow key={t.id}>
                        <TableCell className="font-medium">{t.testName}</TableCell>
                        <TableCell>{t.specification}</TableCell>
                        <TableCell>{t.method}</TableCell>
                        <TableCell><Input className="w-24" value={t.result} onChange={e => updateTest(t.id, 'result', e.target.value)} placeholder="Value" /></TableCell>
                        <TableCell>{t.unit}</TableCell>
                        <TableCell>
                          <Select value={t.status} onValueChange={v => updateTest(t.id, 'status', v)}>
                            <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="pass">Pass</SelectItem>
                              <SelectItem value="fail">Fail</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell><Button variant="ghost" size="sm" onClick={() => { const u = tests.filter(x => x.id !== t.id); setTests(u); saveData(u); }}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Button onClick={() => saveData()}>Save Material Tests</Button>
        </CardContent>
      </Card>
    </div>
  );
}
