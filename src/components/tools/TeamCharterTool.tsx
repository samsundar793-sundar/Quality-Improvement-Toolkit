import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Save, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProject } from "@/contexts/ProjectContext";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  responsibility: string;
  availability: string;
}

interface TeamCharter {
  teamName: string;
  projectName: string;
  sponsor: string;
  startDate: string;
  endDate: string;
  mission: string;
  goals: string;
  groundRules: string[];
  meetingSchedule: string;
  communicationPlan: string;
  members: TeamMember[];
}

export function TeamCharterTool() {
  const { toast } = useToast();
  const { currentProject, updateToolData, getToolData } = useProject();
  
  const [charter, setCharter] = useState<TeamCharter>(() => {
    const saved = currentProject ? getToolData("team-charter") : null;
    return saved || {
      teamName: "",
      projectName: "",
      sponsor: "",
      startDate: "",
      endDate: "",
      mission: "",
      goals: "",
      groundRules: ["Respect all opinions", "Be on time for meetings", "Complete actions by deadlines"],
      meetingSchedule: "",
      communicationPlan: "",
      members: []
    };
  });

  const handleSave = () => {
    if (currentProject) {
      updateToolData("team-charter", charter);
      toast({ title: "Saved", description: "Team charter saved successfully" });
    }
  };

  const addMember = () => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: "",
      role: "Member",
      department: "",
      responsibility: "",
      availability: "Full-time"
    };
    setCharter(prev => ({ ...prev, members: [...prev.members, newMember] }));
  };

  const updateMember = (id: string, field: keyof TeamMember, value: string) => {
    setCharter(prev => ({
      ...prev,
      members: prev.members.map(m => m.id === id ? { ...m, [field]: value } : m)
    }));
  };

  const removeMember = (id: string) => {
    setCharter(prev => ({
      ...prev,
      members: prev.members.filter(m => m.id !== id)
    }));
  };

  const addGroundRule = () => {
    setCharter(prev => ({ ...prev, groundRules: [...prev.groundRules, ""] }));
  };

  const updateGroundRule = (index: number, value: string) => {
    const updated = [...charter.groundRules];
    updated[index] = value;
    setCharter(prev => ({ ...prev, groundRules: updated }));
  };

  const removeGroundRule = (index: number) => {
    setCharter(prev => ({ 
      ...prev, 
      groundRules: prev.groundRules.filter((_, i) => i !== index) 
    }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary/10">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle>Team Charter</CardTitle>
            <CardDescription>Define team structure, roles, and working agreements</CardDescription>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Team Name</Label>
            <Input
              value={charter.teamName}
              onChange={(e) => setCharter(prev => ({ ...prev, teamName: e.target.value }))}
              placeholder="e.g., Quality Tigers"
            />
          </div>
          <div className="space-y-2">
            <Label>Project Name</Label>
            <Input
              value={charter.projectName}
              onChange={(e) => setCharter(prev => ({ ...prev, projectName: e.target.value }))}
              placeholder="Project name"
            />
          </div>
          <div className="space-y-2">
            <Label>Executive Sponsor</Label>
            <Input
              value={charter.sponsor}
              onChange={(e) => setCharter(prev => ({ ...prev, sponsor: e.target.value }))}
              placeholder="Sponsor name"
            />
          </div>
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Input
              type="date"
              value={charter.startDate}
              onChange={(e) => setCharter(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Target End Date</Label>
            <Input
              type="date"
              value={charter.endDate}
              onChange={(e) => setCharter(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Meeting Schedule</Label>
            <Input
              value={charter.meetingSchedule}
              onChange={(e) => setCharter(prev => ({ ...prev, meetingSchedule: e.target.value }))}
              placeholder="e.g., Every Tuesday 10am"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Team Mission</Label>
          <Textarea
            value={charter.mission}
            onChange={(e) => setCharter(prev => ({ ...prev, mission: e.target.value }))}
            placeholder="What is the team's purpose and mission?"
          />
        </div>

        <div className="space-y-2">
          <Label>Team Goals</Label>
          <Textarea
            value={charter.goals}
            onChange={(e) => setCharter(prev => ({ ...prev, goals: e.target.value }))}
            placeholder="What are the specific, measurable goals?"
          />
        </div>

        {/* Team Members */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-semibold">Team Members</Label>
            <Button onClick={addMember} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add Member
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Responsibility</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {charter.members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <Input
                      value={member.name}
                      onChange={(e) => updateMember(member.id, "name", e.target.value)}
                      placeholder="Name"
                    />
                  </TableCell>
                  <TableCell>
                    <Select value={member.role} onValueChange={(v) => updateMember(member.id, "role", v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Champion">Champion</SelectItem>
                        <SelectItem value="Leader">Leader</SelectItem>
                        <SelectItem value="Facilitator">Facilitator</SelectItem>
                        <SelectItem value="Member">Member</SelectItem>
                        <SelectItem value="SME">SME</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      value={member.department}
                      onChange={(e) => updateMember(member.id, "department", e.target.value)}
                      placeholder="Dept"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={member.responsibility}
                      onChange={(e) => updateMember(member.id, "responsibility", e.target.value)}
                      placeholder="Primary responsibility"
                    />
                  </TableCell>
                  <TableCell>
                    <Select value={member.availability} onValueChange={(v) => updateMember(member.id, "availability", v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="As needed">As needed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => removeMember(member.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Ground Rules */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-semibold">Ground Rules</Label>
            <Button onClick={addGroundRule} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add Rule
            </Button>
          </div>
          {charter.groundRules.map((rule, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={rule}
                onChange={(e) => updateGroundRule(index, e.target.value)}
                placeholder={`Ground rule ${index + 1}`}
              />
              <Button variant="ghost" size="icon" onClick={() => removeGroundRule(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Label>Communication Plan</Label>
          <Textarea
            value={charter.communicationPlan}
            onChange={(e) => setCharter(prev => ({ ...prev, communicationPlan: e.target.value }))}
            placeholder="How will the team communicate? (email, chat, meetings, etc.)"
          />
        </div>
      </CardContent>
    </Card>
  );
}
