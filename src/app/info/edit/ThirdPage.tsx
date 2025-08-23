"use client"

import { Stack, TextField } from "@mui/material"

export default function ThirdInfoPage() {
  return (
    <Stack width="100%" height="100%" alignItems="center">
      <Stack textAlign="center">3. 사용 중인 SNS를 등록해주세요.</Stack>

      <Stack gap="24px" width="100%" maxWidth="400px" mt="24px" padding="12px">
        <TextField label="네이버 블로그 아이디" />
        <TextField label="네이버 블로그 비밀번호" type="password" />
      </Stack>
    </Stack>
  )
}
