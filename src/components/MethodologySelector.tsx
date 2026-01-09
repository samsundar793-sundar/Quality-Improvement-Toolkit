import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings, ChevronRight } from "lucide-react";
import { METHODOLOGIES, getMethodologyToolCount } from "@/lib/methodologies";
import { useProject } from "@/contexts/ProjectContext";

interface MethodologySelectorProps {
  onMethodologyChange?: (methodologyId: string) => void;
}

export function MethodologySelector({ onMethodologyChange }: MethodologySelectorProps) {
  const { currentProject, updateProjectInfo } = useProject();
  const [isOpen, setIsOpen] = useState(false);
  
  const enabledMethodologies = currentProject?.enabledMethodologies || ['dmaic'];
  const currentMethodology = currentProject?.currentMethodology || 'dmaic';

  const toggleMethodology = (methodologyId: string) => {
    if (!currentProject) return;
    
    let newEnabled = [...enabledMethodologies];
    
    if (newEnabled.includes(methodologyId)) {
      // Don't allow disabling the last methodology
      if (newEnabled.length > 1) {
        newEnabled = newEnabled.filter(id => id !== methodologyId);
        // If we removed the current methodology, switch to another
        if (currentMethodology === methodologyId) {
          updateProjectInfo({
            enabledMethodologies: newEnabled,
            currentMethodology: newEnabled[0],
            currentPhase: METHODOLOGIES.find(m => m.id === newEnabled[0])?.phases[0]?.id || 'define'
          });
          onMethodologyChange?.(newEnabled[0]);
          return;
        }
      }
    } else {
      newEnabled.push(methodologyId);
    }
    
    updateProjectInfo({ enabledMethodologies: newEnabled });
  };

  const selectMethodology = (methodologyId: string) => {
    if (!currentProject || !enabledMethodologies.includes(methodologyId)) return;
    
    const methodology = METHODOLOGIES.find(m => m.id === methodologyId);
    updateProjectInfo({
      currentMethodology: methodologyId,
      currentPhase: methodology?.phases[0]?.id || 'define'
    });
    onMethodologyChange?.(methodologyId);
  };

  const currentMethodologyData = METHODOLOGIES.find(m => m.id === currentMethodology);

  return (
    <div className="flex items-center gap-2">
      {/* Quick Switch Buttons */}
      <div className="flex items-center gap-1">
        {enabledMethodologies.slice(0, 3).map(methodId => {
          const methodology = METHODOLOGIES.find(m => m.id === methodId);
          if (!methodology) return null;
          
          return (
            <Button
              key={methodId}
              variant={currentMethodology === methodId ? "default" : "outline"}
              size="sm"
              onClick={() => selectMethodology(methodId)}
              className="gap-1"
            >
              <methodology.icon className="h-4 w-4" />
              {methodology.name}
            </Button>
          );
        })}
        {enabledMethodologies.length > 3 && (
          <Badge variant="secondary">+{enabledMethodologies.length - 3}</Badge>
        )}
      </div>

      {/* Settings Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Configure Methodologies</DialogTitle>
            <DialogDescription>
              Select which quality improvement methodologies to use in this project
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[50vh] pr-4">
            <div className="grid gap-3">
              {METHODOLOGIES.map(methodology => {
                const isEnabled = enabledMethodologies.includes(methodology.id);
                const isCurrent = currentMethodology === methodology.id;
                const toolCount = getMethodologyToolCount(methodology.id);
                
                return (
                  <Card 
                    key={methodology.id}
                    className={`cursor-pointer transition-all ${
                      isEnabled ? 'border-primary/50 bg-primary/5' : 'opacity-60'
                    } ${isCurrent ? 'ring-2 ring-primary' : ''}`}
                  >
                    <CardHeader className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={isEnabled}
                            onCheckedChange={() => toggleMethodology(methodology.id)}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <methodology.icon className="h-5 w-5 text-primary" />
                              <CardTitle className="text-base">{methodology.name}</CardTitle>
                              {isCurrent && <Badge>Active</Badge>}
                            </div>
                            <CardDescription className="mt-1">
                              {methodology.fullName}
                            </CardDescription>
                          </div>
                        </div>
                        {isEnabled && !isCurrent && (
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => {
                              selectMethodology(methodology.id);
                              setIsOpen(false);
                            }}
                          >
                            Switch <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground mb-2">
                        {methodology.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{methodology.phases.length} phases</span>
                        <span>{toolCount} tools</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {methodology.phases.map(phase => (
                          <Badge key={phase.id} variant="outline" className="text-xs">
                            {phase.name}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
