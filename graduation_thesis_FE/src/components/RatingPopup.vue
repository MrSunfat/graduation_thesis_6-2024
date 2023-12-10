<template>
    <v-dialog v-model="props.isShow" width="auto" persistent class="">

        <v-card class="pa-4">
            <v-card-title>
                Đánh giá {{ getUserType() }}
            </v-card-title>
            <v-list-item :prepend-avatar="`https://ui-avatars.com/api/?name=${userInfo?.name}`">
                <template v-slot:title>
                    {{userInfo?.name}}
                </template>
                <template v-slot:subtitle>
                    <span>{{ userInfo?.email }}</span>
                </template>

            </v-list-item>
            <v-rating
                v-model="rating"
                bg-color="orange-lighten-1"
                color="blue"
            ></v-rating>
            <v-text-field placeholder="Nhập nội dung" v-model="content" required></v-text-field>
            <v-card-actions class="justify-end">
                <v-btn color="primary" @click="closeDialog">Đóng</v-btn>
                <v-btn color="primary" @click="confirm">Đánh giá</v-btn>

            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import reviewApi from '@/apis/reviewApi';
import enums from '@/constants/enums';
import { useCommonUltilities } from '@/services/commonUlti';
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore()
const { toast, router } = useCommonUltilities()
const props = defineProps({
    userInfo: Object,
    isShow: {
        type: Boolean,
        default: false
    },
    workId: String
})
const emit = defineEmits(['update:isShow'])

const closeDialog = () => {
    emit('update:isShow', false)
}

const rating = ref(3)
const content = ref('')
const confirm = async () => {
    if (rating.value && rating.value !== 0) {
        if (!content.value) {
            toast.warning('Vui lòng nhập nội dung đánh giá')
            return
        }
        let review = {
            id: crypto.randomUUID(),
            reviewerId: authStore.userInfo.id,
            revieweeId: props.userInfo?.id,
            content: content.value,
            star: rating.value,
            workId: props.workId
        }
        let res = await reviewApi.addReview(review)
        if (res && res.status == 200) {
            closeDialog()
            toast.success('Đánh giá người dùng thành công')
            router.push({name: 'home'})
        }
    }
}

const getUserType = () => {
    if (props.userInfo?.type == enums.userType.client) {
        return 'Khách hàng'
    } else {
        return 'Freelancer'
    }
}

</script>