import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'

const instructorUser = {
  name: 'אלכס מורגן',
  email: 'alex.morgan@company.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  role: 'instructor' as const
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar role="instructor" />
      <div className="lg:pr-64">
        <Header user={instructorUser} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
