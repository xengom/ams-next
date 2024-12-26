import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useExchangeRate } from '../../hooks/useExchangeRate';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Box,
  IconButton,
  Drawer,
  TextField,
  Button,
  ButtonGroup,
} from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import AddIcon from '@mui/icons-material/Add';
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
  const { exchangeRate, fetchExchangeRate } = useExchangeRate();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [portfolioData, setPortfolioData] = useState<Portfolio[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [totalReturn, setTotalReturn] = useState(0);
  const [navValue, setNavValue] = useState(2);
  const [activePortfolios, setActivePortfolios] = useState<Set<number>>(new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [newPortfolioName, setNewPortfolioName] = useState('');
  const [currency, setCurrency] = useState('KRW');

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

        const initialActive = new Set(portfolioJson.map((p: Portfolio) => p.id));
        setActivePortfolios(initialActive as Set<number>);

        calculateTotals(initialActive as Set<number>, portfolioJson);
        fetchExchangeRate();
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status, session, router, fetchExchangeRate]);

  const calculateTotals = (active: Set<number>, portfolios: Portfolio[]) => {
    let valueSum = 0;
    let returnSum = 0;
    portfolios.forEach((portfolio) => {
      if (active.has(portfolio.id)) {
        valueSum += portfolio.totalValue;
        returnSum += portfolio.totalReturn;
      }
    });
    setTotalValue(valueSum);
    setTotalReturn(returnSum);
  };

  const handleToggle = (id: number, checked: boolean) => {
    const updatedActive: Set<number> = new Set(activePortfolios);
    if (checked) {
      updatedActive.add(id);
    } else {
      updatedActive.delete(id);
    }
    setActivePortfolios(updatedActive);
    calculateTotals(updatedActive, portfolioData);
  };

  const handleAddPortfolio = () => {
    setDrawerOpen(true);
  };

  const handleCreatePortfolio = async () => {
    try {
      const response = await fetch('/api/user/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newPortfolioName, currency }),
      });

      if (response.ok) {
        const newPortfolio = await response.json();
        router.push(`/portfolio/${newPortfolio.id}`);
      } else {
        console.error('Failed to create portfolio');
      }
    } catch (error) {
      console.error('Error creating portfolio:', error);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xs" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="xs" sx={{ mt: 4, px: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" component="h1">
            My Assets
          </Typography>
          <Box>
            <IconButton onClick={fetchExchangeRate}>
              <SyncIcon />
            </IconButton>
            <IconButton onClick={handleAddPortfolio}>
              <AddIcon />
            </IconButton>
          </Box>
        </Box>

        <Grid container spacing={2} mb={2}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h4" color="primary">
                      ₩{totalValue.toLocaleString()}
                    </Typography>
                    <Typography variant="subtitle2" color={totalReturn >= 0 ? 'error' : 'primary'}>
                      Daily Profit +₩{totalReturn.toLocaleString()} (+
                      {((totalReturn / (totalValue - totalReturn)) * 100).toFixed(2)}%)
                    </Typography>
                    <Typography variant="subtitle2" color={totalReturn >= 0 ? 'error' : 'primary'}>
                      Total Profit +₩{totalReturn.toLocaleString()} (+
                      {((totalReturn / (totalValue - totalReturn)) * 100).toFixed(2)}%)
                    </Typography>
                    <Typography variant="subtitle2">
                      Exchange Rate: {exchangeRate ? `${exchangeRate} KRW` : 'Loading...'}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Typography variant="h6" component="h2" gutterBottom>
          Portfolios
        </Typography>

        <Grid container spacing={2}>
          {portfolioData.map((portfolio) => (
            <Grid item xs={12} key={portfolio.id}>
              <PortfolioCard portfolio={portfolio} onToggle={handleToggle} />
            </Grid>
          ))}
        </Grid>

        <BottomNav value={navValue} setValue={setNavValue} />
      </Container>

      <Drawer anchor="bottom" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box p={2} width="100%" textAlign="center">
          <Typography variant="h6">Add New Portfolio</Typography>
          <TextField
            label="Portfolio Name"
            value={newPortfolioName}
            onChange={(e) => setNewPortfolioName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <ButtonGroup fullWidth>
            <Button
              variant={currency === 'KRW' ? 'contained' : 'outlined'}
              onClick={() => setCurrency('KRW')}
            >
              KRW
            </Button>
            <Button
              variant={currency === 'USD' ? 'contained' : 'outlined'}
              onClick={() => setCurrency('USD')}
            >
              USD
            </Button>
          </ButtonGroup>
          <Button variant="contained" onClick={handleCreatePortfolio} sx={{ mt: 2 }}>
            Confirm
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
