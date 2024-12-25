import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  // 예시 데이터
  const portfolios = [
    {
      id: '1',
      name: 'Portfolio 1',
      totalValue: 100000,
      totalReturn: 5000,
    },
    {
      id: '2',
      name: 'Portfolio 2',
      totalValue: 200000,
      totalReturn: 10000,
    },
  ];

  const portfolio = portfolios.find((p) => p.id === id);

  if (portfolio) {
    res.status(200).json(portfolio);
  } else {
    res.status(404).json({ error: 'Portfolio not found' });
  }
}
