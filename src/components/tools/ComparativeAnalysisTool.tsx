import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, Plus, Trash2, TrendingUp, TrendingDown, Minus, Download } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";
import { useToast } from "@/hooks/use-toast";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from "recharts";

interface ComparisonMetric {
  id: string;
  metric: string;
  unit: string;
  beforeValue: number;
  afterValue: number;
  target: number;
  changePercent: number;
  status: 'improved' | 'worsened' | 'unchanged' | 'target-met';
  notes: string;
}

export function ComparativeAnalysisTool() {
  const { currentProject, updateToolData, getToolData } = useProject();
  const { toast } = useToast();

  const savedData = currentProject ? getToolData('comparative-analysis') : null;
  
  const [analysisInfo, setAnalysisInfo] = useState({
    projectName: savedData?.analysisInfo?.projectName || '',
    beforePeriod: savedData?.analysisInfo?.beforePeriod || '',
    afterPeriod: savedData?.analysisInfo?.afterPeriod || '',
    analysisDate: savedData?.analysisInfo?.analysisDate || new Date().toISOString().split('T')[0],
    summary: savedData?.analysisInfo?.summary || ''
  });

  const [metrics, setMetrics] = useState<ComparisonMetric[]>(savedData?.metrics || []);
  
  const [newMetric, setNewMetric] = useState({
    metric: '',
    unit: '',
    beforeValue: 0,
    afterValue: 0,
    target: 0,
    notes: ''
  });

  const calculateChange = (before: number, after: number): { percent: number; status: ComparisonMetric['status'] } => {
    if (before === 0) return { percent: 0, status: 'unchanged' };
    const percent = ((after - before) / before) * 100;
    
    let status: ComparisonMetric['status'] = 'unchanged';
    if (Math.abs(percent) < 1) {
      status = 'unchanged';
    } else if (percent < 0) {
      // Decrease - usually improvement for defects, costs, time
      status = 'improved';
    } else {
      status = 'worsened';
    }
    
    return { percent: Math.round(percent * 10) / 10, status };
  };

  const addMetric = () => {
    if (!newMetric.metric) {
      toast({ title: "Error", description: "Metric name is required", variant: "destructive" });
      return;
    }

    const { percent, status } = calculateChange(newMetric.beforeValue, newMetric.afterValue);
    const targetMet = newMetric.target > 0 && 
      ((newMetric.beforeValue > newMetric.target && newMetric.afterValue <= newMetric.target) ||
       (newMetric.beforeValue < newMetric.target && newMetric.afterValue >= newMetric.target));

    const metric: ComparisonMetric = {
      ...newMetric,
      id: Date.now().toString(),
      changePercent: percent,
      status: targetMet ? 'target-met' : status
    };

    const updated = [...metrics, metric];
    setMetrics(updated);
    setNewMetric({ metric: '', unit: '', beforeValue: 0, afterValue: 0, target: 0, notes: '' });
    saveData(updated);
  };

  const removeMetric = (id: string) => {
    const updated = metrics.filter(m => m.id !== id);
    setMetrics(updated);
    saveData(updated);
  };

  const saveData = (metricsList?: ComparisonMetric[]) => {
    if (currentProject) {
      updateToolData('comparative-analysis', {
        analysisInfo,
        metrics: metricsList || metrics
      });
      toast({ title: "Saved", description: "Comparative analysis saved successfully" });
    }
  };

  const exportToCSV = () => {
    const headers = ['Metric', 'Unit', 'Before', 'After', 'Change %', 'Target', 'Status', 'Notes'];
    const rows = metrics.map(m => [
      m.metric, m.unit, m.beforeValue, m.afterValue, m.changePercent, m.target, m.status, m.notes
    ]);
    
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'comparative-analysis.csv';
    a.click();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'improved': return <TrendingDown className="h-4 w-4 text-green-500" />;
      case 'worsened': return <TrendingUp className="h-4 w-4 text-destructive" />;
      case 'target-met': return <TrendingDown className="h-4 w-4 text-blue-500" />;
      default: return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'improved': return 'bg-green-500 text-white';
      case 'worsened': return 'bg-destructive text-destructive-foreground';
      case 'target-met': return 'bg-blue-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const chartData = metrics.map(m => ({
    name: m.metric.length > 15 ? m.metric.substring(0, 15) + '...' : m.metric,
    Before: m.beforeValue,
    After: m.afterValue,
    Target: m.target || null
  }));

  const improvedCount = metrics.filter(m => m.status === 'improved' || m.status === 'target-met').length;
  const avgImprovement = metrics.length > 0
    ? Math.round(metrics.reduce((sum, m) => sum + (m.status === 'improved' ? Math.abs(m.changePercent) : 0), 0) / metrics.length)
    : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <ArrowRightLeft className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Comparative Analysis</CardTitle>
              <CardDescription>Compare before and after states to measure improvement</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Analysis Info */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Project/Initiative Name</Label>
              <Input
                value={analysisInfo.projectName}
                onChange={(e) => setAnalysisInfo({ ...analysisInfo, projectName: e.target.value })}
                placeholder="Project name"
              />
            </div>
            <div>
              <Label>Before Period</Label>
              <Input
                value={analysisInfo.beforePeriod}
                onChange={(e) => setAnalysisInfo({ ...analysisInfo, beforePeriod: e.target.value })}
                placeholder="e.g., Q1 2024"
              />
            </div>
            <div>
              <Label>After Period</Label>
              <Input
                value={analysisInfo.afterPeriod}
                onChange={(e) => setAnalysisInfo({ ...analysisInfo, afterPeriod: e.target.value })}
                placeholder="e.g., Q2 2024"
              />
            </div>
            <div>
              <Label>Analysis Date</Label>
              <Input
                type="date"
                value={analysisInfo.analysisDate}
                onChange={(e) => setAnalysisInfo({ ...analysisInfo, analysisDate: e.target.value })}
              />
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">{metrics.length}</div>
                <p className="text-sm text-muted-foreground">Metrics Tracked</p>
              </CardContent>
            </Card>
            <Card className="bg-green-500/10">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-green-600">{improvedCount}</div>
                <p className="text-sm text-muted-foreground">Improved</p>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">{avgImprovement}%</div>
                <p className="text-sm text-muted-foreground">Avg Improvement</p>
              </CardContent>
            </Card>
            <Card className="bg-blue-500/10">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-blue-600">
                  {metrics.filter(m => m.status === 'target-met').length}
                </div>
                <p className="text-sm text-muted-foreground">Targets Met</p>
              </CardContent>
            </Card>
          </div>

          {/* Comparison Chart */}
          {metrics.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Before vs After Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45} 
                        textAnchor="end" 
                        height={80}
                        interval={0}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Before" fill="hsl(var(--muted-foreground))" />
                      <Bar dataKey="After" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Add Metric */}
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Comparison Metric
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="md:col-span-2">
                  <Label>Metric Name *</Label>
                  <Input
                    value={newMetric.metric}
                    onChange={(e) => setNewMetric({ ...newMetric, metric: e.target.value })}
                    placeholder="e.g., Defect Rate, Cycle Time"
                  />
                </div>
                <div>
                  <Label>Unit</Label>
                  <Input
                    value={newMetric.unit}
                    onChange={(e) => setNewMetric({ ...newMetric, unit: e.target.value })}
                    placeholder="%, min, $"
                  />
                </div>
                <div>
                  <Label>Before Value</Label>
                  <Input
                    type="number"
                    value={newMetric.beforeValue}
                    onChange={(e) => setNewMetric({ ...newMetric, beforeValue: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label>After Value</Label>
                  <Input
                    type="number"
                    value={newMetric.afterValue}
                    onChange={(e) => setNewMetric({ ...newMetric, afterValue: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label>Target</Label>
                  <Input
                    type="number"
                    value={newMetric.target}
                    onChange={(e) => setNewMetric({ ...newMetric, target: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label>Notes</Label>
                  <Input
                    value={newMetric.notes}
                    onChange={(e) => setNewMetric({ ...newMetric, notes: e.target.value })}
                    placeholder="Additional context"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addMetric}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Metric
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metrics Table */}
          {metrics.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Comparison Results</CardTitle>
                <Button variant="outline" size="sm" onClick={exportToCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead className="text-right">Before</TableHead>
                      <TableHead className="text-right">After</TableHead>
                      <TableHead className="text-right">Change</TableHead>
                      <TableHead className="text-right">Target</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {metrics.map((metric) => (
                      <TableRow key={metric.id}>
                        <TableCell className="font-medium">{metric.metric}</TableCell>
                        <TableCell>{metric.unit}</TableCell>
                        <TableCell className="text-right">{metric.beforeValue}</TableCell>
                        <TableCell className="text-right">{metric.afterValue}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {getStatusIcon(metric.status)}
                            <span className={metric.changePercent < 0 ? 'text-green-600' : metric.changePercent > 0 ? 'text-destructive' : ''}>
                              {metric.changePercent > 0 ? '+' : ''}{metric.changePercent}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{metric.target || '-'}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(metric.status)}>
                            {metric.status.replace('-', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => removeMetric(metric.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Summary */}
          <div>
            <Label>Analysis Summary</Label>
            <Textarea
              value={analysisInfo.summary}
              onChange={(e) => setAnalysisInfo({ ...analysisInfo, summary: e.target.value })}
              placeholder="Summarize the key findings and conclusions from this comparative analysis..."
              rows={4}
            />
          </div>

          <Button onClick={() => saveData()}>Save Comparative Analysis</Button>
        </CardContent>
      </Card>
    </div>
  );
}
