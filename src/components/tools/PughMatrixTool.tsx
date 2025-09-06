import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { GitCompare, Download, RotateCcw, Plus, X, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as XLSX from "xlsx";

interface Criterion {
  id: string;
  name: string;
  weight: number;
}

interface Solution {
  id: string;
  name: string;
  scores: { [criterionId: string]: number }; // -1, 0, 1 for worse, same, better
}

export function PughMatrixTool() {
  const { toast } = useToast();
  const [criteria, setCriteria] = useState<Criterion[]>([
    { id: "1", name: "Cost", weight: 3 },
    { id: "2", name: "Performance", weight: 5 },
    { id: "3", name: "Reliability", weight: 4 },
    { id: "4", name: "Ease of Implementation", weight: 3 }
  ]);
  const [solutions, setSolutions] = useState<Solution[]>([
    { id: "1", name: "Solution A", scores: { "1": 1, "2": -1, "3": 0, "4": 1 } },
    { id: "2", name: "Solution B", scores: { "1": -1, "2": 1, "3": 1, "4": 0 } },
    { id: "3", name: "Solution C", scores: { "1": 0, "2": 0, "3": -1, "4": 1 } }
  ]);
  const [baselineSolution, setBaselineSolution] = useState("Current Process");

  const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length > 2) {
          // First row: headers (skip first cell, then solutions)
          const headerRow = jsonData[0] as any[];
          const solutionNames = headerRow.slice(2); // Skip 'Criteria' and 'Weight' columns
          
          // Second row: weights
          const weightRow = jsonData[1] as any[];
          
          const newCriteria: Criterion[] = [];
          const newSolutions: Solution[] = solutionNames.map((name: string, index: number) => ({
            id: (index + 1).toString(),
            name: name?.toString() || `Solution ${index + 1}`,
            scores: {}
          }));
          
          // Process criteria and scores
          for (let i = 2; i < jsonData.length; i++) {
            const row = jsonData[i] as any[];
            if (row[0]) {
              const criterionId = (i - 1).toString();
              newCriteria.push({
                id: criterionId,
                name: row[0].toString(),
                weight: parseInt(row[1]?.toString()) || 1
              });
              
              // Add scores for each solution
              for (let j = 0; j < solutionNames.length; j++) {
                if (newSolutions[j]) {
                  newSolutions[j].scores[criterionId] = parseInt(row[j + 2]?.toString()) || 0;
                }
              }
            }
          }
          
          setCriteria(newCriteria);
          setSolutions(newSolutions);
          toast({
            title: "Excel Data Imported",
            description: `Imported ${newCriteria.length} criteria and ${newSolutions.length} solutions.`
          });
        }
      } catch (error) {
        toast({
          title: "Import Error",
          description: "Failed to parse Excel file. Expected format: Criteria, Weight, Solution1, Solution2...",
          variant: "destructive"
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const addCriterion = () => {
    const newId = Date.now().toString();
    setCriteria([...criteria, { id: newId, name: "New Criterion", weight: 1 }]);
    
    // Add default scores for all solutions
    setSolutions(solutions.map(solution => ({
      ...solution,
      scores: { ...solution.scores, [newId]: 0 }
    })));
  };

  const removeCriterion = (id: string) => {
    setCriteria(criteria.filter(c => c.id !== id));
    setSolutions(solutions.map(solution => {
      const newScores = { ...solution.scores };
      delete newScores[id];
      return { ...solution, scores: newScores };
    }));
  };

  const updateCriterion = (id: string, field: keyof Criterion, value: string | number) => {
    setCriteria(criteria.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const addSolution = () => {
    const newId = Date.now().toString();
    const newScores: { [key: string]: number } = {};
    criteria.forEach(criterion => {
      newScores[criterion.id] = 0;
    });
    
    setSolutions([...solutions, { id: newId, name: "New Solution", scores: newScores }]);
  };

  const removeSolution = (id: string) => {
    setSolutions(solutions.filter(s => s.id !== id));
  };

  const updateSolution = (id: string, field: 'name', value: string) => {
    setSolutions(solutions.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const updateScore = (solutionId: string, criterionId: string, score: number) => {
    setSolutions(solutions.map(solution => 
      solution.id === solutionId 
        ? { ...solution, scores: { ...solution.scores, [criterionId]: score } }
        : solution
    ));
  };

  const calculateResults = () => {
    return solutions.map(solution => {
      let weightedScore = 0;
      let positives = 0;
      let negatives = 0;
      let neutrals = 0;
      
      criteria.forEach(criterion => {
        const score = solution.scores[criterion.id] || 0;
        weightedScore += score * criterion.weight;
        
        if (score > 0) positives++;
        else if (score < 0) negatives++;
        else neutrals++;
      });
      
      return {
        ...solution,
        weightedScore,
        positives,
        negatives,
        neutrals,
        ranking: 0 // Will be set after sorting
      };
    }).sort((a, b) => b.weightedScore - a.weightedScore)
      .map((solution, index) => ({ ...solution, ranking: index + 1 }));
  };

  const getScoreSymbol = (score: number) => {
    if (score > 0) return "+";
    if (score < 0) return "-";
    return "S";
  };

  const getScoreColor = (score: number) => {
    if (score > 0) return "text-green-600";
    if (score < 0) return "text-red-600";
    return "text-yellow-600";
  };

  const exportResults = () => {
    const results = calculateResults();
    const exportData = `
PUGH MATRIX ANALYSIS
===================

Baseline: ${baselineSolution}

CRITERIA & WEIGHTS:
${criteria.map(c => `${c.name}: Weight ${c.weight}`).join('\n')}

SOLUTION RANKINGS:
${results.map((solution, index) => `
${index + 1}. ${solution.name}
   Weighted Score: ${solution.weightedScore}
   Positives: ${solution.positives}
   Negatives: ${solution.negatives}
   Neutrals: ${solution.neutrals}
   
   Detailed Scores:
   ${criteria.map(c => `   ${c.name}: ${getScoreSymbol(solution.scores[c.id])} (${solution.scores[c.id]})`).join('\n')}
`).join('')}

MATRIX:
${['Criteria', 'Weight', ...solutions.map(s => s.name)].join('\t')}
${criteria.map(c => [
  c.name,
  c.weight,
  ...solutions.map(s => getScoreSymbol(s.scores[c.id]))
].join('\t')).join('\n')}

Analysis Date: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pugh-matrix-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setCriteria([
      { id: "1", name: "Cost", weight: 3 },
      { id: "2", name: "Performance", weight: 5 },
      { id: "3", name: "Reliability", weight: 4 },
      { id: "4", name: "Ease of Implementation", weight: 3 }
    ]);
    setSolutions([
      { id: "1", name: "Solution A", scores: { "1": 1, "2": -1, "3": 0, "4": 1 } },
      { id: "2", name: "Solution B", scores: { "1": -1, "2": 1, "3": 1, "4": 0 } },
      { id: "3", name: "Solution C", scores: { "1": 0, "2": 0, "3": -1, "4": 1 } }
    ]);
    setBaselineSolution("Current Process");
  };

  const results = calculateResults();

  return (
    <Card className="card-professional">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GitCompare className="h-6 w-6 text-primary" />
            <CardTitle>Pugh Matrix (Solution Comparison)</CardTitle>
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
        <Tabs defaultValue="matrix" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="matrix">Matrix</TabsTrigger>
            <TabsTrigger value="criteria">Criteria</TabsTrigger>
            <TabsTrigger value="solutions">Solutions</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="matrix" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="baseline">Baseline Solution</Label>
                <Input
                  id="baseline"
                  value={baselineSolution}
                  onChange={(e) => setBaselineSolution(e.target.value)}
                  placeholder="Enter baseline solution"
                />
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-2 text-left">Criteria</th>
                      <th className="border border-border p-2 text-center">Weight</th>
                      {solutions.map(solution => (
                        <th key={solution.id} className="border border-border p-2 text-center">
                          {solution.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {criteria.map(criterion => (
                      <tr key={criterion.id}>
                        <td className="border border-border p-2 font-medium">
                          {criterion.name}
                        </td>
                        <td className="border border-border p-2 text-center">
                          <Badge variant="outline">{criterion.weight}</Badge>
                        </td>
                        {solutions.map(solution => (
                          <td key={solution.id} className="border border-border p-2 text-center">
                            <Select
                              value={solution.scores[criterion.id]?.toString() || "0"}
                              onValueChange={(value) => updateScore(solution.id, criterion.id, parseInt(value))}
                            >
                              <SelectTrigger className="w-16 mx-auto">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="-1">- (Worse)</SelectItem>
                                <SelectItem value="0">S (Same)</SelectItem>
                                <SelectItem value="1">+ (Better)</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="font-medium text-green-800">+ (Better)</div>
                  <div className="text-green-600">Solution performs better than baseline</div>
                </div>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="font-medium text-yellow-800">S (Same)</div>
                  <div className="text-yellow-600">Solution performs same as baseline</div>
                </div>
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="font-medium text-red-800">- (Worse)</div>
                  <div className="text-red-600">Solution performs worse than baseline</div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="criteria" className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">Evaluation Criteria</h4>
              <Button onClick={addCriterion} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Criterion
              </Button>
            </div>
            
            <div className="space-y-3">
              {criteria.map(criterion => (
                <div key={criterion.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex-1">
                    <Input
                      value={criterion.name}
                      onChange={(e) => updateCriterion(criterion.id, 'name', e.target.value)}
                      placeholder="Criterion name"
                    />
                  </div>
                  <div className="w-24">
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={criterion.weight}
                      onChange={(e) => updateCriterion(criterion.id, 'weight', parseInt(e.target.value) || 1)}
                      placeholder="Weight"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCriterion(criterion.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-muted/30 rounded-lg">
              <h5 className="font-semibold mb-2">Weight Guidelines:</h5>
              <div className="text-sm space-y-1">
                <p>• 1-2: Low importance</p>
                <p>• 3-4: Medium importance</p>
                <p>• 5-6: High importance</p>
                <p>• 7-10: Critical importance</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="solutions" className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">Alternative Solutions</h4>
              <Button onClick={addSolution} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Solution
              </Button>
            </div>
            
            <div className="space-y-3">
              {solutions.map(solution => (
                <div key={solution.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex-1">
                    <Input
                      value={solution.name}
                      onChange={(e) => updateSolution(solution.id, 'name', e.target.value)}
                      placeholder="Solution name"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSolution(solution.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="results" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-semibold">Solution Rankings</h4>
              
              <div className="space-y-3">
                {results.map((solution, index) => (
                  <div key={solution.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="default" className="text-lg">
                          #{solution.ranking}
                        </Badge>
                        <h5 className="font-medium text-lg">{solution.name}</h5>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {solution.weightedScore}
                        </div>
                        <div className="text-xs text-muted-foreground">Weighted Score</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{solution.positives}</div>
                        <div className="text-muted-foreground">Positives</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">{solution.neutrals}</div>
                        <div className="text-muted-foreground">Neutrals</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{solution.negatives}</div>
                        <div className="text-muted-foreground">Negatives</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-muted/30 rounded-lg">
                <h5 className="font-semibold mb-2">Interpretation:</h5>
                <div className="text-sm space-y-2">
                  <p>• Higher weighted scores indicate better overall solutions</p>
                  <p>• Consider both weighted score and distribution of +/-/S</p>
                  <p>• Solutions with many negatives may have significant drawbacks</p>
                  <p>• The highest-ranked solution is recommended for implementation</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}