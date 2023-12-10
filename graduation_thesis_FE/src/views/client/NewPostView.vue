<template>
    <div class="d-flex w-100 align-items-center justify-center">
        <v-col sm="8" md="5">
            <div class="text-h5">Đăng công việc mới</div>
            <v-alert v-show="showAlert" color="error" icon="$error" title="Có lỗi xảy ra"
                :text="errorMessage" closable></v-alert>
            <v-sheet class="pt-6 w-100" rounded>
                <v-card class="mx-auto px-6 py-8">
                    <v-form v-model="form" @submit.prevent="onSubmit" validate-on="input">
                        <v-text-field v-model="jobInfo.title" :readonly="loading" :rules="requiredRule" class="mb-2"
                            clearable label="Tiêu đề"></v-text-field>

                        <v-radio-group v-model="jobInfo.type" inline>
                            <template v-slot:label>
                                <div>Loại công việc</div>
                            </template>
                            <v-radio label="Online" :value="0"></v-radio>
                            <v-radio label="Offline" :value="1"></v-radio>
                            <v-radio label="Hybrid" :value="2"></v-radio>
                        </v-radio-group>

                        <v-text-field v-if="jobInfo.type == 1 || jobInfo.type == 2" 
                            v-model="jobInfo.location" 
                            :readonly="loading" 
                            :rules="requiredRule" 
                            class="mb-2"
                            clearable 
                            label="Địa chỉ"></v-text-field>

                        <v-combobox v-model="jobInfo.workField" :items="workerTypes" label="Đối tượng làm việc"></v-combobox>
                        <v-combobox v-model="jobInfo.fieldTagList" :items="skills" label="Kỹ năng công việc" multiple
                            chips></v-combobox>


                        <v-text-field v-model="jobInfo.budget" :readonly="loading" type="number" class="mb-2"
                        clearable label="Ngân sách" suffix="VND"></v-text-field>
                            
                        <v-textarea
                            counter
                            label="Mô tả"
                            :rules="requiredRule"
                            v-model="jobInfo.description"
                            >
                        </v-textarea>
                        <v-file-input label="Tệp đính kèm" multiple v-model="addedFiles" prepend-icon="" append-icon="mdi-paperclip"></v-file-input>
                        <br>

                        <v-btn :disabled="!form" :loading="loading" block color="success" size="large" type="submit"
                            variant="elevated">
                            Đăng bài
                        </v-btn>
                    </v-form>
                </v-card>
            </v-sheet>
        </v-col>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import skillList from '@/constants/skillList.js'
import workerType from '@/constants/workerType.js'
import workApi from '@/apis/workApi.js'
import attachmentApi from '@/apis/attachmentApi';
import { useAuthStore } from '@/stores/authStore';
import { useCommonUltilities } from '@/services/commonUlti'
import { useAttachments } from '@/services/useAttachment';

const { enums, router, toast } = useCommonUltilities()
const authStore = useAuthStore()
const skills = ref(skillList)
const workerTypes = ref(workerType)
const loading = ref(false)
const form = ref(false)


const jobInfo = ref({type: 0})
const showAlert = ref(false)
const errorMessage = ref('')

const requiredRule = ref([
    v => !!v || 'Thông tin không được bỏ trống'
])

const { addedFiles, uploadAll } = useAttachments()
const onSubmit = async () => {
    if (!form.value) return

    showAlert.value = false
    jobInfo.value.id = crypto.randomUUID()
    jobInfo.value.clientId = authStore.userInfo.id
    jobInfo.value.fieldTag = JSON.stringify(jobInfo.value.fieldTagList)
    jobInfo.value.status = enums.workStatus.new

    loading.value = true
    let res = await workApi.postWork(jobInfo.value)
    loading.value = false
    if (res && res.status === 200) {
        // thanh cong
        uploadAll('jd', jobInfo.value.id, enums.refType.JD)

        toast.success('Thêm công việc thành công')
        showAlert.value = false
        await router.push({ name: 'clientView' })
    } else {
        errorMessage.value = res.data.userMsg || res.data.userMsg
        showAlert.value = true
    }

    setTimeout(() => (loading.value = false), 2000)
}

</script>