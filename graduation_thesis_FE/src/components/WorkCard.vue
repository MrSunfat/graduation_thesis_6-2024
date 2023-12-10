<template>
	<v-card class="mx-auto" max-width="544" >
		<v-card-item>
			<div>
				<div class="d-flex justify-space-between">
					<div class="text-overline">
						<div>{{ getWorkType(workInfo?.type) }} </div>
					</div>
					<div class="d-flex">
						<v-chip v-if="workInfo?.status == enums.workStatus.completed" 
							color="teal" text-color="white"  size="small">
							Đã hoàn thành
						</v-chip>
						<v-chip v-else-if="workInfo?.status == enums.workStatus.new" 
							color="blue-darken-2" text-color="white"  size="small">
							Mới
						</v-chip>
						<v-chip v-if="workInfo?.status == enums.workStatus.inProgress" 
							color="primary" text-color="white"  size="small">
							Đã giao 
						</v-chip>
						<v-menu>
							<template v-slot:activator="{ props }">
								<v-btn class="menu-btn" variant="plain" icon="mdi-dots-vertical" v-bind="props"></v-btn>
							</template>
							<v-list>
								<v-list-item class="menu-item" @click="editWork(workInfo)">
									<v-list-item-title>Sửa</v-list-item-title>
								</v-list-item>
								<v-list-item class="menu-item" @click="deleteWork(workInfo)">
									<v-list-item-title>Xoá
									</v-list-item-title>
								</v-list-item>
							</v-list>
						</v-menu>
					</div>
				</div>
				<div v-if="workInfo?.type != enums.workType.online && workInfo?.location">
					<v-icon icon="mdi-map-marker"></v-icon>
					<span>{{ workInfo?.location }}</span>
				</div>
				<div class="text-h5 mb-1">
					<router-link :to="{name: 'postDetail', params: {workId: workInfo?.id}}">
						{{ workInfo?.title }}
					</router-link>
				</div>
				<div class="text-caption">{{ workInfo?.description }}</div>
				<div><v-icon icon="mdi-cash"></v-icon>{{ formatCurrency(workInfo?.budget) }}</div>
				<v-chip-group>
					<v-chip v-for="field in fieldTag">{{ field }}</v-chip>
				</v-chip-group>
				<v-divider class="mt-2 mb-2"></v-divider>
				<div>Số lượt ứng tuyển: <b> {{ workInfo?.proposalCount }}</b></div>
			</div>
		</v-card-item>

	</v-card>
	
</template>

<script setup lang="ts">
import enums from '@/constants/enums';
import { ref } from 'vue';
import { formatCurrency } from '@/services';

const props = defineProps({
	workInfo: Object
})

const fieldTag = ref(JSON.parse(props.workInfo?.fieldTag))

const emit = defineEmits(['editWork', 'removeWork'])

const isShowDialog = ref(true)

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

const editWork = (workInfo: any) => {
	emit('editWork', workInfo)
}
const deleteWork = (workInfo: any) => {
	emit('removeWork', workInfo)
}

</script>
<style scoped>
.menu-item {
	cursor: pointer;
}

.menu-item:hover {
	background-color: rgb(207, 206, 206);
}

.menu-btn {
	height: 25px !important;
	width: 25px !important;
}
</style>