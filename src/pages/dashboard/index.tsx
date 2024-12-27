import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Layout, Spin, Row, Col, message } from 'antd';
import { ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { CreatePortfolioDrawer } from '@/components/dashboard/CreatePortfolioDrawer';
import {
  StyledContent,
  StyledTitle,
  StyledCard,
  LoadingContainer,
  TotalAmount,
  ProfitAmount,
  HeaderContainer,
  ButtonContainer,
  IconButton,
} from '@/styles/dashboard';

interface Portfolio {
  id: number;
  name: string;
  // TODO: 포트폴리오 총액과 수익률 추가
}

export default function Dashboard() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [portfolioName, setPortfolioName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin');
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchPortfolios = async () => {
    try {
      const response = await fetch('/api/portfolio/list');
      if (!response.ok) throw new Error('Failed to fetch portfolios');
      const data = await response.json();
      setPortfolios(data);
    } catch (error) {
      console.error('Error fetching portfolios:', error);
      message.error('Failed to load portfolios');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchPortfolios();
    }
  }, [session]);

  const handleRefresh = () => {
    setIsLoading(true);
    fetchPortfolios();
  };

  const handleCreatePortfolio = async () => {
    if (!portfolioName.trim()) {
      message.warning('Please enter a portfolio name');
      return;
    }
    try {
      setIsCreating(true);
      const response = await fetch('/api/portfolio/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: portfolioName }),
      });

      if (!response.ok) {
        throw new Error('Failed to create portfolio');
      }

      message.success('Portfolio created successfully');
      setDrawerOpen(false);
      setPortfolioName('');
      fetchPortfolios();
    } catch (error) {
      console.error('Error creating portfolio:', error);
      message.error('Failed to create portfolio');
    } finally {
      setIsCreating(false);
    }
  };

  if (!isMounted || status === 'loading' || isLoading) {
    return (
      <Layout>
        <LoadingContainer>
          <Spin size="large" />
        </LoadingContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <StyledContent>
        <HeaderContainer>
          <StyledTitle level={2}>Portfolios</StyledTitle>
          <ButtonContainer>
            <IconButton onClick={handleRefresh}>
              <ReloadOutlined />
            </IconButton>
            <IconButton onClick={() => setDrawerOpen(true)}>
              <PlusOutlined />
            </IconButton>
          </ButtonContainer>
        </HeaderContainer>
        <StyledCard>
          <TotalAmount>₩87,090,100</TotalAmount>
          <ProfitAmount isPositive={true}>+₩1,577,263 (+1.84%)</ProfitAmount>
        </StyledCard>
        <Row gutter={[16, 16]}>
          {portfolios.map((portfolio) => (
            <Col key={portfolio.id} span={24}>
              <StyledCard title={portfolio.name}>
                {/* TODO: 포트폴리오 상세 정보 표시 */}
                ₩0 (0%)
              </StyledCard>
            </Col>
          ))}
        </Row>

        <CreatePortfolioDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          portfolioName={portfolioName}
          onPortfolioNameChange={setPortfolioName}
          onSubmit={handleCreatePortfolio}
          isCreating={isCreating}
        />
      </StyledContent>
    </Layout>
  );
}
