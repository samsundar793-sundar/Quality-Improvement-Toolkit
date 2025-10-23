import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, Target, GitBranch, UserCheck } from "lucide-react";
import { ProjectCharterTool } from "../tools/ProjectCharterTool";
import { SIPOCTool } from "../tools/SIPOCTool";
import { VoiceOfCustomerTool } from "../tools/VoiceOfCustomerTool";
import { CTQTreeTool } from "../tools/CTQTreeTool";
import { StakeholderAnalysisTool } from "../tools/StakeholderAnalysisTool";

export function DefinePhase() {
  const tools = [
    {
      id: "project-charter",
      title: "Project Charter",
      description: "Define project scope, objectives, and team structure",
      icon: FileText,
      status: "ready"
    },
    {
      id: "sipoc",
      title: "SIPOC Diagram", 
      description: "Suppliers, Inputs, Process, Outputs, Customers mapping",
      icon: Target,
      status: "ready"
    },
    {
      id: "voc",
      title: "Voice of Customer",
      description: "Customer requirements and expectations analysis",
      icon: Users,
      status: "ready"
    },
    {
      id: "ctq-tree",
      title: "CTQ Tree",
      description: "Critical to Quality requirements breakdown",
      icon: GitBranch,
      status: "ready"
    },
    {
      id: "stakeholder",
      title: "Stakeholder Analysis",
      description: "Identify and analyze project stakeholders",
      icon: UserCheck,
      status: "ready"
    }
  ];

  const [activeTool, setActiveTool] = useState("project-charter");


  return (
    <div className="space-y-6">
      {/* Tool Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <Card 
            key={tool.id}
            className={`card-professional cursor-pointer transition-all duration-200 hover:scale-105 ${
              activeTool === tool.id ? 'ring-2 ring-primary glow-effect' : ''
            } ${tool.status === 'coming-soon' ? 'opacity-60' : ''}`}
            onClick={() => tool.status === 'ready' && setActiveTool(tool.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <tool.icon className={`h-6 w-6 ${activeTool === tool.id ? 'text-primary' : 'text-muted-foreground'}`} />
                <Badge 
                  variant={tool.status === 'ready' ? 'default' : 'outline'}
                  className="text-xs"
                >
                  {tool.status === 'ready' ? 'Ready' : 'Soon'}
                </Badge>
              </div>
              <CardTitle className="text-lg">{tool.title}</CardTitle>
              <CardDescription className="text-sm">{tool.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Active Tool Content */}
      <div className="animate-fade-in">
        {activeTool === "project-charter" && <ProjectCharterTool />}
        {activeTool === "sipoc" && <SIPOCTool />}
        {activeTool === "voc" && <VoiceOfCustomerTool />}
        {activeTool === "ctq-tree" && <CTQTreeTool />}
        {activeTool === "stakeholder" && <StakeholderAnalysisTool />}
      </div>
    </div>
  );
}