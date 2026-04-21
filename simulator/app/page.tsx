"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { SimulatorHeader } from "@/components/simulator/simulator-header"
import { CustomerInfoPanel } from "@/components/simulator/customer-info-panel"
import { CallControls } from "@/components/simulator/call-controls"
import { ConversationPanel, type Message } from "@/components/simulator/conversation-panel"
import { PerformanceMetrics } from "@/components/simulator/performance-metrics"
import { FeedbackModal } from "@/components/simulator/feedback-modal"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Send, Keyboard, Volume2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

// ===========================================
// TYPES - להעביר לקובץ types.ts אם תרצי
// ===========================================
export interface CustomerInfo {
  name: string
  phone: string
  policyNumber: string
  policyType: string
  status: "active" | "inactive" | "pending"
  lastContact: string
  priority: "low" | "medium" | "high"
}

export interface FeedbackData {
  feedback: string
  scores: Record<string, number | string>
}

export interface SimulatorCallbacks {
  // נקראת כשמתחילים שיחה
  onCallStart: () => void
  // נקראת כשמסיימים שיחה
  onCallEnd: () => void
  // נקראת כששולחים הודעה (טקסט או קול)
  onSendMessage: (text: string) => void
  // נקראת כשמשתיקים/מבטלים השתקה
  onMuteToggle: (isMuted: boolean) => void
  // נקראת כשמפעילים/מכבים רמקול
  onSpeakerToggle: (isSpeakerOn: boolean) => void
  // נקראת כשמאפסים
  onReset: () => void
}

// ===========================================
// SIMULATOR HOOK - לחיבור לשרת שלך
// ===========================================
export function useSimulator() {
  const [isCallActive, setIsCallActive] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null)
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null)
  const [metrics, setMetrics] = useState({
    customerSatisfaction: 0,
    responseTime: 0,
    solutionRate: 0,
    empathyScore: 0
  })

  // הוסיפי הודעה חדשה
  const addMessage = useCallback((message: Omit<Message, "id">) => {
    setMessages(prev => [...prev, { ...message, id: `msg-${Date.now()}` }])
  }, [])

  // הוסיפי הודעת לקוח (מהשרת)
  const addCustomerMessage = useCallback((text: string, timestamp: string, sentiment?: Message["sentiment"]) => {
    addMessage({ sender: "customer", text, timestamp, sentiment })
  }, [addMessage])

  // הוסיפי הודעת נציג
  const addAgentMessage = useCallback((text: string, timestamp: string) => {
    addMessage({ sender: "agent", text, timestamp })
  }, [addMessage])

  // עדכני פרטי לקוח (מהשרת)
  const updateCustomerInfo = useCallback((info: CustomerInfo) => {
    setCustomerInfo(info)
  }, [])

  // עדכני מדדים (מהשרת)
  const updateMetrics = useCallback((newMetrics: Partial<typeof metrics>) => {
    setMetrics(prev => ({ ...prev, ...newMetrics }))
  }, [])

  // הצגי משוב (מהשרת)
  const showFeedback = useCallback((data: FeedbackData) => {
    setFeedbackData(data)
  }, [])

  // איפוס
  const reset = useCallback(() => {
    setIsCallActive(false)
    setMessages([])
    setIsMuted(false)
    setIsSpeakerOn(true)
    setIsLoading(false)
    setFeedbackData(null)
    setMetrics({
      customerSatisfaction: 0,
      responseTime: 0,
      solutionRate: 0,
      empathyScore: 0
    })
  }, [])

  return {
    // State
    isCallActive,
    setIsCallActive,
    messages,
    setMessages,
    isMuted,
    setIsMuted,
    isSpeakerOn,
    setIsSpeakerOn,
    isLoading,
    setIsLoading,
    customerInfo,
    feedbackData,
    setFeedbackData,
    metrics,
    
    // Actions
    addMessage,
    addCustomerMessage,
    addAgentMessage,
    updateCustomerInfo,
    updateMetrics,
    showFeedback,
    reset
  }
}

