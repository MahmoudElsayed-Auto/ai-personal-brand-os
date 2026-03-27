export enum ContentStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export enum ContentType {
  TWEET = 'TWEET',
  THREAD = 'THREAD',
  BLOG_POST = 'BLOG_POST',
  LINKEDIN_POST = 'LINKEDIN_POST',
  INSTAGRAM_CAPTION = 'INSTAGRAM_CAPTION',
  NEWSLETTER = 'NEWSLETTER'
}

export interface Content {
  id: string
  userId: string
  brandProfileId: string | null
  type: ContentType
  status: ContentStatus
  title: string
  body: string
  metadata: Record<string, unknown> | null
  scheduledAt: Date | null
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateContentRequest {
  type: ContentType
  title: string
  body: string
  brandProfileId?: string
  metadata?: Record<string, unknown>
  scheduledAt?: Date
}

export interface UpdateContentRequest {
  title?: string
  body?: string
  status?: ContentStatus
  scheduledAt?: Date
  metadata?: Record<string, unknown>
}