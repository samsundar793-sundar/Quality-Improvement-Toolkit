import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gauge, Upload, Download, RotateCcw, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GageRRData {
  parts: string[];
  appraisers: string[];
  measurements: number[][][]; // [part][appraiser][trial]
  trials: number;
  results?: {
    totalVariation: number;
    repeatability: number;
    reproducibility: number;
    partToPartVariation: number;
    studyVariation: number;
    studyVariationPercent: number;
    tolerancePercent: number;
    distinctCategories: number;
    pValue: number;
    acceptable: boolean;
  };
}

export function AdvancedGageRRTool() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<GageRRData>({
    parts: ["Part1", "Part2", "Part3"],
    appraisers: ["Appraiser1", "Appraiser2"],
    measurements: [],
    trials: 2
  });
  const [tolerance, setTolerance] = useState(6);

  const initializeMeasurements = () => {
    const measurements = data.parts.map(() => 
      data.appraisers.map(() => 
        Array(data.trials).fill(0)
      )
    );
    setData(prev => ({ ...prev, measurements }));
  };

  const updateMeasurement = (partIndex: number, appraiserIndex: number, trialIndex: number, value: number) => {
    setData(prev => ({
      ...prev,
      measurements: prev.measurements.map((part, pIdx) =>
        pIdx === partIndex 
          ? part.map((appraiser, aIdx) =>
              aIdx === appraiserIndex
                ? appraiser.map((trial, tIdx) => tIdx === trialIndex ? value : trial)
                : appraiser
            )
          : part
      )
    }));
  };

  const addPart = () => {
    const newPartName = `Part${data.parts.length + 1}`;
    setData(prev => ({
      ...prev,
      parts: [...prev.parts, newPartName],
      measurements: [
        ...prev.measurements,
        prev.appraisers.map(() => Array(prev.trials).fill(0))
      ]
    }));
  };

  const addAppraiser = () => {
    const newAppraiserName = `Appraiser${data.appraisers.length + 1}`;
    setData(prev => ({
      ...prev,
      appraisers: [...prev.appraisers, newAppraiserName],
      measurements: prev.measurements.map(part => [
        ...part,
        Array(prev.trials).fill(0)
      ])
    }));
  };

  const calculateGageRR = () => {
    if (!data.measurements.length || data.measurements.some(part => 
      part.some(appraiser => appraiser.some(trial => trial === 0))
    )) {
      toast({
        title: "Error",
        description: "Please fill in all measurements before analyzing.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Calculate averages and ranges
      const partAverages = data.measurements.map(part => {
        const allMeasurements = part.flat();
        return allMeasurements.reduce((sum, val) => sum + val, 0) / allMeasurements.length;
      });

      const appraiserAverages = data.appraisers.map((_, aIdx) => {
        const measurements = data.measurements.flatMap(part => part[aIdx]);
        return measurements.reduce((sum, val) => sum + val, 0) / measurements.length;
      });

      // Calculate ranges for repeatability
      const ranges = data.measurements.flatMap(part =>
        part.map(appraiser => Math.max(...appraiser) - Math.min(...appraiser))
      );
      const averageRange = ranges.reduce((sum, range) => sum + range, 0) / ranges.length;

      // Gage R&R calculations (simplified)
      const d2 = data.trials === 2 ? 1.128 : data.trials === 3 ? 1.693 : 2.059; // d2 factors
      const repeatability = averageRange / d2;
      
      // Calculate reproducibility (appraiser variation)
      const appraiserVariance = appraiserAverages.reduce((sum, avg) => {
        const grandAverage = appraiserAverages.reduce((s, a) => s + a, 0) / appraiserAverages.length;
        return sum + Math.pow(avg - grandAverage, 2);
      }, 0) / (data.appraisers.length - 1);
      
      const reproducibility = Math.sqrt(Math.max(0, appraiserVariance * data.parts.length * data.trials));

      // Part-to-part variation
      const partVariance = partAverages.reduce((sum, avg) => {
        const grandAverage = partAverages.reduce((s, a) => s + a, 0) / partAverages.length;
        return sum + Math.pow(avg - grandAverage, 2);
      }, 0) / (data.parts.length - 1);
      
      const partToPartVariation = Math.sqrt(partVariance * data.appraisers.length * data.trials);

      // Total variation
      const gageRR = Math.sqrt(Math.pow(repeatability, 2) + Math.pow(reproducibility, 2));
      const totalVariation = Math.sqrt(Math.pow(gageRR, 2) + Math.pow(partToPartVariation, 2));
      
      // Study variation
      const studyVariation = 5.15 * gageRR;
      const studyVariationPercent = (gageRR / totalVariation) * 100;
      const tolerancePercent = (studyVariation / tolerance) * 100;
      
      // Number of distinct categories
      const distinctCategories = Math.floor(1.41 * (partToPartVariation / gageRR));
      
      // Acceptance criteria
      const acceptable = studyVariationPercent < 10 && distinctCategories >= 5;

      const results = {
        totalVariation,
        repeatability,
        reproducibility,
        partToPartVariation,
        studyVariation,
        studyVariationPercent,
        tolerancePercent,
        distinctCategories,
        pValue: 0.05, // Simplified
        acceptable
      };

      setData(prev => ({ ...prev, results }));
      
      toast({
        title: "Analysis Complete",
        description: `Gage R&R study ${acceptable ? 'passed' : 'failed'} acceptance criteria.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to calculate Gage R&R. Please check your data.",
        variant: "destructive"
      });
    }
  };

  const generateSampleData = () => {
    setData({
      parts: ["Part A", "Part B", "Part C", "Part D", "Part E"],
      appraisers: ["Operator 1", "Operator 2", "Operator 3"],
      trials: 3,
      measurements: [
        [[10.2, 10.1, 10.3], [10.0, 10.2, 10.1], [10.1, 10.0, 10.2]],
        [[15.1, 15.2, 15.0], [15.0, 15.1, 15.2], [15.2, 15.1, 15.0]],
        [[20.0, 20.1, 19.9], [20.1, 20.0, 20.2], [19.9, 20.0, 20.1]],
        [[25.2, 25.1, 25.3], [25.1, 25.2, 25.0], [25.0, 25.1, 25.2]],
        [[30.1, 30.0, 30.2], [30.2, 30.1, 30.0], [30.0, 30.2, 30.1]]
      ]
    });
    
    toast({
      title: "Sample Data Loaded",
      description: "Sample measurement data has been loaded."
    });
  };

  const exportResults = () => {
    if (!data.results) return;

    const results = `
GAGE R&R STUDY RESULTS
=====================

Study Configuration:
- Parts: ${data.parts.length}
- Appraisers: ${data.appraisers.length}
- Trials per combination: ${data.trials}
- Tolerance: ${tolerance}

Variance Components:
- Repeatability (Equipment Variation): ${data.results.repeatability.toFixed(4)}
- Reproducibility (Appraiser Variation): ${data.results.reproducibility.toFixed(4)}
- Part-to-Part Variation: ${data.results.partToPartVariation.toFixed(4)}
- Total Variation: ${data.results.totalVariation.toFixed(4)}

Study Variation:
- Study Variation (5.15σ): ${data.results.studyVariation.toFixed(4)}
- % Study Variation: ${data.results.studyVariationPercent.toFixed(2)}%
- % Tolerance: ${data.results.tolerancePercent.toFixed(2)}%

Analysis Results:
- Number of Distinct Categories: ${data.results.distinctCategories}
- Measurement System: ${data.results.acceptable ? 'ACCEPTABLE' : 'NOT ACCEPTABLE'}

Acceptance Criteria:
- % Study Variation < 10%: ${data.results.studyVariationPercent < 10 ? 'PASS' : 'FAIL'}
- Distinct Categories ≥ 5: ${data.results.distinctCategories >= 5 ? 'PASS' : 'FAIL'}

Interpretation:
${data.results.studyVariationPercent < 10 ? 
  'The measurement system is acceptable for its intended use.' :
  data.results.studyVariationPercent < 30 ?
  'The measurement system may be acceptable depending on application.' :
  'The measurement system is not acceptable and needs improvement.'}

Analysis Date: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([results], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gage-rr-study-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setData({
      parts: ["Part1", "Part2", "Part3"],
      appraisers: ["Appraiser1", "Appraiser2"],
      measurements: [],
      trials: 2
    });
    setTolerance(6);
  };

  return (
    <Card className="card-professional">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Gauge className="h-6 w-6 text-primary" />
            <CardTitle>Gage Repeatability & Reproducibility Study</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            {data.results && (
              <Button variant="analytics" onClick={exportResults}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="setup" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="setup">Study Setup</TabsTrigger>
            <TabsTrigger value="data">Data Entry</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="setup" className="space-y-4">
            <div className="flex gap-2 mb-4">
              <Button variant="outline" onClick={generateSampleData}>
                Load Sample Data
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Number of Trials</Label>
                <Input
                  type="number"
                  value={data.trials}
                  onChange={(e) => setData(prev => ({ ...prev, trials: Math.max(2, parseInt(e.target.value) || 2) }))}
                  min="2"
                  max="5"
                />
              </div>
              <div>
                <Label>Tolerance Specification</Label>
                <Input
                  type="number"
                  value={tolerance}
                  onChange={(e) => setTolerance(parseFloat(e.target.value) || 6)}
                  step="0.1"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold">Parts</Label>
                  <Button variant="outline" size="sm" onClick={addPart}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Part
                  </Button>
                </div>
                {data.parts.map((part, index) => (
                  <Input
                    key={index}
                    value={part}
                    onChange={(e) => setData(prev => ({
                      ...prev,
                      parts: prev.parts.map((p, i) => i === index ? e.target.value : p)
                    }))}
                    placeholder={`Part ${index + 1}`}
                  />
                ))}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold">Appraisers</Label>
                  <Button variant="outline" size="sm" onClick={addAppraiser}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Appraiser
                  </Button>
                </div>
                {data.appraisers.map((appraiser, index) => (
                  <Input
                    key={index}
                    value={appraiser}
                    onChange={(e) => setData(prev => ({
                      ...prev,
                      appraisers: prev.appraisers.map((a, i) => i === index ? e.target.value : a)
                    }))}
                    placeholder={`Appraiser ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            
            <Button variant="professional" onClick={initializeMeasurements} className="w-full">
              Initialize Measurement Grid
            </Button>
          </TabsContent>
          
          <TabsContent value="data" className="space-y-4">
            {data.measurements.length > 0 ? (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted/30">
                        <th className="border border-border p-2">Part</th>
                        {data.appraisers.map(appraiser => (
                          <th key={appraiser} className="border border-border p-2" colSpan={data.trials}>
                            {appraiser}
                          </th>
                        ))}
                      </tr>
                      <tr className="bg-muted/20">
                        <th className="border border-border p-2"></th>
                        {data.appraisers.map(appraiser => 
                          Array.from({ length: data.trials }, (_, i) => (
                            <th key={`${appraiser}-${i}`} className="border border-border p-1 text-xs">
                              Trial {i + 1}
                            </th>
                          ))
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {data.parts.map((part, partIdx) => (
                        <tr key={part}>
                          <td className="border border-border p-2 font-medium">{part}</td>
                          {data.appraisers.map((_, appraiserIdx) =>
                            Array.from({ length: data.trials }, (_, trialIdx) => (
                              <td key={`${partIdx}-${appraiserIdx}-${trialIdx}`} className="border border-border p-1">
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={data.measurements[partIdx]?.[appraiserIdx]?.[trialIdx] || ""}
                                  onChange={(e) => updateMeasurement(
                                    partIdx, 
                                    appraiserIdx, 
                                    trialIdx, 
                                    parseFloat(e.target.value) || 0
                                  )}
                                  className="w-16 h-8 text-xs"
                                />
                              </td>
                            ))
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Button variant="professional" onClick={calculateGageRR} className="w-full">
                  Calculate Gage R&R
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Please set up your study configuration first and initialize the measurement grid.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="results">
            {data.results ? (
              <div className="space-y-6">
                <div className={`p-4 rounded-lg border-2 ${
                  data.results.acceptable 
                    ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800' 
                    : 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800'
                }`}>
                  <h4 className={`font-bold text-lg ${
                    data.results.acceptable ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
                  }`}>
                    Measurement System: {data.results.acceptable ? 'ACCEPTABLE' : 'NOT ACCEPTABLE'}
                  </h4>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{data.results.studyVariationPercent.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">% Study Variation</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{data.results.tolerancePercent.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">% Tolerance</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{data.results.distinctCategories}</div>
                    <div className="text-sm text-muted-foreground">Distinct Categories</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{((data.results.partToPartVariation / data.results.totalVariation) * 100).toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">% Part Variation</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Variance Components</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium">Repeatability (Equipment): {data.results.repeatability.toFixed(4)}</div>
                      <div className="font-medium">Reproducibility (Appraiser): {data.results.reproducibility.toFixed(4)}</div>
                      <div className="font-medium">Part-to-Part: {data.results.partToPartVariation.toFixed(4)}</div>
                    </div>
                    <div>
                      <div className="font-medium">Total Variation: {data.results.totalVariation.toFixed(4)}</div>
                      <div className="font-medium">Study Variation (5.15σ): {data.results.studyVariation.toFixed(4)}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h5 className="font-semibold mb-2">Interpretation:</h5>
                  <p className="text-sm">
                    {data.results.studyVariationPercent < 10 
                      ? "The measurement system is acceptable for its intended use. The variation from the measurement system is less than 10% of the total variation."
                      : data.results.studyVariationPercent < 30 
                      ? "The measurement system may be acceptable depending on the application, cost of the instrument, cost of repair, etc. Consider improving the measurement system."
                      : "The measurement system is not acceptable and needs improvement before it can be used effectively."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No analysis results yet. Please enter measurement data and calculate Gage R&R.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}