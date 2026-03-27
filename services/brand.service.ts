import { prisma } from '@/lib/prisma';
import type { Brand, BrandVoice, ContentPillar } from '@prisma/client';

export const brandService = {
  create: async (data: {
    name: string;
    mission: string;
    vision: string;
    values: string[];
    userId: string;
  }) => {
    return prisma.brand.create({
      data: {
        name: data.name,
        mission: data.mission,
        vision: data.vision,
        values: data.values,
        userId: data.userId
      }
    });
  },

  getByUserId: async (userId: string) => {
    return prisma.brand.findFirst({
      where: { userId },
      include: {
        voices: true,
        contentPillars: true
      }
    });
  },

  update: async (id: string, data: Partial<Brand>) => {
    return prisma.brand.update({
      where: { id },
      data
    });
  },

  delete: async (id: string) => {
    return prisma.brand.delete({
      where: { id }
    });
  },

  createVoice: async (data: {
    name: string;
    traits: string[];
    examples: string[];
    brandId: string;
  }) => {
    return prisma.brandVoice.create({
      data: {
        name: data.name,
        traits: data.traits,
        examples: data.examples,
        brandId: data.brandId
      }
    });
  },

  createContentPillar: async (data: {
    name: string;
    description: string;
    brandId: string;
  }) => {
    return prisma.contentPillar.create({
      data: {
        name: data.name,
        description: data.description,
        brandId: data.brandId
      }
    });
  }
};