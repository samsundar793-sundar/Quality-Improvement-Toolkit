import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Target, CheckCircle2, AlertTriangle } from 'lucide-react';

interface APQPDeliverable {
  id: string;
  name: string;
  completed: boolean;
  notes: string;
  dueDate: string;
  owner: string;
}

interface APQPPhase {
  id: number;
  name: string;
  description: string;
  deliverables: APQPDeliverable[];
}

const initialPhases: APQPPhase[] = [
  {
    id: 1,
    name: 'Plan & Define',
    description: 'Define customer needs and product requirements',
    deliverables: [
      { id: '1-1', name: 'Voice of Customer', completed: false, notes: '', dueDate: '', owner: '' },
      { id: '1-2', name: 'Business Plan/Marketing Strategy', completed: false, notes: '', dueDate: '', owner: '' },
      { id: '1-3', name: 'Product/Process Benchmark Data', completed: false, notes: '', dueDate: '', owner: '' },
      { id: '1-4', name: 'Product/Process Assumptions', completed: false, notes: '', dueDate: '', owner: '' },
      { id: '1-5', name: 'Product Reliability Studies', completed: false, notes: '', dueDate: '', owner: '' },
      { id: '1-6', name: 'Customer Inputs', completed: false, notes: '', dueDate: '', owner: '' },
      { id: '1-7', name: 'Design Goals', completed: false, notes: '', dueDate: '', owner: '' },
      { id: '1-8', name: 'Reliability & Quality Goals', completed: false, notes: '', dueDate: '', owner: '' },
      { id: '1-9', name: 'Preliminary BOM', completed: false, notes: '', dueDate: '', owner: '' },
      { id: '1-10', name: 'Preliminary Process Flow', completed: false, notes: '', dueDate: '', owner: '' },
      { id: '1-11', name: 'Product Assurance Plan', completed: false, notes: '', dueDate: '', owner: '' },
      { id: '1-12', name: 'Management Support', completed: false, notes: '', dueDate: '', owner: '' }
    ]
  },
  {
    id: 2,
    name: 'Product Design',
    description: 'Develop product design features and specifications',
    deliverables: [
      { id: '2-1', name: 'Design FMEA', completed: false, notes: '', dueDate: '', owner: '' },
      { id: '2-2', name: 'Design for Manufacturability', completed: false, notes: '', dueDate: '', owner: '' },
      { id: '2-3', name: 'Design Verification', completed: false, notes: '', dueDate: '', owner: '' },
      { id: '2-4', name: 'Design Reviews', completed: false, notes: '', dueDate: '', owner: '' },
      { id: '2-5', name: 'Prototype Build', completed: false, notes: '', dueDate: '', owner: '' },
      { id: '2-6', name: 'Engineering Drawings', completed: false, notes: '', dueDate: '', owner: '' },
      { id: '2-7', name: 'Engineering Specifications', completed: false, notes: '', dueDate: '', owner: '' },
      { id: '2-8', name: 'Material Specifications', completed: false, notes: '', dueDate: '', owner: '' },
      { id: '2-9', name: 'Drawing & Spec Changes', completed: false, notes: '', dueDate: '', owner: '' },
      { id: '2-10', name: 'Special Characteristics', completed: false, notes: '', dueDate: '', owner: '' }
    ]
  },
  {
    id: 3,
    name: 'Process Design',
    description: 'Develop manufacturing process systems',
    deliverables: [
      { id: '3-1', name: 'Process Flow Diagram', completed: false, notes: '', dueDate: '', owner: '' },
      { id: '3-2', name: 'Floor Plan Layout', completed: false, notes: '', dueDate: '', owner: '' },
      { id: '3-3', name: 'Characteristics Matrix', completed: false, notes: '', dueDate: '', owner: '' },
      { id: '3-4', name: 'Process FMEA', completed: false, notes: '', dueDate: '', owner: '' },
      { id: '3-5', name: 'Pre-Launch Control Plan', completed: false, notes: '', dueDate: '', owner: '' },
      { id: '3-6', name: 'Process Instructions', completed: false, notes: '', dueDate: '', owner: '' },
      { id: '3-7', name: 'MSA Plan', completed: false, notes: '', dueDate: '', owner: '' },
      { id: '3-8', name: 'Preliminary Capability Plan', completed: false, notes: '', dueDate: '', owner: '' },
      { id: '3-9', name: 'Packaging Specifications', completed: false, notes: '', dueDate: '', owner: '' },
      { id: '3-10', name: 'Management Support', completed: false, notes: '', dueDate: '', owner: '' }
    ]
  },
  {
    id: 4,
    name: 'Product & Process Validation',
    description: 'Validate manufacturing process through trial runs',
    deliverables: [
      { id: '4-1', name: 'Production Trial Run', completed: false, notes: '', dueDate: '', owner: '' },
      { id: '4-2', name: 'MSA Studies', completed: false, notes: '', dueDate: '', owner: '' },
      { id: '4-3', name: 'Preliminary Capability Studies', completed: false, notes: '', dueDate: '', owner: '' },
      { id: '4-4', name: 'Production Part Approval', completed: false, notes: '', dueDate: '', owner: '' },
      { id: '4-5', name: 'Production Validation Testing', completed: false, notes: '', dueDate: '', owner: '' },
      { id: '4-6', name: 'Packaging Evaluation', completed: false, notes: '', dueDate: '', owner: '' },
      { id: '4-7', name: 'Production Control Plan', completed: false, notes: '', dueDate: '', owner: '' },
      { id: '4-8', name: 'Quality Planning Sign-Off', completed: false, notes: '', dueDate: '', owner: '' },
      { id: '4-9', name: 'Management Support', completed: false, notes: '', dueDate: '', owner: '' }
    ]
  },
  {
    id: 5,
    name: 'Feedback & Corrective Action',
    description: 'Evaluate and improve the process',
    deliverables: [
      { id: '5-1', name: 'Reduced Variation', completed: false, notes: '', dueDate: '', owner: '' },
      { id: '5-2', name: 'Customer Satisfaction', completed: false, notes: '', dueDate: '', owner: '' },
      { id: '5-3', name: 'Delivery & Service', completed: false, notes: '', dueDate: '', owner: '' },
      { id: '5-4', name: 'Lessons Learned', completed: false, notes: '', dueDate: '', owner: '' },
      { id: '5-5', name: 'Best Practices', completed: false, notes: '', dueDate: '', owner: '' }
    ]
  }
];

