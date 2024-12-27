import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/api';

export default withAuth(async (req: NextApiRequest, res: NextApiResponse, session) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { id } = req.query;

  const portfolio = await prisma.portfolio.findFirst({
    where: {
      id: Number(id),
      userId: session.user.id,
    },
  });

  if (!portfolio) {
    return res.status(404).json({ error: '포트폴리오를 찾을 수 없습니다' });
  }

  const assets = await prisma.asset.findMany({
    where: { portfolioId: Number(id) },
    include: {
      latestPrice: true,
      transactions: {
        orderBy: {
          date: 'desc',
        },
      },
    },
  });

  return res.status(200).json(assets);
});
