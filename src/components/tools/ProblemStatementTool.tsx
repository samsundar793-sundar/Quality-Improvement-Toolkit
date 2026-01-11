import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Save, Download, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProject } from "@/contexts/ProjectContext";

interface ProblemStatement {
  what: string;
  where: string;
  when: string;
  who: string;
  howMuch: string;
  impact: string;
  scope: string;
  constraints: string[];
}

export function ProblemStatementTool() {
  const { toast } = useToast();
  const { currentProject, updateToolData, getToolData } = useProject();
  
  const [statement, setStatement] = useState<ProblemStatement>(() => {
    const saved = currentProject ? getToolData("problem-statement") : null;
    return saved || {
      what: "",
      where: "",
      when: "",
      who: "",
      howMuch: "",
      impact: "",
      scope: "",
      constraints: [""]
    };
  });

  const handleSave = () => {
    if (currentProject) {
      updateToolData("problem-statement", statement);
      toast({ title: "Saved", description: "Problem statement saved successfully" });
    }
  };

  const addConstraint = () => {
    setStatement(prev => ({ ...prev, constraints: [...prev.constraints, ""] }));
  };

  const updateConstraint = (index: number, value: string) => {
    const updated = [...statement.constraints];
    updated[index] = value;
    setStatement(prev => ({ ...prev, constraints: updated }));
  };

  const removeConstraint = (index: number) => {
    setStatement(prev => ({ 
      ...prev, 
      constraints: prev.constraints.filter((_, i) => i !== index) 
    }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <div className="flex-1">
            <CardTitle>Problem Statement</CardTitle>
            <CardDescription>Define the problem clearly using the 5W1H framework</CardDescription>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="what">What is the problem?</Label>
            <Textarea
              id="what"
              placeholder="Describe what is happening or not happening..."
              value={statement.what}
              onChange={(e) => setStatement(prev => ({ ...prev, what: e.target.value }))}
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="where">Where does it occur?</Label>
            <Textarea
              id="where"
              placeholder="Location, process step, department..."
              value={statement.where}
              onChange={(e) => setStatement(prev => ({ ...prev, where: e.target.value }))}
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="when">When does it occur?</Label>
            <Textarea
              id="when"
              placeholder="Frequency, timing, conditions..."
              value={statement.when}
              onChange={(e) => setStatement(prev => ({ ...prev, when: e.target.value }))}
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="who">Who is affected?</Label>
            <Textarea
              id="who"
              placeholder="Customers, operators, departments..."
              value={statement.who}
              onChange={(e) => setStatement(prev => ({ ...prev, who: e.target.value }))}
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="howMuch">How much/How many?</Label>
            <Textarea
              id="howMuch"
              placeholder="Quantify the problem: defects, costs, time..."
              value={statement.howMuch}
              onChange={(e) => setStatement(prev => ({ ...prev, howMuch: e.target.value }))}
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="impact">Business Impact</Label>
            <Textarea
              id="impact"
              placeholder="Cost, customer satisfaction, safety, quality..."
              value={statement.impact}
              onChange={(e) => setStatement(prev => ({ ...prev, impact: e.target.value }))}
              className="min-h-[100px]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="scope">Project Scope</Label>
          <Textarea
            id="scope"
            placeholder="Define what is in and out of scope..."
            value={statement.scope}
            onChange={(e) => setStatement(prev => ({ ...prev, scope: e.target.value }))}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Constraints & Boundaries</Label>
            <Button variant="outline" size="sm" onClick={addConstraint}>
              <Plus className="h-4 w-4 mr-1" /> Add Constraint
            </Button>
          </div>
          {statement.constraints.map((constraint, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder={`Constraint ${index + 1}`}
                value={constraint}
                onChange={(e) => updateConstraint(index, e.target.value)}
              />
              <Button variant="ghost" size="icon" onClick={() => removeConstraint(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Summary Card */}
        {statement.what && (
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">Problem Statement Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">
                <strong>{statement.what}</strong>
                {statement.where && ` is occurring at ${statement.where}`}
                {statement.when && `, ${statement.when}`}
                {statement.who && `, affecting ${statement.who}`}
                {statement.howMuch && `. The magnitude is ${statement.howMuch}`}
                {statement.impact && `. This results in ${statement.impact}`}.
              </p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
