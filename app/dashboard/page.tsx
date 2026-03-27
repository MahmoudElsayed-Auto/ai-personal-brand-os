'use client'

import { DashboardCard } from '@/components/dashboard/DashboardCard'
import { useUser } from '@/hooks/useUser'
import { 
  FileText, 
  Users, 
  TrendingUp, 
  Sparkles,
  Calendar,
  Bell
} from 'lucide-react'

export default function DashboardPage() {
  const { user, profile } = useUser()

  const cards = [
    {
      title: 'Content Created',
      value: '47',
      description: 'This month',
      icon: FileText,
      trend: '+12%',
    },
    {
      title: 'Brand Reach',
      value: '12.4K',
      description: 'Across platforms',
      icon: Users,
      trend: '+8%',
    },
    {
      title: 'Engagement Rate',
      value: '3.2%',
      description: 'Average rate',
      icon: TrendingUp,
      trend: '+2.1%',
    },
    {
      title: 'AI Suggestions',
      value: '23',
      description: 'Pending review',
      icon: Sparkles,
    },
  ]

  const recentActivity = [
    { title: 'New LinkedIn post generated', time: '2 hours ago', type: 'content' },
    { title: 'Brand guidelines updated', time: '5 hours ago', type: 'brand' },
    { title: 'Twitter thread scheduled', time: 'Yesterday', type: 'content' },
    { title: 'New script generated', time: '2 days ago', type: 'content' },
  ]

  const upcomingEvents = [
    { title: 'Content Calendar Review', time: 'Tomorrow, 10:00 AM' },
    { title: 'Brand Audit Meeting', time: 'Friday, 2:00 PM' },
    { title: 'Social Media Strategy', time: 'Next Monday, 11:00 AM' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}! 👋
        </h2>
        <p className="text-muted-foreground">
          Here's what's happening with your personal brand today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <DashboardCard key={index} {...card} />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 rounded-lg bg-background hover:bg-background/80 transition-colors"
              >
                <div>
                  <p className="font-medium text-sm">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Events
          </h3>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 rounded-lg bg-background"
              >
                <div>
                  <p className="font-medium text-sm">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button className="p-4 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
            Generate Content
          </button>
          <button className="p-4 rounded-lg bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity">
            Schedule Post
          </button>
          <button className="p-4 rounded-lg bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity">
            Brand Audit
          </button>
          <button className="p-4 rounded-lg bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity">
            View Analytics
          </button>
        </div>
      </div>
    </div>
  )
}