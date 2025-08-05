import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Upload, Download, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from "recharts";

interface HistogramData {
  values: number[];
  bins: number;
  mean: number;
  median: number;
  stdDev: number;
  skewness: number;
  kurtosis: number;
  chartData: { bin: string; count: number; range: string }[];
}

export function HistogramTool() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<HistogramData | null>(null);
  const [rawData, setRawData] = useState("");
  const [bins, setBins] = useState(10);

  const calculateStats = (values: number[]): HistogramData => {
    const n = values.length;
    const mean = values.reduce((sum, val) => sum + val, 0) / n;
    const sortedValues = [...values].sort((a, b) => a - b);
    const median = n % 2 === 0 
      ? (sortedValues[n/2 - 1] + sortedValues[n/2]) / 2 
      : sortedValues[Math.floor(n/2)];
    
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (n - 1);
    const stdDev = Math.sqrt(variance);
    
    const skewness = values.reduce((sum, val) => sum + Math.pow((val - mean) / stdDev, 3), 0) / n;
    const kurtosis = values.reduce((sum, val) => sum + Math.pow((val - mean) / stdDev, 4), 0) / n - 3;

    // Create histogram bins
    const min = Math.min(...values);
    const max = Math.max(...values);
    const binWidth = (max - min) / bins;
    const binCounts = new Array(bins).fill(0);
    const chartData = [];

    values.forEach(value => {
      const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
      binCounts[binIndex]++;
    });

    for (let i = 0; i < bins; i++) {
      const binStart = min + i * binWidth;
      const binEnd = min + (i + 1) * binWidth;
      chartData.push({
        bin: `Bin ${i + 1}`,
        count: binCounts[i],
        range: `${binStart.toFixed(1)}-${binEnd.toFixed(1)}`
      });
    }

    return { values, bins, mean, median, stdDev, skewness, kurtosis, chartData };
  };

  const processData = () => {
    try {
      const values = rawData.split(/[\n,\s]+/).map(v => v.trim()).filter(v => v !== "").map(v => parseFloat(v)).filter(v => !isNaN(v));
      if (values.length < 3) {
        toast({ title: "Error", description: "Please enter at least 3 numeric values.", variant: "destructive" });
        return;
      }
      const stats = calculateStats(values);
      setData(stats);
      toast({ title: "Data Processed", description: `Successfully processed ${values.length} data points.` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to process data.", variant: "destructive" });
    }
  };

  const generateSampleData = () => {
    const sampleValues = Array.from({ length: 100 }, () => {
      const u1 = Math.random();
      const u2 = Math.random();
      const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      return Math.round((z0 * 5 + 50) * 100) / 100;
    });
    setRawData(sampleValues.join(", "));
    toast({ title: "Sample Data Generated", description: "Normal distribution sample data loaded." });
  };

  return (
    <Card className="card-professional">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-primary" />
            <CardTitle>Histogram Analysis</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setData(null); setRawData(""); setBins(10); }}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
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
            <Button variant="outline" onClick={generateSampleData}>Generate Sample Data</Button>
            <div className="space-y-2">
              <Label htmlFor="data">Data (comma or space separated)</Label>
              <Textarea id="data" value={rawData} onChange={(e) => setRawData(e.target.value)} placeholder="Enter numeric values" rows={6} />
            </div>
            <div className="flex items-center gap-4">
              <div>
                <Label htmlFor="bins">Number of Bins</Label>
                <Input id="bins" type="number" value={bins} onChange={(e) => setBins(Math.max(3, parseInt(e.target.value) || 10))} min="3" max="50" className="w-20" />
              </div>
              <Button variant="professional" onClick={processData} className="mt-6">Analyze Data</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="results">
            {data ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{data.mean.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">Mean</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{data.median.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">Median</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{data.stdDev.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">Std Dev</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{data.values.length}</div>
                    <div className="text-sm text-muted-foreground">Sample Size</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Distribution Shape</h4>
                    <div className="space-y-1 text-sm">
                      <div>Skewness: {data.skewness.toFixed(4)}</div>
                      <div>Kurtosis: {data.kurtosis.toFixed(4)}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Interpretation</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>{Math.abs(data.skewness) < 0.5 ? "✓ Approximately symmetric" : data.skewness > 0.5 ? "→ Right-skewed" : "← Left-skewed"}</div>
                      <div>{Math.abs(data.kurtosis) < 1 ? "✓ Normal-like tails" : data.kurtosis > 1 ? "⬆ Heavy tails" : "⬇ Light tails"}</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Histogram Visualization</h4>
                  <div className="h-64">
                    <ChartContainer
                      config={{
                        count: { label: "Frequency", color: "hsl(var(--primary))" }
                      }}
                      className="h-full w-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <XAxis dataKey="bin" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="count" fill="hsl(var(--primary))" />
                          <ReferenceLine x={`Bin ${Math.ceil(data.bins * (data.mean - Math.min(...data.values)) / (Math.max(...data.values) - Math.min(...data.values)))}`} stroke="hsl(var(--destructive))" strokeDasharray="5 5" label="Mean" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No data analyzed yet. Please input data and click "Analyze Data".</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}