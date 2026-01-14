import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRightLeft, Download, RotateCcw, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface IsIsNotItem {
  id: string;
  category: "what" | "where" | "when" | "extent";
  is: string;
  isNot: string;
  distinction: string;
}

export function IsIsNotTool() {
  const { toast } = useToast();
  const [problemStatement, setProblemStatement] = useState("");
  const [items, setItems] = useState<IsIsNotItem[]>([
    {
      id: "1",
      category: "what",
      is: "Defects on product surface",
      isNot: "Internal structural defects",
      distinction: "Problem is visual/cosmetic only"
    },
    {
      id: "2",
      category: "where",
      is: "Assembly Line 3",
      isNot: "Lines 1, 2, or 4",
      distinction: "Unique to Line 3 equipment or process"
    },
    {
      id: "3",
      category: "when",
      is: "After the coating process",
      isNot: "Before coating or during other steps",
      distinction: "Related to coating application"
    },
    {
      id: "4",
      category: "extent",
      is: "15% of units from Line 3",
      isNot: "100% of units or other lines",
      distinction: "Intermittent issue, not systematic"
    }
  ]);

  const categoryLabels = {
    what: { label: "WHAT", question: "What is the problem? What object has the defect?" },
    where: { label: "WHERE", question: "Where is the problem observed? Geographic location? On the object?" },
    when: { label: "WHEN", question: "When was it first observed? Any patterns in timing?" },
    extent: { label: "EXTENT", question: "How big is the problem? How many units affected?" }
  };

  const addItem = (category: IsIsNotItem["category"]) => {
    const newItem: IsIsNotItem = {
      id: Date.now().toString(),
      category,
      is: "",
      isNot: "",
      distinction: ""
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, field: keyof IsIsNotItem, value: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const loadTemplate = () => {
    setProblemStatement("Surface defects appearing on finished products from Assembly Line 3");
    setItems([
      {
        id: "1",
        category: "what",
        is: "Scratches and marks on painted surfaces",
        isNot: "Dents, cracks, or structural damage",
        distinction: "Problem is surface-level only"
      },
      {
        id: "2",
        category: "what",
        is: "Product Model X-500",
        isNot: "Models X-400, X-600, or others",
        distinction: "Specific to X-500 geometry/process"
      },
      {
        id: "3",
        category: "where",
        is: "Right side panel of product",
        isNot: "Left side, top, bottom, or back",
        distinction: "Position-specific handling issue"
      },
      {
        id: "4",
        category: "where",
        is: "Assembly Line 3 only",
        isNot: "Lines 1, 2, 4 or external suppliers",
        distinction: "Line 3 specific equipment/process"
      },
      {
        id: "5",
        category: "when",
        is: "Started 3 weeks ago (March 1st)",
        isNot: "Before March or sporadically before",
        distinction: "Something changed around March 1st"
      },
      {
        id: "6",
        category: "when",
        is: "Second shift (2pm-10pm)",
        isNot: "First or third shifts",
        distinction: "Shift-specific personnel or conditions"
      },
      {
        id: "7",
        category: "extent",
        is: "Approximately 15% of units",
        isNot: "100% or random percentages",
        distinction: "Intermittent, not continuous"
      },
      {
        id: "8",
        category: "extent",
        is: "Getting worse (started at 5%)",
        isNot: "Stable or improving",
        distinction: "Progressive degradation"
      }
    ]);
    toast({
      title: "Template Loaded",
      description: "Sample Is/Is Not analysis has been loaded."
    });
  };

  const exportAnalysis = () => {
    const exportData = `
IS/IS NOT ANALYSIS
==================

PROBLEM STATEMENT:
${problemStatement || "Not defined"}

${"=".repeat(60)}

${Object.entries(categoryLabels).map(([key, { label, question }]) => {
  const categoryItems = items.filter(item => item.category === key);
  return `
${label} - ${question}
${"-".repeat(50)}
${categoryItems.length > 0 ? categoryItems.map(item => `
IS: ${item.is}
IS NOT: ${item.isNot}
DISTINCTION: ${item.distinction}
`).join('\n') : 'No items defined'}`;
}).join('\n')}

${"=".repeat(60)}

KEY DISTINCTIONS SUMMARY:
${items.filter(i => i.distinction).map((item, idx) => `${idx + 1}. ${item.distinction}`).join('\n')}

ANALYSIS DATE: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `is-is-not-analysis-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setProblemStatement("");
    setItems([]);
  };

  const renderCategorySection = (category: IsIsNotItem["category"]) => {
    const categoryItems = items.filter(item => item.category === category);
    const { label, question } = categoryLabels[category];

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-lg">{label}</h4>
            <p className="text-sm text-muted-foreground">{question}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => addItem(category)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Row
          </Button>
        </div>

        {categoryItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-lg">
            No items yet. Click "Add Row" to start.
          </div>
        ) : (
          <div className="space-y-3">
            {categoryItems.map(item => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-7 gap-3 p-4 border border-border rounded-lg">
                <div className="md:col-span-2">
                  <Label className="text-green-600 font-medium">IS</Label>
                  <Textarea
                    value={item.is}
                    onChange={(e) => updateItem(item.id, 'is', e.target.value)}
                    placeholder="What IS the problem..."
                    rows={2}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label className="text-red-600 font-medium">IS NOT</Label>
                  <Textarea
                    value={item.isNot}
                    onChange={(e) => updateItem(item.id, 'isNot', e.target.value)}
                    placeholder="What IS NOT the problem..."
                    rows={2}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label className="text-primary font-medium">DISTINCTION</Label>
                  <Textarea
                    value={item.distinction}
                    onChange={(e) => updateItem(item.id, 'distinction', e.target.value)}
                    placeholder="What's unique or different..."
                    rows={2}
                  />
                </div>
                <div className="flex items-end">
                  <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="card-professional">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ArrowRightLeft className="h-6 w-6 text-primary" />
            <CardTitle>Is/Is Not Analysis</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadTemplate}>
              Load Template
            </Button>
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="analytics" onClick={exportAnalysis}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label className="text-lg font-semibold">Problem Statement</Label>
            <Textarea
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              placeholder="Describe the problem you are analyzing..."
              rows={2}
              className="mt-2"
            />
          </div>

          <Tabs defaultValue="what" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="what">WHAT</TabsTrigger>
              <TabsTrigger value="where">WHERE</TabsTrigger>
              <TabsTrigger value="when">WHEN</TabsTrigger>
              <TabsTrigger value="extent">EXTENT</TabsTrigger>
            </TabsList>

            <TabsContent value="what" className="mt-4">
              {renderCategorySection("what")}
            </TabsContent>
            <TabsContent value="where" className="mt-4">
              {renderCategorySection("where")}
            </TabsContent>
            <TabsContent value="when" className="mt-4">
              {renderCategorySection("when")}
            </TabsContent>
            <TabsContent value="extent" className="mt-4">
              {renderCategorySection("extent")}
            </TabsContent>
          </Tabs>

          {items.some(i => i.distinction) && (
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="text-lg">Key Distinctions Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {items.filter(i => i.distinction).map((item, idx) => (
                    <li key={item.id} className="flex gap-2">
                      <span className="font-medium text-primary">{idx + 1}.</span>
                      <span>{item.distinction}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
