import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ProjectData, ProjectManager } from '@/lib/projectManager';
import { useToast } from '@/hooks/use-toast';

interface ProjectContextType {
  currentProject: ProjectData | null;
  projects: ProjectData[];
  isLoading: boolean;
  createProject: (name: string, description?: string) => void;
  loadProject: (id: string) => void;
  deleteProject: (id: string) => void;
  updateProjectInfo: (updates: Partial<ProjectData>) => void;
  updateToolData: (toolName: string, data: any) => void;
  getToolData: (toolName: string) => any;
  exportProject: () => void;
  importProject: (file: File) => Promise<void>;
  refreshProjects: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within ProjectProvider');
  }
  return context;
};

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [currentProject, setCurrentProject] = useState<ProjectData | null>(null);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Auto-save timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentProject) {
        ProjectManager.saveProject(currentProject);
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(interval);
  }, [currentProject]);

  // Load projects on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = () => {
    setIsLoading(true);
    const allProjects = ProjectManager.getAllProjects();
    setProjects(allProjects);
    
    const currentId = ProjectManager.getCurrentProjectId();
    if (currentId) {
      const project = ProjectManager.getProject(currentId);
      if (project) {
        setCurrentProject(project);
      }
    }
    
    setIsLoading(false);
  };

  const createProject = (name: string, description: string = '') => {
    try {
      const project = ProjectManager.createProject(name, description);
      setProjects(prev => [...prev, project]);
      setCurrentProject(project);
      ProjectManager.setCurrentProject(project.id);
      
      toast({
        title: "Project Created",
        description: `"${name}" has been created successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project. Storage may be full.",
        variant: "destructive",
      });
    }
  };

  const loadProject = (id: string) => {
    const project = ProjectManager.getProject(id);
    if (project) {
      setCurrentProject(project);
      ProjectManager.setCurrentProject(id);
      
      toast({
        title: "Project Loaded",
        description: `Switched to "${project.name}".`,
      });
    }
  };

  const deleteProject = (id: string) => {
    const project = projects.find(p => p.id === id);
    ProjectManager.deleteProject(id);
    setProjects(prev => prev.filter(p => p.id !== id));
    
    if (currentProject?.id === id) {
      setCurrentProject(null);
    }
    
    toast({
      title: "Project Deleted",
      description: `"${project?.name}" has been deleted.`,
    });
  };

  const updateProjectInfo = (updates: Partial<ProjectData>) => {
    if (!currentProject) return;
    
    const updated = { ...currentProject, ...updates };
    setCurrentProject(updated);
    ProjectManager.saveProject(updated);
  };

  const updateToolData = (toolName: string, data: any) => {
    if (!currentProject) return;
    
    const updated = {
      ...currentProject,
      toolsData: {
        ...currentProject.toolsData,
        [toolName]: data
      }
    };
    
    setCurrentProject(updated);
    ProjectManager.saveProject(updated);
  };

  const getToolData = (toolName: string): any => {
    return currentProject?.toolsData[toolName] || null;
  };

  const exportProject = () => {
    if (!currentProject) return;
    
    ProjectManager.exportProject(currentProject);
    toast({
      title: "Project Exported",
      description: "Project has been exported successfully.",
    });
  };

  const importProject = async (file: File) => {
    try {
      const project = await ProjectManager.importProject(file);
      setProjects(prev => [...prev, project]);
      setCurrentProject(project);
      ProjectManager.setCurrentProject(project.id);
      
      toast({
        title: "Project Imported",
        description: `"${project.name}" has been imported successfully.`,
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to import project",
        variant: "destructive",
      });
    }
  };

  const refreshProjects = () => {
    const allProjects = ProjectManager.getAllProjects();
    setProjects(allProjects);
  };

  return (
    <ProjectContext.Provider
      value={{
        currentProject,
        projects,
        isLoading,
        createProject,
        loadProject,
        deleteProject,
        updateProjectInfo,
        updateToolData,
        getToolData,
        exportProject,
        importProject,
        refreshProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
