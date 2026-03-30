'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, DollarSign, Clock, TrendingUp, Search, Sparkles, Copy, Send, Check } from 'lucide-react'
import { KPICard } from '@/components/ui/KPICard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/Modal'

export default function FreelanceDashboardPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<any | null>(null)
  
  const [proposal, setProposal] = useState('')
  const [proposalId, setProposalId] = useState<string | null>(null)
  const [proposalStatus, setProposalStatus] = useState<string>('DRAFT') // DRAFT, ACCEPTED, SUBMITTED
  const [isGenerating, setIsGenerating] = useState(false)

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/freelance/jobs')
      if (res.ok) {
        const data = await res.json()
        setJobs(data)
      }
    } catch (err) {
      console.error('Error fetching jobs:', err)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.description && job.description.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleGenerateProposal = async (job: any) => {
    setSelectedJob(job)
    setIsModalOpen(true)
    setIsGenerating(true)
    setProposal('')
    setProposalStatus('DRAFT')
    setProposalId(null)

    try {
      const res = await fetch('/api/freelance/proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.id,
          jobTitle: job.title,
          jobDescription: job.description,
          budget: job.budget,
        })
      })
      if (res.ok) {
        const data = await res.json()
        setProposal(data.content)
        setProposalId(data.id)
        setProposalStatus(data.status)
      }
    } catch (err) {
      console.error('Error generating proposal:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleUpdateStatus = async (newStatus: string) => {
    if (!proposalId) return;
    try {
      const res = await fetch('/api/freelance/proposal', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposalId, status: newStatus })
      })
      if (res.ok) {
        setProposalStatus(newStatus)
      }
    } catch (err) {
      console.error('Error updating status:', err)
    }
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
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <AnimatePresence>
                {filteredJobs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No jobs found matching your criteria. Try adding some via API or seed.
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
                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                              {job.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Platform: {job.platform}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-500 mb-3">
                            {job.description.substring(0, 150)}...
                          </p>
                        </div>
                        <div className="text-right ml-4 flex flex-col items-end">
                          <div className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                            {job.budget ? `$${job.budget}` : 'Variable'}
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
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-slate-500">Status: {proposalStatus}</span>
              </div>
              <textarea
                value={proposal}
                onChange={(e) => setProposal(e.target.value)}
                className="w-full h-64 p-4 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                placeholder="Your generated proposal will appear here..."
                disabled={proposalStatus !== 'DRAFT'}
              />

              <div className="flex gap-3 justify-end mt-4">
                <Button variant="outline" onClick={handleCopyProposal}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                
                {proposalStatus === 'DRAFT' && (
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleUpdateStatus('ACCEPTED')}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                )}

                {proposalStatus === 'ACCEPTED' && (
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => handleUpdateStatus('SUBMITTED')}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send (Auto-Apply)
                  </Button>
                )}
                
                {proposalStatus === 'SUBMITTED' && (
                  <Button disabled className="bg-gray-400 text-white cursor-not-allowed">
                    <Send className="w-4 h-4 mr-2" />
                    Sent
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}
