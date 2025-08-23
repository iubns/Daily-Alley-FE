import axios from "@/config/axios"
import { atom, useAtom, useSetAtom } from "jotai"

const StoreInfoAtom = atom<StoreInfo>({
  name: "",
  type: "",
  location: "",
  description: "",
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

export default function useStoreEdit() {
  const [storeInfo, setStoreInfo] = useAtom(StoreInfoAtom)
  const setStoreId = useSetAtom(atom<number | null>(null))
  async function registrationStoreInfo() {
    const { data, status } = await axios.post<RegistrationResponse>(
      "/store",
      storeInfo
    )

    if (status === 200) {
      localStorage.setItem("storeId", String(data.storeId))
      setStoreId(data.storeId)
    }

    return {
      status,
    }
  }

  return {
    registrationStoreInfo,
    storeInfo,
    setStoreInfo,
  }
}
