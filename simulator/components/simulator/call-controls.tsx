"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

interface CallControlsProps {
  isCallActive: boolean
  isMuted: boolean
  isSpeakerOn: boolean
  onStartCall: () => void
  onEndCall: () => void
  onToggleMute: () => void
  onToggleSpeaker: () => void
  onResetSimulation: () => void
  callDuration: string
}

export function CallControls({
  isCallActive,
  isMuted,
  isSpeakerOn,
  onStartCall,
  onEndCall,
  onToggleMute,
  onToggleSpeaker,
  onResetSimulation,
  callDuration
}: CallControlsProps) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4">
        <div className="flex flex-col items-center gap-4">
          {/* Call Duration */}
          <div className="text-center">
            <span className="text-3xl font-mono font-bold text-foreground">
              {callDuration}
            </span>
            <p className="text-sm text-muted-foreground mt-1">
              {isCallActive ? "שיחה פעילה" : "ממתין להתחלה"}
            </p>
          </div>

          {/* Waveform Indicator */}
          <div className="flex items-center justify-center gap-1 h-12 w-full">
            {isCallActive ? (
              Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-1 rounded-full bg-primary transition-all duration-150",
                    "animate-pulse"
                  )}
                  style={{
                    height: `${Math.random() * 100}%`,
                    animationDelay: `${i * 50}ms`,
                    minHeight: "4px"
                  }}
                />
              ))
            ) : (
              <div className="flex items-center gap-1">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-1 rounded-full bg-muted-foreground/30"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "h-12 w-12 rounded-full transition-colors",
                isMuted && "bg-destructive/20 border-destructive text-destructive"
              )}
              onClick={onToggleMute}
              disabled={!isCallActive}
            >
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>

            {isCallActive ? (
              <Button
                size="icon"
                className="h-16 w-16 rounded-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                onClick={onEndCall}
              >
                <PhoneOff className="h-7 w-7" />
              </Button>
            ) : (
              <Button
                size="icon"
                className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={onStartCall}
              >
                <Phone className="h-7 w-7" />
              </Button>
            )}

            <Button
              variant="outline"
              size="icon"
              className={cn(
                "h-12 w-12 rounded-full transition-colors",
                !isSpeakerOn && "bg-muted border-muted-foreground/30"
              )}
              onClick={onToggleSpeaker}
              disabled={!isCallActive}
            >
              {isSpeakerOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </Button>
          </div>

          {/* Reset Button */}
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={onResetSimulation}
          >
            <RotateCcw className="h-4 w-4 ml-2" />
            התחל תרחיש מחדש
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
