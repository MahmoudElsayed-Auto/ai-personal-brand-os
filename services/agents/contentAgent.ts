import { generateContent } from '../ai/gemini';

export interface ContentOutput {
  title: string;
  hooks: string[];
  script: string;
  cta: string;
  platform?: string;
}

export interface GenerateScriptOptions {
  topic: string;
  platform?: 'youtube' | 'tiktok' | 'instagram' | 'twitter' | 'linkedin';
  tone?: 'professional' | 'casual' | 'educational' | 'entertaining';
}

/**
 * Generate script using Gemini AI
 * Returns structured content: title, hooks, script, CTA
 * 
 * @param topic - The topic to generate content about
 * @param options - Optional configuration for platform, tone, etc.
 * @returns ContentOutput with structured content
 */
export async function generateScript(
  topic: string,
  options?: GenerateScriptOptions
): Promise<ContentOutput> {
  const platform = options?.platform || 'youtube';
  const tone = options?.tone || 'professional';

  // Create prompt for Gemini
  const prompt = createPrompt(topic, platform, tone);

  try {
    // Call Gemini API
    const response = await generateContent(prompt, {
      temperature: 0.8,
      maxOutputTokens: 4096,
    });

    if (!response.success || !response.text) {
      console.warn('Gemini API failed, falling back to placeholder');
      return await placeholderGenerator(topic, options);
    }

    // Parse Gemini response
    const content = parseGeminiResponse(response.text, topic);
    
    return {
      ...content,
      platform,
    };
  } catch (error) {
    console.error('Error generating content with Gemini:', error);
    // Fallback to placeholder on error
    return await placeholderGenerator(topic, options);
  }
}

/**
 * Create prompt for Gemini API
 * Instructs to generate Arabic content creator style content
 */
function createPrompt(topic: string, platform: string, tone: string): string {
  const languageInstruction = 'Generate all content in Professional Arabic (اللغة العربية الفصحى).';
  
  const platformInstructions: Record<string, string> = {
    youtube: `
- Long-form content (5-10 minutes)
- Strong opening hook
- Detailed sections with examples
- Professional presentation style
- Clear structure: intro, main content, conclusion
- Include timestamps and sections`,
    
    tiktok: `
- Short-form content (15-60 seconds)
- Maximum impact in minimum time
- Trending style hooks
- Quick transitions
- Viral potential focus
- Add relevant emojis`,
    
    instagram: `
- Medium-length content (1-3 minutes for Reels)
- Visually-driven language
- Story-telling approach
- Engagement-focused hooks
- Include carousel structure if applicable
- Add relevant hashtags`,
    
    twitter: `
- Thread format (5-10 tweets)
- Concise, punchy statements
- Key insights only
- Thread structure with numbers
- Retweet-worthy takeaways
- Include relevant hashtags`,
    
    linkedin: `
- Professional tone
- Industry insights focus
- Business-oriented language
- Thought leadership style
- Call-to-action for engagement
- Include statistics and data if relevant`
  };

  const prompt = `You are an expert Arabic content creator specializing in ${platform} content creation. Your task is to create engaging, viral-worthy content in Arabic.

Topic: ${topic}
Platform: ${platform}
Tone: ${tone}

${languageInstruction}

Platform-specific requirements:
${platformInstructions[platform]}

Generate a JSON response with this exact structure:
{
  "title": "Engaging title in Arabic that grabs attention",
  "hooks": [
    "First hook in Arabic - emotional or curiosity-driven",
    "Second hook in Arabic - value proposition",
    "Third hook in Arabic - urgency or FOMO"
  ],
  "script": "Complete script in Arabic. Include:
    - Opening hook
    - Main content sections
    - Examples and stories
    - Key takeaways
    - Closing
    
    Format with clear sections using emojis and line breaks.",
  "cta": "Clear call-to-action in Arabic that drives engagement"
}

IMPORTANT RULES:
1. All content MUST be in Arabic
2. Use engaging, conversational Arabic
3. Include relevant emojis where appropriate
4. Make it platform-optimized
5. Ensure viral potential
6. Be authentic and relatable
7. Provide real value to the audience

Return ONLY valid JSON, no markdown formatting or additional text.`;

  return prompt;
}

/**
 * Parse Gemini response into structured content
 * Handles various response formats and ensures valid output
 */
