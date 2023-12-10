<template>
    <div class="d-flex w-100 align-items-center justify-center">
        <v-col sm="8" md="6">
            <div>
                <v-tabs
                v-model="tab"
                bg-color="primary"
                align-tabs="center" 
                >
                    <v-tab value="one">Mô tả</v-tab>
                    <v-tab value="two">Hồ sơ ứng tuyển</v-tab>
                    <v-tab value="three" >Tiến độ công việc</v-tab>
                </v-tabs>

                <v-card-text>
                    <v-window v-model="tab">
                        <v-window-item value="one">
                            <div v-if="workInfo">
                                <div class="d-flex">
                                    <div class="title-col">Tên công việc:</div>
                                    <div class="data-col">{{ workInfo.title }}</div>
                                </div>
                                <div class="d-flex">
                                    <div class="title-col">Loại công việc:</div>
                                    <div class="data-col">{{ getWorkType(workInfo.type) }}</div>
                                </div>
                                <div v-if="workInfo.location" class="d-flex">
                                    <div class="title-col">Địa chỉ:</div>
                                    <div class="data-col">{{ workInfo.location }}</div>
                                </div>
                                <div class="d-flex">
                                    <div class="title-col">Lĩnh vực:</div>
                                    <div class="data-col">{{ workInfo.workField }}</div>
                                </div>
                                <div class="d-flex">
                                    <div class="title-col">Mô tả:</div>
                                    <div class="data-col">{{ workInfo.description }}</div>
                                </div>
                                <div class="d-flex">
                                    <div class="title-col">Yêu cầu kỹ năng:</div>
                                    <v-chip-group>
                                        <v-chip v-for="field in JSON.parse(workInfo.fieldTag)">{{ field }}</v-chip>
                                    </v-chip-group>
                                </div>
                                <div class="d-flex">
                                    <div class="title-col">Ngân sách:</div>
                                    <div class="data-col">{{ formatCurrency(workInfo.budget) }}</div>
                                </div>
                                <div class="d-flex" v-if="attachments && attachments.length">
                                    <div class="title-col">Tệp đính kèm:</div>
                                    <div class="data-col" v-for="file in attachments">
                                        <a :href="file.href" :download="file.fileName">{{ file.fileName }}</a>
                                    </div>
                                </div>
                                <div class="d-flex">
                                    <div class="title-col">Ngày đăng:</div>
                                    <div class="data-col">{{ formatDate(workInfo.createdDate) }}</div>
                                </div>

                            </div>
                        </v-window-item>

                        <v-window-item value="two">
                            <div id="proposal-section">
                                <div v-if="proposalList && proposalList.length > 0">
                                    <div v-for="(proposal, index) in proposalList" :key="index">
                                        <div class="d-flex proposal-item">
                                            <div class="avatar-container mr-3">
                                                <img :src="proposal.avatar || `https://ui-avatars.com/api/?name=${proposal.freelancerName}`" class="rounded-circle" alt="" srcset=""/>
                                            </div>
                                            <div class="flex-column w-100">
                                                <div class="d-flex justify-space-between align-center">
                                                    <a :href="`/profile/${proposal.freelancerId}`" target="_blank" class="text-h6">{{ proposal.freelancerName }} <b v-if="proposal.jobTitle">({{ proposal.jobTitle }})</b></a>
                                                    <div class="d-flex">
                                                        <v-btn color="success" rounded="xl" size="medium" class="pr-2 pl-2" variant="outlined" @click="message(proposal)">
                                                            Nhắn tin
                                                        </v-btn>
                                                        <div v-if="proposal.status == enums.proposalStatus.pending">
                                                            <v-btn color="red" rounded="xl" class="ml-2" size="small" variant="elevated" @click="reject(proposal)">
                                                                Từ chối
                                                            </v-btn>
                                                            <v-btn color="success" rounded="xl" class="ml-2" size="small" variant="elevated" @click="accept(proposal)">
                                                                Gửi hợp đồng
                                                            </v-btn>
                                                        </div>
                                                        <v-btn v-else-if="proposal.status == enums.proposalStatus.negotiating" disabled color="success" rounded="xl" class="ml-2" size="small" variant="elevated">
                                                            Chờ xác nhận
                                                        </v-btn>
                                                        <v-btn v-else-if="proposal.status == enums.proposalStatus.reject" disabled color="red" rounded="xl" class="ml-2" size="small" variant="elevated">
                                                            Đã từ chối
                                                        </v-btn>
                                                        <v-chip v-else-if="proposal.status == enums.proposalStatus.accept" 
                                                            color="teal"
                                                            text-color="white"
                                                            prepend-icon="mdi-checkbox-marked-circle"
                                                            >
                                                            Đã chấp nhận
                                                        </v-chip>
                                                    </div>
                                                </div>
                                                <div>{{ proposal.address }}</div>
                                                <div class="d-flex mt-3 row-data">
                                                    <div class="title-col">Thư ngỏ: </div>
                                                    <div class="data-col">{{ proposal.content }}</div>
                                                </div>
                                                <div class="d-flex row-data">
                                                    <div class="title-col">Thu nhập mong muốn: </div>
                                                    <div class="data-col">{{ formatCurrency(proposal.price) }}</div>
                                                </div>
                                                <div v-if="proposal.attachments && proposal.attachments.length" class="d-flex">
                                                    <div class="title-col row-data">Tệp đính kèm:</div>
                                                    <div>
                                                        <div v-for="file in proposal.attachments" class="d-flex align-center data-col">
                                                            <a :href="file.href" :download="file.fileName">{{ file.fileName }}</a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="d-flex row-data">
                                                    <div class="title-col">Kỹ năng công việc:</div>
                                                    <v-chip-group>
                                                        <v-chip v-for="field in JSON.parse(proposal.skills)">{{ field }}</v-chip>
                                                    </v-chip-group>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-else>
                                    <div>Chưa có người ứng tuyển. Dưới đây là danh sách ứng viên tiềm năng:</div>
                                    <div v-for="(freelancer, index) in suggestFreelancer" :key="index" class="mt-3">
                                        <v-card>
                                            <v-card-item>
                                                <a :href="`/profile/${freelancer.id}`" target="_blank">{{ freelancer.name }} ({{ freelancer.jobTitle }})</a>
                                                <div class="d-flex row-data" v-if="freelancer.workField">
                                                    <div class="title-col">Lĩnh vực làm việc:</div>
                                                    <div class="data-col">{{ freelancer.workField }}</div>
                                                </div>
                                                <div class="d-flex row-data">
                                                    <div class="title-col">Điểm đánh giá:</div>
                                                    <v-rating
                                                        v-model="freelancer.rating"
                                                        bg-color="orange-lighten-1"
                                                        color="blue"
                                                        disabled
                                                    ></v-rating>
                                                </div>
                                                <div class="d-flex row-data">
                                                    <div class="title-col">Kỹ năng công việc:</div>
                                                    <v-chip-group>
                                                        <v-chip v-for="field in JSON.parse(freelancer.skills)">{{ field }}</v-chip>
                                                    </v-chip-group>
                                                </div>
                                            </v-card-item>
                                        </v-card>
                                    </div>
                                </div>
                            </div>
                        </v-window-item>

                        <v-window-item value="three">
                            <div v-if="workProgress" class="work-progress">
                                <div class="d-flex">
                                    <div class="title-col">Người thực hiện:</div>
                                    <a :href="`/profile/${freelancerInfo.id}`" target="_blank"  class="data-col">{{ freelancerInfo.name }}</a>
                                </div>
                                <div class="d-flex">
                                    <div class="title-col">Thu nhập đề xuất:</div>
                                    <div class="data-col">{{ formatCurrency(workProgress.budget) }}</div>
                                </div>
                                <div class="d-flex">
                                    <div class="title-col">Thu nhập thoả thuận:</div>
                                    <div class="data-col">{{ formatCurrency(workProgress.expectedIncome) }}</div>
                                </div>
                                <div class="d-flex">
                                    <div class="title-col">Ngày bắt đầu:</div>
                                    <div class="data-col">{{ formatDate(workProgress.startDate) }}</div>
                                </div>
                                <div class="d-flex">
                                    <div class="title-col">Ngày kết thúc:</div>
                                    <div class="data-col">{{ formatDate(workProgress.endDate) }}</div>
                                </div>
                                <div class="d-flex">
                                    <div class="title-col">Tiến độ:</div>
                                    <div class="data-col">{{ workProgress.progress }}%</div>
                                </div>
                                <div v-if="progressAttachments && progressAttachments.length" class="d-flex">
                                    <div class="title-col">Tệp đính kèm:</div>
                                    <div class="data-col">
                                        <div v-for="file in progressAttachments" class="d-flex align-center">
                                            <a :href="file.href" :download="file.fileName">{{ file.fileName }}</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex justify-end">
                                    <v-btn v-if="workInfo.status != enums.workStatus.completed" color="success" :disabled="workProgress.progress !== 100"
                                        :title="workProgress.progress == 100 ? '' : 'Tiến độ công việc cần đạt 100%'"
                                        @click="isShowDialog = true">Xác nhận hoàn thành</v-btn>
                                    <v-btn v-else color="success" disabled>Đã hoàn thành</v-btn>
                                </div>
                            </div>
                            <div v-else>Công việc chưa được bàn giao</div>
                        </v-window-item>
                    </v-window>
                </v-card-text>
            </div>
        </v-col>
    </div>
    <dialog-popup 
		v-model:is-show="isShowDialog"
		:title="'Hoàn thành công việc'"
		:content="'Bạn có chắc chắn muốn xác nhận hoàn thành công việc này không?'"
		:confirm-text="'Xác nhận'"
        @confirm="confirmComplete"
	></dialog-popup>
    <rating-popup
        v-model:is-show="isShowRating"
        :user-info="freelancerInfo"
        :work-id="workId"
        >

    </rating-popup>
