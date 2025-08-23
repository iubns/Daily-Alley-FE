'use client';

import React, { useEffect, useState } from 'react';
import { 
  Box, Container, Typography, Button, Divider, Paper, 
  Stack, Chip, IconButton, Modal, TextField} from '@mui/material';
import UserProfileHeader from '../components/UserProfileHeader';
import { useAtom } from 'jotai';
import { creationResultAtom } from './atom/creationAtom';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 

// 모달(팝업)의 스타일을 정의
const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 2
};

function CreateResultPage() {
  const router = useRouter();
  const [creationResult, setCreationResult] = useAtom(creationResultAtom);
  
  // 모달 관리
  const [openModal, setOpenModal] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState('');

  useEffect(() => {
    if (!creationResult) {
      router.replace('/create');
    }
  }, [creationResult, router]);

  // 해시태그 삭제 기능 함수
  const handleHashtagDelete = (tagToDelete: string) => {
    if (creationResult) {
      const updatedHashtags = creationResult.hashtags.filter((tag) => tag !== tagToDelete);
      setCreationResult({ ...creationResult, hashtags: updatedHashtags });
    }
  };

  // 모달을 열기
  const handleOpenModal = () => setOpenModal(true);
  // 모달을 닫기
  const handleCloseModal = () => setOpenModal(false);

  // 재생성 요청
  const handleRegenerate = () => {
    if (creationResult) {
      const regeneratedText = `${creationResult.text}\n\n[추가 요청 사항: ${additionalInfo}]`;
      setCreationResult({ ...creationResult, text: regeneratedText });
    }
    setAdditionalInfo(''); // 입력창 비우기
    handleCloseModal(); // 모달 닫기
  };

  if (!creationResult) {
    return <Typography>콘텐츠를 먼저 제작해주세요...</Typography>;
  }

  return (
    <Container maxWidth="sm" sx={{ p: 0, pb: 7 }}>
      <UserProfileHeader />
      <Divider />

      <Box sx={{ p: 2 }}>
        {/* 뒤로가기 버튼 */}
        <IconButton onClick={() => router.back()} sx={{ mb: 1 }}>
          <ArrowBackIcon />
        </IconButton>

        {/* AI 생성 블로그 콘텐츠 */}
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 2, mb: 2 }}>
          <img src={creationResult.imageUrl} alt="AI 생성 이미지" style={{ width: '100%', borderRadius: '4px', objectFit: 'cover' }}/>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mt: 2 }}>
            {creationResult.text}
          </Typography>
        </Paper>

        {/* AI 생성 해시태그 */}
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
          {creationResult.hashtags.map((tag) => (
            <Chip key={tag} label={tag} onDelete={() => handleHashtagDelete(tag)} />
          ))}
        </Stack>

        {/* 하단 버튼 영역 */}
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" color="inherit" fullWidth onClick={handleOpenModal}>
            재생성
          </Button>
          <Button variant="contained" color="primary" fullWidth>
            업로드
          </Button>
        </Stack>
      </Box>

      {/* 추가 정보 입력 모달 */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2">
            추가 정보 입력
          </Typography>
          <Typography sx={{ mt: 2, mb: 2 }}>
            AI에게 콘텐츠를 재생성하도록 추가 정보를 전달해주세요.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder="예: 좀 더 친근한 말투로 바꿔줘"
          />
          <Button onClick={handleRegenerate} sx={{ mt: 2 }} fullWidth variant="contained">
            재생성 요청
          </Button>
        </Box>
      </Modal>
    </Container>
  );
}

export default CreateResultPage;