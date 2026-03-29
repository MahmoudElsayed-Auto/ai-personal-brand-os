'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Filter, MoreVertical, Calendar, Clock, Edit2, Trash2 } from 'lucide-react'
import { DataTable } from '@/components/ui/DataTable'
import { Modal } from '@/components/ui/Modal'

const dummyContent = [
  {
    id: 1,
    title: '10 Tips for Growing Your Personal Brand',
    platform: 'Twitter',
    status: 'Scheduled',
    scheduled: '2024-01-15 14:00',
    engagement: 245,
    author: 'AI Assistant',
  },
  {
    id: 2,
    title: 'How to Build Authority on LinkedIn',
    platform: 'LinkedIn',
    status: 'Published',
    scheduled: '2024-01-14 09:00',
    engagement: 1892,
    author: 'AI Assistant',
  },
  {
    id: 3,
    title: 'The Future of AI in Content Creation',
    platform: 'Blog',
    status: 'Draft',
    scheduled: '-',
    engagement: 0,
    author: 'User',
  },
  {
    id: 4,
    title: 'Script: Productivity Hacks for Entrepreneurs',
    platform: 'Script',
    status: 'Draft',
    scheduled: '-',
    engagement: 0,
    author: 'AI Assistant',
  },
  {
    id: 5,
    title: '5 Mistakes to Avoid When Building Influence',
    platform: 'Twitter',
    status: 'Published',
    scheduled: '2024-01-13 16:30',
    engagement: 512,
    author: 'AI Assistant',
  },
]

const columns = [
  { key: 'title', header: 'Title', sortable: true },
  { key: 'platform', header: 'Platform', sortable: true },
  { key: 'status', header: 'Status', sortable: true },
  { key: 'scheduled', header: 'Scheduled', sortable: true },
  { key: 'engagement', header: 'Engagement', sortable: true },
  { key: 'author', header: 'Author', sortable: true },
] as const

export default function ContentPlannerPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredContent = dummyContent.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || item.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleCreateContent = async (data: Record<string, unknown>) => {
    console.log('Creating content:', data)
    // TODO: Call API endpoint
  }

  return (
    <motion.div
      className="space-y-6 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Content Planner
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            manage all your content in one place
          </p>
        </div>
        <motion.button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-4 h-4" />
          Create Content
        </motion.button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="published">Published</option>
        </select>
      </div>

      <motion.div
        className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <DataTable
          data={filteredContent}
          columns={columns}
          onRowClick={(row) => console.log('Row clicked:', row)}
        />
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Content">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const data = Object.fromEntries(formData)
                handleCreateContent(data)
                setIsModalOpen(false)
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Platform
                </label>
                <select
                  name="platform"
                  required
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                >
                  <option value="twitter">Twitter</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="blog">Blog</option>
                  <option value="script">Script</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  defaultValue="draft"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                >
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Content
                </label>
                <textarea
                  name="content"
                  rows={4}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Create
                </motion.button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  )
}