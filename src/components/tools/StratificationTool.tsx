import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layers, Download, RotateCcw, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ScatterChart, Scatter } from "recharts";

interface DataPoint {
  id: string;
  value: number;
  stratum: string;
  date?: string;
}

interface StratumSummary {
  stratum: string;
  count: number;
  mean: number;
  stdDev: number;
  min: number;
  max: number;
  color: string;
}

export function StratificationTool() {
  const { toast } = useToast();
  const [data, setData] = useState<DataPoint[]>([]);
  const [rawData, setRawData] = useState("");
  const [stratumColumn, setStratumColumn] = useState("shift");
  const [analysis, setAnalysis] = useState<StratumSummary[]>([]);

  const colors = [
    "hsl(var(--primary))",
    "hsl(var(--secondary))", 
    "hsl(var(--accent))",
    "hsl(var(--destructive))",
    "hsl(var(--warning))",
    "#8B5CF6", "#06D6A0", "#F72585"
  ];

  const generateSampleData = () => {
    const shifts = ["Morning", "Afternoon", "Night"];
    const sampleData = Array.from({ length: 150 }, (_, i) => {
      const shift = shifts[i % 3];
      let baseMean = 50;
      if (shift === "Morning") baseMean = 52;
      if (shift === "Afternoon") baseMean = 48;
      if (shift === "Night") baseMean = 46;
      
      const value = Math.round((Math.random() * 10 - 5 + baseMean) * 100) / 100;
      return `${value},${shift},${new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`;
    });
    
    setRawData("Value,Shift,Date\n" + sampleData.join("\n"));
    toast({
      title: "Sample Data Generated",
      description: "Sample stratification data for shift analysis loaded."
    });
  };

  const processData = () => {
    try {
      const lines = rawData.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      if (lines.length < 2) {
        toast({
          title: "Error",
          description: "Please provide data with headers and at least one row.",
          variant: "destructive"
        });
        return;
      }

      const processedData: DataPoint[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length >= 2) {
          processedData.push({
            id: i.toString(),
            value: parseFloat(values[0]) || 0,
            stratum: values[1] || 'Unknown',
            date: values[2] || undefined
          });
        }
      }

      if (processedData.length === 0) {
        toast({
          title: "Error", 
          description: "No valid data rows found.",
          variant: "destructive"
        });
        return;
      }

      setData(processedData);
      analyzeStrata(processedData);
      
      toast({
        title: "Analysis Complete",
        description: `Stratification analysis completed for ${processedData.length} data points.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process data. Please check format.",
        variant: "destructive"
      });
    }
  };

  const analyzeStrata = (dataPoints: DataPoint[]) => {
    const strataMap = new Map<string, number[]>();
    
    dataPoints.forEach(point => {
      if (!strataMap.has(point.stratum)) {
        strataMap.set(point.stratum, []);
      }
      strataMap.get(point.stratum)!.push(point.value);
    });

    const summaries: StratumSummary[] = Array.from(strataMap.entries()).map(([stratum, values], index) => {
      const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
      const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (values.length - 1);
      const stdDev = Math.sqrt(variance);
      
      return {
        stratum,
        count: values.length,
        mean: Number(mean.toFixed(3)),
        stdDev: Number(stdDev.toFixed(3)),
        min: Math.min(...values),
        max: Math.max(...values),
        color: colors[index % colors.length]
      };
    });

    setAnalysis(summaries);
  };

  const exportResults = () => {
    if (analysis.length === 0) return;

    const results = `
STRATIFICATION ANALYSIS RESULTS
==============================

Total Data Points: ${data.length}
Number of Strata: ${analysis.length}

STRATA SUMMARY:
${analysis.map(s => `
${s.stratum}:
  Count: ${s.count}
  Mean: ${s.mean}
  Std Dev: ${s.stdDev}
  Range: ${s.min} - ${s.max}
`).join('')}

VARIATION ANALYSIS:
Overall Mean: ${(data.reduce((sum, d) => sum + d.value, 0) / data.length).toFixed(3)}
Between-Group Variation: ${analysis.some(s => Math.abs(s.mean - analysis[0].mean) > analysis[0].stdDev) ? 'Significant' : 'Minor'}

RECOMMENDATIONS:
${analysis.length > 1 ? '- Investigate differences between strata' : '- Consider additional stratification factors'}
${analysis.some(s => s.stdDev > analysis[0].stdDev * 1.5) ? '- Some strata show higher variation - investigate causes' : '- Variation appears consistent across strata'}

Analysis Date: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([results], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stratification-analysis-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setData([]);
    setRawData("");
    setAnalysis([]);
  };

  return (
    <Card className="card-professional">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Layers className="h-6 w-6 text-primary" />
            <CardTitle>Stratification Analysis</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            {analysis.length > 0 && (
              <Button variant="analytics" onClick={exportResults}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="input" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input">Data Input</TabsTrigger>
            <TabsTrigger value="results">Analysis Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="input" className="space-y-4">
            <Button variant="outline" onClick={generateSampleData}>
              Generate Sample Data
            </Button>
            
            <div className="space-y-2">
              <Label htmlFor="data">
                CSV Data (Format: Value, Stratum, Date)
              </Label>
              <p className="text-sm text-muted-foreground">
                First row should contain headers: Value,Shift,Date (or similar)
              </p>
              <textarea
                id="data"
                className="w-full h-40 p-3 border border-border rounded-md resize-none font-mono text-sm"
                value={rawData}
                onChange={(e) => setRawData(e.target.value)}
                placeholder="Value,Shift,Date
52.1,Morning,2024-01-01
48.5,Afternoon,2024-01-01
46.8,Night,2024-01-01"
              />
            </div>
            
            <Button variant="professional" onClick={processData}>
              Analyze Stratification
            </Button>
          </TabsContent>
          
          <TabsContent value="results">
            {analysis.length > 0 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{data.length}</div>
                    <div className="text-sm text-muted-foreground">Total Points</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{analysis.length}</div>
                    <div className="text-sm text-muted-foreground">Strata</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {(data.reduce((sum, d) => sum + d.value, 0) / data.length).toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">Overall Mean</div>
                  </div>
                </div>

                {/* Stratification Chart */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Stratification Comparison</h4>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analysis} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="stratum" 
                          tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                        />
                        <YAxis 
                          tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                          label={{ value: 'Mean Value', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px"
                          }}
                        />
                        <Bar 
                          dataKey="mean" 
                          fill="hsl(var(--primary))"
                          fillOpacity={0.8}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Strata Summary Table */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Strata Summary</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-border">
                      <thead>
                        <tr className="bg-muted/30">
                          <th className="border border-border p-2 text-left">Stratum</th>
                          <th className="border border-border p-2 text-right">Count</th>
                          <th className="border border-border p-2 text-right">Mean</th>
                          <th className="border border-border p-2 text-right">Std Dev</th>
                          <th className="border border-border p-2 text-right">Min</th>
                          <th className="border border-border p-2 text-right">Max</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analysis.map((stratum, index) => (
                          <tr key={index}>
                            <td className="border border-border p-2 font-medium">{stratum.stratum}</td>
                            <td className="border border-border p-2 text-right">{stratum.count}</td>
                            <td className="border border-border p-2 text-right">{stratum.mean}</td>
                            <td className="border border-border p-2 text-right">{stratum.stdDev}</td>
                            <td className="border border-border p-2 text-right">{stratum.min}</td>
                            <td className="border border-border p-2 text-right">{stratum.max}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h5 className="font-semibold mb-2">Analysis Insights:</h5>
                  <ul className="space-y-1 text-sm">
                    <li>• {analysis.length} distinct strata identified</li>
                    <li>• Mean variation range: {Math.min(...analysis.map(s => s.mean)).toFixed(2)} - {Math.max(...analysis.map(s => s.mean)).toFixed(2)}</li>
                    <li>• {analysis.some(s => Math.abs(s.mean - analysis[0].mean) > analysis[0].stdDev) ? 
                      'Significant differences detected between strata' : 
                      'Minimal differences between strata means'}</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No analysis generated yet. Please input data and analyze stratification.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}