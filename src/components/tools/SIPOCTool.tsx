import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, Download, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SIPOCData {
  suppliers: string[];
  inputs: string[];
  process: string[];
  outputs: string[];
  customers: string[];
}

export function SIPOCTool() {
  const { toast } = useToast();
  const [sipoc, setSipoc] = useState<SIPOCData>({
    suppliers: [""],
    inputs: [""],
    process: [""],
    outputs: [""],
    customers: [""]
  });

  const addItem = (category: keyof SIPOCData) => {
    setSipoc(prev => ({
      ...prev,
      [category]: [...prev[category], ""]
    }));
  };

  const removeItem = (category: keyof SIPOCData, index: number) => {
    setSipoc(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index)
    }));
  };

  const updateItem = (category: keyof SIPOCData, index: number, value: string) => {
    setSipoc(prev => ({
      ...prev,
      [category]: prev[category].map((item, i) => i === index ? value : item)
    }));
  };

  const loadTemplate = () => {
    setSipoc({
      suppliers: [
        "Raw material vendor", 
        "Equipment supplier", 
        "Information systems"
      ],
      inputs: [
        "Raw materials", 
        "Work orders", 
        "Quality specifications", 
        "Equipment"
      ],
      process: [
        "Receive order", 
        "Plan production", 
        "Process materials", 
        "Quality check", 
        "Package product", 
        "Ship to customer"
      ],
      outputs: [
        "Finished product", 
        "Quality certificates", 
        "Shipping documents", 
        "Invoice"
      ],
      customers: [
        "End customers", 
        "Distributors", 
        "Retail stores"
      ]
    });
    
    toast({
      title: "Template Loaded",
      description: "Sample SIPOC diagram has been loaded.",
    });
  };

  const exportSIPOC = () => {
    const sipocText = `
SIPOC DIAGRAM
=============

SUPPLIERS:
${sipoc.suppliers.filter(s => s.trim()).map((s, i) => `${i + 1}. ${s}`).join('\n')}

INPUTS:
${sipoc.inputs.filter(s => s.trim()).map((s, i) => `${i + 1}. ${s}`).join('\n')}

PROCESS:
${sipoc.process.filter(s => s.trim()).map((s, i) => `${i + 1}. ${s}`).join('\n')}

OUTPUTS:
${sipoc.outputs.filter(s => s.trim()).map((s, i) => `${i + 1}. ${s}`).join('\n')}

CUSTOMERS:
${sipoc.customers.filter(s => s.trim()).map((s, i) => `${i + 1}. ${s}`).join('\n')}
    `;

    const blob = new Blob([sipocText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sipoc-diagram-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "SIPOC Exported",
      description: "SIPOC diagram has been downloaded.",
    });
  };

  const reset = () => {
    setSipoc({
      suppliers: [""],
      inputs: [""],
      process: [""],
      outputs: [""],
      customers: [""]
    });
  };

  const renderCategory = (
    title: string, 
    category: keyof SIPOCData, 
    color: string
  ) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className={`text-lg font-semibold ${color}`}>{title}</Label>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => addItem(category)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2">
        {sipoc[category].map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) => updateItem(category, index, e.target.value)}
              placeholder={`Enter ${title.toLowerCase().slice(0, -1)}`}
            />
            {sipoc[category].length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeItem(category, index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card className="card-professional">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>SIPOC Diagram</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" onClick={loadTemplate}>
              Load Template
            </Button>
            <Button variant="analytics" onClick={exportSIPOC}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {renderCategory("Suppliers", "suppliers", "text-blue-500")}
          {renderCategory("Inputs", "inputs", "text-green-500")}
          {renderCategory("Process", "process", "text-yellow-500")}
          {renderCategory("Outputs", "outputs", "text-orange-500")}
          {renderCategory("Customers", "customers", "text-purple-500")}
        </div>
        
        {/* Visual Flow */}
        <div className="mt-8 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-center text-sm text-muted-foreground">
            <span className="text-blue-500 font-medium">Suppliers</span>
            <span className="mx-2">→</span>
            <span className="text-green-500 font-medium">Inputs</span>
            <span className="mx-2">→</span>
            <span className="text-yellow-500 font-medium">Process</span>
            <span className="mx-2">→</span>
            <span className="text-orange-500 font-medium">Outputs</span>
            <span className="mx-2">→</span>
            <span className="text-purple-500 font-medium">Customers</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}