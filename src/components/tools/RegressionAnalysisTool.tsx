import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ScatterChart, Scatter, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface RegressionData {
  xValues: number[];
  yValues: number[];
  slope: number;
  intercept: number;
  rSquared: number;
  correlation: number;
  slopeStdError: number;
  interceptStdError: number;
  predictions: number[];
  residuals: number[];
  pValue: number;
  scatterData: { x: number; y: number }[];
  regressionLine: { x: number; y: number }[];
}

export function RegressionAnalysisTool() {
  const { toast } = useToast();
  const [data, setData] = useState<RegressionData | null>(null);
  const [rawData, setRawData] = useState("");

  const generateSampleData = () => {
    const sampleData = [];
    for (let i = 1; i <= 20; i++) {
      const x = i;
      const y = 2.5 * x + 10 + (Math.random() - 0.5) * 8; // Linear relationship with noise
      sampleData.push(`${x},${y.toFixed(2)}`);
    }
    setRawData(sampleData.join("\n"));
    toast({ title: "Sample Data Generated", description: "Linear regression sample data loaded." });
  };

  const calculateRegression = (xValues: number[], yValues: number[]) => {
    const n = xValues.length;
    const sumX = xValues.reduce((sum, x) => sum + x, 0);
    const sumY = yValues.reduce((sum, y) => sum + y, 0);
    const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
    const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);
    const sumYY = yValues.reduce((sum, y) => sum + y * y, 0);

    const meanX = sumX / n;
    const meanY = sumY / n;

    // Calculate slope and intercept
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = meanY - slope * meanX;

    // Calculate correlation and R-squared
    const correlation = (n * sumXY - sumX * sumY) / 
      Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
    const rSquared = correlation * correlation;

    // Calculate predictions and residuals
    const predictions = xValues.map(x => slope * x + intercept);
    const residuals = yValues.map((y, i) => y - predictions[i]);

    // Calculate standard errors
    const sumSquaredResiduals = residuals.reduce((sum, r) => sum + r * r, 0);
    const residualStdError = Math.sqrt(sumSquaredResiduals / (n - 2));
    const sxx = sumXX - (sumX * sumX) / n;
    const slopeStdError = residualStdError / Math.sqrt(sxx);
    const interceptStdError = residualStdError * Math.sqrt(1/n + (meanX * meanX) / sxx);

    // Calculate t-statistic and p-value for slope
    const tStat = slope / slopeStdError;
    const pValue = 2 * (1 - tDistribution(Math.abs(tStat), n - 2));

    // Create scatter plot data
    const scatterData = xValues.map((x, i) => ({ x, y: yValues[i] }));
    
    // Create regression line data
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const regressionLine = [
      { x: minX, y: slope * minX + intercept },
      { x: maxX, y: slope * maxX + intercept }
    ];

    return {
      xValues,
      yValues,
      slope,
      intercept,
      rSquared,
      correlation,
      slopeStdError,
      interceptStdError,
      predictions,
      residuals,
      pValue,
      scatterData,
      regressionLine
    };
  };

  // Simplified t-distribution approximation
  const tDistribution = (t: number, df: number) => {
    if (df > 30) {
      // Normal approximation for large df
      return 0.5 * (1 + erf(t / Math.sqrt(2)));
    }
    // Simplified approximation for smaller df
    return 0.5 + 0.5 * Math.sign(t) * Math.sqrt(1 - Math.exp(-2 * t * t / Math.PI));
  };

  const erf = (x: number) => {
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
  };

  const processData = () => {
    try {
      const lines = rawData.trim().split('\n');
      const dataPoints = lines.map(line => {
        const [x, y] = line.split(',').map(val => parseFloat(val.trim()));
        return { x, y };
      }).filter(point => !isNaN(point.x) && !isNaN(point.y));

      if (dataPoints.length < 3) {
        toast({ title: "Error", description: "Please enter at least 3 data points.", variant: "destructive" });
        return;
      }

      const xValues = dataPoints.map(p => p.x);
      const yValues = dataPoints.map(p => p.y);
      const results = calculateRegression(xValues, yValues);
      setData(results);
      toast({ title: "Analysis Complete", description: `Regression analysis completed for ${dataPoints.length} data points.` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to process data.", variant: "destructive" });
    }
  };

  return (
    <Card className="card-professional">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-primary" />
            <CardTitle>Regression Analysis</CardTitle>
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
            
            <div className="space-y-2">
              <Label htmlFor="data">Data (X,Y pairs - comma separated, one pair per line)</Label>
              <Textarea 
                id="data" 
                value={rawData} 
                onChange={(e) => setRawData(e.target.value)} 
                placeholder="1,12.5&#10;2,15.2&#10;3,17.8&#10;4,20.1" 
                rows={8} 
              />
            </div>
            
            <Button variant="professional" onClick={processData}>
              Perform Regression Analysis
            </Button>
          </TabsContent>
          
          <TabsContent value="results">
            {data ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{data.rSquared.toFixed(4)}</div>
                    <div className="text-sm text-muted-foreground">R²</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{data.correlation.toFixed(4)}</div>
                    <div className="text-sm text-muted-foreground">Correlation</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{data.slope.toFixed(4)}</div>
                    <div className="text-sm text-muted-foreground">Slope</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{data.intercept.toFixed(4)}</div>
                    <div className="text-sm text-muted-foreground">Intercept</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Regression Equation</h4>
                    <div className="p-4 bg-muted/30 rounded-lg font-mono text-lg text-center">
                      Y = {data.slope.toFixed(4)}X + {data.intercept.toFixed(4)}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Slope Std Error:</span>
                        <span className="font-medium">{data.slopeStdError.toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Intercept Std Error:</span>
                        <span className="font-medium">{data.interceptStdError.toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>P-value (slope):</span>
                        <span className="font-medium">{data.pValue.toFixed(6)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold">Model Assessment</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Sample Size:</span>
                        <span className="font-medium">{data.xValues.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Explained Variance:</span>
                        <span className="font-medium">{(data.rSquared * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Relationship Strength:</span>
                        <span className="font-medium">
                          {Math.abs(data.correlation) >= 0.8 ? "Strong" : 
                           Math.abs(data.correlation) >= 0.5 ? "Moderate" : "Weak"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Statistical Interpretation</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <h5 className="font-medium text-foreground mb-2">Significance Test</h5>
                      <div className="space-y-1">
                        <div>{data.pValue < 0.05 ? "✓ Significant relationship (p < 0.05)" : "⚠ No significant relationship (p ≥ 0.05)"}</div>
                        <div>The slope is {data.pValue < 0.05 ? "significantly" : "not significantly"} different from zero</div>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-2">Model Quality</h5>
                      <div className="space-y-1">
                        <div>R² explains {(data.rSquared * 100).toFixed(1)}% of variance</div>
                        <div>Correlation: {data.correlation > 0 ? "Positive" : "Negative"} linear relationship</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Regression Analysis Chart</h4>
                  <div className="h-64">
                    <ChartContainer
                      config={{
                        scatter: { label: "Data Points", color: "hsl(var(--primary))" },
                        regression: { label: "Regression Line", color: "hsl(var(--destructive))" }
                      }}
                      className="h-full w-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart data={data.scatterData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <XAxis type="number" dataKey="x" domain={['dataMin - 1', 'dataMax + 1']} />
                          <YAxis type="number" dataKey="y" domain={['dataMin - 1', 'dataMax + 1']} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Scatter dataKey="y" fill="hsl(var(--primary))" />
                        </ScatterChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No data analyzed yet. Please input data and perform regression analysis.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}