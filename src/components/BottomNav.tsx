import React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useRouter } from 'next/router';

export default function BottomNav({
  value,
  setValue,
}: {
  value: number;
  setValue: (value: number) => void;
}) {
  const router = useRouter();

  const handleNavigation = (newValue: number) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        router.push('/home');
        break;
      case 1:
        router.push('/tracking');
        break;
      case 2:
        router.push('/dashboard');
        break;
      case 3:
        router.push('/chat');
        break;
      case 4:
        router.push('/more');
        break;
    }
  };

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        handleNavigation(newValue);
      }}
      showLabels
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
    >
      <BottomNavigationAction label="Home" icon={<HomeIcon />} />
      <BottomNavigationAction label="Tracking" icon={<TrendingUpIcon />} />
      <BottomNavigationAction label="My Assets" icon={<AccountBalanceWalletIcon />} />
      <BottomNavigationAction label="Chat" icon={<ChatIcon />} />
      <BottomNavigationAction label="More" icon={<MoreVertIcon />} />
    </BottomNavigation>
  );
}
