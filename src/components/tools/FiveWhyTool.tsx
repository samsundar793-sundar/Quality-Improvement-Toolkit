import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Search, Download, RotateCcw, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FiveWhyData {
  problemStatement: string;
  whys: { question: string; answer: string; }[];
  rootCause: string;
  actionPlan: string;
}

export function FiveWhyTool() {
  const { toast } = useToast();
  const [analysis, setAnalysis] = useState<FiveWhyData>({
    problemStatement: "",
    whys: [
      { question: "Why did this problem occur?", answer: "" },
      { question: "Why did that happen?", answer: "" },
      { question: "Why did that happen?", answer: "" },
      { question: "Why did that happen?", answer: "" },
      { question: "Why did that happen?", answer: "" }
    ],
    rootCause: "",
    actionPlan: ""
  });

  const updateWhy = (index: number, field: 'question' | 'answer', value: string) => {
    setAnalysis(prev => ({
      ...prev,
      whys: prev.whys.map((why, i) => 
        i === index ? { ...why, [field]: value } : why
      )
    }));
  };

  const addWhy = () => {
    setAnalysis(prev => ({
      ...prev,
      whys: [...prev.whys, { question: "Why did that happen?", answer: "" }]
    }));
  };

  const removeWhy = (index: number) => {
    if (analysis.whys.length > 1) {
      setAnalysis(prev => ({
        ...prev,
        whys: prev.whys.filter((_, i) => i !== index)
      }));
    }
  };

  const loadTemplate = () => {
    setAnalysis({
      problemStatement: "Customer complaints increased by 25% last month",
      whys: [
        { 
          question: "Why did customer complaints increase?", 
          answer: "Delivery times were longer than promised" 
        },
        { 
          question: "Why were delivery times longer?", 
          answer: "Warehouse had processing delays" 
        },
        { 
          question: "Why did the warehouse have processing delays?", 
          answer: "Staff shortage during peak season" 
        },
        { 
          question: "Why was there a staff shortage?", 
          answer: "No temporary staff hiring plan for peak season" 
        },
        { 
          question: "Why was there no hiring plan?", 
          answer: "Lack of seasonal demand forecasting process" 
        }
      ],
      rootCause: "Absence of seasonal demand forecasting and workforce planning process",
      actionPlan: "1. Implement seasonal demand forecasting\n2. Create flexible staffing plan\n3. Establish partnerships with temp agencies\n4. Train existing staff for cross-functionality"
    });
    
    toast({
      title: "Template Loaded",
      description: "Sample 5 Why analysis has been loaded."
    });
  };

  const exportAnalysis = () => {
    const analysisText = `
5 WHY ANALYSIS
==============

PROBLEM STATEMENT:
${analysis.problemStatement}

ANALYSIS:
${analysis.whys.map((why, index) => 
  `${index + 1}. ${why.question}\n   Answer: ${why.answer}`
).join('\n\n')}

ROOT CAUSE:
${analysis.rootCause}

ACTION PLAN:
${analysis.actionPlan}

Analysis Date: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([analysisText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `5-why-analysis-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Analysis Exported",
      description: "5 Why analysis has been downloaded."
    });
  };

  const reset = () => {
    setAnalysis({
      problemStatement: "",
      whys: [
        { question: "Why did this problem occur?", answer: "" },
        { question: "Why did that happen?", answer: "" },
        { question: "Why did that happen?", answer: "" },
        { question: "Why did that happen?", answer: "" },
        { question: "Why did that happen?", answer: "" }
      ],
      rootCause: "",
      actionPlan: ""
    });
  };

  return (
    <Card className="card-professional">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Search className="h-6 w-6 text-primary" />
            <CardTitle>5 Why Root Cause Analysis</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" onClick={loadTemplate}>
              Load Template
            </Button>
            <Button variant="analytics" onClick={exportAnalysis}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="problem">Problem Statement</Label>
          <Textarea
            id="problem"
            value={analysis.problemStatement}
            onChange={(e) => setAnalysis(prev => ({ ...prev, problemStatement: e.target.value }))}
            placeholder="Clearly state the problem you want to analyze"
            rows={2}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-semibold">Why Analysis</Label>
            <Button variant="outline" size="sm" onClick={addWhy}>
              <Plus className="h-4 w-4 mr-2" />
              Add Why
            </Button>
          </div>
          
          {analysis.whys.map((why, index) => (
            <div key={index} className="space-y-2 p-4 border border-border rounded-lg">
              <div className="flex items-center justify-between">
                <Label className="text-primary font-medium">Why #{index + 1}</Label>
                {analysis.whys.length > 1 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => removeWhy(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Input
                value={why.question}
                onChange={(e) => updateWhy(index, 'question', e.target.value)}
                placeholder="Enter the 'Why' question"
              />
              <Textarea
                value={why.answer}
                onChange={(e) => updateWhy(index, 'answer', e.target.value)}
                placeholder="Enter the answer to this 'Why'"
                rows={2}
              />
            </div>
          ))}
        </div>

        <div>
          <Label htmlFor="rootCause">Root Cause Identified</Label>
          <Textarea
            id="rootCause"
            value={analysis.rootCause}
            onChange={(e) => setAnalysis(prev => ({ ...prev, rootCause: e.target.value }))}
            placeholder="Based on your analysis, what is the fundamental root cause?"
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="actionPlan">Action Plan</Label>
          <Textarea
            id="actionPlan"
            value={analysis.actionPlan}
            onChange={(e) => setAnalysis(prev => ({ ...prev, actionPlan: e.target.value }))}
            placeholder="What actions will you take to address the root cause?"
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
}