"use client"

import { Box, Button, Stack } from "@mui/material"
import styles from "./page.module.css"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { useEffect, useState } from "react"
import SecondInfoPage from "./SecondPage"
import FirstInfoPage from "./FirstPage"
import ThirdInfoPage from "./ThirdPage"
import FourthInfoPage from "./FourthInfoPage"
import { useRouter } from "next/navigation"
import useStoreEdit, { StoreInfo } from "./useStoreEdit"
import { useAtom, useAtomValue } from "jotai"
import { StoreIdAtom } from "@/app/atom/storeId"

export default function InfoEditPage() {
  const { push } = useRouter()
  const [progress, setProgress] = useState(25)
  const [currentStep, setCurrentStep] = useState(1)
  const { registrationStoreInfo } = useStoreEdit()
  const storeId = useAtomValue(StoreIdAtom)

  useEffect(() => {
    const steps = 4
    const newProgress = (currentStep / steps) * 100
    setProgress(newProgress)
  }, [currentStep])

  async function handleNextStep() {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
    if (currentStep === 4) {
      const { status } = await registrationStoreInfo()
      //Todo: 나중에 이쁘게 꾸미기
      if (status === 200) {
        alert("가게 정보가 성공적으로 등록되었습니다.")
      } else {
        alert("가게 정보 등록에 실패했습니다. 다시 시도해주세요.")
      }

      push("/info")
    }
  }

  function StepPage() {
    switch (currentStep) {
      case 1:
        return <FirstInfoPage />
      case 2:
        return <SecondInfoPage />
      case 3:
        return <ThirdInfoPage />
      case 4:
        return <FourthInfoPage />
      default:
        return null
    }
  }

  function handleBack() {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setProgress((currentStep - 1) * 25)
    }

    if (currentStep === 1) {
      push("/info")
    }
  }

  return (
    <Stack height="100vh" width="100%">
      <Stack
        p="12px"
        py="24px"
        direction="row"
        gap="12px"
        alignItems="center"
        marginRight="24px"
      >
        <ArrowBackIcon onClick={handleBack} />
        <Stack
          position="relative"
          width="100%"
          height="20px"
          justifyContent="center"
        >
          <Box
            zIndex="10"
            width={progress + "%"}
            bgcolor="black"
            className={styles["progress-bar"]}
          />
          <Box
            zIndex="1"
            width="100%"
            bgcolor="#ddd"
            position="absolute"
            className={styles["progress-bar"]}
          />
        </Stack>
      </Stack>
      <Stack display="flex" flex="1">
        <StepPage />
      </Stack>
      <Stack padding="12px">
        <Button
          variant="contained"
          onClick={handleNextStep}
          sx={{
            borderRadius: "20px",
            backgroundColor: "#000",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#333",
            },
          }}
        >
          다음
        </Button>
      </Stack>
    </Stack>
  )
}
