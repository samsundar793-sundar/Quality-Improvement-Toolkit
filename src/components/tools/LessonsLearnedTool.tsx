import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Save, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProject } from "@/contexts/ProjectContext";

interface Lesson {
  id: string;
  title: string;
  category: 'Process' | 'Technical' | 'Team' | 'Communication' | 'Planning' | 'Other';
  type: 'Success' | 'Challenge' | 'Recommendation';
  description: string;
  impact: string;
  recommendation: string;
  phase: string;
  submittedBy: string;
  date: string;
}

interface LessonsLearnedData {
  projectName: string;
  completionDate: string;
  facilitator: string;
  lessons: Lesson[];
}

export function LessonsLearnedTool() {
  const { toast } = useToast();
  const { currentProject, updateToolData, getToolData } = useProject();
  
  const [data, setData] = useState<LessonsLearnedData>(() => {
    const saved = currentProject ? getToolData("lessons-learned") : null;
    return saved || {
      projectName: currentProject?.name || "",
      completionDate: new Date().toISOString().split('T')[0],
      facilitator: "",
      lessons: []
    };
  });

  const handleSave = () => {
    if (currentProject) {
      updateToolData("lessons-learned", data);
      toast({ title: "Saved", description: "Lessons learned saved successfully" });
    }
  };

  const addLesson = () => {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: "",
      category: 'Process',
      type: 'Recommendation',
      description: "",
      impact: "",
      recommendation: "",
      phase: "",
      submittedBy: "",
      date: new Date().toISOString().split('T')[0]
    };
    setData(prev => ({ ...prev, lessons: [...prev.lessons, newLesson] }));
  };

  const updateLesson = (id: string, field: keyof Lesson, value: any) => {
    setData(prev => ({
      ...prev,
      lessons: prev.lessons.map(l => l.id === id ? { ...l, [field]: value } : l)
    }));
  };

  const removeLesson = (id: string) => {
    setData(prev => ({ ...prev, lessons: prev.lessons.filter(l => l.id !== id) }));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Success': return 'bg-green-500/10 text-green-600';
      case 'Challenge': return 'bg-orange-500/10 text-orange-600';
      default: return 'bg-blue-500/10 text-blue-600';
    }
  };

  // Group lessons by category
  const lessonsByCategory = data.lessons.reduce((acc, lesson) => {
    if (!acc[lesson.category]) acc[lesson.category] = [];
    acc[lesson.category].push(lesson);
    return acc;
  }, {} as Record<string, Lesson[]>);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary/10">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle>Lessons Learned</CardTitle>
            <CardDescription>Document project learnings for future reference</CardDescription>
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
            <Label>Project Name</Label>
            <Input
              value={data.projectName}
              onChange={(e) => setData(prev => ({ ...prev, projectName: e.target.value }))}
              placeholder="Project name"
            />
          </div>
          <div className="space-y-2">
            <Label>Completion Date</Label>
            <Input
              type="date"
              value={data.completionDate}
              onChange={(e) => setData(prev => ({ ...prev, completionDate: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Facilitator</Label>
            <Input
              value={data.facilitator}
              onChange={(e) => setData(prev => ({ ...prev, facilitator: e.target.value }))}
              placeholder="Session facilitator"
            />
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">
              {data.lessons.filter(l => l.type === 'Success').length}
            </div>
            <div className="text-sm text-muted-foreground">Successes</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-500">
              {data.lessons.filter(l => l.type === 'Challenge').length}
            </div>
            <div className="text-sm text-muted-foreground">Challenges</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">
              {data.lessons.filter(l => l.type === 'Recommendation').length}
            </div>
            <div className="text-sm text-muted-foreground">Recommendations</div>
          </Card>
        </div>

        {/* Lessons */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-semibold">Documented Lessons</Label>
            <Button onClick={addLesson} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add Lesson
            </Button>
          </div>

          {data.lessons.map((lesson) => (
            <Card key={lesson.id} className="p-4 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={getTypeColor(lesson.type)}>{lesson.type}</Badge>
                  <Badge variant="outline">{lesson.category}</Badge>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeLesson(lesson.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label>Title</Label>
                  <Input
                    value={lesson.title}
                    onChange={(e) => updateLesson(lesson.id, "title", e.target.value)}
                    placeholder="Brief title of the lesson"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select 
                    value={lesson.type} 
                    onValueChange={(v) => updateLesson(lesson.id, "type", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Success">Success</SelectItem>
                      <SelectItem value="Challenge">Challenge</SelectItem>
                      <SelectItem value="Recommendation">Recommendation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select 
                    value={lesson.category} 
                    onValueChange={(v) => updateLesson(lesson.id, "category", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Process">Process</SelectItem>
                      <SelectItem value="Technical">Technical</SelectItem>
                      <SelectItem value="Team">Team</SelectItem>
                      <SelectItem value="Communication">Communication</SelectItem>
                      <SelectItem value="Planning">Planning</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={lesson.description}
                    onChange={(e) => updateLesson(lesson.id, "description", e.target.value)}
                    placeholder="What happened? What did we learn?"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Impact</Label>
                  <Textarea
                    value={lesson.impact}
                    onChange={(e) => updateLesson(lesson.id, "impact", e.target.value)}
                    placeholder="How did this affect the project?"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Recommendation for Future Projects</Label>
                <Textarea
                  value={lesson.recommendation}
                  onChange={(e) => updateLesson(lesson.id, "recommendation", e.target.value)}
                  placeholder="What should future projects do differently?"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Project Phase</Label>
                  <Input
                    value={lesson.phase}
                    onChange={(e) => updateLesson(lesson.id, "phase", e.target.value)}
                    placeholder="e.g., Define, Measure, Analyze..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Submitted By</Label>
                  <Input
                    value={lesson.submittedBy}
                    onChange={(e) => updateLesson(lesson.id, "submittedBy", e.target.value)}
                    placeholder="Team member name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={lesson.date}
                    onChange={(e) => updateLesson(lesson.id, "date", e.target.value)}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
