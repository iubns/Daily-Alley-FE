import axios from "@/config/axios"
import { atom, useAtom } from "jotai"
import { useRouter } from "next/navigation"
import { StoreIdAtom } from "../atom/storeId"
import { StoreInfo } from "./edit/useStoreEdit"
import { useCallback } from "react"

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
  const [contentFeel, setContentFeel] = useAtom(
    atom<{ picFeel: string; postFeel: string }>({ picFeel: "", postFeel: "" })
  )

  async function fetchStoreInfo() {
    console.log("storeId", storeId)

    var foundStoreId: number | string | null = storeId
    if (!storeId) {
      foundStoreId = localStorage.getItem("storeId")
      if (!foundStoreId) {
        push("/info/edit")
        return
      }
      setStoreId(Number(foundStoreId))
    }

    if (storeInfo.name) {
      return
    }

    const { data, status } = await axios.get<StoreInfo>(
      `/store?storeId=${foundStoreId}`
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
    contentFeel,
    fetchContentFeel,
  }
}
