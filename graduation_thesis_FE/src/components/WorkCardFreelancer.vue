<template>
	<v-card class="mx-auto" max-width="644">
		<v-card-item>
			<div>
				<div class="d-flex justify-space-between">
					<div class="text-overline d-flex justify-start">
						<div>{{ getWorkType(workInfo?.type) }} </div>
						<div v-if="workInfo?.type != enums.workType.online && workInfo?.location" class="ml-2">
							<v-icon icon="mdi-map-marker"></v-icon>
							<span>{{ workInfo?.location }}</span>
						</div>
					</div>
					<div v-html="getWorkStatus(workInfo?.status)"></div>
				</div>
				<div class="d-flex justify-space-between">
					<div class="text-h5 mb-1" @click="viewWorkDetail(workInfo)">
						{{ workInfo?.title }}
					</div>
					<slot name="button">
						<v-btn color="#5865f2" :to="{name: 'workDetail', params: { workId: workInfo?.id }}" rounded="xl" variant="tonal">Ứng tuyển</v-btn>
					</slot>
				</div>
				<div class="text-caption">{{ workInfo?.description }}</div>
				<div v-if="isSuggestWork"><v-icon icon="mdi-cash"></v-icon>{{ formatCurrency(workInfo?.budget) }}</div>
				<v-chip-group>
					<v-chip v-for="field in fieldTag">{{ field }}</v-chip>
				</v-chip-group>
				<div v-if="isSuggestWork">Đã ứng tuyển: {{ workInfo?.proposalCount || 0 }}</div>
				<slot name="proposal"></slot>
			</div>
		</v-card-item>

	</v-card>
	
</template>

<script setup lang="ts">
import enums from '@/constants/enums';
import { ref } from 'vue';
import { formatCurrency } from '@/services'


const props = defineProps({
	workInfo: Object,
	isSuggestWork: {
		type: Boolean,
		default: true
	}
})

const fieldTag = ref(JSON.parse(props.workInfo?.fieldTag))

const emit = defineEmits(['editWork', 'removeWork', 'clickTitle'])

const getWorkType = (workType: number) => {
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

const getWorkStatus = (workStatus: number) => {
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

const viewWorkDetail = (workInfo: any) => {
	emit('clickTitle', workInfo)
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