import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProject } from "@/contexts/ProjectContext";

interface AuditItem {
  id: string;
  question: string;
  score: number;
  notes: string;
}

interface FiveS_Category {
  id: string;
  name: string;
  japanese: string;
  description: string;
  items: AuditItem[];
}

interface FiveS_AuditData {
  areaName: string;
  auditor: string;
  auditDate: string;
  categories: FiveS_Category[];
}

const DEFAULT_CATEGORIES: FiveS_Category[] = [
  {
    id: 'sort',
    name: 'Sort (Seiri)',
    japanese: '整理',
    description: 'Remove unnecessary items',
    items: [
      { id: 's1', question: 'Only necessary items are present in the work area', score: 0, notes: '' },
      { id: 's2', question: 'Red tag area is established and maintained', score: 0, notes: '' },
      { id: 's3', question: 'No obsolete equipment, tools, or materials', score: 0, notes: '' },
    ]
  },
  {
    id: 'set',
    name: 'Set in Order (Seiton)',
    japanese: '整頓',
    description: 'A place for everything',
    items: [
      { id: 'o1', question: 'All items have designated locations', score: 0, notes: '' },
      { id: 'o2', question: 'Locations are clearly marked and labeled', score: 0, notes: '' },
      { id: 'o3', question: 'Frequently used items are easily accessible', score: 0, notes: '' },
    ]
  },
  {
    id: 'shine',
    name: 'Shine (Seiso)',
    japanese: '清掃',
    description: 'Clean and inspect',
    items: [
      { id: 'sh1', question: 'Work area is clean and free of debris', score: 0, notes: '' },
      { id: 'sh2', question: 'Equipment is clean and well-maintained', score: 0, notes: '' },
      { id: 'sh3', question: 'Cleaning responsibilities are assigned', score: 0, notes: '' },
    ]
  },
  {
    id: 'standardize',
    name: 'Standardize (Seiketsu)',
    japanese: '清潔',
    description: 'Create standards',
    items: [
      { id: 'st1', question: '5S standards and procedures are documented', score: 0, notes: '' },
      { id: 'st2', question: 'Visual controls are in place', score: 0, notes: '' },
      { id: 'st3', question: 'Standards are consistently followed', score: 0, notes: '' },
    ]
  },
  {
    id: 'sustain',
    name: 'Sustain (Shitsuke)',
    japanese: '躾',
    description: 'Maintain discipline',
    items: [
      { id: 'su1', question: 'Regular 5S audits are conducted', score: 0, notes: '' },
      { id: 'su2', question: 'Training is provided for all team members', score: 0, notes: '' },
      { id: 'su3', question: 'Continuous improvement culture is evident', score: 0, notes: '' },
    ]
  }
];

export function FiveS_AuditTool() {
  const { toast } = useToast();
  const { currentProject, updateToolData, getToolData } = useProject();
  
  const [data, setData] = useState<FiveS_AuditData>(() => {
    const saved = currentProject ? getToolData("5s-audit") : null;
    return saved || {
      areaName: "",
      auditor: "",
      auditDate: new Date().toISOString().split('T')[0],
      categories: DEFAULT_CATEGORIES
    };
  });

  const handleSave = () => {
    if (currentProject) {
      updateToolData("5s-audit", data);
      toast({ title: "Saved", description: "5S audit saved successfully" });
    }
  };

  const updateScore = (categoryId: string, itemId: string, score: number) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.map(cat => 
        cat.id === categoryId 
          ? {
              ...cat,
              items: cat.items.map(item => 
                item.id === itemId ? { ...item, score } : item
              )
            }
          : cat
      )
    }));
  };

  const updateNotes = (categoryId: string, itemId: string, notes: string) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.map(cat => 
        cat.id === categoryId 
          ? {
              ...cat,
              items: cat.items.map(item => 
                item.id === itemId ? { ...item, notes } : item
              )
            }
          : cat
      )
    }));
  };

  // Calculate scores
  const getCategoryScore = (category: FiveS_Category) => {
    const total = category.items.reduce((sum, item) => sum + item.score, 0);
    const max = category.items.length * 5;
    return { total, max, percent: max > 0 ? (total / max) * 100 : 0 };
  };

  const overallScore = data.categories.reduce((sum, cat) => {
    const score = getCategoryScore(cat);
    return sum + score.total;
  }, 0);

  const maxScore = data.categories.reduce((sum, cat) => sum + cat.items.length * 5, 0);
  const overallPercent = maxScore > 0 ? (overallScore / maxScore) * 100 : 0;

  const getScoreColor = (percent: number) => {
    if (percent >= 80) return 'text-green-500';
    if (percent >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-green-500/10">
            <CheckCircle className="h-6 w-6 text-green-500" />
          </div>
          <div className="flex-1">
            <CardTitle>5S Audit</CardTitle>
            <CardDescription>Workplace organization assessment</CardDescription>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Area Name</Label>
            <Input
              value={data.areaName}
              onChange={(e) => setData(prev => ({ ...prev, areaName: e.target.value }))}
              placeholder="Work area or department"
            />
          </div>
          <div className="space-y-2">
            <Label>Auditor</Label>
            <Input
              value={data.auditor}
              onChange={(e) => setData(prev => ({ ...prev, auditor: e.target.value }))}
              placeholder="Auditor name"
            />
          </div>
          <div className="space-y-2">
            <Label>Audit Date</Label>
            <Input
              type="date"
              value={data.auditDate}
              onChange={(e) => setData(prev => ({ ...prev, auditDate: e.target.value }))}
            />
          </div>
        </div>

        {/* Overall Score */}
        <Card className="p-4 bg-muted/50">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Overall Score</span>
            <span className={`text-2xl font-bold ${getScoreColor(overallPercent)}`}>
              {overallPercent.toFixed(0)}%
            </span>
          </div>
          <Progress value={overallPercent} className="h-3" />
          <div className="text-sm text-muted-foreground mt-1">
            {overallScore} / {maxScore} points
          </div>
        </Card>

        {/* Categories */}
        {data.categories.map((category) => {
          const score = getCategoryScore(category);
          return (
            <Card key={category.id} className="p-4 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
                <div className="text-right">
                  <div className={`text-xl font-bold ${getScoreColor(score.percent)}`}>
                    {score.percent.toFixed(0)}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {score.total}/{score.max}
                  </div>
                </div>
              </div>
              <Progress value={score.percent} className="h-2" />

              <div className="space-y-3">
                {category.items.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-[1fr,120px,200px] gap-3 items-start p-3 bg-muted/30 rounded-lg">
                    <div className="text-sm">{item.question}</div>
                    <Select 
                      value={item.score.toString()} 
                      onValueChange={(v) => updateScore(category.id, item.id, parseInt(v))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Score" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0 - N/A</SelectItem>
                        <SelectItem value="1">1 - Poor</SelectItem>
                        <SelectItem value="2">2 - Fair</SelectItem>
                        <SelectItem value="3">3 - Good</SelectItem>
                        <SelectItem value="4">4 - Very Good</SelectItem>
                        <SelectItem value="5">5 - Excellent</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Notes..."
                      value={item.notes}
                      onChange={(e) => updateNotes(category.id, item.id, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
}
