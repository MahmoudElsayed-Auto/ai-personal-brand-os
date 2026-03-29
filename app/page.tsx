import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <div className="container mx-auto px-4 py-16 sm:py-24 lg:py-32">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              AI Personal Brand OS
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Build, manage, and automate your personal brand with AI-powered tools for content creation, social media management, and brand consistency.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Create Account
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-lg font-semibold mb-2">AI Content Creation</h3>
              <p className="text-muted-foreground text-sm">
                Generate brand-aligned content with AI assistance for blogs, social media, and newsletters.
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-lg font-semibold mb-2">Brand Management</h3>
              <p className="text-muted-foreground text-sm">
                Maintain consistent brand identity across all platforms with centralized asset management.
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-lg font-semibold mb-2">Analytics & Insights</h3>
              <p className="text-muted-foreground text-sm">
                Track brand performance and audience engagement with detailed analytics dashboards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}