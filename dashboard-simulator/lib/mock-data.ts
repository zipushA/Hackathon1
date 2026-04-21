export interface Representative {
  id: string
  name: string
  email: string
  avatar: string
  role: string
  department: string
  progress: number
  averageScore: number
  completedSessions: number
  totalSessions: number
  lastSession: string
  status: 'active' | 'inactive' | 'new'
  strengths: string[]
  areasToImprove: string[]
  joinedDate: string
}

export interface SimulationScript {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  status: 'active' | 'draft' | 'archived'
  createdAt: string
  updatedAt: string
  assignedCount: number
  completionRate: number
  averageScore: number
}

export interface Session {
  id: string
  representativeId: string
  scriptId: string
  scriptTitle: string
  score: number
  duration: number
  completedAt: string
  feedback: string
  status: 'completed' | 'in-progress' | 'abandoned'
}

export interface Feedback {
  id: string
  representativeId: string
  instructorName: string
  instructorAvatar: string
  message: string
  date: string
  type: 'praise' | 'improvement' | 'general'
}

export interface ActivityItem {
  id: string
  type: 'session_completed' | 'script_added' | 'feedback_given' | 'rep_joined'
  title: string
  description: string
  timestamp: string
  avatar?: string
}

export const representatives: Representative[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    role: 'Sales Representative',
    department: 'Sales',
    progress: 85,
    averageScore: 92,
    completedSessions: 24,
    totalSessions: 28,
    lastSession: '2024-01-15',
    status: 'active',
    strengths: ['Objection Handling', 'Product Knowledge', 'Rapport Building'],
    areasToImprove: ['Closing Techniques', 'Time Management'],
    joinedDate: '2023-06-15'
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    email: 'michael.r@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    role: 'Customer Support',
    department: 'Support',
    progress: 72,
    averageScore: 78,
    completedSessions: 18,
    totalSessions: 25,
    lastSession: '2024-01-14',
    status: 'active',
    strengths: ['Empathy', 'Problem Resolution'],
    areasToImprove: ['Technical Knowledge', 'Escalation Procedures', 'Documentation'],
    joinedDate: '2023-08-20'
  },
  {
    id: '3',
    name: 'Emily Watson',
    email: 'emily.w@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    role: 'Account Manager',
    department: 'Sales',
    progress: 95,
    averageScore: 96,
    completedSessions: 32,
    totalSessions: 32,
    lastSession: '2024-01-15',
    status: 'active',
    strengths: ['Relationship Management', 'Negotiation', 'Strategic Planning', 'Communication'],
    areasToImprove: ['Cold Calling'],
    joinedDate: '2023-04-10'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.k@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    role: 'Sales Representative',
    department: 'Sales',
    progress: 45,
    averageScore: 65,
    completedSessions: 8,
    totalSessions: 18,
    lastSession: '2024-01-10',
    status: 'new',
    strengths: ['Enthusiasm', 'Learning Agility'],
    areasToImprove: ['Product Knowledge', 'Objection Handling', 'Closing'],
    joinedDate: '2024-01-02'
  },
  {
    id: '5',
    name: 'Jessica Martinez',
    email: 'jessica.m@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica',
    role: 'Support Specialist',
    department: 'Support',
    progress: 88,
    averageScore: 89,
    completedSessions: 28,
    totalSessions: 32,
    lastSession: '2024-01-15',
    status: 'active',
    strengths: ['Technical Skills', 'Patience', 'Clear Communication'],
    areasToImprove: ['Upselling', 'Cross-department Coordination'],
    joinedDate: '2023-05-18'
  },
  {
    id: '6',
    name: 'James Thompson',
    email: 'james.t@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    role: 'Sales Representative',
    department: 'Sales',
    progress: 62,
    averageScore: 71,
    completedSessions: 15,
    totalSessions: 24,
    lastSession: '2024-01-08',
    status: 'inactive',
    strengths: ['Presentation Skills'],
    areasToImprove: ['Follow-up', 'CRM Usage', 'Prospecting'],
    joinedDate: '2023-07-22'
  }
]

export const simulationScripts: SimulationScript[] = [
  {
    id: '1',
    title: 'Cold Call Introduction',
    description: 'Practice making effective cold call introductions that capture interest within the first 30 seconds.',
    category: 'Sales',
    difficulty: 'beginner',
    status: 'active',
    createdAt: '2023-10-15',
    updatedAt: '2024-01-10',
    assignedCount: 12,
    completionRate: 85,
    averageScore: 78
  },
  {
    id: '2',
    title: 'Handling Price Objections',
    description: 'Learn techniques to address common price objections and demonstrate value effectively.',
    category: 'Sales',
    difficulty: 'intermediate',
    status: 'active',
    createdAt: '2023-11-20',
    updatedAt: '2024-01-12',
    assignedCount: 18,
    completionRate: 72,
    averageScore: 82
  },
  {
    id: '3',
    title: 'Technical Support Escalation',
    description: 'Practice proper escalation procedures for complex technical issues.',
    category: 'Support',
    difficulty: 'advanced',
    status: 'active',
    createdAt: '2023-09-05',
    updatedAt: '2023-12-28',
    assignedCount: 8,
    completionRate: 65,
    averageScore: 75
  },
  {
    id: '4',
    title: 'Customer Complaint Resolution',
    description: 'Handle difficult customer complaints with empathy while finding effective solutions.',
    category: 'Support',
    difficulty: 'intermediate',
    status: 'active',
    createdAt: '2023-08-12',
    updatedAt: '2024-01-05',
    assignedCount: 15,
    completionRate: 90,
    averageScore: 88
  },
  {
    id: '5',
    title: 'Product Demo Walkthrough',
    description: 'Deliver compelling product demonstrations that highlight key features and benefits.',
    category: 'Sales',
    difficulty: 'intermediate',
    status: 'active',
    createdAt: '2023-12-01',
    updatedAt: '2024-01-14',
    assignedCount: 20,
    completionRate: 78,
    averageScore: 85
  },
  {
    id: '6',
    title: 'Closing the Deal',
    description: 'Master various closing techniques and recognize buying signals.',
    category: 'Sales',
    difficulty: 'advanced',
    status: 'draft',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-15',
    assignedCount: 0,
    completionRate: 0,
    averageScore: 0
  },
  {
    id: '7',
    title: 'Onboarding New Customers',
    description: 'Guide new customers through the onboarding process smoothly.',
    category: 'Support',
    difficulty: 'beginner',
    status: 'active',
    createdAt: '2023-07-20',
    updatedAt: '2023-11-30',
    assignedCount: 10,
    completionRate: 95,
    averageScore: 91
  }
]

