<template>
    <v-dialog v-model="props.isShow" width="auto" persistent class="">
        <v-card class="pa-4">
            <div class="d-flex justify-end">
                <v-icon icon="mdi-close" @click="close"></v-icon>
            </div>
            <div class="d-flex flex-column">
                <v-card width="400">
                    <v-card-item>
                        <v-card-title>{{ workDetail?.title }}</v-card-title>
                        
                        <v-card-subtitle>{{ workDetail?.description }}</v-card-subtitle>

                        <div>
                            <div class="title-col">Tài liệu công việc:</div>
                            <div v-for="file in attachmentsWork">
                                <a :href="file.href" :download="file.fileName">{{ file.fileName }}</a>
                            </div>
                        </div>
                    </v-card-item>
                    <hr>
                    <v-card-text>
                        
                        <div class="d-flex">
                            <div class="title-col">Tiến độ:</div>
                            <div>{{ workDetail?.progress }}%</div>
                            <v-icon icon="mdi-pencil" class="ml-1" @click="toggleSlider" v-if="workDetail?.status != enums.workStatus.completed"></v-icon>
                        </div>
                        <v-slider
                            v-show="isShowSlider"
                            v-model="workDetail?.progress"
                            class="align-center"
                            :max="100"
                            :min="0"
                            :step="1"
                            hide-details
                        ></v-slider>
                        <div class="d-flex mt-2">
                            <div class="title-col">Loại công việc:</div>
                            <div>{{ getWorkType(workDetail?.type) }}</div>
                        </div>
                        <div class="d-flex mt-2">
                            <div class="title-col">Thu nhập đề xuất:</div>
                            <div>{{ formatCurrency(workDetail?.budget) }}</div>
                        </div>
                        <div class="d-flex mt-2">
                            <div class="title-col">Thu nhập thoả thuận:</div>
                            <div>{{ formatCurrency(workDetail?.expectedIncome) }}</div>
                        </div>
                        <div class="d-flex mt-2">
                            <div class="title-col">Ngày bắt đầu:</div>
                            <div>{{ formatDate(workDetail?.startDate) }}</div>
                        </div>
                        <div class="d-flex mt-2">
                            <div class="title-col">Ngày kết thúc:</div>
                            <div>{{ formatDate(workDetail?.endDate) }}</div>
                        </div>
                        <div v-if="attachments && attachments.length" class="d-flex mt-2">
                            <div class="title-col">Tệp đính kèm:</div>
                            <div>
                                <div v-for="file in attachments" class="d-flex align-center">
                                    <a :href="file.href" :download="file.fileName">{{ file.fileName }}</a>
                                    <v-icon v-if="workDetail?.status != enums.workStatus.completed" icon="mdi-delete" class="delete-icon" title="Xoá tệp" @click="removeFile(file)"></v-icon>
                                </div>
                            </div>
                        </div>
                        <v-file-input class="mt-2" v-if="workDetail?.status != enums.workStatus.completed" label="Tệp đính kèm" multiple v-model="addedFiles" prepend-icon="" append-icon="mdi-paperclip"></v-file-input>
                    </v-card-text>
                </v-card>
                <v-btn color="primary" :disabled="workDetail?.status == enums.workStatus.completed" @click="save" block>Lưu</v-btn>
                <div></div>
            </div>
        </v-card>
    </v-dialog>
</template>
<script setup lang="ts">
import enums from '@/constants/enums';
import { ref, type Ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useCommonUltilities } from '@/services/commonUlti';
import { useAttachments } from '@/services/useAttachment';
import workApi from '@/apis/workApi'
import attachmentApi from '@/apis/attachmentApi';
import { formatCurrency, formatDate } from '@/services';

const {toast, router} = useCommonUltilities()
const authStore = useAuthStore()
const props = defineProps({
    workDetail: Object,
    isShow: {
        type: Boolean,
        default: false
    }
})

const isShowSlider = ref(false)
const toggleSlider = () => {
    isShowSlider.value = !isShowSlider.value
}

const emit = defineEmits(['confirm', 'update:isShow', 'close'])

const close = () => {
    emit('close')
}

const { attachments, getFileKey, removeFile, confirmDeleteFile,
        addedFiles, uploadAll } = useAttachments()

const getAttachments = () => {
    attachments.value = []
    getFileKey(props.workDetail?.id, enums.refType.workProgress)
}



const attachmentsWork: Ref<any[]> = ref([])
const getAttachmentWork = async () => {
    attachmentsWork.value = []
    let res = await attachmentApi.getFileKeyByRef(props.workDetail?.id, enums.refType.JD)
    if (res && res.status == 200) {
        let fileKeys = res.data
        fileKeys.forEach(async (fileName: any) => {
            let res = await attachmentApi.getByKey(fileName)
            if (res && res.status == 200) {
                let fileObj = {
                    href: URL.createObjectURL(res.data),
                    fileName: fileName
                }
                attachmentsWork.value.push(fileObj)
            }
        });
    }
}

defineExpose({
    getAttachments, getAttachmentWork
})

const save = async () => {
    confirmDeleteFile()
    await uploadAll('workProgress', props.workDetail?.id, enums.refType.workProgress)
    addedFiles.value = []
    let res = await workApi.updateProgress(props.workDetail?.id, props.workDetail?.progress)
    if (res && res.status == 200) {
        toast.success('Cập nhật tiến độ thành công.')
        close()
    }
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

const getWorkType = (workType: number) => {
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
</script>

<style scoped>
.contract-info div {
    margin-bottom: 8px;
}
.buttons > * {
    margin-bottom: 8px;
}
.title-col {
    min-width: 150px;
}
.delete-icon {
    cursor: pointer;
}
</style>