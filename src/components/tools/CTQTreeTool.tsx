import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TreePine, Download, RotateCcw, Plus, X, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

interface CTQNode {
  id: string;
  text: string;
  level: "voice" | "driver" | "requirement" | "specification";
  parent?: string;
  children: string[];
}

export function CTQTreeTool() {
  const { toast } = useToast();
  const [nodes, setNodes] = useState<CTQNode[]>([
    { id: "1", text: "Voice of Customer", level: "voice", children: ["2"] },
    { id: "2", text: "High Quality Product", level: "driver", parent: "1", children: ["3", "4"] },
    { id: "3", text: "Defect Free", level: "requirement", parent: "2", children: ["5"] },
    { id: "4", text: "Reliable Performance", level: "requirement", parent: "2", children: ["6"] },
    { id: "5", text: "< 0.1% Defect Rate", level: "specification", parent: "3", children: [] },
    { id: "6", text: "99.9% Uptime", level: "specification", parent: "4", children: [] }
  ]);

  const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Process Excel data into CTQ format
        // Expected columns: Level, Text, Parent
        if (jsonData.length > 1) {
          const newNodes: CTQNode[] = [];
          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i] as any[];
            if (row[0] && row[1]) {
              newNodes.push({
                id: (i).toString(),
                text: row[1].toString(),
                level: row[0].toLowerCase() as any,
                parent: row[2]?.toString(),
                children: []
              });
            }
          }
          
          // Build parent-child relationships
          newNodes.forEach(node => {
            if (node.parent) {
              const parent = newNodes.find(n => n.id === node.parent);
              if (parent && !parent.children.includes(node.id)) {
                parent.children.push(node.id);
              }
            }
          });
          
          setNodes(newNodes);
          toast({
            title: "Excel Data Imported",
            description: `Imported ${newNodes.length} CTQ tree nodes.`
          });
        }
      } catch (error) {
        toast({
          title: "Import Error",
          description: "Failed to parse Excel file. Please check the format.",
          variant: "destructive"
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const addNode = (parentId: string, level: CTQNode["level"]) => {
    const newId = Date.now().toString();
    const newNode: CTQNode = {
      id: newId,
      text: `New ${level}`,
      level,
      parent: parentId,
      children: []
    };
    
    setNodes(prev => {
      const updated = [...prev, newNode];
      const parent = updated.find(n => n.id === parentId);
      if (parent && !parent.children.includes(newId)) {
        parent.children.push(newId);
      }
      return updated;
    });
  };

  const updateNode = (id: string, text: string) => {
    setNodes(prev => prev.map(node => 
      node.id === id ? { ...node, text } : node
    ));
  };

  const removeNode = (id: string) => {
    setNodes(prev => {
      const nodeToRemove = prev.find(n => n.id === id);
      if (!nodeToRemove) return prev;
      
      // Remove from parent's children
      const updated = prev.filter(n => n.id !== id && !isDescendant(n.id, id, prev));
      updated.forEach(node => {
        node.children = node.children.filter(childId => childId !== id);
      });
      
      return updated;
    });
  };

  const isDescendant = (nodeId: string, ancestorId: string, nodeList: CTQNode[]): boolean => {
    const node = nodeList.find(n => n.id === nodeId);
    if (!node || !node.parent) return false;
    if (node.parent === ancestorId) return true;
    return isDescendant(node.parent, ancestorId, nodeList);
  };

  const exportResults = () => {
    const results = `
CTQ TREE ANALYSIS
================

${nodes.map(node => `
${'  '.repeat(getLevelDepth(node.level))}${node.level.toUpperCase()}: ${node.text}
`).join('')}

TREE STRUCTURE:
${buildTreeText(nodes.find(n => n.level === 'voice'), nodes, 0)}

Analysis Date: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([results], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ctq-tree-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getLevelDepth = (level: string) => {
    const depths = { voice: 0, driver: 1, requirement: 2, specification: 3 };
    return depths[level as keyof typeof depths] || 0;
  };

  const buildTreeText = (node: CTQNode | undefined, nodeList: CTQNode[], depth: number): string => {
    if (!node) return '';
    
    let result = '  '.repeat(depth) + `• ${node.text}\n`;
    node.children.forEach(childId => {
      const child = nodeList.find(n => n.id === childId);
      result += buildTreeText(child, nodeList, depth + 1);
    });
    return result;
  };

  const reset = () => {
    setNodes([
      { id: "1", text: "Voice of Customer", level: "voice", children: ["2"] },
      { id: "2", text: "High Quality Product", level: "driver", parent: "1", children: ["3", "4"] },
      { id: "3", text: "Defect Free", level: "requirement", parent: "2", children: ["5"] },
      { id: "4", text: "Reliable Performance", level: "requirement", parent: "2", children: ["6"] },
      { id: "5", text: "< 0.1% Defect Rate", level: "specification", parent: "3", children: [] },
      { id: "6", text: "99.9% Uptime", level: "specification", parent: "4", children: [] }
    ]);
  };

  const renderNode = (node: CTQNode, depth: number = 0) => {
    const levelColors = {
      voice: "bg-primary/20 border-primary/40",
      driver: "bg-secondary/20 border-secondary/40", 
      requirement: "bg-accent/20 border-accent/40",
      specification: "bg-muted border-border"
    };

    return (
      <div key={node.id} className={`ml-${depth * 8}`}>
        <div className={`p-3 rounded-lg border-2 ${levelColors[node.level]} mb-2`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-xs uppercase font-semibold text-muted-foreground mb-1">
                {node.level}
              </div>
              <Input
                value={node.text}
                onChange={(e) => updateNode(node.id, e.target.value)}
                className="border-none bg-transparent p-0 text-sm font-medium"
              />
            </div>
            <div className="flex gap-1 ml-2">
              {node.level !== 'specification' && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    const nextLevel = {
                      voice: 'driver',
                      driver: 'requirement', 
                      requirement: 'specification'
                    }[node.level] as CTQNode["level"];
                    addNode(node.id, nextLevel);
                  }}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              )}
              {node.level !== 'voice' && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeNode(node.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {node.children.map(childId => {
          const child = nodes.find(n => n.id === childId);
          return child ? renderNode(child, depth + 1) : null;
        })}
      </div>
    );
  };

  return (
    <Card className="card-professional">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TreePine className="h-6 w-6 text-primary" />
            <CardTitle>CTQ Tree (Critical to Quality)</CardTitle>
          </div>
          <div className="flex gap-2">
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleExcelUpload}
                className="hidden"
              />
              <Button variant="outline" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Excel
                </span>
              </Button>
            </label>
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="analytics" onClick={exportResults}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tree" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tree">CTQ Tree</TabsTrigger>
            <TabsTrigger value="guide">Usage Guide</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tree" className="space-y-4">
            <div className="space-y-4">
              {nodes.filter(node => node.level === 'voice').map(node => renderNode(node))}
            </div>
          </TabsContent>
          
          <TabsContent value="guide">
            <div className="space-y-4">
              <h4 className="font-semibold">CTQ Tree Levels:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="p-3 bg-primary/20 border-2 border-primary/40 rounded-lg">
                    <h5 className="font-semibold text-primary">Voice of Customer</h5>
                    <p className="text-sm">High-level customer needs and expectations</p>
                  </div>
                  <div className="p-3 bg-secondary/20 border-2 border-secondary/40 rounded-lg">
                    <h5 className="font-semibold text-secondary">Drivers</h5>
                    <p className="text-sm">Key categories that drive customer satisfaction</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-accent/20 border-2 border-accent/40 rounded-lg">
                    <h5 className="font-semibold text-accent">Requirements</h5>
                    <p className="text-sm">Specific requirements to meet drivers</p>
                  </div>
                  <div className="p-3 bg-muted border-2 border-border rounded-lg">
                    <h5 className="font-semibold">Specifications</h5>
                    <p className="text-sm">Measurable specifications with targets</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-muted/30 rounded-lg">
                <h5 className="font-semibold mb-2">Excel Import Format:</h5>
                <p className="text-sm mb-2">Columns: Level, Text, Parent</p>
                <div className="text-xs font-mono bg-background p-2 rounded">
                  Level | Text | Parent<br/>
                  voice | Customer Satisfaction | <br/>
                  driver | Quality | 1<br/>
                  requirement | Defect Free | 2
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}