import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Upload, Download, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CapabilityData {
  values: number[];
  mean: number;
  stdDev: number;
  lsl: number;
  usl: number;
  target: number;
  cp: number;
  cpk: number;
  pp: number;
  ppk: number;
  defectRatePPM: number;
  processShift: number;
}

export function ProcessCapabilityTool() {
  const { toast } = useToast();
  const [data, setData] = useState<CapabilityData | null>(null);
  const [rawData, setRawData] = useState("");
  const [lsl, setLsl] = useState(45);
  const [usl, setUsl] = useState(55);
  const [target, setTarget] = useState(50);

  const generateSampleData = () => {
    const sampleValues = Array.from({ length: 100 }, () => {
      const u1 = Math.random();
      const u2 = Math.random();
      const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      return Math.round((z0 * 1.5 + 50) * 100) / 100;
    });
    setRawData(sampleValues.join(", "));
    toast({ title: "Sample Data Generated", description: "Process capability sample data loaded." });
  };

  const calculateCapability = (values: number[]) => {
    const n = values.length;
    const mean = values.reduce((sum, val) => sum + val, 0) / n;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (n - 1);
    const stdDev = Math.sqrt(variance);
    
    // Process capability indices
    const cp = (usl - lsl) / (6 * stdDev);
    const cpk = Math.min((usl - mean) / (3 * stdDev), (mean - lsl) / (3 * stdDev));
    
    // Performance indices (using actual data spread)
    const pp = (usl - lsl) / (6 * stdDev);
    const ppk = Math.min((usl - mean) / (3 * stdDev), (mean - lsl) / (3 * stdDev));
    
    // Defect rate calculation
    const zUsl = (usl - mean) / stdDev;
    const zLsl = (mean - lsl) / stdDev;
    const defectRatePPM = (1 - (erf(zUsl / Math.sqrt(2)) - erf(zLsl / Math.sqrt(2)))) * 1000000;
    
    const processShift = Math.abs(mean - target);

    return {
      values,
      mean,
      stdDev,
      lsl,
      usl,
      target,
      cp,
      cpk,
      pp,
      ppk,
      defectRatePPM,
      processShift
    };
  };

  // Error function approximation
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
      const values = rawData.split(/[\n,\s]+/).map(v => v.trim()).filter(v => v !== "").map(v => parseFloat(v)).filter(v => !isNaN(v));
      if (values.length < 30) {
        toast({ title: "Error", description: "Please enter at least 30 data points for reliable capability analysis.", variant: "destructive" });
        return;
      }
      const results = calculateCapability(values);
      setData(results);
      toast({ title: "Analysis Complete", description: `Capability analysis completed for ${values.length} data points.` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to process data.", variant: "destructive" });
    }
  };

  return (
    <Card className="card-professional">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Target className="h-6 w-6 text-primary" />
            <CardTitle>Process Capability Analysis</CardTitle>
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
            <TabsTrigger value="results">Capability Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="input" className="space-y-4">
            <Button variant="outline" onClick={generateSampleData}>Generate Sample Data</Button>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="lsl">Lower Spec Limit (LSL)</Label>
                <Input id="lsl" type="number" value={lsl} onChange={(e) => setLsl(parseFloat(e.target.value) || 0)} step="0.1" />
              </div>
              <div>
                <Label htmlFor="target">Target Value</Label>
                <Input id="target" type="number" value={target} onChange={(e) => setTarget(parseFloat(e.target.value) || 0)} step="0.1" />
              </div>
              <div>
                <Label htmlFor="usl">Upper Spec Limit (USL)</Label>
                <Input id="usl" type="number" value={usl} onChange={(e) => setUsl(parseFloat(e.target.value) || 0)} step="0.1" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="data">Process Data (comma or space separated)</Label>
              <Textarea 
                id="data" 
                value={rawData} 
                onChange={(e) => setRawData(e.target.value)} 
                placeholder="Enter at least 30 measurement values..." 
                rows={6} 
              />
            </div>
            
            <Button variant="professional" onClick={processData}>
              Calculate Process Capability
            </Button>
          </TabsContent>
          
          <TabsContent value="results">
            {data ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{data.cp.toFixed(3)}</div>
                    <div className="text-sm text-muted-foreground">Cp</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{data.cpk.toFixed(3)}</div>
                    <div className="text-sm text-muted-foreground">Cpk</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{data.pp.toFixed(3)}</div>
                    <div className="text-sm text-muted-foreground">Pp</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{data.ppk.toFixed(3)}</div>
                    <div className="text-sm text-muted-foreground">Ppk</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Process Statistics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Process Mean:</span>
                        <span className="font-medium">{data.mean.toFixed(3)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Standard Deviation:</span>
                        <span className="font-medium">{data.stdDev.toFixed(3)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sample Size:</span>
                        <span className="font-medium">{data.values.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Process Shift:</span>
                        <span className="font-medium">{data.processShift.toFixed(3)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold">Capability Assessment</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Defect Rate:</span>
                        <span className="font-medium">{data.defectRatePPM.toFixed(0)} PPM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Process Width:</span>
                        <span className="font-medium">{(6 * data.stdDev).toFixed(3)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Spec Width:</span>
                        <span className="font-medium">{(data.usl - data.lsl).toFixed(3)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Interpretation Guidelines</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <h5 className="font-medium text-foreground mb-2">Cp/Pp Assessment</h5>
                      <div className="space-y-1">
                        <div>{data.cp >= 1.33 ? "✓ Excellent capability (≥1.33)" : data.cp >= 1.0 ? "⚠ Adequate capability (1.0-1.33)" : "❌ Poor capability (<1.0)"}</div>
                        <div>Process spread vs specification width</div>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-2">Cpk/Ppk Assessment</h5>
                      <div className="space-y-1">
                        <div>{data.cpk >= 1.33 ? "✓ Excellent centering (≥1.33)" : data.cpk >= 1.0 ? "⚠ Adequate centering (1.0-1.33)" : "❌ Poor centering (<1.0)"}</div>
                        <div>Accounts for process centering</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No data analyzed yet. Please input data and calculate capability.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}