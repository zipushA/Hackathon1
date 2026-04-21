'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { StatsCard } from '@/components/dashboard/stats-card'
import {
  Users,
  FileText,
  CheckCircle2,
  TrendingUp,
  Plus,
  ArrowLeft,
  Clock,
  AlertTriangle
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import {
  dashboardStats,
  progressOverTimeData,
  representativeScoresData,
  completionRateData,
  representatives,
  recentActivity
} from '@/lib/mock-data'

const needsAttention = representatives.filter(
  r => r.progress < 60 || r.status === 'inactive'
)

const topPerformers = [...representatives]
  .sort((a, b) => b.averageScore - a.averageScore)
  .slice(0, 3)

// Hebrew translated data for charts
const progressOverTimeDataHe = [
  { month: 'אוג׳', averageScore: 68 },
  { month: 'ספט׳', averageScore: 72 },
  { month: 'אוק׳', averageScore: 75 },
  { month: 'נוב׳', averageScore: 79 },
  { month: 'דצמ׳', averageScore: 82 },
  { month: 'ינו׳', averageScore: 85 }
]

const completionRateDataHe = [
  { name: 'הושלמו', value: 125, fill: 'var(--color-chart-1)' },
  { name: 'בתהליך', value: 34, fill: 'var(--color-chart-2)' },
  { name: 'לא התחילו', value: 18, fill: 'var(--color-chart-4)' }
]

export default function InstructorDashboard() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            ברוכים השבים! הנה סקירה כללית של תוכנית ההדרכה שלכם.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/dashboard/scripts">
              <FileText className="ml-2 h-4 w-4" />
              צפייה בתסריטים
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/representatives">
              <Plus className="ml-2 h-4 w-4" />
              הוספת נציג
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="סה״כ נציגים"
          value={dashboardStats.totalRepresentatives}
          change="+2 החודש"
          changeType="positive"
          icon={Users}
          iconColor="bg-chart-1/10 text-chart-1"
        />
        <StatsCard
          title="תסריטים פעילים"
          value={dashboardStats.activeScripts}
          change="1 טיוטה ממתינה"
          changeType="neutral"
          icon={FileText}
          iconColor="bg-chart-2/10 text-chart-2"
        />
        <StatsCard
          title="תרגולים שהושלמו"
          value={dashboardStats.completedSessions}
          change="+18% לעומת החודש שעבר"
          changeType="positive"
          icon={CheckCircle2}
          iconColor="bg-chart-3/10 text-chart-3"
        />
        <StatsCard
          title="ביצועים ממוצעים"
          value={`${dashboardStats.averagePerformance}%`}
          change="+5% שיפור"
          changeType="positive"
          icon={TrendingUp}
          iconColor="bg-chart-4/10 text-chart-4"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Progress Over Time */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>התקדמות לאורך זמן</CardTitle>
            <CardDescription>ציון ביצועים ממוצע של הצוות לפי חודש</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressOverTimeDataHe}>
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
                    dataKey="averageScore"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--chart-1))', strokeWidth: 2 }}
                    name="ציון ממוצע"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Completion Rate Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>שיעור השלמה</CardTitle>
            <CardDescription>פילוח לפי סטטוס תרגולים</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={completionRateDataHe}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {completionRateDataHe.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Representative Scores Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>ציוני נציגים</CardTitle>
          <CardDescription>ציונים ממוצעים נוכחיים לפי נציג</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={representativeScoresData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" domain={[0, 100]} className="text-xs" />
                <YAxis dataKey="name" type="category" width={80} className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar
                  dataKey="score"
                  fill="hsl(var(--chart-1))"
                  radius={[0, 4, 4, 0]}
                  name="ציון"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>פעילות אחרונה</CardTitle>
              <CardDescription>פעולות אחרונות בצוות שלכם</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  {activity.avatar ? (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={activity.avatar} />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 space-y-1">
                    <p className="text-sm leading-tight">{activity.description}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(activity.timestamp).toLocaleDateString('he-IL')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Needs Attention */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                דורשים תשומת לב
              </CardTitle>
              <CardDescription>נציגים הזקוקים למעקב</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {needsAttention.map((rep) => (
                <Link
                  key={rep.id}
                  href={`/dashboard/representatives/${rep.id}`}
                  className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={rep.avatar} />
                    <AvatarFallback>{rep.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{rep.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {rep.progress}% התקדמות · {rep.averageScore}% ממוצע
                    </p>
                  </div>
                  <Badge variant={rep.status === 'inactive' ? 'secondary' : 'outline'}>
                    {rep.status === 'inactive' ? 'לא פעיל' : rep.status === 'new' ? 'חדש' : 'פעיל'}
                  </Badge>
                </Link>
              ))}
              {needsAttention.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  כל הנציגים מתפקדים היטב!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-success" />
                מצטיינים
              </CardTitle>
              <CardDescription>הנציגים עם הציונים הגבוהים ביותר</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/representatives" className="gap-1">
                צפייה בכולם <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((rep, index) => (
                <Link
                  key={rep.id}
                  href={`/dashboard/representatives/${rep.id}`}
                  className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {index + 1}
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={rep.avatar} />
                    <AvatarFallback>{rep.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{rep.name}</p>
                    <p className="text-sm text-muted-foreground">{rep.role}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-bold text-primary">{rep.averageScore}%</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
