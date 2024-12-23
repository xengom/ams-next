import { GetServerSideProps } from 'next'
import { getSession, signOut } from 'next-auth/react'
import type { Session } from 'next-auth'
import { Container, AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'

interface Props {
  session: Session
}

export default function Dashboard({ session }: Props) {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            자산관리 시스템
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">{session.user?.email}</Typography>
            <IconButton color="inherit" onClick={() => signOut()}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          대시보드
        </Typography>
      </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    }
  }

  return {
    props: { session }
  }
} 