import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TestTube, Download, RotateCcw, Calculator, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type TestType = "one-sample-t" | "two-sample-t" | "paired-t" | "proportion" | "chi-square";

interface TestResult {
  testStatistic: number;
  pValue: number;
  confidenceInterval: [number, number];
  conclusion: string;
  significant: boolean;
}

export function HypothesisTestingTool() {
  const { toast } = useToast();
  const [testType, setTestType] = useState<TestType>("one-sample-t");
  const [alpha, setAlpha] = useState(0.05);
  const [hypothesizedMean, setHypothesizedMean] = useState(100);
  const [sample1Data, setSample1Data] = useState("98, 102, 99, 101, 103, 97, 100, 102, 99, 101");
  const [sample2Data, setSample2Data] = useState("95, 98, 96, 99, 97, 94, 96, 98, 95, 97");
  const [result, setResult] = useState<TestResult | null>(null);

  const parseData = (data: string): number[] => {
    return data.split(/[,\s\n]+/)
      .map(s => parseFloat(s.trim()))
      .filter(n => !isNaN(n));
  };

  const mean = (arr: number[]): number => arr.reduce((a, b) => a + b, 0) / arr.length;
  
  const stdDev = (arr: number[]): number => {
    const m = mean(arr);
    return Math.sqrt(arr.reduce((sum, x) => sum + Math.pow(x - m, 2), 0) / (arr.length - 1));
  };

  // Approximate t-distribution critical value (using normal approximation for simplicity)
  const tCritical = (alpha: number, df: number): number => {
    // Simplified approximation
    const z = {
      0.10: 1.645,
      0.05: 1.96,
      0.01: 2.576,
      0.001: 3.291
    }[alpha] || 1.96;
    
    // Adjust for t-distribution with finite df
    if (df < 30) {
      return z * (1 + 1 / (4 * df));
    }
    return z;
  };

  // Approximate p-value from t-statistic
  const pValueFromT = (t: number, df: number): number => {
    const absT = Math.abs(t);
    // Simplified approximation using normal distribution
    const z = absT;
    const p = 2 * (1 - normalCDF(z));
    return Math.max(0.0001, Math.min(0.9999, p));
  };

  const normalCDF = (z: number): number => {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;
    
    const sign = z < 0 ? -1 : 1;
    z = Math.abs(z) / Math.sqrt(2);
    
    const t = 1.0 / (1.0 + p * z);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);
    
    return 0.5 * (1.0 + sign * y);
  };

  const runTest = () => {
    const sample1 = parseData(sample1Data);
    
    if (sample1.length < 2) {
      toast({
        title: "Error",
        description: "Sample 1 must have at least 2 data points",
        variant: "destructive"
      });
      return;
    }

    let testResult: TestResult;

    switch (testType) {
      case "one-sample-t": {
        const n = sample1.length;
        const xbar = mean(sample1);
        const s = stdDev(sample1);
        const se = s / Math.sqrt(n);
        const t = (xbar - hypothesizedMean) / se;
        const df = n - 1;
        const pVal = pValueFromT(t, df);
        const tc = tCritical(alpha / 2, df);
        const ci: [number, number] = [xbar - tc * se, xbar + tc * se];
        
        testResult = {
          testStatistic: t,
          pValue: pVal,
          confidenceInterval: ci,
          significant: pVal < alpha,
          conclusion: pVal < alpha 
            ? `Reject H₀: The sample mean (${xbar.toFixed(2)}) is significantly different from ${hypothesizedMean}`
            : `Fail to reject H₀: No significant difference from ${hypothesizedMean}`
        };
        break;
      }

      case "two-sample-t": {
        const sample2 = parseData(sample2Data);
        if (sample2.length < 2) {
          toast({
            title: "Error",
            description: "Sample 2 must have at least 2 data points",
            variant: "destructive"
          });
          return;
        }

        const n1 = sample1.length;
        const n2 = sample2.length;
        const x1 = mean(sample1);
        const x2 = mean(sample2);
        const s1 = stdDev(sample1);
        const s2 = stdDev(sample2);
        
        // Welch's t-test
        const se = Math.sqrt(s1 * s1 / n1 + s2 * s2 / n2);
        const t = (x1 - x2) / se;
        const df = Math.floor(Math.pow(s1 * s1 / n1 + s2 * s2 / n2, 2) / 
          (Math.pow(s1 * s1 / n1, 2) / (n1 - 1) + Math.pow(s2 * s2 / n2, 2) / (n2 - 1)));
        const pVal = pValueFromT(t, df);
        const tc = tCritical(alpha / 2, df);
        const diff = x1 - x2;
        const ci: [number, number] = [diff - tc * se, diff + tc * se];
        
        testResult = {
          testStatistic: t,
          pValue: pVal,
          confidenceInterval: ci,
          significant: pVal < alpha,
          conclusion: pVal < alpha 
            ? `Reject H₀: The means are significantly different (${x1.toFixed(2)} vs ${x2.toFixed(2)})`
            : `Fail to reject H₀: No significant difference between means`
        };
        break;
      }

      case "paired-t": {
        const sample2 = parseData(sample2Data);
        if (sample1.length !== sample2.length) {
          toast({
            title: "Error",
            description: "Paired samples must have equal size",
            variant: "destructive"
          });
          return;
        }

        const differences = sample1.map((v, i) => v - sample2[i]);
        const n = differences.length;
        const dbar = mean(differences);
        const sd = stdDev(differences);
        const se = sd / Math.sqrt(n);
        const t = dbar / se;
        const df = n - 1;
        const pVal = pValueFromT(t, df);
        const tc = tCritical(alpha / 2, df);
        const ci: [number, number] = [dbar - tc * se, dbar + tc * se];
        
        testResult = {
          testStatistic: t,
          pValue: pVal,
          confidenceInterval: ci,
          significant: pVal < alpha,
          conclusion: pVal < alpha 
            ? `Reject H₀: There is a significant difference in paired observations (mean diff: ${dbar.toFixed(2)})`
            : `Fail to reject H₀: No significant difference in paired observations`
        };
        break;
      }

      default:
        testResult = {
          testStatistic: 0,
          pValue: 1,
          confidenceInterval: [0, 0],
          significant: false,
          conclusion: "Test not implemented"
        };
    }

    setResult(testResult);
    toast({
      title: "Test Complete",
      description: testResult.significant ? "Statistically significant result" : "Not statistically significant"
    });
  };

  const exportResults = () => {
    if (!result) return;

    const exportData = `
HYPOTHESIS TEST RESULTS
=======================

Test Type: ${testType}
Significance Level (α): ${alpha}

RESULTS:
- Test Statistic: ${result.testStatistic.toFixed(4)}
- P-Value: ${result.pValue.toFixed(4)}
- ${(1 - alpha) * 100}% Confidence Interval: [${result.confidenceInterval[0].toFixed(4)}, ${result.confidenceInterval[1].toFixed(4)}]

CONCLUSION:
${result.conclusion}

Decision: ${result.significant ? "REJECT H₀" : "FAIL TO REJECT H₀"} at α = ${alpha}

DATA:
Sample 1: ${sample1Data}
${testType !== "one-sample-t" ? `Sample 2: ${sample2Data}` : `Hypothesized Mean: ${hypothesizedMean}`}

Analysis Date: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hypothesis-test-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setTestType("one-sample-t");
    setAlpha(0.05);
    setHypothesizedMean(100);
    setSample1Data("98, 102, 99, 101, 103, 97, 100, 102, 99, 101");
    setSample2Data("95, 98, 96, 99, 97, 94, 96, 98, 95, 97");
    setResult(null);
  };

  return (
    <Card className="card-professional">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TestTube className="h-6 w-6 text-primary" />
            <CardTitle>Hypothesis Testing</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="analytics" onClick={exportResults} disabled={!result}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="setup" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="setup">Test Setup</TabsTrigger>
            <TabsTrigger value="data">Data Input</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Test Type</Label>
                <Select value={testType} onValueChange={(v) => setTestType(v as TestType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-sample-t">One-Sample t-Test</SelectItem>
                    <SelectItem value="two-sample-t">Two-Sample t-Test</SelectItem>
                    <SelectItem value="paired-t">Paired t-Test</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Significance Level (α)</Label>
                <Select value={alpha.toString()} onValueChange={(v) => setAlpha(parseFloat(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.10">0.10 (90% confidence)</SelectItem>
                    <SelectItem value="0.05">0.05 (95% confidence)</SelectItem>
                    <SelectItem value="0.01">0.01 (99% confidence)</SelectItem>
                    <SelectItem value="0.001">0.001 (99.9% confidence)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {testType === "one-sample-t" && (
              <div>
                <Label>Hypothesized Mean (μ₀)</Label>
                <Input
                  type="number"
                  value={hypothesizedMean}
                  onChange={(e) => setHypothesizedMean(parseFloat(e.target.value) || 0)}
                />
              </div>
            )}

            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold mb-2">Hypotheses</h4>
              {testType === "one-sample-t" && (
                <div className="space-y-1 text-sm">
                  <p><strong>H₀:</strong> μ = {hypothesizedMean} (population mean equals hypothesized value)</p>
                  <p><strong>H₁:</strong> μ ≠ {hypothesizedMean} (population mean differs from hypothesized value)</p>
                </div>
              )}
              {testType === "two-sample-t" && (
                <div className="space-y-1 text-sm">
                  <p><strong>H₀:</strong> μ₁ = μ₂ (population means are equal)</p>
                  <p><strong>H₁:</strong> μ₁ ≠ μ₂ (population means are different)</p>
                </div>
              )}
              {testType === "paired-t" && (
                <div className="space-y-1 text-sm">
                  <p><strong>H₀:</strong> μ_d = 0 (mean difference is zero)</p>
                  <p><strong>H₁:</strong> μ_d ≠ 0 (mean difference is not zero)</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <div>
              <Label>Sample 1 Data (comma or space separated)</Label>
              <Textarea
                value={sample1Data}
                onChange={(e) => setSample1Data(e.target.value)}
                placeholder="Enter values separated by commas or spaces"
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {parseData(sample1Data).length} values detected
              </p>
            </div>

            {testType !== "one-sample-t" && (
              <div>
                <Label>Sample 2 Data (comma or space separated)</Label>
                <Textarea
                  value={sample2Data}
                  onChange={(e) => setSample2Data(e.target.value)}
                  placeholder="Enter values separated by commas or spaces"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {parseData(sample2Data).length} values detected
                </p>
              </div>
            )}

            <Button onClick={runTest} className="w-full">
              <Calculator className="h-4 w-4 mr-2" />
              Run Hypothesis Test
            </Button>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            {result ? (
              <>
                <div className={`p-6 rounded-lg border-2 ${result.significant ? 'border-green-500 bg-green-50' : 'border-yellow-500 bg-yellow-50'}`}>
                  <div className="flex items-center gap-3 mb-4">
                    {result.significant ? (
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    ) : (
                      <XCircle className="h-8 w-8 text-yellow-500" />
                    )}
                    <div>
                      <h3 className="text-lg font-bold">
                        {result.significant ? "Statistically Significant" : "Not Statistically Significant"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        p-value = {result.pValue.toFixed(4)} {result.significant ? '<' : '≥'} α = {alpha}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm">{result.conclusion}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <div className="text-2xl font-bold text-primary">
                        {result.testStatistic.toFixed(4)}
                      </div>
                      <div className="text-sm text-muted-foreground">Test Statistic (t)</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <div className="text-2xl font-bold text-primary">
                        {result.pValue.toFixed(4)}
                      </div>
                      <div className="text-sm text-muted-foreground">P-Value</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <div className="text-2xl font-bold text-primary">
                        [{result.confidenceInterval[0].toFixed(2)}, {result.confidenceInterval[1].toFixed(2)}]
                      </div>
                      <div className="text-sm text-muted-foreground">{(1 - alpha) * 100}% CI</div>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <TestTube className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <p>Configure your test and enter data, then click "Run Hypothesis Test"</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
