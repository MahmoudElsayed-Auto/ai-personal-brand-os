export interface BrandProfile {
  id: string
  name: string
  slug: string
  userId: string
  website: string | null
  description: string | null
  logo: string | null
  primaryColor: string | null
  secondaryColor: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateBrandProfileRequest {
  name: string
  website?: string
  description?: string
  logo?: string
  primaryColor?: string
  secondaryColor?: string
}

export interface UpdateBrandProfileRequest {
  name?: string
  website?: string
  description?: string
  logo?: string
  primaryColor?: string
  secondaryColor?: string
}

export interface BrandVoice {
  tone: string
  style: string
  keywords: string[]
  avoidKeywords: string[]
  targetAudience: string
}