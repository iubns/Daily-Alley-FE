"use client"

import React, { useEffect, useState } from "react"
import { Paper, BottomNavigation, BottomNavigationAction } from "@mui/material"
import HomeIcon from "@mui/icons-material/Home"
import EditCalendarIcon from "@mui/icons-material/EditCalendar"
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate"
import StorefrontIcon from "@mui/icons-material/Storefront"
import PersonOutlineIcon from "@mui/icons-material/PersonOutline"
import { useRouter, usePathname } from "next/navigation"

const valueToPath: { [key: number]: string } = {
  0: "/schedule", // 일정 정리
  1: "/create", // 콘텐츠 제작
  2: "/", // 메인화면
  3: "/info", // 가게 정보
  4: "/user", // 사용자
}

function MainBottomNav() {
  const router = useRouter()
  const pathname = usePathname()

  const [value, setValue] = useState(2) // 기본값= 메인화면

  useEffect(() => {
    const matchingValue = Object.keys(valueToPath).find(
      (key) => valueToPath[Number(key)] === pathname
    )
    if (matchingValue) {
      setValue(Number(matchingValue))
    }
  }, [pathname])

  return (
    <Paper sx={{ zIndex: 1000 }} elevation={3}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          const path = valueToPath[newValue]
          if (path) {
            router.push(path)
          }
        }}
      >
        <BottomNavigationAction label="일정 정리" icon={<EditCalendarIcon />} />
        <BottomNavigationAction
          label="콘텐츠 제작"
          icon={<AddPhotoAlternateIcon />}
        />
        <BottomNavigationAction label="메인화면" icon={<HomeIcon />} />
        <BottomNavigationAction label="가게 정보" icon={<StorefrontIcon />} />
        <BottomNavigationAction label="사용자" icon={<PersonOutlineIcon />} />
      </BottomNavigation>
    </Paper>
  )
}

export default MainBottomNav
