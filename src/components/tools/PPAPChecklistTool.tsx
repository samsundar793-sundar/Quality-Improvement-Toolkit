import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, FileCheck, AlertCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface PPAPElement {
  id: number;
  name: string;
  description: string;
  required: boolean;
  status: 'not-started' | 'in-progress' | 'complete' | 'na';
  notes: string;
  levels: number[];
}

const initialElements: PPAPElement[] = [
  { id: 1, name: 'Design Records', description: 'Customer engineering drawings, specifications, and CAD data', required: true, status: 'not-started', notes: '', levels: [1,2,3,4,5] },
  { id: 2, name: 'Engineering Change Documents', description: 'Authorized engineering changes not yet incorporated in design records', required: true, status: 'not-started', notes: '', levels: [1,2,3,4,5] },
  { id: 3, name: 'Customer Engineering Approval', description: 'Evidence of customer engineering approval where required', required: false, status: 'not-started', notes: '', levels: [1,2,3,4,5] },
  { id: 4, name: 'Design FMEA', description: 'DFMEA for design responsible suppliers', required: true, status: 'not-started', notes: '', levels: [2,3,4,5] },
  { id: 5, name: 'Process Flow Diagrams', description: 'Flow chart describing the production process', required: true, status: 'not-started', notes: '', levels: [2,3,4,5] },
  { id: 6, name: 'Process FMEA', description: 'PFMEA following customer requirements', required: true, status: 'not-started', notes: '', levels: [2,3,4,5] },
  { id: 7, name: 'Control Plan', description: 'Control plans describing all methods for process control', required: true, status: 'not-started', notes: '', levels: [2,3,4,5] },
  { id: 8, name: 'Measurement System Analysis', description: 'MSA studies for all measurement equipment', required: true, status: 'not-started', notes: '', levels: [2,3,4,5] },
  { id: 9, name: 'Dimensional Results', description: 'Dimensional verification of design records', required: true, status: 'not-started', notes: '', levels: [2,3,4,5] },
  { id: 10, name: 'Material/Performance Test Results', description: 'Results from material and performance testing', required: true, status: 'not-started', notes: '', levels: [2,3,4,5] },
  { id: 11, name: 'Initial Process Study', description: 'SPC data demonstrating process capability', required: true, status: 'not-started', notes: '', levels: [2,3,4,5] },
  { id: 12, name: 'Qualified Laboratory Documentation', description: 'Lab scope and accreditation documentation', required: true, status: 'not-started', notes: '', levels: [2,3,4,5] },
  { id: 13, name: 'Appearance Approval Report', description: 'AAR for parts with appearance requirements', required: false, status: 'not-started', notes: '', levels: [1,2,3,4,5] },
  { id: 14, name: 'Sample Production Parts', description: 'Sample parts from production run', required: true, status: 'not-started', notes: '', levels: [2,3,4,5] },
  { id: 15, name: 'Master Sample', description: 'Retained master sample for comparison', required: true, status: 'not-started', notes: '', levels: [2,3,4,5] },
  { id: 16, name: 'Checking Aids', description: 'Part-specific checking fixtures and gauges', required: true, status: 'not-started', notes: '', levels: [3,4,5] },
  { id: 17, name: 'Customer-Specific Requirements', description: 'Documentation of customer-specific requirements', required: true, status: 'not-started', notes: '', levels: [1,2,3,4,5] },
  { id: 18, name: 'Part Submission Warrant (PSW)', description: 'Summary document for PPAP submission', required: true, status: 'not-started', notes: '', levels: [1,2,3,4,5] }
];

