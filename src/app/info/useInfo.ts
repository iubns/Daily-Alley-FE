import { atom, useAtom, useAtomValue } from "jotai"
import { StoreIdAtom } from "../atom/storeId"
import axios from "@/config/axios"
import { StoreInfo } from "./edit/useStoreEdit"
import { useRouter } from "next/navigation"

const StoreInfoAtom = atom<StoreInfo>({
  name: "",
  type: "",
  location: "",
  description: "",
})

export function useInfo() {
  const [storeId, setStoreId] = useAtom(StoreIdAtom)
  const [storeInfo, setStoreInfo] = useAtom(StoreInfoAtom)
  const { push } = useRouter()

  async function fetchStoreInfo() {
    if (!storeId) {
      const storedId = localStorage.getItem("storeId")
      if (storedId) {
        setStoreId(Number(storedId))
      } else {
        push("/info/edit")
        return
      }
    }

    if (storeInfo.name) {
      return
    }

    const { data, status } = await axios.get<StoreInfo>(
      `/store?storeId=${storeId}`
    )

    if (status === 200) {
      setStoreInfo(data)
    } else {
      alert("가게 정보를 불러오는 데 실패했습니다. 다시 시도해주세요.")
    }
  }

  return {
    storeInfo,
    fetchStoreInfo,
  }
}