const APQPPhaseTool: React.FC = () => {
  const [phases, setPhases] = useState<APQPPhase[]>(initialPhases);
  const [activePhase, setActivePhase] = useState('1');

  const toggleDeliverable = (phaseId: number, deliverableId: string) => {
    setPhases(phases.map(phase => {
      if (phase.id === phaseId) {
        return {
          ...phase,
          deliverables: phase.deliverables.map(d =>
            d.id === deliverableId ? { ...d, completed: !d.completed } : d
          )
        };
      }
      return phase;
    }));
  };

  const updateDeliverable = (phaseId: number, deliverableId: string, updates: Partial<APQPDeliverable>) => {
    setPhases(phases.map(phase => {
      if (phase.id === phaseId) {
        return {
          ...phase,
          deliverables: phase.deliverables.map(d =>
            d.id === deliverableId ? { ...d, ...updates } : d
          )
        };
      }
      return phase;
    }));
  };

  const getPhaseProgress = (phase: APQPPhase) => {
    const completed = phase.deliverables.filter(d => d.completed).length;
    return (completed / phase.deliverables.length) * 100;
  };

  const overallProgress = phases.reduce((acc, phase) => {
    const completed = phase.deliverables.filter(d => d.completed).length;
    return acc + completed;
  }, 0);
  const totalDeliverables = phases.reduce((acc, phase) => acc + phase.deliverables.length, 0);
  const overallProgressPercent = (overallProgress / totalDeliverables) * 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            APQP Phase Tracker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Track deliverables across all five APQP phases to ensure successful product launch.
          </p>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Overall APQP Progress</span>
              <span className="text-sm text-muted-foreground">
                {overallProgress} of {totalDeliverables} deliverables
              </span>
            </div>
            <Progress value={overallProgressPercent} className="h-3" />
          </Card>

          <div className="grid grid-cols-5 gap-2">
            {phases.map((phase) => {
              const progress = getPhaseProgress(phase);
              return (
                <Card
                  key={phase.id}
                  className={`p-3 cursor-pointer transition-all ${
                    activePhase === phase.id.toString() ? 'ring-2 ring-primary' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setActivePhase(phase.id.toString())}
                >
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">Phase {phase.id}</div>
                    <div className="text-sm font-medium truncate">{phase.name}</div>
                    <Progress value={progress} className="h-1 mt-2" />
                    <div className="text-xs text-muted-foreground mt-1">{progress.toFixed(0)}%</div>
                  </div>
                </Card>
              );
            })}
          </div>

          <Tabs value={activePhase} onValueChange={setActivePhase}>
            <TabsList className="grid w-full grid-cols-5">
              {phases.map((phase) => (
                <TabsTrigger key={phase.id} value={phase.id.toString()}>
                  Phase {phase.id}
                </TabsTrigger>
              ))}
            </TabsList>

            {phases.map((phase) => (
              <TabsContent key={phase.id} value={phase.id.toString()}>
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium">{phase.name}</h3>
                      <p className="text-sm text-muted-foreground">{phase.description}</p>
                    </div>
                    <Badge variant={getPhaseProgress(phase) === 100 ? 'default' : 'secondary'}>
                      {getPhaseProgress(phase).toFixed(0)}% Complete
                    </Badge>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40px]">✓</TableHead>
                        <TableHead>Deliverable</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {phase.deliverables.map((deliverable) => (
                        <TableRow key={deliverable.id}>
                          <TableCell>
                            <Checkbox
                              checked={deliverable.completed}
                              onCheckedChange={() => toggleDeliverable(phase.id, deliverable.id)}
                            />
                          </TableCell>
                          <TableCell className={deliverable.completed ? 'line-through text-muted-foreground' : ''}>
                            {deliverable.name}
                          </TableCell>
                          <TableCell>
                            <Input
                              placeholder="Owner"
                              value={deliverable.owner}
                              onChange={(e) => updateDeliverable(phase.id, deliverable.id, { owner: e.target.value })}
                              className="w-[100px]"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="date"
                              value={deliverable.dueDate}
                              onChange={(e) => updateDeliverable(phase.id, deliverable.id, { dueDate: e.target.value })}
                              className="w-[130px]"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              placeholder="Notes"
                              value={deliverable.notes}
                              onChange={(e) => updateDeliverable(phase.id, deliverable.id, { notes: e.target.value })}
                              className="w-[150px]"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default APQPPhaseTool;
