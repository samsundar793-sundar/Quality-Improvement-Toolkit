import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, Target, Download, Upload } from "lucide-react";

export function DefinePhase() {
  const [projectCharter, setProjectCharter] = useState({
    projectTitle: "",
    problemStatement: "",
    goalStatement: "",
    scope: "",
    teamMembers: "",
    timeline: ""
  });

  const [sipocData, setSipocData] = useState({
    suppliers: "",
    inputs: "",
    process: "",
    outputs: "",
    customers: ""
  });

  const tools = [
    {
      id: "project-charter",
      title: "Project Charter",
      description: "Define project scope, objectives, and team structure",
      icon: FileText,
      isActive: true
    },
    {
      id: "sipoc",
      title: "SIPOC Diagram", 
      description: "Suppliers, Inputs, Process, Outputs, Customers mapping",
      icon: Target,
      isActive: false
    },
    {
      id: "voc",
      title: "Voice of Customer",
      description: "Customer requirements and expectations analysis",
      icon: Users,
      isActive: false
    }
  ];

  const [activeTool, setActiveTool] = useState("project-charter");

  const generateSampleCharter = () => {
    setProjectCharter({
      projectTitle: "Reduce Customer Service Response Time",
      problemStatement: "Customer service response time averages 48 hours, causing customer dissatisfaction and potential churn. Current process lacks standardization and clear escalation procedures.",
      goalStatement: "Reduce average customer service response time from 48 hours to 8 hours within 3 months while maintaining quality standards.",
      scope: "Includes: Initial customer inquiry to resolution for Tier 1 and Tier 2 support issues. Excludes: Technical development requests and billing disputes.",
      teamMembers: "Project Leader: Sarah Johnson, Process Owner: Mike Chen, IT Support: Alex Rodriguez, Quality Analyst: Lisa Park",
      timeline: "Phase 1 (Define): Week 1-2, Phase 2 (Measure): Week 3-5, Phase 3 (Analyze): Week 6-8, Phase 4 (Improve): Week 9-11, Phase 5 (Control): Week 12"
    });
  };

  const generateSampleSIPOC = () => {
    setSipocData({
      suppliers: "Customers, Technical Support, Product Management, External Vendors",
      inputs: "Customer Inquiries, Product Issues, Technical Questions, Account Problems",
      process: "Ticket Creation → Initial Triage → Assignment → Investigation → Resolution → Follow-up",
      outputs: "Resolved Issues, Customer Responses, Knowledge Base Updates, Escalation Reports",
      customers: "End Users, Account Managers, Product Teams, Management"
    });
  };

  const exportProjectCharter = () => {
    const charterData = {
      "Project Charter": {
        "Project Title": projectCharter.projectTitle,
        "Problem Statement": projectCharter.problemStatement,
        "Goal Statement": projectCharter.goalStatement,
        "Scope": projectCharter.scope,
        "Team Members": projectCharter.teamMembers,
        "Timeline": projectCharter.timeline
      }
    };
    
    const dataStr = JSON.stringify(charterData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'project_charter.json';
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Tool Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <Card 
            key={tool.id}
            className={`card-professional cursor-pointer transition-all duration-200 hover:scale-105 ${
              activeTool === tool.id ? 'ring-2 ring-primary glow-effect' : ''
            }`}
            onClick={() => setActiveTool(tool.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <tool.icon className={`h-6 w-6 ${activeTool === tool.id ? 'text-primary' : 'text-muted-foreground'}`} />
                <div>
                  <CardTitle className="text-lg">{tool.title}</CardTitle>
                  <CardDescription className="text-sm">{tool.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Project Charter Tool */}
      {activeTool === "project-charter" && (
        <Card className="card-professional">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>Project Charter Generator</CardTitle>
                  <CardDescription>Define your Six Sigma project scope and objectives</CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={generateSampleCharter}>
                  <Upload className="h-4 w-4 mr-2" />
                  Load Sample
                </Button>
                <Button variant="professional" onClick={exportProjectCharter}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Charter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="projectTitle">Project Title</Label>
                <Input
                  id="projectTitle"
                  value={projectCharter.projectTitle}
                  onChange={(e) => setProjectCharter({...projectCharter, projectTitle: e.target.value})}
                  placeholder="Enter your project title"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="problemStatement">Problem Statement</Label>
                <Textarea
                  id="problemStatement"
                  value={projectCharter.problemStatement}
                  onChange={(e) => setProjectCharter({...projectCharter, problemStatement: e.target.value})}
                  placeholder="Describe the problem you're solving"
                  className="mt-1 min-h-20"
                />
              </div>

              <div>
                <Label htmlFor="goalStatement">Goal Statement</Label>
                <Textarea
                  id="goalStatement"
                  value={projectCharter.goalStatement}
                  onChange={(e) => setProjectCharter({...projectCharter, goalStatement: e.target.value})}
                  placeholder="Define your specific, measurable goals"
                  className="mt-1 min-h-20"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="scope">Project Scope</Label>
                  <Textarea
                    id="scope"
                    value={projectCharter.scope}
                    onChange={(e) => setProjectCharter({...projectCharter, scope: e.target.value})}
                    placeholder="What's included and excluded"
                    className="mt-1 min-h-20"
                  />
                </div>
                
                <div>
                  <Label htmlFor="teamMembers">Team Members</Label>
                  <Textarea
                    id="teamMembers"
                    value={projectCharter.teamMembers}
                    onChange={(e) => setProjectCharter({...projectCharter, teamMembers: e.target.value})}
                    placeholder="List team members and roles"
                    className="mt-1 min-h-20"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="timeline">Project Timeline</Label>
                <Textarea
                  id="timeline"
                  value={projectCharter.timeline}
                  onChange={(e) => setProjectCharter({...projectCharter, timeline: e.target.value})}
                  placeholder="Key milestones and deadlines"
                  className="mt-1 min-h-16"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SIPOC Diagram Tool */}
      {activeTool === "sipoc" && (
        <Card className="card-professional">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>SIPOC Diagram Builder</CardTitle>
                  <CardDescription>Map your process from suppliers to customers</CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={generateSampleSIPOC}>
                  <Upload className="h-4 w-4 mr-2" />
                  Load Sample
                </Button>
                <Button variant="professional">
                  <Download className="h-4 w-4 mr-2" />
                  Export SIPOC
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label className="text-center block">
                    <Badge variant="outline" className="mb-2">S</Badge>
                    <div className="font-semibold">Suppliers</div>
                  </Label>
                  <Textarea
                    value={sipocData.suppliers}
                    onChange={(e) => setSipocData({...sipocData, suppliers: e.target.value})}
                    placeholder="Who provides inputs?"
                    className="min-h-24"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-center block">
                    <Badge variant="outline" className="mb-2">I</Badge>
                    <div className="font-semibold">Inputs</div>
                  </Label>
                  <Textarea
                    value={sipocData.inputs}
                    onChange={(e) => setSipocData({...sipocData, inputs: e.target.value})}
                    placeholder="What goes into the process?"
                    className="min-h-24"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-center block">
                    <Badge variant="outline" className="mb-2">P</Badge>
                    <div className="font-semibold">Process</div>
                  </Label>
                  <Textarea
                    value={sipocData.process}
                    onChange={(e) => setSipocData({...sipocData, process: e.target.value})}
                    placeholder="Key process steps"
                    className="min-h-24"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-center block">
                    <Badge variant="outline" className="mb-2">O</Badge>
                    <div className="font-semibold">Outputs</div>
                  </Label>
                  <Textarea
                    value={sipocData.outputs}
                    onChange={(e) => setSipocData({...sipocData, outputs: e.target.value})}
                    placeholder="What does the process produce?"
                    className="min-h-24"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-center block">
                    <Badge variant="outline" className="mb-2">C</Badge>
                    <div className="font-semibold">Customers</div>
                  </Label>
                  <Textarea
                    value={sipocData.customers}
                    onChange={(e) => setSipocData({...sipocData, customers: e.target.value})}
                    placeholder="Who receives outputs?"
                    className="min-h-24"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Voice of Customer Tool */}
      {activeTool === "voc" && (
        <Card className="card-professional">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Voice of Customer Analysis</CardTitle>
                <CardDescription>Capture and analyze customer requirements and expectations</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Voice of Customer Tool</h3>
              <p className="text-muted-foreground mb-4">
                Interactive customer requirements analysis coming soon
              </p>
              <Button variant="outline">Request Early Access</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}