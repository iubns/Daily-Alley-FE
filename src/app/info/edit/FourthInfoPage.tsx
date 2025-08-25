"use client"

import { Stack, Typography } from "@mui/material"
import { useState } from "react"
import useStoreEdit from "./useStoreEdit"

export default function FourthInfoPage() {
  const aiPromotionStyles = [
    {
      label: "친근하고 따뜻한 스타일",
      example:
        "우리 가게는 언제나 여러분을 환영합니다! 편안한 분위기에서 소중한 사람들과 특별한 시간을 보내세요.",
    },
    {
      label: "트렌디하고 감각적인 스타일",
      example:
        "요즘 핫플레이스! 감각적인 인테리어와 인스타 감성 메뉴로 특별한 하루를 만들어보세요.",
    },
    {
      label: "전문적이고 신뢰감 있는 스타일",
      example:
        "20년 경력의 셰프가 직접 만드는 정통 요리! 믿고 먹을 수 있는 최고의 맛을 경험하세요.",
    },
    {
      label: "유쾌하고 재치 있는 스타일",
      example:
        "배고프면 우리 가게로! 맛있게 먹고, 웃으며 즐기는 행복한 시간 보장!",
    },
    {
      label: "프리미엄 & 고급스러운 스타일",
      example:
        "고급스러운 분위기와 엄선된 재료로 만든 프리미엄 메뉴, 소중한 분과의 특별한 만남에 추천합니다.",
    },
    {
      label: "건강 & 웰빙 강조 스타일",
      example:
        "신선한 재료와 건강을 생각한 레시피! 몸과 마음이 모두 만족하는 건강한 한 끼를 만나보세요.",
    },
    {
      label: "가족 친화적 스타일",
      example:
        "아이와 함께, 가족 모두가 즐길 수 있는 넓고 안전한 공간! 가족 외식은 우리 가게에서.",
    },
  ]

  const { contentFeel, setContentFeel } = useStoreEdit()
  const [selectedPicIdx, setSelectedPicIdx] = useState<number | null>(null)
  const [selectedPostIdx, setSelectedPostIdx] = useState<number | null>(null)

  const handlePicFeelSelect = (idx: number) => {
    setSelectedPicIdx(idx)
    setContentFeel({
      ...contentFeel,
      picFeel: aiPromotionStyles[idx].label,
    })
  }

  const handlePostFeelSelect = (idx: number) => {
    setSelectedPostIdx(idx)
    setContentFeel({
      ...contentFeel,
      postFeel: aiPromotionStyles[idx].label,
    })
  }

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
          {aiPromotionStyles.map((style, index) => (
            <Stack
              key={index}
              minWidth="200px"
              height="140px"
              bgcolor={selectedPicIdx === index ? "#e3f2fd" : "#f0f0f0"}
              borderRadius="8px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              sx={{
                cursor: "pointer",
                border:
                  selectedPicIdx === index
                    ? "2px solid #1976D2"
                    : "1px solid #ccc",
              }}
              onClick={() => handlePicFeelSelect(index)}
            >
              <Typography variant="body2" color="text.secondary">
                {style.label}
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
          {aiPromotionStyles.map((style, index) => (
            <Stack
              key={index}
              minWidth="200px"
              height="auto"
              bgcolor={selectedPostIdx === index ? "#e3f2fd" : "#f0f0f0"}
              borderRadius="8px"
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="center"
              sx={{
                cursor: "pointer",
                border:
                  selectedPostIdx === index
                    ? "2px solid #1976D2"
                    : "1px solid #ccc",
                p: 2,
              }}
              onClick={() => handlePostFeelSelect(index)}
            >
              <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
                {style.label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {style.example}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Stack>
  )
}
