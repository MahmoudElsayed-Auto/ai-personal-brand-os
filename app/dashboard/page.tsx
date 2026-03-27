'use client'

import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Users, FileText, Calendar, DollarSign, Eye, ThumbsUp, Share2 } from 'lucide-react'
import KPICard from '@/components/ui/KPICard'

const monthlyData = [
  { name: 'Jan', posts: 45, engagement: 2400 },
  { name: 'Feb', posts: 52, engagement: 2800 },
  { name: 'Mar', posts: 48, engagement: 2600 },
  { name: 'Apr', posts: 61, engagement: 3200 },
  { name: 'May', posts: 55, engagement: 2900 },
  { name: 'Jun', posts: 67, engagement: 3500 },
]

const contentDistribution = [
  { name: 'Twitter Threads', value: 35, color: '#1E40AF' },
  { name: 'LinkedIn Posts', value: 25, color: '#3B82F6' },
  { name: 'Blog Posts', value: 20, color: '#F59E0B' },
  { name: 'Scripts', value: 20, color: '#10B981' },
]

const engagementMetrics = [
  { name: 'Impressions', current: 125000, previous: 98000 },
  { name: 'Engagement Rate', current: 4.2, previous: 3.8 },
  { name: 'New Followers', current: 1250, previous: 980 },
  { name: 'Click Through', current: 2.1, previous: 1.8 },
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
            value="328"
            growth={12}
            icon={<FileText className="w-5 h-5" />}
          />
        </motion.div>
        <motion.div variants={item}>
          <KPICard
            title="Scheduled Posts"
            value="45"
            growth={8}
            icon={<Calendar className="w-5 h-5" />}
          />
        </motion.div>
        <motion.div variants={item}>
          <KPICard
            title="Total Engagement"
            value="18.6K"
            growth={24}
            icon={<ThumbsUp className="w-5 h-5" />}
          />
        </motion.div>
        <motion.div variants={item}>
          <KPICard
            title="Revenue"
            value="$12,450"
            growth={15}
            icon={<DollarSign className="w-5 h-5" />}
          />
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm"
          variants={item}
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Monthly Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F9FAFB',
                }}
              />
              <Bar dataKey="posts" fill="#1E40AF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm"
          variants={item}
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Content Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={contentDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {contentDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F9FAFB',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            {contentDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm"
        variants={item}
      >
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Engagement Trend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis dataKey="name" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '8px',
                color: '#F9FAFB',
              }}
            />
            <Line
              type="monotone"
              dataKey="engagement"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: '#3B82F6', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" variants={container}>
        {engagementMetrics.map((metric) => (
          <motion.div
            key={metric.name}
            className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm"
            variants={item}
          >
            <p className="text-sm text-slate-600 dark:text-slate-400">{metric.name}</p>
            <div className="flex items-end justify-between mt-2">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {typeof metric.current === 'number' && metric.name.includes('Rate')
                  ? `${metric.current}%`
                  : metric.current.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>
                  {((metric.current - metric.previous) / metric.previous * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}