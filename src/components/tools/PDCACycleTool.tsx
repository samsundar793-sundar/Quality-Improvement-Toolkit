import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, RotateCcw, Target, Play, CheckCircle, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface PDCAItem {
  id: string;
  description: string;
  owner: string;
  dueDate: string;
  completed: boolean;
  notes: string;
}

interface PDCACycle {
  cycleNumber: number;
  plan: {
    problem: string;
    objective: string;
    hypothesis: string;
    items: PDCAItem[];
  };
  do: {
    implementation: string;
    items: PDCAItem[];
  };
  check: {
    results: string;
    metricsComparison: string;
    items: PDCAItem[];
  };
  act: {
    decision: 'standardize' | 'iterate' | 'abandon' | '';
    nextSteps: string;
    items: PDCAItem[];
  };
}

const createEmptyCycle = (num: number): PDCACycle => ({
  cycleNumber: num,
  plan: { problem: '', objective: '', hypothesis: '', items: [] },
  do: { implementation: '', items: [] },
  check: { results: '', metricsComparison: '', items: [] },
  act: { decision: '', nextSteps: '', items: [] }
});

const PDCACycleTool: React.FC = () => {
  const [cycles, setCycles] = useState<PDCACycle[]>([createEmptyCycle(1)]);
  const [activeCycle, setActiveCycle] = useState(0);
  const [activePhase, setActivePhase] = useState('plan');

  const addCycle = () => {
    setCycles([...cycles, createEmptyCycle(cycles.length + 1)]);
    setActiveCycle(cycles.length);
  };

  const updateCycleField = (cycleIndex: number, phase: string, field: string, value: any) => {
    setCycles(cycles.map((cycle, i) => {
      if (i === cycleIndex) {
        return {
          ...cycle,
          [phase]: {
            ...(cycle[phase as keyof PDCACycle] as object),
            [field]: value
          }
        };
      }
      return cycle;
    }));
  };

  const addItem = (phase: 'plan' | 'do' | 'check' | 'act') => {
    const cycle = cycles[activeCycle];
    const newItem: PDCAItem = {
      id: Date.now().toString(),
      description: '',
      owner: '',
      dueDate: '',
      completed: false,
      notes: ''
    };
    updateCycleField(activeCycle, phase, 'items', [...cycle[phase].items, newItem]);
  };

  const updateItem = (phase: 'plan' | 'do' | 'check' | 'act', itemId: string, updates: Partial<PDCAItem>) => {
    const cycle = cycles[activeCycle];
    const updatedItems = cycle[phase].items.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    );
    updateCycleField(activeCycle, phase, 'items', updatedItems);
  };

  const removeItem = (phase: 'plan' | 'do' | 'check' | 'act', itemId: string) => {
    const cycle = cycles[activeCycle];
    updateCycleField(activeCycle, phase, 'items', cycle[phase].items.filter(i => i.id !== itemId));
  };

  const currentCycle = cycles[activeCycle];

  const phaseIcons = {
    plan: <Target className="h-4 w-4" />,
    do: <Play className="h-4 w-4" />,
    check: <CheckCircle className="h-4 w-4" />,
    act: <TrendingUp className="h-4 w-4" />
  };

  const ItemsTable = ({ phase }: { phase: 'plan' | 'do' | 'check' | 'act' }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label className="text-sm">Action Items</Label>
        <Button variant="outline" size="sm" onClick={() => addItem(phase)}>
          <Plus className="h-3 w-3 mr-1" /> Add Item
        </Button>
      </div>
      {currentCycle[phase].items.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8">✓</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Due</TableHead>
              <TableHead className="w-8"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentCycle[phase].items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={(checked) => updateItem(phase, item.id, { completed: !!checked })}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    placeholder="Action description"
                    value={item.description}
                    onChange={(e) => updateItem(phase, item.id, { description: e.target.value })}
                    className="w-full"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    placeholder="Owner"
                    value={item.owner}
                    onChange={(e) => updateItem(phase, item.id, { owner: e.target.value })}
                    className="w-[100px]"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="date"
                    value={item.dueDate}
                    onChange={(e) => updateItem(phase, item.id, { dueDate: e.target.value })}
                    className="w-[120px]"
                  />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => removeItem(phase, item.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5" />
              PDCA Cycle Tracker
            </div>
            <Button variant="outline" size="sm" onClick={addCycle}>
              <Plus className="h-4 w-4 mr-2" />
              New Cycle
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Plan-Do-Check-Act cycles for continuous improvement initiatives.
          </p>

          {/* Cycle Selector */}
          <div className="flex gap-2 flex-wrap">
            {cycles.map((cycle, index) => (
              <Button
                key={index}
                variant={activeCycle === index ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCycle(index)}
              >
                Cycle {cycle.cycleNumber}
              </Button>
            ))}
          </div>

          {/* PDCA Visual */}
          <div className="grid grid-cols-4 gap-2">
            {(['plan', 'do', 'check', 'act'] as const).map((phase) => {
              const items = currentCycle[phase].items;
              const completed = items.filter(i => i.completed).length;
              const colors = {
                plan: 'bg-blue-100 border-blue-300',
                do: 'bg-green-100 border-green-300',
                check: 'bg-yellow-100 border-yellow-300',
                act: 'bg-purple-100 border-purple-300'
              };
              return (
                <Card
                  key={phase}
                  className={`p-3 cursor-pointer transition-all border-2 ${colors[phase]} ${
                    activePhase === phase ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setActivePhase(phase)}
                >
                  <div className="flex items-center justify-between mb-1">
                    {phaseIcons[phase]}
                    <Badge variant="outline" className="text-xs">
                      {completed}/{items.length}
                    </Badge>
                  </div>
                  <div className="font-medium uppercase text-sm">{phase}</div>
                </Card>
              );
            })}
          </div>

          <Tabs value={activePhase} onValueChange={setActivePhase}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="plan" className="gap-1">
                {phaseIcons.plan} Plan
              </TabsTrigger>
              <TabsTrigger value="do" className="gap-1">
                {phaseIcons.do} Do
              </TabsTrigger>
              <TabsTrigger value="check" className="gap-1">
                {phaseIcons.check} Check
              </TabsTrigger>
              <TabsTrigger value="act" className="gap-1">
                {phaseIcons.act} Act
              </TabsTrigger>
            </TabsList>

            <TabsContent value="plan" className="space-y-4">
              <Card className="p-4">
                <div className="space-y-4">
                  <div>
                    <Label>Problem Statement</Label>
                    <Textarea
                      placeholder="What problem are we trying to solve?"
                      value={currentCycle.plan.problem}
                      onChange={(e) => updateCycleField(activeCycle, 'plan', 'problem', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Objective</Label>
                    <Textarea
                      placeholder="What is the measurable goal?"
                      value={currentCycle.plan.objective}
                      onChange={(e) => updateCycleField(activeCycle, 'plan', 'objective', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Hypothesis</Label>
                    <Textarea
                      placeholder="What do we believe will happen if we make this change?"
                      value={currentCycle.plan.hypothesis}
                      onChange={(e) => updateCycleField(activeCycle, 'plan', 'hypothesis', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <ItemsTable phase="plan" />
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="do" className="space-y-4">
              <Card className="p-4">
                <div className="space-y-4">
                  <div>
                    <Label>Implementation Notes</Label>
                    <Textarea
                      placeholder="Document the execution of the plan, any deviations, observations..."
                      value={currentCycle.do.implementation}
                      onChange={(e) => updateCycleField(activeCycle, 'do', 'implementation', e.target.value)}
                      className="mt-1 min-h-[100px]"
                    />
                  </div>
                  <ItemsTable phase="do" />
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="check" className="space-y-4">
              <Card className="p-4">
                <div className="space-y-4">
                  <div>
                    <Label>Results Analysis</Label>
                    <Textarea
                      placeholder="What happened? Analyze the data collected..."
                      value={currentCycle.check.results}
                      onChange={(e) => updateCycleField(activeCycle, 'check', 'results', e.target.value)}
                      className="mt-1 min-h-[100px]"
                    />
                  </div>
                  <div>
                    <Label>Metrics Comparison (Before vs After)</Label>
                    <Textarea
                      placeholder="Compare baseline metrics to post-implementation metrics..."
                      value={currentCycle.check.metricsComparison}
                      onChange={(e) => updateCycleField(activeCycle, 'check', 'metricsComparison', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <ItemsTable phase="check" />
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="act" className="space-y-4">
              <Card className="p-4">
                <div className="space-y-4">
                  <div>
                    <Label>Decision</Label>
                    <div className="flex gap-2 mt-1">
                      {['standardize', 'iterate', 'abandon'].map((decision) => (
                        <Button
                          key={decision}
                          variant={currentCycle.act.decision === decision ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateCycleField(activeCycle, 'act', 'decision', decision)}
                        >
                          {decision.charAt(0).toUpperCase() + decision.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Next Steps</Label>
                    <Textarea
                      placeholder="Based on the results, what should we do next?"
                      value={currentCycle.act.nextSteps}
                      onChange={(e) => updateCycleField(activeCycle, 'act', 'nextSteps', e.target.value)}
                      className="mt-1 min-h-[100px]"
                    />
                  </div>
                  <ItemsTable phase="act" />
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PDCACycleTool;
