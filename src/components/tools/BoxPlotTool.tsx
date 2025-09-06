import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Download, RotateCcw, Upload, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import * as XLSX from "xlsx";

interface DataPoint {
  category: string;
  value: number;
  timestamp?: string;
}

interface BoxPlotData {
  category: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers: number[];
}

export function BoxPlotTool() {
  const { toast } = useToast();
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([
    { category: "Process A", value: 85, timestamp: "2024-01-01" },
    { category: "Process A", value: 87, timestamp: "2024-01-02" },
    { category: "Process A", value: 83, timestamp: "2024-01-03" },
    { category: "Process A", value: 89, timestamp: "2024-01-04" },
    { category: "Process A", value: 86, timestamp: "2024-01-05" },
    { category: "Process B", value: 92, timestamp: "2024-01-01" },
    { category: "Process B", value: 88, timestamp: "2024-01-02" },
    { category: "Process B", value: 94, timestamp: "2024-01-03" },
    { category: "Process B", value: 90, timestamp: "2024-01-04" },
    { category: "Process B", value: 91, timestamp: "2024-01-05" }
  ]);
  const [rawData, setRawData] = useState("");

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
          const newDataPoints: DataPoint[] = [];
          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i] as any[];
            if (row[0] && row[1]) {
              newDataPoints.push({
                category: row[0].toString(),
                value: parseFloat(row[1].toString()),
                timestamp: row[2]?.toString() || new Date().toISOString().split('T')[0]
              });
            }
          }
          
          setDataPoints(newDataPoints);
          toast({
            title: "Excel Data Imported",
            description: `Imported ${newDataPoints.length} data points.`
          });
        }
      } catch (error) {
        toast({
          title: "Import Error",
          description: "Failed to parse Excel file. Expected format: Category, Value, Timestamp",
          variant: "destructive"
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const processData = () => {
    if (!rawData.trim()) return;
    
    try {
      const lines = rawData.trim().split('\n');
      const newDataPoints: DataPoint[] = [];
      
      lines.forEach((line, index) => {
        if (index === 0) return; // Skip header
        const [category, value, timestamp] = line.split(',').map(s => s.trim());
        if (category && value) {
          newDataPoints.push({
            category,
            value: parseFloat(value),
            timestamp: timestamp || new Date().toISOString().split('T')[0]
          });
        }
      });
      
      setDataPoints(newDataPoints);
      toast({
        title: "Data Processed",
        description: `Processed ${newDataPoints.length} data points.`
      });
    } catch (error) {
      toast({
        title: "Processing Error",
        description: "Failed to process data. Check the format.",
        variant: "destructive"
      });
    }
  };

  const calculateBoxPlotData = (): BoxPlotData[] => {
    const categories = [...new Set(dataPoints.map(d => d.category))];
    
    return categories.map(category => {
      const values = dataPoints
        .filter(d => d.category === category)
        .map(d => d.value)
        .sort((a, b) => a - b);
      
      const q1Index = Math.floor(values.length * 0.25);
      const medianIndex = Math.floor(values.length * 0.5);
      const q3Index = Math.floor(values.length * 0.75);
      
      const q1 = values[q1Index];
      const median = values[medianIndex];
      const q3 = values[q3Index];
      const iqr = q3 - q1;
      
      const lowerFence = q1 - 1.5 * iqr;
      const upperFence = q3 + 1.5 * iqr;
      
      const outliers = values.filter(v => v < lowerFence || v > upperFence);
      const nonOutliers = values.filter(v => v >= lowerFence && v <= upperFence);
      
      return {
        category,
        min: Math.min(...nonOutliers),
        q1,
        median,
        q3,
        max: Math.max(...nonOutliers),
        outliers
      };
    });
  };

  const getTimeSeriesData = () => {
    return dataPoints
      .sort((a, b) => new Date(a.timestamp || '').getTime() - new Date(b.timestamp || '').getTime())
      .map((point, index) => ({
        time: point.timestamp || `Point ${index + 1}`,
        value: point.value,
        category: point.category
      }));
  };

  const exportResults = () => {
    const boxPlotData = calculateBoxPlotData();
    const results = `
BOX PLOT & TIME SERIES ANALYSIS
==============================

SUMMARY STATISTICS:
${boxPlotData.map(data => `
Category: ${data.category}
- Minimum: ${data.min}
- Q1 (25th percentile): ${data.q1}
- Median (50th percentile): ${data.median}
- Q3 (75th percentile): ${data.q3}
- Maximum: ${data.max}
- Outliers: ${data.outliers.join(', ') || 'None'}
- IQR: ${data.q3 - data.q1}
`).join('')}

RAW DATA:
${dataPoints.map(point => `${point.category}, ${point.value}, ${point.timestamp}`).join('\n')}

Analysis Date: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([results], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `box-plot-analysis-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setDataPoints([
      { category: "Process A", value: 85, timestamp: "2024-01-01" },
      { category: "Process A", value: 87, timestamp: "2024-01-02" },
      { category: "Process A", value: 83, timestamp: "2024-01-03" },
      { category: "Process A", value: 89, timestamp: "2024-01-04" },
      { category: "Process A", value: 86, timestamp: "2024-01-05" },
      { category: "Process B", value: 92, timestamp: "2024-01-01" },
      { category: "Process B", value: 88, timestamp: "2024-01-02" },
      { category: "Process B", value: 94, timestamp: "2024-01-03" },
      { category: "Process B", value: 90, timestamp: "2024-01-04" },
      { category: "Process B", value: 91, timestamp: "2024-01-05" }
    ]);
    setRawData("");
  };

  const generateSampleData = () => {
    setRawData(`Category,Value,Timestamp
Process A,85,2024-01-01
Process A,87,2024-01-02
Process A,83,2024-01-03
Process A,89,2024-01-04
Process A,86,2024-01-05
Process B,92,2024-01-01
Process B,88,2024-01-02
Process B,94,2024-01-03
Process B,90,2024-01-04
Process B,91,2024-01-05`);
  };

  const boxPlotData = calculateBoxPlotData();
  const timeSeriesData = getTimeSeriesData();

  return (
    <Card className="card-professional">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-primary" />
            <CardTitle>Box Plot & Time Series Analysis</CardTitle>
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
        <Tabs defaultValue="data" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="data">Data Input</TabsTrigger>
            <TabsTrigger value="boxplot">Box Plot</TabsTrigger>
            <TabsTrigger value="timeseries">Time Series</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="data" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="rawData">Data (CSV Format: Category,Value,Timestamp)</Label>
                <Textarea
                  id="rawData"
                  value={rawData}
                  onChange={(e) => setRawData(e.target.value)}
                  placeholder="Process A,85,2024-01-01&#10;Process A,87,2024-01-02&#10;Process B,92,2024-01-01"
                  className="min-h-32 bg-background text-foreground"
                  rows={8}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={generateSampleData} variant="outline">
                  Load Sample Data
                </Button>
                <Button onClick={processData}>
                  Process Data
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="boxplot" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-semibold">Box Plot Visualization</h4>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <div className="space-y-6">
                    {boxPlotData.map((data, index) => (
                      <div key={data.category} className="border rounded-lg p-4">
                        <h5 className="font-medium mb-2">{data.category}</h5>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground">Min</div>
                            <div className="font-medium">{data.min}</div>
                          </div>
                          <div className="flex-1 relative h-8 bg-muted rounded">
                            <div 
                              className="absolute h-full bg-primary/20 rounded"
                              style={{
                                left: `${((data.q1 - data.min) / (data.max - data.min)) * 100}%`,
                                width: `${((data.q3 - data.q1) / (data.max - data.min)) * 100}%`
                              }}
                            />
                            <div 
                              className="absolute top-0 bottom-0 w-0.5 bg-primary"
                              style={{
                                left: `${((data.median - data.min) / (data.max - data.min)) * 100}%`
                              }}
                            />
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground">Max</div>
                            <div className="font-medium">{data.max}</div>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                          <span>Q1: {data.q1}</span>
                          <span>Median: {data.median}</span>
                          <span>Q3: {data.q3}</span>
                        </div>
                        {data.outliers.length > 0 && (
                          <div className="text-xs text-destructive mt-1">
                            Outliers: {data.outliers.join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="timeseries" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-semibold">Time Series Plot</h4>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="time" 
                      className="text-xs"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                    />
                    <Legend />
                    {[...new Set(timeSeriesData.map(d => d.category))].map((category, index) => (
                      <Line
                        key={category}
                        type="monotone"
                        dataKey="value"
                        stroke={`hsl(${210 + index * 30}, 70%, 50%)`}
                        strokeWidth={2}
                        dot={{ fill: `hsl(${210 + index * 30}, 70%, 50%)` }}
                        data={timeSeriesData.filter(d => d.category === category)}
                        name={category}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="analysis" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-semibold">Statistical Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {boxPlotData.map((data) => (
                  <div key={data.category} className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-3">{data.category}</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Range:</span>
                        <span className="font-medium">{data.max - data.min}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>IQR:</span>
                        <span className="font-medium">{data.q3 - data.q1}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Median:</span>
                        <span className="font-medium">{data.median}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Outliers:</span>
                        <span className={`font-medium ${data.outliers.length > 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                          {data.outliers.length || 'None'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-muted/30 rounded-lg">
                <h5 className="font-semibold mb-2">Interpretation</h5>
                <div className="text-sm space-y-2">
                  <p>• Box plots show the distribution and variability of your data</p>
                  <p>• The box represents the middle 50% of data (IQR)</p>
                  <p>• The line in the box is the median</p>
                  <p>• Outliers may indicate special causes or data collection errors</p>
                  <p>• Time series plots reveal trends and patterns over time</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}