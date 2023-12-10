<template>
    <div class="d-flex w-100 align-items-center justify-center" style="height: calc(100vh - 64px);">
        <div class="d-flex flex-row w-100 justify-space-evenly pt-6" style="overflow-y: auto;" @scroll="onScroll">
            <v-sheet class="w-50">
                <div v-if="workList && workList.length">
                    <div v-for="work in workList">
                        <work-card-freelancer :work-info="work" class="mb-2">
                        </work-card-freelancer>
                    </div>
                </div>
                <div v-else>Không có dữ liệu</div>
            </v-sheet>
            <v-card class="w-25 filter">
                <v-select
                    label="Loại công việc"
                    v-model="filter.type"
                    :items="workTypeList"
                    item-title="title"
                    item-value="value"
                ></v-select>
                <div>Khoảng thu nhập</div>
                <div class="d-flex">
                    <v-text-field v-model="minRange" class="max-range" type="number"></v-text-field>
                    <v-range-slider
                        v-model="filter.range"
                        :max="maxRange"
                        :min="minRange"
                        :step="1000"
                        thumb-label="always"
                    ></v-range-slider>
                    <v-text-field v-model="maxRange" class="max-range" type="number"></v-text-field>
                </div>
                <v-combobox v-model="filter.workField" :items="workerTypes" label="Lĩnh vực công việc"></v-combobox>
                <v-combobox v-model="filter.skillList" :items="skills" label="Kỹ năng công việc" multiple
                    chips></v-combobox>
                <v-text-field v-model="filter.searchQuery" 
                    placeholder="Tìm kiếm theo công việc, địa chỉ">
                </v-text-field>

                <div class="d-flex justify-end ">
                    <v-btn @click="updateWorkFilter" color="success">Lọc</v-btn>

                </div>
            </v-card>
        </div>
    </div>
</template>

<script setup>
import WorkCardFreelancer from '@/components/WorkCardFreelancer.vue';
import { ref } from 'vue';
import { useCommonUltilities } from '@/services/commonUlti'
import { useAuthStore } from '@/stores/authStore';
import { useLoadingStore } from '@/stores/loadingStore';
import workApi from '@/apis/workApi';
import skillList from '@/constants/skillList.js'
import workerType from '@/constants/workerType.js'


workerType.unshift('Tất cả')
const workerTypes = ref(workerType)
const skills = ref(skillList)
const { toast, router, enums } = useCommonUltilities()
const authStore = useAuthStore()
const loadingStore = useLoadingStore()
const workList = ref([])


const onScroll = (e) => {
    if (e.target.scrollTop >= e.target.offsetHeight) {
        console.log('bottom');
    }
}
const filter = ref({
    type: -1,
    searchQuery: '',
    range: [],
    skillList: [],
    workField: ''
})

const getSuggestWork = async (workFilter = null) => {
    if (!workFilter) {
        workFilter = {}
        workFilter.skillList = JSON.parse(authStore.userInfo.skills) ?? []
        workFilter.searchQuery = ''
        workFilter.type = -1
        workFilter.range = []
        workFilter.workField = authStore.userInfo.workField || ''
    } else if (workFilter.workField == 'Tất cả') {
        workFilter.workField = ''
    }
    loadingStore.setLoading(true)
    let res = await workApi.getWorkForFreelancer(authStore.userInfo.id, workFilter)
    loadingStore.setLoading(false)
    if (res && (res.status == 200 || res.status == 204)) {
        workList.value = res.data
    }
}
getSuggestWork()

const workTypeList = ref([
    {title: 'Tất cả', value: -1},
    {title: 'Offline', value: enums.workType.offline},
    {title: 'Online', value: enums.workType.online},
    {title: 'Hybrid', value: enums.workType.hybrid},
])
const updateWorkFilter = () => {
    getSuggestWork(filter.value)
}

const maxRange = ref(9999999)
const minRange = ref(10000)



</script>

<style scoped>
.filter {
    height: fit-content;
    width: 300px;
    padding: 8px;
}
.max-range {
    max-width: 100px;
}
</style>