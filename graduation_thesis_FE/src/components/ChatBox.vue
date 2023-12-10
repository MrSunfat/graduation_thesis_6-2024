<template>
    <div class="w-100 d-flex chat-view" @mouseup="endResize">
        <div class="user-list mt-3 flex-column" :style="{width: `${userListWidth}%`}">
            <div v-for="(user, index) in listUser" :key="index"  
                class="user-item pt-1 pb-1" :class="{'active-chat': user.id == receiverId}" 
                @click="selectChat(user)">
                <v-list-item :prepend-avatar="`https://ui-avatars.com/api/?name=${user.name}`">
                    <template v-slot:title>
                        {{user.name}}
                    </template>
                    <template v-slot:subtitle>
                        <span></span>
                    </template>

                </v-list-item>
            </div>
        </div>
        <v-divider vertical :thickness="4" class="divider" @mousedown="startResize"></v-divider>
        <div id="chat-section-id" class="chat-section flex-column d-flex" :style="{width: `calc(100% - ${userListWidth}%)`}">
            <div v-if="receiverInfo" class="chat-info d-flex align-center">
                <img :src="receiverInfo.avatar || `https://ui-avatars.com/api/?name=${receiverInfo.name}`" 
                    class="rounded-circle h-75 mr-2 ml-2" alt="" srcset=""/>
                <a :href="`/profile/${receiverInfo.id}`" target="_blank" class="text-h6">{{ receiverInfo.name }}</a>
            </div>
            <div id="message-history-id" class="message-history" ref="messageSection" @scroll="onScrollMessage">
                <div >
                    <div style="text-align: center;" v-show="showLoadingChat">
                        <v-progress-circular
                            indeterminate
                            color="primary"
                            style="margin: auto;"
                            >
                        </v-progress-circular>
                    </div>
                    <div class="d-flex flex-column" v-for="(message, index) in messageList" :key="index">
                        <div class="message-group" 
                        :class="{'my-message-group': message.senderId == senderId, 'their-message-group': message.senderId == receiverId}">
                            <div class="message">
                                {{ message.content }}
                                <v-tooltip activator="parent">
                                    {{ handleDateTime(message.createdDate) }}
                                </v-tooltip>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="receiverInfo" class="d-flex align-center chat-input">
                <v-textarea v-model="messageText" class="" placeholder="Nhập tin nhắn" 
                    @keyup.enter.prevent="sendMessage" auto-grow rows="1"
                    variant="solo"></v-textarea>
                <v-btn density="comfortable" class="ml-4 mr-4" icon="mdi-send-variant" @click="sendMessage"></v-btn>
            </div>
    

        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, nextTick, type Ref } from 'vue';
