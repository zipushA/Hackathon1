'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GraduationCap, User, Users, ArrowLeft, Eye, EyeOff } from 'lucide-react'

type Role = 'instructor' | 'representative' | null

export default function LoginPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<Role>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    if (selectedRole === 'instructor') {
      router.push('/dashboard')
    } else {
      router.push('/representative')
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Right side - Branding (RTL: was left side) */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="relative z-10 flex flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <GraduationCap className="h-7 w-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-sidebar-foreground">SimuCoach</span>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight text-sidebar-foreground text-balance">
              שפרו את כישורי התקשורת של הצוות שלכם
            </h1>
            <p className="text-lg text-sidebar-muted max-w-md text-pretty">
              תרגלו סימולציות שיחה מציאותיות ועקבו אחר ההתקדמות עם פלטפורמת ההדרכה החכמה שלנו.
            </p>
            <div className="flex gap-8 pt-6">
              <div>
                <p className="text-3xl font-bold text-sidebar-foreground">500+</p>
                <p className="text-sm text-sidebar-muted">משתמשים פעילים</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-sidebar-foreground">10k+</p>
                <p className="text-sm text-sidebar-muted">תרגולים שהושלמו</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-sidebar-foreground">95%</p>
                <p className="text-sm text-sidebar-muted">שיעור שיפור</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-sidebar-muted">
            מהימן על ידי חברות מובילות ברחבי העולם
          </p>
        </div>
      </div>

      {/* Left side - Login Form (RTL: was right side) */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">SimuCoach</span>
          </div>

          <div className="text-center lg:text-right">
            <h2 className="text-2xl font-bold tracking-tight">ברוכים הבאים</h2>
            <p className="mt-2 text-muted-foreground">
              בחרו את התפקיד שלכם והתחברו כדי להמשיך
            </p>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setSelectedRole('instructor')}
              className={`relative flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all hover:border-primary/50 ${
                selectedRole === 'instructor'
                  ? 'border-primary bg-primary/5'
                  : 'border-border'
              }`}
            >
              <div className={`rounded-full p-3 ${
                selectedRole === 'instructor' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                <Users className="h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="font-semibold">מדריך</p>
                <p className="text-xs text-muted-foreground">ניהול הדרכות</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('representative')}
              className={`relative flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all hover:border-primary/50 ${
                selectedRole === 'representative'
                  ? 'border-primary bg-primary/5'
                  : 'border-border'
              }`}
            >
              <div className={`rounded-full p-3 ${
                selectedRole === 'representative' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                <User className="h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="font-semibold">נציג</p>
                <p className="text-xs text-muted-foreground">תרגול מיומנויות</p>
              </div>
            </button>
          </div>

          {/* Login Form */}
          <Card className={`transition-opacity ${selectedRole ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl">התחברות</CardTitle>
              <CardDescription>
                הזינו את פרטי הכניסה שלכם כדי לגשת לחשבון
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">דוא״ל</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    defaultValue={selectedRole === 'instructor' ? 'alex.morgan@company.com' : 'sarah.chen@company.com'}
                    required
                    dir="ltr"
                    className="text-left"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">סיסמה</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="הזינו את הסיסמה שלכם"
                      defaultValue="password123"
                      required
                      dir="ltr"
                      className="text-left"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded border-border" defaultChecked />
                    זכור אותי
                  </label>
                  <a href="#" className="text-sm text-primary hover:underline">
                    שכחתם סיסמה?
                  </a>
                </div>
                <Button 
                  type="submit" 
                  className="w-full gap-2" 
                  disabled={!selectedRole || isLoading}
                >
                  {isLoading ? 'מתחבר...' : 'התחברות'}
                  {!isLoading && <ArrowLeft className="h-4 w-4" />}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            אין לכם חשבון?{' '}
            <a href="#" className="text-primary hover:underline">
              פנו למנהל המערכת
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