</template>

<script setup>
import DialogPopup from '@/components/DialogPopup.vue';
import RatingPopup from '@/components/RatingPopup.vue';
import { ref } from 'vue'
import { useCommonUltilities } from '@/services/commonUlti'
import workApi from '@/apis/workApi';
import proposalApi from '@/apis/proposalApi'
import attachmentApi from '@/apis/attachmentApi';
import { useAttachments } from '@/services/useAttachment';
import userApi from '@/apis/userApi';

const { route, toast, router, enums } = useCommonUltilities()

const {attachments, getFileKey, confirmDeleteFile, removeFile} = useAttachments()
const tab = ref(null)

const isShowDialog = ref(false)
const isShowRating = ref(false)

const workId = route.params.workId
const workInfo = ref(null)
const getWorkInfo = async () => {
    let res = await workApi.getById(workId)
    if (res && res.status == 200) {
        workInfo.value = res.data
        getSuggestFreelancer()
        getFileKey(workInfo.value.id, enums.refType.JD)
        if (workInfo.value.freelancerId && workInfo.value.freelancerId != '00000000-0000-0000-0000-000000000000') {
            getProgress(workInfo.value)
            getProgressAttach(workInfo.value.id)
            getFreelancerId(workInfo.value.freelancerId)
        }
    }
}
getWorkInfo()

