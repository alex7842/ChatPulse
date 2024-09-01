import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Plan } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean; user?: any } | { error: string }>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { userId, subscriptionId, subscriptionPlan, subscriptionStartDate, subscriptionEndDate, subscriptionStatus } = req.body;

  if (!userId || !subscriptionPlan) {
    return res.status(400).json({ error: 'User ID and subscription plan are required' });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        plan: subscriptionPlan.toUpperCase() as Plan,
        subscriptionId,
        subscriptionStartDate: new Date(subscriptionStartDate),
        subscriptionEndDate: new Date(subscriptionEndDate),
        subscriptionStatus,
      },
    });

    if (updatedUser) {
      return res.status(200).json({ success: true, user: updatedUser });
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
