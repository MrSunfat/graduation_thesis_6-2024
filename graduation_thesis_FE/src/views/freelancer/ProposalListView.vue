<template>
    <div class="d-flex w-100 align-items-center justify-center">
        <v-col sm="8" md="5">
            <div v-for="work in workList" class="mt-2">
                <work-card-freelancer :work-info="work">
                    <template #button>
                        <v-btn color="#5865f2" :to="{name: 'chatFreelancer', query: { userId: work.clientId }}" rounded="xl" variant="tonal">Nhắn tin</v-btn>
                    </template>
                    <template #proposal>
                        <v-divider></v-divider>
                        <div>Thư ngỏ: {{ work.proposalContent }}</div>
                        <div>Thu nhập mong muốn: {{ formatCurrency(work.expectedPrice) }}</div>
                    </template>
                </work-card-freelancer>
            </div>
        </v-col>
    </div>
</template>
<script setup>
import WorkCardFreelancer from '@/components/WorkCardFreelancer.vue';
import { ref } from 'vue';
import { useCommonUltilities } from '@/services/commonUlti'
import { useAuthStore } from '@/stores/authStore';
import { useLoadingStore } from '@/stores/loadingStore';
import workApi from '@/apis/workApi';

const authStore = useAuthStore()
const loadingStore = useLoadingStore()
const workList = ref([])
const getProposalList = async () => {
    loadingStore.setLoading(true)
    let res = await workApi.getProposalList(authStore.userInfo.id)
    loadingStore.setLoading(false)
    if (res && (res.status == 200 || res.status == 204)) {
        workList.value = res.data
    }
}
getProposalList()
</script>