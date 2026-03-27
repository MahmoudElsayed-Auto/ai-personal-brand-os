'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Edit, Trash2 } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ScheduledPost {
  id: string
  title: string
  platform: 'instagram' | 'twitter' | 'linkedin' | 'youtube' | 'tiktok'
  scheduledFor: string
  status: 'scheduled' | 'draft' | 'published'
}

const mockScheduledPosts: ScheduledPost[] = [
  { id: '1', title: 'AI Tools for Productivity', platform: 'linkedin', scheduledFor: '2025-01-27T10:00:00', status: 'scheduled' },
  { id: '2', title: 'Building Your Personal Brand', platform: 'twitter', scheduledFor: '2025-01-28T14:00:00', status: 'scheduled' },
  { id: '3', title: 'Content Creation Tips', platform: 'instagram', scheduledFor: '2025-01-30T09:00:00', status: 'draft' },
  { id: '4', title: 'Freelance Success Stories', platform: 'youtube', scheduledFor: '2025-02-01T11:00:00', status: 'scheduled' },
  { id: '5', title: 'Script Writing Guide', platform: 'tiktok', scheduledFor: '2025-02-05T16:00:00', status: 'scheduled' },
]

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const platformColors: Record<string, string> = {
  instagram: 'bg-pink-500',
  twitter: 'bg-sky-500',
  linkedin: 'bg-blue-600',
  youtube: 'bg-red-500',
  tiktok: 'bg-black',
}

function CalendarPage() {
  const { darkMode } = useAppStore()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1))
    setSelectedDate(null)
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1))
    setSelectedDate(null)
  }

  const getPostsForDate = (day: number): ScheduledPost[] => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return mockScheduledPosts.filter(post => post.scheduledFor.startsWith(dateStr))
  }

  const selectedDateString = selectedDate
    ? `${selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}, ${selectedDate.toLocaleDateString('en-US', { month: 'long' })} ${selectedDate.getDate()}`
    : null

  const selectedPosts = selectedDate
    ? getPostsForDate(selectedDate.getDate())
    : []

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Content Calendar
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Visualize and manage your scheduled content
            </p>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
            <CalendarIcon className="w-4 h-4 mr-2" />
            Add to Calendar
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-gray-900 dark:text-white">
                    {MONTHS[month]} {year}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={previousMonth}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={nextMonth}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1">
                  {DAYS.map(day => (
                    <div
                      key={day}
                      className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2"
                    >
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1
                    const posts = getPostsForDate(day)
                    const isSelected = selectedDate?.getDate() === day &&
                      selectedDate?.getMonth() === month &&
                      selectedDate?.getFullYear() === year
                    const isToday = new Date().toDateString() === new Date(year, month, day).toDateString()

                    return (
                      <motion.button
                        key={day}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedDate(new Date(year, month, day))}
                        className={`
                          aspect-square relative rounded-lg p-1 transition-colors
                          ${isSelected
                            ? 'bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500'
                            : isToday
                              ? 'bg-purple-50 dark:bg-purple-900/30'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                          }
                        `}
                      >
                        <div className={`
                          text-sm font-medium mb-1
                          ${isSelected
                            ? 'text-blue-700 dark:text-blue-300'
                            : isToday
                              ? 'text-purple-700 dark:text-purple-300'
                              : 'text-gray-900 dark:text-gray-100'
                          }
                        `}>
                          {day}
                        </div>
                        {posts.length > 0 && (
                          <div className="flex flex-col gap-0.5 overflow-hidden">
                            {posts.slice(0, 2).map((post, idx) => (
                              <div
                                key={idx}
                                className={`${platformColors[post.platform]} h-1.5 rounded-full`}
                              />
                            ))}
                          </div>
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-white">
                  {selectedDateString || 'Select a Date'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedPosts.length === 0 ? (
                  <div className="text-center py-8">
                    <CalendarIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No content scheduled</p>
                    <Button variant="outline" size="sm" className="mt-3">
                      Schedule Content
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedPosts.map((post, idx) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {post.title}
                          </span>
                          <span className={`
                            text-xs px-2 py-0.5 rounded-full
                            ${post.platform === 'linkedin' ? 'bg-blue-100 text-blue-700' :
                              post.platform === 'twitter' ? 'bg-sky-100 text-sky-700' :
                              post.platform === 'instagram' ? 'bg-pink-100 text-pink-700' :
                              post.platform === 'youtube' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }
                          `}>
                            {post.platform}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span className="text-xs">
                              {new Date(post.scheduledFor).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-500 hover:text-red-600">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-white">
                  Platform Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(platformColors).map(([platform, color]) => {
                    const count = mockScheduledPosts.filter(p => p.platform === platform).length
                    return (
                      <div key={platform} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${color}`} />
                          <span className="text-sm capitalize text-gray-700 dark:text-gray-300">
                            {platform}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {count}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default CalendarPage