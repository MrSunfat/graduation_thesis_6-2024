<template>
    <v-app-bar>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
        <v-app-bar-title>
            <div class="d-flex">
                <div @click="clickHome" class="logo">Gigify</div>
                <div v-if="authStore.loggedIn && authStore.isFreelancer()" class="nav-item ml-4">
                    Tìm việc
                    <v-menu activator="parent" open-on-hover open-on-click>
                        <v-list>
                            <v-list-item @click="clickProposal">Ứng tuyển</v-list-item>

                        </v-list>
                    </v-menu>
                </div>
                <div v-if="authStore.loggedIn && authStore.isFreelancer()" class="nav-item ml-4">
                    Công việc
                    <v-menu activator="parent" open-on-hover open-on-click>
                        <v-list>
                            <v-list-item @click="clickMyJob">Việc của tôi</v-list-item>
                            <v-list-item @click="clickContracts">Hợp đồng</v-list-item>
                        </v-list>
                    </v-menu>
                </div>
                <div v-if="authStore.loggedIn" @click="clickMessage" class="nav-item ml-4">Tin nhắn</div>
                <div v-if="messageSenderId" class="red-dot"></div>
            </div>
        </v-app-bar-title>
        <v-btn v-if="!authStore.loggedIn" class="" :to="{ name: 'login' }">Đăng nhập</v-btn>
        <v-btn v-if="!authStore.loggedIn" class="" color="primary" :to="{ name: 'signup' }">Đăng ký</v-btn>
        <v-avatar v-if="authStore.loggedIn" class="avatar">
            <v-img :src="authStore.userInfo.avatar || `https://ui-avatars.com/api/?name=${authStore.userInfo.name}`">
                <v-menu activator="parent">
                    <v-card>
                        <v-card-text>
                            <div class="mx-auto text-center">
                                <h2>{{ authStore.userInfo.name }}</h2>
                                <p class="text-caption mt-1">
                                    {{ authStore.isClient() ? 'Người tuyển dụng' : 'Freelancer' }}
                                </p>
                                <p class="text-caption mt-1">
                                    {{ authStore.userInfo.email }}
                                </p>
                                <v-divider class="my-3"></v-divider>
                                <v-btn rounded variant="text" :to="{name: 'updateProfile' }">
                                    Chỉnh sửa hồ sơ
                                </v-btn>
                                <v-divider class="my-3"></v-divider>
                                <v-btn rounded variant="text" :to="{name: 'profile', params: {userId: authStore.userInfo.id}}">
                                    Thông tin cá nhân
                                </v-btn>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-menu>
            </v-img>
        </v-avatar>
        <v-btn v-if="authStore.loggedIn" class="" color="primary" @click="signOut">Đăng xuất</v-btn>
    </v-app-bar>
</template>

<script setup lang="ts">
import router from '@/router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores';
import { HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr'
import { ref } from 'vue'

const authStore = useAuthStore()

const connection = new HubConnectionBuilder().withUrl(`${import.meta.env.VITE_BASE_URL}/chatHub`, {
    skipNegotiation: true,
    transport: HttpTransportType.WebSockets
}).withAutomaticReconnect().build()

const messageSenderId = ref('')
const initConnection = () => {
    let channel = 'Noti-message-' + authStore.userInfo?.id
    connection.on(channel, function (senderId) {
        messageSenderId.value = senderId
    })
}
const startConnection = () => {
    connection.start().then(() => {
        console.log('start');
    }).catch((error) => {
        console.log(error);
    })
}

if (authStore.userInfo?.id) {
    initConnection()
    startConnection()

}

const toast = useToast()
const clickHome = () => {
    router.push({ name: 'home' })
}
const clickMessage = () => {
    let senderId = messageSenderId.value
    messageSenderId.value = ''
    if (authStore.isClient()) {
        if (senderId) {
            router.push({ name: 'chatClient', query: {userId: senderId} })
        } else {
            router.push({ name: 'chatClient' })
        }
    } else if (authStore.isFreelancer()) {
        if (senderId) {
            router.push({ name: 'chatFreelancer', query: {userId: senderId} })
        } else {
            router.push({ name: 'chatFreelancer' })
        }
    }
}
const clickProposal = () => {
    router.push({ name: 'proposalList' })
}

const clickContracts = () => {
    router.push({ name: 'contractList' })
}
const clickMyJob = () => {
    router.push({ name: 'myWorks' })
}
const signOut = () => {
    authStore.logout()
    toast.success('Đăng xuất thành công')
    router.push({ name: 'home' })
}
</script>

<style scoped>
.logo {
    cursor: pointer;
    width: fit-content;
}

.nav-item {
    cursor: pointer;

}
.avatar {
    cursor: pointer;
}

.red-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: red;
}
</style>