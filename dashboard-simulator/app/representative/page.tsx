'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRouter } from "next/navigation"
import { Progress } from '@/components/ui/progress'
import { StatsCard } from '@/components/dashboard/stats-card'
import {
  Play,
  CheckCircle2,
  TrendingUp,
  Target,
  Clock,
  ArrowLeft,
  Star
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { simulationScripts, feedbacks } from '@/lib/mock-data'

// Current user data (Sarah Chen)
const currentUser = {
  name: 'שרה כהן',
  progress: 85,
  averageScore: 92,
  completedSessions: 24,
  totalSessions: 28,
  streak: 5
}

const performanceData = [
  { week: 'שבוע 1', score: 78 },
  { week: 'שבוע 2', score: 82 },
  { week: 'שבוע 3', score: 85 },
  { week: 'שבוע 4', score: 88 },
  { week: 'שבוע 5', score: 90 },
  { week: 'שבוע 6', score: 92 }
]

// Assigned simulations for this user
const assignedSimulations = simulationScripts.filter(s => s.status === 'active').slice(0, 4)
const userFeedbacks = feedbacks.filter(f => f.representativeId === '1')

// Recommended next simulation
const recommendedSimulation = simulationScripts.find(s => s.title === 'Closing the Deal') || simulationScripts[0]

export default function RepresentativeDashboard() {
  const router = useRouter()
  const handleStartSimulation = async () => {
    try {
      const formData = new FormData()
      formData.append("script_key", "home_water") // אפשר לשנות לפי הבחירה

      const res = await fetch("http://127.0.0.1:8000/chat/start", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        alert("שגיאה בהתחלת סימולציה")
        return
      }

      const data = await res.json()

      sessionStorage.setItem("session_id", data.session_id)
      sessionStorage.setItem("opening_message", data.opening_message)

      router.push("/chat")
    } catch (error) {
      console.error(error)
      alert("שגיאה בחיבור לשרת")
    }
  }
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ברוכה השבה, שרה!</h1>
          <p className="text-muted-foreground">
            הנה התקדמות ההדרכה שלך והסימולציות הקרובות.
          </p>
        </div>
        <Button size="lg" className="gap-2" asChild>
          <Link href="/representative/simulations">
            <Play className="h-5 w-5" />
            התחלת תרגול
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="התקדמות בהדרכה"
          value={`${currentUser.progress}%`}
          change={`${currentUser.completedSessions}/${currentUser.totalSessions} תרגולים`}
          changeType="neutral"
          icon={Target}
          iconColor="bg-chart-1/10 text-chart-1"
        />
        <StatsCard
          title="ציון ממוצע"
          value={`${currentUser.averageScore}%`}
          change="+4% החודש"
          changeType="positive"
          icon={TrendingUp}
          iconColor="bg-chart-2/10 text-chart-2"
        />
        <StatsCard
          title="תרגולים שהושלמו"
          value={currentUser.completedSessions}
          change={`נותרו ${currentUser.totalSessions - currentUser.completedSessions}`}
          changeType="neutral"
          icon={CheckCircle2}
          iconColor="bg-success/10 text-success"
        />
        <StatsCard
          title="רצף תרגולים"
          value={`${currentUser.streak} ימים`}
          change="המשיכי כך!"
          changeType="positive"
          icon={Star}
          iconColor="bg-warning/10 text-warning"
        />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Performance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              ההתקדמות שלך
            </CardTitle>
            <CardDescription>ציון ביצועים ב-6 השבועות האחרונים</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="week" className="text-xs" />
                  <YAxis domain={[60, 100]} className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--chart-1))', strokeWidth: 2, r: 6 }}
                    name="ציון"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Simulation */}
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-warning" />
              מומלץ להמשך
            </CardTitle>
            <CardDescription>מבוסס על תחומי השיפור שלך</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{recommendedSimulation.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {recommendedSimulation.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{recommendedSimulation.category}</Badge>
              <Badge variant="outline" className="capitalize">
                {recommendedSimulation.difficulty === 'beginner' ? 'מתחיל' :
                  recommendedSimulation.difficulty === 'intermediate' ? 'בינוני' : 'מתקדם'}
              </Badge>
            </div>
            <Button className="w-full gap-2" onClick={handleStartSimulation}>
              <Play className="h-4 w-4" />
              התחלת סימולציה
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Assigned Simulations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>סימולציות מוקצות</CardTitle>
              <CardDescription>מודולי ההדרכה הפעילים שלך</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/representative/simulations" className="gap-1">
                צפייה בכולם <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignedSimulations.map((sim, index) => {
                const isCompleted = index < 2 // Mock: first 2 are completed
                const progress = isCompleted ? 100 : (index === 2 ? 60 : 0)

                return (
                  <div key={sim.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isCompleted ? 'bg-success/10' : 'bg-muted'
                      }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      ) : (
                        <Play className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{sim.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{sim.category}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {sim.difficulty === 'beginner' ? 'מתחיל' :
                            sim.difficulty === 'intermediate' ? 'בינוני' : 'מתקדם'}
                        </span>
                      </div>
                    </div>
                    <div className="text-left">
                      {isCompleted ? (
                        <Badge className="bg-success/10 text-success border-success/20">הושלם</Badge>
                      ) : progress > 0 ? (
                        <div className="text-left">
                          <p className="text-sm font-medium">{progress}%</p>
                          <p className="text-xs text-muted-foreground">בתהליך</p>
                        </div>
                      ) : (
                        <Button size="sm" variant="outline">התחלה</Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Instructor Feedback */}
        <Card>
          <CardHeader>
            <CardTitle>משוב מהמדריך</CardTitle>
            <CardDescription>משוב אחרון מתרגולי ההדרכה</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userFeedbacks.map((feedback) => (
                <div
                  key={feedback.id}
                  className={`p-4 rounded-lg border ${feedback.type === 'praise'
                    ? 'bg-success/5 border-success/20'
                    : feedback.type === 'improvement'
                      ? 'bg-warning/5 border-warning/20'
                      : 'bg-muted/50 border-border'
                    }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={feedback.instructorAvatar} />
                      <AvatarFallback>{feedback.instructorName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{feedback.instructorName}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(feedback.date).toLocaleDateString('he-IL')}
                      </p>
                    </div>
                    {feedback.type === 'praise' && (
                      <Star className="h-4 w-4 text-warning fill-warning" />
                    )}
                  </div>
                  <p className="text-sm">{feedback.message}</p>
                </div>
              ))}
              {userFeedbacks.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  עדיין לא התקבל משוב. השלימי עוד תרגולים כדי לקבל משוב!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>השלמת הדרכה</CardTitle>
          <CardDescription>ההתקדמות הכוללת שלך בכל הסימולציות המוקצות</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{currentUser.progress}%</span>
              <span className="text-muted-foreground">{currentUser.completedSessions} מתוך {currentUser.totalSessions} תרגולים</span>
            </div>
            <Progress value={currentUser.progress} className="h-4" />
            <p className="text-sm text-muted-foreground">
              את מתקדמת מצוין! השלימי עוד {currentUser.totalSessions - currentUser.completedSessions} תרגולים לסיום תוכנית ההדרכה.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
