import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, FolderOpen, Download, Save, CheckCircle, StickyNote, X } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";
import { ProjectLibrary } from "@/components/ProjectLibrary";
import { MethodologySelector } from "@/components/MethodologySelector";
import { GenericPhase } from "@/components/phases/GenericPhase";
import { PDFExporter } from "@/lib/pdfExport";
import { METHODOLOGIES, getMethodologyById, getMethodologyToolCount } from "@/lib/methodologies";

interface QualityToolkitProps {
  onBackToLanding: () => void;
}

export function QualityToolkit({ onBackToLanding }: QualityToolkitProps) {
  const [showProjectLibrary, setShowProjectLibrary] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { currentProject, exportProject, updateProjectInfo } = useProject();
  
  const currentMethodologyId = currentProject?.currentMethodology || 'dmaic';
  const methodology = getMethodologyById(currentMethodologyId);
  const [activePhase, setActivePhase] = useState(currentProject?.currentPhase || methodology?.phases[0]?.id || 'define');

  // Update active phase when methodology changes
  useEffect(() => {
    if (methodology && !methodology.phases.find(p => p.id === activePhase)) {
      setActivePhase(methodology.phases[0]?.id || 'define');
    }
  }, [currentMethodologyId, methodology, activePhase]);

  // Save current phase to project & track save time
  useEffect(() => {
    if (currentProject && activePhase !== currentProject.currentPhase) {
      updateProjectInfo({ currentPhase: activePhase });
      setLastSaved(new Date());
    }
  }, [activePhase]);

  const handleExportPDF = () => {
    if (currentProject) {
      PDFExporter.exportProjectReport(currentProject);
    }
  };

  const handleMethodologyChange = (methodologyId: string) => {
    const newMethodology = getMethodologyById(methodologyId);
    if (newMethodology) {
      setActivePhase(newMethodology.phases[0]?.id || 'define');
    }
  };

  if (!methodology) {
    return <div>Loading...</div>;
  }

  const toolCount = getMethodologyToolCount(currentMethodologyId);

  return (
    <div className="min-h-screen bg-background">
      {showProjectLibrary && <ProjectLibrary onClose={() => setShowProjectLibrary(false)} />}
      
      {/* Header */}
      <div className="border-b border-border bg-card/50 sticky top-0 z-40 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={onBackToLanding}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="border-l border-border pl-4">
                <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <methodology.icon className="h-5 w-5 text-primary" />
                  {methodology.fullName}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {currentProject ? currentProject.name : 'Quality Improvement Toolkit'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <MethodologySelector onMethodologyChange={handleMethodologyChange} />
              
              <div className="border-l border-border pl-2 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowProjectLibrary(true)}
                  className="gap-2"
                >
                  <FolderOpen className="h-4 w-4" />
                  Projects
                </Button>
                {currentProject && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowNotes(!showNotes)}
                      className="gap-2"
                    >
                      <StickyNote className="h-4 w-4" />
                      Notes
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={exportProject}
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Export
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExportPDF}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      PDF
                    </Button>
                  </>
                )}
                <Badge variant="outline" className="text-primary">
                  {toolCount} Tools
                </Badge>
                {lastSaved && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-success" />
                    Saved
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Notes Panel */}
      {showNotes && currentProject && (
        <div className="border-b border-border bg-card/80">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <StickyNote className="h-4 w-4 text-primary" />
                Project Notes
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setShowNotes(false)} className="h-6 w-6">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              value={currentProject.notes || ''}
              onChange={(e) => {
                updateProjectInfo({ notes: e.target.value });
                setLastSaved(new Date());
              }}
              placeholder="Add project notes, observations, decisions..."
              rows={3}
              className="resize-y text-sm"
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activePhase} onValueChange={setActivePhase} className="w-full">
          {/* Phase Navigation */}
          <TabsList className={`grid w-full mb-8 bg-muted/30 p-1 h-auto`} style={{ gridTemplateColumns: `repeat(${methodology.phases.length}, 1fr)` }}>
            {methodology.phases.map((phase) => (
              <TabsTrigger 
                key={phase.id} 
                value={phase.id}
                className="flex flex-col items-center gap-2 py-4 px-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
              >
                <phase.icon className={`h-6 w-6 ${activePhase === phase.id ? 'text-primary-foreground' : phase.color}`} />
                <div className="text-center">
                  <div className="font-semibold text-sm">{phase.name}</div>
                  <div className="text-xs opacity-80">{phase.tools.length} tools</div>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Phase Overview Card */}
          <div className="mb-8">
            <Card className="card-professional">
              <CardHeader>
                <div className="flex items-center gap-4">
                  {methodology.phases.find(p => p.id === activePhase) && (
                    <>
                      <div className="p-3 rounded-lg bg-primary/10">
                        {(() => {
                          const ActiveIcon = methodology.phases.find(p => p.id === activePhase)!.icon;
                          return <ActiveIcon className="h-8 w-8 text-primary" />;
                        })()}
                      </div>
                      <div>
                        <CardTitle className="text-2xl">
                          {methodology.phases.find(p => p.id === activePhase)?.name} Phase
                        </CardTitle>
                        <CardDescription className="text-lg">
                          {methodology.phases.find(p => p.id === activePhase)?.description}
                        </CardDescription>
                      </div>
                    </>
                  )}
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Phase Content */}
          {methodology.phases.map((phase) => (
            <TabsContent key={phase.id} value={phase.id} className="mt-0">
              <GenericPhase 
                methodologyId={currentMethodologyId} 
                phaseId={phase.id} 
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
