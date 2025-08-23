"use client"

import { Stack, Typography } from "@mui/material"

export default function FourthInfoPage() {
  return (
    <Stack width="100%" height="100%" alignItems="center">
      <Stack textAlign="center">
        4. 원하시는 컨텐츠 느낌을 <br />
        선택해주세요.
      </Stack>

      <Stack gap="16px" width="100%" maxWidth="400px" padding="12px" mt="24px">
        <Typography
          px="12px"
          variant="body2"
          color="text.secondary"
          width="100%"
          sx={{
            textAlign: "left",
          }}
        >
          사진 느낌
        </Typography>
        <Stack direction="row" width="100%" overflow="scroll" gap="12px">
          {Array.from({ length: 5 }).map((_, index) => (
            <Stack
              key={index}
              minWidth="200px"
              height="140px"
              bgcolor="#f0f0f0"
              borderRadius="8px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              sx={{ cursor: "pointer", border: "1px solid #ccc" }}
            >
              <Typography variant="body2" color="text.secondary">
                선택하기
              </Typography>
            </Stack>
          ))}
        </Stack>

        <Typography
          px="12px"
          variant="body2"
          color="text.secondary"
          width="100%"
          sx={{
            textAlign: "left",
            mt: 2,
          }}
        >
          게시글 느낌
        </Typography>
        <Stack width="100%" overflow="scroll" gap="12px">
          {Array.from({ length: 5 }).map((_, index) => (
            <Stack
              key={index}
              minWidth="100px"
              height="200px"
              bgcolor="#f0f0f0"
              borderRadius="8px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              sx={{ cursor: "pointer", border: "1px solid #ccc" }}
            >
              <Typography variant="body2" color="text.secondary">
                선택하기
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Stack>
  )
}
