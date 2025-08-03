import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Upload, Download, RotateCcw, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ControlChartData {
  samples: number[][];
  means: number[];
  ranges: number[];
  grandMean: number;
  avgRange: number;
  uclX: number;
  lclX: number;
  uclR: number;
  lclR: number;
  outOfControlPoints: number[];
  chartType: string;
}

export function ControlChartTool() {
  const { toast } = useToast();
  const [data, setData] = useState<ControlChartData | null>(null);
  const [rawData, setRawData] = useState("");
  const [chartType, setChartType] = useState("xbar-r");
  const [subgroupSize, setSubgroupSize] = useState(5);

  const generateSampleData = () => {
    const samples = [];
    for (let i = 0; i < 25; i++) {
      const sample = [];
      for (let j = 0; j < subgroupSize; j++) {
        sample.push(Math.round((Math.random() * 10 + 50) * 100) / 100);
      }
      samples.push(sample);
    }
    setRawData(samples.map(sample => sample.join(",")).join("\n"));
    toast({ title: "Sample Data Generated", description: "Control chart sample data loaded." });
  };

  const calculateControlLimits = (samples: number[][]) => {
    const means = samples.map(sample => sample.reduce((sum, val) => sum + val, 0) / sample.length);
    const ranges = samples.map(sample => Math.max(...sample) - Math.min(...sample));
    
    const grandMean = means.reduce((sum, mean) => sum + mean, 0) / means.length;
    const avgRange = ranges.reduce((sum, range) => sum + range, 0) / ranges.length;
    
    // Control chart constants
    const A2 = subgroupSize === 2 ? 1.88 : subgroupSize === 3 ? 1.023 : subgroupSize === 4 ? 0.729 : 0.577;
    const D3 = subgroupSize === 2 ? 0 : subgroupSize === 3 ? 0 : subgroupSize === 4 ? 0 : 0.114;
    const D4 = subgroupSize === 2 ? 3.267 : subgroupSize === 3 ? 2.574 : subgroupSize === 4 ? 2.282 : 2.114;
    
    const uclX = grandMean + A2 * avgRange;
    const lclX = grandMean - A2 * avgRange;
    const uclR = D4 * avgRange;
    const lclR = D3 * avgRange;
    
    // Detect out-of-control points
    const outOfControlPoints: number[] = [];
    means.forEach((mean, index) => {
      if (mean > uclX || mean < lclX) {
        outOfControlPoints.push(index + 1);
      }
    });
    ranges.forEach((range, index) => {
      if (range > uclR || range < lclR) {
        outOfControlPoints.push(index + 1);
      }
    });

    return {
      samples,
      means,
      ranges,
      grandMean,
      avgRange,
      uclX,
      lclX,
      uclR,
      lclR,
      outOfControlPoints: [...new Set(outOfControlPoints)],
      chartType
    };
  };

  const processData = () => {
    try {
      const lines = rawData.trim().split('\n');
      const samples = lines.map(line => 
        line.split(',').map(val => parseFloat(val.trim())).filter(val => !isNaN(val))
      ).filter(sample => sample.length > 0);
      
      if (samples.length < 5) {
        toast({ title: "Error", description: "Please enter at least 5 subgroups.", variant: "destructive" });
        return;
      }
      
      const results = calculateControlLimits(samples);
      setData(results);
      toast({ title: "Analysis Complete", description: `Processed ${samples.length} subgroups.` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to process data.", variant: "destructive" });
    }
  };

  return (
    <Card className="card-professional">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LineChart className="h-6 w-6 text-primary" />
            <CardTitle>Control Charts</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setData(null); setRawData(""); }}>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Chart Type</Label>
                <Select value={chartType} onValueChange={setChartType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="xbar-r">X-bar & R Chart</SelectItem>
                    <SelectItem value="individual">Individual Chart</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subgroup">Subgroup Size</Label>
                <Input 
                  id="subgroup" 
                  type="number" 
                  value={subgroupSize} 
                  onChange={(e) => setSubgroupSize(Math.max(2, parseInt(e.target.value) || 5))}
                  min="2" max="10" 
                />
              </div>
              <Button variant="outline" onClick={generateSampleData} className="mt-6">
                Generate Sample
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="data">Subgroup Data (comma separated, one subgroup per line)</Label>
              <Textarea 
                id="data" 
                value={rawData} 
                onChange={(e) => setRawData(e.target.value)} 
                placeholder="50.1,49.8,50.2,49.9,50.0&#10;49.7,50.3,49.6,50.1,49.8" 
                rows={8} 
              />
            </div>
            
            <Button variant="professional" onClick={processData}>
              Generate Control Charts
            </Button>
          </TabsContent>
          
          <TabsContent value="results">
            {data ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{data.grandMean.toFixed(3)}</div>
                    <div className="text-sm text-muted-foreground">Grand Mean</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{data.avgRange.toFixed(3)}</div>
                    <div className="text-sm text-muted-foreground">Avg Range</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{data.uclX.toFixed(3)}</div>
                    <div className="text-sm text-muted-foreground">UCL (X-bar)</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{data.lclX.toFixed(3)}</div>
                    <div className="text-sm text-muted-foreground">LCL (X-bar)</div>
                  </div>
                </div>
                
                {data.outOfControlPoints.length > 0 && (
                  <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <div>
                      <div className="font-semibold text-destructive">Out of Control Detected</div>
                      <div className="text-sm text-muted-foreground">
                        Subgroups: {data.outOfControlPoints.join(", ")}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Control Chart Interpretation</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium mb-2">Process Status</h5>
                      <div className="space-y-1">
                        <div>{data.outOfControlPoints.length === 0 ? "✓ Process is in statistical control" : "⚠ Process shows special cause variation"}</div>
                        <div>Total subgroups analyzed: {data.samples.length}</div>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Control Limits</h5>
                      <div className="space-y-1">
                        <div>X-bar UCL: {data.uclX.toFixed(3)}</div>
                        <div>X-bar LCL: {data.lclX.toFixed(3)}</div>
                        <div>R UCL: {data.uclR.toFixed(3)}</div>
                        <div>R LCL: {data.lclR.toFixed(3)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No data analyzed yet. Please input data and generate control charts.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}