import { Layout } from 'antd';
import { Navigation } from './Navigation';
import styled from '@emotion/styled';

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  padding-bottom: calc(56px + env(safe-area-inset-bottom));
`;

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <StyledLayout>
      {children}
      <Navigation />
    </StyledLayout>
  );
}
