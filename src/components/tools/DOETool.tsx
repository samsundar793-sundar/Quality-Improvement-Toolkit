import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RotateCcw, Download, Calculator, FlaskConical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Factor {
  id: string;
  name: string;
  lowLevel: string;
  highLevel: string;
  unit: string;
}

interface DOEDesign {
  factors: Factor[];
  designType: string;
  runs: number;
  responseVariable: string;
  experimentMatrix: Array<{ [key: string]: string | number }>;
}

export function DOETool() {
  const { toast } = useToast();
  const [design, setDesign] = useState<DOEDesign>({
    factors: [
      { id: "1", name: "", lowLevel: "", highLevel: "", unit: "" },
      { id: "2", name: "", lowLevel: "", highLevel: "", unit: "" }
    ],
    designType: "full-factorial",
    runs: 0,
    responseVariable: "",
    experimentMatrix: []
  });

  const addFactor = () => {
    const newId = (design.factors.length + 1).toString();
    setDesign(prev => ({
      ...prev,
      factors: [...prev.factors, { id: newId, name: "", lowLevel: "", highLevel: "", unit: "" }]
    }));
  };

  const removeFactor = (id: string) => {
    if (design.factors.length > 2) {
      setDesign(prev => ({
        ...prev,
        factors: prev.factors.filter(f => f.id !== id)
      }));
    }
  };

  const updateFactor = (id: string, field: keyof Factor, value: string) => {
    setDesign(prev => ({
      ...prev,
      factors: prev.factors.map(f => f.id === id ? { ...f, [field]: value } : f)
    }));
  };

  const generateDesign = () => {
    const validFactors = design.factors.filter(f => f.name && f.lowLevel && f.highLevel);
    
    if (validFactors.length < 2) {
      toast({
        title: "Error",
        description: "Please define at least 2 factors with valid levels",
        variant: "destructive"
      });
      return;
    }

    let matrix: Array<{ [key: string]: string | number }> = [];
    const numFactors = validFactors.length;

    if (design.designType === "full-factorial") {
      const numRuns = Math.pow(2, numFactors);
      
      for (let run = 0; run < numRuns; run++) {
        const runData: { [key: string]: string | number } = { run: run + 1 };
        
        for (let factorIndex = 0; factorIndex < numFactors; factorIndex++) {
          const factor = validFactors[factorIndex];
          const level = (run >> factorIndex) & 1;
          runData[factor.name] = level === 0 ? factor.lowLevel : factor.highLevel;
        }
        
        runData["Response"] = "";
        matrix.push(runData);
      }
    } else if (design.designType === "fractional-factorial") {
      // Simplified fractional factorial (half fraction)
      const numRuns = Math.pow(2, numFactors - 1);
      
      for (let run = 0; run < numRuns; run++) {
        const runData: { [key: string]: string | number } = { run: run + 1 };
        
        for (let factorIndex = 0; factorIndex < numFactors - 1; factorIndex++) {
          const factor = validFactors[factorIndex];
          const level = (run >> factorIndex) & 1;
          runData[factor.name] = level === 0 ? factor.lowLevel : factor.highLevel;
        }
        
        // Last factor is confounded with interaction
        const lastFactor = validFactors[numFactors - 1];
        let confoundedLevel = 0;
        for (let i = 0; i < numFactors - 1; i++) {
          confoundedLevel ^= (run >> i) & 1;
        }
        runData[lastFactor.name] = confoundedLevel === 0 ? lastFactor.lowLevel : lastFactor.highLevel;
        
        runData["Response"] = "";
        matrix.push(runData);
      }
    }

    // Randomize run order
    for (let i = matrix.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = matrix[i];
      matrix[i] = matrix[j];
      matrix[j] = temp;
      
      // Update run numbers to reflect randomized order
      matrix[i].run = i + 1;
      matrix[j].run = j + 1;
    }

    setDesign(prev => ({
      ...prev,
      runs: matrix.length,
      experimentMatrix: matrix
    }));

    toast({
      title: "Design generated",
      description: `${matrix.length} experimental runs created`,
    });
  };

  const loadTemplate = () => {
    setDesign({
      factors: [
        { id: "1", name: "Temperature", lowLevel: "150", highLevel: "200", unit: "°C" },
        { id: "2", name: "Pressure", lowLevel: "10", highLevel: "20", unit: "PSI" },
        { id: "3", name: "Time", lowLevel: "30", highLevel: "60", unit: "min" }
      ],
      designType: "full-factorial",
      runs: 0,
      responseVariable: "Yield (%)",
      experimentMatrix: []
    });

    toast({
      title: "Template loaded",
      description: "Sample DOE template has been loaded",
    });
  };

  const exportDesign = () => {
    if (design.experimentMatrix.length === 0) {
      toast({
        title: "No design to export",
        description: "Please generate a design first",
        variant: "destructive"
      });
      return;
    }

    const content = `Design of Experiments (DOE)
Generated on: ${new Date().toLocaleDateString()}

Design Type: ${design.designType}
Number of Factors: ${design.factors.filter(f => f.name).length}
Number of Runs: ${design.runs}
Response Variable: ${design.responseVariable}

Factors:
${design.factors.filter(f => f.name).map(f => 
  `${f.name}: ${f.lowLevel} to ${f.highLevel} ${f.unit}`
).join('\n')}

Experimental Matrix:
${design.experimentMatrix.map(run => 
  `Run ${run.run}: ${Object.entries(run).filter(([key]) => key !== 'run').map(([key, value]) => `${key}=${value}`).join(', ')}`
).join('\n')}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'doe-design.txt';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Design exported",
      description: "DOE design has been downloaded",
    });
  };

  const reset = () => {
    setDesign({
      factors: [
        { id: "1", name: "", lowLevel: "", highLevel: "", unit: "" },
        { id: "2", name: "", lowLevel: "", highLevel: "", unit: "" }
      ],
      designType: "full-factorial",
      runs: 0,
      responseVariable: "",
      experimentMatrix: []
    });
  };

  return (
    <Card className="card-professional">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold text-primary">Design of Experiments (DOE)</CardTitle>
            <CardDescription>
              Generate factorial experimental designs for process optimization
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={reset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={loadTemplate}>
              <FlaskConical className="w-4 h-4 mr-2" />
              Load Template
            </Button>
            <Button variant="success" size="sm" onClick={exportDesign}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="setup" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="setup">Design Setup</TabsTrigger>
            <TabsTrigger value="matrix">Experimental Matrix</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Design Type</Label>
                <Select value={design.designType} onValueChange={(value) => setDesign(prev => ({ ...prev, designType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-factorial">Full Factorial (2^k)</SelectItem>
                    <SelectItem value="fractional-factorial">Fractional Factorial (2^(k-1))</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Response Variable</Label>
                <Input
                  placeholder="e.g., Yield, Quality Score, etc."
                  value={design.responseVariable}
                  onChange={(e) => setDesign(prev => ({ ...prev, responseVariable: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Factors</Label>
                <Button variant="outline" size="sm" onClick={addFactor}>
                  Add Factor
                </Button>
              </div>

              <div className="space-y-4">
                {design.factors.map((factor) => (
                  <Card key={factor.id} className="border-muted">
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        <div className="space-y-2">
                          <Label className="text-sm">Factor Name</Label>
                          <Input
                            placeholder="Factor name"
                            value={factor.name}
                            onChange={(e) => updateFactor(factor.id, 'name', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">Low Level (-1)</Label>
                          <Input
                            placeholder="Low value"
                            value={factor.lowLevel}
                            onChange={(e) => updateFactor(factor.id, 'lowLevel', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">High Level (+1)</Label>
                          <Input
                            placeholder="High value"
                            value={factor.highLevel}
                            onChange={(e) => updateFactor(factor.id, 'highLevel', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">Unit</Label>
                          <Input
                            placeholder="Unit"
                            value={factor.unit}
                            onChange={(e) => updateFactor(factor.id, 'unit', e.target.value)}
                          />
                        </div>
                        <div className="flex items-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFactor(factor.id)}
                            disabled={design.factors.length <= 2}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button variant="analytics" onClick={generateDesign} className="w-full">
                <Calculator className="w-4 h-4 mr-2" />
                Generate Experimental Design
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="matrix" className="space-y-6">
            {design.experimentMatrix.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">Experimental Matrix</h3>
                    <p className="text-sm text-muted-foreground">
                      {design.runs} runs • {design.designType} design
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {design.factors.filter(f => f.name).length} factors
                  </Badge>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Run</TableHead>
                        {design.factors.filter(f => f.name).map(factor => (
                          <TableHead key={factor.id}>{factor.name}</TableHead>
                        ))}
                        <TableHead>{design.responseVariable || "Response"}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {design.experimentMatrix.map((run, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{run.run}</TableCell>
                          {design.factors.filter(f => f.name).map(factor => (
                            <TableCell key={factor.id}>{run[factor.name]}</TableCell>
                          ))}
                          <TableCell>
                            <Input
                              placeholder="Enter result"
                              className="w-24"
                              onChange={(e) => {
                                const newMatrix = [...design.experimentMatrix];
                                newMatrix[index] = { ...newMatrix[index], Response: e.target.value };
                                setDesign(prev => ({ ...prev, experimentMatrix: newMatrix }));
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <FlaskConical className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Experimental Design Generated</h3>
                  <p className="text-muted-foreground mb-4">
                    Set up your factors and click "Generate Experimental Design" to create the matrix.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}