import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Trash2, UserPlus, Mail, Phone } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";
import { useToast } from "@/hooks/use-toast";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  expertise: string;
  email: string;
  phone: string;
  availability: 'full-time' | 'part-time' | 'as-needed';
  isChampion: boolean;
}

export function D1TeamFormationTool() {
  const { currentProject, updateToolData, getToolData } = useProject();
  const { toast } = useToast();

  const savedData = currentProject ? getToolData('d1-team-formation') : null;
  
  const [teamInfo, setTeamInfo] = useState({
    teamName: savedData?.teamInfo?.teamName || '',
    problemReference: savedData?.teamInfo?.problemReference || '',
    formationDate: savedData?.teamInfo?.formationDate || new Date().toISOString().split('T')[0],
    targetCompletionDate: savedData?.teamInfo?.targetCompletionDate || '',
    sponsor: savedData?.teamInfo?.sponsor || '',
    meetingSchedule: savedData?.teamInfo?.meetingSchedule || ''
  });

  const [members, setMembers] = useState<TeamMember[]>(savedData?.members || []);
  
  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    department: '',
    expertise: '',
    email: '',
    phone: '',
    availability: 'part-time' as const,
    isChampion: false
  });

  const roles = [
    'Team Leader',
    'Champion/Sponsor',
    'Subject Matter Expert',
    'Quality Engineer',
    'Process Engineer',
    'Production Representative',
    'Customer Representative',
    'Supplier Representative',
    'Maintenance',
    'Other'
  ];

  const addMember = () => {
    if (!newMember.name || !newMember.role) {
      toast({ title: "Error", description: "Name and Role are required", variant: "destructive" });
      return;
    }

    const member: TeamMember = {
      ...newMember,
      id: Date.now().toString()
    };

    const updated = [...members, member];
    setMembers(updated);
    setNewMember({
      name: '',
      role: '',
      department: '',
      expertise: '',
      email: '',
      phone: '',
      availability: 'part-time',
      isChampion: false
    });
    saveData(updated);
  };

  const removeMember = (id: string) => {
    const updated = members.filter(m => m.id !== id);
    setMembers(updated);
    saveData(updated);
  };

  const setAsChampion = (id: string) => {
    const updated = members.map(m => ({
      ...m,
      isChampion: m.id === id
    }));
    setMembers(updated);
    saveData(updated);
  };

  const saveData = (membersList?: TeamMember[]) => {
    if (currentProject) {
      updateToolData('d1-team-formation', {
        teamInfo,
        members: membersList || members
      });
      toast({ title: "Saved", description: "Team formation data saved successfully" });
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'full-time': return 'bg-green-500 text-white';
      case 'part-time': return 'bg-yellow-500 text-black';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const champion = members.find(m => m.isChampion);
  const leader = members.find(m => m.role === 'Team Leader');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>D1: Team Formation</CardTitle>
              <CardDescription>Establish a cross-functional team with the right knowledge and authority</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Team Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Team Name</Label>
              <Input
                value={teamInfo.teamName}
                onChange={(e) => setTeamInfo({ ...teamInfo, teamName: e.target.value })}
                placeholder="8D Team Name"
              />
            </div>
            <div>
              <Label>Problem Reference</Label>
              <Input
                value={teamInfo.problemReference}
                onChange={(e) => setTeamInfo({ ...teamInfo, problemReference: e.target.value })}
                placeholder="Problem ID or Reference"
              />
            </div>
            <div>
              <Label>Executive Sponsor</Label>
              <Input
                value={teamInfo.sponsor}
                onChange={(e) => setTeamInfo({ ...teamInfo, sponsor: e.target.value })}
                placeholder="Sponsor name"
              />
            </div>
            <div>
              <Label>Formation Date</Label>
              <Input
                type="date"
                value={teamInfo.formationDate}
                onChange={(e) => setTeamInfo({ ...teamInfo, formationDate: e.target.value })}
              />
            </div>
            <div>
              <Label>Target Completion</Label>
              <Input
                type="date"
                value={teamInfo.targetCompletionDate}
                onChange={(e) => setTeamInfo({ ...teamInfo, targetCompletionDate: e.target.value })}
              />
            </div>
            <div>
              <Label>Meeting Schedule</Label>
              <Input
                value={teamInfo.meetingSchedule}
                onChange={(e) => setTeamInfo({ ...teamInfo, meetingSchedule: e.target.value })}
                placeholder="e.g., Daily 9 AM"
              />
            </div>
          </div>

          {/* Team Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">{members.length}</div>
                <p className="text-sm text-muted-foreground">Team Members</p>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <div className="text-sm font-medium truncate">{leader?.name || 'Not Assigned'}</div>
                <p className="text-sm text-muted-foreground">Team Leader</p>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <div className="text-sm font-medium truncate">{champion?.name || 'Not Assigned'}</div>
                <p className="text-sm text-muted-foreground">Champion</p>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">
                  {new Set(members.map(m => m.department)).size}
                </div>
                <p className="text-sm text-muted-foreground">Departments</p>
              </CardContent>
            </Card>
          </div>

          {/* Add Team Member */}
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Add Team Member
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Name *</Label>
                  <Input
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <Label>Role *</Label>
                  <Select value={newMember.role} onValueChange={(v) => setNewMember({ ...newMember, role: v })}>
                    <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                    <SelectContent>
                      {roles.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Department</Label>
                  <Input
                    value={newMember.department}
                    onChange={(e) => setNewMember({ ...newMember, department: e.target.value })}
                    placeholder="Department"
                  />
                </div>
                <div>
                  <Label>Expertise</Label>
                  <Input
                    value={newMember.expertise}
                    onChange={(e) => setNewMember({ ...newMember, expertise: e.target.value })}
                    placeholder="Key skills"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={newMember.phone}
                    onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                    placeholder="Phone number"
                  />
                </div>
                <div>
                  <Label>Availability</Label>
                  <Select value={newMember.availability} onValueChange={(v: any) => setNewMember({ ...newMember, availability: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="as-needed">As Needed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={addMember}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Members Table */}
          {members.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Team Roster</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Expertise</TableHead>
                      <TableHead>Availability</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {member.name}
                            {member.isChampion && (
                              <Badge variant="outline" className="text-xs">Champion</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{member.role}</TableCell>
                        <TableCell>{member.department}</TableCell>
                        <TableCell className="max-w-[150px] truncate">{member.expertise}</TableCell>
                        <TableCell>
                          <Badge className={getAvailabilityColor(member.availability)}>
                            {member.availability}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {member.email && (
                              <a href={`mailto:${member.email}`} className="text-muted-foreground hover:text-primary">
                                <Mail className="h-4 w-4" />
                              </a>
                            )}
                            {member.phone && (
                              <a href={`tel:${member.phone}`} className="text-muted-foreground hover:text-primary">
                                <Phone className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {!member.isChampion && (
                              <Button variant="ghost" size="sm" onClick={() => setAsChampion(member.id)}>
                                Set Champion
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" onClick={() => removeMember(member.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          <Button onClick={() => saveData()}>Save Team Formation</Button>
        </CardContent>
      </Card>
    </div>
  );
}
