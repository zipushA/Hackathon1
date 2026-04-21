"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart3, ThumbsUp, Clock, MessageCircle, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface Metrics {
  customerSatisfaction: number
  responseTime: number
  solutionRate: number
  empathyScore: number
}

interface PerformanceMetricsProps {
  metrics: Metrics
  isCallActive: boolean
}

export function PerformanceMetrics({ metrics, isCallActive }: PerformanceMetricsProps) {
  const metricItems = [
    {
      label: "שביעות רצון לקוח",
      value: metrics.customerSatisfaction,
      icon: ThumbsUp,
      color: "bg-success"
    },
    {
      label: "זמן תגובה",
      value: metrics.responseTime,
      icon: Clock,
      color: "bg-info"
    },
    {
      label: "אחוז פתרון",
      value: metrics.solutionRate,
      icon: MessageCircle,
      color: "bg-primary"
    },
    {
      label: "ציון אמפתיה",
      value: metrics.empathyScore,
      icon: TrendingUp,
      color: "bg-warning"
    }
  ]

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="h-5 w-5 text-primary" />
          מדדי ביצוע
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {metricItems.map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </div>
              <span className={cn(
                "font-medium",
                isCallActive ? "text-foreground" : "text-muted-foreground"
              )}>
                {item.value}%
              </span>
            </div>
            <Progress 
              value={item.value} 
              className={cn(
                "h-2",
                !isCallActive && "opacity-50"
              )}
            />
          </div>
        ))}
        
        {!isCallActive && (
          <p className="text-xs text-center text-muted-foreground pt-2">
            התחל שיחה כדי לראות מדדים בזמן אמת
          </p>
        )}
      </CardContent>
    </Card>
  )
}
