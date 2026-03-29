export interface BrandProfile {
  id: string
  userId: string
  brandName: string
  brandVoice: string | null
  targetAudience: string | null
  brandValues: string | null
  visualIdentity: any // Json
  positioning: string | null
  keywords: string[]
  createdAt: Date
  updatedAt: Date
}

export interface CreateBrandProfileRequest {
  brandName: string
  brandVoice?: string
  targetAudience?: string
  brandValues?: string
  visualIdentity?: any
  positioning?: string
  keywords?: string[]
}

export interface UpdateBrandProfileRequest {
  brandName?: string
  brandVoice?: string
  targetAudience?: string
  brandValues?: string
  visualIdentity?: any
  positioning?: string
  keywords?: string[]
}
