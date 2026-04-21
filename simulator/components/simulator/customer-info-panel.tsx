"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Phone, FileText, AlertCircle, Calendar, Shield } from "lucide-react"

interface CustomerInfo {
  name: string
  phone: string
  policyNumber: string
  policyType: string
  status: "active" | "pending" | "expired"
  lastContact: string
  priority: "low" | "medium" | "high"
}

interface CustomerInfoPanelProps {
  customer: CustomerInfo
}

export function CustomerInfoPanel({ customer }: CustomerInfoPanelProps) {
  const statusLabels = {
    active: "פעיל",
    pending: "ממתין",
    expired: "פג תוקף"
  }

  const priorityLabels = {
    low: "נמוכה",
    medium: "בינונית",
    high: "גבוהה"
  }

  const priorityColors = {
    low: "bg-success/20 text-success border-success/30",
    medium: "bg-warning/20 text-warning border-warning/30",
    high: "bg-destructive/20 text-destructive border-destructive/30"
  }

  const statusColors = {
    active: "bg-success/20 text-success border-success/30",
    pending: "bg-warning/20 text-warning border-warning/30",
    expired: "bg-destructive/20 text-destructive border-destructive/30"
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="h-5 w-5 text-primary" />
          פרטי לקוח
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">שם מלא</span>
            <span className="font-medium">{customer.name}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              טלפון
            </span>
            <span className="font-mono text-sm">{customer.phone}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              מספר פוליסה
            </span>
            <span className="font-mono text-sm">{customer.policyNumber}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" />
              סוג ביטוח
            </span>
            <span className="text-sm">{customer.policyType}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              פנייה אחרונה
            </span>
            <span className="text-sm">{customer.lastContact}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <Badge variant="outline" className={statusColors[customer.status]}>
            {statusLabels[customer.status]}
          </Badge>
          <Badge variant="outline" className={priorityColors[customer.priority]}>
            <AlertCircle className="h-3 w-3 ml-1" />
            עדיפות {priorityLabels[customer.priority]}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
