import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/api';

export default withAuth(async (req: NextApiRequest, res: NextApiResponse, session) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const portfolioId = Number(req.query.id);
  if (isNaN(portfolioId)) {
    return res.status(400).json({ message: 'Invalid portfolio ID' });
  }

  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: {
        id: portfolioId,
        userId: session.user.id,
      },
      include: {
        assets: {
          include: {
            latestPrice: true,
          },
        },
      },
    });

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    // 포트폴리오 총 가치 계산
    const totalValue = portfolio.assets.reduce(
      (sum, asset) => sum + asset.amount * (asset.latestPrice?.price || 0),
      0
    );

    // 각 자산의 구매 가치 합계 계산
    const totalPurchaseValue = portfolio.assets.reduce(
      (sum, asset) => sum + asset.amount * asset.avgPrice,
      0
    );

    // 수익/손실 계산
    const profit = totalValue - totalPurchaseValue;
    const profitPercentage = totalPurchaseValue > 0 ? (profit / totalPurchaseValue) * 100 : 0;

    // 각 자산의 비중 계산
    const assetsWithPercentage = portfolio.assets.map((asset) => {
      const value = asset.amount * (asset.latestPrice?.price || 0);
      const percentage = totalValue > 0 ? (value / totalValue) * 100 : 0;

      return {
        id: asset.id,
        symbol: asset.symbol,
        name: asset.name,
        type: asset.type,
        amount: asset.amount,
        avgPrice: asset.avgPrice,
        tgtRatio: asset.tgtRatio,
        currentPrice: asset.latestPrice?.price || 0,
        currency: asset.latestPrice?.currency || 'USD',
        percentage: Number(percentage.toFixed(1)),
      };
    });

    return res.status(200).json({
      id: portfolio.id,
      name: portfolio.name,
      totalValue,
      profit,
      profitPercentage,
      assets: assetsWithPercentage,
    });
  } catch (error) {
    console.error('Error fetching portfolio detail:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
