import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "lucide-react";

export function ParetoChartTool() {
  return (
    <Card className="card-professional">
      <CardHeader>
        <div className="flex items-center gap-3">
          <PieChart className="h-6 w-6 text-primary" />
          <CardTitle>Pareto Chart Tool</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Interactive Pareto analysis coming soon</p>
        </div>
      </CardContent>
    </Card>
  );
}