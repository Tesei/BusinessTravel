<template>
    <base-wrapper-popup-animated
        :show="showDeleteModal"
        @close="closePopup"
    >
        <template #header>Удаление подразделения</template>
        <template #body>
            <div class="form-container">
                <h4 class="body_S">Удалить текущее подразделение? Отменить это действие будет невозможно</h4>
            </div>
        </template>
        <template #footer>
            <div class="flex ai-c jc-c w-100p">
                <base-button
                    class="bd c-red mr-32 form-container__btn"
                    :toShowLoading="isDepartmentsLoading"
                    @click="deleteDeparment"
                >
                    Удалить
                </base-button>
                <base-button
                    class="button_blue"
                    @click="closePopup"
                >
                    Отмена
                </base-button>
            </div>
        </template>
    </base-wrapper-popup-animated>
</template>

<script setup>
import BaseButton from '@ui/buttons/BaseButton.vue'
import BaseWrapperPopupAnimated from '@ui/wrapper/BaseWrapperPopupAnimated.vue'

import { storeToRefs } from 'pinia'
import { useDepartmentsStore } from '@/store/departments'

const store = useDepartmentsStore()
const { isDepartmentsLoading,  department, showDeleteModal } = storeToRefs(store)


const closePopup = () => {
    store.handleCloseDeletePopup()
}

const deleteDeparment = async () => {

    const res = await store.deleteDepartment(department.value?.id)
    
    if (res.status === 204) {
        closePopup()
        await store.fetchDepartmentsTree()
    }
}
</script>

<style lang="scss" scoped>
.form-container {
    width: 722px;
}
.form-container__btn {
    min-width: 133px;
}
</style>
