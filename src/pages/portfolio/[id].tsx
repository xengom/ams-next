import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Drawer,
  Button,
  Modal,
  TextField,
  ButtonGroup,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SyncIcon from '@mui/icons-material/Sync';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

interface Asset {
  id: number;
  name: string;
  value: number;
  category: string;
}

interface Portfolio {
  id: number;
  name: string;
  totalValue: number;
  totalReturn: number;
  assets: Asset[];
  currency: string;
}

export default function PortfolioDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [currency, setCurrency] = useState<string>('USD');

  useEffect(() => {
    if (!id) return;

    const fetchPortfolio = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/user/portfolio/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Portfolio = await response.json();
        setPortfolio(data);
        setCurrency(data.currency);
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [id]);

  const handleRefresh = () => {
    console.log('Refresh data');
  };

  const handleAddAsset = () => {
    console.log('Add asset');
  };

  const handleEditName = () => {
    setDrawerOpen(false);
    setEditModalOpen(true);
  };

  const handleDeletePortfolio = () => {
    setDrawerOpen(false);
    setDeleteModalOpen(true);
  };

  const confirmEditName = async () => {
    console.log('Edit portfolio name to:', newName);
    setEditModalOpen(false);
  };

  const confirmDeletePortfolio = async () => {
    console.log('Delete portfolio:', portfolio?.name);
    setDeleteModalOpen(false);
    router.push('/dashboard');
  };

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    console.log('Currency set to:', newCurrency);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!portfolio) {
    return <div>포트폴리오를 찾을 수 없습니다.</div>;
  }

  const assetData = {
    labels: portfolio.assets.map((asset) => asset.name),
    datasets: [
      {
        data: portfolio.assets.map((asset) => asset.value),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <IconButton onClick={() => router.push('/dashboard')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">{portfolio.name}</Typography>
        <Box>
          <IconButton onClick={handleRefresh}>
            <SyncIcon />
          </IconButton>
          <IconButton onClick={handleAddAsset}>
            <AddIcon />
          </IconButton>
          <IconButton onClick={() => setDrawerOpen(true)}>
            <MoreVertIcon />
          </IconButton>
        </Box>
      </Box>
      <Typography variant="h6">
        Total Asset: ${portfolio.totalValue?.toLocaleString() || '0'}
      </Typography>
      <Typography variant="h6" color={portfolio.totalReturn >= 0 ? 'error' : 'primary'}>
        Profit/Loss: +${portfolio.totalReturn?.toLocaleString() || '0'} (
        {(
          (portfolio.totalReturn / (portfolio.totalValue - portfolio.totalReturn || 1)) *
          100
        ).toFixed(2)}
        %)
      </Typography>

      <Box mt={4}>
        <Doughnut data={assetData} />
      </Box>

      <Box mt={4}>
        <Typography variant="h5">Assets</Typography>
        <Grid container spacing={2}>
          {portfolio.assets.map((asset) => (
            <Grid item xs={12} sm={6} md={4} key={asset.id}>
              <Box border={1} borderRadius={2} p={2}>
                <Typography variant="h6">{asset.name}</Typography>
                <Typography>Value: ${asset.value.toLocaleString()}</Typography>
                <Typography>Category: {asset.category}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Drawer anchor="bottom" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box p={2} width="100%" textAlign="center">
          <ButtonGroup>
            <Button
              variant={currency === 'USD' ? 'contained' : 'outlined'}
              onClick={() => handleCurrencyChange('USD')}
            >
              USD
            </Button>
            <Button
              variant={currency === 'KRW' ? 'contained' : 'outlined'}
              onClick={() => handleCurrencyChange('KRW')}
            >
              KRW
            </Button>
          </ButtonGroup>
          <Button onClick={handleEditName}>Edit Portfolio Name</Button>
          <Button onClick={handleDeletePortfolio}>Delete Portfolio</Button>
        </Box>
      </Drawer>

      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <Box p={4} bgcolor="background.paper" borderRadius={2} mx="auto" my="20%">
          <Typography variant="h6">Edit Portfolio Name</Typography>
          <TextField
            fullWidth
            margin="normal"
            label="New Portfolio Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Button onClick={confirmEditName}>Confirm</Button>
        </Box>
      </Modal>

      <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <Box p={4} bgcolor="background.paper" borderRadius={2} mx="auto" my="20%">
          <Typography variant="h6">Are you sure to delete {portfolio.name}?</Typography>
          <Button onClick={confirmDeletePortfolio}>Confirm</Button>
        </Box>
      </Modal>
    </Container>
  );
}
