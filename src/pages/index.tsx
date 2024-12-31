import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'authenticated' && session) {
    router.push('/portfolios');
    return null;
  } else {
    router.push('/auth/signin');
    return null;
  }
}
