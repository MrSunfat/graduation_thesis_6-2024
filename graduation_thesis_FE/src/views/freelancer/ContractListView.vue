<template>
    <div class="d-flex w-100 align-items-center justify-center">
        <v-col sm="8" md="5">
            <div v-for="(contract, index) in contractList" :key="index">
                <v-card style="color: rgb(127, 138, 131);" class="mx-auto mt-3" max-width="400" >
                    <v-card-item>
                        <div v-html="getProposalStatus(contract.status)"></div>
                        <a style="cursor: pointer;" @click="showContractDetail(contract.id)">{{ contract.contractName }}</a>
                        <div>Thu nhập thoả thuận: {{ formatCurrency(contract.budget) }}</div>
                        <div>Ngày bắt đầu: {{ formatDate(contract.startDate) }}</div>
                        <div>Ngày kết thúc: {{ formatDate(contract.endDate) }}</div>
                    </v-card-item>
                </v-card>
            </div>
        </v-col>
        <contract-detail-popup
            v-model:is-show="showPopup"
            :contract-detail="contractDetail"
            @close="showPopup = false">

        </contract-detail-popup>
    </div>
</template>

<script setup>
import ContractDetailPopup from '@/components/ContractDetailPopup.vue';
import contractApi from '@/apis/contractApi';
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useCommonUltilities } from '@/services/commonUlti';
import enums from '@/constants/enums';
const showPopup = ref(false)

const { route } = useCommonUltilities()
const authStore = useAuthStore()
const contractList = ref([])
const getContractList = async () => {
    let res = await contractApi.getContractByFreelancerId(authStore.userInfo.id)
    if (res && res.status == 200) {
        contractList.value = res.data
        
    }
}

getContractList()

const contractDetail = ref({})
const showContractDetail = async (contractId) => {
    let res = await contractApi.getContractDetail(contractId)
    if (res && res.status == 200) {
        contractDetail.value = res.data
        showPopup.value = true

    }
}

if (route.query.contractId) {
    showContractDetail(route.query.contractId)
}

const getProposalStatus = (statusCode) => {
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