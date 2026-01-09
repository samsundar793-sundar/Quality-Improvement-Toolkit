import { useState } from "react";
import { LandingPage } from "@/components/LandingPage";
import { DMAICToolkit } from "@/components/DMAICToolkit";
import { ProjectLibrary } from "@/components/ProjectLibrary";

type View = 'landing' | 'projects' | 'toolkit';

const Index = () => {
  const [currentView, setCurrentView] = useState<View>('landing');

  if (currentView === 'toolkit') {
    return <DMAICToolkit onBackToLanding={() => setCurrentView('landing')} />;
  }

  if (currentView === 'projects') {
    return (
      <ProjectLibrary 
        onClose={() => setCurrentView('landing')} 
        onProjectSelected={() => setCurrentView('toolkit')}
      />
    );
  }

  return <LandingPage onGetStarted={() => setCurrentView('projects')} />;
};

export default Index;
