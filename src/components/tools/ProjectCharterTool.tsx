import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Target, Download, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ProjectCharterTool() {
  const { toast } = useToast();
  const [charter, setCharter] = useState({
    projectTitle: "",
    businessCase: "",
    problemStatement: "",
    goalStatement: "",
    scope: "",
    timeline: "",
    teamMembers: "",
    resources: "",
    successMetrics: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setCharter(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const charterData = JSON.stringify(charter, null, 2);
    const blob = new Blob([charterData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-charter-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Charter Saved",
      description: "Project charter has been downloaded successfully.",
    });
  };

  const generateTemplate = () => {
    setCharter({
      projectTitle: "Process Improvement Project",
      businessCase: "Reduce customer complaints by 50% and improve delivery times to increase customer satisfaction and reduce costs.",
      problemStatement: "Current process has high defect rates (12%) and long cycle times (5 days average), resulting in customer dissatisfaction.",
      goalStatement: "Reduce defect rate to less than 3% and decrease cycle time to 2 days within 6 months.",
      scope: "Include: Order processing, Quality control, Delivery process\nExclude: Supplier management, Pricing strategies",
      timeline: "Phase 1 (Define): Month 1\nPhase 2 (Measure): Month 2\nPhase 3 (Analyze): Month 3-4\nPhase 4 (Improve): Month 5\nPhase 5 (Control): Month 6",
      teamMembers: "Project Champion: [Name]\nBlack Belt: [Name]\nProcess Owner: [Name]\nTeam Members: [Names]",
      resources: "Budget: $50,000\nTime: 6 months\nTools: Statistical software, Process mapping tools",
      successMetrics: "Primary: Defect rate < 3%\nSecondary: Cycle time < 2 days\nFinancial: Cost savings > $100,000/year"
    });
    
    toast({
      title: "Template Loaded",
      description: "Sample project charter has been loaded. Customize as needed.",
    });
  };

  return (
    <Card className="card-professional">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Target className="h-6 w-6 text-primary" />
            <CardTitle>Project Charter</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={generateTemplate}>
              Load Template
            </Button>
            <Button variant="analytics" onClick={handleSave}>
              <Download className="h-4 w-4 mr-2" />
              Export Charter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="projectTitle">Project Title</Label>
              <Input
                id="projectTitle"
                value={charter.projectTitle}
                onChange={(e) => handleInputChange('projectTitle', e.target.value)}
                placeholder="Enter project title"
              />
            </div>
            
            <div>
              <Label htmlFor="businessCase">Business Case</Label>
              <Textarea
                id="businessCase"
                value={charter.businessCase}
                onChange={(e) => handleInputChange('businessCase', e.target.value)}
                placeholder="Why is this project important?"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="problemStatement">Problem Statement</Label>
              <Textarea
                id="problemStatement"
                value={charter.problemStatement}
                onChange={(e) => handleInputChange('problemStatement', e.target.value)}
                placeholder="What specific problem are we solving?"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="goalStatement">Goal Statement</Label>
              <Textarea
                id="goalStatement"
                value={charter.goalStatement}
                onChange={(e) => handleInputChange('goalStatement', e.target.value)}
                placeholder="What are we trying to achieve?"
                rows={3}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="scope">Project Scope</Label>
              <Textarea
                id="scope"
                value={charter.scope}
                onChange={(e) => handleInputChange('scope', e.target.value)}
                placeholder="What's included and excluded?"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="timeline">Timeline</Label>
              <Textarea
                id="timeline"
                value={charter.timeline}
                onChange={(e) => handleInputChange('timeline', e.target.value)}
                placeholder="Project milestones and deadlines"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="teamMembers">Team Members & Roles</Label>
              <Textarea
                id="teamMembers"
                value={charter.teamMembers}
                onChange={(e) => handleInputChange('teamMembers', e.target.value)}
                placeholder="Who's on the team and their roles?"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="resources">Resources Required</Label>
              <Textarea
                id="resources"
                value={charter.resources}
                onChange={(e) => handleInputChange('resources', e.target.value)}
                placeholder="Budget, time, tools needed"
                rows={2}
              />
            </div>
            
            <div>
              <Label htmlFor="successMetrics">Success Metrics</Label>
              <Textarea
                id="successMetrics"
                value={charter.successMetrics}
                onChange={(e) => handleInputChange('successMetrics', e.target.value)}
                placeholder="How will success be measured?"
                rows={2}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}