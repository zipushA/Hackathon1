'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  Users,
  FileText,
  Calendar
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { representatives, simulationScripts } from '@/lib/mock-data'

// Extended analytics data with Hebrew labels
const weeklyActivityData = [
  { week: 'שבוע 1', sessions: 18, avgScore: 76 },
  { week: 'שבוע 2', sessions: 24, avgScore: 78 },
  { week: 'שבוע 3', sessions: 22, avgScore: 81 },
  { week: 'שבוע 4', sessions: 28, avgScore: 82 },
  { week: 'שבוע 5', sessions: 32, avgScore: 84 },
  { week: 'שבוע 6', sessions: 35, avgScore: 86 }
]

const departmentComparisonData = [
  { department: 'מכירות', avgScore: 84, completionRate: 78 },
  { department: 'תמיכה', avgScore: 82, completionRate: 85 }
]

const scriptPerformanceData = simulationScripts
  .filter(s => s.status === 'active' && s.averageScore > 0)
  .map(s => ({
    name: s.title.length > 20 ? s.title.slice(0, 20) + '...' : s.title,
    score: s.averageScore,
    completion: s.completionRate
  }))

const timeDistributionData = [
  { hour: '9:00', sessions: 12 },
  { hour: '10:00', sessions: 18 },
  { hour: '11:00', sessions: 24 },
  { hour: '12:00', sessions: 8 },
  { hour: '13:00', sessions: 15 },
  { hour: '14:00', sessions: 28 },
  { hour: '15:00', sessions: 32 },
  { hour: '16:00', sessions: 22 },
  { hour: '17:00', sessions: 10 }
]

// Leaderboard sorted by score
const leaderboard = [...representatives]
  .sort((a, b) => b.averageScore - a.averageScore)
  .map((rep, index) => ({ ...rep, rank: index + 1 }))

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('30days')
  const [selectedDepartment, setSelectedDepartment] = useState('all')

  const departments = [...new Set(representatives.map(r => r.department))]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            תובנות הדרכה מקיפות ומדדי ביצוע
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[160px]">
              <Calendar className="ml-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 ימים אחרונים</SelectItem>
              <SelectItem value="30days">30 ימים אחרונים</SelectItem>
              <SelectItem value="90days">90 ימים אחרונים</SelectItem>
              <SelectItem value="year">השנה</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-[160px]">
              <Users className="ml-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל המחלקות</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">
            ייצוא דו״ח
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">סה״כ תרגולים</p>
                <p className="text-3xl font-bold">159</p>
                <p className="text-sm text-success flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4" />
                  +23% לעומת התקופה הקודמת
                </p>
              </div>
              <div className="rounded-lg bg-chart-1/10 p-3">
                <FileText className="h-6 w-6 text-chart-1" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ציון ממוצע</p>
                <p className="text-3xl font-bold">82%</p>
                <p className="text-sm text-success flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4" />
                  +5% לעומת התקופה הקודמת
                </p>
              </div>
              <div className="rounded-lg bg-chart-2/10 p-3">
                <Target className="h-6 w-6 text-chart-2" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">שיעור השלמה</p>
                <p className="text-3xl font-bold">78%</p>
                <p className="text-sm text-success flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4" />
                  +8% לעומת התקופה הקודמת
                </p>
              </div>
              <div className="rounded-lg bg-success/10 p-3">
                <Trophy className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">משך ממוצע</p>
                <p className="text-3xl font-bold">14 דק׳</p>
                <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                  <TrendingDown className="h-4 w-4" />
                  -2 דק׳ לעומת התקופה הקודמת
                </p>
              </div>
              <div className="rounded-lg bg-warning/10 p-3">
                <Clock className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle>פעילות שבועית</CardTitle>
            <CardDescription>תרגולים שהושלמו וציונים ממוצעים לפי שבוע</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyActivityData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="week" className="text-xs" />
                  <YAxis yAxisId="left" className="text-xs" />
                  <YAxis yAxisId="right" orientation="left" domain={[60, 100]} className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="sessions"
                    stroke="hsl(var(--chart-1))"
                    fill="hsl(var(--chart-1))"
                    fillOpacity={0.2}
                    name="תרגולים"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="avgScore"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--chart-2))' }}
                    name="ציון ממוצע"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Time Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>שעות פעילות שיא</CardTitle>
            <CardDescription>מתי הנציגים הכי פעילים</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="hour" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar
                    dataKey="sessions"
                    fill="hsl(var(--chart-1))"
                    radius={[4, 4, 0, 0]}
                    name="תרגולים"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Script Performance */}
      <Card>
        <CardHeader>
          <CardTitle>השוואת ביצועי תסריטים</CardTitle>
          <CardDescription>ציונים ממוצעים ושיעורי השלמה לפי תסריט סימולציה</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scriptPerformanceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" domain={[0, 100]} className="text-xs" />
                <YAxis dataKey="name" type="category" width={150} className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="score" name="ציון ממוצע" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
                <Bar dataKey="completion" name="% השלמה" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Leaderboard */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-warning" />
              טבלת מצטיינים
            </CardTitle>
            <CardDescription>הנציגים עם הביצועים הטובים ביותר</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.map((rep) => (
                <div 
                  key={rep.id}
                  className={`flex items-center gap-4 p-4 rounded-lg ${
                    rep.rank <= 3 ? 'bg-gradient-to-l from-warning/5 to-transparent' : 'bg-muted/30'
                  }`}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                    rep.rank === 1 
                      ? 'bg-warning text-warning-foreground' 
                      : rep.rank === 2 
                      ? 'bg-muted-foreground/30 text-foreground'
                      : rep.rank === 3
                      ? 'bg-chart-5/30 text-chart-5'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {rep.rank}
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={rep.avatar} />
                    <AvatarFallback>{rep.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{rep.name}</p>
                    <p className="text-sm text-muted-foreground">{rep.department}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-xl font-bold text-primary">{rep.averageScore}%</p>
                    <p className="text-xs text-muted-foreground">{rep.completedSessions} תרגולים</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>לפי מחלקה</CardTitle>
            <CardDescription>השוואת ביצועים</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {departmentComparisonData.map((dept) => (
                <div key={dept.department} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{dept.department}</span>
                    <Badge variant="outline">{dept.avgScore}% ממוצע</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">ציון</span>
                      <span>{dept.avgScore}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-chart-1 rounded-full transition-all"
                        style={{ width: `${dept.avgScore}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">השלמה</span>
                      <span>{dept.completionRate}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-chart-2 rounded-full transition-all"
                        style={{ width: `${dept.completionRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Training Metrics Summary */}
            <div className="mt-8 pt-6 border-t space-y-4">
              <h4 className="font-medium">מדדי השלמת הדרכה</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-success/10 rounded-lg">
                  <p className="text-2xl font-bold text-success">125</p>
                  <p className="text-xs text-muted-foreground">הושלמו</p>
                </div>
                <div className="text-center p-3 bg-warning/10 rounded-lg">
                  <p className="text-2xl font-bold text-warning">34</p>
                  <p className="text-xs text-muted-foreground">בתהליך</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
