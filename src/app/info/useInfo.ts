import axios from "@/config/axios"
import { atom, useAtom } from "jotai"
import { useRouter } from "next/navigation"
import { StoreIdAtom } from "../atom/storeId"
import { StoreInfo } from "./edit/useStoreEdit"

const StoreInfoAtom = atom<StoreInfo>({
  name: "",
  type: "",
  location: "",
  description: "",
})

export function useInfo() {
  const { push } = useRouter()
  const [storeId, setStoreId] = useAtom(StoreIdAtom)
  const [storeInfo, setStoreInfo] = useAtom(StoreInfoAtom)

  async function fetchStoreInfo() {
    if (!storeId) {
      const storedId = localStorage.getItem("storeId")
      if (storedId) {
        setStoreId(Number(storedId))
      } else {
        //push("/info/edit")
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
