import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Download, RotateCcw, Upload, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from "recharts";
import { readExcelFile } from "@/lib/excelUtils";

interface DataPoint {
  sequence: number;
  value: number;
  label?: string;
}

interface TrendAnalysis {
  median: number;
  runs: number;
  expectedRuns: { min: number; max: number };
  longestRun: number;
  trends: string[];
}

export function RunChartTool() {
  const { toast } = useToast();
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([
    { sequence: 1, value: 25, label: "Week 1" },
    { sequence: 2, value: 28, label: "Week 2" },
    { sequence: 3, value: 24, label: "Week 3" },
    { sequence: 4, value: 30, label: "Week 4" },
    { sequence: 5, value: 32, label: "Week 5" },
    { sequence: 6, value: 29, label: "Week 6" },
    { sequence: 7, value: 35, label: "Week 7" },
    { sequence: 8, value: 33, label: "Week 8" },
    { sequence: 9, value: 38, label: "Week 9" },
    { sequence: 10, value: 36, label: "Week 10" }
  ]);
  const [rawData, setRawData] = useState("");
  const [chartTitle, setChartTitle] = useState("Process Performance Over Time");

  const handleExcelUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const buffer = await file.arrayBuffer();
      const { data: jsonData } = await readExcelFile(buffer);
      
      if (jsonData.length > 1) {
        const newDataPoints: DataPoint[] = [];
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as any[];
          if (row[0] !== undefined && row[1] !== undefined) {
            newDataPoints.push({
              sequence: parseInt(row[0]?.toString()) || i,
              value: parseFloat(row[1]?.toString()) || 0,
              label: row[2]?.toString() || `Point ${i}`
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
        description: "Failed to parse Excel file. Expected format: Sequence, Value, Label",
        variant: "destructive"
      });
    }
  };

  const processData = () => {
    if (!rawData.trim()) return;
    
    try {
      const lines = rawData.trim().split('\n');
      const newDataPoints: DataPoint[] = [];
      
      lines.forEach((line, index) => {
        if (index === 0 && line.toLowerCase().includes('value')) return;
        const parts = line.split(',').map(s => s.trim());
        const value = parseFloat(parts[0]);
        if (!isNaN(value)) {
          newDataPoints.push({
            sequence: index + 1,
            value,
            label: parts[1] || `Point ${index + 1}`
          });
        }
      });
      
      if (newDataPoints.length > 0) {
        setDataPoints(newDataPoints);
        toast({
          title: "Data Processed",
          description: `Loaded ${newDataPoints.length} data points.`
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process data.",
        variant: "destructive"
      });
    }
  };

  const analyzeTrends = (): TrendAnalysis => {
    const values = dataPoints.map(d => d.value);
    const sortedValues = [...values].sort((a, b) => a - b);
    const median = sortedValues.length % 2 === 0
      ? (sortedValues[sortedValues.length / 2 - 1] + sortedValues[sortedValues.length / 2]) / 2
      : sortedValues[Math.floor(sortedValues.length / 2)];

    // Count runs (sequences above or below median)
    let runs = 1;
    let currentRun = 1;
    let longestRun = 1;
    let previousAbove = values[0] > median;

    for (let i = 1; i < values.length; i++) {
      const currentAbove = values[i] > median;
      if (currentAbove === previousAbove) {
        currentRun++;
        longestRun = Math.max(longestRun, currentRun);
      } else {
        runs++;
        currentRun = 1;
      }
      previousAbove = currentAbove;
    }

    // Expected runs for random data (n/2 ± 2*sqrt(n)/2)
    const n = values.length;
    const expectedRunsMean = n / 2 + 1;
    const expectedRunsStd = Math.sqrt(n) / 2;
    const expectedRuns = {
      min: Math.round(expectedRunsMean - 2 * expectedRunsStd),
      max: Math.round(expectedRunsMean + 2 * expectedRunsStd)
    };

    // Detect trends
    const trends: string[] = [];
    
    // Check for too few or too many runs
    if (runs < expectedRuns.min) {
      trends.push("Too few runs - possible shift or trend in data");
    } else if (runs > expectedRuns.max) {
      trends.push("Too many runs - possible oscillation in data");
    }

    // Check for long runs
    if (longestRun >= 7) {
      trends.push(`Long run detected (${longestRun} consecutive points on same side of median)`);
    }

    // Check for overall trend
    let increasing = 0;
    let decreasing = 0;
    for (let i = 1; i < values.length; i++) {
      if (values[i] > values[i - 1]) increasing++;
      else if (values[i] < values[i - 1]) decreasing++;
    }
    
    if (increasing > values.length * 0.7) {
      trends.push("Strong upward trend detected");
    } else if (decreasing > values.length * 0.7) {
      trends.push("Strong downward trend detected");
    }

    if (trends.length === 0) {
      trends.push("Data appears stable with random variation");
    }

    return { median, runs, expectedRuns, longestRun, trends };
  };

  const analysis = analyzeTrends();

  const exportResults = () => {
    const exportData = `
RUN CHART ANALYSIS
==================

Title: ${chartTitle}
Data Points: ${dataPoints.length}
Median: ${analysis.median.toFixed(2)}

TREND ANALYSIS:
- Total Runs: ${analysis.runs}
- Expected Runs Range: ${analysis.expectedRuns.min} - ${analysis.expectedRuns.max}
- Longest Run: ${analysis.longestRun}

FINDINGS:
${analysis.trends.map(t => `• ${t}`).join('\n')}

DATA:
Sequence\tValue\tLabel
${dataPoints.map(d => `${d.sequence}\t${d.value}\t${d.label || ''}`).join('\n')}

Analysis Date: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `run-chart-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setDataPoints([
      { sequence: 1, value: 25, label: "Week 1" },
      { sequence: 2, value: 28, label: "Week 2" },
      { sequence: 3, value: 24, label: "Week 3" },
      { sequence: 4, value: 30, label: "Week 4" },
      { sequence: 5, value: 32, label: "Week 5" }
    ]);
    setRawData("");
  };

  return (
    <Card className="card-professional">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LineChart className="h-6 w-6 text-primary" />
            <CardTitle>Run Chart Analysis</CardTitle>
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
        <Tabs defaultValue="chart" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chart">Run Chart</TabsTrigger>
            <TabsTrigger value="data">Data Input</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="chart" className="space-y-4">
            <div>
              <Label>Chart Title</Label>
              <Input
                value={chartTitle}
                onChange={(e) => setChartTitle(e.target.value)}
                placeholder="Enter chart title"
              />
            </div>

            <div className="h-96 border border-border rounded-lg p-4">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={dataPoints}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="sequence" 
                    label={{ value: 'Sequence', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    label={{ value: 'Value', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                    formatter={(value: number) => [value.toFixed(2), 'Value']}
                    labelFormatter={(label) => {
                      const point = dataPoints.find(d => d.sequence === label);
                      return point?.label || `Sequence ${label}`;
                    }}
                  />
                  <Legend />
                  <ReferenceLine 
                    y={analysis.median} 
                    stroke="hsl(var(--destructive))" 
                    strokeDasharray="5 5"
                    label={{ value: `Median: ${analysis.median.toFixed(2)}`, position: 'right' }}
                  />
                  <Line 
                    type="linear" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                    name="Value"
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <div>
              <Label>Paste Data (one value per line, optionally with label)</Label>
              <Textarea
                value={rawData}
                onChange={(e) => setRawData(e.target.value)}
                placeholder="25, Week 1&#10;28, Week 2&#10;24, Week 3&#10;..."
                rows={10}
              />
            </div>
            <Button onClick={processData}>Process Data</Button>
            
            <div className="mt-4">
              <Label className="text-lg font-semibold">Current Data ({dataPoints.length} points)</Label>
              <div className="max-h-64 overflow-y-auto mt-2 border border-border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-muted sticky top-0">
                    <tr>
                      <th className="p-2 text-left">Sequence</th>
                      <th className="p-2 text-left">Value</th>
                      <th className="p-2 text-left">Label</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataPoints.map((point) => (
                      <tr key={point.sequence} className="border-t border-border">
                        <td className="p-2">{point.sequence}</td>
                        <td className="p-2">{point.value}</td>
                        <td className="p-2">{point.label}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{analysis.median.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">Median</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{analysis.runs}</div>
                    <div className="text-sm text-muted-foreground">
                      Total Runs (Expected: {analysis.expectedRuns.min}-{analysis.expectedRuns.max})
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{analysis.longestRun}</div>
                    <div className="text-sm text-muted-foreground">Longest Run</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trend Findings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.trends.map((trend, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                      {trend.includes('upward') ? (
                        <TrendingUp className="h-5 w-5 text-green-500" />
                      ) : trend.includes('downward') ? (
                        <TrendingDown className="h-5 w-5 text-red-500" />
                      ) : (
                        <Minus className="h-5 w-5 text-yellow-500" />
                      )}
                      <span>{trend}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold mb-2">Run Chart Rules</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• <strong>Run:</strong> A sequence of consecutive points on the same side of the median</li>
                <li>• <strong>Too few runs:</strong> Suggests a shift or trend in the process</li>
                <li>• <strong>Too many runs:</strong> Suggests oscillation or over-adjustment</li>
                <li>• <strong>7+ consecutive points:</strong> Indicates a significant shift</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
