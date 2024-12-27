import { Drawer, Input, Select, Button } from 'antd';
import { DrawerContent, FormItem } from '@/styles/dashboard';

interface CreatePortfolioDrawerProps {
  open: boolean;
  onClose: () => void;
  portfolioName: string;
  onPortfolioNameChange: (value: string) => void;
  onSubmit: () => void;
  isCreating?: boolean;
}

export function CreatePortfolioDrawer({
  open,
  onClose,
  portfolioName,
  onPortfolioNameChange,
  onSubmit,
  isCreating = false,
}: CreatePortfolioDrawerProps) {
  return (
    <Drawer title="Create Portfolio" placement="bottom" onClose={onClose} open={open} height={200}>
      <DrawerContent>
        <FormItem>
          <Input
            value={portfolioName}
            onChange={(e) => onPortfolioNameChange(e.target.value)}
            placeholder="Enter portfolio name"
            disabled={isCreating}
          />
        </FormItem>
        <Button type="primary" onClick={onSubmit} block loading={isCreating}>
          Create
        </Button>
      </DrawerContent>
    </Drawer>
  );
}
