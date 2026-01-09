import { lazy, Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Wrench } from "lucide-react";

// Lazy load existing tool components
const ProjectCharterTool = lazy(() => import("./ProjectCharterTool").then(m => ({ default: m.ProjectCharterTool })));
const SIPOCTool = lazy(() => import("./SIPOCTool").then(m => ({ default: m.SIPOCTool })));
const CTQTreeTool = lazy(() => import("./CTQTreeTool").then(m => ({ default: m.CTQTreeTool })));
const VoiceOfCustomerTool = lazy(() => import("./VoiceOfCustomerTool").then(m => ({ default: m.VoiceOfCustomerTool })));
const StakeholderAnalysisTool = lazy(() => import("./StakeholderAnalysisTool").then(m => ({ default: m.StakeholderAnalysisTool })));
const CheckSheetTool = lazy(() => import("./CheckSheetTool").then(m => ({ default: m.CheckSheetTool })));
const GageRRTool = lazy(() => import("./GageRRTool").then(m => ({ default: m.GageRRTool })));
const AdvancedGageRRTool = lazy(() => import("./AdvancedGageRRTool").then(m => ({ default: m.AdvancedGageRRTool })));
const HistogramTool = lazy(() => import("./HistogramTool").then(m => ({ default: m.HistogramTool })));
const ParetoChartTool = lazy(() => import("./ParetoChartTool").then(m => ({ default: m.ParetoChartTool })));
const ControlChartTool = lazy(() => import("./ControlChartTool").then(m => ({ default: m.ControlChartTool })));
const ProcessCapabilityTool = lazy(() => import("./ProcessCapabilityTool").then(m => ({ default: m.ProcessCapabilityTool })));
const DataCollectionPlanTool = lazy(() => import("./DataCollectionPlanTool").then(m => ({ default: m.DataCollectionPlanTool })));
const ScatterPlotTool = lazy(() => import("./ScatterPlotTool").then(m => ({ default: m.ScatterPlotTool })));
const StratificationTool = lazy(() => import("./StratificationTool").then(m => ({ default: m.StratificationTool })));
const BoxPlotTool = lazy(() => import("./BoxPlotTool").then(m => ({ default: m.BoxPlotTool })));
const FiveWhyTool = lazy(() => import("./FiveWhyTool").then(m => ({ default: m.FiveWhyTool })));
const FishboneTool = lazy(() => import("./FishboneTool").then(m => ({ default: m.FishboneTool })));
const FMEATool = lazy(() => import("./FMEATool").then(m => ({ default: m.FMEATool })));
const RegressionAnalysisTool = lazy(() => import("./RegressionAnalysisTool").then(m => ({ default: m.RegressionAnalysisTool })));
const ParetoAnalysisTool = lazy(() => import("./ParetoAnalysisTool").then(m => ({ default: m.ParetoAnalysisTool })));
const SolutionPrioritizationTool = lazy(() => import("./SolutionPrioritizationTool").then(m => ({ default: m.SolutionPrioritizationTool })));
const DOETool = lazy(() => import("./DOETool").then(m => ({ default: m.DOETool })));
const KaizenTool = lazy(() => import("./KaizenTool").then(m => ({ default: m.KaizenTool })));
const PughMatrixTool = lazy(() => import("./PughMatrixTool").then(m => ({ default: m.PughMatrixTool })));
const ControlPlanTool = lazy(() => import("./ControlPlanTool").then(m => ({ default: m.ControlPlanTool })));
const SOPTemplateTool = lazy(() => import("./SOPTemplateTool").then(m => ({ default: m.SOPTemplateTool })));
const PokaYokeTool = lazy(() => import("./PokaYokeTool").then(m => ({ default: m.PokaYokeTool })));
const AuditChecklistTool = lazy(() => import("./AuditChecklistTool").then(m => ({ default: m.AuditChecklistTool })));
const MonitoringDashboardTool = lazy(() => import("./MonitoringDashboardTool").then(m => ({ default: m.MonitoringDashboardTool })));

// Tool component mapping
const TOOL_COMPONENTS: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  'project-charter': ProjectCharterTool,
  'sipoc': SIPOCTool,
  'ctq-tree': CTQTreeTool,
  'voice-of-customer': VoiceOfCustomerTool,
  'stakeholder-analysis': StakeholderAnalysisTool,
  'check-sheet': CheckSheetTool,
  'gage-rr': GageRRTool,
  'advanced-gage-rr': AdvancedGageRRTool,
  'histogram': HistogramTool,
  'pareto-chart': ParetoChartTool,
  'control-chart': ControlChartTool,
  'process-capability': ProcessCapabilityTool,
  'data-collection-plan': DataCollectionPlanTool,
  'scatter-plot': ScatterPlotTool,
  'stratification': StratificationTool,
  'box-plot': BoxPlotTool,
  'five-why': FiveWhyTool,
  'fishbone': FishboneTool,
  'fmea': FMEATool,
  'regression-analysis': RegressionAnalysisTool,
  'pareto-analysis': ParetoAnalysisTool,
  'solution-prioritization': SolutionPrioritizationTool,
  'doe': DOETool,
  'kaizen': KaizenTool,
  'pugh-matrix': PughMatrixTool,
  'control-plan': ControlPlanTool,
  'sop-template': SOPTemplateTool,
  'poka-yoke': PokaYokeTool,
  'audit-checklist': AuditChecklistTool,
  'monitoring-dashboard': MonitoringDashboardTool,
};

interface ToolRendererProps {
  toolId: string;
  toolName: string;
}

export function ToolRenderer({ toolId, toolName }: ToolRendererProps) {
  const ToolComponent = TOOL_COMPONENTS[toolId];

  if (!ToolComponent) {
    return <PlaceholderTool toolId={toolId} toolName={toolName} />;
  }

  return (
    <Suspense fallback={<LoadingTool />}>
      <ToolComponent />
    </Suspense>
  );
}

function LoadingTool() {
  return (
    <Card className="w-full">
      <CardContent className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading tool...</span>
      </CardContent>
    </Card>
  );
}

interface PlaceholderToolProps {
  toolId: string;
  toolName: string;
}

function PlaceholderTool({ toolId, toolName }: PlaceholderToolProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-muted">
            <Wrench className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <CardTitle>{toolName}</CardTitle>
            <CardDescription>Tool ID: {toolId}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-muted-foreground">
          <Wrench className="h-16 w-16 mx-auto mb-4 opacity-20" />
          <h3 className="text-lg font-medium mb-2">Tool Coming Soon</h3>
          <p className="text-sm max-w-md mx-auto">
            This tool is part of the methodology framework and will be fully implemented soon.
            The structure and data storage is ready for when you need it.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
