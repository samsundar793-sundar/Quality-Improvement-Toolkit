import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, BarChart, TestTube, GitBranch } from "lucide-react";
import { FiveWhyTool } from "../tools/FiveWhyTool";
import { RegressionAnalysisTool } from "../tools/RegressionAnalysisTool";
import { FishboneTool } from "../tools/FishboneTool";
import { BoxPlotTool } from "../tools/BoxPlotTool";
import { FMEATool } from "../tools/FMEATool";

export function AnalyzePhase() {
  const tools = [
    {
      id: "five-why",
      title: "5 Why Analysis",
      description: "Root cause analysis through systematic questioning",
      icon: Search,
      status: "ready"
    },
    {
      id: "regression",
      title: "Regression Analysis",
      description: "Statistical relationship modeling",
      icon: TrendingUp,
      status: "ready"
    },
    {
      id: "fishbone",
      title: "Fishbone (Cause & Effect)",
      description: "Systematic root cause identification",
      icon: GitBranch,
      status: "ready"
    },
    {
      id: "boxplot",
      title: "Box Plot & Time Series",
      description: "Statistical distribution analysis",
      icon: BarChart,
      status: "ready"
    },
    {
      id: "fmea",
      title: "FMEA",
      description: "Failure Mode and Effects Analysis",
      icon: TestTube,
      status: "ready"
    }
  ];

  const [activeTool, setActiveTool] = useState("five-why");

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
        {activeTool === "five-why" && <FiveWhyTool />}
        {activeTool === "regression" && <RegressionAnalysisTool />}
        {activeTool === "fishbone" && <FishboneTool />}
        {activeTool === "boxplot" && <BoxPlotTool />}
        {activeTool === "fmea" && <FMEATool />}
      </div>
    </div>
  );
}