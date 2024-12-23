import { GetServerSideProps } from 'next'
import { getSession, signIn } from 'next-auth/react'
import Head from 'next/head'
import { Container, Box, Typography, IconButton, Stack, Paper } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'
import GoogleIcon from '@mui/icons-material/Google'
import AppleIcon from '@mui/icons-material/Apple'

export default function SignIn() {
  return (
    <>
      <Head>
        <title>Login - Asset Management System</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <Container maxWidth="sm" sx={{ height: '100vh' }}>
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 3,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Typography variant="h5" component="h1" fontWeight="bold">
              AMS
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Login with social account
            </Typography>
            
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <IconButton
                onClick={() => signIn('github', { callbackUrl: '/' })}
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: '#24292F',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#24292F',
                    opacity: 0.9,
                  },
                }}
              >
                <GitHubIcon />
              </IconButton>

              <IconButton
                onClick={() => signIn('google', { callbackUrl: '/' })}
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: 'white',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    bgcolor: 'grey.50',
                  },
                }}
              >
                <GoogleIcon sx={{ color: '#4285F4' }} />
              </IconButton>

              <IconButton
                onClick={() => signIn('apple', { callbackUrl: '/' })}
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: 'black',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'black',
                    opacity: 0.9,
                  },
                }}
              >
                <AppleIcon />
              </IconButton>
            </Stack>
          </Paper>
        </Box>
      </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
} 