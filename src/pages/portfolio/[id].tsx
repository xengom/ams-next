import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import {
  Layout,
  Spin,
  Typography,
  Row,
  Col,
  Card,
  Button,
  Drawer,
  Modal,
  Input,
  message,
} from 'antd';
import { ReloadOutlined, PlusOutlined, MoreOutlined } from '@ant-design/icons';
import { AssetCard } from '@/components/portfolios/AssetCard';
import { useState, useEffect, useCallback } from 'react';
import type { PortfolioDetail, Asset } from '@/types/portfolio';

const { Content } = Layout;
const { Title, Text } = Typography;

export default function PortfolioDetail() {
  const router = useRouter();
  const { id, name } = router.query;
  const [portfolio, setPortfolio] = useState<PortfolioDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editNameModalOpen, setEditNameModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [newPortfolioName, setNewPortfolioName] = useState('');

  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin');
    },
  });

  const fetchPortfolioDetail = useCallback(async () => {
    try {
      const response = await fetch(`/api/portfolio/${id}/detail`);
      if (!response.ok) throw new Error('Failed to fetch portfolio detail');
      const data = await response.json();
      setPortfolio(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchPortfolioDetail();
    }
  }, [id, fetchPortfolioDetail]);

  const handleRefresh = () => {
    setLoading(true);
    fetchPortfolioDetail();
  };

  const handleEditName = async () => {
    try {
      const response = await fetch(`/api/portfolio/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newPortfolioName }),
      });

      if (!response.ok) throw new Error('Failed to update portfolio name');

      message.success('Portfolio name updated successfully');
      setEditNameModalOpen(false);
      fetchPortfolioDetail();
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to update portfolio name');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/portfolio/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete portfolio');

      message.success('Portfolio deleted successfully');
      router.push('/portfolios');
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to delete portfolio');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <Layout>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#1a1d21',
          }}
        >
          <Spin size="large" />
        </div>
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
            marginBottom: 16,
          }}
        >
          <Title level={2} style={{ margin: 0, color: '#ffffff' }}>
            {name}
          </Title>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh} />
            <Button icon={<PlusOutlined />} onClick={() => {}} />
            <Button icon={<MoreOutlined />} onClick={() => setDrawerOpen(true)} />
          </div>
        </div>
        <Card
          style={{
            backgroundColor: '#242830',
            border: 'none',
            borderRadius: 16,
            marginBottom: 8,
          }}
          styles={{
            header: {
              backgroundColor: '#242830',
              borderBottom: 'none',
              padding: 12,
              color: '#ffffff',
              fontSize: 14,
            },
          }}
          bodyStyle={{ padding: 12, color: '#ffffff' }}
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
            ₩{portfolio?.totalValue.toLocaleString()}
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: portfolio?.profit! > 0 ? '#4caf50' : '#f44336',
              display: 'block',
              marginBottom: 12,
            }}
          >
            {portfolio?.profit! > 0 ? '+' : ''}₩{portfolio?.profit.toLocaleString()}(
            {/* {portfolio?.profitPercentage > 0 ? '+' : ''} */}
            {portfolio?.profitPercentage.toFixed(2)}%)
          </Text>
        </Card>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            {portfolio?.assets.map((asset) => <AssetCard key={asset.id} asset={asset} />)}
          </Col>
        </Row>
        <Drawer
          title="Portfolio Settings"
          placement="bottom"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          height={180}
        >
          <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Button
              block
              onClick={() => {
                setDrawerOpen(false);
                setNewPortfolioName(portfolio?.name || '');
                setEditNameModalOpen(true);
              }}
            >
              Edit Portfolio Name
            </Button>
            <Button
              block
              danger
              onClick={() => {
                setDrawerOpen(false);
                setDeleteModalOpen(true);
              }}
            >
              Delete Portfolio
            </Button>
          </div>
        </Drawer>
        <Modal
          title="Edit Portfolio Name"
          open={editNameModalOpen}
          onCancel={() => setEditNameModalOpen(false)}
          onOk={handleEditName}
          okText="Confirm"
        >
          <Input
            value={newPortfolioName}
            onChange={(e) => setNewPortfolioName(e.target.value)}
            placeholder="Enter new portfolio name"
          />
        </Modal>
        <Modal
          title="Delete Portfolio"
          open={deleteModalOpen}
          onCancel={() => setDeleteModalOpen(false)}
          onOk={handleDelete}
          okText="Confirm"
          okButtonProps={{ danger: true }}
        >
          <p>Are you sure to delete {portfolio?.name}?</p>
        </Modal>
      </Content>
    </Layout>
  );
}
