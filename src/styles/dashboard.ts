import styled from '@emotion/styled';
import { Layout, Typography, Card } from 'antd';

const { Content } = Layout;
const { Title } = Typography;

export const StyledContent = styled(Content)`
  padding: 16px;
  min-height: 100vh;
  background-color: #1a1d21;
  color: #ffffff;
`;

export const StyledTitle = styled(Title)`
  font-size: 28px !important;
  color: #ffffff !important;
  margin-bottom: 8px !important;
`;

export const StyledCard = styled(Card)`
  background-color: #242830;
  border: none;
  border-radius: 16px;
  margin-bottom: 12px;

  .ant-card-head {
    background-color: #242830;
    border-bottom: none;
    padding: 16px;

    .ant-card-head-title {
      color: #ffffff;
      font-size: 16px;
    }
  }

  .ant-card-body {
    padding: 16px;
    color: #ffffff;
  }
`;

export const TotalAmount = styled.div`
  font-size: 32px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 8px;
`;

export const ProfitAmount = styled.div<{ isPositive: boolean }>`
  font-size: 18px;
  color: ${(props) => (props.isPositive ? '#4caf50' : '#f44336')};
  margin-bottom: 16px;
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #1a1d21;
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 8px;
`;

export const IconButton = styled.button`
  background: none;
  border: none;
  color: #ffffff;
  font-size: 24px;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const DrawerContent = styled.div`
  padding: 1px;
`;

export const FormItem = styled.div`
  margin-bottom: 16px;
`;
