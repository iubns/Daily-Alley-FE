"use client"

import React from "react"
import {
  Box,
  Container,
  Typography,
  Button,
  Divider,
  Paper,
} from "@mui/material"
import UserProfileHeader from "../components/UserProfileHeader"
import { useRouter } from "next/navigation"

// 임시 데이터
const mockStoreData = {
  mainImage:
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop",
  description: `설문으로 받은
  여러가지 가게정보에 대한
  내용이 들어갈 부분`,
}

function StoreInfoPage() {
  const { push } = useRouter()

  function handleEditClick() {
    push("/info/edit")
  }

  return (
    <Container maxWidth="sm" sx={{ p: 0, pb: 7 }}>
      <UserProfileHeader />

      <Divider />

      <Box sx={{ p: 2 }}>
        {/* 가게 대표 이미지 */}
        <Paper
          component="img"
          src={mockStoreData.mainImage}
          alt="가게 대표 이미지"
          elevation={0}
          sx={{
            width: "100%",
            height: 200,
            objectFit: "cover",
            borderRadius: 2,
            mb: 3,
          }}
        />

        {/* 가게 설명 타이틀, 수정 버튼 */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            가게 정보
          </Typography>
          <Button
            color="inherit"
            variant="contained"
            onClick={handleEditClick}
            sx={{
              color: "black",
              backgroundColor: "#f0f0f0",
              boxShadow: "none",
            }}
          >
            수정
          </Button>
        </Box>

        {/* 가게 설명 내용 */}
        <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
          {mockStoreData.description}
        </Typography>
      </Box>
    </Container>
  )
}

export default StoreInfoPage
