<template>
    <form @submit.prevent="handleSubmit">
        <base-input
            class="mb-24"
            placeholder="Код должности"
            :isRequired="false"
            v-model="formData.code"
            maxlen="128"
        />
        <base-input
            class="mb-24"
            placeholder="Наименование должности"
            :isRequired="true"
            v-model="formData.name"
            maxlen="128"
        />
        <base-textarea
            class="mb-24 textarea"
            maxlen="256"
            placeholder="Описание должности"
            v-model="formData.description"
        />

        <base-select
            type="big"
            label="Подразделение"
            with-dropdown
            v-model="isActiveDepartment"
            :value="departmentsValue"
        >
            <base-dropdown-with-api
                v-if="isActiveDepartment"
                position-y="bottom"
                placeholder="Департамент"
                search-type="departments"
                not-data-title="Сотрудники не найдены"
                v-model:isActive="isActiveDepartment"
                v-model:activeItems="formData.departments"
                :multipleSelection="false"
                :line-count="5"
            ></base-dropdown-with-api>
        </base-select>
        <base-button
            type="submit"
            :disabled="disabledSubmitButton"
            classNames="font-button_M button footer__btn_save button_save button_blue w-100p mt-24"
            :toShowLoading="preloader"
            >Сохранить</base-button
        >
    </form>
</template>
<script setup>
import BaseDropdownWithApi from '@/components/ui/select/BaseDropdownWithApi.vue'
import BaseInput from '@ui/inputs/BaseInput.vue'
import BaseTextarea from '@ui/inputs/BaseTextarea.vue'
import BaseButton from '@/components/ui/buttons/BaseButton.vue'
import BaseSelect from '@/components/ui/select/BaseSelect.vue'

import { computed, ref, reactive } from 'vue'

const props = defineProps({
    initialData: {
        type: Object,
        default: () => ({
            code: '',
            name: '',
            description: '',
            departments: [],
        }),
    },
    preloader: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['submit'])

const formData = reactive(JSON.parse(JSON.stringify(props.initialData)))

const isActiveDepartment = ref(false)

const departmentsValue = computed(() =>
    formData.departments?.length ? formData.departments?.map((el) => el.name).join(', ') : '',
)

const handleSubmit = () => {
    emit('submit', formData)
}

const isFormChanged = computed(() => JSON.stringify(formData) !== JSON.stringify(props.initialData))

const disabledSubmitButton = computed(() => !isFormChanged.value || !formData.name)
</script>

<style lang="scss" scoped>
.textarea {
    height: 148px;
}
</style>
