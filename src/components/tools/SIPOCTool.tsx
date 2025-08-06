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
        
        {/* Visual SIPOC Diagram */}
        <div className="mt-8 p-6 bg-muted/30 rounded-lg">
          <h4 className="text-lg font-semibold mb-4 text-center">SIPOC Visual Flow</h4>
          <div className="relative overflow-x-auto">
            <svg width="100%" height="200" viewBox="0 0 1000 200" className="min-w-[800px]">
              {/* Boxes */}
              <rect x="20" y="60" width="160" height="80" rx="8" fill="hsl(var(--primary))" fillOpacity="0.1" stroke="hsl(var(--primary))" strokeWidth="2"/>
              <rect x="220" y="60" width="160" height="80" rx="8" fill="hsl(var(--secondary))" fillOpacity="0.1" stroke="hsl(var(--secondary))" strokeWidth="2"/>
              <rect x="420" y="60" width="160" height="80" rx="8" fill="hsl(var(--accent))" fillOpacity="0.1" stroke="hsl(var(--accent))" strokeWidth="2"/>
              <rect x="620" y="60" width="160" height="80" rx="8" fill="hsl(var(--primary))" fillOpacity="0.1" stroke="hsl(var(--primary))" strokeWidth="2"/>
              <rect x="820" y="60" width="160" height="80" rx="8" fill="hsl(var(--secondary))" fillOpacity="0.1" stroke="hsl(var(--secondary))" strokeWidth="2"/>
              
              {/* Arrows */}
              <path d="M180 100 L220 100" stroke="hsl(var(--foreground))" strokeWidth="2" markerEnd="url(#arrowhead)"/>
              <path d="M380 100 L420 100" stroke="hsl(var(--foreground))" strokeWidth="2" markerEnd="url(#arrowhead)"/>
              <path d="M580 100 L620 100" stroke="hsl(var(--foreground))" strokeWidth="2" markerEnd="url(#arrowhead)"/>
              <path d="M780 100 L820 100" stroke="hsl(var(--foreground))" strokeWidth="2" markerEnd="url(#arrowhead)"/>
              
              {/* Arrow marker */}
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--foreground))" />
                </marker>
              </defs>
              
              {/* Labels */}
              <text x="100" y="50" textAnchor="middle" className="fill-primary font-semibold text-sm">Suppliers</text>
              <text x="300" y="50" textAnchor="middle" className="fill-secondary-foreground font-semibold text-sm">Inputs</text>
              <text x="500" y="50" textAnchor="middle" className="fill-accent-foreground font-semibold text-sm">Process</text>
              <text x="700" y="50" textAnchor="middle" className="fill-primary font-semibold text-sm">Outputs</text>
              <text x="900" y="50" textAnchor="middle" className="fill-secondary-foreground font-semibold text-sm">Customers</text>
              
              {/* Content preview */}
              <text x="100" y="95" textAnchor="middle" className="fill-foreground text-xs">
                {sipoc.suppliers.filter(s => s.trim()).slice(0, 2).join(", ") || "Add suppliers..."}
              </text>
              <text x="100" y="110" textAnchor="middle" className="fill-muted-foreground text-xs">
                +{Math.max(0, sipoc.suppliers.filter(s => s.trim()).length - 2)} more
              </text>
              
              <text x="300" y="95" textAnchor="middle" className="fill-foreground text-xs">
                {sipoc.inputs.filter(s => s.trim()).slice(0, 2).join(", ") || "Add inputs..."}
              </text>
              <text x="300" y="110" textAnchor="middle" className="fill-muted-foreground text-xs">
                +{Math.max(0, sipoc.inputs.filter(s => s.trim()).length - 2)} more
              </text>
              
              <text x="500" y="95" textAnchor="middle" className="fill-foreground text-xs">
                {sipoc.process.filter(s => s.trim()).slice(0, 2).join(", ") || "Add process..."}
              </text>
              <text x="500" y="110" textAnchor="middle" className="fill-muted-foreground text-xs">
                +{Math.max(0, sipoc.process.filter(s => s.trim()).length - 2)} more
              </text>
              
              <text x="700" y="95" textAnchor="middle" className="fill-foreground text-xs">
                {sipoc.outputs.filter(s => s.trim()).slice(0, 2).join(", ") || "Add outputs..."}
              </text>
              <text x="700" y="110" textAnchor="middle" className="fill-muted-foreground text-xs">
                +{Math.max(0, sipoc.outputs.filter(s => s.trim()).length - 2)} more
              </text>
              
              <text x="900" y="95" textAnchor="middle" className="fill-foreground text-xs">
                {sipoc.customers.filter(s => s.trim()).slice(0, 2).join(", ") || "Add customers..."}
              </text>
              <text x="900" y="110" textAnchor="middle" className="fill-muted-foreground text-xs">
                +{Math.max(0, sipoc.customers.filter(s => s.trim()).length - 2)} more
              </text>
            </svg>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}