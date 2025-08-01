import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, PieChart, LineChart, Target, TrendingUp, Gauge, FileSpreadsheet, Layers } from "lucide-react";
import { HistogramTool } from "../tools/HistogramTool";
import { ParetoChartTool } from "../tools/ParetoChartTool";
import { GageRRTool } from "../tools/GageRRTool";

export function MeasurePhase() {
  const tools = [
    {
      id: "gage-rr",
      title: "Gage R&R Study",
      description: "Measurement system analysis and repeatability",
      icon: Gauge,
      status: "ready"
    },
    {
      id: "histogram",
      title: "Histogram Analysis",
      description: "Data distribution visualization and analysis",
      icon: BarChart3,
      status: "ready"
    },
    {
      id: "pareto",
      title: "Pareto Chart",
      description: "80/20 analysis for problem prioritization",
      icon: PieChart,
      status: "ready"
    },
    {
      id: "control-chart",
      title: "Control Charts",
      description: "Process stability and variation monitoring",
      icon: LineChart,
      status: "coming-soon"
    },
    {
      id: "process-capability",
      title: "Process Capability",
      description: "Cp, Cpk, Pp, Ppk analysis",
      icon: Target,
      status: "coming-soon"
    },
    {
      id: "scatter-plot",
      title: "Scatter Diagram",
      description: "Correlation and relationship analysis",
      icon: TrendingUp,
      status: "coming-soon"
    },
    {
      id: "fishbone",
      title: "Fishbone Diagram",
      description: "Cause and effect analysis",
      icon: FileSpreadsheet,
      status: "coming-soon"
    },
    {
      id: "stratification",
      title: "Stratification",
      description: "Data segmentation and pattern analysis",
      icon: Layers,
      status: "coming-soon"
    }
  ];

  const [activeTool, setActiveTool] = useState("gage-rr");

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
        {activeTool === "gage-rr" && <GageRRTool />}
        {activeTool === "histogram" && <HistogramTool />}
        {activeTool === "pareto" && <ParetoChartTool />}
        
        {activeTool === "control-chart" && (
          <Card className="card-professional">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <LineChart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Control Charts</h3>
                <p className="text-muted-foreground mb-4">
                  X-bar, R-charts, and Individual-MR charts coming soon
                </p>
                <Button variant="outline">Request Early Access</Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Add similar placeholder cards for other coming-soon tools */}
      </div>
    </div>
  );
}