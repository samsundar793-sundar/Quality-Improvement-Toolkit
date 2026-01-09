/**
 * Project Management System with Local Storage
 * Handles project CRUD operations, auto-save, and data persistence
 */

export interface ProjectData {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  // Multiple methodology support
  enabledMethodologies: string[]; // Array of methodology IDs
  currentMethodology: string; // Currently active methodology ID
  currentPhase: string;
  toolsData: Record<string, any>;
  notes: string;
}

const STORAGE_KEY = 'quality_toolkit_projects';
const CURRENT_PROJECT_KEY = 'quality_toolkit_current_project';

export class ProjectManager {
  /**
   * Get all saved projects
   */
  static getAllProjects(): ProjectData[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading projects:', error);
      return [];
    }
  }

  /**
   * Get a specific project by ID
   */
  static getProject(id: string): ProjectData | null {
    const projects = this.getAllProjects();
    return projects.find(p => p.id === id) || null;
  }

  /**
   * Save or update a project
   */
  static saveProject(project: ProjectData): void {
    try {
      const projects = this.getAllProjects();
      const existingIndex = projects.findIndex(p => p.id === project.id);
      
      project.updatedAt = new Date().toISOString();
      
      if (existingIndex >= 0) {
        projects[existingIndex] = project;
      } else {
        projects.push(project);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (error) {
      console.error('Error saving project:', error);
      throw new Error('Failed to save project. Storage may be full.');
    }
  }

  /**
   * Create a new project
   */
  static createProject(name: string, description: string = '', methodologies: string[] = ['dmaic']): ProjectData {
    const project: ProjectData = {
      id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      enabledMethodologies: methodologies,
      currentMethodology: methodologies[0] || 'dmaic',
      currentPhase: 'define',
      toolsData: {},
      notes: ''
    };
    
    this.saveProject(project);
    return project;
  }

  /**
   * Delete a project
   */
  static deleteProject(id: string): void {
    const projects = this.getAllProjects().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    
    // Clear current project if it's the one being deleted
    const currentId = this.getCurrentProjectId();
    if (currentId === id) {
      this.clearCurrentProject();
    }
  }

  /**
   * Get current project ID
   */
  static getCurrentProjectId(): string | null {
    return localStorage.getItem(CURRENT_PROJECT_KEY);
  }

  /**
   * Set current project
   */
  static setCurrentProject(id: string): void {
    localStorage.setItem(CURRENT_PROJECT_KEY, id);
  }

  /**
   * Clear current project
   */
  static clearCurrentProject(): void {
    localStorage.removeItem(CURRENT_PROJECT_KEY);
  }

  /**
   * Export project as JSON file
   */
  static exportProject(project: ProjectData): void {
    const dataStr = JSON.stringify(project, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Import project from JSON
   */
  static async importProject(file: File): Promise<ProjectData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const project = JSON.parse(content) as ProjectData;
          
          // Validate project structure
          if (!project.id || !project.name) {
            throw new Error('Invalid project file format');
          }
          
          // Generate new ID to avoid conflicts
          project.id = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          project.createdAt = new Date().toISOString();
          project.updatedAt = new Date().toISOString();
          
          this.saveProject(project);
          resolve(project);
        } catch (error) {
          reject(new Error('Failed to import project: Invalid file format'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  /**
   * Update tool data for current project
   */
  static updateToolData(projectId: string, toolName: string, data: any): void {
    const project = this.getProject(projectId);
    if (!project) return;
    
    project.toolsData[toolName] = data;
    this.saveProject(project);
  }

  /**
   * Get tool data from project
   */
  static getToolData(projectId: string, toolName: string): any {
    const project = this.getProject(projectId);
    return project?.toolsData[toolName] || null;
  }

  /**
   * Export all projects as backup
   */
  static exportAllProjects(): void {
    const projects = this.getAllProjects();
    const dataStr = JSON.stringify(projects, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dmaic_toolkit_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Get storage usage information
   */
  static getStorageInfo(): { used: number; total: number; percentage: number } {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const used = data ? new Blob([data]).size : 0;
      const total = 5 * 1024 * 1024; // 5MB typical limit
      
      return {
        used,
        total,
        percentage: (used / total) * 100
      };
    } catch {
      return { used: 0, total: 0, percentage: 0 };
    }
  }
}
