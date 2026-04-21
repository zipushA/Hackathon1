'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  TrendingUp,
  Target,
  CheckCircle2,
  AlertCircle,
  Trophy,
  Clock,
  BarChart3
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

// User progress data
const progressData = {
  overallProgress: 85,
  averageScore: 92,
  completedSessions: 24,
  totalSessions: 28,
  streak: 5,
  rank: 2,
  totalRepresentatives: 6
}

const scoreHistory = [
  { session: '1', score: 72, date: 'Aug 5' },
  { session: '2', score: 78, date: 'Aug 12' },
  { session: '3', score: 75, date: 'Aug 19' },
  { session: '4', score: 82, date: 'Aug 26' },
  { session: '5', score: 85, date: 'Sep 2' },
  { session: '6', score: 84, date: 'Sep 9' },
  { session: '7', score: 88, date: 'Sep 16' },
  { session: '8', score: 90, date: 'Sep 23' },
  { session: '9', score: 88, date: 'Oct 1' },
  { session: '10', score: 92, date: 'Oct 8' },
  { session: '11', score: 91, date: 'Oct 15' },
  { session: '12', score: 94, date: 'Oct 22' }
]

const skillsRadarData = [
  { skill: 'Objection Handling', score: 95, fullMark: 100 },
  { skill: 'Product Knowledge', score: 90, fullMark: 100 },
  { skill: 'Rapport Building', score: 88, fullMark: 100 },
  { skill: 'Closing Techniques', score: 75, fullMark: 100 },
  { skill: 'Time Management', score: 70, fullMark: 100 },
  { skill: 'Communication', score: 92, fullMark: 100 }
]

const categoryScores = [
  { category: 'Sales', score: 94, sessions: 14 },
  { category: 'Support', score: 88, sessions: 6 },
  { category: 'Product', score: 90, sessions: 4 }
]

const recentAchievements = [
  { title: 'First Perfect Score', description: 'Scored 100% on a simulation', date: '2024-01-15', icon: Trophy },
  { title: '5-Day Streak', description: 'Practiced 5 days in a row', date: '2024-01-14', icon: TrendingUp },
  { title: 'Category Master', description: 'Completed all Sales simulations', date: '2024-01-10', icon: Target }
]

const strengths = ['Objection Handling', 'Product Knowledge', 'Rapport Building', 'Communication']
const areasToImprove = ['Closing Techniques', 'Time Management']

export default function ProgressPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Progress</h1>
        <p className="text-muted-foreground">
          Track your improvement and performance over time
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Progress</p>
                <p className="text-3xl font-bold">{progressData.overallProgress}%</p>
                <Progress value={progressData.overallProgress} className="mt-2 h-2 w-24" />
              </div>
              <div className="rounded-lg bg-chart-1/10 p-3">
                <Target className="h-6 w-6 text-chart-1" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-3xl font-bold">{progressData.averageScore}%</p>
                <p className="text-sm text-success mt-1">+4% this month</p>
              </div>
              <div className="rounded-lg bg-chart-2/10 p-3">
                <TrendingUp className="h-6 w-6 text-chart-2" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Team Rank</p>
                <p className="text-3xl font-bold">#{progressData.rank}</p>
                <p className="text-sm text-muted-foreground mt-1">of {progressData.totalRepresentatives}</p>
              </div>
              <div className="rounded-lg bg-warning/10 p-3">
                <Trophy className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Practice Streak</p>
                <p className="text-3xl font-bold">{progressData.streak} days</p>
                <p className="text-sm text-success mt-1">Personal best!</p>
              </div>
              <div className="rounded-lg bg-success/10 p-3">
                <Clock className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Score History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Score History
            </CardTitle>
            <CardDescription>Your performance trend over recent sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreHistory}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" className="text-xs" />
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
                    dot={{ fill: 'hsl(var(--chart-1))', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Skills Radar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-chart-2" />
              Skills Assessment
            </CardTitle>
            <CardDescription>Your proficiency across different skill areas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={skillsRadarData}>
                  <PolarGrid className="stroke-border" />
                  <PolarAngleAxis dataKey="skill" className="text-xs" />
                  <PolarRadiusAxis domain={[0, 100]} className="text-xs" />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="hsl(var(--chart-1))"
                    fill="hsl(var(--chart-1))"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Performance by Category</CardTitle>
          <CardDescription>Your scores across different training categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryScores}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="category" className="text-xs" />
                <YAxis domain={[0, 100]} className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="score" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Strengths */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              Strengths
            </CardTitle>
            <CardDescription>Areas where you excel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {strengths.map((strength) => (
                <Badge 
                  key={strength} 
                  variant="outline" 
                  className="bg-success/10 text-success border-success/30 py-1.5 px-3"
                >
                  {strength}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Keep leveraging these skills in your practice sessions!
            </p>
          </CardContent>
        </Card>

        {/* Areas to Improve */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Areas to Improve
            </CardTitle>
            <CardDescription>Focus on these skills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {areasToImprove.map((area) => (
                <Badge 
                  key={area} 
                  variant="outline" 
                  className="bg-warning/10 text-warning border-warning/30 py-1.5 px-3"
                >
                  {area}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              We recommend focusing on these areas in your next practice sessions.
            </p>
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-warning" />
              Achievements
            </CardTitle>
            <CardDescription>Recent milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAchievements.map((achievement) => (
                <div key={achievement.title} className="flex items-start gap-3">
                  <div className="rounded-full bg-warning/10 p-2">
                    <achievement.icon className="h-4 w-4 text-warning" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{achievement.title}</p>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(achievement.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sessions Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Training Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-3xl font-bold">{progressData.completedSessions}</p>
              <p className="text-sm text-muted-foreground">Sessions Completed</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-3xl font-bold">{progressData.totalSessions - progressData.completedSessions}</p>
              <p className="text-sm text-muted-foreground">Sessions Remaining</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-3xl font-bold">94%</p>
              <p className="text-sm text-muted-foreground">Best Score</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-3xl font-bold">14m</p>
              <p className="text-sm text-muted-foreground">Avg. Session Time</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