function parseGeminiResponse(responseText: string, topic: string): Omit<ContentOutput, 'platform'> {
  try {
    // Try to extract JSON from the response
    // Sometimes Gemini wraps JSON in markdown code blocks
    let jsonStr = responseText;
    
    // Remove markdown code blocks if present
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }
    
    // Try to parse as JSON
    const parsed = JSON.parse(jsonStr);
    
    // Validate parsed content has required fields
    if (
      typeof parsed.title === 'string' &&
      Array.isArray(parsed.hooks) &&
      typeof parsed.script === 'string' &&
      typeof parsed.cta === 'string'
    ) {
      return {
        title: parsed.title,
        hooks: parsed.hooks.slice(0, 3), // Ensure max 3 hooks
        script: parsed.script,
        cta: parsed.cta,
      };
    }
    
    throw new Error('Invalid response structure');
  } catch (error) {
    console.error('Failed to parse Gemini response:', error);
    
    // Return fallback content
    return {
      title: `محتوى حصري عن ${topic}`,
      hooks: [
        `هل تعلم أن ${topic} يمكن أن يغير حياتك؟`,
        `في الـ60 ثانية القادمة، ستتعلم كل شيء عن ${topic}`,
        `سر ${topic} الذي لن تجده في مكان آخر`
      ],
      script: `مرحباً! في هذا المحتوى، سنتعلم كل شيء عن ${topic}.

${topic} هو موضوع مهم جداً ويؤثر على حياتنا اليومية.

في هذا المحتوى سنغطي:
- ما هو ${topic} ولماذا هو مهم
- كيف يمكنك الاستفادة من ${topic}
- نصائح عملية للتطبيق

هيا نبدأ!`,
      cta: `لا تنسى الاشتراك وتفعيل notifications للمزيد من المحتوى القيم!`
    };
  }
}

/**
 * Placeholder generator for development/testing
 * Returns mock structured content (fallback)
 */
async function placeholderGenerator(
  topic: string,
  options?: GenerateScriptOptions
): Promise<ContentOutput> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const platform = options?.platform || 'youtube';
  
  // Generate contextual placeholder content
  const output: ContentOutput = {
    title: generateTitle(topic),
    hooks: generateHooks(topic, platform),
    script: generateFullScript(topic, platform),
    cta: generateCTA(platform)
  };

  return output;
}

/**
 * Generate a compelling title
 */
