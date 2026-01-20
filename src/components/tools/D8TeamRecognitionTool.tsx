import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Award, Users, PartyPopper, FileCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TeamMemberRecognition {
  id: string;
  name: string;
  role: string;
  contribution: string;
  recognized: boolean;
}

interface ClosureItem {
  id: string;
  item: string;
  completed: boolean;
}

const D8TeamRecognitionTool: React.FC = () => {
  const [members, setMembers] = useState<TeamMemberRecognition[]>([]);
  const [newMember, setNewMember] = useState<Partial<TeamMemberRecognition>>({});
  const [closureItems, setClosureItems] = useState<ClosureItem[]>([
    { id: '1', item: 'All corrective actions verified effective', completed: false },
    { id: '2', item: 'Containment actions removed', completed: false },
    { id: '3', item: 'Documentation updated (FMEA, Control Plans, Work Instructions)', completed: false },
    { id: '4', item: 'Lessons learned documented and shared', completed: false },
    { id: '5', item: 'Customer notified of resolution', completed: false },
    { id: '6', item: '8D report finalized and approved', completed: false },
    { id: '7', item: 'Similar processes/products reviewed for applicability', completed: false }
  ]);
  const [closureDate, setClosureDate] = useState('');
  const [approvedBy, setApprovedBy] = useState('');
  const [finalRemarks, setFinalRemarks] = useState('');
  const [recognitionMethod, setRecognitionMethod] = useState('');

  const addMember = () => {
    if (newMember.name && newMember.role) {
      setMembers([...members, {
        id: Date.now().toString(),
        name: newMember.name || '',
        role: newMember.role || '',
        contribution: newMember.contribution || '',
        recognized: false
      }]);
      setNewMember({});
    }
  };

  const toggleRecognized = (id: string) => {
    setMembers(members.map(m => m.id === id ? { ...m, recognized: !m.recognized } : m));
  };

  const toggleClosureItem = (id: string) => {
    setClosureItems(closureItems.map(c => c.id === id ? { ...c, completed: !c.completed } : c));
  };

  const completionRate = (closureItems.filter(c => c.completed).length / closureItems.length) * 100;
  const recognizedCount = members.filter(m => m.recognized).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            D8 - Congratulate the Team & Close
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Recognize team efforts and formally close the 8D problem-solving process.
          </p>

          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-2 mb-4">
              <PartyPopper className="h-5 w-5 text-primary" />
              <span className="font-medium">Team Recognition</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border rounded-lg bg-background">
              <div>
                <Label>Team Member Name</Label>
                <Input
                  placeholder="Enter name"
                  value={newMember.name || ''}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Role in 8D</Label>
                <Input
                  placeholder="Champion, Lead, Member, etc."
                  value={newMember.role || ''}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Key Contribution</Label>
                <Input
                  placeholder="Major contribution to the project"
                  value={newMember.contribution || ''}
                  onChange={(e) => setNewMember({ ...newMember, contribution: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-3">
                <Button onClick={addMember} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
              </div>
            </div>

            {members.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Contribution</TableHead>
                    <TableHead>Recognized</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{member.role}</Badge>
                      </TableCell>
                      <TableCell>{member.contribution}</TableCell>
                      <TableCell>
                        <Checkbox
                          checked={member.recognized}
                          onCheckedChange={() => toggleRecognized(member.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            <div className="mt-4">
              <Label>Recognition Method</Label>
              <Textarea
                placeholder="Describe how the team will be recognized (e.g., certificate, announcement, bonus, etc.)"
                value={recognitionMethod}
                onChange={(e) => setRecognitionMethod(e.target.value)}
                className="mt-1"
              />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <FileCheck className="h-5 w-5" />
              <span className="font-medium">Closure Checklist</span>
              <Badge variant="outline" className="ml-auto">
                {completionRate.toFixed(0)}% Complete
              </Badge>
            </div>
            
            <div className="space-y-2">
              {closureItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-2 rounded hover:bg-muted/50">
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={() => toggleClosureItem(item.id)}
                  />
                  <span className={item.completed ? 'line-through text-muted-foreground' : ''}>
                    {item.item}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5" />
              <span className="font-medium">Formal Closure</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Closure Date</Label>
                <Input
                  type="date"
                  value={closureDate}
                  onChange={(e) => setClosureDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Approved By</Label>
                <Input
                  placeholder="Management approval"
                  value={approvedBy}
                  onChange={(e) => setApprovedBy(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label>Final Remarks</Label>
                <Textarea
                  placeholder="Any final comments or observations about the 8D process..."
                  value={finalRemarks}
                  onChange={(e) => setFinalRemarks(e.target.value)}
                  className="mt-1 min-h-[80px]"
                />
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <Card className="p-3 text-center">
              <div className="text-2xl font-bold">{members.length}</div>
              <div className="text-xs text-muted-foreground">Team Members</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-2xl font-bold text-green-600">{recognizedCount}</div>
              <div className="text-xs text-muted-foreground">Recognized</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {closureItems.filter(c => c.completed).length}/{closureItems.length}
              </div>
              <div className="text-xs text-muted-foreground">Closure Items</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-2xl font-bold text-primary">
                {completionRate === 100 && closureDate && approvedBy ? '✓' : '○'}
              </div>
              <div className="text-xs text-muted-foreground">Ready to Close</div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default D8TeamRecognitionTool;