// ===========================================
// MAIN COMPONENT
// ===========================================
export default function SimulatorPage() {
  const simulator = useSimulator()
  const [callDuration, setCallDuration] = useState("00:00")
  const [callStartTime, setCallStartTime] = useState<number | null>(null)
  const [inputMode, setInputMode] = useState<"voice" | "text">("text")
  const [textInput, setTextInput] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)

  // ===========================================
  // כאן תחברי לשרת שלך
  // ===========================================
  const serverCallbacks: SimulatorCallbacks = {
    onCallStart: () => {
      console.log("[Simulator] Call started - connect to your server here")
      // TODO: התחברי לשרת שלך
      // await fetch('/your-server/start-call', { method: 'POST' })
      
      // דוגמה - הלקוח אומר שלום
      setTimeout(() => {
        simulator.addCustomerMessage("שלום, אני צריך עזרה בנושא הביטוח שלי", "00:01", "neutral")
      }, 1000)
    },
    
    onCallEnd: () => {
      console.log("[Simulator] Call ended - notify your server here")
      // TODO: עדכני את השרת
      // await fetch('/your-server/end-call', { method: 'POST' })
    },
    
    onSendMessage: (text: string) => {
      console.log("[Simulator] Message sent:", text)
      // TODO: שלחי לשרת שלך
      // const response = await fetch('/your-server/message', { 
      //   method: 'POST', 
      //   body: JSON.stringify({ text }) 
      // })
      // const data = await response.json()
      // simulator.addCustomerMessage(data.response, callDuration, data.sentiment)
      
      // דוגמה - תגובה אוטומטית
      simulator.setIsLoading(true)
      setTimeout(() => {
        simulator.addCustomerMessage(
          "הבנתי, אני אבדוק את זה עבורך. רגע אחד בבקשה.",
          callDuration,
          "neutral"
        )
        simulator.setIsLoading(false)
      }, 1500)
    },
    
    onMuteToggle: (isMuted: boolean) => {
      console.log("[Simulator] Mute toggled:", isMuted)
    },
    
    onSpeakerToggle: (isSpeakerOn: boolean) => {
      console.log("[Simulator] Speaker toggled:", isSpeakerOn)
    },
    
    onReset: () => {
      console.log("[Simulator] Reset - notify your server here")
      // TODO: אפסי את השרת
    }
  }

  // דוגמה לפרטי לקוח - יגיעו מהשרת שלך
  const defaultCustomerInfo: CustomerInfo = {
    name: "ישראל כהן",
    phone: "050-1234567",
    policyNumber: "12345678",
    policyType: "ביטוח רכב מקיף",
    status: "active",
    lastContact: "היום",
    priority: "medium"
  }

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (simulator.isCallActive && callStartTime) {
      interval = setInterval(() => {
        const elapsed = Date.now() - callStartTime
        const minutes = Math.floor(elapsed / 60000)
        const seconds = Math.floor((elapsed % 60000) / 1000)
        setCallDuration(
          `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        )
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [simulator.isCallActive, callStartTime])

  // Check for feedback
  useEffect(() => {
    if (simulator.feedbackData) {
      setShowFeedbackModal(true)
    }
  }, [simulator.feedbackData])

  // Handlers
  const handleStartCall = useCallback(() => {
    simulator.setIsCallActive(true)
    setCallStartTime(Date.now())
    setCallDuration("00:00")
    serverCallbacks.onCallStart()
  }, [simulator, serverCallbacks])

  const handleEndCall = useCallback(() => {
    simulator.setIsCallActive(false)
    setIsListening(false)
    serverCallbacks.onCallEnd()
  }, [simulator, serverCallbacks])

  const handleReset = useCallback(() => {
    simulator.reset()
    setCallStartTime(null)
    setCallDuration("00:00")
    setTextInput("")
    setIsListening(false)
    setShowFeedbackModal(false)
    serverCallbacks.onReset()
  }, [simulator, serverCallbacks])

  const handleToggleMute = useCallback(() => {
    const newMuted = !simulator.isMuted
    simulator.setIsMuted(newMuted)
    if (newMuted) setIsListening(false)
    serverCallbacks.onMuteToggle(newMuted)
  }, [simulator, serverCallbacks])

  const handleToggleSpeaker = useCallback(() => {
    const newSpeaker = !simulator.isSpeakerOn
    simulator.setIsSpeakerOn(newSpeaker)
    serverCallbacks.onSpeakerToggle(newSpeaker)
  }, [simulator, serverCallbacks])

  const handleSendText = useCallback(() => {
    if (textInput.trim() && simulator.isCallActive) {
      simulator.addAgentMessage(textInput, callDuration)
      serverCallbacks.onSendMessage(textInput)
      setTextInput("")
    }
  }, [textInput, simulator, callDuration, serverCallbacks])

  const toggleInputMode = useCallback(() => {
    if (inputMode === "voice") {
      setIsListening(false)
      setInputMode("text")
    } else {
      setInputMode("voice")
    }
  }, [inputMode])

  const toggleListening = useCallback(() => {
    if (isListening) {
      setIsListening(false)
      // TODO: עצרי הקלטה ושלחי לשרת
    } else {
      setIsListening(true)
      // TODO: התחילי הקלטה
    }
  }, [isListening])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SimulatorHeader agentName="נציג מתאמן" sessionNumber={1} />

      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
            
            {/* Right Sidebar - Customer Info */}
            <div className="lg:col-span-3 space-y-4 md:space-y-6">
              <CustomerInfoPanel customer={simulator.customerInfo || defaultCustomerInfo} />
            </div>

            {/* Center - Call Controls & Conversation */}
            <div className="lg:col-span-6 space-y-4 md:space-y-6">
              <CallControls
                isCallActive={simulator.isCallActive}
                isMuted={simulator.isMuted}
                isSpeakerOn={simulator.isSpeakerOn}
                onStartCall={handleStartCall}
                onEndCall={handleEndCall}
                onToggleMute={handleToggleMute}
                onToggleSpeaker={handleToggleSpeaker}
                onResetSimulation={handleReset}
                callDuration={callDuration}
              />

              {/* Input Mode Toggle & Input */}
              {simulator.isCallActive && (
                <Card className="bg-card border-border">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <Button
                        variant={inputMode === "voice" ? "default" : "outline"}
                        size="sm"
                        onClick={toggleInputMode}
                        className="gap-2 shrink-0"
                      >
                        {inputMode === "voice" ? (
                          <>
                            <Mic className="h-4 w-4" />
                            קלט קולי
                          </>
                        ) : (
                          <>
                            <Keyboard className="h-4 w-4" />
                            קלט טקסט
                          </>
                        )}
                      </Button>

                      {inputMode === "voice" ? (
                        <div className="flex-1 flex items-center gap-3">
                          <div className={`h-3 w-3 rounded-full shrink-0 ${isListening ? "bg-primary animate-pulse" : "bg-muted"}`} />
                          <span className="text-sm text-muted-foreground truncate">
                            {isListening ? "מקליט... דבר עכשיו" : "לחץ להתחלת הקלטה"}
                          </span>
                          {!simulator.isMuted && (
                            <Button
                              variant={isListening ? "destructive" : "default"}
                              size="icon"
                              onClick={toggleListening}
                              className="mr-auto shrink-0"
                            >
                              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                            </Button>
                          )}
                        </div>
                      ) : (
                        <form 
                          className="flex-1 flex gap-2"
                          onSubmit={(e) => {
                            e.preventDefault()
                            handleSendText()
                          }}
                        >
                          <Input
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            placeholder="הקלד את תשובתך כנציג..."
                            disabled={simulator.isLoading}
                            className="flex-1"
                          />
                          <Button type="submit" disabled={!textInput.trim() || simulator.isLoading}>
                            <Send className="h-4 w-4" />
                          </Button>
                        </form>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Conversation */}
              <div className="h-[400px] md:h-[500px]">
                <ConversationPanel 
                  messages={simulator.messages} 
                  isCallActive={simulator.isCallActive} 
                />
              </div>

              {/* Speaking Indicator */}
              {isSpeaking && (
                <Card className="bg-primary/10 border-primary/20">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-center gap-3">
                      <div className="flex gap-1">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1 h-5 bg-primary rounded-full animate-pulse"
                            style={{ animationDelay: `${i * 100}ms` }}
                          />
                        ))}
                      </div>
                      <Volume2 className="h-4 w-4 text-primary" />
                      <span className="text-sm text-primary font-medium">הלקוח מדבר...</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Loading Indicator */}
              {simulator.isLoading && (
                <Card className="bg-muted/50 border-border">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-center gap-3">
                      <div className="flex gap-1">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 150}ms` }}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">הלקוח מקליד...</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Left Sidebar - Metrics */}
            <div className="lg:col-span-3">
              <PerformanceMetrics 
                metrics={simulator.metrics} 
                isCallActive={simulator.isCallActive} 
              />
            </div>
          </div>
        </div>
      </main>

      {/* Feedback Modal */}
      {showFeedbackModal && simulator.feedbackData && (
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          feedback={simulator.feedbackData.feedback}
          scores={simulator.feedbackData.scores}
          onRestart={handleReset}
        />
      )}
    </div>
  )
}
