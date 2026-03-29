import { PrismaClient, UserRole, Platform, ContentType, ContentStatus, AgentType, AgentTaskStatus, JobStatus, ProposalStatus, SubscriptionStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data (in correct order to respect foreign keys)
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
  const user = await prisma.user.create({
    data: {
      email: 'demo@personalbrand.ai',
      name: 'Demo User',
      role: UserRole.USER,
    },
  });

  console.log('✅ Created demo user:', user.email);

  // Create brand profile
  const brandProfile = await prisma.brandProfile.create({
    data: {
      userId: user.id,
      brandName: 'Personal Brand OS',
      brandVoice: 'Professional',
      targetAudience: 'Entrepreneurs, content creators, and freelancers',
      brandValues: 'Authenticity, Consistency, AI-enhanced',
      positioning: 'AI-powered content creation and brand management',
      keywords: ['AI', 'Technology', 'Productivity', 'Marketing', 'Business'],
    },
  });

  console.log('✅ Created brand profile:', brandProfile.brandName);

  // Create content examples
  const linkedinPost = await prisma.content.create({
    data: {
      userId: user.id,
      title: 'How AI is Transforming Personal Branding',
      slug: 'how-ai-is-transforming-personal-branding',
      platform: Platform.LINKEDIN,
      type: ContentType.POST,
      status: ContentStatus.PUBLISHED,
    },
  });

  console.log('✅ Created LinkedIn post content');

  // Create scripts
  await prisma.script.create({
    data: {
      contentId: linkedinPost.id,
      scriptText: '🚀 How AI is Transforming Personal Branding...',
    },
  });

  console.log('✅ Created script');

  // Create schedules
  await prisma.schedule.create({
    data: {
      contentId: linkedinPost.id,
      platform: Platform.LINKEDIN,
      scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    },
  });

  console.log('✅ Created schedule');

  // Create agent tasks
  await prisma.agentTask.createMany({
    data: [
      {
        userId: user.id,
        agentType: AgentType.CONTENT_WRITER,
        status: AgentTaskStatus.COMPLETED,
        input: JSON.stringify({ topic: 'AI in personal branding', platform: 'LINKEDIN' }),
      },
    ],
  });

  console.log('✅ Created agent tasks');

  // Create freelance jobs
  await prisma.freelanceJob.createMany({
    data: [
      {
        title: 'Senior React Developer',
        description: 'Build scalable React applications with modern tooling.',
        url: 'https://linkedin.com/jobs/123',
        platform: 'LINKEDIN',
        status: JobStatus.OPEN,
      },
    ],
  });

  console.log('✅ Created freelance jobs');

  // Create API key
  await prisma.apiKey.create({
    data: {
      userId: user.id,
      name: 'Demo API Key',
      key: 'pk_demo_' + Buffer.from(Date.now().toString()).toString('base64'),
    },
  });

  console.log('✅ Created API key');

  // Create subscription
  await prisma.subscription.create({
    data: {
      userId: user.id,
      plan: 'PRO',
      status: SubscriptionStatus.ACTIVE,
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
