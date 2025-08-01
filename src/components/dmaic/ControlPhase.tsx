import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, FileCheck, BarChart2 } from "lucide-react";

export function ControlPhase() {
  const tools = [
    {
      id: "control-plan",
      title: "Control Plan Generator",
      description: "Standardized control plan creation and management",
      icon: Shield,
      status: "coming-soon"
    },
    {
      id: "sop-template",
      title: "SOP Template",
      description: "Standard Operating Procedure documentation",
      icon: FileCheck,
      status: "coming-soon"
    },
    {
      id: "monitoring-dashboard",
      title: "Monitoring Dashboard",
      description: "Real-time process monitoring and alerts",
      icon: BarChart2,
      status: "coming-soon"
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

      {/* Placeholder for all tools since they're all coming soon */}
      <Card className="card-professional">
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Control Phase Tools</h3>
            <p className="text-muted-foreground mb-4">
              Control plans, SOPs, and monitoring dashboards coming soon
            </p>
            <Button variant="outline">Request Early Access</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}