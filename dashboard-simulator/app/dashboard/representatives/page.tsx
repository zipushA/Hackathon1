'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Search,
  Filter,
  Users,
  TrendingUp,
  Clock,
  ArrowLeft
} from 'lucide-react'
import { representatives } from '@/lib/mock-data'

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

export default function RepresentativesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('name')

  const departments = [...new Set(representatives.map(r => r.department))]

  const filteredReps = representatives
    .filter((rep) => {
      const matchesSearch = rep.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rep.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rep.role.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesDepartment = departmentFilter === 'all' || rep.department === departmentFilter
      const matchesStatus = statusFilter === 'all' || rep.status === statusFilter
      return matchesSearch && matchesDepartment && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'score':
          return b.averageScore - a.averageScore
        case 'progress':
          return b.progress - a.progress
        case 'recent':
          return new Date(b.lastSession).getTime() - new Date(a.lastSession).getTime()
        default:
          return 0
      }
    })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Representatives</h1>
          <p className="text-muted-foreground">
            ניהול ומעקב אחר משתתפי ההדרכה
          </p>
        </div>
        <Button>
          <Users className="ml-2 h-4 w-4" />
          הוספת נציג
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{representatives.length}</p>
                <p className="text-sm text-muted-foreground">סה״כ נציגים</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2">
                <Users className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {representatives.filter(r => r.status === 'active').length}
                </p>
                <p className="text-sm text-muted-foreground">פעילים</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-chart-1/10 p-2">
                <TrendingUp className="h-5 w-5 text-chart-1" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(representatives.reduce((acc, r) => acc + r.averageScore, 0) / representatives.length)}%
                </p>
                <p className="text-sm text-muted-foreground">ציון ממוצע</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-chart-2/10 p-2">
                <Clock className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {representatives.reduce((acc, r) => acc + r.completedSessions, 0)}
                </p>
                <p className="text-sm text-muted-foreground">סה״כ תרגולים</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="חיפוש לפי שם, אימייל או תפקיד..."
                className="pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="ml-2 h-4 w-4" />
                  <SelectValue placeholder="מחלקה" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל המחלקות</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="סטטוס" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הסטטוסים</SelectItem>
                  <SelectItem value="active">פעיל</SelectItem>
                  <SelectItem value="inactive">לא פעיל</SelectItem>
                  <SelectItem value="new">חדש</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="מיון לפי" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">שם</SelectItem>
                  <SelectItem value="score">ציון</SelectItem>
                  <SelectItem value="progress">התקדמות</SelectItem>
                  <SelectItem value="recent">פעילות אחרונה</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Representatives Grid */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            מוצגים {filteredReps.length} מתוך {representatives.length} נציגים
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredReps.map((rep) => (
            <Link key={rep.id} href={`/dashboard/representatives/${rep.id}`}>
              <Card className="transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={rep.avatar} />
                      <AvatarFallback className="text-lg">
                        {rep.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold truncate">{rep.name}</h3>
                          <p className="text-sm text-muted-foreground truncate">{rep.role}</p>
                        </div>
                        <Badge className={statusColors[rep.status]} variant="outline">
                          {statusLabels[rep.status]}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">התקדמות</span>
                        <span className="font-medium">{rep.progress}%</span>
                      </div>
                      <Progress value={rep.progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-primary">{rep.averageScore}%</p>
                        <p className="text-xs text-muted-foreground">ציון ממוצע</p>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold">{rep.completedSessions}</p>
                        <p className="text-xs text-muted-foreground">תרגולים</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 text-sm">
                      <span className="text-muted-foreground">
                        תרגול אחרון: {new Date(rep.lastSession).toLocaleDateString('he-IL')}
                      </span>
                      <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
