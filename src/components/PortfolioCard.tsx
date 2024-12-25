import React from 'react';
import { Card, CardContent, Typography, Box, Switch } from '@mui/material';
import { useRouter } from 'next/router';

interface Portfolio {
  id: number;
  name: string;
  description: string;
  totalValue: number;
  totalReturn: number;
}

export default function PortfolioCard({ portfolio }: { portfolio: Portfolio }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/portfolio/${portfolio.id}`);
  };

  return (
    <Card onClick={handleClick} sx={{ cursor: 'pointer' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6">{portfolio.name}</Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {portfolio.description}
            </Typography>
            <Typography variant="body1">
              평가금: ₩{portfolio.totalValue.toLocaleString()}
            </Typography>
            <Typography variant="body1" color={portfolio.totalReturn >= 0 ? 'error' : 'primary'}>
              수익: ₩{portfolio.totalReturn.toLocaleString()} (+{' '}
              {(
                (portfolio.totalReturn / (portfolio.totalValue - portfolio.totalReturn)) *
                100
              ).toFixed(2)}
              %)
            </Typography>
          </Box>
          <Switch />
        </Box>
      </CardContent>
    </Card>
  );
}
