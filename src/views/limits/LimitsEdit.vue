<template>
    <div>
        <base-wrapper-component
            :shortText="true"
            :isShowButton="false"
        >
            <template #title
                ><span>Редактирование лимита</span>
                <span class="footnote_L c-gray mt-4 block">Задайте ограничения на стоимость билетов</span></template
            >
            <template #button>
                <span
                    class="flex f-center"
                    @click="backToLimitsList()"
                >
                    <icon-sprite
                        name="common--arrow_back"
                        className="icon__svg c-cornflower"
                    />
                    Ко всем лимитам
                </span>
            </template>
            <template #content>
                <div
                    class="mt-40"
                    v-if="preloader"
                >
                    <base-skeleton
                        v-for="index in 5"
                        :key="index"
                        class="mb-24"
                        skeleton-height="154px"
                    />
                </div>
                <limits-form
                    v-if="!preloader && Object.keys(formData).length"
                    :initialData="formData"
                    @submit="onSubmit"
                />
            </template>
        </base-wrapper-component>
    </div>
</template>
<script setup>
import LimitsForm from '@/components/limits/LimitsForm.vue'
import IconSprite from '@/components/interface/IconSprite.vue'
import BaseWrapperComponent from '@/components/ui/wrapper/BaseWrapperComponent.vue'
import BaseSkeleton from '@ui/BaseSkeleton.vue'
import { useEmployeeStore } from '@/store/employee'
import { useLimitsStore } from '@/store/limits'

import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'

const employeeStore = useEmployeeStore()

const store = useLimitsStore()
const { preloader, getSingleLimit } = storeToRefs(store)

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
})

const formData = ref({})

onMounted(async () => {
    await store.fetchLimitById(props.id)
    setFormValues(getSingleLimit.value)
})

async function fetchEmployeeData(singleLimit) {
    const employeeData = await Promise.all(
        singleLimit.employees.map(async (employee) => {
            const employeePosition = await employeeStore.fetchEmployeeData(employee.id)
            return {
                ...employee,
                positionName: employeePosition.position.name,
                departmentName: employeePosition.department.name,
            }
        }),
    )
    return employeeData
}
async function setFormValues(singleLimit) {
    const employeeData = await fetchEmployeeData(singleLimit)
    formData.value.expenseType = singleLimit.expenseType
    formData.value.serviceClass = singleLimit.serviceClass
    formData.value.stringAmount = String(singleLimit.amount).replace('.', ',')
    formData.value.amount = singleLimit.amount
    formData.value.traveller = employeeData
    formData.value.cityFrom = [{ ...singleLimit.start, nameRus: singleLimit.start?.name }]
    formData.value.cityTo = [{ ...singleLimit.finish, nameRus: singleLimit.finish?.name }]
    formData.value.departments = singleLimit.departments
}

const router = useRouter()

const backToLimitsList = () => {
    router.push({ name: 'limits' })
}

const onSubmit = async (formData) => {
    const employees = formData.traveller.map((item) => ({ id: item.id, type: 'employee' }))
    const departaments = formData.departments.map((item) => ({ id: item.id, type: 'department' }))

    const paiload = {
        expenseType: formData.expenseType,
        amount: formData.amount,
        serviceClass: formData.serviceClass,
        startId: formData.cityFrom[0].id,
        finishId: formData.cityTo[0].id,
        cntrStructureInfo: [...employees, ...departaments],
    }

    await store.putLimitById(paiload, props.id)
}
</script>

<style lang="scss" scoped></style>
