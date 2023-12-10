<template>
    <div class="d-flex w-100 align-items-center justify-center">
        <div class="d-flex flex-row w-100 justify-space-evenly">
            <v-sheet class="pt-6 w-50" rounded>
                <div v-if="workList && workList.length">
                    <div v-for="work in workList">
                        <work-card :work-info="work" class="mb-2"
                            @editWork="editWork"
                            @removeWork="popupRemoveWork">
                        </work-card>
                    </div>
                </div>
                <div v-else>Không có dữ liệu</div>
            </v-sheet>

            <v-card class="w-25 filter">
                <v-select
                    label="Tình trạng công việc"
                    v-model="workStatus"
                    @update:model-value="updateWorkFilter"
                    :items="workStatusList"
                    item-title="title"
                    item-value="value"
                ></v-select>
                <v-select
                    label="Loại công việc"
                    v-model="workType"
                    :items="workTypeList"
                    @update:model-value="updateWorkFilter"
                    item-title="title"
                    item-value="value"
                ></v-select>

                <v-btn color="" size="large" :to="{name: 'newPost'}">
                    Đăng bài
                </v-btn>
            </v-card>
        </div>
    <dialog-popup 
		v-model:is-show="isShowDialog"
		:title="'Xoá công việc'"
		:content="'Bạn có chắc chắn muốn xoá công việc này không?'"
		:confirm-text="'Xoá'"
        :data="popupData"
        @confirm="removeWork"
	></dialog-popup>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore, useLoadingStore } from '@/stores/index'
import { useCommonUltilities } from '@/services/commonUlti'

import workApi from '@/apis/workApi'
import DialogPopup from '@/components/DialogPopup.vue';
import WorkCard from '@/components/WorkCard.vue'
import enums from '@/constants/enums';
import { unescapeLeadingUnderscores } from 'typescript';

const authStore = useAuthStore()
const loadingStore = useLoadingStore()
const { toast, router } = useCommonUltilities()

const workStatusList = ref([
    {title: 'Tất cả', value: -1},
    {title: 'Mới', value: enums.workStatus.new},
    {title: 'Đã giao', value: enums.workStatus.inProgress},
    {title: 'Đã hoàn thành', value: enums.workStatus.completed},
    {title: 'Đã huỷ', value: enums.workStatus.cancel},

])
const workStatus = ref(-1)
const updateWorkFilter = (e: any) => {
    let workStatusValue = workStatus.value != -1 ? workStatus.value : null
    let workTypeValue = workType.value != -1 ? workType.value : null
    getWorkListByClientId(workStatusValue, workTypeValue)
}

const workTypeList = ref([
    {title: 'Tất cả', value: -1},
    {title: 'Offline', value: enums.workType.offline},
    {title: 'Online', value: enums.workType.online},
    {title: 'Hybrid', value: enums.workType.hybrid},
])
const workType = ref(-1)


const workList = ref([])
const clientId = authStore.userInfo.id
const getWorkListByClientId = async (workStatus = null, workType = null) => {
    loadingStore.setLoading(true)
    let res = await workApi.getByClientId(clientId, workStatus, workType)
    loadingStore.setLoading(false)
    if (res && (res.status == 200 || res.status == 204)) {
        workList.value = res.data
    }
}

getWorkListByClientId()

const popupData = ref({})
const isShowDialog = ref(false)
const editWork = (workInfo: any) => {
    router.push({name: 'editPost', query: {
        id: workInfo.id
    }})
} 
const popupRemoveWork = (workInfo: any) => {
    popupData.value = workInfo
    isShowDialog.value = true
}
const removeWork = async (workInfo: any) => {
    isShowDialog.value = false
    let res = await workApi.removeById(workInfo.id)
    getWorkListByClientId()
    if (res && res.status == 200) {
        toast.success('Xoá công việc thành công')
    } else {
        toast.error('Có lỗi xảy ra')
    }
}
</script>


<style scoped>
.filter {
    height: fit-content;
    width: 300px;
    top: 30px;
    padding: 8px;
}
</style>