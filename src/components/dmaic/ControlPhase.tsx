import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, FileText, BarChart3, Settings } from "lucide-react";
import { ControlPlanTool } from "../tools/ControlPlanTool";
import { SOPTemplateTool } from "../tools/SOPTemplateTool";
import { MonitoringDashboardTool } from "../tools/MonitoringDashboardTool";

export function ControlPhase() {
  const tools = [
    {
      id: "control-plan",
      title: "Control Plan Generator",
      description: "Standardized control plan creation and management",
      icon: Shield,
      status: "ready"
    },
    {
      id: "sop-template",
      title: "SOP Template",
      description: "Standard Operating Procedure documentation",
      icon: FileText,
      status: "ready"
    },
    {
      id: "monitoring-dashboard",
      title: "Monitoring Dashboard",
      description: "Real-time process monitoring and alerts",
      icon: BarChart3,
      status: "ready"
    }
  ];

  const [activeTool, setActiveTool] = useState("control-plan");

  return (
    <div className="space-y-6">
      {/* Tool Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        {activeTool === "control-plan" && <ControlPlanTool />}
        {activeTool === "sop-template" && <SOPTemplateTool />}
        {activeTool === "monitoring-dashboard" && <MonitoringDashboardTool />}
      </div>
    </div>
  );
}