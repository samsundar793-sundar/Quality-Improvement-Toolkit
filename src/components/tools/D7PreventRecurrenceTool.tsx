import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Shield, FileText, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PreventiveAction {
  id: string;
  category: 'system' | 'process' | 'training' | 'documentation';
  description: string;
  owner: string;
  targetDate: string;
  completed: boolean;
}

interface DocumentUpdate {
  id: string;
  documentType: string;
  documentName: string;
  changeDescription: string;
  updatedBy: string;
  updateDate: string;
}

const D7PreventRecurrenceTool: React.FC = () => {
  const [actions, setActions] = useState<PreventiveAction[]>([]);
  const [documents, setDocuments] = useState<DocumentUpdate[]>([]);
  const [newAction, setNewAction] = useState<Partial<PreventiveAction>>({ category: 'system' });
  const [newDocument, setNewDocument] = useState<Partial<DocumentUpdate>>({});
  const [systemicChanges, setSystemicChanges] = useState('');
  const [lessonsLearned, setLessonsLearned] = useState('');

  const addAction = () => {
    if (newAction.description && newAction.owner) {
      setActions([...actions, {
        id: Date.now().toString(),
        category: newAction.category || 'system',
        description: newAction.description || '',
        owner: newAction.owner || '',
        targetDate: newAction.targetDate || '',
        completed: false
      }]);
      setNewAction({ category: 'system' });
    }
  };

  const addDocument = () => {
    if (newDocument.documentName && newDocument.changeDescription) {
      setDocuments([...documents, {
        id: Date.now().toString(),
        documentType: newDocument.documentType || '',
        documentName: newDocument.documentName || '',
        changeDescription: newDocument.changeDescription || '',
        updatedBy: newDocument.updatedBy || '',
        updateDate: newDocument.updateDate || ''
      }]);
      setNewDocument({});
    }
  };

  const toggleActionComplete = (id: string) => {
    setActions(actions.map(a => a.id === id ? { ...a, completed: !a.completed } : a));
  };

  const categoryIcons = {
    system: '⚙️',
    process: '📋',
    training: '👥',
    documentation: '📄'
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            D7 - Prevent Recurrence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Implement systemic changes to prevent the problem from recurring in similar processes or products.
          </p>

          <Tabs defaultValue="actions">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="actions">Preventive Actions</TabsTrigger>
              <TabsTrigger value="documents">Document Updates</TabsTrigger>
              <TabsTrigger value="lessons">Lessons Learned</TabsTrigger>
            </TabsList>

            <TabsContent value="actions" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/30">
                <div>
                  <Label>Category</Label>
                  <select
                    className="w-full mt-1 p-2 border rounded-md bg-background"
                    value={newAction.category}
                    onChange={(e) => setNewAction({ ...newAction, category: e.target.value as PreventiveAction['category'] })}
                  >
                    <option value="system">System Change</option>
                    <option value="process">Process Improvement</option>
                    <option value="training">Training</option>
                    <option value="documentation">Documentation</option>
                  </select>
                </div>
                <div>
                  <Label>Owner</Label>
                  <Input
                    placeholder="Responsible person"
                    value={newAction.owner || ''}
                    onChange={(e) => setNewAction({ ...newAction, owner: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Prevention Action Description</Label>
                  <Textarea
                    placeholder="Describe the action to prevent recurrence..."
                    value={newAction.description || ''}
                    onChange={(e) => setNewAction({ ...newAction, description: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Target Date</Label>
                  <Input
                    type="date"
                    value={newAction.targetDate || ''}
                    onChange={(e) => setNewAction({ ...newAction, targetDate: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addAction} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Action
                  </Button>
                </div>
              </div>

              {actions.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Complete</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {actions.map((action) => (
                      <TableRow key={action.id}>
                        <TableCell>
                          <span className="flex items-center gap-1">
                            {categoryIcons[action.category]} {action.category}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-[250px] truncate">{action.description}</TableCell>
                        <TableCell>{action.owner}</TableCell>
                        <TableCell>{action.targetDate}</TableCell>
                        <TableCell>
                          <Checkbox
                            checked={action.completed}
                            onCheckedChange={() => toggleActionComplete(action.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setActions(actions.filter(a => a.id !== action.id))}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/30">
                <div>
                  <Label>Document Type</Label>
                  <Input
                    placeholder="SOP, Work Instruction, FMEA, etc."
                    value={newDocument.documentType || ''}
                    onChange={(e) => setNewDocument({ ...newDocument, documentType: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Document Name/Number</Label>
                  <Input
                    placeholder="Document identifier"
                    value={newDocument.documentName || ''}
                    onChange={(e) => setNewDocument({ ...newDocument, documentName: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Change Description</Label>
                  <Textarea
                    placeholder="What was changed in this document?"
                    value={newDocument.changeDescription || ''}
                    onChange={(e) => setNewDocument({ ...newDocument, changeDescription: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Updated By</Label>
                  <Input
                    placeholder="Person who made the update"
                    value={newDocument.updatedBy || ''}
                    onChange={(e) => setNewDocument({ ...newDocument, updatedBy: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Update Date</Label>
                  <Input
                    type="date"
                    value={newDocument.updateDate || ''}
                    onChange={(e) => setNewDocument({ ...newDocument, updateDate: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <Button onClick={addDocument} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Document Update
                  </Button>
                </div>
              </div>

              {documents.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Document</TableHead>
                      <TableHead>Change</TableHead>
                      <TableHead>Updated By</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>{doc.documentType}</TableCell>
                        <TableCell>{doc.documentName}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{doc.changeDescription}</TableCell>
                        <TableCell>{doc.updatedBy}</TableCell>
                        <TableCell>{doc.updateDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            <TabsContent value="lessons" className="space-y-4">
              <div>
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Systemic Changes Implemented
                </Label>
                <Textarea
                  placeholder="Describe the systemic changes made to management systems, quality systems, or organizational processes..."
                  value={systemicChanges}
                  onChange={(e) => setSystemicChanges(e.target.value)}
                  className="mt-1 min-h-[100px]"
                />
              </div>
              <div>
                <Label className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Lessons Learned
                </Label>
                <Textarea
                  placeholder="Document key lessons learned that should be shared across the organization..."
                  value={lessonsLearned}
                  onChange={(e) => setLessonsLearned(e.target.value)}
                  className="mt-1 min-h-[100px]"
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <Card className="p-3 text-center">
              <div className="text-2xl font-bold">{actions.length}</div>
              <div className="text-xs text-muted-foreground">Prevention Actions</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-2xl font-bold text-green-600">
                {actions.filter(a => a.completed).length}
              </div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{documents.length}</div>
              <div className="text-xs text-muted-foreground">Documents Updated</div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default D7PreventRecurrenceTool;
