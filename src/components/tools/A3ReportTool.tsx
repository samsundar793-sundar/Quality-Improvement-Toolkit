import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FileText, Download, Printer } from 'lucide-react';

interface A3Data {
  title: string;
  owner: string;
  date: string;
  background: string;
  currentCondition: string;
  goal: string;
  rootCauseAnalysis: string;
  countermeasures: string;
  implementationPlan: string;
  followUp: string;
}

const A3ReportTool: React.FC = () => {
  const [data, setData] = useState<A3Data>({
    title: '',
    owner: '',
    date: '',
    background: '',
    currentCondition: '',
    goal: '',
    rootCauseAnalysis: '',
    countermeasures: '',
    implementationPlan: '',
    followUp: ''
  });

  const updateField = (field: keyof A3Data, value: string) => {
    setData({ ...data, [field]: value });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              A3 Problem Solving Report
            </div>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="print:text-sm">
            {/* Header Section */}
            <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-muted/30 rounded-lg">
              <div className="col-span-1">
                <Label>Report Title</Label>
                <Input
                  placeholder="Enter problem/project title"
                  value={data.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Owner</Label>
                <Input
                  placeholder="Report owner"
                  value={data.owner}
                  onChange={(e) => updateField('owner', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={data.date}
                  onChange={(e) => updateField('date', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            {/* A3 Grid Layout */}
            <div className="grid grid-cols-2 gap-4">
              {/* Left Side - Problem Definition */}
              <div className="space-y-4">
                <Card className="p-4">
                  <Label className="text-sm font-semibold mb-2 block">1. Background</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Why is this problem important? What is the business context?
                  </p>
                  <Textarea
                    placeholder="Describe the business context, importance, and scope of the problem..."
                    value={data.background}
                    onChange={(e) => updateField('background', e.target.value)}
                    className="min-h-[100px]"
                  />
                </Card>

                <Card className="p-4">
                  <Label className="text-sm font-semibold mb-2 block">2. Current Condition</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    What is the current state? Use data and facts.
                  </p>
                  <Textarea
                    placeholder="Describe the current situation with specific data, metrics, and observations..."
                    value={data.currentCondition}
                    onChange={(e) => updateField('currentCondition', e.target.value)}
                    className="min-h-[100px]"
                  />
                </Card>

                <Card className="p-4">
                  <Label className="text-sm font-semibold mb-2 block">3. Goal / Target Condition</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    What specific outcomes are we trying to achieve?
                  </p>
                  <Textarea
                    placeholder="Define measurable goals and the desired future state..."
                    value={data.goal}
                    onChange={(e) => updateField('goal', e.target.value)}
                    className="min-h-[100px]"
                  />
                </Card>

                <Card className="p-4">
                  <Label className="text-sm font-semibold mb-2 block">4. Root Cause Analysis</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    What are the underlying causes? (Use 5 Whys, Fishbone, etc.)
                  </p>
                  <Textarea
                    placeholder="Document the root cause analysis findings..."
                    value={data.rootCauseAnalysis}
                    onChange={(e) => updateField('rootCauseAnalysis', e.target.value)}
                    className="min-h-[100px]"
                  />
                </Card>
              </div>

              {/* Right Side - Solutions */}
              <div className="space-y-4">
                <Card className="p-4">
                  <Label className="text-sm font-semibold mb-2 block">5. Countermeasures</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    What actions will address the root causes?
                  </p>
                  <Textarea
                    placeholder="List proposed countermeasures with rationale..."
                    value={data.countermeasures}
                    onChange={(e) => updateField('countermeasures', e.target.value)}
                    className="min-h-[120px]"
                  />
                </Card>

                <Card className="p-4">
                  <Label className="text-sm font-semibold mb-2 block">6. Implementation Plan</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Who, what, when? Include milestones and responsibilities.
                  </p>
                  <Textarea
                    placeholder="Detail the implementation plan with actions, owners, and timelines..."
                    value={data.implementationPlan}
                    onChange={(e) => updateField('implementationPlan', e.target.value)}
                    className="min-h-[120px]"
                  />
                </Card>

                <Card className="p-4">
                  <Label className="text-sm font-semibold mb-2 block">7. Follow-Up / Results</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    How will we verify success? What were the results?
                  </p>
                  <Textarea
                    placeholder="Define success metrics, follow-up actions, and document results..."
                    value={data.followUp}
                    onChange={(e) => updateField('followUp', e.target.value)}
                    className="min-h-[120px]"
                  />
                </Card>
              </div>
            </div>

            {/* Progress Summary */}
            <Card className="mt-4 p-4 bg-muted/30">
              <div className="grid grid-cols-7 gap-2 text-center text-xs">
                {['Background', 'Current', 'Goal', 'Root Cause', 'Countermeasures', 'Plan', 'Follow-Up'].map((section, index) => {
                  const fields: (keyof A3Data)[] = ['background', 'currentCondition', 'goal', 'rootCauseAnalysis', 'countermeasures', 'implementationPlan', 'followUp'];
                  const isComplete = data[fields[index]].length > 20;
                  return (
                    <div key={section} className={`p-2 rounded ${isComplete ? 'bg-green-100 text-green-800' : 'bg-muted'}`}>
                      {section}
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default A3ReportTool;
