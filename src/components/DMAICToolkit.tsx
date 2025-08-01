import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Target, BarChart3, TrendingUp, Settings, Shield } from "lucide-react";

// Import DMAIC phase components
import { DefinePhase } from "./dmaic/DefinePhase";
import { MeasurePhase } from "./dmaic/MeasurePhase";
import { AnalyzePhase } from "./dmaic/AnalyzePhase";
import { ImprovePhase } from "./dmaic/ImprovePhase";
import { ControlPhase } from "./dmaic/ControlPhase";

interface DMAICToolkitProps {
  onBackToLanding: () => void;
}

export function DMAICToolkit({ onBackToLanding }: DMAICToolkitProps) {
  const [activePhase, setActivePhase] = useState("define");

  const phases = [
    {
      id: "define",
      name: "Define",
      icon: Target,
      description: "Project definition and scope",
      toolCount: 3,
      color: "text-blue-500"
    },
    {
      id: "measure",
      name: "Measure",
      icon: BarChart3,
      description: "Data collection and measurement",
      toolCount: 8,
      color: "text-green-500"
    },
    {
      id: "analyze",
      name: "Analyze",
      icon: TrendingUp,
      description: "Root cause analysis",
      toolCount: 4,
      color: "text-yellow-500"
    },
    {
      id: "improve",
      name: "Improve",
      icon: Settings,
      description: "Solution implementation",
      toolCount: 3,
      color: "text-orange-500"
    },
    {
      id: "control",
      name: "Control",
      icon: Shield,
      description: "Process control and monitoring",
      toolCount: 3,
      color: "text-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 sticky top-0 z-40 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={onBackToLanding}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
              <div className="border-l border-border pl-4">
                <h1 className="text-2xl font-bold text-foreground">Six Sigma DMAIC Toolkit</h1>
                <p className="text-sm text-muted-foreground">Professional quality improvement tools</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-primary">
                21 Tools Available
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activePhase} onValueChange={setActivePhase} className="w-full">
          {/* Phase Navigation */}
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-muted/30 p-1 h-auto">
            {phases.map((phase) => (
              <TabsTrigger 
                key={phase.id} 
                value={phase.id}
                className="flex flex-col items-center gap-2 py-4 px-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
              >
                <phase.icon className={`h-6 w-6 ${activePhase === phase.id ? 'text-primary-foreground' : phase.color}`} />
                <div className="text-center">
                  <div className="font-semibold">{phase.name}</div>
                  <div className="text-xs opacity-80">{phase.toolCount} tools</div>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Phase Overview Cards */}
          <div className="mb-8">
            <Card className="card-professional">
              <CardHeader>
                <div className="flex items-center gap-4">
                  {phases.find(p => p.id === activePhase) && (
                    <>
                      <div className="p-3 rounded-lg bg-primary/10">
                        {(() => {
                          const ActiveIcon = phases.find(p => p.id === activePhase)!.icon;
                          return <ActiveIcon className="h-8 w-8 text-primary" />;
                        })()}
                      </div>
                      <div>
                        <CardTitle className="text-2xl">
                          {phases.find(p => p.id === activePhase)?.name} Phase
                        </CardTitle>
                        <CardDescription className="text-lg">
                          {phases.find(p => p.id === activePhase)?.description}
                        </CardDescription>
                      </div>
                    </>
                  )}
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Phase Content */}
          <TabsContent value="define" className="mt-0">
            <DefinePhase />
          </TabsContent>

          <TabsContent value="measure" className="mt-0">
            <MeasurePhase />
          </TabsContent>

          <TabsContent value="analyze" className="mt-0">
            <AnalyzePhase />
          </TabsContent>

          <TabsContent value="improve" className="mt-0">
            <ImprovePhase />
          </TabsContent>

          <TabsContent value="control" className="mt-0">
            <ControlPhase />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}