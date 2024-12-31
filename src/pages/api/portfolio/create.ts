import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/api';

export default withAuth(async (req: NextApiRequest, res: NextApiResponse, session) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ message: 'Portfolio name is required' });
  }

  try {
    const portfolio = await prisma.portfolio.create({
      data: {
        name,
        userId: session.user.id,
      },
    });

    return res.status(201).json(portfolio);
  } catch (error) {
    console.error('Error creating portfolio:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
