import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Trash2, CheckCircle, XCircle, HelpCircle } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";
import { useToast } from "@/hooks/use-toast";

interface PotentialCause {
  id: string;
  category: string;
  description: string;
  source: string;
  verificationMethod: string;
  verificationResult: string;
  status: 'unverified' | 'verified-root-cause' | 'verified-not-root-cause' | 'contributing-factor';
  evidence: string;
}

interface FiveWhyEntry {
  id: string;
  level: number;
  question: string;
  answer: string;
}

export function D4RootCauseTool() {
  const { currentProject, updateToolData, getToolData } = useProject();
  const { toast } = useToast();

  const savedData = currentProject ? getToolData('d4-root-cause') : null;
  
  const [analysisInfo, setAnalysisInfo] = useState({
    problemStatement: savedData?.analysisInfo?.problemStatement || '',
    analysisDate: savedData?.analysisInfo?.analysisDate || new Date().toISOString().split('T')[0],
    analysisTeam: savedData?.analysisInfo?.analysisTeam || ''
  });

  const [causes, setCauses] = useState<PotentialCause[]>(savedData?.causes || []);
  const [fiveWhys, setFiveWhys] = useState<FiveWhyEntry[]>(savedData?.fiveWhys || [
    { id: '1', level: 1, question: 'Why did the problem occur?', answer: '' },
    { id: '2', level: 2, question: 'Why?', answer: '' },
    { id: '3', level: 3, question: 'Why?', answer: '' },
    { id: '4', level: 4, question: 'Why?', answer: '' },
    { id: '5', level: 5, question: 'Why?', answer: '' }
  ]);
  
  const [newCause, setNewCause] = useState({
    category: 'Method',
    description: '',
    source: '',
    verificationMethod: '',
    verificationResult: '',
    status: 'unverified' as const,
    evidence: ''
  });

  const categories = ['Man', 'Machine', 'Method', 'Material', 'Measurement', 'Environment'];

  const addCause = () => {
    if (!newCause.description) {
      toast({ title: "Error", description: "Cause description is required", variant: "destructive" });
      return;
    }

    const cause: PotentialCause = {
      ...newCause,
      id: Date.now().toString()
    };

    const updated = [...causes, cause];
    setCauses(updated);
    setNewCause({
      category: 'Method',
      description: '',
      source: '',
      verificationMethod: '',
      verificationResult: '',
      status: 'unverified',
      evidence: ''
    });
    saveData(updated, fiveWhys);
  };

  const removeCause = (id: string) => {
    const updated = causes.filter(c => c.id !== id);
    setCauses(updated);
    saveData(updated, fiveWhys);
  };

  const updateCauseStatus = (id: string, status: PotentialCause['status']) => {
    const updated = causes.map(c => c.id === id ? { ...c, status } : c);
    setCauses(updated);
    saveData(updated, fiveWhys);
  };

  const updateFiveWhy = (id: string, answer: string) => {
    const updated = fiveWhys.map(w => w.id === id ? { ...w, answer } : w);
    setFiveWhys(updated);
    saveData(causes, updated);
  };

  const saveData = (causesList?: PotentialCause[], whysList?: FiveWhyEntry[]) => {
    if (currentProject) {
      updateToolData('d4-root-cause', {
        analysisInfo,
        causes: causesList || causes,
        fiveWhys: whysList || fiveWhys
      });
      toast({ title: "Saved", description: "Root cause analysis saved successfully" });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified-root-cause': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'verified-not-root-cause': return <XCircle className="h-4 w-4 text-destructive" />;
      case 'contributing-factor': return <HelpCircle className="h-4 w-4 text-yellow-500" />;
      default: return <HelpCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified-root-cause': return 'bg-green-500 text-white';
      case 'verified-not-root-cause': return 'bg-destructive text-destructive-foreground';
      case 'contributing-factor': return 'bg-yellow-500 text-black';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const rootCauses = causes.filter(c => c.status === 'verified-root-cause');
  const contributingFactors = causes.filter(c => c.status === 'contributing-factor');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>D4: Root Cause Analysis</CardTitle>
              <CardDescription>Identify and verify the true root cause(s) of the problem</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Analysis Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label>Problem Statement</Label>
              <Textarea
                value={analysisInfo.problemStatement}
                onChange={(e) => setAnalysisInfo({ ...analysisInfo, problemStatement: e.target.value })}
                placeholder="Restate the problem being analyzed"
                rows={2}
              />
            </div>
            <div className="space-y-4">
              <div>
                <Label>Analysis Date</Label>
                <Input
                  type="date"
                  value={analysisInfo.analysisDate}
                  onChange={(e) => setAnalysisInfo({ ...analysisInfo, analysisDate: e.target.value })}
                />
              </div>
              <div>
                <Label>Analysis Team</Label>
                <Input
                  value={analysisInfo.analysisTeam}
                  onChange={(e) => setAnalysisInfo({ ...analysisInfo, analysisTeam: e.target.value })}
                  placeholder="Team members"
                />
              </div>
            </div>
          </div>

          {/* Status Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">{causes.length}</div>
                <p className="text-sm text-muted-foreground">Potential Causes</p>
              </CardContent>
            </Card>
            <Card className="bg-green-500/10">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-green-600">{rootCauses.length}</div>
                <p className="text-sm text-muted-foreground">Verified Root Causes</p>
              </CardContent>
            </Card>
            <Card className="bg-yellow-500/10">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-yellow-600">{contributingFactors.length}</div>
                <p className="text-sm text-muted-foreground">Contributing Factors</p>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">
                  {causes.filter(c => c.status === 'unverified').length}
                </div>
                <p className="text-sm text-muted-foreground">Unverified</p>
              </CardContent>
            </Card>
          </div>

          {/* 5 Why Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">5 Why Analysis</CardTitle>
              <CardDescription>Drill down to find the root cause</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {fiveWhys.map((why, index) => (
                <div key={why.id} className="flex gap-4 items-start">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">
                    {why.level}
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label className="text-sm font-medium">{why.question}</Label>
                    <Textarea
                      value={why.answer}
                      onChange={(e) => updateFiveWhy(why.id, e.target.value)}
                      placeholder={`Answer to Why #${why.level}...`}
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Add Potential Cause */}
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Potential Cause (Fishbone Categories)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Category (6M)</Label>
                  <Select value={newCause.category} onValueChange={(v) => setNewCause({ ...newCause, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label>Potential Cause *</Label>
                  <Input
                    value={newCause.description}
                    onChange={(e) => setNewCause({ ...newCause, description: e.target.value })}
                    placeholder="Describe the potential cause"
                  />
                </div>
                <div>
                  <Label>Source</Label>
                  <Input
                    value={newCause.source}
                    onChange={(e) => setNewCause({ ...newCause, source: e.target.value })}
                    placeholder="Brainstorm, data, etc."
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Verification Method</Label>
                  <Input
                    value={newCause.verificationMethod}
                    onChange={(e) => setNewCause({ ...newCause, verificationMethod: e.target.value })}
                    placeholder="How will you verify?"
                  />
                </div>
                <div>
                  <Label>Evidence</Label>
                  <Input
                    value={newCause.evidence}
                    onChange={(e) => setNewCause({ ...newCause, evidence: e.target.value })}
                    placeholder="Supporting data"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addCause}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Cause
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Causes Table */}
          {causes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Potential Causes</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Potential Cause</TableHead>
                      <TableHead>Verification</TableHead>
                      <TableHead>Evidence</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {causes.map((cause) => (
                      <TableRow key={cause.id}>
                        <TableCell>
                          <Badge variant="outline">{cause.category}</Badge>
                        </TableCell>
                        <TableCell className="font-medium max-w-[200px]">{cause.description}</TableCell>
                        <TableCell className="max-w-[150px] truncate">{cause.verificationMethod}</TableCell>
                        <TableCell className="max-w-[150px] truncate">{cause.evidence}</TableCell>
                        <TableCell>
                          <Select 
                            value={cause.status} 
                            onValueChange={(v: any) => updateCauseStatus(cause.id, v)}
                          >
                            <SelectTrigger className="w-[180px]">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(cause.status)}
                                <span className="text-xs">{cause.status.replace(/-/g, ' ')}</span>
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="unverified">Unverified</SelectItem>
                              <SelectItem value="verified-root-cause">✓ Root Cause</SelectItem>
                              <SelectItem value="verified-not-root-cause">✗ Not Root Cause</SelectItem>
                              <SelectItem value="contributing-factor">Contributing Factor</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => removeCause(cause.id)}>
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

          {/* Verified Root Causes Summary */}
          {rootCauses.length > 0 && (
            <Card className="border-green-500/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Verified Root Cause(s)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {rootCauses.map(rc => (
                    <li key={rc.id} className="flex items-center gap-2">
                      <Badge className="bg-green-500">{rc.category}</Badge>
                      <span>{rc.description}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Button onClick={() => saveData()}>Save Root Cause Analysis</Button>
        </CardContent>
      </Card>
    </div>
  );
}
