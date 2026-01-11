import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lightbulb, Save, Plus, Trash2, ThumbsUp, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProject } from "@/contexts/ProjectContext";

interface Idea {
  id: string;
  description: string;
  category: string;
  submittedBy: string;
  votes: number;
  starred: boolean;
  status: 'New' | 'Under Review' | 'Selected' | 'Rejected';
}

interface BrainstormingData {
  sessionTitle: string;
  problemStatement: string;
  sessionDate: string;
  facilitator: string;
  participants: string;
  ideas: Idea[];
  categories: string[];
}

export function BrainstormingTool() {
  const { toast } = useToast();
  const { currentProject, updateToolData, getToolData } = useProject();
  
  const [data, setData] = useState<BrainstormingData>(() => {
    const saved = currentProject ? getToolData("brainstorming") : null;
    return saved || {
      sessionTitle: "",
      problemStatement: "",
      sessionDate: new Date().toISOString().split('T')[0],
      facilitator: "",
      participants: "",
      ideas: [],
      categories: ["Process", "Technology", "People", "Equipment", "Other"]
    };
  });

  const [newIdea, setNewIdea] = useState("");
  const [newCategory, setNewCategory] = useState("Other");

  const handleSave = () => {
    if (currentProject) {
      updateToolData("brainstorming", data);
      toast({ title: "Saved", description: "Brainstorming session saved successfully" });
    }
  };

  const addIdea = () => {
    if (!newIdea.trim()) return;
    
    const idea: Idea = {
      id: Date.now().toString(),
      description: newIdea,
      category: newCategory,
      submittedBy: "",
      votes: 0,
      starred: false,
      status: 'New'
    };
    setData(prev => ({ ...prev, ideas: [...prev.ideas, idea] }));
    setNewIdea("");
  };

  const updateIdea = (id: string, field: keyof Idea, value: any) => {
    setData(prev => ({
      ...prev,
      ideas: prev.ideas.map(i => i.id === id ? { ...i, [field]: value } : i)
    }));
  };

  const removeIdea = (id: string) => {
    setData(prev => ({ ...prev, ideas: prev.ideas.filter(i => i.id !== id) }));
  };

  const voteIdea = (id: string) => {
    setData(prev => ({
      ...prev,
      ideas: prev.ideas.map(i => i.id === id ? { ...i, votes: i.votes + 1 } : i)
    }));
  };

  const toggleStar = (id: string) => {
    setData(prev => ({
      ...prev,
      ideas: prev.ideas.map(i => i.id === id ? { ...i, starred: !i.starred } : i)
    }));
  };

  const addCategory = () => {
    const name = prompt("Enter new category name:");
    if (name && !data.categories.includes(name)) {
      setData(prev => ({ ...prev, categories: [...prev.categories, name] }));
    }
  };

  // Sort ideas by votes
  const sortedIdeas = [...data.ideas].sort((a, b) => b.votes - a.votes);
  const starredIdeas = data.ideas.filter(i => i.starred);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-yellow-500/10">
            <Lightbulb className="h-6 w-6 text-yellow-500" />
          </div>
          <div className="flex-1">
            <CardTitle>Brainstorming</CardTitle>
            <CardDescription>Generate and capture ideas from the team</CardDescription>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Session Title</Label>
            <Input
              value={data.sessionTitle}
              onChange={(e) => setData(prev => ({ ...prev, sessionTitle: e.target.value }))}
              placeholder="Brainstorming session name"
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
          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              type="date"
              value={data.sessionDate}
              onChange={(e) => setData(prev => ({ ...prev, sessionDate: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Participants</Label>
            <Input
              value={data.participants}
              onChange={(e) => setData(prev => ({ ...prev, participants: e.target.value }))}
              placeholder="Team members"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Problem Statement / Topic</Label>
          <Textarea
            value={data.problemStatement}
            onChange={(e) => setData(prev => ({ ...prev, problemStatement: e.target.value }))}
            placeholder="What problem are we trying to solve?"
          />
        </div>

        {/* Add New Idea */}
        <Card className="p-4 bg-muted/50">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <Input
                value={newIdea}
                onChange={(e) => setNewIdea(e.target.value)}
                placeholder="Enter a new idea..."
                onKeyDown={(e) => e.key === 'Enter' && addIdea()}
              />
            </div>
            <Select value={newCategory} onValueChange={setNewCategory}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {data.categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addIdea}>
              <Plus className="h-4 w-4 mr-1" /> Add Idea
            </Button>
            <Button variant="outline" onClick={addCategory}>
              + Category
            </Button>
          </div>
        </Card>

        {/* Starred Ideas */}
        {starredIdeas.length > 0 && (
          <Card className="p-4 border-yellow-500/50">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              Top Ideas ({starredIdeas.length})
            </h3>
            <div className="space-y-2">
              {starredIdeas.map(idea => (
                <div key={idea.id} className="flex items-center gap-2 p-2 bg-yellow-500/10 rounded">
                  <span className="flex-1">{idea.description}</span>
                  <Badge variant="outline">{idea.category}</Badge>
                  <Badge>{idea.votes} votes</Badge>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* All Ideas */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-semibold">All Ideas ({data.ideas.length})</Label>
          </div>

          {sortedIdeas.map((idea) => (
            <Card key={idea.id} className={`p-4 ${idea.starred ? 'border-yellow-500/50' : ''}`}>
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => voteIdea(idea.id)}>
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-bold">{idea.votes}</span>
                </div>
                <div className="flex-1 space-y-2">
                  <Textarea
                    value={idea.description}
                    onChange={(e) => updateIdea(idea.id, "description", e.target.value)}
                    className="min-h-[60px]"
                  />
                  <div className="flex flex-wrap gap-2">
                    <Select 
                      value={idea.category} 
                      onValueChange={(v) => updateIdea(idea.id, "category", v)}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {data.categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select 
                      value={idea.status} 
                      onValueChange={(v) => updateIdea(idea.id, "status", v)}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Under Review">Under Review</SelectItem>
                        <SelectItem value="Selected">Selected</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Submitted by"
                      value={idea.submittedBy}
                      onChange={(e) => updateIdea(idea.id, "submittedBy", e.target.value)}
                      className="w-[150px]"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => toggleStar(idea.id)}
                  >
                    <Star className={`h-4 w-4 ${idea.starred ? 'text-yellow-500 fill-yellow-500' : ''}`} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => removeIdea(idea.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{data.ideas.length}</div>
            <div className="text-sm text-muted-foreground">Total Ideas</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500">{starredIdeas.length}</div>
            <div className="text-sm text-muted-foreground">Starred</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">
              {data.ideas.filter(i => i.status === 'Selected').length}
            </div>
            <div className="text-sm text-muted-foreground">Selected</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold">
              {data.ideas.reduce((sum, i) => sum + i.votes, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Votes</div>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
