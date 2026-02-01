import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useProject } from '@/contexts/ProjectContext';
import { ProjectManager } from '@/lib/projectManager';
import { ExcelTemplates } from '@/lib/excelTemplates';
import { PDFExporter } from '@/lib/pdfExport';
import { METHODOLOGIES, getMethodologyToolCount } from '@/lib/methodologies';
import { FolderOpen, Plus, Trash2, Download, Upload, FileDown, FileSpreadsheet, HardDrive, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface ProjectLibraryProps {
  onClose: () => void;
  onProjectSelected?: () => void;
}

export function ProjectLibrary({ onClose, onProjectSelected }: ProjectLibraryProps) {
  const { projects, currentProject, createProject, loadProject, deleteProject, exportProject, importProject } = useProject();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [selectedMethodologies, setSelectedMethodologies] = useState<string[]>(['dmaic']);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const { toast } = useToast();

  const storageInfo = ProjectManager.getStorageInfo();

  const toggleMethodology = (methodologyId: string) => {
    setSelectedMethodologies(prev => {
      if (prev.includes(methodologyId)) {
        // Don't allow deselecting all
        if (prev.length > 1) {
          return prev.filter(id => id !== methodologyId);
        }
        return prev;
      }
      return [...prev, methodologyId];
    });
  };

  const handleCreateProject = () => {
    if (!newProjectName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a project name.",
        variant: "destructive",
      });
      return;
    }

    if (selectedMethodologies.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one methodology.",
        variant: "destructive",
      });
      return;
    }

    createProject(newProjectName, newProjectDescription, selectedMethodologies);
    setNewProjectName('');
    setNewProjectDescription('');
    setSelectedMethodologies(['dmaic']);
    setShowCreateDialog(false);
    onClose();
    onProjectSelected?.();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await importProject(file);
      event.target.value = '';
    }
  };

  const handleExportAll = () => {
    ProjectManager.exportAllProjects();
    toast({
      title: "Backup Created",
      description: "All projects have been exported.",
    });
  };

  const handleExportPDF = () => {
    if (currentProject) {
      PDFExporter.exportProjectReport(currentProject);
      toast({
        title: "PDF Generated",
        description: "Project report has been exported as PDF.",
      });
    }
  };

  const handleDownloadTemplate = (generator: () => void, name: string) => {
    generator();
    toast({
      title: "Template Downloaded",
      description: `${name} template has been downloaded.`,
    });
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Project Library</h1>
            <p className="text-muted-foreground">Manage your quality improvement projects</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button variant="default">
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Start a new quality improvement project with your preferred methodologies
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4 flex-1 overflow-hidden flex flex-col min-h-0">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Project Name</label>
                  <Input
                    placeholder="Enter project name..."
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description (Optional)</label>
                  <Textarea
                    placeholder="Project description..."
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="space-y-2 flex-1 overflow-hidden flex flex-col min-h-0">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Select Methodologies ({selectedMethodologies.length} selected)</label>
                    <Badge variant="secondary">{METHODOLOGIES.length} available</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Choose one or more methodologies for this project</p>
                  <ScrollArea className="flex-1 border rounded-lg p-3 min-h-[300px] max-h-[400px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {METHODOLOGIES.map(methodology => {
                        const isSelected = selectedMethodologies.includes(methodology.id);
                        const toolCount = getMethodologyToolCount(methodology.id);
                        return (
                          <div
                            key={methodology.id}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${
                              isSelected ? 'border-primary bg-primary/5' : 'hover:border-muted-foreground/50'
                            }`}
                            onClick={() => toggleMethodology(methodology.id)}
                          >
                            <div className="flex items-start gap-3">
                              <Checkbox 
                                checked={isSelected} 
                                onCheckedChange={() => toggleMethodology(methodology.id)}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <methodology.icon className="h-4 w-4 text-primary flex-shrink-0" />
                                  <span className="font-medium">{methodology.name}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                  {methodology.fullName}
                                </p>
                                <div className="flex gap-2 mt-2">
                                  <Badge variant="outline" className="text-xs">
                                    {methodology.phases.length} phases
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {toolCount} tools
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateProject}>
                  Create Project
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" asChild>
            <label>
              <Upload className="mr-2 h-4 w-4" />
              Import Project
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImport}
              />
            </label>
          </Button>

          <Button variant="outline" onClick={handleExportAll}>
            <Download className="mr-2 h-4 w-4" />
            Backup All
          </Button>

          {currentProject && (
            <Button variant="outline" onClick={handleExportPDF}>
              <FileDown className="mr-2 h-4 w-4" />
              Export PDF Report
            </Button>
          )}

          <Button variant="outline" onClick={() => setShowTemplates(!showTemplates)}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Excel Templates
          </Button>
        </div>

        {/* Excel Templates Panel */}
        {showTemplates && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Excel Templates</CardTitle>
              <CardDescription>Download pre-formatted templates for easy data upload</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {ExcelTemplates.getAllTemplates().map((template) => (
                  <Button
                    key={template.name}
                    variant="outline"
                    className="justify-start h-auto py-3"
                    onClick={() => handleDownloadTemplate(template.generator, template.name)}
                  >
                    <div className="text-left">
                      <div className="font-semibold">{template.name}</div>
                      <div className="text-xs text-muted-foreground">{template.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Storage Info */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Storage: {(storageInfo.used / 1024).toFixed(2)} KB used ({storageInfo.percentage.toFixed(1)}%)
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {projects.length} project{projects.length !== 1 ? 's' : ''}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FolderOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first Six Sigma DMAIC project to get started
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Card
                key={project.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  currentProject?.id === project.id ? 'border-primary shadow-md' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1" onClick={() => {
                      loadProject(project.id);
                      onClose();
                      onProjectSelected?.();
                    }}>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {project.description || 'No description'}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmId(project.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent onClick={() => {
                  loadProject(project.id);
                  onClose();
                  onProjectSelected?.();
                }}>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Methodologies:</span>
                      <div className="flex flex-wrap gap-1 justify-end">
                        {(project.enabledMethodologies || ['dmaic']).slice(0, 2).map(m => {
                          const methodology = METHODOLOGIES.find(meth => meth.id === m);
                          return methodology ? (
                            <Badge key={m} variant="secondary" className="text-xs">
                              {methodology.name}
                            </Badge>
                          ) : null;
                        })}
                        {(project.enabledMethodologies || ['dmaic']).length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{(project.enabledMethodologies || ['dmaic']).length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span>Tools Used:</span>
                      <span className="font-medium text-foreground">
                        {Object.keys(project.toolsData).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Updated:</span>
                      <span className="font-medium text-foreground">
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {currentProject?.id === project.id && (
                    <div className="mt-3 pt-3 border-t">
                      <span className="text-xs font-semibold text-primary">ACTIVE PROJECT</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Project?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the project and all its data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (deleteConfirmId) {
                    deleteProject(deleteConfirmId);
                    setDeleteConfirmId(null);
                  }
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
