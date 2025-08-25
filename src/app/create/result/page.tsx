'use client';

import React, { useEffect, useState, useMemo } from 'react'; // [수정] useMemo 추가
import { 
  Box, Container, Typography, Button, Divider, Paper, 
  Stack, Chip, IconButton, Modal, TextField, CircularProgress
} from '@mui/material';
import UserProfileHeader from '../../components/UserProfileHeader';
import { useAtom } from 'jotai';
import { creationResultAtom } from '../atom/creationAtom';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 
import axiosInstance from '@/config/axios';


// 모달(팝업)의 스타일을 정의
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
} as const

function CreateResultPage() {
  const router = useRouter()
  const [creationResult, setCreationResult] = useAtom(creationResultAtom)

  // 모달 관리
  const [openModal, setOpenModal] = useState(false)
  const [additionalInfo, setAdditionalInfo] = useState("")

  // 업로드 상태 관리
  const [isUploading, setIsUploading] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!creationResult) {
      router.replace("/create")
    }
  }, [creationResult, router])

  // 해시태그 삭제 기능 함수
  const handleHashtagDelete = (tagToDelete: string) => {
    if (creationResult) {
      const updatedHashtags = creationResult.hashtags.filter(
        (tag) => tag !== tagToDelete
      )
      setCreationResult({ ...creationResult, hashtags: updatedHashtags })
    }
  }

  // 모달을 열기
  const handleOpenModal = () => setOpenModal(true);
  // 모달을 닫기
  const handleCloseModal = () => setOpenModal(false);

  // 재생성 요청
  const handleNextResult = () => {
    if (creationResult && currentIndex < creationResult.body.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleRegenerate = () => {
    if (creationResult) {
      const regeneratedBody = [
      ...creationResult.body,
      `\n\n[추가 요청 사항: ${additionalInfo}]`
    ];
    setCreationResult({ ...creationResult, body: regeneratedBody });
  }
    setAdditionalInfo('');
    handleCloseModal();
  };

  // 업로드 요청 시 최종 결과물 저장
  const handleUpload = async () => {
    if (!creationResult) {
      alert("업로드할 콘텐츠가 없습니다.")
      return
    }

    setIsUploading(true)

    try {
      // 메인 백엔드의 POST /ai API 호출
      const fullTextContent = `${creationResult.headline}\n\n${creationResult.body}\n\n${creationResult.cta}`;

      await axiosInstance.post('/ai', {
        storeId: 19, 
        info: fullTextContent,
        feel: creationResult.mood,
        hashtag: creationResult.hashtags.join(','),
        tag: '' 
      });

      alert('콘텐츠가 성공적으로 저장되었습니다!');
      setCreationResult(null);
      router.push('/');
    } catch (error) {
      console.error("DB 저장에 실패했습니다:", error)
      alert("콘텐츠 저장 중 오류가 발생했습니다.")
    } finally {
      setIsUploading(false)
    }
  };

  if (!creationResult) {
    return <Typography>콘텐츠를 먼저 제작해주세요...</Typography>
  }

  return (
    <Container maxWidth="sm" sx={{ p: 0, pb: 7 }}>
      <UserProfileHeader />
      <Divider />

      <Box sx={{ p: 2 }}>
        뒤로가기 버튼      
         <IconButton onClick={() => router.back()} sx={{ mb: 1 }}>
           <ArrowBackIcon />
       </IconButton>
        {/* AI 생성 블로그 콘텐츠 */}
         <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 2, mb: 2 }}>
           <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
             {creationResult.headline}
           </Typography>
             {creationResult.body.map(item =>
              item.startsWith('http') ? (
                <img
                  key={item}
                  src={item}
                  style={{
                    width: '100%',
                    maxWidth: '100%',
                    borderRadius: '4px',
                    objectFit: 'cover',
                    margin: '16px 0'
                  }}
                  alt="본문 이미지"
                />
              ) : (
                <span key={item}>{item}</span>
              )
            )}
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
            {creationResult.cta}
          </Typography>
        </Paper>

        {/* AI 생성 해시태그 */}
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
          {creationResult && creationResult.hashtags && creationResult.hashtags.map((tag) => (
            <Chip key={tag} label={tag} onDelete={() => handleHashtagDelete(tag)} />
          ))}
        </Stack>

        {/* 하단 버튼 영역 */}
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            color="inherit"
            fullWidth
            onClick={handleOpenModal}
          >
            재생성
          </Button>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? <CircularProgress size={24} /> : '업로드'}
          </Button>
        </Stack>
      </Box>

      {/* 추가 정보 입력 모달 */}
      <Modal open={openModal} onClose={handleCloseModal}>
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
          <Button
            onClick={handleRegenerate}
            sx={{ mt: 2 }}
            fullWidth
            variant="contained"
          >
            재생성 요청
          </Button>
        </Box>
      </Modal>
    </Container>
  )
}

export default CreateResultPage

// 'use client';

// import React, { useEffect, useState } from 'react';
// import { 
//   Box, Container, Typography, Button, Divider, Paper, 
//   Stack, Chip, IconButton, CircularProgress
// } from '@mui/material';
// import UserProfileHeader from '../../components/UserProfileHeader';
// import { useAtom } from 'jotai';
// import { creationResultAtom } from '../atom/creationAtom';
// import { useRouter } from 'next/navigation';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 
// import NavigateNextIcon from '@mui/icons-material/NavigateNext'; // [추가] 다음 결과 아이콘
// import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'; // [추가] 이전 결과 아이콘
// import axiosInstance from '@/config/axios';

