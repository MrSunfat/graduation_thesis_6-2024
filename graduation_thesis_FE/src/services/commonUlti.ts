import { useRoute, useRouter } from 'vue-router'
import { useToast } from "vue-toastification";
import enums from '@/constants/enums'
export function useCommonUltilities() {
    const route = useRoute()
    const router = useRouter()
    const toast = useToast()

    return { route, router, toast, enums }
}