'use client';

import React, { useState, ChangeEvent } from 'react';
import { Box, Container, Typography, Paper, Select, MenuItem, 
    FormControl, Button, TextField, Stack, Chip, CircularProgress} from '@mui/material';
import UserProfileHeader from '../components/UserProfileHeader'; 
import  AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useSetAtom } from 'jotai';
import { creationResultAtom } from './atom/creationAtom';
import { useRouter } from 'next/navigation'; 
import axios from 'axios'; 
import axiosInstance from '@/config/axios'; // 백엔드 서버용
import aiAxiosInstance from '@/config/aiAxiosInstance'; // AI 서버용

function CreateContentPage() {
  const router = useRouter(); 
  const setCreationResult = useSetAtom(creationResultAtom); 
  const [contentType, setContentType] = useState('blog'); // 업로드 종류
  const [mood, setMood] = useState('calm'); // 오늘의 느낌
  const [info, setInfo] = useState(''); // 오늘의 정보
  const [directContent, setDirectContent] = useState(''); // 내용 직접 입력
  const [hashtags, setHashtags] = useState<string[]>(['#해시태그']); // chip 해시태그 배열 관리
  const [userTags, setUserTags] = useState<string[]>(['@someone_']); // chip 유저태그 배열 관리
  const [currentHashtag, setCurrentHashtag] = useState(''); // 해시태그 현재 입력값 저장
  const [currentUserTag, setCurrentUserTag] = useState(''); // 유저태그 현재 입력값 저장
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 해시태그 기능 구현
  // 'Enter' 키로 해시태그를 추가
  const handleHashtagKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && currentHashtag.trim() !== '') {
      event.preventDefault(); 
      setHashtags([...hashtags, `#${currentHashtag.trim()}`]); 
      setCurrentHashtag(''); 
    }
  };
  
  // x 버튼으로 해시태그를 삭제
  const handleHashtagDelete = (tagToDelete: string) => {
    setHashtags(hashtags.filter((tag) => tag !== tagToDelete));
  };

  // 유저태그 기능 구현
  const handleUserTagKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && currentUserTag.trim() !== '') {
      event.preventDefault();
      setUserTags([...userTags, `@${currentUserTag.trim()}`]);
      setCurrentUserTag('');
    }
  };

  const handleUserTagDelete = (tagToDelete: string) => {
    setUserTags(userTags.filter((tag) => tag !== tagToDelete));
  };

  // 사진 선택
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };
  
  // 결과물 실행
  const handleCreate = async () => {
    if (!selectedFile) {
      alert('이미지를 먼저 선택해주세요!');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();

      formData.append('input_image', selectedFile);
      formData.append('user_prompt', info);

      console.log("이미지 가공 요청");
      await aiAxiosInstance.post('/v1/outpaint', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("이미지 가공 요청 완료");

      const promoParams = new URLSearchParams();

      const originalFilename = selectedFile.name;
      const filenameWithoutExt = originalFilename.substring(0, originalFilename.lastIndexOf('.'));
      const identifier = `19_${filenameWithoutExt}`;

      promoParams.append('identifier', identifier);
      promoParams.append('store_name', 'Daily Alley 카페'); // *실제 가게 이름으로 변경 필요
      promoParams.append('mood', mood);

      const promoResponse = await aiAxiosInstance.post('/v1/generate-promo', promoParams);
      const aiResult = promoResponse.data;
      console.log("텍스트 생성 완료");

      setCreationResult({
        imageUrl: `https://your-image-server-base-url.com/${identifier}_food_AI.jpg`, 
        text: aiResult.body, 
        hashtags: aiResult.tags,
        mood: mood, 
      });

      router.push('/create/result');

    } catch (error) {
      console.error("콘텐츠 제작에 실패했습니다:", error);
      alert("콘텐츠 제작 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ p: 0, pb: 7 }}>
      {/* 기존 헤더 재사용 */}
      <UserProfileHeader />
      <Box sx={{ p: 2 }}>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
          <Stack spacing={3}>

            {/* 콘텐츠 종류 선택 드롭다운 */}
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
              <FormControl variant="filled" size="small" sx={{ minWidth: 150 }}>
                <Select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  sx={{ '.MuiSelect-select': { paddingTop: '10px', paddingBottom: '10px' } }}
                >
                  <MenuItem value="blog">블로그</MenuItem>
                  <MenuItem value="story">스토리</MenuItem>
                  <MenuItem value="feed">피드</MenuItem>
                </Select>
              </FormControl>
              {/* 제작 버튼 */}
              <Button 
                variant="contained" size="large" 
                onClick={handleCreate}
                disabled={isLoading}
                sx={{ backgroundColor: 'grey.200', color: 'black', '&:hover': { backgroundColor: 'grey.300' }}}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : '제작'}
              </Button>
            </Stack>

            {/* 오늘의 느낌 선택 드롭다운 */}
            <Box>
             <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>오늘의 느낌</Typography>
              <FormControl fullWidth>
                <Select value={mood} onChange={(e) => setMood(e.target.value)}>
                  <MenuItem value="calm">차분한 느낌</MenuItem>
                  <MenuItem value="energetic">활기찬 느낌</MenuItem>
                  <MenuItem value="cozy">아늑한 느낌</MenuItem>
                  <MenuItem value="professional">전문적인 느낌</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* 오늘의 정보 입력 */}
            <Box>
                <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>오늘의 정보</Typography>
              <TextField
                multiline
                rows={4}
                value={info}
                onChange={(e) => setInfo(e.target.value)}
                placeholder="AI에게 전달할 간단한 정보를 입력해주세요.&#10;예: 오늘부터 애플파이 판매 시작!"
                fullWidth
              />
            </Box>

            {/* '피드'가 선택되었을 때, '내용 직접 입력' 창 보이기*/}
            {contentType === 'feed' && (
              <Box>
                <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>내용 직접 입력</Typography>
                <TextField
                  multiline
                  rows={6} 
                  value={directContent}
                  onChange={(e) => setDirectContent(e.target.value)}
                  placeholder="피드에 들어갈 내용을 직접 입력해주세요."
                  fullWidth
                />
              </Box>
            )}

            {/* 사진 추가 */}
            <Box>
              <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>사진 추가</Typography>
              <Stack direction="row" spacing={2}>
                <Button 
                  variant="outlined" 
                  component="label"
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    color: 'text.secondary',
                    borderColor: 'grey.400'
                  }}
                >
                  <AddPhotoAlternateIcon />
                  사진 선택
                  <input type="file" accept="image/*" hidden onChange={handleFileChange} />
                </Button>
                {selectedFile && <Typography variant="body2" noWrap>{selectedFile.name}</Typography>}
              </Stack>
            </Box>

            {/* 해시태그 */}
            {contentType !== 'blog' && (
              <>
                <Box>
                  <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>해시태그 입력</Typography>
                  {/* 추가된 태그들을 Chip으로 보여주는 영역 */}
              <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap', gap: 1 }}>
                {hashtags.map((tag) => (
                  <Chip key={tag} label={tag} onDelete={() => handleHashtagDelete(tag)} />
                ))}
              </Stack>
              {/* 새로운 태그를 입력하는 TextField 영역 */}
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                value={currentHashtag}
                onChange={(e) => setCurrentHashtag(e.target.value)}
                onKeyDown={handleHashtagKeyDown}
                placeholder="태그 입력 후 엔터키로 업로드"
              />
            </Box>

            {/* 다른 사람 태그 */}
            <Box>
              <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>다른 사람 태그</Typography>
              {/* 추가된 태그들을 Chip으로 보여주는 영역 */}
              <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap', gap: 1 }}>
                {userTags.map((tag) => (
                  <Chip key={tag} label={tag} onDelete={() => handleUserTagDelete(tag)} />
                ))}
              </Stack>
              {/* 새로운 태그를 입력하는 TextField 영역 */}
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                value={currentUserTag}
                onChange={(e) => setCurrentUserTag(e.target.value)}
                onKeyDown={handleUserTagKeyDown}
                placeholder="유저 입력 후 엔터키로 업로드"
              />
            </Box>
            </>
            )}
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
}

export default CreateContentPage;