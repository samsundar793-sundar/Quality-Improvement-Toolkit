/**
 * Methodology Configuration System
 * Defines all quality improvement methodologies with their phases and tools
 */

import {
  Target, BarChart3, TrendingUp, Settings, Shield, FileCheck, Lightbulb,
  ClipboardList, Search, CheckCircle, Wrench, Truck, Cog, RefreshCw,
  Zap, AlertTriangle, Users, FileText, Microscope, TestTube, Factory,
  PackageCheck, ClipboardCheck, Gauge, LineChart, PieChart, GitBranch,
  Layers, Compass, ArrowRightLeft, Repeat, Eye, Hammer, BookOpen,
  CircleDot, ListChecks
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface ToolDefinition {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: 'analysis' | 'planning' | 'measurement' | 'improvement' | 'control' | 'documentation';
}

export interface PhaseDefinition {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  color: string;
  tools: string[]; // Tool IDs
}

export interface MethodologyDefinition {
  id: string;
  name: string;
  fullName: string;
  description: string;
  color: string;
  icon: LucideIcon;
  phases: PhaseDefinition[];
}

// ============= MASTER TOOL REGISTRY =============
// All available tools across all methodologies (no duplicates)
export const TOOL_REGISTRY: Record<string, ToolDefinition> = {
  // Planning & Definition Tools
  'project-charter': {
    id: 'project-charter',
    title: 'Project Charter',
    description: 'Define project scope, goals, and team',
    icon: Target,
    category: 'planning'
  },
  'sipoc': {
    id: 'sipoc',
    title: 'SIPOC Diagram',
    description: 'Suppliers, Inputs, Process, Outputs, Customers',
    icon: GitBranch,
    category: 'planning'
  },
  'ctq-tree': {
    id: 'ctq-tree',
    title: 'CTQ Tree',
    description: 'Critical to Quality requirements',
    icon: Layers,
    category: 'planning'
  },
  'voice-of-customer': {
    id: 'voice-of-customer',
    title: 'Voice of Customer',
    description: 'Capture and analyze customer needs',
    icon: Users,
    category: 'planning'
  },
  'stakeholder-analysis': {
    id: 'stakeholder-analysis',
    title: 'Stakeholder Analysis',
    description: 'Identify and analyze stakeholders',
    icon: Users,
    category: 'planning'
  },
  'check-sheet': {
    id: 'check-sheet',
    title: 'Check Sheet',
    description: 'Data collection form',
    icon: ClipboardCheck,
    category: 'documentation'
  },
  'problem-statement': {
    id: 'problem-statement',
    title: 'Problem Statement',
    description: 'Define the problem clearly',
    icon: AlertTriangle,
    category: 'planning'
  },
  'team-charter': {
    id: 'team-charter',
    title: 'Team Charter',
    description: 'Define team roles and responsibilities',
    icon: Users,
    category: 'planning'
  },

  // Measurement Tools
  'gage-rr': {
    id: 'gage-rr',
    title: 'Gage R&R Study',
    description: 'Measurement system analysis',
    icon: Gauge,
    category: 'measurement'
  },
  'advanced-gage-rr': {
    id: 'advanced-gage-rr',
    title: 'Advanced Gage R&R',
    description: 'Extended measurement analysis',
    icon: Gauge,
    category: 'measurement'
  },
  'histogram': {
    id: 'histogram',
    title: 'Histogram',
    description: 'Frequency distribution analysis',
    icon: BarChart3,
    category: 'measurement'
  },
  'pareto-chart': {
    id: 'pareto-chart',
    title: 'Pareto Chart',
    description: '80/20 analysis visualization',
    icon: PieChart,
    category: 'analysis'
  },
  'control-chart': {
    id: 'control-chart',
    title: 'Control Chart',
    description: 'Statistical process control',
    icon: LineChart,
    category: 'measurement'
  },
  'process-capability': {
    id: 'process-capability',
    title: 'Process Capability',
    description: 'Cp, Cpk analysis',
    icon: TrendingUp,
    category: 'measurement'
  },
  'data-collection-plan': {
    id: 'data-collection-plan',
    title: 'Data Collection Plan',
    description: 'Plan for systematic data gathering',
    icon: ClipboardList,
    category: 'measurement'
  },
  'scatter-plot': {
    id: 'scatter-plot',
    title: 'Scatter Plot',
    description: 'Correlation visualization',
    icon: CircleDot,
    category: 'analysis'
  },
  'stratification': {
    id: 'stratification',
    title: 'Stratification',
    description: 'Data segmentation analysis',
    icon: Layers,
    category: 'analysis'
  },
  'box-plot': {
    id: 'box-plot',
    title: 'Box Plot',
    description: 'Statistical distribution analysis',
    icon: BarChart3,
    category: 'analysis'
  },
  'run-chart': {
    id: 'run-chart',
    title: 'Run Chart',
    description: 'Trend analysis over time',
    icon: LineChart,
    category: 'measurement'
  },

  // Analysis Tools
  'five-why': {
    id: 'five-why',
    title: '5 Why Analysis',
    description: 'Root cause investigation',
    icon: Search,
    category: 'analysis'
  },
  'fishbone': {
    id: 'fishbone',
    title: 'Fishbone Diagram',
    description: 'Cause and effect analysis',
    icon: GitBranch,
    category: 'analysis'
  },
  'fmea': {
    id: 'fmea',
    title: 'FMEA',
    description: 'Failure Mode and Effects Analysis',
    icon: AlertTriangle,
    category: 'analysis'
  },
  'regression-analysis': {
    id: 'regression-analysis',
    title: 'Regression Analysis',
    description: 'Statistical relationship modeling',
    icon: TrendingUp,
    category: 'analysis'
  },
  'hypothesis-testing': {
    id: 'hypothesis-testing',
    title: 'Hypothesis Testing',
    description: 'Statistical hypothesis validation',
    icon: TestTube,
    category: 'analysis'
  },
  'pareto-analysis': {
    id: 'pareto-analysis',
    title: 'Pareto Analysis',
    description: 'Identify vital few causes',
    icon: PieChart,
    category: 'analysis'
  },
  'is-is-not': {
    id: 'is-is-not',
    title: 'Is/Is Not Analysis',
    description: 'Problem boundary definition',
    icon: ArrowRightLeft,
    category: 'analysis'
  },
  'comparative-analysis': {
    id: 'comparative-analysis',
    title: 'Comparative Analysis',
    description: 'Compare before and after states',
    icon: ArrowRightLeft,
    category: 'analysis'
  },

  // Improvement Tools
  'solution-prioritization': {
    id: 'solution-prioritization',
    title: 'Solution Prioritization',
    description: 'Rank and select solutions',
    icon: ListChecks,
    category: 'improvement'
  },
  'doe': {
    id: 'doe',
    title: 'Design of Experiments',
    description: 'Experimental design and analysis',
    icon: TestTube,
    category: 'improvement'
  },
  'kaizen': {
    id: 'kaizen',
    title: 'Kaizen Event',
    description: 'Rapid improvement workshop',
    icon: Zap,
    category: 'improvement'
  },
  'pugh-matrix': {
    id: 'pugh-matrix',
    title: 'Pugh Matrix',
    description: 'Decision matrix analysis',
    icon: Layers,
    category: 'improvement'
  },
  'brainstorming': {
    id: 'brainstorming',
    title: 'Brainstorming',
    description: 'Idea generation session',
    icon: Lightbulb,
    category: 'improvement'
  },
  'pilot-plan': {
    id: 'pilot-plan',
    title: 'Pilot Plan',
    description: 'Plan for testing solutions',
    icon: Compass,
    category: 'improvement'
  },
  'implementation-plan': {
    id: 'implementation-plan',
    title: 'Implementation Plan',
    description: 'Detailed action planning',
    icon: ClipboardList,
    category: 'improvement'
  },
  'value-stream-map': {
    id: 'value-stream-map',
    title: 'Value Stream Map',
    description: 'Visualize process flow and waste',
    icon: GitBranch,
    category: 'improvement'
  },
  'waste-analysis': {
    id: 'waste-analysis',
    title: 'Waste Analysis (8 Wastes)',
    description: 'Identify and eliminate waste',
    icon: AlertTriangle,
    category: 'analysis'
  },
  '5s-audit': {
    id: '5s-audit',
    title: '5S Audit',
    description: 'Workplace organization assessment',
    icon: CheckCircle,
    category: 'improvement'
  },
  'standard-work': {
    id: 'standard-work',
    title: 'Standard Work',
    description: 'Define standard procedures',
    icon: FileText,
    category: 'documentation'
  },

  // Control Tools
  'control-plan': {
    id: 'control-plan',
    title: 'Control Plan',
    description: 'Process control documentation',
    icon: Shield,
    category: 'control'
  },
  'sop-template': {
    id: 'sop-template',
    title: 'SOP Template',
    description: 'Standard Operating Procedures',
    icon: FileText,
    category: 'documentation'
  },
  'poka-yoke': {
    id: 'poka-yoke',
    title: 'Poka-Yoke Design',
    description: 'Error-proofing solutions',
    icon: Shield,
    category: 'control'
  },
  'audit-checklist': {
    id: 'audit-checklist',
    title: 'Audit Checklist',
    description: 'Process audit templates',
    icon: ClipboardCheck,
    category: 'control'
  },
  'monitoring-dashboard': {
    id: 'monitoring-dashboard',
    title: 'Monitoring Dashboard',
    description: 'KPI tracking and visualization',
    icon: Eye,
    category: 'control'
  },
  'lessons-learned': {
    id: 'lessons-learned',
    title: 'Lessons Learned',
    description: 'Document project learnings',
    icon: BookOpen,
    category: 'documentation'
  },
  'handoff-plan': {
    id: 'handoff-plan',
    title: 'Handoff Plan',
    description: 'Transition to process owner',
    icon: Repeat,
    category: 'control'
  },
  'response-plan': {
    id: 'response-plan',
    title: 'Response Plan',
    description: 'Out-of-control action plan',
    icon: AlertTriangle,
    category: 'control'
  },

  // APQP/PPAP Specific Tools
  'design-review': {
    id: 'design-review',
    title: 'Design Review',
    description: 'Formal design evaluation',
    icon: Microscope,
    category: 'planning'
  },
  'process-flow': {
    id: 'process-flow',
    title: 'Process Flow Diagram',
    description: 'Detailed process mapping',
    icon: GitBranch,
    category: 'planning'
  },
  'design-fmea': {
    id: 'design-fmea',
    title: 'Design FMEA (DFMEA)',
    description: 'Design failure mode analysis',
    icon: AlertTriangle,
    category: 'analysis'
  },
  'process-fmea': {
    id: 'process-fmea',
    title: 'Process FMEA (PFMEA)',
    description: 'Process failure mode analysis',
    icon: AlertTriangle,
    category: 'analysis'
  },
  'measurement-system-analysis': {
    id: 'measurement-system-analysis',
    title: 'MSA',
    description: 'Measurement System Analysis',
    icon: Gauge,
    category: 'measurement'
  },
  'ppap-checklist': {
    id: 'ppap-checklist',
    title: 'PPAP Checklist',
    description: 'Production Part Approval Process',
    icon: PackageCheck,
    category: 'documentation'
  },
  'sample-submission': {
    id: 'sample-submission',
    title: 'Sample Submission',
    description: 'Part submission warrant',
    icon: Truck,
    category: 'documentation'
  },
  'dimensional-results': {
    id: 'dimensional-results',
    title: 'Dimensional Results',
    description: 'Measurement results documentation',
    icon: Gauge,
    category: 'measurement'
  },
  'material-test': {
    id: 'material-test',
    title: 'Material Test Results',
    description: 'Material certification and testing',
    icon: TestTube,
    category: 'measurement'
  },

  // 8D Specific Tools
  'd0-symptoms': {
    id: 'd0-symptoms',
    title: 'D0: Symptom Analysis',
    description: 'Emergency response actions',
    icon: AlertTriangle,
    category: 'analysis'
  },
  'd1-team-formation': {
    id: 'd1-team-formation',
    title: 'D1: Team Formation',
    description: 'Establish cross-functional team',
    icon: Users,
    category: 'planning'
  },
  'd2-problem-definition': {
    id: 'd2-problem-definition',
    title: 'D2: Problem Definition',
    description: 'Quantify the problem',
    icon: Target,
    category: 'planning'
  },
  'd3-containment': {
    id: 'd3-containment',
    title: 'D3: Containment Actions',
    description: 'Implement interim containment',
    icon: Shield,
    category: 'control'
  },
  'd4-root-cause': {
    id: 'd4-root-cause',
    title: 'D4: Root Cause Analysis',
    description: 'Identify and verify root causes',
    icon: Search,
    category: 'analysis'
  },
  'd5-corrective-actions': {
    id: 'd5-corrective-actions',
    title: 'D5: Permanent Corrective Actions',
    description: 'Choose and verify PCAs',
    icon: Wrench,
    category: 'improvement'
  },
  'd6-implementation': {
    id: 'd6-implementation',
    title: 'D6: Implementation',
    description: 'Implement and validate PCAs',
    icon: Cog,
    category: 'improvement'
  },
  'd7-prevention': {
    id: 'd7-prevention',
    title: 'D7: Prevention',
    description: 'Prevent recurrence',
    icon: Shield,
    category: 'control'
  },
  'd8-recognition': {
    id: 'd8-recognition',
    title: 'D8: Team Recognition',
    description: 'Recognize team contributions',
    icon: CheckCircle,
    category: 'documentation'
  },

  // Design Tools (DFSS/DMADV)
  'qfd': {
    id: 'qfd',
    title: 'QFD (House of Quality)',
    description: 'Quality Function Deployment',
    icon: Factory,
    category: 'planning'
  },
  'concept-generation': {
    id: 'concept-generation',
    title: 'Concept Generation',
    description: 'Generate design concepts',
    icon: Lightbulb,
    category: 'planning'
  },
  'concept-selection': {
    id: 'concept-selection',
    title: 'Concept Selection',
    description: 'Evaluate and select designs',
    icon: CheckCircle,
    category: 'planning'
  },
  'design-scorecard': {
    id: 'design-scorecard',
    title: 'Design Scorecard',
    description: 'Track design performance',
    icon: ClipboardCheck,
    category: 'measurement'
  },
  'tolerance-analysis': {
    id: 'tolerance-analysis',
    title: 'Tolerance Analysis',
    description: 'Design tolerance stackup',
    icon: Gauge,
    category: 'analysis'
  },
  'design-verification': {
    id: 'design-verification',
    title: 'Design Verification',
    description: 'Verify design meets requirements',
    icon: CheckCircle,
    category: 'control'
  },
  'design-validation': {
    id: 'design-validation',
    title: 'Design Validation',
    description: 'Validate design with customer',
    icon: CheckCircle,
    category: 'control'
  },
};

// ============= METHODOLOGY DEFINITIONS =============

export const METHODOLOGIES: MethodologyDefinition[] = [
  // 1. DMAIC (Six Sigma)
  {
    id: 'dmaic',
    name: 'DMAIC',
    fullName: 'Define, Measure, Analyze, Improve, Control',
    description: 'Six Sigma methodology for process improvement',
    color: 'hsl(var(--primary))',
    icon: TrendingUp,
    phases: [
      {
        id: 'define',
        name: 'Define',
        icon: Target,
        description: 'Define the problem and project goals',
        color: 'text-blue-500',
        tools: ['project-charter', 'sipoc', 'ctq-tree', 'voice-of-customer', 'stakeholder-analysis', 'check-sheet']
      },
      {
        id: 'measure',
        name: 'Measure',
        icon: BarChart3,
        description: 'Measure current process performance',
        color: 'text-green-500',
        tools: ['gage-rr', 'advanced-gage-rr', 'histogram', 'pareto-chart', 'control-chart', 'process-capability', 'data-collection-plan', 'scatter-plot', 'stratification']
      },
      {
        id: 'analyze',
        name: 'Analyze',
        icon: Search,
        description: 'Analyze data to identify root causes',
        color: 'text-yellow-500',
        tools: ['five-why', 'fishbone', 'fmea', 'regression-analysis', 'box-plot', 'hypothesis-testing', 'pareto-analysis']
      },
      {
        id: 'improve',
        name: 'Improve',
        icon: Settings,
        description: 'Improve the process with solutions',
        color: 'text-orange-500',
        tools: ['solution-prioritization', 'doe', 'kaizen', 'pugh-matrix', 'pilot-plan', 'implementation-plan']
      },
      {
        id: 'control',
        name: 'Control',
        icon: Shield,
        description: 'Control and sustain improvements',
        color: 'text-purple-500',
        tools: ['control-plan', 'sop-template', 'poka-yoke', 'audit-checklist', 'monitoring-dashboard', 'lessons-learned', 'handoff-plan']
      }
    ]
  },

  // 2. DMADV (DFSS - Design for Six Sigma)
  {
    id: 'dmadv',
    name: 'DMADV',
    fullName: 'Define, Measure, Analyze, Design, Verify (DFSS)',
    description: 'Six Sigma methodology for new product/process design',
    color: 'hsl(210, 100%, 50%)',
    icon: Lightbulb,
    phases: [
      {
        id: 'define',
        name: 'Define',
        icon: Target,
        description: 'Define project goals and customer requirements',
        color: 'text-blue-500',
        tools: ['project-charter', 'voice-of-customer', 'stakeholder-analysis', 'ctq-tree', 'qfd']
      },
      {
        id: 'measure',
        name: 'Measure',
        icon: BarChart3,
        description: 'Measure and determine customer needs',
        color: 'text-green-500',
        tools: ['ctq-tree', 'data-collection-plan', 'design-scorecard', 'process-capability']
      },
      {
        id: 'analyze',
        name: 'Analyze',
        icon: Search,
        description: 'Analyze options to meet customer needs',
        color: 'text-yellow-500',
        tools: ['concept-generation', 'concept-selection', 'pugh-matrix', 'design-fmea', 'tolerance-analysis']
      },
      {
        id: 'design',
        name: 'Design',
        icon: Lightbulb,
        description: 'Design the product or process',
        color: 'text-orange-500',
        tools: ['design-fmea', 'process-fmea', 'doe', 'poka-yoke', 'design-review']
      },
      {
        id: 'verify',
        name: 'Verify',
        icon: CheckCircle,
        description: 'Verify design meets requirements',
        color: 'text-purple-500',
        tools: ['design-verification', 'design-validation', 'control-plan', 'pilot-plan', 'lessons-learned']
      }
    ]
  },

  // 3. DMEDI
  {
    id: 'dmedi',
    name: 'DMEDI',
    fullName: 'Define, Measure, Explore, Develop, Implement',
    description: 'Innovation methodology for breakthrough improvements',
    color: 'hsl(280, 70%, 50%)',
    icon: Compass,
    phases: [
      {
        id: 'define',
        name: 'Define',
        icon: Target,
        description: 'Define the opportunity and goals',
        color: 'text-blue-500',
        tools: ['project-charter', 'voice-of-customer', 'stakeholder-analysis', 'problem-statement']
      },
      {
        id: 'measure',
        name: 'Measure',
        icon: BarChart3,
        description: 'Measure current state and requirements',
        color: 'text-green-500',
        tools: ['data-collection-plan', 'ctq-tree', 'process-capability', 'value-stream-map']
      },
      {
        id: 'explore',
        name: 'Explore',
        icon: Search,
        description: 'Explore innovative solutions',
        color: 'text-yellow-500',
        tools: ['brainstorming', 'concept-generation', 'pugh-matrix', 'comparative-analysis']
      },
      {
        id: 'develop',
        name: 'Develop',
        icon: Wrench,
        description: 'Develop the optimal solution',
        color: 'text-orange-500',
        tools: ['doe', 'design-fmea', 'pilot-plan', 'poka-yoke', 'implementation-plan']
      },
      {
        id: 'implement',
        name: 'Implement',
        icon: CheckCircle,
        description: 'Implement and sustain the solution',
        color: 'text-purple-500',
        tools: ['control-plan', 'sop-template', 'monitoring-dashboard', 'lessons-learned', 'handoff-plan']
      }
    ]
  },

  // 4. APQP (Advanced Product Quality Planning)
  {
    id: 'apqp',
    name: 'APQP',
    fullName: 'Advanced Product Quality Planning',
    description: 'Automotive quality planning framework',
    color: 'hsl(190, 70%, 45%)',
    icon: Factory,
    phases: [
      {
        id: 'planning',
        name: 'Plan & Define',
        icon: Target,
        description: 'Plan and define the program',
        color: 'text-blue-500',
        tools: ['project-charter', 'voice-of-customer', 'design-review', 'team-charter']
      },
      {
        id: 'product-design',
        name: 'Product Design',
        icon: Lightbulb,
        description: 'Product design and development',
        color: 'text-green-500',
        tools: ['design-fmea', 'design-review', 'design-verification', 'ctq-tree', 'qfd']
      },
      {
        id: 'process-design',
        name: 'Process Design',
        icon: Cog,
        description: 'Process design and development',
        color: 'text-yellow-500',
        tools: ['process-flow', 'process-fmea', 'control-plan', 'measurement-system-analysis', 'poka-yoke']
      },
      {
        id: 'validation',
        name: 'Product & Process Validation',
        icon: CheckCircle,
        description: 'Validate product and process',
        color: 'text-orange-500',
        tools: ['ppap-checklist', 'process-capability', 'measurement-system-analysis', 'production-trial']
      },
      {
        id: 'production',
        name: 'Production',
        icon: Factory,
        description: 'Launch and continuous improvement',
        color: 'text-purple-500',
        tools: ['control-plan', 'audit-checklist', 'lessons-learned', 'monitoring-dashboard']
      }
    ]
  },

  // 5. PPAP (Production Part Approval Process)
  {
    id: 'ppap',
    name: 'PPAP',
    fullName: 'Production Part Approval Process',
    description: 'Automotive part submission and approval',
    color: 'hsl(35, 80%, 50%)',
    icon: PackageCheck,
    phases: [
      {
        id: 'design-records',
        name: 'Design Records',
        icon: FileText,
        description: 'Prepare design documentation',
        color: 'text-blue-500',
        tools: ['design-review', 'design-fmea', 'dimensional-results']
      },
      {
        id: 'process-documentation',
        name: 'Process Documentation',
        icon: ClipboardList,
        description: 'Document process requirements',
        color: 'text-green-500',
        tools: ['process-flow', 'process-fmea', 'control-plan']
      },
      {
        id: 'validation-testing',
        name: 'Validation & Testing',
        icon: TestTube,
        description: 'Perform validation testing',
        color: 'text-yellow-500',
        tools: ['measurement-system-analysis', 'process-capability', 'material-test', 'dimensional-results']
      },
      {
        id: 'submission',
        name: 'Submission',
        icon: Truck,
        description: 'Prepare and submit PPAP package',
        color: 'text-orange-500',
        tools: ['ppap-checklist', 'sample-submission']
      }
    ]
  },

  // 6. 8D Problem Solving
  {
    id: '8d',
    name: '8D',
    fullName: '8 Disciplines Problem Solving',
    description: 'Team-oriented problem solving methodology',
    color: 'hsl(0, 70%, 50%)',
    icon: AlertTriangle,
    phases: [
      {
        id: 'd0-d1',
        name: 'D0-D1: Prepare & Team',
        icon: Users,
        description: 'Emergency response and team formation',
        color: 'text-red-500',
        tools: ['d0-symptoms', 'd1-team-formation', 'd3-containment']
      },
      {
        id: 'd2-d3',
        name: 'D2-D3: Define & Contain',
        icon: Shield,
        description: 'Problem definition and containment',
        color: 'text-orange-500',
        tools: ['d2-problem-definition', 'd3-containment', 'is-is-not', 'check-sheet']
      },
      {
        id: 'd4',
        name: 'D4: Root Cause',
        icon: Search,
        description: 'Root cause analysis',
        color: 'text-yellow-500',
        tools: ['d4-root-cause', 'five-why', 'fishbone', 'pareto-analysis', 'is-is-not']
      },
      {
        id: 'd5-d6',
        name: 'D5-D6: Corrective Actions',
        icon: Wrench,
        description: 'Permanent corrective actions',
        color: 'text-green-500',
        tools: ['d5-corrective-actions', 'd6-implementation', 'solution-prioritization', 'poka-yoke']
      },
      {
        id: 'd7-d8',
        name: 'D7-D8: Prevent & Close',
        icon: CheckCircle,
        description: 'Prevention and recognition',
        color: 'text-blue-500',
        tools: ['d7-prevention', 'd8-recognition', 'control-plan', 'lessons-learned', 'audit-checklist']
      }
    ]
  },

  // 7. Lean Improvement Cycle
  {
    id: 'lean',
    name: 'Lean',
    fullName: 'Lean Improvement Cycle',
    description: 'Eliminate waste and optimize flow',
    color: 'hsl(145, 70%, 40%)',
    icon: RefreshCw,
    phases: [
      {
        id: 'identify',
        name: 'Identify Value',
        icon: Target,
        description: 'Define value from customer perspective',
        color: 'text-blue-500',
        tools: ['voice-of-customer', 'value-stream-map', 'ctq-tree', 'stakeholder-analysis']
      },
      {
        id: 'map',
        name: 'Map Value Stream',
        icon: GitBranch,
        description: 'Map current and future state',
        color: 'text-green-500',
        tools: ['value-stream-map', 'process-flow', 'waste-analysis', 'sipoc']
      },
      {
        id: 'create-flow',
        name: 'Create Flow',
        icon: TrendingUp,
        description: 'Eliminate waste and create flow',
        color: 'text-yellow-500',
        tools: ['waste-analysis', '5s-audit', 'kaizen', 'standard-work']
      },
      {
        id: 'establish-pull',
        name: 'Establish Pull',
        icon: ArrowRightLeft,
        description: 'Implement pull systems',
        color: 'text-orange-500',
        tools: ['kaizen', 'poka-yoke', 'implementation-plan', 'control-chart']
      },
      {
        id: 'seek-perfection',
        name: 'Seek Perfection',
        icon: RefreshCw,
        description: 'Continuous improvement',
        color: 'text-purple-500',
        tools: ['kaizen', 'audit-checklist', 'monitoring-dashboard', 'lessons-learned']
      }
    ]
  },

  // 8. Kaizen Methodology
  {
    id: 'kaizen',
    name: 'Kaizen',
    fullName: 'Kaizen Continuous Improvement',
    description: 'Rapid improvement events and daily improvements',
    color: 'hsl(45, 90%, 50%)',
    icon: Zap,
    phases: [
      {
        id: 'plan',
        name: 'Plan',
        icon: Target,
        description: 'Plan the improvement event',
        color: 'text-blue-500',
        tools: ['project-charter', 'team-charter', 'value-stream-map', 'waste-analysis']
      },
      {
        id: 'do',
        name: 'Do',
        icon: Wrench,
        description: 'Execute improvements',
        color: 'text-green-500',
        tools: ['kaizen', '5s-audit', 'standard-work', 'brainstorming']
      },
      {
        id: 'check',
        name: 'Check',
        icon: Search,
        description: 'Verify results',
        color: 'text-yellow-500',
        tools: ['comparative-analysis', 'control-chart', 'process-capability', 'histogram']
      },
      {
        id: 'act',
        name: 'Act',
        icon: CheckCircle,
        description: 'Standardize and sustain',
        color: 'text-orange-500',
        tools: ['sop-template', 'control-plan', 'audit-checklist', 'lessons-learned']
      }
    ]
  },

  // 9. PDCA (Plan-Do-Check-Act) - for general quality improvement
  {
    id: 'pdca',
    name: 'PDCA',
    fullName: 'Plan-Do-Check-Act Cycle',
    description: 'Iterative problem-solving and improvement',
    color: 'hsl(220, 60%, 50%)',
    icon: Repeat,
    phases: [
      {
        id: 'plan',
        name: 'Plan',
        icon: Target,
        description: 'Identify opportunity and plan change',
        color: 'text-blue-500',
        tools: ['project-charter', 'problem-statement', 'data-collection-plan', 'five-why', 'fishbone']
      },
      {
        id: 'do',
        name: 'Do',
        icon: Wrench,
        description: 'Implement the change on small scale',
        color: 'text-green-500',
        tools: ['pilot-plan', 'kaizen', 'check-sheet', 'implementation-plan']
      },
      {
        id: 'check',
        name: 'Check',
        icon: Search,
        description: 'Review and analyze results',
        color: 'text-yellow-500',
        tools: ['histogram', 'control-chart', 'pareto-chart', 'comparative-analysis', 'run-chart']
      },
      {
        id: 'act',
        name: 'Act',
        icon: CheckCircle,
        description: 'Take action based on learnings',
        color: 'text-orange-500',
        tools: ['sop-template', 'control-plan', 'lessons-learned', 'handoff-plan']
      }
    ]
  }
];

// ============= UTILITY FUNCTIONS =============

export const getMethodologyById = (id: string): MethodologyDefinition | undefined => {
  return METHODOLOGIES.find(m => m.id === id);
};

export const getToolById = (id: string): ToolDefinition | undefined => {
  return TOOL_REGISTRY[id];
};

export const getToolsForPhase = (methodologyId: string, phaseId: string): ToolDefinition[] => {
  const methodology = getMethodologyById(methodologyId);
  if (!methodology) return [];
  
  const phase = methodology.phases.find(p => p.id === phaseId);
  if (!phase) return [];
  
  return phase.tools
    .map(toolId => TOOL_REGISTRY[toolId])
    .filter((tool): tool is ToolDefinition => tool !== undefined);
};

export const getAllUniqueTools = (): ToolDefinition[] => {
  return Object.values(TOOL_REGISTRY);
};

export const getMethodologyToolCount = (methodologyId: string): number => {
  const methodology = getMethodologyById(methodologyId);
  if (!methodology) return 0;
  
  const allTools = new Set<string>();
  methodology.phases.forEach(phase => {
    phase.tools.forEach(toolId => allTools.add(toolId));
  });
  
  return allTools.size;
};
