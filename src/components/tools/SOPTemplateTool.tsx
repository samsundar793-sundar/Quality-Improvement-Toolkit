import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, RotateCcw, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SOPStep {
  id: string;
  stepNumber: number;
  description: string;
  responsibility: string;
  criticalPoint: boolean;
  notes: string;
}

interface SOPDocument {
  title: string;
  version: string;
  department: string;
  approvedBy: string;
  effectiveDate: string;
  reviewDate: string;
  purpose: string;
  scope: string;
  responsibilities: string;
  materials: string;
  safety: string;
  steps: SOPStep[];
  references: string;
}

export function SOPTemplateTool() {
  const { toast } = useToast();
  const [sop, setSop] = useState<SOPDocument>({
    title: "",
    version: "1.0",
    department: "",
    approvedBy: "",
    effectiveDate: new Date().toISOString().split('T')[0],
    reviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    purpose: "",
    scope: "",
    responsibilities: "",
    materials: "",
    safety: "",
    steps: [{ id: "1", stepNumber: 1, description: "", responsibility: "", criticalPoint: false, notes: "" }],
    references: ""
  });

  const addStep = () => {
    const newStep: SOPStep = {
      id: (sop.steps.length + 1).toString(),
      stepNumber: sop.steps.length + 1,
      description: "",
      responsibility: "",
      criticalPoint: false,
      notes: ""
    };
    setSop(prev => ({ ...prev, steps: [...prev.steps, newStep] }));
  };

  const removeStep = (id: string) => {
    if (sop.steps.length > 1) {
      setSop(prev => ({
        ...prev,
        steps: prev.steps.filter(step => step.id !== id).map((step, index) => ({
          ...step,
          stepNumber: index + 1
        }))
      }));
    }
  };

  const updateStep = (id: string, field: keyof SOPStep, value: any) => {
    setSop(prev => ({
      ...prev,
      steps: prev.steps.map(step => 
        step.id === id ? { ...step, [field]: value } : step
      )
    }));
  };

  const updateSOP = (field: keyof SOPDocument, value: any) => {
    setSop(prev => ({ ...prev, [field]: value }));
  };

  const loadTemplate = () => {
    setSop({
      title: "Quality Control Inspection Process",
      version: "1.0",
      department: "Quality Assurance",
      approvedBy: "QA Manager",
      effectiveDate: new Date().toISOString().split('T')[0],
      reviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      purpose: "To ensure consistent quality control inspection procedures for incoming materials and finished products.",
      scope: "This procedure applies to all quality control inspections performed in the manufacturing facility.",
      responsibilities: "QC Inspector: Perform inspections according to this procedure\nQA Manager: Review and approve inspection results\nProduction Supervisor: Coordinate with QC for inspection scheduling",
      materials: "- Measuring instruments (calipers, micrometers)\n- Inspection checklist\n- Sample containers\n- Computer with QC software",
      safety: "- Wear appropriate PPE at all times\n- Follow lockout/tagout procedures\n- Report any safety hazards immediately",
      steps: [
        {
          id: "1",
          stepNumber: 1,
          description: "Receive inspection request and gather required documentation",
          responsibility: "QC Inspector",
          criticalPoint: true,
          notes: "Verify all required documents are present and complete"
        },
        {
          id: "2", 
          stepNumber: 2,
          description: "Set up inspection area and calibrate measuring instruments",
          responsibility: "QC Inspector",
          criticalPoint: true,
          notes: "Ensure all instruments are within calibration dates"
        },
        {
          id: "3",
          stepNumber: 3,
          description: "Perform visual inspection for obvious defects",
          responsibility: "QC Inspector",
          criticalPoint: false,
          notes: "Document any visual defects with photos if necessary"
        },
        {
          id: "4",
          stepNumber: 4,
          description: "Conduct dimensional measurements per specification",
          responsibility: "QC Inspector",
          criticalPoint: true,
          notes: "Follow sampling plan for number of parts to inspect"
        },
        {
          id: "5",
          stepNumber: 5,
          description: "Record results in QC software and complete inspection report",
          responsibility: "QC Inspector",
          criticalPoint: true,
          notes: "Ensure all required fields are completed"
        },
        {
          id: "6",
          stepNumber: 6,
          description: "Review results and make accept/reject decision",
          responsibility: "QA Manager",
          criticalPoint: true,
          notes: "Non-conforming items must be properly quarantined"
        }
      ],
      references: "- ISO 9001:2015 Quality Management Systems\n- Company Quality Manual QM-001\n- Inspection Procedure IP-005"
    });

    toast({
      title: "Template Loaded",
      description: "Sample SOP template has been loaded."
    });
  };

  const exportSOP = () => {
    const sopContent = `
STANDARD OPERATING PROCEDURE

Title: ${sop.title}
Version: ${sop.version}
Department: ${sop.department}
Approved By: ${sop.approvedBy}
Effective Date: ${sop.effectiveDate}
Review Date: ${sop.reviewDate}

1. PURPOSE
${sop.purpose}

2. SCOPE
${sop.scope}

3. RESPONSIBILITIES
${sop.responsibilities}

4. MATERIALS AND EQUIPMENT
${sop.materials}

5. SAFETY CONSIDERATIONS
${sop.safety}

6. PROCEDURE STEPS

${sop.steps.map(step => `
Step ${step.stepNumber}: ${step.description}
Responsibility: ${step.responsibility}
${step.criticalPoint ? '*** CRITICAL CONTROL POINT ***' : ''}
${step.notes ? `Notes: ${step.notes}` : ''}
`).join('\n')}

7. REFERENCES
${sop.references}

Document Control:
- This is a controlled document
- Unauthorized copies are not controlled
- For the latest version, refer to the document management system

Generated on: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([sopContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SOP-${sop.title.replace(/\s+/g, '-')}-v${sop.version}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "SOP Exported",
      description: "Standard Operating Procedure has been downloaded."
    });
  };

  const reset = () => {
    setSop({
      title: "",
      version: "1.0",
      department: "",
      approvedBy: "",
      effectiveDate: new Date().toISOString().split('T')[0],
      reviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      purpose: "",
      scope: "",
      responsibilities: "",
      materials: "",
      safety: "",
      steps: [{ id: "1", stepNumber: 1, description: "", responsibility: "", criticalPoint: false, notes: "" }],
      references: ""
    });
  };

  return (
    <Card className="card-professional">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            <CardTitle>Standard Operating Procedure (SOP) Template</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" onClick={loadTemplate}>
              Load Template
            </Button>
            <Button variant="analytics" onClick={exportSOP}>
              <Download className="h-4 w-4 mr-2" />
              Export SOP
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Header Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">SOP Title</Label>
            <Input
              id="title"
              value={sop.title}
              onChange={(e) => updateSOP('title', e.target.value)}
              placeholder="Enter SOP title"
            />
          </div>
          <div>
            <Label htmlFor="version">Version</Label>
            <Input
              id="version"
              value={sop.version}
              onChange={(e) => updateSOP('version', e.target.value)}
              placeholder="1.0"
            />
          </div>
          <div>
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={sop.department}
              onChange={(e) => updateSOP('department', e.target.value)}
              placeholder="Department name"
            />
          </div>
          <div>
            <Label htmlFor="approvedBy">Approved By</Label>
            <Input
              id="approvedBy"
              value={sop.approvedBy}
              onChange={(e) => updateSOP('approvedBy', e.target.value)}
              placeholder="Manager name"
            />
          </div>
          <div>
            <Label htmlFor="effectiveDate">Effective Date</Label>
            <Input
              id="effectiveDate"
              type="date"
              value={sop.effectiveDate}
              onChange={(e) => updateSOP('effectiveDate', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="reviewDate">Review Date</Label>
            <Input
              id="reviewDate"
              type="date"
              value={sop.reviewDate}
              onChange={(e) => updateSOP('reviewDate', e.target.value)}
            />
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="purpose">Purpose</Label>
            <Textarea
              id="purpose"
              value={sop.purpose}
              onChange={(e) => updateSOP('purpose', e.target.value)}
              placeholder="Describe the purpose of this procedure"
              rows={2}
            />
          </div>
          
          <div>
            <Label htmlFor="scope">Scope</Label>
            <Textarea
              id="scope"
              value={sop.scope}
              onChange={(e) => updateSOP('scope', e.target.value)}
              placeholder="Define the scope and applicability"
              rows={2}
            />
          </div>
          
          <div>
            <Label htmlFor="responsibilities">Responsibilities</Label>
            <Textarea
              id="responsibilities"
              value={sop.responsibilities}
              onChange={(e) => updateSOP('responsibilities', e.target.value)}
              placeholder="List roles and responsibilities"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="materials">Materials and Equipment</Label>
            <Textarea
              id="materials"
              value={sop.materials}
              onChange={(e) => updateSOP('materials', e.target.value)}
              placeholder="List required materials and equipment"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="safety">Safety Considerations</Label>
            <Textarea
              id="safety"
              value={sop.safety}
              onChange={(e) => updateSOP('safety', e.target.value)}
              placeholder="List safety requirements and precautions"
              rows={3}
            />
          </div>
        </div>

        {/* Procedure Steps */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-semibold">Procedure Steps</Label>
            <Button variant="outline" onClick={addStep}>
              <Plus className="h-4 w-4 mr-2" />
              Add Step
            </Button>
          </div>
          
          {sop.steps.map((step) => (
            <div key={step.id} className="p-4 border border-border rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-primary font-medium">Step {step.stepNumber}</Label>
                {sop.steps.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeStep(step.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div>
                <Label>Step Description</Label>
                <Textarea
                  value={step.description}
                  onChange={(e) => updateStep(step.id, 'description', e.target.value)}
                  placeholder="Describe what needs to be done in this step"
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Responsibility</Label>
                  <Input
                    value={step.responsibility}
                    onChange={(e) => updateStep(step.id, 'responsibility', e.target.value)}
                    placeholder="Who is responsible for this step"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`critical-${step.id}`}
                    checked={step.criticalPoint}
                    onChange={(e) => updateStep(step.id, 'criticalPoint', e.target.checked)}
                    className="rounded border-border"
                  />
                  <Label htmlFor={`critical-${step.id}`}>Critical Control Point</Label>
                </div>
              </div>
              
              <div>
                <Label>Notes/Additional Information</Label>
                <Textarea
                  value={step.notes}
                  onChange={(e) => updateStep(step.id, 'notes', e.target.value)}
                  placeholder="Additional notes, warnings, or details"
                  rows={2}
                />
              </div>
            </div>
          ))}
        </div>

        {/* References */}
        <div>
          <Label htmlFor="references">References</Label>
          <Textarea
            id="references"
            value={sop.references}
            onChange={(e) => updateSOP('references', e.target.value)}
            placeholder="List relevant standards, procedures, or documents"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}