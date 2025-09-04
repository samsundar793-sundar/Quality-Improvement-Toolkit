import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardList, Download, RotateCcw, Plus, X, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import * as XLSX from "xlsx";

interface CheckItem {
  id: string;
  category: string;
  description: string;
  count: number;
  target?: number;
}

interface TallyEntry {
  id: string;
  checkItemId: string;
  timestamp: string;
  observer: string;
  notes: string;
}

export function CheckSheetTool() {
  const { toast } = useToast();
  const [checkItems, setCheckItems] = useState<CheckItem[]>([
    { id: "1", category: "Defects", description: "Scratches", count: 0, target: 5 },
    { id: "2", category: "Defects", description: "Dents", count: 0, target: 3 },
    { id: "3", category: "Defects", description: "Color mismatch", count: 0, target: 2 }
  ]);
  
  const [tallyEntries, setTallyEntries] = useState<TallyEntry[]>([]);
  const [currentObserver, setCurrentObserver] = useState("");

  const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length > 1) {
          const newItems: CheckItem[] = [];
          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i] as any[];
            if (row[0] && row[1]) {
              newItems.push({
                id: i.toString(),
                category: row[0]?.toString() || '',
                description: row[1]?.toString() || '',
                count: parseInt(row[2]?.toString() || '0') || 0,
                target: parseInt(row[3]?.toString() || '0') || undefined
              });
            }
          }
          
          setCheckItems(newItems);
          toast({
            title: "Excel Data Imported",
            description: `Imported ${newItems.length} check items.`
          });
        }
      } catch (error) {
        toast({
          title: "Import Error",
          description: "Failed to parse Excel file.",
          variant: "destructive"
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const addCheckItem = () => {
    const newItem: CheckItem = {
      id: Date.now().toString(),
      category: "",
      description: "",
      count: 0
    };
    setCheckItems([...checkItems, newItem]);
  };

  const updateCheckItem = (id: string, field: keyof CheckItem, value: string | number) => {
    setCheckItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeCheckItem = (id: string) => {
    setCheckItems(prev => prev.filter(item => item.id !== id));
    setTallyEntries(prev => prev.filter(entry => entry.checkItemId !== id));
  };

  const addTally = (checkItemId: string) => {
    if (!currentObserver.trim()) {
      toast({
        title: "Observer Required",
        description: "Please enter observer name first.",
        variant: "destructive"
      });
      return;
    }

    const newEntry: TallyEntry = {
      id: Date.now().toString(),
      checkItemId,
      timestamp: new Date().toISOString(),
      observer: currentObserver,
      notes: ""
    };

    setTallyEntries(prev => [...prev, newEntry]);
    setCheckItems(prev => prev.map(item => 
      item.id === checkItemId ? { ...item, count: item.count + 1 } : item
    ));
  };

  const removeTally = (checkItemId: string) => {
    const lastEntry = tallyEntries
      .filter(entry => entry.checkItemId === checkItemId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

    if (lastEntry) {
      setTallyEntries(prev => prev.filter(entry => entry.id !== lastEntry.id));
      setCheckItems(prev => prev.map(item => 
        item.id === checkItemId ? { ...item, count: Math.max(0, item.count - 1) } : item
      ));
    }
  };

  const getChartData = () => {
    return checkItems.map(item => ({
      name: item.description || item.category,
      count: item.count,
      target: item.target || 0
    }));
  };

  const exportResults = () => {
    const results = `
CHECK SHEET RESULTS
==================

Observer: ${currentObserver}
Date: ${new Date().toLocaleDateString()}
Total Observations: ${tallyEntries.length}

TALLY RESULTS:
${checkItems.map(item => `
${item.category} - ${item.description}:
  Count: ${item.count}
  Target: ${item.target || 'N/A'}
  Status: ${item.target ? (item.count <= item.target ? 'Within Target' : 'Above Target') : 'No Target'}
`).join('')}

CATEGORY SUMMARY:
${Object.entries(
  checkItems.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.count;
    return acc;
  }, {} as Record<string, number>)
).map(([category, total]) => `${category}: ${total} total`).join('\n')}

DETAILED LOG:
${tallyEntries.map(entry => {
  const item = checkItems.find(i => i.id === entry.checkItemId);
  return `${new Date(entry.timestamp).toLocaleString()} - ${item?.category}: ${item?.description} (${entry.observer})`;
}).join('\n')}
    `;

    const blob = new Blob([results], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `check-sheet-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setCheckItems([
      { id: "1", category: "Defects", description: "Scratches", count: 0, target: 5 },
      { id: "2", category: "Defects", description: "Dents", count: 0, target: 3 },
      { id: "3", category: "Defects", description: "Color mismatch", count: 0, target: 2 }
    ]);
    setTallyEntries([]);
    setCurrentObserver("");
  };

  return (
    <Card className="card-professional">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ClipboardList className="h-6 w-6 text-primary" />
            <CardTitle>Check Sheet (Tally Sheet)</CardTitle>
          </div>
          <div className="flex gap-2">
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleExcelUpload}
                className="hidden"
              />
              <Button variant="outline" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Excel
                </span>
              </Button>
            </label>
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="analytics" onClick={exportResults}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tally" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tally">Tally Sheet</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="guide">Guide</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tally" className="space-y-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label>Observer Name</Label>
                <Input
                  value={currentObserver}
                  onChange={(e) => setCurrentObserver(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              <Button onClick={addCheckItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add Check Item
              </Button>
            </div>
            
            <div className="space-y-4">
              {checkItems.map((item) => (
                <Card key={item.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div>
                        <Label>Category</Label>
                        <Input
                          value={item.category}
                          onChange={(e) => updateCheckItem(item.id, 'category', e.target.value)}
                          placeholder="Category"
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => updateCheckItem(item.id, 'description', e.target.value)}
                          placeholder="What to count"
                        />
                      </div>
                      <div>
                        <Label>Target (Optional)</Label>
                        <Input
                          type="number"
                          value={item.target || ''}
                          onChange={(e) => updateCheckItem(item.id, 'target', parseInt(e.target.value) || undefined)}
                          placeholder="Target count"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Count: {item.count}</Label>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => addTally(item.id)}
                            disabled={!currentObserver.trim()}
                          >
                            +1
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => removeTally(item.id)}
                            disabled={item.count === 0}
                          >
                            -1
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeCheckItem(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        {item.target && (
                          <div className={`text-xs px-2 py-1 rounded ${
                            item.count <= item.target 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.count <= item.target ? 'Within Target' : 'Above Target'}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="results">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{checkItems.reduce((sum, item) => sum + item.count, 0)}</div>
                  <div className="text-sm text-muted-foreground">Total Count</div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{checkItems.length}</div>
                  <div className="text-sm text-muted-foreground">Check Items</div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{tallyEntries.length}</div>
                  <div className="text-sm text-muted-foreground">Observations</div>
                </div>
              </div>

              {checkItems.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Tally Results</h4>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis 
                          tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                          label={{ value: 'Count', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px"
                          }}
                        />
                        <Legend />
                        <Bar dataKey="count" fill="hsl(var(--primary))" name="Actual Count"/>
                        <Bar dataKey="target" fill="hsl(var(--destructive))" name="Target" fillOpacity={0.7}/>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Summary by Category</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(
                    checkItems.reduce((acc, item) => {
                      if (!acc[item.category]) acc[item.category] = [];
                      acc[item.category].push(item);
                      return acc;
                    }, {} as Record<string, CheckItem[]>)
                  ).map(([category, items]) => (
                    <div key={category} className="p-4 border rounded-lg">
                      <h5 className="font-semibold mb-2">{category}</h5>
                      <div className="space-y-1 text-sm">
                        {items.map(item => (
                          <div key={item.id} className="flex justify-between">
                            <span>{item.description}</span>
                            <span className="font-medium">{item.count}</span>
                          </div>
                        ))}
                        <div className="border-t pt-1 flex justify-between font-semibold">
                          <span>Total:</span>
                          <span>{items.reduce((sum, item) => sum + item.count, 0)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="guide">
            <div className="space-y-4">
              <h4 className="font-semibold">Check Sheet Guide</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h5 className="font-semibold">When to Use:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Collecting frequency data</li>
                    <li>• Tracking defects or occurrences</li>
                    <li>• Monitoring process performance</li>
                    <li>• Real-time data collection</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h5 className="font-semibold">Best Practices:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Keep categories clear and specific</li>
                    <li>• Use consistent observation methods</li>
                    <li>• Record observer for accountability</li>
                    <li>• Set realistic targets</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-4 bg-muted/30 rounded-lg">
                <h5 className="font-semibold mb-2">Excel Import Format:</h5>
                <p className="text-sm mb-2">Columns: Category, Description, Initial Count, Target</p>
                <div className="text-xs font-mono bg-background p-2 rounded">
                  Category | Description | Count | Target<br/>
                  Defects | Scratches | 0 | 5<br/>
                  Issues | Missing parts | 0 | 2
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}