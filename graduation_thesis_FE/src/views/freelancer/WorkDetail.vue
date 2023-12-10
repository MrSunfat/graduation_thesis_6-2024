<template>
    <div class="d-flex w-100 align-items-center justify-center">
        <v-col sm="8" md="5">
            <div>
                <div class="text-h6">Thông tin công việc</div>
                <div class="d-flex row-data">
                    <div class="title-col">Tên công việc:</div>
                    <div class="data-col">{{ workInfo.title }}</div>
                </div>
                <div class="d-flex row-data">
                    <div class="title-col">Mô tả công việc:</div>
                    <div class="data-col">{{ workInfo.description }}</div>
                </div>
                <div class="d-flex row-data">
                    <div class="title-col">Loại công việc:</div>
                    <div class="data-col">{{ getWorkType(workInfo.type) }}</div>
                </div>
                <div class="d-flex row-data" v-if="workInfo.location">
                    <div class="title-col">Địa điểm làm việc:</div>
                    <div class="data-col">{{ workInfo.location }}</div>
                </div>
                <div class="d-flex row-data">
                    <div class="title-col">Lĩnh vực:</div>
                    <div class="data-col">{{ workInfo.workField }}</div>
                </div>
                <div class="d-flex row-data">
                    <div class="title-col">Thu nhập:</div>
                    <div class="data-col">{{ formatCurrency(workInfo.budget) }}</div>
                </div>

                <div class="d-flex row-data">
                    <div class="title-col">Yêu cầu kỹ năng:</div>
                    <v-chip-group>
                        <v-chip v-for="field in workInfo.fieldTagList">{{ field }}</v-chip>
                    </v-chip-group>
                </div>
                <div class="d-flex row-data">
                    <div class="title-col">Nhà tuyển dụng:</div>
                    <a :href="`/profile/${clientInfo.id}`" target="_blank" class="data-col">{{ clientInfo.name }}</a>
                </div>
                <div class="d-flex row-data">
                    <div class="title-col">Ngày đăng:</div>
                    <div class="data-col">{{ formatDate(workInfo.createdDate) }}</div>
                </div>
                <div class="d-flex row-data" v-if="attachments && attachments.length">
                    <div class="title-col">Tệp đính kèm:</div>
                    <a v-for="file in attachments" :href="file.href" :download="file.fileName">{{ file.fileName }}</a>
                </div>
            </div>

            <v-divider class="mt-4"></v-divider>
            <!-- proposal form -->
            <v-form v-model="form" @submit.prevent="onSubmit" validate-on="input" class="mt-4">
                <div class="text-h6 mb-2">Thông tin ứng tuyển</div>
                <v-text-field v-model="proposal.price" :readonly="loading" type="number" class="mb-2"
                        clearable label="Thu nhập mong muốn" suffix="VND"></v-text-field>

                <v-text-field v-model="proposal.content" :readonly="loading" :rules="requiredRule" class="mb-2"
                    clearable label="Lời ngỏ"></v-text-field>

                <v-file-input label="Tệp đính kèm" multiple v-model="addedFiles" prepend-icon="" append-icon="mdi-paperclip"></v-file-input>
                <v-btn :disabled="!form" :loading="loading" block color="success" size="large" type="submit"
                    variant="elevated">
                    Ứng tuyển
                </v-btn>
            </v-form>
        </v-col>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useCommonUltilities } from '@/services/commonUlti'
import proposalApi from '@/apis/proposalApi'
import workApi from '@/apis/workApi';
import { useAuthStore } from '@/stores/authStore';
const { enums, router, toast, route } = useCommonUltilities()
import attachmentApi from '@/apis/attachmentApi';
import { useAttachments } from '@/services/useAttachment';
import userApi from '@/apis/userApi';

const authStore = useAuthStore()
const requiredRule = ref([
    v => !!v || 'Thông tin không được bỏ trống'
])

const {attachments, getFileKey, addedFiles, uploadAll} = useAttachments()


const loading = ref(false)
const form = ref(false)
const workId = route.params.workId
const proposal = ref({})
const workInfo = ref({})
const clientInfo = ref({})

const getWorkInfo = async () => {
    let res = await workApi.getById(workId)
    if (res && res.status == 200) {
        workInfo.value = res.data
        try {
            workInfo.value.fieldTagList = JSON.parse(workInfo.value.fieldTag) || []
            
        } catch {
            workInfo.value.fieldTagList = []
        }
        let ress = await userApi.getById(workInfo.value.clientId)
        if (ress && ress.status == 200) {
            clientInfo.value = ress.data
        }
        getFileKey(workInfo.value.id, enums.refType.JD)
    }
}
getWorkInfo()


const onSubmit = async () => {
    if (!form.value) return
    proposal.value.id = crypto.randomUUID()
    proposal.value.workId = workInfo.value.id
    proposal.value.freelancerId = authStore.userInfo.id
    proposal.value.status = enums.proposalStatus.pending
    
    loading.value = true
    let res = await proposalApi.newProposal(proposal.value)
    loading.value = false
    if (res && res.status === 200) {
        // thanh cong
        uploadAll('proposal', proposal.value.id, enums.refType.proposal)
        toast.success('Gửi ứng tuyển thành công')
        await router.push({ name: 'freelancerView' })
    } else {
        toast.error(res.data.userMsg || 'Có lỗi xảy ra')
    }

    setTimeout(() => (loading.value = false), 2000)
}

const getWorkType = (workType) => {
	switch (workType) {
		case enums.workType.online:
			return 'Online'
		case enums.workType.offline:
			return 'Offline'
		case enums.workType.hybrid:
			return 'Hybrid'
		default:
			return ''
	}
}
</script>

<style scoped>
.title-col {
    width: 150px;
    line-height: 32px;
}
.data-col {
    line-height: 32px;
}
.row-data {
    margin-top: 4px;
    min-height: 32px;
}
</style>