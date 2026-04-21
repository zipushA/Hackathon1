import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'

const representativeUser = {
  name: 'שרה כהן',
  email: 'sarah.chen@company.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  role: 'representative' as const
}

export default function RepresentativeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar role="representative" />
      <div className="lg:pr-64">
        <Header user={representativeUser} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
