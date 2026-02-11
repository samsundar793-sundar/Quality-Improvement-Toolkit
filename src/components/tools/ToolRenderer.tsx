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
const ProblemStatementTool = lazy(() => import("./ProblemStatementTool").then(m => ({ default: m.ProblemStatementTool })));
const TeamCharterTool = lazy(() => import("./TeamCharterTool").then(m => ({ default: m.TeamCharterTool })));
const ValueStreamMapTool = lazy(() => import("./ValueStreamMapTool").then(m => ({ default: m.ValueStreamMapTool })));
const WasteAnalysisTool = lazy(() => import("./WasteAnalysisTool").then(m => ({ default: m.WasteAnalysisTool })));
const FiveS_AuditTool = lazy(() => import("./FiveS_AuditTool").then(m => ({ default: m.FiveS_AuditTool })));
const BrainstormingTool = lazy(() => import("./BrainstormingTool").then(m => ({ default: m.BrainstormingTool })));
const ImplementationPlanTool = lazy(() => import("./ImplementationPlanTool").then(m => ({ default: m.ImplementationPlanTool })));
const LessonsLearnedTool = lazy(() => import("./LessonsLearnedTool").then(m => ({ default: m.LessonsLearnedTool })));
const RunChartTool = lazy(() => import("./RunChartTool").then(m => ({ default: m.RunChartTool })));
const HypothesisTestingTool = lazy(() => import("./HypothesisTestingTool").then(m => ({ default: m.HypothesisTestingTool })));
const IsIsNotTool = lazy(() => import("./IsIsNotTool").then(m => ({ default: m.IsIsNotTool })));
const PilotPlanTool = lazy(() => import("./PilotPlanTool").then(m => ({ default: m.PilotPlanTool })));
const HandoffPlanTool = lazy(() => import("./HandoffPlanTool").then(m => ({ default: m.HandoffPlanTool })));
const ResponsePlanTool = lazy(() => import("./ResponsePlanTool").then(m => ({ default: m.ResponsePlanTool })));
const StandardWorkTool = lazy(() => import("./StandardWorkTool").then(m => ({ default: m.StandardWorkTool })));
const ProcessFlowTool = lazy(() => import("./ProcessFlowTool").then(m => ({ default: m.ProcessFlowTool })));
const DesignFMEATool = lazy(() => import("./DesignFMEATool").then(m => ({ default: m.DesignFMEATool })));
const ProcessFMEATool = lazy(() => import("./ProcessFMEATool").then(m => ({ default: m.ProcessFMEATool })));
const D0SymptomsTool = lazy(() => import("./D0SymptomsTool").then(m => ({ default: m.D0SymptomsTool })));
const D1TeamFormationTool = lazy(() => import("./D1TeamFormationTool").then(m => ({ default: m.D1TeamFormationTool })));
const D2ProblemDefinitionTool = lazy(() => import("./D2ProblemDefinitionTool").then(m => ({ default: m.D2ProblemDefinitionTool })));
const D3ContainmentTool = lazy(() => import("./D3ContainmentTool").then(m => ({ default: m.D3ContainmentTool })));
const D4RootCauseTool = lazy(() => import("./D4RootCauseTool").then(m => ({ default: m.D4RootCauseTool })));
const D5CorrectiveActionTool = lazy(() => import("./D5CorrectiveActionTool"));
const D6ImplementVerifyTool = lazy(() => import("./D6ImplementVerifyTool"));
const D7PreventRecurrenceTool = lazy(() => import("./D7PreventRecurrenceTool"));
const D8TeamRecognitionTool = lazy(() => import("./D8TeamRecognitionTool"));
const ComparativeAnalysisTool = lazy(() => import("./ComparativeAnalysisTool").then(m => ({ default: m.ComparativeAnalysisTool })));
const PPAPChecklistTool = lazy(() => import("./PPAPChecklistTool"));
const APQPPhaseTool = lazy(() => import("./APQPPhaseTool"));
const A3ReportTool = lazy(() => import("./A3ReportTool"));
const PDCACycleTool = lazy(() => import("./PDCACycleTool"));
// New missing tools
const QFDTool = lazy(() => import("./QFDTool").then(m => ({ default: m.QFDTool })));
const DesignScorecardTool = lazy(() => import("./DesignScorecardTool").then(m => ({ default: m.DesignScorecardTool })));
const ConceptGenerationTool = lazy(() => import("./ConceptGenerationTool").then(m => ({ default: m.ConceptGenerationTool })));
const ConceptSelectionTool = lazy(() => import("./ConceptSelectionTool").then(m => ({ default: m.ConceptSelectionTool })));
const ToleranceAnalysisTool = lazy(() => import("./ToleranceAnalysisTool").then(m => ({ default: m.ToleranceAnalysisTool })));
const DesignVerificationTool = lazy(() => import("./DesignVerificationTool").then(m => ({ default: m.DesignVerificationTool })));
const DesignValidationTool = lazy(() => import("./DesignValidationTool").then(m => ({ default: m.DesignValidationTool })));
const DesignReviewTool = lazy(() => import("./DesignReviewTool").then(m => ({ default: m.DesignReviewTool })));
const MSATool = lazy(() => import("./MSATool").then(m => ({ default: m.MSATool })));
const SampleSubmissionTool = lazy(() => import("./SampleSubmissionTool").then(m => ({ default: m.SampleSubmissionTool })));
const DimensionalResultsTool = lazy(() => import("./DimensionalResultsTool").then(m => ({ default: m.DimensionalResultsTool })));
const MaterialTestTool = lazy(() => import("./MaterialTestTool").then(m => ({ default: m.MaterialTestTool })));
const ProductionTrialTool = lazy(() => import("./ProductionTrialTool").then(m => ({ default: m.ProductionTrialTool })));

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
  'problem-statement': ProblemStatementTool,
  'team-charter': TeamCharterTool,
  'value-stream-map': ValueStreamMapTool,
  'waste-analysis': WasteAnalysisTool,
  '5s-audit': FiveS_AuditTool,
  'brainstorming': BrainstormingTool,
  'implementation-plan': ImplementationPlanTool,
  'lessons-learned': LessonsLearnedTool,
  'run-chart': RunChartTool,
  'hypothesis-testing': HypothesisTestingTool,
  'is-is-not': IsIsNotTool,
  'pilot-plan': PilotPlanTool,
  'handoff-plan': HandoffPlanTool,
  'response-plan': ResponsePlanTool,
  'standard-work': StandardWorkTool,
  'process-flow': ProcessFlowTool,
  'design-fmea': DesignFMEATool,
  'process-fmea': ProcessFMEATool,
  // 8D tools - fixed ID mapping to match methodology definitions
  'd0-symptoms': D0SymptomsTool,
  'd1-team-formation': D1TeamFormationTool,
  'd2-problem-definition': D2ProblemDefinitionTool,
  'd3-containment': D3ContainmentTool,
  'd4-root-cause': D4RootCauseTool,
  'd5-corrective-actions': D5CorrectiveActionTool,
  'd6-implementation': D6ImplementVerifyTool,
  'd7-prevention': D7PreventRecurrenceTool,
  'd8-recognition': D8TeamRecognitionTool,
  'comparative-analysis': ComparativeAnalysisTool,
  'ppap-checklist': PPAPChecklistTool,
  'apqp-phase': APQPPhaseTool,
  'a3-report': A3ReportTool,
  'pdca-cycle': PDCACycleTool,
  // New tools - DMADV, PPAP, APQP specific
  'qfd': QFDTool,
  'design-scorecard': DesignScorecardTool,
  'concept-generation': ConceptGenerationTool,
  'concept-selection': ConceptSelectionTool,
  'tolerance-analysis': ToleranceAnalysisTool,
  'design-verification': DesignVerificationTool,
  'design-validation': DesignValidationTool,
  'design-review': DesignReviewTool,
  'measurement-system-analysis': MSATool,
  'sample-submission': SampleSubmissionTool,
  'dimensional-results': DimensionalResultsTool,
  'material-test': MaterialTestTool,
  'production-trial': ProductionTrialTool,
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
