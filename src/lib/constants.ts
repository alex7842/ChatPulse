import { Plan } from "@prisma/client";

interface PlanData {
  title: string;
  price: number;
  maxDocs: number;
  maxPagesPerDoc: number;
  maxFileSizePerDoc: number; // Changed to number for easier comparison
  maxCollaboratorsPerDoc: number;
}

export const PLANS: Record<Plan, PlanData> = {
  FREE: {
    title: "Free",
    price: 0,
    maxDocs: 1, // Changed from 1 to 2
    maxPagesPerDoc: 6, // Changed from 5 to 6
    maxFileSizePerDoc: 6 * 1024 * 1024, // 8MB in bytes
    maxCollaboratorsPerDoc: 0,
  },
  PRO: {
    title: "Pro",
    price: 9.99,
    maxDocs: Infinity, // Changed from 100 to Infinity for unlimited docs
    maxPagesPerDoc: 50, // Changed from 20 to 50
    maxFileSizePerDoc: 10 * 1024 * 1024, // 64MB in bytes
    maxCollaboratorsPerDoc: 5,
  },
};