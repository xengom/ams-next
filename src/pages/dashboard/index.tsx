import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Box,
  IconButton,
} from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import BottomNav from '../../components/BottomNav';
import PortfolioCard from '../../components/PortfolioCard';

interface Portfolio {
  id: number;
  name: string;
  description: string;
  totalValue: number;
  totalReturn: number;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [portfolioData, setPortfolioData] = useState<Portfolio[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [totalReturn, setTotalReturn] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [navValue, setNavValue] = useState(2);

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated' || !session) {
      router.push('/auth/signin');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const portfolioResponse = await fetch('/api/user/portfolio');
        const portfolioJson = await portfolioResponse.json();
        setPortfolioData(portfolioJson);

        let valueSum = 0;
        let returnSum = 0;
        portfolioJson.forEach((portfolio: Portfolio) => {
          valueSum += portfolio.totalValue;
          returnSum += portfolio.totalReturn;
        });
        setTotalValue(valueSum);
        setTotalReturn(returnSum);

        await fetchExchangeRate();
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status, session, router]);

  const fetchExchangeRate = async () => {
    try {
      const exchangeRateResponse = await fetch('/api/exchange-rate');
      const exchangeRateJson = await exchangeRateResponse.json();
      setExchangeRate(exchangeRateJson.rate);
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" component="h1">
          내 자산
        </Typography>
        <Box>
          <IconButton onClick={fetchExchangeRate}>
            <SyncIcon />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h3" color="primary">
                    ₩{totalValue.toLocaleString()}
                  </Typography>
                  <Typography variant="subtitle1" color={totalReturn >= 0 ? 'error' : 'primary'}>
                    일간 수익 +₩{totalReturn.toLocaleString()} (+
                    {((totalReturn / (totalValue - totalReturn)) * 100).toFixed(2)}%)
                  </Typography>
                  <Typography variant="subtitle1" color={totalReturn >= 0 ? 'error' : 'primary'}>
                    총 수익 +₩{totalReturn.toLocaleString()} (+
                    {((totalReturn / (totalValue - totalReturn)) * 100).toFixed(2)}%)
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Typography variant="h5" component="h2" gutterBottom>
        포트폴리오
      </Typography>

      <Grid container spacing={3}>
        {portfolioData.map((portfolio) => (
          <Grid item xs={12} key={portfolio.id}>
            <PortfolioCard portfolio={portfolio} />
          </Grid>
        ))}
      </Grid>

      <BottomNav value={navValue} setValue={setNavValue} />
    </Container>
  );
}
