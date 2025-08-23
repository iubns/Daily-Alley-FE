import axios from "@/config/axios"
import { atom, useAtom, useSetAtom } from "jotai"
import { useEffect } from "react"

const StoreInfoAtom = atom<StoreInfo>({
  name: "",
  type: "",
  location: "",
  description: "",
})

const StoreSnsInfoAtom = atom<StoreSNSInfo>({
  storeId: 0,
  snsId: "",
  password: "",
  type: "NAVER",
})

export interface StoreInfo {
  name: string
  type: string
  location: string
  description: string
}

interface RegistrationResponse {
  message: string
  storeId: number
}

interface StoreSNSInfo {
  storeId: number
  snsId: string
  password: string
  type: "NAVER" | "INSTAGRAM"
}

export default function useStoreEdit() {
  const [storeInfo, setStoreInfo] = useAtom(StoreInfoAtom)
  const [storeSnsInfo, setStoreSnsInfo] = useAtom(StoreSnsInfoAtom)
  const setStoreId = useSetAtom(atom<number | null>(null))

  async function registrationStoreInfo() {
    const { data, status } = await axios.post<RegistrationResponse>(
      "/store",
      storeInfo
    )

    if (status === 200) {
      localStorage.setItem("storeId", String(data.storeId))
      setStoreId(data.storeId)
      setStoreSnsInfo((prev) => ({ ...prev, storeId: data.storeId }))
    }

    return {
      status,
    }
  }

  async function saveStoreSnsInfo() {
    const { status } = await axios.post("/store/sns", storeSnsInfo)
    return status
  }

  return {
    registrationStoreInfo,
    saveStoreSnsInfo,
    storeInfo,
    setStoreInfo,
    setStoreSnsInfo,
    storeSnsInfo,
  }
}
