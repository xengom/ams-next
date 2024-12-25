import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const portfolios = [
      {
        id: 1,
        name: 'Portfolio 1',
        description: 'Description 1',
        totalValue: 100000,
        totalReturn: 5000,
      },
      {
        id: 2,
        name: 'Portfolio 2',
        description: 'Description 2',
        totalValue: 200000,
        totalReturn: 10000,
      },
    ];
    res.status(200).json(portfolios);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
