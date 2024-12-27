import { signIn } from 'next-auth/react';
import { Button, Card, Space, Typography, Divider } from 'antd';
import { GithubOutlined, GoogleOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';

const { Title } = Typography;

const SignInContainer = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
`;

const StyledCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  margin: 0 16px;
`;

const StyledButton = styled(Button)`
  width: 100%;
  height: 40px;
  font-size: 16px;
`;

export default function SignIn() {
  return (
    <SignInContainer>
      <StyledCard>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
          AMS
        </Title>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <StyledButton icon={<GithubOutlined />} onClick={() => signIn('github')} size="large">
            Sign in with Github
          </StyledButton>
          <StyledButton icon={<GoogleOutlined />} onClick={() => signIn('google')} size="large">
            Sign in with Google
          </StyledButton>
        </Space>
      </StyledCard>
    </SignInContainer>
  );
}
