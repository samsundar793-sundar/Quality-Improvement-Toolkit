import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Target, Settings, FileSpreadsheet, LineChart as LineChartIcon } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const sampleData = [
  { name: 'Week 1', defects: 45, target: 30 },
  { name: 'Week 2', defects: 38, target: 30 },
  { name: 'Week 3', defects: 42, target: 30 },
  { name: 'Week 4', defects: 28, target: 30 },
  { name: 'Week 5', defects: 25, target: 30 },
  { name: 'Week 6', defects: 22, target: 30 },
];

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [isHovered, setIsHovered] = useState(false);

  const features = [
    {
      icon: Target,
      title: "Define Phase",
      description: "Project Charter, SIPOC Diagrams, Voice of Customer analysis to set clear objectives.",
      tools: "3 Tools"
    },
    {
      icon: BarChart3,
      title: "Measure Phase", 
      description: "Gage R&R, Histograms, Pareto Charts, Control Charts for comprehensive data analysis.",
      tools: "8 Tools"
    },
    {
      icon: TrendingUp,
      title: "Analyze Phase",
      description: "5 Why Analysis, Regression, Hypothesis Testing to identify root causes.",
      tools: "4 Tools"
    },
    {
      icon: Settings,
      title: "Improve Phase",
      description: "Solution Prioritization, Pilot Testing, Performance Comparison tools.",
      tools: "3 Tools"
    },
    {
      icon: FileSpreadsheet,
      title: "Control Phase",
      description: "Control Plans, SOP Management, Monitoring Dashboards for sustainability.",
      tools: "3 Tools"
    },
    {
      icon: LineChartIcon,
      title: "Advanced Analytics",
      description: "Statistical analysis, data visualization, and export capabilities.",
      tools: "Built-in"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="hero-gradient absolute inset-0 opacity-90" />
        <div className="relative z-10 container mx-auto px-4 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
              Six Sigma
              <span className="block bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                DMAIC Toolkit
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-4 animate-slide-up max-w-2xl mx-auto">
              Professional-grade statistical analysis and quality improvement tools for Six Sigma practitioners
            </p>
            <p className="text-sm md:text-base text-blue-200/80 mb-8 animate-slide-up max-w-2xl mx-auto">
              Created By SAMSUNDAR A • Powered by Lovable AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
              <Button 
                variant="hero" 
                size="xl"
                onClick={onGetStarted}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`${isHovered ? 'animate-glow-pulse' : ''}`}
              >
                Get Started with DMAIC
              </Button>
              <Button variant="outline" size="xl" className="border-white/30 text-white hover:bg-white/10">
                View Sample Tools
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Complete DMAIC Implementation
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              21 professional tools covering every phase of the Six Sigma methodology
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-professional group hover:scale-105 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <feature.icon className="h-12 w-12 text-primary group-hover:text-primary-glow transition-colors duration-200" />
                    <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                      {feature.tools}
                    </span>
                  </div>
                  <CardTitle className="text-xl text-card-foreground group-hover:text-primary transition-colors duration-200">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Chart Preview */}
      <div className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Interactive Data Visualization
            </h2>
            <p className="text-xl text-muted-foreground">
              Real-time charts and statistical analysis with export capabilities
            </p>
          </div>
          
          <Card className="max-w-4xl mx-auto card-professional">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Sample Control Chart</CardTitle>
              <CardDescription className="text-center">
                Defect Trends vs Target Performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sampleData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="defects" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                      name="Actual Defects"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      stroke="hsl(var(--destructive))" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: 'hsl(var(--destructive))', strokeWidth: 2, r: 4 }}
                      name="Target"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-24 bg-card/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Ready to Start Your Six Sigma Journey?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Access professional-grade tools with sample data, file upload capabilities, 
            and comprehensive export options.
          </p>
          <Button 
            variant="analytics" 
            size="xl"
            onClick={onGetStarted}
            className="animate-glow-pulse"
          >
            Launch DMAIC Toolkit
          </Button>
        </div>
      </div>
    </div>
  );
}