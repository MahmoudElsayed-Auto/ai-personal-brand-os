export interface ApiKey {
  id: string
  name: string
  key: string
  userId: string
  createdAt: Date
  updatedAt: Date
  lastUsedAt: Date | null
}

export interface CreateApiKeyRequest {
  name: string
}

export interface ApiKeyResponse {
  id: string
  name: string
  key: string
  createdAt: string
  lastUsedAt: string | null
}