'use client'; 

import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// 임시 데이터 (jotai와 axios로 실제 데이터 받아오기)
const userData = {
  name: '홍길동',
  storeName: 'Daily Alley 카페',
  address: '화성시 동탄대로 123',
  profileImageUrl: 'https://i.pravatar.cc/150',
};

function UserProfileHeader() {
  return (
    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      {/* 프로필 이미지 */}
      <Avatar
        alt={userData.name}
        src={userData.profileImageUrl}
        sx={{ width: 80, height: 80, mb: 2 }} 
      />
      {/* 유저 이름  */}
      <Typography variant="h6" component="div">
        {userData.name} 님
      </Typography>
      {/* 가게 이름 */}
      <Typography variant="subtitle1" color="text.secondary">
        {userData.storeName}
      </Typography>
      {/* 가게 주소 */}
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <LocationOnIcon sx={{ fontSize: '1rem', mr: 0.5 }} color="action" />
        <Typography variant="caption" color="text.secondary">
          {userData.address}
        </Typography>
      </Box>
    </Box>
  );
}

export default UserProfileHeader;