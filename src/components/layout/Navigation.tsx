import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  PieChartOutlined,
  DollarOutlined,
  LineChartOutlined,
  ScheduleOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/router';

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

export function Navigation() {
  const router = useRouter();

  const menuItems: MenuItem[] = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => router.push('/dashboard'),
    },
    {
      key: 'portfolios',
      icon: <PieChartOutlined />,
      label: 'Portfolios',
      onClick: () => router.push('/portfolios'),
    },
    {
      key: 'dividend',
      icon: <DollarOutlined />,
      label: 'Dividend',
      onClick: () => router.push('/dividend'),
    },
    {
      key: 'income',
      icon: <LineChartOutlined />,
      label: 'Income',
      onClick: () => router.push('/income'),
    },
    {
      key: 'plan',
      icon: <ScheduleOutlined />,
      label: 'Plan',
      onClick: () => router.push('/plan'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => router.push('/settings'),
    },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#242830',
        paddingBottom: 'env(safe-area-inset-bottom)',
        zIndex: 1000,
      }}
    >
      <Menu
        mode="horizontal"
        defaultSelectedKeys={['portfolios']}
        items={menuItems}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          display: 'flex',
          justifyContent: 'space-around',
        }}
      />
    </div>
  );
}
