import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const response = await fetch(
        'https://m.search.naver.com/p/csearch/content/qapirender.nhn?key=calculator&pkid=141&q=환율&where=m&u1=keb&u6=standardUnit&u7=0&u3=USD&u4=KRW&u8=down&u2=1'
      );
      const data = await response.json();
      const exchangeRate = data.country?.[1]?.value.replace(',', '');
      res.status(200).json({ rate: parseFloat(exchangeRate) });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch exchange rate' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
