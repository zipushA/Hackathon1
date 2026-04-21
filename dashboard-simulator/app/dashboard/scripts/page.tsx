'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Pencil,
  Users,
  FileText,
  Filter
} from 'lucide-react'
import { simulationScripts, type SimulationScript } from '@/lib/mock-data'

const difficultyColors = {
  beginner: 'bg-success/10 text-success border-success/20',
  intermediate: 'bg-warning/10 text-warning border-warning/20',
  advanced: 'bg-destructive/10 text-destructive border-destructive/20'
}

const difficultyLabels = {
  beginner: 'מתחיל',
  intermediate: 'בינוני',
  advanced: 'מתקדם'
}

const statusColors = {
  active: 'bg-success/10 text-success border-success/20',
  draft: 'bg-muted text-muted-foreground border-muted',
  archived: 'bg-secondary text-secondary-foreground border-secondary'
}

const statusLabels = {
  active: 'פעיל',
  draft: 'טיוטה',
  archived: 'בארכיון'
}

export default function ScriptsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const filteredScripts = simulationScripts.filter((script) => {
    const matchesSearch = script.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      script.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || script.category === categoryFilter
    const matchesDifficulty = difficultyFilter === 'all' || script.difficulty === difficultyFilter
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const categories = [...new Set(simulationScripts.map(s => s.category))]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scripts</h1>
          <p className="text-muted-foreground">
            ניהול והקצאת תסריטי סימולציה להדרכה
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="ml-2 h-4 w-4" />
              הוספת תסריט
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>יצירת תסריט חדש</DialogTitle>
              <DialogDescription>
                הוסיפו תסריט סימולציה חדש לתוכנית ההדרכה שלכם
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsAddModalOpen(false); }}>
              <div className="space-y-2">
                <Label htmlFor="title">כותרת</Label>
                <Input id="title" placeholder="הזינו כותרת לתסריט" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">תיאור</Label>
                <Textarea id="description" placeholder="תארו את תרחיש הסימולציה" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">קטגוריה</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="בחרו קטגוריה" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sales">מכירות</SelectItem>
                      <SelectItem value="Support">תמיכה</SelectItem>
                      <SelectItem value="Onboarding">קליטה</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">רמת קושי</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="בחרו רמה" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">מתחיל</SelectItem>
                      <SelectItem value="intermediate">בינוני</SelectItem>
                      <SelectItem value="advanced">מתקדם</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="script-content">תוכן התסריט</Label>
                <Textarea 
                  id="script-content" 
                  placeholder="הדביקו או כתבו את תוכן תסריט הסימולציה..."
                  rows={6}
                />
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>
                  ביטול
                </Button>
                <Button type="submit">יצירת תסריט</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{simulationScripts.length}</p>
                <p className="text-sm text-muted-foreground">סה״כ תסריטים</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2">
                <FileText className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {simulationScripts.filter(s => s.status === 'active').length}
                </p>
                <p className="text-sm text-muted-foreground">תסריטים פעילים</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/10 p-2">
                <FileText className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {simulationScripts.filter(s => s.status === 'draft').length}
                </p>
                <p className="text-sm text-muted-foreground">טיוטות</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-chart-2/10 p-2">
                <Users className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {simulationScripts.reduce((acc, s) => acc + s.assignedCount, 0)}
                </p>
                <p className="text-sm text-muted-foreground">סה״כ הקצאות</p>
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
                placeholder="חיפוש תסריטים..."
                className="pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="ml-2 h-4 w-4" />
                  <SelectValue placeholder="קטגוריה" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הקטגוריות</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="רמת קושי" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הרמות</SelectItem>
                  <SelectItem value="beginner">מתחיל</SelectItem>
                  <SelectItem value="intermediate">בינוני</SelectItem>
                  <SelectItem value="advanced">מתקדם</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scripts Table */}
      <Card>
        <CardHeader>
          <CardTitle>כל התסריטים</CardTitle>
          <CardDescription>
            מוצגים {filteredScripts.length} מתוך {simulationScripts.length} תסריטים
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>כותרת</TableHead>
                <TableHead>קטגוריה</TableHead>
                <TableHead>רמת קושי</TableHead>
                <TableHead>סטטוס</TableHead>
                <TableHead className="text-left">הוקצו</TableHead>
                <TableHead className="text-left">השלמה</TableHead>
                <TableHead className="text-left">ציון ממוצע</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredScripts.map((script) => (
                <TableRow key={script.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{script.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {script.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{script.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={difficultyColors[script.difficulty]} variant="outline">
                      {difficultyLabels[script.difficulty]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[script.status]} variant="outline">
                      {statusLabels[script.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left">{script.assignedCount}</TableCell>
                  <TableCell className="text-left">
                    {script.completionRate > 0 ? `${script.completionRate}%` : '-'}
                  </TableCell>
                  <TableCell className="text-left">
                    {script.averageScore > 0 ? `${script.averageScore}%` : '-'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem>
                          <Eye className="ml-2 h-4 w-4" />
                          צפייה בפרטים
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pencil className="ml-2 h-4 w-4" />
                          עריכת תסריט
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="ml-2 h-4 w-4" />
                          הקצאה לנציגים
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
