"use client"

import { Box, Button, Stack } from "@mui/material"
import styles from "./page.module.css"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { useEffect, useState } from "react"

export default function InfoEditPage() {
  const [progress, setProgress] = useState(25)
  const [currentStep, setCurrentStep] = useState(1)

  useEffect(() => {
    const steps = 4
    const newProgress = (currentStep / steps) * 100
    setProgress(newProgress)
  }, [currentStep])

  function handleNextStep() {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  return (
    <Stack height="100vh" width="100%">
      <Stack
        padding="12px"
        direction="row"
        gap="12px"
        alignItems="center"
        marginRight="24px"
      >
        <ArrowBackIcon />
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
      <Stack display="flex" flex="1"></Stack>
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
