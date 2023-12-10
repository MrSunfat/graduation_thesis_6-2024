<template>
    <div class="d-flex w-100 flex-column align-items-center mt-6">
        <v-card class="mx-auto pa-4" max-width="644" min-width="644">
            <div class="text-h5">Thông tin người dùng</div>
            <div class="d-flex align-items-center justify-space-between">
                <div class="d-flex mt-2">
                    <div class="avatar-container mr-3">
                        <img :src="userInfo.avatar || `https://ui-avatars.com/api/?name=${userInfo.name}`" class="rounded-circle" alt="" srcset=""/>
                    </div>
                    <div>
                        <div class="text-h6">{{ userInfo.name }} ({{ getUserType(userInfo.userType) }})</div>
                        <div>{{ userInfo.address }}</div>
                    </div>
                </div>
                <v-btn v-if="userInfo.id != authStore.userInfo.id" color="#5865f2" target="_blank" :to="{name: authStore.isClient() ? 'chatClient' : 'chatFreelancer', query: { userId: userInfo.id }}" 
                    rounded="xl" variant="tonal" class="mt-2">Nhắn tin</v-btn>
            </div>
            <div class="d-flex row-data">
                <div class="title-col">Email:</div>
                <div class="data-col">{{ userInfo.email }}</div>
            </div>
            <div class="d-flex row-data">
                <div class="title-col">Số điện thoại:</div>
                <div class="data-col">{{ userInfo.phone }}</div>
            </div>
            <div class="d-flex row-data">
                <div class="title-col">Ngày tạo tài khoản:</div>
                <div class="data-col">{{ formatDate(userInfo.createdDate) }}</div>
            </div>
            <div v-if="userInfo.userType == enums.userType.freelancer" class="mt-3">
                <div class="text-h6">Thông tin người tìm việc</div>
                <div class="d-flex row-data" v-if="userInfo.workField">
                    <div class="title-col">Lĩnh vực làm việc:</div>
                    <div class="data-col">{{ userInfo.workField }}</div>
                </div>
                <div class="d-flex row-data">
                    <div class="title-col">Vị trí công việc:</div>
                    <div class="data-col">{{ userInfo.jobTitle }}</div>
                </div>
                <div class="d-flex row-data">
                    <div class="title-col">Lời giới thiệu:</div>
                    <div class="data-col">{{ userInfo.description }}</div>
                </div>
                <div class="d-flex row-data">
                    <div class="title-col">Kỹ năng công việc:</div>
                    <v-chip-group>
                        <v-chip v-for="field in userInfo.skillTag">{{ field }}</v-chip>
                    </v-chip-group>
                </div>
            </div>

        </v-card>
        <v-card class="mx-auto pa-4 mt-4" max-width="644" min-width="644">
            <div class="text-h5">Lịch sử công việc</div>
            <div v-for="(work, index) in workInfo" :key="index">
                <v-divider v-if="index != 0" class="mt-3"></v-divider>
                <div class="d-flex row-data">
                    <div class="title-col">Tên công việc:</div>
                    <div class="data-col">{{ work.title }} (<span v-html="getWorkStatus(work.status)"></span>)</div>
                </div>
                <div class="d-flex row-data">
                    <div class="title-col">Mô tả công việc:</div>
                    <div class="data-col">{{ work.description }}</div>
                </div>
                <div class="d-flex row-data">
                    <div class="title-col">Loại công việc:</div>
                    <div class="data-col">{{ getWorkType(work.type) }}</div>
                </div>
                <div class="d-flex row-data">
                    <div class="title-col">Ngày đăng:</div>
                    <div class="data-col">{{ formatDate(work.createdDate) }}</div>
                </div>
            </div>
            <div v-if="!workInfo || workInfo.length === 0" class="mt-3">Chưa có lịch sử công việc</div>
        </v-card>
        <v-card class="mx-auto pa-4 mt-4 mb-6" max-width="644" min-width="644">
            <div class="text-h5">Lịch sử đánh giá</div>
            <div v-for="(review, index) in reviewInfo" :key="index">
                <v-divider v-if="index != 0" class="mt-3"></v-divider>
                <div class="d-flex row-data">
                    <div class="title-col">Người đánh giá:</div>
                    <a :href="`/profile/${review.reviewerId}`" target="_blank" class="data-col cursor-pointer">{{ review.reviewerName }}</a>
                </div>
                <div class="d-flex row-data">
                    <div class="title-col">Số sao:</div>
                    <v-rating
                        v-model="review.star"
                        bg-color="orange-lighten-1"
                        color="blue"
                        readonly
                    ></v-rating>
                </div>
                <div class="d-flex row-data">
                    <div class="title-col">Nội dung:</div>
                    <div class="data-col">{{ review.content }}</div>
                </div>
                <div class="d-flex row-data">
                    <div class="title-col">Công việc đánh giá:</div>
                    <div class="data-col">{{ review.workTitle }}</div>
                </div>
            </div>
            <div v-if="!reviewInfo || reviewInfo.length ===0" class="mt-3">Chưa có lượt đánh giá</div>
        </v-card>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import userApi from '@/apis/userApi';
import workApi from '@/apis/workApi';
import reviewApi from '@/apis/reviewApi';
import { useRoute, useRouter } from 'vue-router';
import enums from '@/constants/enums';
import { store } from '@/stores';

const authStore = store.useAuthStore()

const route = useRoute()
const router = useRouter()

const userId = route.params.userId
const userInfo = ref({})
const getUserInfo = async () => {
    let res = await userApi.getById(userId)
    if (res && res.status == 200) {
        userInfo.value = res.data
        try {
            userInfo.value.skillTag = JSON.parse(userInfo.value.skills) || []
            
        } catch {
            userInfo.value.skillTag = []
        }
    }
}

const workInfo = ref([])
const getWorkInfo = async () => {
    let res = await workApi.getWorkHistory(userId)
    if (res && res.status == 200) {
        workInfo.value = res.data
    }
}

const reviewInfo = ref([])
const getReviewHistory = async () => {
    let res = await reviewApi.getReviewHistory(userId)
    if (res && res.status == 200) {
        reviewInfo.value = res.data
    }
}

const getUserType = (userType) => {
    if (userType == enums.userType.client) return 'Người tuyển dụng'
    else if (userType == enums.userType.freelancer) return 'Người tìm việc'
    return ''
}

const getWorkStatus = (workStatus) => {
	switch (workStatus) {
		case enums.workStatus.new:
			return '<span style="color: rgb(21, 131, 221);">Mới</span>'
		case enums.workStatus.inProgress:
			return '<span style="color: rgb(213 201 32);">Đang làm</span>'
		case enums.workStatus.completed:
			return '<span style="color: rgb(31 199 45);">Đã hoàn thành</span>'
		case enums.workStatus.cancel:
			return '<span style="color: rgb(21, 131, 221);">Đã huỷ</span>'
		default:
			return '';
	}
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


getUserInfo()
getWorkInfo()
getReviewHistory()

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
.v-chip-group .v-chip {
    margin: 0 8px 0 0;
}
.v-rating  {
    height: 32px;
    align-items: center;
}
.cursor-pointer {
    cursor: pointer;
}
</style>