const proposalList = ref([])
const getProposalList = async () => {
    let res = await proposalApi.getProposalByWork(workId)
    if (res && res.status == 200) {
        proposalList.value = res.data
        if (!proposalList.value.length) {
            getSuggestFreelancer()
        }
        getProposalAttachs(proposalList.value)

    } 
}
const getProposalAttachs = async (proposalList) => {
    proposalList.forEach(async proposal => {
        proposal.attachments = []
        let res = await attachmentApi.getFileKeyByRef(proposal.id, enums.refType.proposal)
        if (res && res.status == 200) {
            let fileKeys = res.data
            fileKeys.forEach(async fileKey => {
                let fileObj = await getAttachment(fileKey)
                proposal.attachments.push(fileObj)
            });
        }
    });
}
getProposalList()

const message = (proposal) => {
    router.push({
        name: 'chatClient',
        query: {
            userId: proposal.freelancerId,
            workId: proposal.workId
        }
    })
}

const accept = async (proposal) => {
    router.push({
        name: 'newContract',
        query: {
            proposalId: proposal.id
        }
    })
}

const workProgress = ref(null)
const getProgress = async (workInfo) => {
    let res = await workApi.getWorkFreelancerDetail(workInfo.id, workInfo.freelancerId)
    if (res && res.status == 200) {
        workProgress.value = res.data
    }

}

const progressAttachments = ref([])
const getProgressAttach = async (refId) => {
    let res = await attachmentApi.getFileKeyByRef(refId, enums.refType.workProgress)
    if (res && res.status == 200) {
        let fileKeys = res.data
        fileKeys.forEach(async fileKey => {
            let fileObj = await getAttachment(fileKey)
            progressAttachments.value.push(fileObj)
        });
    }

}
const getAttachment = async (fileName) => {
    let res = await attachmentApi.getByKey(fileName)
    if (res && res.status == 200) {
        let fileObj = {
            href: URL.createObjectURL(res.data),
            fileName: fileName
        }
        return fileObj
    }
}

const confirmComplete = async () => {
    isShowDialog.value = false
    let res = await workApi.updateStatus(workInfo.value.id, enums.workStatus.completed)
    if (res && res.status == 200) {
        workInfo.value.status = enums.workStatus.completed
        toast.success('Cập nhật trạng thái thành công')
        isShowRating.value = true
        
    }
}

const freelancerInfo = ref({})
const getFreelancerId = async (freelancerId) => {
    let res = await userApi.getUserById(freelancerId)
    if (res && res.status == 200) {
        freelancerInfo.value = res.data
    }
}

const getWorkType = (workType) => {
	switch (workType) {
		case 0:
			return 'Online'
		case 1:
			return 'Offline'
		case 2:
			return 'Hybrid'
		default:
			return ''
	}
}

const suggestFreelancer = ref([])
const getSuggestFreelancer = async () => {
    let res = await userApi.getSuggestFreelancer(workInfo.value.workField, workInfo.value.fieldTag)
    if (res && res.status == 200) {
        suggestFreelancer.value = res.data
    }
}

</script>

<style scoped>
.proposal-item {
    border: 1px solid grey;
    padding: 8px;
}
.avatar-container {
    width: 75px ;
}
.title-col {
    min-width: 155px;
    line-height: 32px;
}
.work-progress > div {
    margin-bottom: 10px;
}
.v-chip-group .v-chip {
    margin: 0 8px 0 0;
}
.row-data {
    /* height: 32px; */
}
.data-col {
    line-height: 32px;
}
</style>