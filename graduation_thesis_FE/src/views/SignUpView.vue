<template>
    <div class="d-flex w-100 align-items-center justify-center">
        <v-col sm="8" md="5">
            <v-alert v-show="showAlert" color="error" icon="$error" title="Có lỗi xảy ra"
                :text="errorMessage" closable></v-alert>
            <v-sheet class="pt-6 w-100" rounded>
                <v-card class="mx-auto px-6 py-8">
                    <v-form v-model="form" @submit.prevent="onSubmit" validate-on="input">
                        <v-text-field v-model="userInfo.name" :readonly="loading" :rules="requiredRule" class="mb-2"
                            clearable label="Họ và tên"></v-text-field>

                        <v-text-field v-model="userInfo.email" :readonly="loading" type="email" :rules="emailRules" class="mb-2"
                            clearable label="Email"></v-text-field>

                        <v-text-field v-model="userInfo.phone" :readonly="loading" :rules="phoneRules" class="mb-2"
                            clearable label="Số điện thoại"></v-text-field>

                        <v-text-field v-model="userInfo.address" :readonly="loading" :rules="requiredRule" class="mb-2"
                            clearable label="Địa chỉ"></v-text-field>

                        <v-text-field v-model="userInfo.password" :readonly="loading" :rules="passwordRules" class="mb-2"
                            type="password" clearable label="Mật khẩu"></v-text-field>

                        <v-text-field v-model="userInfo.password2" :readonly="loading" :rules="repasswordRules"
                            type="password" clearable label="Nhập lại mật khẩu"></v-text-field>

                        <v-radio-group v-model="userInfo.userType" inline>
                            <v-radio label="Tôi là khách hàng" :value="enums.userType.client"></v-radio>
                            <v-radio label="Tôi là freelancer" :value="enums.userType.freelancer"></v-radio>
                        </v-radio-group>

                        <div v-if="userInfo.userType == enums.userType.freelancer">
                            <v-combobox v-model="userInfo.workField" :items="workerTypes" label="Lĩnh vực làm việc"></v-combobox>
                            <v-text-field v-model="userInfo.jobTitle" :readonly="loading" :rules="[required]" class="mb-2"
                                clearable label="Chức danh"></v-text-field>
                            <v-text-field v-model="userInfo.description" :readonly="loading" :rules="[required]"
                                class="mb-2" clearable label="Giới thiệu bản thân"></v-text-field>
                            <v-combobox v-model="userInfo.skillList" :items="items" label="Kỹ năng công việc" multiple
                                chips></v-combobox>
                        </div>

                        <br>

                        <v-btn :disabled="!form" :loading="loading" block color="success" size="large" type="submit"
                            variant="elevated">
                            Đăng ký
                        </v-btn>
                    </v-form>
                </v-card>
            </v-sheet>
        </v-col>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import skillList from '@/constants/skillList.js'
import enums from '@/constants/enums';
import workerType from '@/constants/workerType.js'

const router = useRouter()
const authStore = useAuthStore()
const userInfo = ref({})
const items = ref(skillList)
const workerTypes = ref(workerType)
const loading = ref(false)
const form = ref(false)
const showAlert = ref(false)
const errorMessage = ref('')

const onSubmit = async () => {
    if (!form.value) return
    if (userInfo.value.userType == enums.userType.freelancer && userInfo.value.skillList) {
        userInfo.value.skills = JSON.stringify(userInfo.value.skillList)
    } else {
        userInfo.value.skills = JSON.stringify([])
    }
    loading.value = true
    userInfo.value.id = crypto.randomUUID()
    let res = await authStore.signUp(userInfo.value)
    loading.value = false
    if (res && res.status === 200) {
        // thanh cong
        showAlert.value = false
        await router.push({ name: 'login' })
    } else {
        errorMessage.value = res.data.devMsg
        showAlert.value = true
    }

    setTimeout(() => (loading.value = false), 2000)
}
const requiredRule = ref([
    v => !!v || 'Thông tin không được bỏ trống'
])
const emailRules = ref([
    v => !!v || 'Email không được bỏ trống',
    v => (v && /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i.test(v)) || 'Email không hợp lệ',
])
const passwordRules = ref([
    v => !!v || 'Mật khẩu không được bỏ trống',
    v => (v && v.length >= 8) || 'Mật khẩu phải chứa ít nhất 8 ký tự',
])
const repasswordRules = ref([
    v => !!v || 'Mật khẩu không được bỏ trống',
    v => (v == userInfo.value.password) || 'Mật khẩu không khớp'
])
const phoneRules = ref([
    v => !!v || 'Số điện thoại không được bỏ trống',
    v => (v && /(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(v)) || 'Số điện thoại không hợp lệ'
])
const required = (v) => {
    return !!v
}
</script>

<style scoped></style>