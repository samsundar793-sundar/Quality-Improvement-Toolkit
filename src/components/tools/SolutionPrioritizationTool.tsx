import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Target, Plus, Trash2, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Criterion {
  id: string;
  name: string;
  weight: number;
}

interface Solution {
  id: string;
  name: string;
  description: string;
  scores: { [criterionId: string]: number };
  totalScore: number;
  weightedScore: number;
  rank: number;
}

export function SolutionPrioritizationTool() {
  const { toast } = useToast();
  const [criteria, setCriteria] = useState<Criterion[]>([
    { id: "1", name: "Implementation Cost", weight: 25 },
    { id: "2", name: "Impact on Problem", weight: 35 },
    { id: "3", name: "Ease of Implementation", weight: 20 },
    { id: "4", name: "Time to Implement", weight: 20 }
  ]);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [newCriterion, setNewCriterion] = useState("");
  const [newSolution, setNewSolution] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const addCriterion = () => {
    if (!newCriterion.trim()) return;
    const newId = Date.now().toString();
    setCriteria([...criteria, { id: newId, name: newCriterion, weight: 10 }]);
    setNewCriterion("");
    toast({ title: "Criterion Added", description: "New evaluation criterion has been added." });
  };

  const removeCriterion = (id: string) => {
    setCriteria(criteria.filter(c => c.id !== id));
    setSolutions(solutions.map(s => ({
      ...s,
      scores: Object.fromEntries(Object.entries(s.scores).filter(([key]) => key !== id))
    })));
  };

  const updateCriterionWeight = (id: string, weight: number) => {
    setCriteria(criteria.map(c => c.id === id ? { ...c, weight } : c));
  };

  const addSolution = () => {
    if (!newSolution.trim()) return;
    const newId = Date.now().toString();
    const scores = Object.fromEntries(criteria.map(c => [c.id, 5])); // Default score of 5
    setSolutions([...solutions, {
      id: newId,
      name: newSolution,
      description: newDescription,
      scores,
      totalScore: 0,
      weightedScore: 0,
      rank: 0
    }]);
    setNewSolution("");
    setNewDescription("");
    toast({ title: "Solution Added", description: "New solution has been added for evaluation." });
  };

  const removeSolution = (id: string) => {
    setSolutions(solutions.filter(s => s.id !== id));
  };

  const updateSolutionScore = (solutionId: string, criterionId: string, score: number) => {
    setSolutions(solutions.map(s => 
      s.id === solutionId 
        ? { ...s, scores: { ...s.scores, [criterionId]: Math.max(1, Math.min(10, score)) } }
        : s
    ));
  };

  const calculateScores = () => {
    const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
    
    const updatedSolutions = solutions.map(solution => {
      const totalScore = Object.values(solution.scores).reduce((sum, score) => sum + score, 0);
      const weightedScore = criteria.reduce((sum, criterion) => {
        const score = solution.scores[criterion.id] || 0;
        return sum + (score * criterion.weight / totalWeight);
      }, 0);
      
      return { ...solution, totalScore, weightedScore };
    });

    // Sort by weighted score and assign ranks
    const sortedSolutions = updatedSolutions.sort((a, b) => b.weightedScore - a.weightedScore);
    const rankedSolutions = sortedSolutions.map((solution, index) => ({
      ...solution,
      rank: index + 1
    }));

    setSolutions(rankedSolutions);
    toast({ title: "Scores Calculated", description: "Solution rankings have been updated." });
  };

  const reset = () => {
    setSolutions([]);
    setCriteria([
      { id: "1", name: "Implementation Cost", weight: 25 },
      { id: "2", name: "Impact on Problem", weight: 35 },
      { id: "3", name: "Ease of Implementation", weight: 20 },
      { id: "4", name: "Time to Implement", weight: 20 }
    ]);
  };

  return (
    <Card className="card-professional">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Target className="h-6 w-6 text-primary" />
            <CardTitle>Solution Prioritization Matrix</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="criteria" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="criteria">Criteria Setup</TabsTrigger>
            <TabsTrigger value="solutions">Solutions & Scoring</TabsTrigger>
            <TabsTrigger value="results">Rankings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="criteria" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-semibold">Evaluation Criteria</h4>
              <div className="flex gap-2">
                <Input 
                  placeholder="Enter new criterion" 
                  value={newCriterion}
                  onChange={(e) => setNewCriterion(e.target.value)}
                />
                <Button onClick={addCriterion}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              
              <div className="space-y-2">
                {criteria.map((criterion) => (
                  <div key={criterion.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="flex-1">
                      <span className="font-medium">{criterion.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label>Weight:</Label>
                      <Input 
                        type="number" 
                        value={criterion.weight}
                        onChange={(e) => updateCriterionWeight(criterion.id, parseInt(e.target.value) || 0)}
                        className="w-20"
                        min="0"
                        max="100"
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => removeCriterion(criterion.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="text-sm text-muted-foreground">
                Total Weight: {criteria.reduce((sum, c) => sum + c.weight, 0)}%
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="solutions" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-semibold">Add Solutions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  placeholder="Solution name" 
                  value={newSolution}
                  onChange={(e) => setNewSolution(e.target.value)}
                />
                <Input 
                  placeholder="Description (optional)" 
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>
              <Button onClick={addSolution}>
                <Plus className="h-4 w-4 mr-2" />
                Add Solution
              </Button>
            </div>
            
            {solutions.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-semibold">Score Solutions (1-10 scale)</h4>
                <div className="space-y-4">
                  {solutions.map((solution) => (
                    <div key={solution.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h5 className="font-medium">{solution.name}</h5>
                          {solution.description && (
                            <p className="text-sm text-muted-foreground">{solution.description}</p>
                          )}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeSolution(solution.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {criteria.map((criterion) => (
                          <div key={criterion.id} className="flex items-center gap-2">
                            <Label className="text-xs min-w-0 flex-1">{criterion.name}:</Label>
                            <Input 
                              type="number" 
                              value={solution.scores[criterion.id] || 5}
                              onChange={(e) => updateSolutionScore(solution.id, criterion.id, parseInt(e.target.value) || 5)}
                              className="w-16"
                              min="1"
                              max="10"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button variant="professional" onClick={calculateScores}>
                  Calculate Rankings
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="results">
            {solutions.length > 0 ? (
              <div className="space-y-4">
                <h4 className="font-semibold">Solution Rankings</h4>
                <div className="space-y-3">
                  {solutions.map((solution) => (
                    <div key={solution.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <Badge variant={solution.rank === 1 ? "default" : "outline"} className="text-lg px-3 py-1">
                        #{solution.rank}
                      </Badge>
                      <div className="flex-1">
                        <h5 className="font-medium">{solution.name}</h5>
                        {solution.description && (
                          <p className="text-sm text-muted-foreground">{solution.description}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-primary">{solution.weightedScore.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">Weighted Score</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{solution.totalScore}</div>
                        <div className="text-sm text-muted-foreground">Total Points</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <h5 className="font-semibold mb-2">Recommendation</h5>
                  <p className="text-sm text-muted-foreground">
                    Based on your weighted criteria, <strong>{solutions[0]?.name}</strong> is the top-ranked solution 
                    with a weighted score of <strong>{solutions[0]?.weightedScore.toFixed(2)}</strong>. 
                    Consider implementing this solution first for maximum impact.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No solutions added yet. Please add solutions and score them first.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}