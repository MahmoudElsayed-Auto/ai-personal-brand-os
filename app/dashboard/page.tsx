'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, FileText, Calendar, DollarSign, ThumbsUp } from 'lucide-react'
import { KPICard } from '@/components/ui/KPICard'
import { contentService, scheduleService } from '@/services'
import { authService } from '@/services/auth.service'

const contentDistribution = [
  { name: 'Twitter Threads', value: 35, color: '#1E40AF' },
  { name: 'LinkedIn Posts', value: 25, color: '#3B82F6' },
  { name: 'Blog Posts', value: 20, color: '#F59E0B' },
  { name: 'Scripts', value: 20, color: '#10B981' },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalContent: 0,
    scheduledPosts: 0,
    engagement: '0',
    revenue: '$0'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const user = await authService.getCurrentUser()
      if (user) {
        const contents = await contentService.getByUserId(user.id)
        const schedules = await scheduleService.getByUserId(user.id)
        
        setStats({
          totalContent: contents.length,
          scheduledPosts: schedules.filter(s => s.status === 'SCHEDULED').length,
          engagement: '18.6K', // Placeholder until analytics API is ready
          revenue: '$12,450'   // Placeholder until analytics API is ready
        })
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <motion.div
      className="space-y-6 p-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Welcome back! Here's your content performance overview.
          </p>
        </div>
      </div>

      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" variants={container}>
        <motion.div variants={item}>
          <KPICard
            title="Total Content"
            value={stats.totalContent.toString()}
            change="+12%"
            changeType="positive"
            icon={FileText}
          />
        </motion.div>
        <motion.div variants={item}>
          <KPICard
            title="Scheduled Posts"
            value={stats.scheduledPosts.toString()}
            change="+8%"
            changeType="positive"
            icon={Calendar}
          />
        </motion.div>
        <motion.div variants={item}>
          <KPICard
            title="Total Engagement"
            value={stats.engagement}
            change="+24%"
            changeType="positive"
            icon={ThumbsUp}
          />
        </motion.div>
        <motion.div variants={item}>
          <KPICard
            title="Revenue"
            value={stats.revenue}
            change="+15%"
            changeType="positive"
            icon={DollarSign}
          />
        </motion.div>
      </motion.div>
      {/* ... keep the rest of the charts ... */}
    </motion.div>
  )
}
