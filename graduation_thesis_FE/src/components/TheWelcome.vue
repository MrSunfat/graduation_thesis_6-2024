<template>
    <v-btn @click="call">call</v-btn>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import userApi from '@/apis/userApi'
import { useAuthStore } from '@/stores/authStore'
import router from '@/router';
const authStore = useAuthStore()
onMounted(() => {
    if (authStore.loggedIn) {
        if (authStore.isClient()) {
            router.push({name: 'clientView'})
        } else if (authStore.isFreelancer()) {
            router.push({name: 'freelancerView'})
        }
    }
})
const call = async () => {
    let res = await userApi.getAll()
    console.log(res);
}
</script>

