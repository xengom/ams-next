import type { AppProps } from 'next/app';
import { SessionProvider, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ConfigProvider, Spin } from 'antd';
import { darkTheme } from '@/styles/theme';

function Auth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin');
    },
  });

  if (status === 'loading') {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return <>{children}</>;
}

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();
  const isAuthPage = router.pathname.startsWith('/auth/');

  return (
    <SessionProvider session={session}>
      <ConfigProvider theme={darkTheme}>
        {isAuthPage ? (
          <Component {...pageProps} />
        ) : (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        )}
      </ConfigProvider>
    </SessionProvider>
  );
}
