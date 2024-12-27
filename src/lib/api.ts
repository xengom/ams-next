import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

type ApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
  session: { user: { id: string } }
) => Promise<void | NextApiResponse>;

export const withAuth =
  (handler: ApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      await handler(req, res, session);
    } catch (error) {
      console.error('API error:', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
