import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { ConfigProvider } from 'antd';
import { darkTheme } from '@/styles/theme';
import '@/styles/globals.css';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ConfigProvider theme={darkTheme}>
        <Component {...pageProps} />
      </ConfigProvider>
    </SessionProvider>
  );
}
