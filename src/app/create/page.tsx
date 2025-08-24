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
import aiAxiosInstance from '@/api/aiAxiosInstance'; // AI 서버용

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

  const handleCreate = async () => {
    // 1. 파일이 선택되었는지 확인하는 로직은 그대로 둡니다.
    if (!selectedFile) {
      alert('이미지를 먼저 선택해주세요!');
      return;
    }

    // 2. API 요청을 보내기 '직전'에, 우리가 보낼 값들을 확인하기 위한 console.log를 추가합니다.
    const storeId = 19; // 임시 ID
    const fileName = selectedFile.name;
    console.log("--- API 요청 직전 데이터 확인 ---");
    console.log("보낼 storeId:", storeId, "| 타입:", typeof storeId);
    console.log("보낼 fileName:", fileName, "| 타입:", typeof fileName);
    console.log("---------------------------------");

    // 3. 에러 핸들링을 위해 try...catch 문으로 감싸줍니다.
    try {
      // 4. 이 부분이 바로 유진님이 원래 가지고 계셨던 핵심 코드입니다.
      const presignedUrlResponse = await axiosInstance.get('/putimg', {
        params: {
          storeId: storeId,
          name: fileName,
        },
      });

      // 만약 요청이 성공했다면, 어떤 응답이 오는지도 확인해봅시다.
      console.log("API 요청 성공! 받은 데이터:", presignedUrlResponse.data);

    } catch (error) {
      // 요청이 실패하면 이곳에서 에러를 잡아냅니다.
      console.error("API 요청 실패:", error);
      alert("API 요청 중 오류가 발생했습니다. 콘솔을 확인해주세요.");
    }
  };
  
  /*
  // 결과물 실행
  const handleCreate = async () => {
    if (!selectedFile) {
      alert('이미지를 먼저 선택해주세요!');
      return;
    }

    setIsLoading(true);

    try {
      const presignedUrlResponse = await axiosInstance.get('/putimg', {
        params: {
          storeId: 19, // *storeId를 사용으로 변경
          name: selectedFile.name,
        },
      });
      const presignedUrl = presignedUrlResponse.data.url;

      // 클라우드 저장소에 이미지 업로드
      await axios.put(presignedUrl, selectedFile, {
        headers: { 'Content-Type': selectedFile.type },
      });
      
      const identifier = selectedFile.name;

      // AI 서버에 이미지 가공 요청
      const outpaintParams = new URLSearchParams();
      outpaintParams.append('identifier', identifier);
      outpaintParams.append('user_prompt', info);

      await aiAxiosInstance.post('/v1/outpaint', outpaintParams);

      // AI 서버에 텍스트 생성 요청
      const promoParams = new URLSearchParams();
      promoParams.append('identifier', identifier);
      promoParams.append('store_name', 'Daily Alley 카페'); // *실제 가게 이름 받아오기
      promoParams.append('mood', mood);

      const promoResponse = await aiAxiosInstance.post('/v1/generate-promo', promoParams);
      const aiResult = promoResponse.data; 

      // 최종 결과를 Jotai에 저장
      setCreationResult({
        // *최종 이미지 URL 확인
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
  */

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