import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, BarChart, TestTube } from "lucide-react";
import { FiveWhyTool } from "../tools/FiveWhyTool";

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
      status: "coming-soon"
    },
    {
      id: "advanced-pareto",
      title: "Advanced Pareto",
      description: "Multi-level Pareto analysis",
      icon: BarChart,
      status: "coming-soon"
    },
    {
      id: "hypothesis-testing",
      title: "Hypothesis Testing",
      description: "Statistical significance testing",
      icon: TestTube,
      status: "coming-soon"
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
        
        {activeTool === "regression" && (
          <Card className="card-professional">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Regression Analysis</h3>
                <p className="text-muted-foreground mb-4">
                  Multiple linear regression with confidence intervals coming soon
                </p>
                <Button variant="outline">Request Early Access</Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Add placeholders for other tools */}
      </div>
    </div>
  );
}