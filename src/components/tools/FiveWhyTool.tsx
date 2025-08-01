import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

export function FiveWhyTool() {
  return (
    <Card className="card-professional">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Search className="h-6 w-6 text-primary" />
          <CardTitle>5 Why Analysis Tool</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Root cause analysis tool coming soon</p>
        </div>
      </CardContent>
    </Card>
  );
}