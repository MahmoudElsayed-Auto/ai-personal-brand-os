import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.analytics.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.apiKey.deleteMany();
  await prisma.proposal.deleteMany();
  await prisma.freelanceJob.deleteMany();
  await prisma.agentTask.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.script.deleteMany();
  await prisma.content.deleteMany();
  await prisma.brandProfile.deleteMany();
  await prisma.user.deleteMany();

  // Create demo user
  const hashedPassword = await hash('demo123456', 12);
  const user = await prisma.user.create({
    data: {
      email: 'demo@personalbrand.ai',
      name: 'Demo User',
      password: hashedPassword,
      emailVerified: new Date(),
    },
  });

  console.log('✅ Created demo user:', user.email);

  // Create brand profile
  const brandProfile = await prisma.brandProfile.create({
    data: {
      userId: user.id,
      name: 'Personal Brand OS',
      tagline: 'Build your personal brand with AI',
      bio: 'We help content creators, freelancers, and entrepreneurs build authentic personal brands using AI-powered tools.',
      website: 'https://personalbrand.ai',
      topics: ['AI', 'Technology', 'Productivity', 'Marketing', 'Business'],
      tone: 'professional',
      targetAudience: 'Entrepreneurs, content creators, and freelancers looking to build their personal brand',
      primaryGoals: [
        'Build thought leadership',
        'Increase visibility',
        'Generate leads',
        'Monetize expertise',
      ],
      uniqueValue: 'AI-powered content creation and brand management',
      competitorAnalysis: [
        { name: 'ChatGPT', strengths: ['General AI'], weaknesses: ['Not specialized'] },
        { name: 'Notion AI', strengths: ['Note-taking'], weaknesses: ['Limited content creation'] },
      ],
    },
  });

  console.log('✅ Created brand profile:', brandProfile.name);

  // Create content examples
  const linkedinPost = await prisma.content.create({
    data: {
      userId: user.id,
      brandProfileId: brandProfile.id,
      type: 'LINKEDIN_POST',
      title: 'How AI is Transforming Personal Branding',
      status: 'PUBLISHED',
      topic: 'AI',
      keywords: ['AI', 'personal branding', 'content creation'],
      platform: 'LINKEDIN',
      publishedAt: new Date(),
    },
  });

  console.log('✅ Created LinkedIn post content');

  const twitterThread = await prisma.content.create({
    data: {
      userId: user.id,
      brandProfileId: brandProfile.id,
      type: 'TWITTER_THREAD',
      title: '5 Ways to Build Your Personal Brand in 2024',
      status: 'DRAFT',
      topic: 'Personal Branding',
      keywords: ['personal branding', 'twitter', 'content'],
      platform: 'TWITTER',
    },
  });

  console.log('✅ Created Twitter thread content');

  // Create scripts
  const linkedinScript = await prisma.script.create({
    data: {
      contentId: linkedinPost.id,
      version: 1,
      content: `🚀 How AI is Transforming Personal Branding

In today's digital age, building a personal brand isn't just nice to have—it's essential.

Here's what I've learned:

1️⃣ Authenticity > Perfection
People connect with real stories, not polished facades.

2️⃣ Consistency is Key
Show up regularly. Your audience needs to see you consistently.

3️⃣ Leverage AI Tools
Use AI to amplify your reach, not replace your voice.

The future of personal branding is AI-enhanced, not AI-replaced.

What's your biggest challenge with personal branding? Let me know in the comments.

#PersonalBranding #AI #ContentCreation #Entrepreneurship`,
      metadata: {
        wordCount: 78,
        characterCount: 412,
        hashtags: 4,
      },
    },
  });

  console.log('✅ Created LinkedIn script');

  const twitterScript = await prisma.script.create({
    data: {
      contentId: twitterThread.id,
      version: 1,
      content: `🎯 5 Ways to Build Your Personal Brand in 2024

Thread 🧵👇

1/ Start with your WHY

What drives you? What do you stand for?

Your personal brand should reflect your core values and mission.

2/ Create valuable content consistently

Don't just share—provide value.

Teach, inspire, entertain. Give before you ask.

3/ Engage authentically

Don't just broadcast. Build relationships.

Respond to comments. Ask questions. Be human.

4/ Leverage your unique perspective

No one has your exact combination of experiences.

Your unique viewpoint is your superpower.

5/ Use AI as an amplifier

AI can help you create more, faster.

But your voice, your story—that's irreplaceable.

What would you add to this list?`,
      metadata: {
        tweetCount: 8,
        wordCount: 95,
        characterCount: 542,
      },
    },
  });

  console.log('✅ Created Twitter thread script');

  // Create schedules
  await prisma.schedule.create({
    data: {
      contentId: linkedinPost.id,
      platform: 'LINKEDIN',
      scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      timezone: 'UTC',
      status: 'SCHEDULED',
    },
  });

  console.log('✅ Created LinkedIn schedule');

  await prisma.schedule.create({
    data: {
      contentId: twitterThread.id,
      platform: 'TWITTER',
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      timezone: 'UTC',
      status: 'DRAFT',
    },
  });

  console.log('✅ Created Twitter schedule');

  // Create agent tasks
  await prisma.agentTask.createMany({
    data: [
      {
        userId: user.id,
        type: 'CONTENT_GENERATION',
        status: 'COMPLETED',
        input: { topic: 'AI in personal branding', platform: 'LINKEDIN' },
        output: { contentId: linkedinPost.id },
        metadata: { model: 'gemini-2.0-flash' },
      },
      {
        userId: user.id,
        type: 'CONTENT_GENERATION',
        status: 'IN_PROGRESS',
        input: { topic: 'Personal branding tips', platform: 'TWITTER' },
        metadata: { model: 'gemini-2.0-flash' },
      },
      {
        userId: user.id,
        type: 'BRAND_ANALYSIS',
        status: 'PENDING',
        input: { brandProfileId: brandProfile.id },
      },
    ],
  });

  console.log('✅ Created agent tasks');

  // Create freelance jobs
  await prisma.freelanceJob.createMany({
    data: [
      {
        title: 'Senior React Developer',
        company: 'TechCorp',
        location: 'Remote',
        type: 'FULL_TIME',
        salary: '$120k - $150k',
        description: 'Build scalable React applications with modern tooling.',
        requirements: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
        source: 'LINKEDIN',
        sourceUrl: 'https://linkedin.com/jobs/123',
        postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        title: 'Freelance Content Writer',
        company: 'StartupXYZ',
        location: 'Remote',
        type: 'CONTRACT',
        salary: '$50 - $80/hour',
        description: 'Create engaging content for tech blog and documentation.',
        requirements: ['Technical Writing', 'SEO', 'SaaS'],
        source: 'UPWORK',
        sourceUrl: 'https://upwork.com/jobs/456',
        postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
    ],
  });

  console.log('✅ Created freelance jobs');

  // Create proposals
  await prisma.proposal.createMany({
    data: [
      {
        userId: user.id,
        freelanceJobId: 1,
        status: 'DRAFT',
        content: 'Proposal for React Developer position...',
        bidAmount: 130000,
        estimatedDuration: '3 months',
        coverLetter: 'Hello, I am interested in...',
      },
    ],
  });

  console.log('✅ Created proposals');

  // Create API key
  await prisma.apiKey.create({
    data: {
      userId: user.id,
      name: 'Demo API Key',
      key: 'pk_demo_' + Buffer.from(Date.now().toString()).toString('base64'),
      permissions: ['read', 'write'],
      lastUsedAt: new Date(),
    },
  });

  console.log('✅ Created API key');

  // Create analytics
  await prisma.analytics.createMany({
    data: [
      {
        userId: user.id,
        contentId: linkedinPost.id,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        impressions: 1250,
        clicks: 48,
        likes: 92,
        comments: 23,
        shares: 15,
        saves: 8,
        platform: 'LINKEDIN',
      },
      {
        userId: user.id,
        contentId: linkedinPost.id,
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        impressions: 980,
        clicks: 35,
        likes: 67,
        comments: 18,
        shares: 12,
        saves: 5,
        platform: 'LINKEDIN',
      },
    ],
  });

  console.log('✅ Created analytics');

  // Create subscription
  await prisma.subscription.create({
    data: {
      userId: user.id,
      plan: 'PRO',
      status: 'ACTIVE',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      stripeCustomerId: 'cus_demo123',
      stripeSubscriptionId: 'sub_demo456',
    },
  });

  console.log('✅ Created subscription');

  console.log('🌱 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });