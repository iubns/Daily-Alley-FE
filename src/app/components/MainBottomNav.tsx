'use client';

import React, { useEffect, useState } from 'react';
import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useRouter, usePathname } from 'next/navigation';

enum NavMenu {
  Schedule, // 0
  Create,   // 1
  Home,     // 2
  Info,     // 3
  User      // 4
}

const valueToPath: { [key in NavMenu]: string } = {
  [NavMenu.Schedule]: '/schedule',
  [NavMenu.Create]:   '/create',
  [NavMenu.Home]:     '/',
  [NavMenu.Info]:     '/info',
  [NavMenu.User]:     '/user'
};

function MainBottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  // 초기값을 NavMenu.Home으로 설정
  const [value, setValue] = useState<NavMenu>(NavMenu.Home);

  useEffect(() => {
    const matchingKey = Object.keys(valueToPath).find(key => 
      valueToPath[Number(key) as NavMenu] === pathname
    );
    if (matchingKey) {
      setValue(Number(matchingKey) as NavMenu);
    }
  }, [pathname]);


  return (
    <Paper 
    // 그림자, 배경 표현
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }} 
      elevation={3}
    >
      {/* 하단 네비게이션 바 본체 */}
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue: NavMenu) => {
          const path = valueToPath[newValue];
          if (path) {
            router.push(path);
          }
        }}
      >
        <BottomNavigationAction label="일정 정리" icon={<EditCalendarIcon />} />
        <BottomNavigationAction label="콘텐츠 제작" icon={<AddPhotoAlternateIcon />} />
        <BottomNavigationAction label="메인화면" icon={<HomeIcon />} />
        <BottomNavigationAction label="가게 정보" icon={<StorefrontIcon />} />
        <BottomNavigationAction label="사용자" icon={<PersonOutlineIcon />} />
      </BottomNavigation>
    </Paper>
  );
}

export default MainBottomNav;