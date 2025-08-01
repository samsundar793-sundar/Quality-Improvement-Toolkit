import { useState } from "react";
import { LandingPage } from "@/components/LandingPage";
import { DMAICToolkit } from "@/components/DMAICToolkit";

const Index = () => {
  const [showToolkit, setShowToolkit] = useState(false);

  if (showToolkit) {
    return <DMAICToolkit onBackToLanding={() => setShowToolkit(false)} />;
  }

  return <LandingPage onGetStarted={() => setShowToolkit(true)} />;
};

export default Index;
