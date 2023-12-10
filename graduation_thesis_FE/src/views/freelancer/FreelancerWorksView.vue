<template>
    <div class="d-flex w-100 align-items-center justify-center">
        <v-col sm="8" md="5">
            <v-select
                label="Trạng thái"
                v-model="workStatus"
                @update:modelValue="updateWorkFilter"
                :items="workStatusList"
                item-title="title"
                item-value="value"
            ></v-select>
            <div v-if="workList && workList.length">
                <div v-for="work in workList" class="mt-3">
                    <work-card-freelancer :work-info="work"
                        :is-suggest-work="false"
                        @clickTitle="viewDetail">
                        <template #button>
                            <div>
                                <v-btn color="#5865f2" target="_blank" :to="{name: 'chatFreelancer', query: { userId: work.clientId }}" rounded="xl" variant="tonal">Nhắn tin</v-btn>
                            </div>
                        </template>
                    </work-card-freelancer>
                </div>

            </div>
            <div v-else>Không có công việc trong danh sách</div>
        </v-col>
    </div>
    <work-detail-freelancer-popup
        ref="popup"
        :work-detail="workDetail"
        :is-show="isShow"
        @close="isShow = false">
    </work-detail-freelancer-popup>
</template>

<script setup>
import WorkCardFreelancer from '@/components/WorkCardFreelancer.vue';
import WorkDetailFreelancerPopup from '@/components/WorkDetailFreelancerPopup.vue';
import { nextTick, ref } from 'vue';
import { useCommonUltilities } from '@/services/commonUlti'
import { useAuthStore } from '@/stores/authStore';
import workApi from '@/apis/workApi';
import enums from '@/constants/enums';

const popup = ref(null)

const { toast, router } = useCommonUltilities()
const authStore = useAuthStore()

const workStatusList = ref([
    {title: 'Tất cả', value: -1},
    {title: 'Đang làm', value: enums.workStatus.inProgress},
    {title: 'Đã hoàn thành', value: enums.workStatus.completed},
    // {title: 'Đã huỷ', value: enums.workStatus.cancel},

])
const workStatus = ref(-1)
const updateWorkFilter = (e) => {
    let workStatusValue = workStatus.value != -1 ? workStatus.value : null
    getFreelancerWorks(workStatusValue)
}


const workList = ref([])
const getFreelancerWorks = async (workStatus = null) => {
    let res = await workApi.getByFreelancerId(authStore.userInfo.id, workStatus)
    if (res && (res.status == 200 || res.status == 204)) {
        workList.value = res.data
    }
}
getFreelancerWorks()

const workDetail = ref({})
const isShow = ref(false)
const viewDetail = async (workInfo) => {
    let res = await workApi.getWorkFreelancerDetail(workInfo.id, authStore.userInfo.id)
    if (res && res.status == 200) {
        workDetail.value = res.data
        isShow.value = true
        await nextTick()
        popup.value.getAttachments()
        popup.value.getAttachmentWork()
    }
}

</script>