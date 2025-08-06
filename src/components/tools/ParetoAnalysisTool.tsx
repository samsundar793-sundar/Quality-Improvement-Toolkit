import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Upload, Download, RotateCcw, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from "recharts";

interface ParetoItem {
  category: string;
  count: number;
  percentage: number;
  cumulativePercentage: number;
}

interface ParetoData {
  items: ParetoItem[];
  totalCount: number;
  eightyPercentLine: number;
}

export function ParetoAnalysisTool() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<ParetoData | null>(null);
  const [rawItems, setRawItems] = useState([{ category: "", count: 0 }]);

  const calculatePareto = (items: { category: string; count: number }[]): ParetoData => {
    const validItems = items.filter(item => item.category.trim() && item.count > 0);
    const totalCount = validItems.reduce((sum, item) => sum + item.count, 0);
    
    // Sort by count descending
    const sortedItems = validItems.sort((a, b) => b.count - a.count);
    
    let cumulativeCount = 0;
    const paretoItems: ParetoItem[] = sortedItems.map(item => {
      cumulativeCount += item.count;
      const percentage = (item.count / totalCount) * 100;
      const cumulativePercentage = (cumulativeCount / totalCount) * 100;
      
      return {
        category: item.category,
        count: item.count,
        percentage,
        cumulativePercentage
      };
    });

    return {
      items: paretoItems,
      totalCount,
      eightyPercentLine: 80
    };
  };

  const addItem = () => {
    setRawItems(prev => [...prev, { category: "", count: 0 }]);
  };

  const removeItem = (index: number) => {
    if (rawItems.length > 1) {
      setRawItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: 'category' | 'count', value: string | number) => {
    setRawItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const processData = () => {
    try {
      const validItems = rawItems.filter(item => item.category.trim() && item.count > 0);
      
      if (validItems.length < 2) {
        toast({
          title: "Error",
          description: "Please enter at least 2 valid categories with counts.",
          variant: "destructive"
        });
        return;
      }

      const paretoData = calculatePareto(validItems);
      setData(paretoData);
      
      toast({
        title: "Analysis Complete",
        description: `Pareto analysis generated for ${validItems.length} categories.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process data. Please check your inputs.",
        variant: "destructive"
      });
    }
  };

  const generateSampleData = () => {
    setRawItems([
      { category: "Defective Product", count: 45 },
      { category: "Late Delivery", count: 30 },
      { category: "Wrong Order", count: 15 },
      { category: "Damaged Packaging", count: 8 },
      { category: "Missing Items", count: 7 },
      { category: "Poor Customer Service", count: 3 },
      { category: "Payment Issues", count: 2 }
    ]);
    
    toast({
      title: "Sample Data Generated",
      description: "Customer complaint sample data loaded."
    });
  };

  const exportResults = () => {
    if (!data) return;

    const vitalFew = data.items.filter(item => item.cumulativePercentage <= 80);
    const usefulMany = data.items.filter(item => item.cumulativePercentage > 80);

    const results = `
PARETO ANALYSIS RESULTS
======================

Total Count: ${data.totalCount}
Number of Categories: ${data.items.length}

VITAL FEW (Top 80%):
${vitalFew.map((item, index) => 
  `${index + 1}. ${item.category}: ${item.count} (${item.percentage.toFixed(1)}%) - Cumulative: ${item.cumulativePercentage.toFixed(1)}%`
).join('\n')}

USEFUL MANY (Remaining 20%):
${usefulMany.map((item, index) => 
  `${index + 1}. ${item.category}: ${item.count} (${item.percentage.toFixed(1)}%) - Cumulative: ${item.cumulativePercentage.toFixed(1)}%`
).join('\n')}

KEY INSIGHTS:
- Focus on the top ${vitalFew.length} categories which represent ${((vitalFew.reduce((sum, item) => sum + item.count, 0) / data.totalCount) * 100).toFixed(1)}% of all issues
- The vital few categories are: ${vitalFew.map(item => item.category).join(', ')}

Analysis Date: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([results], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pareto-analysis-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setData(null);
    setRawItems([{ category: "", count: 0 }]);
  };

  return (
    <Card className="card-professional">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PieChart className="h-6 w-6 text-primary" />
            <CardTitle>Pareto Analysis (80/20 Rule)</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            {data && (
              <Button variant="analytics" onClick={exportResults}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="input" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input">Data Input</TabsTrigger>
            <TabsTrigger value="results">Analysis Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="input" className="space-y-4">
            <div className="flex gap-2">
              <Button variant="outline" onClick={generateSampleData}>
                Load Sample Data
              </Button>
              <Button variant="outline" onClick={addItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>
            
            <div className="space-y-3">
              <Label className="text-lg font-semibold">Categories and Counts</Label>
              {rawItems.map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    placeholder="Category name"
                    value={item.category}
                    onChange={(e) => updateItem(index, 'category', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Count"
                    value={item.count || ""}
                    onChange={(e) => updateItem(index, 'count', parseInt(e.target.value) || 0)}
                    className="w-24"
                    min="0"
                  />
                  {rawItems.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            <Button variant="professional" onClick={processData} className="w-full">
              Generate Pareto Analysis
            </Button>
          </TabsContent>
          
          <TabsContent value="results">
            {data ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{data.totalCount}</div>
                    <div className="text-sm text-muted-foreground">Total Count</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{data.items.length}</div>
                    <div className="text-sm text-muted-foreground">Categories</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {data.items.filter(item => item.cumulativePercentage <= 80).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Vital Few</div>
                  </div>
                </div>

                {/* Pareto Chart */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Pareto Chart</h4>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={data.items} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="category" 
                          tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis 
                          yAxisId="left"
                          tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                          label={{ value: 'Count', angle: -90, position: 'insideLeft' }}
                        />
                        <YAxis 
                          yAxisId="right" 
                          orientation="right"
                          tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                          label={{ value: 'Cumulative %', angle: 90, position: 'insideRight' }}
                          domain={[0, 100]}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px"
                          }}
                          formatter={(value, name) => [
                            name === 'count' ? value : `${value}%`,
                            name === 'count' ? 'Count' : 'Cumulative %'
                          ]}
                        />
                        <Legend />
                        <Bar 
                          yAxisId="left"
                          dataKey="count" 
                          name="Count"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.8}
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="cumulativePercentage" 
                          name="Cumulative %"
                          stroke="hsl(var(--destructive))" 
                          strokeWidth={3}
                          dot={{ fill: "hsl(var(--destructive))", strokeWidth: 2, r: 4 }}
                        />
                        <ReferenceLine 
                          yAxisId="right"
                          y={80} 
                          stroke="hsl(var(--warning))" 
                          strokeDasharray="5 5" 
                          strokeWidth={2}
                          label={{ value: "80% Line", position: "top" }}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Pareto Analysis Results</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-border">
                      <thead>
                        <tr className="bg-muted/30">
                          <th className="border border-border p-2 text-left">Rank</th>
                          <th className="border border-border p-2 text-left">Category</th>
                          <th className="border border-border p-2 text-right">Count</th>
                          <th className="border border-border p-2 text-right">%</th>
                          <th className="border border-border p-2 text-right">Cumulative %</th>
                          <th className="border border-border p-2 text-center">80% Rule</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.items.map((item, index) => (
                          <tr key={index} className={item.cumulativePercentage <= 80 ? "bg-primary/5" : ""}>
                            <td className="border border-border p-2">{index + 1}</td>
                            <td className="border border-border p-2">{item.category}</td>
                            <td className="border border-border p-2 text-right">{item.count}</td>
                            <td className="border border-border p-2 text-right">{item.percentage.toFixed(1)}%</td>
                            <td className="border border-border p-2 text-right">{item.cumulativePercentage.toFixed(1)}%</td>
                            <td className="border border-border p-2 text-center">
                              {item.cumulativePercentage <= 80 ? 
                                <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-2 py-1 rounded text-xs font-medium">Vital Few</span> : 
                                <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded text-xs font-medium">Useful Many</span>
                              }
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h5 className="font-semibold mb-2">Key Insights:</h5>
                  <ul className="space-y-1 text-sm">
                    <li>• Focus on the top {data.items.filter(item => item.cumulativePercentage <= 80).length} categories (Vital Few)</li>
                    <li>• These represent {((data.items.filter(item => item.cumulativePercentage <= 80).reduce((sum, item) => sum + item.count, 0) / data.totalCount) * 100).toFixed(1)}% of all occurrences</li>
                    <li>• Prioritize improvements in: {data.items.filter(item => item.cumulativePercentage <= 80).map(item => item.category).join(', ')}</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No analysis generated yet. Please input data and click "Generate Pareto Analysis".</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}