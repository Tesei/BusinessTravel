<template>
    <div>
        <div v-show="preloader">
            <base-skeleton
                v-for="index in 4"
                :key="index"
                class="mb-24"
                skeleton-height="154px"
            />
        </div>
        <base-wrapper-component
            v-show="!preloader"
            :shortText="true"
            :isShowButton="false"
        >
            <template #title
                ><span>Создание лимита</span>
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
                <limits-form @submit="onSubmit" />
            </template>
        </base-wrapper-component>
    </div>
</template>
<script setup>
import LimitsForm from '@/components/limits/LimitsForm.vue'
import IconSprite from '@/components/interface/IconSprite.vue'
import BaseWrapperComponent from '@/components/ui/wrapper/BaseWrapperComponent.vue'
import BaseSkeleton from '@ui/BaseSkeleton.vue'

import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useLimitsStore } from '@/store/limits'

const store = useLimitsStore()
const { preloader } = storeToRefs(store)

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

    await store.createLimit(paiload)
}
</script>

<style lang="scss" scoped></style>
