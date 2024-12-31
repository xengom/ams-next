import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Layout, Spin, Row, Col, message, Card, Button, Typography } from 'antd';
import { ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { prisma } from '@/lib/prisma';
import { CreatePortfolioDrawer } from '@/components/portfolios/CreatePortfolioDrawer';

const { Content } = Layout;
const { Title, Text } = Typography;

export default function Portfolios() {
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

  const handlePortfolioClick = (id: number, name: string) => {
    router.push(`/portfolio/${id}?name=${name}`);
  };

  if (!isMounted || status === 'loading' || isLoading) {
    return (
      <Layout>
        <Spin size="large" />
      </Layout>
    );
  }

  return (
    <Layout>
      <Content
        style={{
          padding: '16px 16px 0',
          minHeight: '100vh',
          backgroundColor: '#1a1d21',
          color: '#ffffff',
          maxWidth: '480px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <Title level={2} style={{ margin: 0, fontSize: 24, color: '#ffffff' }}>
            Portfolios
          </Title>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh} />
            <Button icon={<PlusOutlined />} onClick={() => setDrawerOpen(true)} />
          </div>
        </div>

        <Card
          style={{
            backgroundColor: '#242830',
            border: 'none',
            borderRadius: 16,
            marginBottom: 8,
          }}
          bodyStyle={{ padding: 12 }}
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: '#ffffff',
              display: 'block',
              marginBottom: 8,
            }}
          >
            ₩87,090,100
          </Text>
          <Text style={{ fontSize: 16, color: '#4caf50', display: 'block', marginBottom: 12 }}>
            +₩1,577,263 (+1.84%)
          </Text>
        </Card>

        <Row gutter={[16, 16]}>
          {portfolios.map((portfolio) => (
            <Col key={portfolio.id} span={24}>
              <Card
                title={portfolio.name}
                onClick={() => handlePortfolioClick(portfolio.id, portfolio.name)}
                hoverable
                style={{
                  backgroundColor: '#242830',
                  border: 'none',
                  borderRadius: 16,
                  marginBottom: 8,
                  cursor: 'pointer',
                }}
                styles={{
                  header: {
                    backgroundColor: '#242830',
                    borderBottom: 'none',
                    padding: 12,
                    color: '#ffffff',
                    fontSize: 14,
                  },
                  body: {
                    padding: 12,
                    color: '#ffffff',
                  },
                }}
              >
                ₩0 (0%)
              </Card>
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
      </Content>
    </Layout>
  );
}
