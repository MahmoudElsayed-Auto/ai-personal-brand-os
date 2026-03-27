'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, DollarSign, Clock, TrendingUp, Search, Filter, Sparkles, Copy, Download, Send } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { KPICard } from '@/components/ui/KPICard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/Modal'

interface FreelanceJob {
  id: string
  title: string
  client: string
  budget: number
  status: 'open' | 'in_progress' | 'completed' | 'closed'
  deadline: string
  description: string
  skills: string[]
}

const mockJobs: FreelanceJob[] = [
  {
    id: '1',
    title: 'AI Content Writer Needed',
    client: 'TechStartup Inc.',
    budget: 2500,
    status: 'open',
    deadline: '2025-01-30',
    description: 'Need an experienced AI content writer for blog posts and social media content.',
    skills: ['AI', 'Content Writing', 'SEO'],
  },
  {
    id: '2',
    title: 'Personal Brand Coach',
    client: 'Marketing Agency',
    budget: 1800,
    status: 'in_progress',
    deadline: '2025-02-15',
    description: 'Looking for someone to help executives build their personal brand on LinkedIn.',
    skills: ['Personal Branding', 'LinkedIn', 'Coaching'],
  },
  {
    id: '3',
    title: 'YouTube Script Writer',
    client: 'Content Creator',
    budget: 500,
    status: 'completed',
    deadline: '2025-01-20',
    description: 'Need scripts for 5 YouTube videos about AI tools and productivity.',
    skills: ['YouTube', 'Script Writing', 'Video'],
  },
  {
    id: '4',
    title: 'Social Media Manager',
    client: 'E-commerce Brand',
    budget: 3200,
    status: 'open',
    deadline: '2025-02-28',
    description: 'Manage social media accounts for a growing e-commerce brand. Focus on engagement.',
    skills: ['Social Media', 'Marketing', 'Engagement'],
  },
]

const kpiData = [
  { title: 'Total Earnings', value: '$12,450', change: '+15%', trend: 'up', icon: DollarSign },
  { title: 'Active Projects', value: '3', change: '+1', trend: 'up', icon: Briefcase },
  { title: 'Hours This Week', value: '24', change: '-5%', trend: 'down', icon: Clock },
  { title: 'Client Rating', value: '4.9/5', change: '+0.2', trend: 'up', icon: TrendingUp },
]

function FreelanceDashboardPage() {
  const { darkMode } = useAppStore()
  const [jobs, setJobs] = useState<FreelanceJob[]>(mockJobs)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<FreelanceJob | null>(null)
  const [proposal, setProposal] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleGenerateProposal = async (job: FreelanceJob) => {
    setSelectedJob(job)
    setIsModalOpen(true)
    setIsGenerating(true)

    await new Promise(resolve => setTimeout(resolve, 1500))

    const generatedProposal = `Dear ${job.client},

I'm excited to apply for the "${job.title}" position. With my extensive experience in ${job.skills.slice(0, 2).join(', ')}, and a proven track record of delivering high-quality work, I'm confident I can help you achieve your goals.

**Why I'm a great fit:**

✓ Successfully completed 15+ similar projects
✓ 4.9/5 client rating with 100% satisfaction rate
✓ Available ${job.budget > 2000 ? '40+ hours/week' : '20+ hours/week'}
✓ Quick turnaround time with attention to detail

**My Approach:**

1. Initial consultation to understand your specific requirements
2. Draft submission within 24-48 hours
3. Revisions based on feedback until complete satisfaction
4. Final delivery with all source files and documentation

I'm available to start immediately and can deliver within your ${job.deadline ? `deadline of ${job.deadline}` : 'timeline'}. 

Looking forward to contributing to your success!

Best regards,
[Your Name]
Personal Brand Expert | AI Content Strategist`

    setProposal(generatedProposal)
    setIsGenerating(false)
  }

  const handleCopyProposal = () => {
    navigator.clipboard.writeText(proposal)
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Freelance Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your freelance projects and generate winning proposals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {kpiData.map((kpi, index) => (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <KPICard {...kpi} />
            </motion.div>
          ))}
        </div>

        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-gray-900 dark:text-white">
                Available Jobs
              </CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 w-48 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <AnimatePresence>
                {filteredJobs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No jobs found matching your criteria
                  </div>
                ) : (
                  filteredJobs.map((job, idx) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                              {job.title}
                            </h3>
                            <span className={`
                              text-xs px-2 py-0.5 rounded-full
                              ${job.status === 'open' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                job.status === 'in_progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                job.status === 'completed' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                                'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                              }
                            `}>
                              {job.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {job.client} • Deadline: {job.deadline}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-500 mb-3">
                            {job.description.substring(0, 100)}...
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {job.skills.map((skill, i) => (
                              <span
                                key={i}
                                className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                            ${job.budget.toLocaleString()}
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleGenerateProposal(job)}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                          >
                            <Sparkles className="w-4 h-4 mr-1" />
                            Generate Proposal
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Generated Proposal">
        <div className="space-y-4">
          {selectedJob && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Job:</strong> {selectedJob.title}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Budget:</strong> ${selectedJob.budget.toLocaleString()}
              </p>
            </div>
          )}

          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-12 h-12 text-blue-500" />
              </motion.div>
              <p className="text-gray-500 dark:text-gray-400 mt-3">Generating your proposal...</p>
            </div>
          ) : (
            <>
              <textarea
                value={proposal}
                onChange={(e) => setProposal(e.target.value)}
                className="w-full h-64 p-4 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                placeholder="Your generated proposal will appear here..."
              />

              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={handleCopyProposal}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  <Send className="w-4 h-4 mr-2" />
                  Send Proposal
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default FreelanceDashboardPage