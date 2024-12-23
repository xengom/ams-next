import { GetServerSideProps } from 'next'
import { getSession, signOut } from 'next-auth/react'
import type { Session } from 'next-auth'

interface Props {
  session: Session
}

export default function Home({ session }: Props) {
  return (
    <div className="min-h-screen p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">자산 관리 시스템</h1>
        <div className="flex items-center gap-4">
          <span>{session.user?.email}</span>
          <button
            onClick={() => signOut()}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
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