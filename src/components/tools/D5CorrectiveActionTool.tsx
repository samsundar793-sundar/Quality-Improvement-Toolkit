import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CorrectiveAction {
  id: string;
  rootCause: string;
  action: string;
  actionType: 'corrective' | 'preventive';
  owner: string;
  targetDate: string;
  status: 'planned' | 'in-progress' | 'completed' | 'verified';
  verificationMethod: string;
  effectiveness: string;
}

const D5CorrectiveActionTool: React.FC = () => {
  const [actions, setActions] = useState<CorrectiveAction[]>([]);
  const [newAction, setNewAction] = useState<Partial<CorrectiveAction>>({
    actionType: 'corrective',
    status: 'planned'
  });

  const addAction = () => {
    if (newAction.rootCause && newAction.action && newAction.owner) {
      setActions([...actions, {
        id: Date.now().toString(),
        rootCause: newAction.rootCause || '',
        action: newAction.action || '',
        actionType: newAction.actionType || 'corrective',
        owner: newAction.owner || '',
        targetDate: newAction.targetDate || '',
        status: newAction.status || 'planned',
        verificationMethod: newAction.verificationMethod || '',
        effectiveness: newAction.effectiveness || ''
      }]);
      setNewAction({ actionType: 'corrective', status: 'planned' });
    }
  };

  const removeAction = (id: string) => {
    setActions(actions.filter(a => a.id !== id));
  };

  const updateActionStatus = (id: string, status: CorrectiveAction['status']) => {
    setActions(actions.map(a => a.id === id ? { ...a, status } : a));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      'planned': 'bg-muted text-muted-foreground',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'verified': 'bg-blue-100 text-blue-800'
    };
    return <Badge className={variants[status] || variants['planned']}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            D5 - Permanent Corrective Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Define and implement permanent corrective actions that address the verified root causes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/30">
            <div>
              <Label>Root Cause Addressed</Label>
              <Textarea
                placeholder="Which root cause does this action address?"
                value={newAction.rootCause || ''}
                onChange={(e) => setNewAction({ ...newAction, rootCause: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Corrective Action</Label>
              <Textarea
                placeholder="Describe the permanent corrective action"
                value={newAction.action || ''}
                onChange={(e) => setNewAction({ ...newAction, action: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Action Type</Label>
              <Select
                value={newAction.actionType}
                onValueChange={(value: 'corrective' | 'preventive') => 
                  setNewAction({ ...newAction, actionType: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="corrective">Corrective Action</SelectItem>
                  <SelectItem value="preventive">Preventive Action</SelectItem>
                </SelectContent>
              </Select>
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
            <div>
              <Label>Target Date</Label>
              <Input
                type="date"
                value={newAction.targetDate || ''}
                onChange={(e) => setNewAction({ ...newAction, targetDate: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Verification Method</Label>
              <Input
                placeholder="How will effectiveness be verified?"
                value={newAction.verificationMethod || ''}
                onChange={(e) => setNewAction({ ...newAction, verificationMethod: e.target.value })}
                className="mt-1"
              />
            </div>
            <div className="md:col-span-2">
              <Button onClick={addAction} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Corrective Action
              </Button>
            </div>
          </div>

          {actions.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Root Cause</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {actions.map((action) => (
                  <TableRow key={action.id}>
                    <TableCell className="max-w-[150px] truncate">{action.rootCause}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{action.action}</TableCell>
                    <TableCell>
                      <Badge variant={action.actionType === 'corrective' ? 'default' : 'secondary'}>
                        {action.actionType}
                      </Badge>
                    </TableCell>
                    <TableCell>{action.owner}</TableCell>
                    <TableCell>{action.targetDate}</TableCell>
                    <TableCell>
                      <Select
                        value={action.status}
                        onValueChange={(value: CorrectiveAction['status']) => 
                          updateActionStatus(action.id, value)}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planned">Planned</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="verified">Verified</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => removeAction(action.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <div className="grid grid-cols-4 gap-4 pt-4">
            <Card className="p-3 text-center">
              <div className="text-2xl font-bold">{actions.length}</div>
              <div className="text-xs text-muted-foreground">Total Actions</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {actions.filter(a => a.status === 'in-progress').length}
              </div>
              <div className="text-xs text-muted-foreground">In Progress</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-2xl font-bold text-green-600">
                {actions.filter(a => a.status === 'completed' || a.status === 'verified').length}
              </div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {actions.filter(a => a.status === 'verified').length}
              </div>
              <div className="text-xs text-muted-foreground">Verified</div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default D5CorrectiveActionTool;
