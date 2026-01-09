import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getToolsForPhase, ToolDefinition } from "@/lib/methodologies";
import { ToolRenderer } from "@/components/tools/ToolRenderer";

interface GenericPhaseProps {
  methodologyId: string;
  phaseId: string;
}

export function GenericPhase({ methodologyId, phaseId }: GenericPhaseProps) {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  
  const tools = getToolsForPhase(methodologyId, phaseId);

  if (activeTool) {
    const tool = tools.find(t => t.id === activeTool);
    return (
      <div>
        <Button 
          variant="ghost" 
          onClick={() => setActiveTool(null)}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tools
        </Button>
        <ToolRenderer toolId={activeTool} toolName={tool?.title || activeTool} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tools.map((tool) => (
        <ToolCard 
          key={tool.id} 
          tool={tool} 
          onClick={() => setActiveTool(tool.id)} 
        />
      ))}
    </div>
  );
}

interface ToolCardProps {
  tool: ToolDefinition;
  onClick: () => void;
}

function ToolCard({ tool, onClick }: ToolCardProps) {
  const categoryColors: Record<string, string> = {
    'analysis': 'bg-yellow-500/10 text-yellow-600',
    'planning': 'bg-blue-500/10 text-blue-600',
    'measurement': 'bg-green-500/10 text-green-600',
    'improvement': 'bg-orange-500/10 text-orange-600',
    'control': 'bg-purple-500/10 text-purple-600',
    'documentation': 'bg-gray-500/10 text-gray-600',
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all duration-200 group"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <tool.icon className="h-6 w-6 text-primary" />
          </div>
          <Badge variant="outline" className={categoryColors[tool.category] || ''}>
            {tool.category}
          </Badge>
        </div>
        <CardTitle className="text-lg mt-2">{tool.title}</CardTitle>
        <CardDescription>{tool.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="ghost" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          Open Tool
        </Button>
      </CardContent>
    </Card>
  );
}
