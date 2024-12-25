import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Container, Box, Typography, Button, Stack } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';

export default function SignIn() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (session) {
    router.push('/dashboard');
    return null;
  }

  return (
    <Container maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 2,
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Sign in
        </Typography>
        <Stack spacing={2} width="100%">
          <Button
            onClick={() => signIn('github')}
            variant="contained"
            startIcon={<GitHubIcon />}
            fullWidth
            sx={{
              bgcolor: '#24292F',
              '&:hover': {
                bgcolor: '#24292F',
                opacity: 0.9,
              },
            }}
          >
            Sign in with GitHub
          </Button>
          <Button
            onClick={() => signIn('google')}
            variant="contained"
            startIcon={<GoogleIcon />}
            fullWidth
            sx={{
              bgcolor: '#4285F4',
              '&:hover': {
                bgcolor: '#4285F4',
                opacity: 0.9,
              },
            }}
          >
            Sign in with Google
          </Button>
          <Button
            onClick={() => signIn('apple')}
            variant="contained"
            startIcon={<AppleIcon />}
            fullWidth
            sx={{
              bgcolor: 'black',
              '&:hover': {
                bgcolor: 'black',
                opacity: 0.9,
              },
            }}
          >
            Sign in with Apple
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
