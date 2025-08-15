/*
유진_08.13: 
1. 기본 테마 설정(theme.ts, ThemeRegistry.tsx)
2. 사용자 프로필, 오늘의 업로드 기록 컴포넌트 제작(UserProfileHeader.tsx, UploadHistory.tsx, UploadPostCard.tsx)
3. layout.tsx 변경[->해당 파일에 기재]
4. page.tsx 변경
    -상단 헤더 사용자 정보(UserProfileHeader) 제작
    -오늘의 스토리 업로드 기록(UploadHistory) 제작
    -오늘의 피드 업로드 기록(UploadPostCard) 제작
5. 하단 네비게이터바(MainBottomNav) 제작 및 layout.tsx에 내용 추가[->]

유진_08.14: 
1. '가게 정보' 페이지 제작
2. 하단 네비게이터바 연결

*네비게이터바 색상 유지안되는 부분 수정 필요
*글자 폰트나 크기 수정 필요(현재 폰트가 너무 큼)
*/

import { Box, Container, Divider } from '@mui/material';
import UserProfileHeader from './components/UserProfileHeader';
import UploadHistory from './components/UploadHistory';
import UploadPostCard from './components/UploadPostCard';
import MainBottomNav from './components/MainBottomNav';

export default function Home() {
  return (
    <Container maxWidth="sm" sx={{ p: 0, pb: 7 }}> 
      <Box>
        <UserProfileHeader />
        <Divider />
        <UploadHistory /> 
        <UploadPostCard />
      </Box>
    </Container>
  );
}