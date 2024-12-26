import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const portfolios = await prisma.portfolio.findMany({
        include: {
          assets: true,
        },
      });
      res.status(200).json(portfolios);
    } catch (error) {
      console.error('Error fetching portfolios:', error);
      res.status(500).json({ error: 'Failed to fetch portfolios' });
    }
  } else if (req.method === 'POST') {
    const { name, currency } = req.body;

    if (!name || !currency) {
      return res.status(400).json({ error: 'Name and currency are required' });
    }

    try {
      const newPortfolio = await prisma.portfolio.create({
        data: {
          name,
          description: '',
          userId: 1,
          assets: {
            create: [],
          },
          currency: currency,
        },
      });

      res.status(201).json(newPortfolio);
    } catch (error) {
      console.error('Error creating portfolio:', error);
      res.status(500).json({ error: 'Failed to create portfolio' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
