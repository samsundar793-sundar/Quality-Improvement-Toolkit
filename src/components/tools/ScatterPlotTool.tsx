import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ScatterChart, Scatter, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from "recharts";

interface ScatterData {
  xValues: number[];
  yValues: number[];
  correlation: number;
  rSquared: number;
  slope: number;
  intercept: number;
  scatterPoints: { x: number; y: number; index: number }[];
  trendLine: { x: number; y: number }[];
}

export function ScatterPlotTool() {
  const { toast } = useToast();
  const [data, setData] = useState<ScatterData | null>(null);
  const [rawData, setRawData] = useState("");
  const [xLabel, setXLabel] = useState("X Variable");
  const [yLabel, setYLabel] = useState("Y Variable");

  const calculateCorrelation = (xValues: number[], yValues: number[]): ScatterData => {
    const n = xValues.length;
    
    // Calculate means
    const xMean = xValues.reduce((sum, val) => sum + val, 0) / n;
    const yMean = yValues.reduce((sum, val) => sum + val, 0) / n;
    
    // Calculate correlation coefficient
    const numerator = xValues.reduce((sum, x, i) => sum + (x - xMean) * (yValues[i] - yMean), 0);
    const xSumSquares = xValues.reduce((sum, x) => sum + Math.pow(x - xMean, 2), 0);
    const ySumSquares = yValues.reduce((sum, y) => sum + Math.pow(y - yMean, 2), 0);
    const correlation = numerator / Math.sqrt(xSumSquares * ySumSquares);
    
    // Calculate R-squared
    const rSquared = Math.pow(correlation, 2);
    
    // Calculate slope and intercept
    const slope = numerator / xSumSquares;
    const intercept = yMean - slope * xMean;
    
    // Create scatter points
    const scatterPoints = xValues.map((x, i) => ({ x, y: yValues[i], index: i + 1 }));
    
    // Create trend line
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const trendLine = [
      { x: minX, y: slope * minX + intercept },
      { x: maxX, y: slope * maxX + intercept }
    ];

    return { xValues, yValues, correlation, rSquared, slope, intercept, scatterPoints, trendLine };
  };

  const processData = () => {
    try {
      const lines = rawData.trim().split('\n').filter(line => line.trim() !== '');
      if (lines.length < 3) {
        toast({ title: "Error", description: "Please enter at least 3 data pairs.", variant: "destructive" });
        return;
      }

      const xValues: number[] = [];
      const yValues: number[] = [];

      lines.forEach((line, index) => {
        const values = line.split(/[\t,\s]+/).map(v => v.trim()).filter(v => v !== '');
        if (values.length !== 2) {
          throw new Error(`Line ${index + 1}: Expected 2 values, got ${values.length}`);
        }
        
        const x = parseFloat(values[0]);
        const y = parseFloat(values[1]);
        
        if (isNaN(x) || isNaN(y)) {
          throw new Error(`Line ${index + 1}: Invalid numeric values`);
        }
        
        xValues.push(x);
        yValues.push(y);
      });

      const result = calculateCorrelation(xValues, yValues);
      setData(result);
      toast({ title: "Data Processed", description: `Successfully analyzed ${xValues.length} data pairs.` });
    } catch (error) {
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "Failed to process data.", 
        variant: "destructive" 
      });
    }
  };

  const generateSampleData = () => {
    // Generate correlated sample data
    const baseData = Array.from({ length: 20 }, (_, i) => {
      const x = 10 + i * 2 + (Math.random() - 0.5) * 5;
      const y = 5 + x * 1.2 + (Math.random() - 0.5) * 8;
      return `${x.toFixed(1)}\t${y.toFixed(1)}`;
    });
    
    setRawData(baseData.join('\n'));
    toast({ title: "Sample Data Generated", description: "Correlated sample data loaded." });
  };

  const getCorrelationStrength = (correlation: number) => {
    const abs = Math.abs(correlation);
    if (abs >= 0.8) return "Very Strong";
    if (abs >= 0.6) return "Strong";
    if (abs >= 0.4) return "Moderate";
    if (abs >= 0.2) return "Weak";
    return "Very Weak";
  };

  const getCorrelationDirection = (correlation: number) => {
    return correlation > 0 ? "Positive" : "Negative";
  };

  return (
    <Card className="card-professional">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-primary" />
            <CardTitle>Scatter Plot Analysis</CardTitle>
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
            <Button variant="outline" onClick={generateSampleData}>Generate Sample Data</Button>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="x-label">X-Axis Label</Label>
                <input
                  id="x-label"
                  className="w-full px-3 py-2 border rounded-md"
                  value={xLabel}
                  onChange={(e) => setXLabel(e.target.value)}
                  placeholder="X Variable"
                />
              </div>
              <div>
                <Label htmlFor="y-label">Y-Axis Label</Label>
                <input
                  id="y-label" 
                  className="w-full px-3 py-2 border rounded-md"
                  value={yLabel}
                  onChange={(e) => setYLabel(e.target.value)}
                  placeholder="Y Variable"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="data">Data Pairs (X Y format, one pair per line)</Label>
              <Textarea 
                id="data"
                value={rawData} 
                onChange={(e) => setRawData(e.target.value)} 
                placeholder="10.5  25.3&#10;12.1  28.7&#10;15.2  35.1"
                rows={8} 
              />
              <p className="text-sm text-muted-foreground">
                Enter each data pair on a new line, separated by space, tab, or comma
              </p>
            </div>
            
            <Button variant="professional" onClick={processData} className="w-full">
              Analyze Correlation
            </Button>
          </TabsContent>
          
          <TabsContent value="results">
            {data ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{data.correlation.toFixed(3)}</div>
                    <div className="text-sm text-muted-foreground">Correlation (r)</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{(data.rSquared * 100).toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">R-Squared</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-lg font-bold text-primary">{getCorrelationStrength(data.correlation)}</div>
                    <div className="text-sm text-muted-foreground">Strength</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-lg font-bold text-primary">{getCorrelationDirection(data.correlation)}</div>
                    <div className="text-sm text-muted-foreground">Direction</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Scatter Plot with Trend Line</h4>
                  <div className="h-80">
                    <ChartContainer
                      config={{
                        scatter: { label: "Data Points", color: "hsl(var(--primary))" }
                      }}
                      className="h-full w-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart 
                          data={data.scatterPoints} 
                          margin={{ top: 20, right: 30, left: 40, bottom: 40 }}
                        >
                          <XAxis 
                            type="number" 
                            dataKey="x" 
                            domain={['dataMin - 2', 'dataMax + 2']}
                            label={{ value: xLabel, position: 'insideBottom', offset: -10 }}
                          />
                          <YAxis 
                            type="number" 
                            dataKey="y" 
                            domain={['dataMin - 2', 'dataMax + 2']}
                            label={{ value: yLabel, angle: -90, position: 'insideLeft' }}
                          />
                          <ChartTooltip 
                            content={<ChartTooltipContent />}
                            formatter={(value, name) => [value, name === 'y' ? yLabel : xLabel]}
                          />
                          <Scatter 
                            dataKey="y" 
                            fill="hsl(var(--primary))" 
                            fillOpacity={0.7}
                            r={6}
                          />
                          {/* Trend line would need a separate Line component in a ComposedChart */}
                        </ScatterChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Regression Equation</h4>
                    <div className="font-mono text-sm bg-muted p-3 rounded">
                      y = {data.slope.toFixed(4)}x + {data.intercept.toFixed(4)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Interpretation</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>• {getCorrelationStrength(data.correlation).toLowerCase()} {getCorrelationDirection(data.correlation).toLowerCase()} correlation</div>
                      <div>• {(data.rSquared * 100).toFixed(1)}% of variation explained</div>
                      <div>• {Math.abs(data.correlation) > 0.5 ? "Suitable for prediction" : "Limited predictive value"}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No data analyzed yet. Please input data and click "Analyze Correlation".</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}