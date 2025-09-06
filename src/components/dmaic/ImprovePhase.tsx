import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, FlaskConical, BarChart4, Target, Calendar } from "lucide-react";
import { SolutionPrioritizationTool } from "../tools/SolutionPrioritizationTool";
import { DOETool } from "../tools/DOETool";
import { KaizenTool } from "../tools/KaizenTool";
import { PughMatrixTool } from "../tools/PughMatrixTool";

export function ImprovePhase() {
  const tools = [
    {
      id: "solution-prioritization",
      title: "Solution Prioritization",
      description: "Weighted scoring matrix for solution evaluation",
      icon: Target,
      status: "ready"
    },
    {
      id: "doe",
      title: "Design of Experiments",
      description: "Plan experimental validation of solutions",
      icon: FlaskConical,
      status: "ready"
    },
    {
      id: "pugh-matrix",
      title: "Pugh Matrix",
      description: "Solution comparison matrix",
      icon: BarChart4,
      status: "ready"
    },
    {
      id: "kaizen",
      title: "Kaizen Event Planner",
      description: "Plan and track improvement activities",
      icon: Calendar,
      status: "ready"
    }
  ];

  const [activeTool, setActiveTool] = useState("solution-prioritization");

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
        {activeTool === "solution-prioritization" && <SolutionPrioritizationTool />}
        {activeTool === "doe" && <DOETool />}
        {activeTool === "pugh-matrix" && <PughMatrixTool />}
        {activeTool === "kaizen" && <KaizenTool />}
      </div>
    </div>
  );
}