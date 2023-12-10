<template>
    <v-dialog v-model="props.isShow" width="auto" persistent class="">
        <v-card class="pa-4">
            <div class="d-flex">
                <div class="contract-info pr-4">
                    <div class="d-flex">
                        <div class="title-col">Trạng thái:</div>
                        <div v-html="getProposalStatus(contractDetail?.status)"></div>
                    </div>
                    <div class="d-flex">
                        <div class="title-col">Tên hợp đồng:</div>
                        <div>{{ contractDetail?.contractName }}</div>
                    </div>
                    <div class="d-flex">
                        <div class="title-col">Tên công việc:</div>
                        <div>{{ contractDetail?.jobTitle }}</div>
                    </div>
                    <div class="d-flex">
                        <div class="title-col">Mô tả công việc:</div>
                        <div>{{ contractDetail?.jobDescription }}</div>
                    </div>
                    <div class="d-flex">
                        <div class="title-col">Thu nhập:</div>
                        <div>{{ formatCurrency(parseInt(contractDetail?.budget) || 0) }}</div>
                    </div>
                    <div class="d-flex">
                        <div class="title-col">Ngày bắt đầu:</div>
                        <div>{{ formatDate(contractDetail?.startDate) }}</div>
                    </div>
                    <div class="d-flex">
                        <div class="title-col">Ngày kết thúc:</div>
                        <div>{{ formatDate(contractDetail?.endDate) }}</div>
                    </div>
                </div>
                <v-divider vertical></v-divider>
                <div class="pl-4">
                    <div class="buttons d-flex flex-column">
                        <v-btn v-if="contractDetail?.status == enums.contractStatus.new" color="success" @click="approveContract">Chấp nhận</v-btn>
                        <v-btn v-if="contractDetail?.status == enums.contractStatus.new" color="red" @click="rejectContract">Từ chối</v-btn>
                        <v-btn @click="close">Đóng</v-btn>
                    
                    </div>
                    <div class="client-info">
                        <div>Thông tin nhà tuyển dụng:</div>
                        <div class="d-flex mt-2">
                            <div class="avatar-container mr-3">
                                <img :src="contractDetail?.clientAvatar || `https://ui-avatars.com/api/?name=${contractDetail?.clientName}`" class="rounded-circle" alt="" srcset=""/>
                            </div>
                            <div>
                                <a :href="`/profile/${contractDetail?.clientId}`" target="_blank">{{ contractDetail?.clientName }}</a>
                                <div>{{ contractDetail?.clientAddress }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </v-card>
    </v-dialog>
</template>
<script setup lang="ts">
import contractApi from '@/apis/contractApi';
import enums from '@/constants/enums';
import { useAuthStore } from '@/stores/authStore';
import { useCommonUltilities } from '@/services/commonUlti';
import { formatCurrency, formatDate } from "@/services";

const {toast, router} = useCommonUltilities()
const authStore = useAuthStore()
const props = defineProps({
    contractDetail: {
        type: Object
    },
    isShow: {
        type: Boolean,
        default: false
    }
})
const emit = defineEmits(['confirm', 'update:isShow', 'close'])

const approveContract = async () => {
    const freelancerId = authStore.userInfo.id
    let res = await contractApi.approveContract(props.contractDetail?.id, freelancerId)
    if (res && res.status == 200 && res.data) {
        // success
        toast.success('Chấp nhận công việc thành công')
        history.go()

    } else {
        // co loi xay ra
        toast.warning(res.data.userMsg || 'Có lỗi xảy ra')
    }
}
const rejectContract = async () => {
    const freelancerId = authStore.userInfo.id
    let res = await contractApi.rejectContract(props.contractDetail?.id, freelancerId)
    if (res && res.status == 200 && res.data) {
        // success
        toast.success('Từ chối công việc thành công')
        history.go()
    } else {
        // co loi xay ra
        toast.warning(res.data.userMsg || 'Có lỗi xảy ra')
    }
}
const close = () => {
    emit('close')
}

const getProposalStatus = (statusCode: number) => {
    switch (statusCode) {
        case enums.contractStatus.new:
            return '<span style="color: rgb(21, 131, 221);">Chờ chấp nhận</span>'
        case enums.contractStatus.expired:
            return '<span style="color: rgb(127, 138, 131);">Hết hạn</span>'
        case enums.contractStatus.rejected:
            return '<span style="color: rgb(221, 21, 71);">Đã từ chối</span>'
        case enums.contractStatus.valid:
            return '<span style="color: rgb(48, 221, 21);">Đã chấp nhận</span>'
        default:
            return ''
    }
}
</script>

<style scoped>
.contract-info div {
    margin-bottom: 8px;
}
.buttons > * {
    margin-bottom: 8px;
}
.title-col {
    width: 150px;
}
</style>