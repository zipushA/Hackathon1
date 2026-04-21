'use client'

import { use } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import {
  ArrowRight,
  Mail,
  Calendar,
  TrendingUp,
  Target,
  AlertCircle,
  CheckCircle2,
  Clock,
  Send
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { representatives, sessions, feedbacks } from '@/lib/mock-data'

const statusColors = {
  active: 'bg-success/10 text-success border-success/20',
  inactive: 'bg-muted text-muted-foreground border-muted',
  new: 'bg-primary/10 text-primary border-primary/20'
}

const statusLabels = {
  active: 'פעיל',
  inactive: 'לא פעיל',
  new: 'חדש'
}

const feedbackTypeColors = {
  praise: 'bg-success/10 border-success/30',
  improvement: 'bg-warning/10 border-warning/30',
  general: 'bg-muted border-border'
}

// Mock performance data for charts with Hebrew labels
const performanceOverTime = [
  { month: 'אוג׳', score: 72 },
  { month: 'ספט׳', score: 78 },
  { month: 'אוק׳', score: 82 },
  { month: 'נוב׳', score: 85 },
  { month: 'דצמ׳', score: 88 },
  { month: 'ינו׳', score: 92 }
]

const categoryPerformance = [
  { category: 'טיפול בהתנגדויות', score: 95 },
  { category: 'ידע מוצר', score: 90 },
  { category: 'בניית קשר', score: 88 },
  { category: 'סגירת עסקה', score: 75 },
  { category: 'ניהול זמן', score: 70 }
]

export default function RepresentativeProfilePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = use(params)
  const rep = representatives.find(r => r.id === id)
  const repSessions = sessions.filter(s => s.representativeId === id)
  const repFeedbacks = feedbacks.filter(f => f.representativeId === id)

  if (!rep) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-2xl font-bold">הנציג לא נמצא</h1>
        <Button asChild className="mt-4">
          <Link href="/dashboard/representatives">חזרה</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" asChild className="gap-2">
        <Link href="/dashboard/representatives">
          <ArrowRight className="h-4 w-4" />
          חזרה לרשימת הנציגים
        </Link>
      </Button>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={rep.avatar} />
                <AvatarFallback className="text-2xl">
                  {rep.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold">{rep.name}</h1>
                  <Badge className={statusColors[rep.status]} variant="outline">
                    {statusLabels[rep.status]}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{rep.role} · {rep.department}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {rep.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    הצטרף ב-{new Date(rep.joinedDate).toLocaleDateString('he-IL')}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-3xl font-bold text-primary">{rep.averageScore}%</p>
                <p className="text-sm text-muted-foreground">ציון ממוצע</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-3xl font-bold">{rep.progress}%</p>
                <p className="text-sm text-muted-foreground">התקדמות</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-3xl font-bold">{rep.completedSessions}</p>
                <p className="text-sm text-muted-foreground">הושלמו</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-3xl font-bold">{rep.totalSessions - rep.completedSessions}</p>
                <p className="text-sm text-muted-foreground">נותרו</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-medium">התקדמות בהדרכה</span>
              <span className="text-muted-foreground">{rep.completedSessions} / {rep.totalSessions} תרגולים</span>
            </div>
            <Progress value={rep.progress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Score Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              שיפור בציונים
            </CardTitle>
            <CardDescription>מגמת ביצועים ב-6 החודשים האחרונים</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceOverTime}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
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
                    dot={{ fill: 'hsl(var(--chart-1))', strokeWidth: 2 }}
                    name="ציון"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Performance by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-chart-2" />
              ביצועים לפי קטגוריה
            </CardTitle>
            <CardDescription>ציונים בתחומי מיומנות שונים</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" domain={[0, 100]} className="text-xs" />
                  <YAxis dataKey="category" type="category" width={120} className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="score" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} name="ציון" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strengths and Areas to Improve */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              חוזקות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {rep.strengths.map((strength) => (
                <Badge key={strength} variant="outline" className="bg-success/10 text-success border-success/30 py-1.5 px-3">
                  {strength}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              תחומים לשיפור
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {rep.areasToImprove.map((area) => (
                <Badge key={area} variant="outline" className="bg-warning/10 text-warning border-warning/30 py-1.5 px-3">
                  {area}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback and Session History */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Instructor Feedback */}
        <Card>
          <CardHeader>
            <CardTitle>משוב מדריך</CardTitle>
            <CardDescription>הערות ומשוב מתרגולים</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {repFeedbacks.length > 0 ? (
              repFeedbacks.map((feedback) => (
                <div key={feedback.id} className={`p-4 rounded-lg border ${feedbackTypeColors[feedback.type]}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={feedback.instructorAvatar} />
                      <AvatarFallback>{feedback.instructorName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{feedback.instructorName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(feedback.date).toLocaleDateString('he-IL')}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm">{feedback.message}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">אין משוב עדיין</p>
            )}

            {/* Add Feedback Form */}
            <div className="pt-4 border-t">
              <div className="space-y-3">
                <Textarea placeholder="כתבו משוב לנציג זה..." rows={3} />
                <Button className="w-full gap-2">
                  <Send className="h-4 w-4" />
                  שליחת משוב
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session History */}
        <Card>
          <CardHeader>
            <CardTitle>היסטוריית תרגולים</CardTitle>
            <CardDescription>תרגולי סימולציה אחרונים</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {repSessions.length > 0 ? (
                repSessions.map((session) => (
                  <div key={session.id} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{session.scriptTitle}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {session.duration} דקות · {new Date(session.completedAt).toLocaleDateString('he-IL')}
                          </p>
                        </div>
                        <Badge variant="outline" className={session.score >= 80 ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}>
                          {session.score}%
                        </Badge>
                      </div>
                      {session.feedback && (
                        <p className="text-sm text-muted-foreground mt-2 italic">
                          &ldquo;{session.feedback}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  אין תרגולים שהושלמו עדיין
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
