import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge } from "lucide-react";

export function GageRRTool() {
  return (
    <Card className="card-professional">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Gauge className="h-6 w-6 text-primary" />
          <CardTitle>Gage R&R Study Tool</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Measurement system analysis coming soon</p>
        </div>
      </CardContent>
    </Card>
  );
}