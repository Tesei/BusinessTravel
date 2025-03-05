<template>
    <div class="flex flex-d-c">
        <h2 class="Heading_2 title">Раскрывающийся поиск</h2>
        <base-wrapper-expanded
            v-model="isActive"
            placeholder="Поиск командировок"
        >
            <base-search-expanded
                v-model:tripNumber="tripNumber"
                v-model:startDate="startDate"
                v-model:endDate="endDate"
                v-model:status="status"
                v-model:toDirectionId="toDirectionId"
                v-model:userType="userType"
                :status-list="statusObj"
                :user-type-list="userTypeList"
            ></base-search-expanded>
        </base-wrapper-expanded>
        <h2 class="Heading_2 title">Обычный поиск</h2>
        <BaseSearchSimple />
    </div>
</template>

<script setup>
import BaseWrapperExpanded from '@ui/wrapper/BaseWrapperExpanded.vue'
import BaseSearchExpanded from '@ui/search/BaseSearchExpanded.vue'
import BaseSearchSimple from '@ui/search/BaseSearchSimple.vue'
import { computed, ref } from 'vue'

const isActive = ref(true)
const tripNumber = ref('')
const startDate = ref('')
const endDate = ref('')
const status = ref('')
const toDirectionId = ref([])
const userType = ref('')

const tripsActiveTab = ref('Upcoming')

const statusObj = computed(() => {
    return hardTripsStatuses.value.folders
        .find((el) => el.name === tripsActiveTab.value)
        .tripStatuses.map((item) => statusesGuide[item])
})

const userTypeList = ref(['Я - создатель', 'Я - командируемый'])

const hardTripsStatuses = ref({
    totalCount: 0,
    folders: [
        {
            name: 'Upcoming',
            tripStatuses: ['Draft', 'InProgress', 'Rejected', 'Revoked'],
            count: 0,
        },
        {
            name: 'OnApproval',
            tripStatuses: ['Approval', 'Approved'],
            count: 0,
        },
        {
            name: 'Report',
            tripStatuses: ['Report', 'ExpenseApproval', 'RejectedReport'],
            count: 0,
        },
        {
            name: 'Complete',
            tripStatuses: ['Cancelled', 'Complete'],
            count: 0,
        },
    ],
})

const statusesGuide = {
    Draft: 'Черновик',
    InProgress: 'В командировке',
    Rejected: 'Отклонен',
    Revoked: 'Отозвана',
    Approval: 'На согласовании',
    Approved: 'Согласована',
    Report: 'Ожидает отчета',
    ExpenseApproval: 'Согласование доп. расходов',
    RejectedReport: 'Расход отклонен',
    Cancelled: 'Отменен',
    Complete: 'Завершен',
}
</script>

<style scoped lang="scss">
.title {
    margin-bottom: 40px;
    margin-top: 30px;
}
</style>
