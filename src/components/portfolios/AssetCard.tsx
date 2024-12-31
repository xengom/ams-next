import { Card, Typography, Space, Flex } from 'antd';
import type { Asset } from '@/types/portfolio';

const { Text } = Typography;

interface AssetCardProps {
  asset: Asset;
}

export function AssetCard({ asset }: AssetCardProps) {
  const currentValue = asset.amount * asset.currentPrice;
  const purchaseValue = asset.amount * asset.avgPrice;
  const profitLoss = currentValue - purchaseValue;
  const profitLossPercentage = (profitLoss / purchaseValue) * 100;

  return (
    <Card
      style={{
        marginBottom: 8,
        backgroundColor: '#242830',
        border: 'none',
      }}
      bodyStyle={{ padding: 16 }}
    >
      <Flex align="center" justify="space-between" style={{ marginBottom: 16 }}>
        <Space size={12}>
          <Text strong style={{ fontSize: 18, color: '#ffffff' }}>
            {asset.symbol}
          </Text>
          <Text type="secondary">{asset.type}</Text>
        </Space>
        <Text style={{ color: '#ffffff' }}>Amount {asset.amount}</Text>
      </Flex>

      <Flex gap={12} wrap="wrap">
        <div style={{ flex: 1, minWidth: '45%' }}>
          <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
            Estimate
          </Text>
          <Text style={{ color: '#ffffff' }}>${currentValue.toLocaleString()}</Text>
        </div>
        <div style={{ flex: 1, minWidth: '45%' }}>
          <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
            Avg Price
          </Text>
          <Text style={{ color: '#ffffff' }}>${asset.avgPrice.toLocaleString()}</Text>
        </div>
        <div style={{ flex: 1, minWidth: '45%' }}>
          <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
            Profit/Loss
          </Text>
          <Text style={{ color: profitLoss >= 0 ? '#4caf50' : '#f44336' }}>
            ${Math.abs(profitLoss).toLocaleString()} ({profitLoss >= 0 ? '+' : '-'}
            {Math.abs(profitLossPercentage).toFixed(2)}%)
          </Text>
        </div>
        <div style={{ flex: 1, minWidth: '45%' }}>
          <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
            Price
          </Text>
          <Text style={{ color: '#ffffff' }}>${asset.currentPrice.toLocaleString()}</Text>
        </div>
      </Flex>
    </Card>
  );
}