const PPAPChecklistTool: React.FC = () => {
  const [elements, setElements] = useState<PPAPElement[]>(initialElements);
  const [submissionLevel, setSubmissionLevel] = useState<string>('3');
  const [partNumber, setPartNumber] = useState('');
  const [partName, setPartName] = useState('');
  const [customer, setCustomer] = useState('');
  const [submissionDate, setSubmissionDate] = useState('');

  const updateElementStatus = (id: number, status: PPAPElement['status']) => {
    setElements(elements.map(el => el.id === id ? { ...el, status } : el));
  };

  const updateElementNotes = (id: number, notes: string) => {
    setElements(elements.map(el => el.id === id ? { ...el, notes } : el));
  };

  const applicableElements = elements.filter(el => el.levels.includes(parseInt(submissionLevel)));
  const completedCount = applicableElements.filter(el => el.status === 'complete' || el.status === 'na').length;
  const progressPercent = (completedCount / applicableElements.length) * 100;

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'not-started': 'bg-muted text-muted-foreground',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      'complete': 'bg-green-100 text-green-800',
      'na': 'bg-gray-100 text-gray-600'
    };
    const labels: Record<string, string> = {
      'not-started': 'Not Started',
      'in-progress': 'In Progress',
      'complete': 'Complete',
      'na': 'N/A'
    };
    return <Badge className={styles[status]}>{labels[status]}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            PPAP Submission Checklist
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Track all 18 PPAP elements required for part approval based on submission level.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg bg-muted/30">
            <div>
              <Label>Submission Level</Label>
              <Select value={submissionLevel} onValueChange={setSubmissionLevel}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Level 1 - PSW Only</SelectItem>
                  <SelectItem value="2">Level 2 - PSW + Samples</SelectItem>
                  <SelectItem value="3">Level 3 - PSW + Full Support</SelectItem>
                  <SelectItem value="4">Level 4 - Customer Defined</SelectItem>
                  <SelectItem value="5">Level 5 - Full Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Part Number</Label>
              <Input
                placeholder="Enter part number"
                value={partNumber}
                onChange={(e) => setPartNumber(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Part Name</Label>
              <Input
                placeholder="Enter part name"
                value={partName}
                onChange={(e) => setPartName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Customer</Label>
              <Input
                placeholder="Customer name"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Target Date</Label>
              <Input
                type="date"
                value={submissionDate}
                onChange={(e) => setSubmissionDate(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Completion Progress</span>
              <span className="text-sm text-muted-foreground">
                {completedCount} of {applicableElements.length} elements
              </span>
            </div>
            <Progress value={progressPercent} className="h-3" />
          </Card>

          <Accordion type="multiple" className="w-full">
            {applicableElements.map((element) => (
              <AccordionItem key={element.id} value={element.id.toString()}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 w-full pr-4">
                    <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                      {element.id.toString().padStart(2, '0')}
                    </span>
                    <span className="flex-1 text-left">{element.name}</span>
                    {element.required && (
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                    )}
                    {getStatusBadge(element.status)}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2">
                  <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">{element.description}</p>
                    
                    <div className="flex items-center gap-4">
                      <Label className="text-sm">Status:</Label>
                      <Select
                        value={element.status}
                        onValueChange={(value: PPAPElement['status']) => 
                          updateElementStatus(element.id, value)}
                      >
                        <SelectTrigger className="w-[150px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not-started">Not Started</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="complete">Complete</SelectItem>
                          <SelectItem value="na">N/A</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm">Notes</Label>
                      <Textarea
                        placeholder="Add notes, document references, or issues..."
                        value={element.notes}
                        onChange={(e) => updateElementNotes(element.id, e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="grid grid-cols-4 gap-4">
            <Card className="p-3 text-center">
              <div className="text-2xl font-bold">{applicableElements.length}</div>
              <div className="text-xs text-muted-foreground">Required Elements</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-2xl font-bold text-green-600">
                {applicableElements.filter(e => e.status === 'complete').length}
              </div>
              <div className="text-xs text-muted-foreground">Complete</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {applicableElements.filter(e => e.status === 'in-progress').length}
              </div>
              <div className="text-xs text-muted-foreground">In Progress</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-2xl font-bold text-muted-foreground">
                {applicableElements.filter(e => e.status === 'not-started').length}
              </div>
              <div className="text-xs text-muted-foreground">Not Started</div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PPAPChecklistTool;
