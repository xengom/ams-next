import { Drawer, Input, Button, Space } from 'antd';

interface CreatePortfolioDrawerProps {
  open: boolean;
  onClose: () => void;
  portfolioName: string;
  onPortfolioNameChange: (value: string) => void;
  onSubmit: () => void;
  isCreating: boolean;
}

export function CreatePortfolioDrawer({
  open,
  onClose,
  portfolioName,
  onPortfolioNameChange,
  onSubmit,
  isCreating,
}: CreatePortfolioDrawerProps) {
  return (
    <Drawer
      title="Create Portfolio"
      placement="bottom"
      onClose={onClose}
      open={open}
      height={180}
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={onSubmit} loading={isCreating}>
            Create
          </Button>
        </Space>
      }
    >
      <div style={{ padding: '8px 0' }}>
        <Input
          placeholder="Enter portfolio name"
          value={portfolioName}
          onChange={(e) => onPortfolioNameChange(e.target.value)}
        />
      </div>
    </Drawer>
  );
}
