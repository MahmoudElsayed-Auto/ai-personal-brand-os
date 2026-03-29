export enum SubscriptionTier {
  FREE = 'FREE',
  PRO = 'PRO',
  AGENCY = 'AGENCY',
  ENTERPRISE = 'ENTERPRISE'
}

export interface User {
  id: string
  email: string
  name: string | null
  avatar: string | null
  subscriptionTier: SubscriptionTier
  createdAt: Date
  updatedAt: Date
}

export interface UserProfile {
  id: string
  email: string
  name: string | null
  avatar: string | null
  subscriptionTier: SubscriptionTier
  brandProfiles: number
  contentCount: number
  createdAt: string
}

export interface UpdateUserRequest {
  name?: string
  avatar?: string
}