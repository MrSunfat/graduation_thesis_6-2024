<template>
    <div class="d-flex w-100 align-items-center justify-center">
        <v-col sm="8" md="5">
            <v-sheet class="pt-6" rounded>
                <v-card class="mx-auto px-6 py-8">
                    <v-form v-model="form" @submit.prevent="onSubmit" validate-on="input">
                        <v-text-field 
                            v-model="loginInfo.email" 
                            class="mb-2"
                            :rules="emailRules"
                            type="email"
                            clearable label="Email"></v-text-field>
                        <v-text-field v-model="loginInfo.password" 
                            type="password"
                            :rules="passwordRules"
                            clearable label="Mật khẩu"></v-text-field>
                        <div v-show="invalid" class="text-red">Thông tin đăng nhập không hợp lệ!</div>
                        <br>
                        <v-btn :disabled="!form" :loading="loading" block color="success" size="large" type="submit"
                            variant="elevated">
                            Đăng nhập
                        </v-btn>
                    </v-form>
                </v-card>
            </v-sheet>
        </v-col>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

const loginInfo = ref({})


watch(() => loginInfo,
    (newValue, oldValue) => {
        invalid.value = false
    },
    { deep: true })
const invalid = ref(false)
const loading = ref(false)
const form = ref(false)
const authStore = useAuthStore()
const router = useRouter()
const onSubmit = async () => {
    if (!form.value) return

    loading.value = true
    let res = await authStore.login({ email: loginInfo.value.email, password: loginInfo.value.password })
    loading.value = false
    if (res) {
        await router.push({ name: 'home' })
    } else {
        invalid.value = true
    }

}

const emailRules = ref([
    v => !!v || 'Email không được bỏ trống',
    v => (v && /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i.test(v)) || 'Email không hợp lệ',
])
const passwordRules = ref([
    v => !!v || 'Mật khẩu không được bỏ trống',
    v => (v && v.length >= 8) || 'Mật khẩu phải chứa ít nhất 8 ký tự',
])

const required = (v) => {
    return !!v
}
</script>

<style scoped></style>