import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export function HistogramTool() {
  return (
    <Card className="card-professional">
      <CardHeader>
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-primary" />
          <CardTitle>Histogram Analysis Tool</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Interactive histogram tool coming soon</p>
        </div>
      </CardContent>
    </Card>
  );
}