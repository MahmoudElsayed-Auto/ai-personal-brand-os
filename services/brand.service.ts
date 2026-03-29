import { prisma } from '@/lib/prisma';
import type { BrandProfile, CreateBrandProfileRequest, UpdateBrandProfileRequest } from '@/types/brand';

export const brandService = {
  create: async (data: CreateBrandProfileRequest & { userId: string }) => {
    return prisma.brandProfile.create({
      data: {
        userId: data.userId,
        brandName: data.brandName,
        brandVoice: data.brandVoice || null,
        targetAudience: data.targetAudience || null,
        brandValues: data.brandValues || null,
        visualIdentity: data.visualIdentity || null,
        positioning: data.positioning || null,
        keywords: data.keywords || [],
      }
    });
  },

  getByUserId: async (userId: string) => {
    return prisma.brandProfile.findFirst({
      where: { userId },
    });
  },

  update: async (id: string, data: UpdateBrandProfileRequest) => {
    return prisma.brandProfile.update({
      where: { id },
      data: {
        brandName: data.brandName,
        brandVoice: data.brandVoice,
        targetAudience: data.targetAudience,
        brandValues: data.brandValues,
        visualIdentity: data.visualIdentity,
        positioning: data.positioning,
        keywords: data.keywords,
      }
    });
  },

  delete: async (id: string) => {
    return prisma.brandProfile.delete({
      where: { id }
    });
  },
};
