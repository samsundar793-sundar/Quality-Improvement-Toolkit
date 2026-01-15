import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Target, Save, FileText } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";
import { useToast } from "@/hooks/use-toast";

export function D2ProblemDefinitionTool() {
  const { currentProject, updateToolData, getToolData } = useProject();
  const { toast } = useToast();

  const savedData = currentProject ? getToolData('d2-problem-definition') : null;
  
  const [problemData, setProblemData] = useState({
    what: savedData?.what || '',
    where: savedData?.where || '',
    when: savedData?.when || '',
    howMuch: savedData?.howMuch || '',
    who: savedData?.who || '',
    trend: savedData?.trend || '',
    quantifiedStatement: savedData?.quantifiedStatement || '',
    customerImpact: savedData?.customerImpact || '',
    businessImpact: savedData?.businessImpact || '',
    safetyImpact: savedData?.safetyImpact || '',
    defectRate: savedData?.defectRate || '',
    affectedQuantity: savedData?.affectedQuantity || '',
    timeframe: savedData?.timeframe || '',
    targetState: savedData?.targetState || ''
  });

  const saveData = () => {
    if (currentProject) {
      updateToolData('d2-problem-definition', problemData);
      toast({ title: "Saved", description: "Problem definition saved successfully" });
    }
  };

  const generateProblemStatement = () => {
    const parts = [];
    if (problemData.what) parts.push(problemData.what);
    if (problemData.where) parts.push(`occurring at ${problemData.where}`);
    if (problemData.when) parts.push(`first noticed ${problemData.when}`);
    if (problemData.howMuch) parts.push(`affecting ${problemData.howMuch}`);
    
    return parts.join(', ') + '.';
  };

  const completenessScore = () => {
    const fields = [
      problemData.what, problemData.where, problemData.when, 
      problemData.howMuch, problemData.customerImpact
    ];
    return Math.round((fields.filter(f => f.trim()).length / fields.length) * 100);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>D2: Problem Definition</CardTitle>
              <CardDescription>Quantify the problem in measurable terms using 5W2H</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Completeness Indicator */}
          <Card className="bg-muted/50">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Problem Definition Completeness</span>
                <span className="text-2xl font-bold">{completenessScore()}%</span>
              </div>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${completenessScore()}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* 5W2H Questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">WHAT is the problem?</CardTitle>
                <CardDescription>Describe the defect or issue</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={problemData.what}
                  onChange={(e) => setProblemData({ ...problemData, what: e.target.value })}
                  placeholder="What exactly is wrong? What is the symptom? What is the defect?"
                  rows={3}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">WHERE is it occurring?</CardTitle>
                <CardDescription>Location and scope</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={problemData.where}
                  onChange={(e) => setProblemData({ ...problemData, where: e.target.value })}
                  placeholder="Where geographically? Which process step? Which part of the product?"
                  rows={3}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">WHEN did it start?</CardTitle>
                <CardDescription>Timeline and patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={problemData.when}
                  onChange={(e) => setProblemData({ ...problemData, when: e.target.value })}
                  placeholder="When was it first observed? Is there a pattern? Time of day, shift, season?"
                  rows={3}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">HOW MUCH / HOW MANY?</CardTitle>
                <CardDescription>Quantify the extent</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={problemData.howMuch}
                  onChange={(e) => setProblemData({ ...problemData, howMuch: e.target.value })}
                  placeholder="What is the defect rate? How many units affected? What is the cost impact?"
                  rows={3}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">WHO is affected?</CardTitle>
                <CardDescription>Stakeholder impact</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={problemData.who}
                  onChange={(e) => setProblemData({ ...problemData, who: e.target.value })}
                  placeholder="Which customers? Which operators? Which departments?"
                  rows={3}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">HOW is it trending?</CardTitle>
                <CardDescription>Pattern analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={problemData.trend}
                  onChange={(e) => setProblemData({ ...problemData, trend: e.target.value })}
                  placeholder="Is it getting worse? Staying constant? Any correlation with other factors?"
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>

          {/* Quantification Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Problem Quantification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Defect Rate (%)</Label>
                  <Input
                    value={problemData.defectRate}
                    onChange={(e) => setProblemData({ ...problemData, defectRate: e.target.value })}
                    placeholder="e.g., 5.2%"
                  />
                </div>
                <div>
                  <Label>Affected Quantity</Label>
                  <Input
                    value={problemData.affectedQuantity}
                    onChange={(e) => setProblemData({ ...problemData, affectedQuantity: e.target.value })}
                    placeholder="e.g., 1,500 units"
                  />
                </div>
                <div>
                  <Label>Timeframe</Label>
                  <Input
                    value={problemData.timeframe}
                    onChange={(e) => setProblemData({ ...problemData, timeframe: e.target.value })}
                    placeholder="e.g., Last 30 days"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Impact Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Impact Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Customer Impact</Label>
                  <Textarea
                    value={problemData.customerImpact}
                    onChange={(e) => setProblemData({ ...problemData, customerImpact: e.target.value })}
                    placeholder="How does this affect the customer?"
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Business Impact</Label>
                  <Textarea
                    value={problemData.businessImpact}
                    onChange={(e) => setProblemData({ ...problemData, businessImpact: e.target.value })}
                    placeholder="Cost, delivery, reputation impact"
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Safety Impact</Label>
                  <Textarea
                    value={problemData.safetyImpact}
                    onChange={(e) => setProblemData({ ...problemData, safetyImpact: e.target.value })}
                    placeholder="Any safety concerns?"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generated Problem Statement */}
          <Card className="border-primary/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Quantified Problem Statement
              </CardTitle>
              <CardDescription>Auto-generated from your inputs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm italic">
                  {generateProblemStatement() || "Complete the fields above to generate a problem statement..."}
                </p>
              </div>
              <div>
                <Label>Custom Problem Statement (editable)</Label>
                <Textarea
                  value={problemData.quantifiedStatement}
                  onChange={(e) => setProblemData({ ...problemData, quantifiedStatement: e.target.value })}
                  placeholder="Write your final problem statement here..."
                  rows={3}
                />
              </div>
              <div>
                <Label>Target State</Label>
                <Textarea
                  value={problemData.targetState}
                  onChange={(e) => setProblemData({ ...problemData, targetState: e.target.value })}
                  placeholder="What does success look like? What is the target condition?"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Button onClick={saveData}>
            <Save className="h-4 w-4 mr-2" />
            Save Problem Definition
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
