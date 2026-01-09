import { useState } from "react";
import { LandingPage } from "@/components/LandingPage";
import { QualityToolkit } from "@/components/QualityToolkit";
import { ProjectLibrary } from "@/components/ProjectLibrary";

type View = 'landing' | 'projects' | 'toolkit';

const Index = () => {
  const [currentView, setCurrentView] = useState<View>('landing');

  if (currentView === 'toolkit') {
    return <QualityToolkit onBackToLanding={() => setCurrentView('landing')} />;
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
