import { Plan } from "@prisma/client";

interface PlanData {
  title: string;
  price: number;
  maxDocs: number;
  maxPagesPerDoc: number;
  maxFileSizePerDoc: number;
  maxCollaboratorsPerDoc: number;
}

export const PLANS: Record<Plan, PlanData> = {
  FREE: {
    title: "Free",
    price: 0,
    maxDocs: 1,
    maxPagesPerDoc: 12,
    maxFileSizePerDoc: 7 * 1024 * 1024,
    maxCollaboratorsPerDoc: 0,
  },
  PRO: {
    title: "Pro",
    price: 9.99,
    maxDocs: Infinity,
    maxPagesPerDoc: 50,
    maxFileSizePerDoc: 10 * 1024 * 1024,
    maxCollaboratorsPerDoc: 5,
  },
};
