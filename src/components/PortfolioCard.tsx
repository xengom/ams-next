import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Switch } from '@mui/material';
import { useRouter } from 'next/router';

interface Portfolio {
  id: number;
  name: string;
  description: string;
  totalValue: number;
  totalReturn: number;
}

export default function PortfolioCard({
  portfolio,
  onToggle,
}: {
  portfolio: Portfolio;
  onToggle: (id: number, checked: boolean) => void;
}) {
  const router = useRouter();
  const [checked, setChecked] = useState(true);

  const handleClick = () => {
    router.push(`/portfolio/${portfolio.id}`);
  };

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    onToggle(portfolio.id, event.target.checked);
  };

  return (
    <Card sx={{ cursor: 'pointer' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box onClick={handleClick}>
            <Typography variant="h6">{portfolio.name}</Typography>
            <Typography variant="body1">{portfolio.totalValue}</Typography>
            <Typography variant="body1" color={portfolio.totalReturn >= 0 ? 'error' : 'primary'}>
              Profit: ₩{portfolio.totalReturn} (+{' '}
              {(
                (portfolio.totalReturn / (portfolio.totalValue - portfolio.totalReturn)) *
                100
              ).toFixed(2)}
              %)
            </Typography>
          </Box>
          <Switch checked={checked} onChange={handleToggle} />
        </Box>
      </CardContent>
    </Card>
  );
}