// function CreateResultPage() {
//   const router = useRouter();
//   const [creationResult, setCreationResult] = useAtom(creationResultAtom);
  
//   // 현재 보여줄 결과물의 인덱스를 관리하는 상태
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const [isUploading, setIsUploading] = useState(false);

//   useEffect(() => {
//     if (!creationResult) {
//       router.replace("/create");
//     }
//   }, [creationResult, router]);
  
//   // 현재 인덱스에 해당하는 결과물을 쉽게 사용하기 위한 변수
//   const currentVariant = creationResult?.variants[currentIndex];

//   // 다음 결과물을 보여주는 함수
//   const handleNextResult = () => {
//     if (creationResult && currentIndex < creationResult.variants.length - 1) {
//       setCurrentIndex(currentIndex + 1);
//     }
//   };

//   // 이전 결과물을 보여주는 함수
//   const handlePrevResult = () => {
//     if (currentIndex > 0) {
//       setCurrentIndex(currentIndex - 1);
//     }
//   };

//   // 해시태그 삭제 기능 (현재 variant에 대해서만 동작하도록 수정)
//   const handleHashtagDelete = (tagToDelete: string) => {
//     if (creationResult && currentVariant) {
//       const updatedHashtags = currentVariant.hashtags.filter(
//         (tag) => tag !== tagToDelete
//       );

//       // 전체 variants 배열의 복사본을 만듭니다.
//       const updatedVariants = [...creationResult.variants];
//       // 현재 인덱스의 variant 객체를 업데이트된 해시태그로 교체합니다.
//       updatedVariants[currentIndex] = { ...currentVariant, hashtags: updatedHashtags };

//       // 전체 상태를 업데이트합니다.
//       setCreationResult({ ...creationResult, variants: updatedVariants });
//     }
//   };

//   const handleUpload = async () => {
//     if (!creationResult || !currentVariant) {
//       alert("업로드할 콘텐츠가 없습니다.");
//       return;
//     }

//     setIsUploading(true);

//     try {
//       // 현재 화면에 보이는 variant의 텍스트를 조합합니다.
//       const fullTextContent = `${currentVariant.headline}\n\n${currentVariant.body.join('')}\n\n${currentVariant.cta}`;

//       await axiosInstance.post('/ai', {
//         storeId: 19, 
//         info: fullTextContent,
//         feel: creationResult.mood,
//         hashtag: currentVariant.hashtags.join(','),
//         tag: '' 
//       });

//       alert('콘텐츠가 성공적으로 저장되었습니다!');
//       setCreationResult(null);
//       router.push('/');
//     } catch (error) {
//       console.error("DB 저장에 실패했습니다:", error);
//       alert("콘텐츠 저장 중 오류가 발생했습니다.");
//     } finally {
//       setIsUploading(false);
//     }
//   };
  
//   // creationResult가 없으면 로딩 또는 리디렉션 처리
//   if (!creationResult || !currentVariant) {
//     return <Typography>콘텐츠를 먼저 제작해주세요...</Typography>;
//   }

//   return (
//     <Container maxWidth="sm" sx={{ p: 0, pb: 7 }}>
//       <UserProfileHeader />
//       <Divider />

//       <Box sx={{ p: 2 }}>
//         <IconButton onClick={() => router.back()} sx={{ mb: 1 }}>
//           <ArrowBackIcon />
//         </IconButton>
        
//         {/* AI 생성 콘텐츠 */}
//         <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 2, mb: 2 }}>
//           <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
//             {currentVariant.headline}
//           </Typography>

//           {/* body 배열을 순회하며 텍스트와 이미지 표시 */}
//           {currentVariant.body.map((item, index) =>
//             item.startsWith('http') ? (
//               <img
//                 key={item + index}
//                 src={item}
//                 style={{
//                   width: '100%',
//                   borderRadius: '4px',
//                   objectFit: 'cover',
//                   margin: '16px 0'
//                 }}
//                 alt="본문 이미지"
//               />
//             ) : (
//               <span key={item + index}>{item}</span>
//             )
//           )}
//           <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', mt: 2 }}>
//             {currentVariant.cta}
//           </Typography>
//         </Paper>

//         {/* AI 생성 해시태그 */}
//         <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
//           {currentVariant.hashtags.map((tag) => (
//             <Chip key={tag} label={tag} onDelete={() => handleHashtagDelete(tag)} />
//           ))}
//         </Stack>

//         {/* 하단 버튼 영역 */}
//         <Stack direction="row" spacing={2} alignItems="center">
//           {/* 재생성 버튼을 '이전/다음' 버튼으로 변경 */}
//           <Paper variant="outlined" sx={{ display: 'flex', alignItems: 'center', borderRadius: '8px' }}>
//             <IconButton onClick={handlePrevResult} disabled={currentIndex === 0}>
//               <NavigateBeforeIcon />
//             </IconButton>
//             <Typography variant="body2" sx={{ px: 1 }}>
//               {currentIndex + 1} / {creationResult.variants.length}
//             </Typography>
//             <IconButton onClick={handleNextResult} disabled={currentIndex >= creationResult.variants.length - 1}>
//               <NavigateNextIcon />
//             </IconButton>
//           </Paper>

//           <Button
//             variant="contained"
//             color="primary"
//             fullWidth
//             onClick={handleUpload}
//             disabled={isUploading}
//           >
//             {isUploading ? <CircularProgress size={24} /> : '업로드'}
//           </Button>
//         </Stack>
//       </Box>
//     </Container>
//   )
// }

// export default CreateResultPage;