import { useCommonUltilities } from '@/services/commonUlti';
import { useAuthStore } from '@/stores/authStore';
import { HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr'
import messageApi from '@/apis/messageApi';
import userApi from '@/apis/userApi';
import type { UserInfoType } from '@/types/Commons/UserInfoType';   

const { route } = useCommonUltilities()
const authStore = useAuthStore()

const showLoadingChat = ref(false)
const onScrollMessage = (e: any) => {
    if (e.target.scrollTop == 0) {
        getChatHistory()
    }
}

const connection = new HubConnectionBuilder().withUrl(`${import.meta.env.VITE_BASE_URL}/chatHub`, {
    skipNegotiation: true,
    transport: HttpTransportType.WebSockets
}).withAutomaticReconnect().build()
const messageList: Ref<any[]> = ref([])
const messageText = ref('')
const senderId = ref(authStore.userInfo.id)
const receiverId: Ref<any> = ref(route.query.userId)
const receiverInfo: Ref<UserInfoType | null> = ref(null)

let limit = 20
let offset = 0
const selectChat = async (user: any) => {
    receiverInfo.value = user
    receiverId.value = user?.id
    messageList.value = []
    await getChatHistory()
    await nextTick()
    scrollToBottom('message-history-id')
    if (channel.value) {
        connection.off(channel.value)
    }
    await connection.stop()
    initConnection()
    startConnection()
}
const channel = ref('')
const initConnection = () => {
    channel.value = 'Message-' + senderId.value + '/' + receiverId.value 
    connection.on(channel.value, function (message) {
        messageList.value.push(message)
    })
}
const startConnection = () => {
    connection.start().then(() => {
        console.log('start');
    }).catch((error) => {
        console.log(error);
    })
}

const scrollToBottom = (id: any) => {
    const element: any = document.getElementById(id);
    element.scrollTop = element?.scrollHeight;
}

const sendMessage = async () => {
    try {
        if (messageText.value) {
            messageText.value = messageText.value.replace(/(\r\n|\n|\r)/gm, "")
            let workId = route.query.workId
            await connection.invoke("SendMessage", messageText.value, senderId.value, receiverId.value, workId)
            messageText.value = ''
            scrollToBottom('message-history-id')
        }
        
    } catch (error) {
        console.log(error);
        messageText.value = ''
    }
}

const getChatHistory = async () => {
    showLoadingChat.value = true
    let res = await messageApi.getChatHistory(senderId.value, receiverId.value, limit, offset)
    showLoadingChat.value = false
    if (res.status == 200 && res.data.length) {
        offset += limit
        messageList.value.unshift(...res.data)
    } else {

    }

}

const listUser: Ref<UserInfoType[]> = ref([])
const getListUserMessage = async (userId: any) => {
    let res = await messageApi.getUserMessage(userId)
    if (res.status == 200) {
        listUser.value = res.data 
    } else {
        listUser.value = []
    }  
}
getListUserMessage(senderId.value).then(async () => {
    if (receiverId.value) { 
        let foundUser = listUser.value.find(user => user.id == receiverId.value)
        if(!foundUser) {
            let userInfoRes = await userApi.getById(receiverId.value)
            if (userInfoRes.status == 200) {
                listUser.value.unshift(userInfoRes.data)
                selectChat(userInfoRes.data)
            }
        } else {
            selectChat(foundUser)
        }
    }
})



const userListWidth: Ref<any> = ref(25)
const handleResize = (e: any) => {
    const percentage = (e.pageX / window.innerWidth) * 100

    // if (percentage >= 10 && percentage <= 90) {
        userListWidth.value = percentage.toFixed(2)
    // }
}
const startResize = () => {
    document.addEventListener('mousemove', handleResize)
}
const endResize = () => {
    document.removeEventListener('mousemove', handleResize)
}

const handleDateTime = (isoDatetime: any) => {
    let dateTime = new Date(isoDatetime)
    return dateTime.toLocaleString('vi')
}
</script>

<style scoped lang="scss">
.chat-view {
    height: calc(100vh - 64px);
}
.user-list {
    min-width: 250px;
}
.user-item {
    border-radius: 12px;

}
.user-item :hover {
    cursor: pointer;
    background-color: rgb(209, 208, 208);
}
.active-chat {
    background-color: rgb(221, 220, 220);
}
.chat-section {
    flex-grow: 1;
    min-width: 50%;
    overflow-x: hidden;
}
.divider {
    cursor: ew-resize;
}
.message-history {
    overflow-y: scroll;
    flex-grow: 1;
    padding: 8px;
}
.chat-input {
    height: 60px;
    padding: 8px 0;
    position: sticky;
    bottom: 0;
    background-color: white;
}
:deep(.v-input__details) {
    display: none;
}
.my-message-group {
    align-self: flex-end;
    .message {
        background-color: rgb(7, 145, 7);
        color: white;
    }
}
.their-message-group {
    align-self: flex-start;
    .message {
        background-color: rgb(209, 208, 208);
    }
}
.message-group {
    max-width: 60%;
}
.message {
    margin-top: 2px;
    padding: 4px 12px;
    border-radius: 16px;
}
.chat-info {
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 99;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 4px 0px;
}
.loading {
    display: flex;
    justify-content: space-between;
}
</style>