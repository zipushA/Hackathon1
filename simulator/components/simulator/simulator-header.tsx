"use client"

import { Shield, Settings, HelpCircle, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface SimulatorHeaderProps {
  agentName: string
  sessionNumber: number
}

export function SimulatorHeader({ agentName, sessionNumber }: SimulatorHeaderProps) {
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold">סימולטור שירות לקוחות</h1>
              <p className="text-xs text-muted-foreground">מערכת אימון לנציגי ביטוח</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-secondary/50">
            סשן #{sessionNumber}
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 pl-4 border-l border-border">
            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-sm">
              <p className="font-medium">{agentName}</p>
              <p className="text-xs text-muted-foreground">נציג מתאמן</p>
            </div>
          </div>
          
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <HelpCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
