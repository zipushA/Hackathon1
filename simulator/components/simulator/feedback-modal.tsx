"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Award, 
  RotateCcw, 
  UserCheck, 
  Ear, 
  Heart, 
  MessageSquare, 
  CheckCircle,
  Download
} from "lucide-react"
import { cn } from "@/lib/utils"

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  feedback: string
  scores: Record<string, number | string>
  onRestart: () => void
}

const scoreLabels: Record<string, { label: string; icon: React.ReactNode }> = {
  AUTH: { label: "זיהוי לקוח", icon: <UserCheck className="h-4 w-4" /> },
  LISTEN: { label: "הקשבה", icon: <Ear className="h-4 w-4" /> },
  RELATE: { label: "התייחסות רגשית", icon: <Heart className="h-4 w-4" /> },
  EXPLAIN: { label: "הסבר מקצועי", icon: <MessageSquare className="h-4 w-4" /> },
  SUMMARY: { label: "סיכום", icon: <CheckCircle className="h-4 w-4" /> },
}

function getScoreColor(score: number): string {
  if (score >= 8) return "text-green-500"
  if (score >= 6) return "text-yellow-500"
  return "text-red-500"
}

function getProgressColor(score: number): string {
  if (score >= 8) return "bg-green-500"
  if (score >= 6) return "bg-yellow-500"
  return "bg-red-500"
}

export function FeedbackModal({ 
  isOpen, 
  onClose, 
  feedback, 
  scores, 
  onRestart 
}: FeedbackModalProps) {
  const overallScore = typeof scores.REVIEW === "number" 
    ? scores.REVIEW 
    : parseFloat(String(scores.REVIEW)) || 0

  const handleDownloadReport = () => {
    const report = `
דוח משוב - סימולציית שירות לקוחות
====================================

תאריך: ${scores.DATE || new Date().toLocaleDateString("he-IL")}
נציג: ${scores.AGENT || "לא צוין"}

ציונים:
-------
זיהוי לקוח (AUTH): ${scores.AUTH}/10
הקשבה (LISTEN): ${scores.LISTEN}/10
התייחסות רגשית (RELATE): ${scores.RELATE}/10
הסבר מקצועי (EXPLAIN): ${scores.EXPLAIN}/10
סיכום (SUMMARY): ${scores.SUMMARY}/10

ציון כללי: ${scores.REVIEW}/10

משוב מפורט:
-----------
${feedback}

סיכום:
------
${scores.DSC_REVIEW || ""}
    `.trim()

    const blob = new Blob([report], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `feedback-report-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Award className="h-6 w-6 text-primary" />
            משוב על השיחה
          </DialogTitle>
          <DialogDescription>
            סיכום וניתוח ביצועי הנציג בסימולציה
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-1">
          <div className="space-y-6 pb-4">
            {/* Overall Score */}
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-6 text-center">
                <div className="text-6xl font-bold text-primary mb-2">
                  {overallScore.toFixed(1)}
                </div>
                <div className="text-muted-foreground">ציון כללי מתוך 10</div>
                <Progress 
                  value={overallScore * 10} 
                  className="mt-4 h-3"
                />
              </CardContent>
            </Card>

            {/* Individual Scores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(scoreLabels).map(([key, { label, icon }]) => {
                const score = typeof scores[key] === "number" 
                  ? scores[key] as number
                  : parseFloat(String(scores[key])) || 0
                
                return (
                  <Card key={key} className="bg-card">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-sm">
                          {icon}
                          <span>{label}</span>
                        </div>
                        <span className={cn("text-lg font-bold", getScoreColor(score))}>
                          {score}/10
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full transition-all", getProgressColor(score))}
                          style={{ width: `${score * 10}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Detailed Feedback */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  משוב מפורט
                </h3>
                <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {feedback}
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            {scores.DSC_REVIEW && (
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">סיכום</h3>
                  <p className="text-sm text-muted-foreground">
                    {scores.DSC_REVIEW}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={onRestart} className="flex-1 gap-2">
            <RotateCcw className="h-4 w-4" />
            התחל סימולציה חדשה
          </Button>
          <Button variant="outline" onClick={handleDownloadReport} className="gap-2">
            <Download className="h-4 w-4" />
            הורד דוח
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
