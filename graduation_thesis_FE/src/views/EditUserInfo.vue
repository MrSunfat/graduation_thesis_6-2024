<template>
    <div class="d-flex w-100 align-items-center justify-center">
        <v-col sm="8" md="5">
            <div class="text-h5">Cập nhật thông tin cá nhân</div>
            <v-sheet class="pt-6 w-100" rounded>
                <v-card class="mx-auto px-6 py-8">
                    <v-form v-model="form" @submit.prevent="onSubmit" validate-on="input">
                        <v-text-field v-model="userInfo.name" :readonly="loading" :rules="requiredRule" class="mb-2"
                            clearable label="Tên"></v-text-field>
                        <v-text-field v-model="userInfo.email" :readonly="loading" disabled :rules="requiredRule" class="mb-2"
                            clearable label="Email"></v-text-field>

                        <v-text-field v-model="userInfo.phone" :readonly="loading" :rules="phoneRules" class="mb-2"
                            clearable label="Số điện thoại"></v-text-field>
                        <v-text-field v-model="userInfo.identityNumber" :readonly="loading" :rules="numberRules" class="mb-2"
                            clearable label="Căn cước công dân"></v-text-field>
                        <v-text-field v-model="userInfo.bankName" :readonly="loading" :rules="requiredRule" class="mb-2"
                            clearable label="Ngân hàng"></v-text-field>
                        <v-text-field v-model="userInfo.bankNumber" :readonly="loading" :rules="numberRules" class="mb-2"
                            clearable label="Số tài khoản"></v-text-field>

                        <v-text-field 
                            v-model="userInfo.address" 
                            :readonly="loading" 
                            :rules="requiredRule" 
                            class="mb-2"
                            clearable 
                            label="Địa chỉ"></v-text-field>

                        <div v-if="userInfo.userType == enums.userType.freelancer">
                            <v-text-field v-model="userInfo.jobTitle" :readonly="loading" :rules="[required]" class="mb-2"
                                clearable label="Chức danh"></v-text-field>
                            <v-text-field v-model="userInfo.description" :readonly="loading" :rules="[required]"
                                class="mb-2" clearable label="Giới thiệu bản thân"></v-text-field>
                            <v-combobox v-model="userInfo.workField" :items="workerTypes" label="Lĩnh vực làm việc"></v-combobox>
                            <v-combobox v-model="userInfo.skillList" :items="items" label="Kỹ năng công việc" multiple
                                chips></v-combobox>
                        </div>

                        <div v-if="attachments && attachments.length">
                            <v-label>Tệp đính kèm</v-label>
                            <div v-for="file in attachments" class="d-flex justify-space-between">
                                <a :href="file.href" :download="file.fileName">{{ file.fileName }}</a>
                                <v-icon icon="mdi-delete" class="delete-icon" title="Xoá tệp" @click="removeFile(file)"></v-icon>
                            </div>
                        </div>
                        <v-file-input class="mt-2" label="Thêm đính kèm" multiple v-model="addedFiles" prepend-icon="" append-icon="mdi-paperclip"></v-file-input>
                        <br>

                        <v-btn :loading="loading" block color="success" size="large" type="submit"
                            variant="elevated">
                            Cập nhật
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
import { useAuthStore } from '@/stores/authStore';
import userApi from '@/apis/userApi';
import { useCommonUltilities } from '@/services/commonUlti'
import { useAttachments } from '@/services/useAttachment';
import workerType from '@/constants/workerType.js'

const workerTypes = ref(workerType)
const { route, router, toast, enums } = useCommonUltilities()
const authStore = useAuthStore()

const { attachments, getFileKey, removeFile, confirmDeleteFile,
        addedFiles, uploadAll } = useAttachments()

const items = ref(skillList)
const loading = ref(false)
const form = ref(true)

const userInfo = ref({})
const getUserInfo = async (id) => {
    let res = await userApi.getById(id)
    if (res && res.status == 200) {
        userInfo.value = res.data
        userInfo.value.skillList = JSON.parse(res.data.skills)
        getFileKey(userInfo.value.id, enums.refType.userInfo)
    }
}
getUserInfo(authStore.userInfo.id)

const requiredRule = ref([
    v => !!v || 'Thông tin không được bỏ trống'
])

const onSubmit = async () => {
    if (!form.value) return
    confirmDeleteFile()
    uploadAll('userInfo', userInfo.value.id, enums.refType.userInfo)
    userInfo.value.skills = JSON.stringify(userInfo.value.skillList)

    loading.value = true
    let res = await userApi.updateUserInfo(userInfo.value.id, userInfo.value)
    loading.value = false
    if (res && res.status === 200) {
        // thanh cong
        toast.success('Cập nhật thông tin thành công')
        if (authStore.isClient()) {
            await router.push({ name: 'clientView' })
        } else {
            await router.push({ name: 'freelancerView' })
        }
    } else {
        toast.error(res.data.userMsg || 'Có lỗi xảy ra')
    }

    setTimeout(() => (loading.value = false), 2000)
}

const phoneRules = ref([
    v => !!v || 'Số điện thoại không được bỏ trống',
    v => (v && /(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(v)) || 'Số điện thoại không hợp lệ'
])
const numberRules = ref([
    v => !!v || 'Thông tin không được bỏ trống',
    v => (v && /^[0-9]*$/.test(v)) || 'Thông tin phải chỉ chứa số'
])

</script>