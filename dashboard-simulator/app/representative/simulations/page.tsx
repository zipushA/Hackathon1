'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Play,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Lock,
  Star
} from 'lucide-react'
import { simulationScripts } from '@/lib/mock-data'

const difficultyColors = {
  beginner: 'bg-success/10 text-success border-success/20',
  intermediate: 'bg-warning/10 text-warning border-warning/20',
  advanced: 'bg-destructive/10 text-destructive border-destructive/20'
}

// Simulation status for current user
const userSimulationStatus: Record<string, { completed: boolean; progress: number; score?: number; lastAttempt?: string }> = {
  '1': { completed: true, progress: 100, score: 88, lastAttempt: '2024-01-10' },
  '2': { completed: true, progress: 100, score: 94, lastAttempt: '2024-01-15' },
  '4': { completed: true, progress: 100, score: 91, lastAttempt: '2024-01-12' },
  '5': { completed: false, progress: 60, lastAttempt: '2024-01-14' },
  '7': { completed: true, progress: 100, score: 95, lastAttempt: '2024-01-08' }
}

export default function SimulationsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedSimulation, setSelectedSimulation] = useState<typeof simulationScripts[0] | null>(null)

  const categories = [...new Set(simulationScripts.map(s => s.category))]

  const filteredSimulations = simulationScripts
    .filter(s => s.status === 'active')
    .filter((sim) => {
      const matchesSearch = sim.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sim.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === 'all' || sim.category === categoryFilter
      
      const status = userSimulationStatus[sim.id]
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'completed' && status?.completed) ||
        (statusFilter === 'in-progress' && status && !status.completed && status.progress > 0) ||
        (statusFilter === 'not-started' && (!status || status.progress === 0))
      
      return matchesSearch && matchesCategory && matchesStatus
    })

  const completedCount = Object.values(userSimulationStatus).filter(s => s.completed).length
  const totalAssigned = simulationScripts.filter(s => s.status === 'active').length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Simulations</h1>
          <p className="text-muted-foreground">
            Practice and improve your skills with simulation exercises
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{completedCount}/{totalAssigned}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold">Overall Progress</h3>
              <p className="text-sm text-muted-foreground">
                You&apos;ve completed {completedCount} of {totalAssigned} assigned simulations
              </p>
            </div>
            <div className="w-full sm:w-64">
              <Progress value={(completedCount / totalAssigned) * 100} className="h-3" />
              <p className="text-sm text-right text-muted-foreground mt-1">
                {Math.round((completedCount / totalAssigned) * 100)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search simulations..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="not-started">Not Started</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Simulations Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredSimulations.map((sim) => {
          const status = userSimulationStatus[sim.id]
          const isCompleted = status?.completed
          const inProgress = status && !status.completed && status.progress > 0
          const isLocked = sim.difficulty === 'advanced' && completedCount < 3

          return (
            <Card 
              key={sim.id}
              className={`transition-all hover:shadow-lg cursor-pointer ${
                isLocked ? 'opacity-60' : 'hover:border-primary/50'
              }`}
              onClick={() => !isLocked && setSelectedSimulation(sim)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <Badge className={difficultyColors[sim.difficulty]} variant="outline">
                    {sim.difficulty}
                  </Badge>
                  {isCompleted && (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  )}
                  {isLocked && (
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <CardTitle className="text-lg mt-2">{sim.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {sim.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Badge variant="outline">{sim.category}</Badge>
                  
                  {status && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{status.progress}%</span>
                      </div>
                      <Progress value={status.progress} className="h-2" />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    {isCompleted ? (
                      <>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="h-4 w-4 text-warning fill-warning" />
                          Score: {status.score}%
                        </div>
                        <Button size="sm" variant="outline">
                          Retry
                        </Button>
                      </>
                    ) : inProgress ? (
                      <>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          In Progress
                        </div>
                        <Button size="sm">Continue</Button>
                      </>
                    ) : isLocked ? (
                      <p className="text-sm text-muted-foreground">Complete 3 simulations to unlock</p>
                    ) : (
                      <Button size="sm" className="w-full gap-2">
                        <Play className="h-4 w-4" />
                        Start
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Simulation Detail Modal */}
      <Dialog open={!!selectedSimulation} onOpenChange={() => setSelectedSimulation(null)}>
        {selectedSimulation && (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={difficultyColors[selectedSimulation.difficulty]} variant="outline">
                  {selectedSimulation.difficulty}
                </Badge>
                <Badge variant="outline">{selectedSimulation.category}</Badge>
              </div>
              <DialogTitle>{selectedSimulation.title}</DialogTitle>
              <DialogDescription>
                {selectedSimulation.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-2xl font-bold">{selectedSimulation.averageScore || '--'}%</p>
                  <p className="text-sm text-muted-foreground">Avg. Score</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-2xl font-bold">{selectedSimulation.completionRate || '--'}%</p>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                </div>
              </div>

              {userSimulationStatus[selectedSimulation.id]?.completed && (
                <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <span className="font-medium">Completed</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your best score: {userSimulationStatus[selectedSimulation.id].score}%
                  </p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedSimulation(null)}>
                Cancel
              </Button>
              <Button className="gap-2">
                <Play className="h-4 w-4" />
                {userSimulationStatus[selectedSimulation.id]?.completed ? 'Retry Simulation' : 'Start Simulation'}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
