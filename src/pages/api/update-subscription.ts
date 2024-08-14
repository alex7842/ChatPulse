import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Plan } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ success: boolean } | { error: string }>
  ) {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  
    const { userId, newStatus } = req.body;
  
    if (!userId || !newStatus) {
      return res.status(400).json({ error: 'User ID and new status are required' });
    }
  
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { plan: newStatus.toUpperCase() as Plan },
      });
  
      if (updatedUser) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
      return res.status(500).json({ error: 'Failed to update subscription' });
    } finally {
      await prisma.$disconnect();
    }
  }
  