function generateTitle(topic: string): string {
  const templates = [
    `The Ultimate Guide to ${topic}`,
    `${topic}: Everything You Need to Know in 2025`,
    `How ${topic} Will Change Your Life`,
    `Mastering ${topic}: A Comprehensive Guide`,
    `${topic} Explained: From Beginner to Expert`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * Generate platform-specific hooks
 */
function generateHooks(topic: string, platform: string): string[] {
  const hooksDB: Record<string, string[]> = {
    youtube: [
      `What if I told you ${topic} could change everything?`,
      `Stop scrolling! This ${topic} secret will blow your mind.`,
      `In the next 10 minutes, you'll master ${topic}.`,
      `I spent 1000 hours learning ${topic} so you don't have to.`,
      `The ${topic} industry doesn't want you to know this...`
    ],
    tiktok: [
      `POV: You just discovered ${topic} 👀`,
      `This ${topic} hack changed everything`,
      `Wait for it... ${topic} gets wild `,
      `${topic} in 60 seconds or less`,
      `They said ${topic} was impossible ☠️`
    ],
    instagram: [
      `${topic} drop 💎 Save this for later!`,
      `The truth about ${topic} no one talks about`,
      `${topic} reality check `,
      `3 ${topic} secrets you NEED to know`,
      `Why ${topic} matters more than ever `
    ],
    twitter: [
      `Hot take: ${topic} is underrated`,
      `Unpopular opinion: ${topic} >> [everything else]`,
      `Just discovered ${topic} and I'm obsessed`,
      `The ${topic} thread you've been waiting for `,
      `${topic} in one tweet:`
    ],
    linkedin: [
      `5 years ago, I knew nothing about ${topic}.`,
      `The ${topic} landscape is shifting rapidly.`,
      `Here's what I learned about ${topic} this quarter.`,
      `${topic} isn't just a trend—it's a transformation.`,
      `The future of ${topic} is here.`
    ]
  };

  const hooks = hooksDB[platform] || hooksDB.youtube;
  return hooks.slice(0, 3);
}

/**
 * Generate full script content
 */
function generateFullScript(topic: string, platform: string): string {
  if (platform === 'tiktok' || platform === 'twitter') {
    return generateShortScript(topic, platform);
  }
  
  return generateLongScript(topic);
}

/**
 * Generate short-form script (TikTok, Twitter)
 */
function generateShortScript(topic: string, platform: string): string {
  if (platform === 'twitter') {
    return `${topic} is reshaping how we think about [industry/field].

Here's what matters:

1. [Key insight about ${topic}]
2. [Important statistic]
3. [Actionable takeaway]

The bottom line? ${topic} is here to stay.

What do you think? 👇`;
  }

  return `[HOOK - 0-3s]
What if I told you ${topic} could 10x your results?

[BODY - 3-30s]
Here's the crazy part about ${topic}:
• Point 1: [Surprising fact]
• Point 2: [Key insight]
• Point 3: [Actionable tip]

[CTA - 30-60s]
Save this for later and follow for more ${topic} tips!`;
}

/**
 * Generate long-form script (YouTube, LinkedIn)
 */
function generateLongScript(topic: string): string {
  return `[INTRO - 0-30 seconds]
Hey everyone! Today we're diving deep into ${topic}.

If you've ever wondered about ${topic}, struggled with ${topic}, or just want to master ${topic}, this video is for you.

[HOOK - 30-60 seconds]
But first, let me ask you this: What if ${topic} could completely transform your [life/business/workflow]? Because for me, it did exactly that.

[SECTION 1: What is ${topic}? - 60-180 seconds]
So what exactly is ${topic}? 

${topic} is [clear definition]. It's fundamentally about [core concept]. 

Think of it like this: [relatable analogy].

When I first learned about ${topic}, I was skeptical. But after [time/experience], I realized it's one of the most powerful [tools/concepts/methods] out there.

Here's why ${topic} matters:
• [Reason 1]
• [Reason 2]
• [Reason 3]

[SECTION 2: Key Components - 180-300 seconds]
Now let's break down the key components of ${topic}:

**Component 1: [Name]**
[Detailed explanation with example]

**Component 2: [Name]**
[Detailed explanation with example]

**Component 3: [Name]**
[Detailed explanation with example]

[SECTION 3: How to Apply ${topic} - 300-420 seconds]
Alright, let's get practical. Here's how you can start using ${topic} today:

**Step 1: [Action]**
[Detailed instructions]

**Step 2: [Action]**
[Detailed instructions]

**Step 3: [Action]**
[Detailed instructions]

[Pro tip: [Insider advice]]

[SECTION 4: Common Mistakes - 420-480 seconds]
Before you go, let me share the biggest mistakes people make with ${topic}:

❌ Mistake 1: [Description]
✅ Solution: [How to avoid]

❌ Mistake 2: [Description]
✅ Solution: [How to avoid]

❌ Mistake 3: [Description]
✅ Solution: [How to avoid]

[SECTION 5: Real-World Examples - 480-540 seconds]
Let me show you some real-world examples of ${topic} in action:

[Example 1 with context]

[Example 2 with context]

[Example 3 with context]

[CONCLUSION - 540-600 seconds]
So there you have it - your complete guide to ${topic}.

Remember:
• [Key takeaway 1]
• [Key takeaway 2]
• [Key takeaway 3]

[OUTRO]
If this video helped you understand ${topic}, smash that like button and subscribe for more content like this.

Drop a comment below: What's your biggest question about ${topic}? I read every single one.

[END SCREEN]
Thanks for watching, and I'll see you in the next video!`;
}

/**
 * Generate platform-specific CTA
 */
function generateCTA(platform: string): string {
  const ctas: Record<string, string> = {
    youtube: "Subscribe and hit the notification bell for more content like this! Drop a comment below with your questions.",
    tiktok: "Follow for more tips! Save this video and share with someone who needs to hear this.",
    instagram: "Double-tap if this resonated! Save for later and share to your stories.",
    twitter: "Retweet if you agree. Follow for more insights on this topic.",
    linkedin: "Connect with me for more insights. Share your experience in the comments."
  };
  
  return ctas[platform] || ctas.youtube;
}

export default {
  generateScript
};