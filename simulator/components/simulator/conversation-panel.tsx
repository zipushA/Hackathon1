"use client"

import { useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, User, Headphones } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Message {
  id: string
  sender: "agent" | "customer"
  text: string
  timestamp: string
  sentiment?: "positive" | "neutral" | "negative"
}

interface ConversationPanelProps {
  messages: Message[]
  isCallActive: boolean
}

export function ConversationPanel({ messages, isCallActive }: ConversationPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const sentimentColors = {
    positive: "border-r-success",
    neutral: "border-r-info",
    negative: "border-r-destructive"
  }

  return (
    <Card className="bg-card border-border h-full flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            תמלול שיחה
          </div>
          {isCallActive && (
            <div className="flex items-center gap-2 text-sm font-normal text-primary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              מקליט
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 p-0">
        <ScrollArea className="h-full px-4 pb-4" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Headphones className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                התחל את השיחה כדי לראות את התמלול
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "p-3 rounded-lg border-r-4 transition-all",
                    message.sender === "agent"
                      ? "bg-secondary/50 mr-8 border-r-primary"
                      : cn(
                          "bg-muted/50 ml-8",
                          message.sentiment
                            ? sentimentColors[message.sentiment]
                            : "border-r-muted-foreground"
                        )
                  )}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div
                      className={cn(
                        "h-6 w-6 rounded-full flex items-center justify-center",
                        message.sender === "agent"
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {message.sender === "agent" ? (
                        <Headphones className="h-3.5 w-3.5" />
                      ) : (
                        <User className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <span className="text-sm font-medium">
                      {message.sender === "agent" ? "נציג" : "לקוח"}
                    </span>
                    <span className="text-xs text-muted-foreground mr-auto">
                      {message.timestamp}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed pr-8">{message.text}</p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
