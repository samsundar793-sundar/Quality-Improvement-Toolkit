import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, XCircle, RefreshCcw } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area, BarChart, Bar } from "recharts";

interface MetricData {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: "up" | "down" | "stable";
  status: "good" | "warning" | "critical";
  history: { time: string; value: number }[];
}

interface Alert {
  id: string;
  type: "warning" | "critical";
  message: string;
  timestamp: string;
  resolved: boolean;
}

export function MonitoringDashboardTool() {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isLive, setIsLive] = useState(false);

  // Generate sample real-time data
  const generateSampleData = (): MetricData[] => {
    const baseTime = Date.now();
    return [
      {
        id: "defect-rate",
        name: "Defect Rate",
        value: Math.random() * 5 + 1,
        target: 2.0,
        unit: "%",
        trend: Math.random() > 0.5 ? "up" : "down",
        status: Math.random() > 0.7 ? "warning" : "good",
        history: Array.from({ length: 20 }, (_, i) => ({
          time: new Date(baseTime - (19 - i) * 60000).toLocaleTimeString(),
          value: Math.random() * 5 + 1
        }))
      },
      {
        id: "throughput",
        name: "Throughput",
        value: Math.floor(Math.random() * 200 + 800),
        target: 1000,
        unit: "units/hr",
        trend: Math.random() > 0.3 ? "up" : "down",
        status: Math.random() > 0.8 ? "critical" : "good",
        history: Array.from({ length: 20 }, (_, i) => ({
          time: new Date(baseTime - (19 - i) * 60000).toLocaleTimeString(),
          value: Math.floor(Math.random() * 200 + 800)
        }))
      },
      {
        id: "cycle-time",
        name: "Cycle Time",
        value: Math.random() * 10 + 15,
        target: 20.0,
        unit: "minutes",
        trend: Math.random() > 0.4 ? "down" : "up",
        status: Math.random() > 0.6 ? "warning" : "good",
        history: Array.from({ length: 20 }, (_, i) => ({
          time: new Date(baseTime - (19 - i) * 60000).toLocaleTimeString(),
          value: Math.random() * 10 + 15
        }))
      },
      {
        id: "oee",
        name: "Overall Equipment Effectiveness",
        value: Math.random() * 20 + 75,
        target: 85.0,
        unit: "%",
        trend: Math.random() > 0.5 ? "up" : "stable",
        status: Math.random() > 0.7 ? "warning" : "good",
        history: Array.from({ length: 20 }, (_, i) => ({
          time: new Date(baseTime - (19 - i) * 60000).toLocaleTimeString(),
          value: Math.random() * 20 + 75
        }))
      },
      {
        id: "customer-satisfaction",
        name: "Customer Satisfaction",
        value: Math.random() * 1 + 4,
        target: 4.5,
        unit: "/5",
        trend: Math.random() > 0.6 ? "up" : "stable",
        status: "good",
        history: Array.from({ length: 20 }, (_, i) => ({
          time: new Date(baseTime - (19 - i) * 60000).toLocaleTimeString(),
          value: Math.random() * 1 + 4
        }))
      },
      {
        id: "cost-savings",
        name: "Cost Savings",
        value: Math.floor(Math.random() * 50000 + 25000),
        target: 50000,
        unit: "$",
        trend: "up",
        status: "good",
        history: Array.from({ length: 20 }, (_, i) => ({
          time: new Date(baseTime - (19 - i) * 60000).toLocaleTimeString(),
          value: Math.floor(Math.random() * 50000 + 25000)
        }))
      }
    ];
  };

  const generateAlerts = (metricsData: MetricData[]): Alert[] => {
    const newAlerts: Alert[] = [];
    const baseTime = Date.now();

    metricsData.forEach(metric => {
      if (metric.status === "critical") {
        newAlerts.push({
          id: `alert-${metric.id}-${Date.now()}`,
          type: "critical",
          message: `${metric.name} is critically outside target (${metric.value.toFixed(1)}${metric.unit} vs target ${metric.target}${metric.unit})`,
          timestamp: new Date(baseTime - Math.random() * 300000).toLocaleString(),
          resolved: false
        });
      } else if (metric.status === "warning") {
        newAlerts.push({
          id: `alert-${metric.id}-${Date.now()}`,
          type: "warning",
          message: `${metric.name} approaching target threshold (${metric.value.toFixed(1)}${metric.unit})`,
          timestamp: new Date(baseTime - Math.random() * 600000).toLocaleString(),
          resolved: Math.random() > 0.7
        });
      }
    });

    return newAlerts;
  };

  const refreshData = () => {
    const newMetrics = generateSampleData();
    const newAlerts = generateAlerts(newMetrics);
    setMetrics(newMetrics);
    setAlerts(newAlerts);
    setLastUpdate(new Date());
  };

  const toggleLiveMode = () => {
    setIsLive(!isLive);
  };

  useEffect(() => {
    // Initial data load
    refreshData();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLive) {
      interval = setInterval(refreshData, 5000); // Update every 5 seconds in live mode
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLive]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good": return "text-green-500";
      case "warning": return "text-yellow-500";
      case "critical": return "text-red-500";
      default: return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "critical": return <XCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down": return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      case "stable": return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="card-professional">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-primary" />
              <CardTitle>Process Monitoring Dashboard</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isLive ? "default" : "outline"}>
                {isLive ? "LIVE" : "STATIC"}
              </Badge>
              <Button variant="outline" size="sm" onClick={toggleLiveMode}>
                {isLive ? "Stop Live" : "Start Live"}
              </Button>
              <Button variant="outline" size="sm" onClick={refreshData}>
                <RefreshCcw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdate.toLocaleString()}
          </p>
        </CardHeader>
      </Card>

      {/* Active Alerts */}
      {alerts.filter(a => !a.resolved).length > 0 && (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.filter(a => !a.resolved).map(alert => (
                <div key={alert.id} className={`p-3 rounded-lg border ${
                  alert.type === "critical" ? "bg-red-50 border-red-200 dark:bg-red-950/20" : 
                  "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20"
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      {alert.type === "critical" ? 
                        <XCircle className="h-5 w-5 text-red-500 mt-0.5" /> :
                        <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      }
                      <div>
                        <p className="font-medium">{alert.message}</p>
                        <p className="text-sm text-muted-foreground">{alert.timestamp}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map(metric => (
          <Card key={metric.id} className="card-professional">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">{metric.name}</h4>
                <div className="flex items-center gap-1">
                  {getStatusIcon(metric.status)}
                  {getTrendIcon(metric.trend)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                    {metric.value.toFixed(metric.unit === "$" ? 0 : 1)}
                  </span>
                  <span className="text-sm text-muted-foreground">{metric.unit}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Target: {metric.target}{metric.unit}
                </div>
                
                {/* Mini trend chart */}
                <div className="h-16 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={metric.history.slice(-10)}>
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary))"
                        fillOpacity={0.3}
                        strokeWidth={1}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Process Performance Trend */}
        <Card className="card-professional">
          <CardHeader>
            <CardTitle className="text-lg">Process Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics[0]?.history || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 10, fill: "hsl(var(--foreground))" }}
                  />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--foreground))" }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Comparison */}
        <Card className="card-professional">
          <CardHeader>
            <CardTitle className="text-lg">Current vs Target</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.map(m => ({ 
                  name: m.name.split(' ').slice(0, 2).join(' '), 
                  current: m.value, 
                  target: m.target 
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 10, fill: "hsl(var(--foreground))" }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--foreground))" }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Bar dataKey="current" fill="hsl(var(--primary))" name="Current" />
                  <Bar dataKey="target" fill="hsl(var(--muted))" name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}