export const sessions: Session[] = [
  {
    id: '1',
    representativeId: '1',
    scriptId: '2',
    scriptTitle: 'Handling Price Objections',
    score: 94,
    duration: 15,
    completedAt: '2024-01-15T10:30:00',
    feedback: 'Excellent handling of objections. Great use of value-based responses.',
    status: 'completed'
  },
  {
    id: '2',
    representativeId: '1',
    scriptId: '5',
    scriptTitle: 'Product Demo Walkthrough',
    score: 88,
    duration: 22,
    completedAt: '2024-01-14T14:15:00',
    feedback: 'Good demonstration flow. Could improve on highlighting ROI.',
    status: 'completed'
  },
  {
    id: '3',
    representativeId: '3',
    scriptId: '2',
    scriptTitle: 'Handling Price Objections',
    score: 98,
    duration: 12,
    completedAt: '2024-01-15T09:00:00',
    feedback: 'Outstanding performance. Natural conversation flow and excellent closing.',
    status: 'completed'
  },
  {
    id: '4',
    representativeId: '2',
    scriptId: '4',
    scriptTitle: 'Customer Complaint Resolution',
    score: 82,
    duration: 18,
    completedAt: '2024-01-14T11:45:00',
    feedback: 'Good empathy shown. Work on finding faster resolutions.',
    status: 'completed'
  },
  {
    id: '5',
    representativeId: '4',
    scriptId: '1',
    scriptTitle: 'Cold Call Introduction',
    score: 68,
    duration: 8,
    completedAt: '2024-01-10T16:20:00',
    feedback: 'Good enthusiasm. Focus on more concise value propositions.',
    status: 'completed'
  }
]

export const feedbacks: Feedback[] = [
  {
    id: '1',
    representativeId: '1',
    instructorName: 'Alex Morgan',
    instructorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    message: 'Great improvement in objection handling this week. Keep up the excellent work!',
    date: '2024-01-15',
    type: 'praise'
  },
  {
    id: '2',
    representativeId: '1',
    instructorName: 'Alex Morgan',
    instructorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    message: 'Consider practicing more closing scenarios to build confidence in that area.',
    date: '2024-01-12',
    type: 'improvement'
  },
  {
    id: '3',
    representativeId: '4',
    instructorName: 'Alex Morgan',
    instructorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    message: 'Welcome to the team! Focus on completing the beginner modules first.',
    date: '2024-01-05',
    type: 'general'
  }
]

export const recentActivity: ActivityItem[] = [
  {
    id: '1',
    type: 'session_completed',
    title: 'Session Completed',
    description: 'Sarah Chen completed "Handling Price Objections" with 94% score',
    timestamp: '2024-01-15T10:30:00',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
  },
  {
    id: '2',
    type: 'session_completed',
    title: 'Session Completed',
    description: 'Emily Watson completed "Handling Price Objections" with 98% score',
    timestamp: '2024-01-15T09:00:00',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily'
  },
  {
    id: '3',
    type: 'feedback_given',
    title: 'Feedback Provided',
    description: 'Alex Morgan gave feedback to Sarah Chen',
    timestamp: '2024-01-15T08:45:00',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
  },
  {
    id: '4',
    type: 'script_added',
    title: 'New Script Added',
    description: '"Closing the Deal" simulation script was created',
    timestamp: '2024-01-08T14:00:00'
  },
  {
    id: '5',
    type: 'rep_joined',
    title: 'New Representative',
    description: 'David Kim joined the training program',
    timestamp: '2024-01-02T09:00:00',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David'
  }
]

export const progressOverTimeData = [
  { month: 'Aug', averageScore: 68 },
  { month: 'Sep', averageScore: 72 },
  { month: 'Oct', averageScore: 75 },
  { month: 'Nov', averageScore: 79 },
  { month: 'Dec', averageScore: 82 },
  { month: 'Jan', averageScore: 85 }
]

export const representativeScoresData = [
  { name: 'Sarah C.', score: 92 },
  { name: 'Emily W.', score: 96 },
  { name: 'Jessica M.', score: 89 },
  { name: 'Michael R.', score: 78 },
  { name: 'James T.', score: 71 },
  { name: 'David K.', score: 65 }
]

export const completionRateData = [
  { name: 'Completed', value: 125, fill: 'var(--color-chart-1)' },
  { name: 'In Progress', value: 34, fill: 'var(--color-chart-2)' },
  { name: 'Not Started', value: 18, fill: 'var(--color-chart-4)' }
]

export const categoryPerformanceData = [
  { category: 'Sales', score: 84 },
  { category: 'Support', score: 81 },
  { category: 'Product', score: 78 },
  { category: 'Closing', score: 72 }
]

export const dashboardStats = {
  totalRepresentatives: 6,
  activeScripts: 6,
  completedSessions: 125,
  averagePerformance: 82
}
