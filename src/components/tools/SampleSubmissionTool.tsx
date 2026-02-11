import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Truck } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";
import { useToast } from "@/hooks/use-toast";

export function SampleSubmissionTool() {
  const { currentProject, updateToolData, getToolData } = useProject();
  const { toast } = useToast();
  const savedData = currentProject ? getToolData('sample-submission') : null;

  const [formData, setFormData] = useState({
    partNumber: savedData?.partNumber || '',
    partName: savedData?.partName || '',
    supplierName: savedData?.supplierName || '',
    supplierCode: savedData?.supplierCode || '',
    customerName: savedData?.customerName || '',
    submissionLevel: savedData?.submissionLevel || '3',
    submissionReason: savedData?.submissionReason || '',
    drawingNumber: savedData?.drawingNumber || '',
    drawingRevision: savedData?.drawingRevision || '',
    materialSpec: savedData?.materialSpec || '',
    weightActual: savedData?.weightActual || '',
    weightTarget: savedData?.weightTarget || '',
    checkingAid: savedData?.checkingAid || '',
    engineeringApproval: savedData?.engineeringApproval || '',
    dispositionStatus: savedData?.dispositionStatus || 'pending',
    customerSignature: savedData?.customerSignature || '',
    date: savedData?.date || new Date().toISOString().split('T')[0],
    comments: savedData?.comments || '',
  });

  const update = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }));

  const saveData = () => {
    if (currentProject) {
      updateToolData('sample-submission', formData);
      toast({ title: "Saved", description: "Part Submission Warrant saved" });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10"><Truck className="h-6 w-6 text-primary" /></div>
            <div>
              <CardTitle>Part Submission Warrant (PSW)</CardTitle>
              <CardDescription>PPAP sample submission documentation</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><Label>Part Number *</Label><Input value={formData.partNumber} onChange={e => update('partNumber', e.target.value)} placeholder="Part number" /></div>
            <div><Label>Part Name *</Label><Input value={formData.partName} onChange={e => update('partName', e.target.value)} placeholder="Part name" /></div>
            <div><Label>Drawing Number</Label><Input value={formData.drawingNumber} onChange={e => update('drawingNumber', e.target.value)} placeholder="Drawing #" /></div>
            <div><Label>Supplier Name</Label><Input value={formData.supplierName} onChange={e => update('supplierName', e.target.value)} placeholder="Supplier" /></div>
            <div><Label>Supplier Code</Label><Input value={formData.supplierCode} onChange={e => update('supplierCode', e.target.value)} placeholder="Code" /></div>
            <div><Label>Customer</Label><Input value={formData.customerName} onChange={e => update('customerName', e.target.value)} placeholder="Customer name" /></div>
            <div><Label>Drawing Revision</Label><Input value={formData.drawingRevision} onChange={e => update('drawingRevision', e.target.value)} placeholder="Rev level" /></div>
            <div><Label>Material Specification</Label><Input value={formData.materialSpec} onChange={e => update('materialSpec', e.target.value)} placeholder="Material spec" /></div>
            <div><Label>Submission Level</Label>
              <Select value={formData.submissionLevel} onValueChange={v => update('submissionLevel', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Level 1</SelectItem>
                  <SelectItem value="2">Level 2</SelectItem>
                  <SelectItem value="3">Level 3</SelectItem>
                  <SelectItem value="4">Level 4</SelectItem>
                  <SelectItem value="5">Level 5</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Weight (Actual)</Label><Input value={formData.weightActual} onChange={e => update('weightActual', e.target.value)} placeholder="kg" /></div>
            <div><Label>Weight (Target)</Label><Input value={formData.weightTarget} onChange={e => update('weightTarget', e.target.value)} placeholder="kg" /></div>
            <div><Label>Date</Label><Input type="date" value={formData.date} onChange={e => update('date', e.target.value)} /></div>
          </div>

          <div><Label>Submission Reason</Label><Textarea value={formData.submissionReason} onChange={e => update('submissionReason', e.target.value)} placeholder="Reason for submission (new part, engineering change, etc.)" rows={2} /></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Disposition Status</Label>
              <Select value={formData.dispositionStatus} onValueChange={v => update('dispositionStatus', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="interim-approval">Interim Approval</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Badge className={formData.dispositionStatus === 'approved' ? 'bg-green-500 text-white' : formData.dispositionStatus === 'rejected' ? 'bg-destructive text-destructive-foreground' : 'bg-yellow-500 text-black'}>
                {formData.dispositionStatus.toUpperCase()}
              </Badge>
            </div>
          </div>

          <div><Label>Comments</Label><Textarea value={formData.comments} onChange={e => update('comments', e.target.value)} placeholder="Additional comments" rows={3} /></div>

          <Button onClick={saveData}>Save PSW</Button>
        </CardContent>
      </Card>
    </div>
  );
}
