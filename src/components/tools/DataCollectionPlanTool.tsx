import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileSpreadsheet, Download, RotateCcw, Plus, X, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

interface DataElement {
  id: string;
  metric: string;
  definition: string;
  dataType: "Continuous" | "Discrete" | "Attribute";
  source: string;
  collectionMethod: string;
  frequency: string;
  sampleSize: string;
  responsible: string;
  startDate: string;
  endDate: string;
  target: string;
}

export function DataCollectionPlanTool() {
  const { toast } = useToast();
  const [dataElements, setDataElements] = useState<DataElement[]>([
    {
      id: "1",
      metric: "Cycle Time",
      definition: "Time from start to completion of process",
      dataType: "Continuous",
      source: "Process tracking system",
      collectionMethod: "Automatic capture",
      frequency: "Per transaction",
      sampleSize: "All transactions",
      responsible: "Process Owner",
      startDate: "2024-01-01",
      endDate: "2024-03-31",
      target: "< 10 minutes"
    }
  ]);

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
          const newElements: DataElement[] = [];
          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i] as any[];
            if (row[0] && row[1]) {
              newElements.push({
                id: i.toString(),
                metric: row[0]?.toString() || '',
                definition: row[1]?.toString() || '',
                dataType: (row[2]?.toString() || 'Continuous') as any,
                source: row[3]?.toString() || '',
                collectionMethod: row[4]?.toString() || '',
                frequency: row[5]?.toString() || '',
                sampleSize: row[6]?.toString() || '',
                responsible: row[7]?.toString() || '',
                startDate: row[8]?.toString() || '',
                endDate: row[9]?.toString() || '',
                target: row[10]?.toString() || ''
              });
            }
          }
          
          setDataElements(newElements);
          toast({
            title: "Excel Data Imported",
            description: `Imported ${newElements.length} data elements.`
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

  const addDataElement = () => {
    const newElement: DataElement = {
      id: Date.now().toString(),
      metric: "",
      definition: "",
      dataType: "Continuous",
      source: "",
      collectionMethod: "",
      frequency: "",
      sampleSize: "",
      responsible: "",
      startDate: "",
      endDate: "",
      target: ""
    };
    setDataElements([...dataElements, newElement]);
  };

  const updateDataElement = (id: string, field: keyof DataElement, value: string) => {
    setDataElements(prev => prev.map(element => 
      element.id === id ? { ...element, [field]: value } : element
    ));
  };

  const removeDataElement = (id: string) => {
    setDataElements(prev => prev.filter(e => e.id !== id));
  };

  const exportResults = () => {
    const results = `
DATA COLLECTION PLAN
====================

Total Data Elements: ${dataElements.length}

DATA COLLECTION SCHEDULE:
${dataElements.map((e, i) => `
${i + 1}. ${e.metric}
   Definition: ${e.definition}
   Data Type: ${e.dataType}
   Source: ${e.source}
   Collection Method: ${e.collectionMethod}
   Frequency: ${e.frequency}
   Sample Size: ${e.sampleSize}
   Responsible: ${e.responsible}
   Collection Period: ${e.startDate} to ${e.endDate}
   Target: ${e.target}
`).join('')}

DATA TYPE SUMMARY:
${Object.entries(
  dataElements.reduce((acc, e) => {
    acc[e.dataType] = (acc[e.dataType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>)
).map(([type, count]) => `${type}: ${count} metrics`).join('\n')}

Plan Created: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([results], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data-collection-plan-${Date.now()}.xlsx`;
    
    // Create Excel workbook
    const wb = XLSX.utils.book_new();
    const wsData = [
      ['Metric', 'Definition', 'Data Type', 'Source', 'Collection Method', 'Frequency', 'Sample Size', 'Responsible', 'Start Date', 'End Date', 'Target'],
      ...dataElements.map(e => [
        e.metric, e.definition, e.dataType, e.source, e.collectionMethod, 
        e.frequency, e.sampleSize, e.responsible, e.startDate, e.endDate, e.target
      ])
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Data Collection Plan");
    XLSX.writeFile(wb, `data-collection-plan-${Date.now()}.xlsx`);
  };

  const reset = () => {
    setDataElements([{
      id: "1",
      metric: "Cycle Time",
      definition: "Time from start to completion of process",
      dataType: "Continuous",
      source: "Process tracking system",
      collectionMethod: "Automatic capture",
      frequency: "Per transaction",
      sampleSize: "All transactions",
      responsible: "Process Owner",
      startDate: "2024-01-01",
      endDate: "2024-03-31",
      target: "< 10 minutes"
    }]);
  };

  return (
    <Card className="card-professional">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="h-6 w-6 text-primary" />
            <CardTitle>Data Collection Plan</CardTitle>
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
              Export Excel
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="plan" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="plan">Data Plan</TabsTrigger>
            <TabsTrigger value="timeline">Timeline View</TabsTrigger>
            <TabsTrigger value="guide">Guide</TabsTrigger>
          </TabsList>
          
          <TabsContent value="plan" className="space-y-4">
            <Button onClick={addDataElement}>
              <Plus className="h-4 w-4 mr-2" />
              Add Data Element
            </Button>
            
            <div className="space-y-4">
              {dataElements.map((element) => (
                <Card key={element.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="space-y-3">
                        <div>
                          <Label>Metric</Label>
                          <Input
                            value={element.metric}
                            onChange={(e) => updateDataElement(element.id, 'metric', e.target.value)}
                            placeholder="What to measure"
                          />
                        </div>
                        <div>
                          <Label>Definition</Label>
                          <Input
                            value={element.definition}
                            onChange={(e) => updateDataElement(element.id, 'definition', e.target.value)}
                            placeholder="Clear definition"
                          />
                        </div>
                        <div>
                          <Label>Data Type</Label>
                          <Select 
                            value={element.dataType} 
                            onValueChange={(value) => updateDataElement(element.id, 'dataType', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Continuous">Continuous</SelectItem>
                              <SelectItem value="Discrete">Discrete</SelectItem>
                              <SelectItem value="Attribute">Attribute</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <Label>Data Source</Label>
                          <Input
                            value={element.source}
                            onChange={(e) => updateDataElement(element.id, 'source', e.target.value)}
                            placeholder="Where data comes from"
                          />
                        </div>
                        <div>
                          <Label>Collection Method</Label>
                          <Input
                            value={element.collectionMethod}
                            onChange={(e) => updateDataElement(element.id, 'collectionMethod', e.target.value)}
                            placeholder="How to collect"
                          />
                        </div>
                        <div>
                          <Label>Frequency</Label>
                          <Input
                            value={element.frequency}
                            onChange={(e) => updateDataElement(element.id, 'frequency', e.target.value)}
                            placeholder="How often to collect"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <Label>Sample Size</Label>
                          <Input
                            value={element.sampleSize}
                            onChange={(e) => updateDataElement(element.id, 'sampleSize', e.target.value)}
                            placeholder="Sample size needed"
                          />
                        </div>
                        <div>
                          <Label>Responsible Person</Label>
                          <Input
                            value={element.responsible}
                            onChange={(e) => updateDataElement(element.id, 'responsible', e.target.value)}
                            placeholder="Who collects the data"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label>Start Date</Label>
                            <Input
                              type="date"
                              value={element.startDate}
                              onChange={(e) => updateDataElement(element.id, 'startDate', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>End Date</Label>
                            <Input
                              type="date"
                              value={element.endDate}
                              onChange={(e) => updateDataElement(element.id, 'endDate', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex-1 mr-2">
                            <Label>Target</Label>
                            <Input
                              value={element.target}
                              onChange={(e) => updateDataElement(element.id, 'target', e.target.value)}
                              placeholder="Target value"
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDataElement(element.id)}
                            className="mt-6"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="timeline">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Data Collection Timeline</h4>
              <div className="space-y-3">
                {dataElements.map((element) => (
                  <div key={element.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-semibold">{element.metric}</h5>
                        <p className="text-sm text-muted-foreground">{element.definition}</p>
                        <p className="text-sm mt-1">
                          <span className="font-medium">Responsible:</span> {element.responsible}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{element.frequency}</div>
                        <div className="text-xs text-muted-foreground">
                          {element.startDate} to {element.endDate}
                        </div>
                        <div className="text-xs bg-primary/20 text-primary px-2 py-1 rounded mt-1">
                          {element.dataType}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="guide">
            <div className="space-y-4">
              <h4 className="font-semibold">Data Collection Planning Guide</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h5 className="font-semibold">Data Types:</h5>
                  <ul className="text-sm space-y-1">
                    <li><strong>Continuous:</strong> Measured on a continuous scale (time, weight, temperature)</li>
                    <li><strong>Discrete:</strong> Counted in whole numbers (defects, complaints)</li>
                    <li><strong>Attribute:</strong> Pass/fail, yes/no data</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h5 className="font-semibold">Collection Methods:</h5>
                  <ul className="text-sm space-y-1">
                    <li><strong>Automatic:</strong> System-generated data</li>
                    <li><strong>Manual:</strong> Human observation/recording</li>
                    <li><strong>Sampling:</strong> Representative samples</li>
                    <li><strong>Census:</strong> All units measured</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-4 bg-muted/30 rounded-lg">
                <h5 className="font-semibold mb-2">Excel Import Format:</h5>
                <p className="text-sm mb-2">Columns: Metric, Definition, Data Type, Source, Collection Method, Frequency, Sample Size, Responsible, Start Date, End Date, Target</p>
                <div className="text-xs font-mono bg-background p-2 rounded">
                  Metric | Definition | Data Type | Source | Method | Frequency<br/>
                  Cycle Time | Process completion time | Continuous | System | Auto | Daily
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}