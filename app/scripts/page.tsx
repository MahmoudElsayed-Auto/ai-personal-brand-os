'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { 
  Sparkles, 
  FileText, 
  Copy, 
  Download, 
  RefreshCw,
  Video,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Loader2,
  CheckCircle2,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GeneratedScript {
  id: string;
  topic: string;
  platform: 'youtube' | 'instagram' | 'twitter' | 'linkedin';
  content: string;
  createdAt: Date;
}

export default function ScriptsPage() {
  const { darkMode } = useAppStore();
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState<'youtube' | 'instagram' | 'twitter' | 'linkedin'>('youtube');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<GeneratedScript | null>(null);
  const [copied, setCopied] = useState(false);

  const platforms = [
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'from-red-500 to-red-600' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'from-pink-500 to-purple-600' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'from-blue-400 to-blue-500' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'from-blue-600 to-blue-700' },
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/scripts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform }),
      });
      const data = await response.json();
      
      setGeneratedScript({
        id: Date.now().toString(),
        topic,
        platform,
        content: data.content || generateMockScript(topic, platform),
        createdAt: new Date(),
      });
    } catch (error) {
      // Use mock data if API fails
      setGeneratedScript({
        id: Date.now().toString(),
        topic,
        platform,
        content: generateMockScript(topic, platform),
        createdAt: new Date(),
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockScript = (topic: string, platform: string) => {
    const templates: Record<string, string> = {
      youtube: `🎬 YouTube Script: ${topic}

📌 HOOK (0-15 seconds)
"Most people get ${topic} completely wrong. Here's what they don't tell you..."

📖 INTRO (15-45 seconds)
Brief introduction to the topic and why it matters. Share a surprising statistic or personal story to build credibility.

🎯 MAIN CONTENT (3-5 minutes)
Point 1: The biggest misconception about ${topic}
- Explain the common mistake
- Provide evidence/examples
- Show the correct approach

Point 2: Practical steps to get started
- Step-by-step breakdown
- Tools and resources mentioned
- Common pitfalls to avoid

Point 3: Advanced strategies
- Pro tips and techniques
- Real-world case studies
- Actionable frameworks

💡 CALL TO ACTION
"Subscribe for more content like this and drop a comment with your biggest ${topic} challenge!"

#Ending: "This is [Your Name], and I'll see you in the next one."`,

      instagram: `📸 Instagram Carousel: ${topic}

Slide 1 (Cover):
${topic.toUpperCase()}:
The Complete Guide
[Eye-catching image]

Slide 2:
❌ What Most People Think
${topic} is complicated
${topic} requires X
${topic} takes years to master

Slide 3:
✅ The Truth
${topic} can be simple
${topic} needs only X
${topic} starts today

Slide 4:
🔧 Step 1: Foundation
[3 quick bullet points about getting started]

Slide 5:
⚡ Step 2: Momentum
[3 tips for building consistency]

Slide 6:
🚀 Step 3: Scale
[How to take it to the next level]

Caption:
Want to master ${topic}? Here's everything you need to know... 

Save this post for later! 📌

#${topic.replace(/\s+/g, '')} #growth #tips`,

      twitter: `🐦 Twitter Thread: ${topic}

1/ Here's everything I learned about ${topic} after 5 years in the field: 

A thread 🧵👇

2/ Most people overcomplicate ${topic}

The truth? You only need to focus on 3 things:

3/ First: [Key principle #1]
- Why it matters
- How to apply it
- Common mistakes

4/ Second: [Key principle #2]
- The framework I use
- Tools that help
- Real results

5/ Third: [Key principle #3]
- The secret sauce
- My personal strategy
- What I wish I knew earlier

6/ If you want to master ${topic}, start here:
[Specific action step]

7/ What's your biggest ${topic} challenge?

Reply below and I'll personally help you out.

Retweet the first tweet if this was helpful 🔁`,

      linkedin: `💼 LinkedIn Article Framework: ${topic}

HEADLINE:
${topic}: A Practical Guide for Professionals

OPENING:
"After 10 years in the industry, here's what nobody tells you about ${topic}..."

KEY SECTION 1: The Current Landscape
[Industry context + statistics]

KEY SECTION 2: Common Challenges
[3 pain points your audience faces]

KEY SECTION 3: Solutions That Work
[Actionable strategies with examples]

KEY SECTION 4: Getting Started
[Step-by-step implementation guide]

KEY SECTION 5: Future Outlook
[Where the industry is heading]

CLOSING:
What's your experience with ${topic}? Share your thoughts in the comments.

#hashtag1 #hashtag2 #hashtag3`,
    };

    return templates[platform] || templates.youtube;
  };

  const handleCopy = async () => {
    if (!generatedScript) return;
    await navigator.clipboard.writeText(generatedScript.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!generatedScript) return;
    const blob = new Blob([generatedScript.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${topic.replace(/\s+/g, '_')}_${platform}_script.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Script Generator
          </h1>
          <p className="text-gray-500 mt-1">Generate AI-powered scripts for any platform</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="w-4 h-4" />
          Settings
        </Button>
      </motion.div>

      {/* Platform Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-lg font-semibold mb-4">Select Platform</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {platforms.map((p) => {
            const Icon = p.icon;
            return (
              <motion.button
                key={p.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPlatform(p.id as 'youtube' | 'instagram' | 'twitter' | 'linkedin')}
                className={`
                  relative overflow-hidden rounded-lg p-4 flex flex-col items-center gap-2
                  transition-colors border-2
                  ${platform === p.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }
                `}
              >
                <div className={`p-2 rounded-lg bg-gradient-to-br ${p.color}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium">{p.name}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Topic Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              What's your content topic?
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., How to build a personal brand as a developer, Tips for launching a SaaS product..."
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              rows={3}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleGenerate}
            disabled={!topic.trim() || isGenerating}
            className={`
              w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2
              bg-gradient-to-r from-blue-600 to-purple-600 text-white
              hover:from-blue-700 hover:to-purple-700
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all shadow-lg shadow-blue-500/25
            `}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Script
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Generated Script */}
      <AnimatePresence mode="wait">
        {generatedScript && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Generated Script</h3>
                  <p className="text-sm text-gray-500">
                    {generatedScript.platform.charAt(0).toUpperCase() + generatedScript.platform.slice(1)} • {new Date(generatedScript.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopy}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownload}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGenerate}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Regenerate"
                >
                  <RefreshCw className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
            
            <div className="prose dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-auto border border-gray-200 dark:border-gray-700">
                {generatedScript.content}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
      >
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          Tips for Better Scripts
        </h3>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            Be specific with your topic - include audience, tone, and key points
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            Choose the right platform for your content type
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            Regenerate until you get the perfect script
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            Edit the generated content to add your personal touch
          </li>
        </ul>
      </motion.div>
    </div>
  );
}