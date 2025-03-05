<template>
    <form @submit.prevent="handleSubmit">
        <div class="mt-40 mb-40 tab-bar-container">
            <base-tabs-tab-bar
                :tabArr="tabs"
                :activeTabValue="formData.expenseType"
                @setActiveTab="setExpenseType"
            >
            </base-tabs-tab-bar>
        </div>

        <base-wrapper-gray-border className="ui-contragent__content">
            <template #header>
                <h4 class="Heading_4 mb-24">Откуда</h4>
            </template>
            <base-select
                type="big"
                label="Пункт отбытия"
                with-dropdown
                v-model="isActiveCity"
                :value="cityFromValue"
                :isRequired="true"
            >
                <base-dropdown-with-api
                    v-if="isActiveCity"
                    position-y="bottom"
                    v-model:active-items="formData.cityFrom"
                    v-model:is-active="isActiveCity"
                    placeholder="Пункт отбытия"
                    search-type="directions"
                    not-data-title="Пункты отбытия не найдены"
                    only-cyrillic
                    :line-count="10"
                ></base-dropdown-with-api>
            </base-select>
        </base-wrapper-gray-border>
        <base-wrapper-gray-border className="ui-contragent__content">
            <template #header>
                <h4 class="Heading_4 mb-24">Куда</h4>
            </template>
            <base-select
                type="big"
                label="Пункт прибытия"
                with-dropdown
                v-model="isActiveCityTo"
                :value="cityToValue"
                :isRequired="true"
            >
                <base-dropdown-with-api
                    v-if="isActiveCityTo"
                    position-y="bottom"
                    v-model:active-items="formData.cityTo"
                    v-model:is-active="isActiveCityTo"
                    placeholder="Пункт прибытия"
                    search-type="directions"
                    not-data-title="Пункты прибытия не найдены"
                    only-cyrillic
                    :line-count="10"
                ></base-dropdown-with-api>
            </base-select>
        </base-wrapper-gray-border>
        <base-wrapper-gray-border className="ui-contragent__content">
            <template #header>
                <h4 class="Heading_4 mb-12 w-100p block">Билеты<span class="c-red">*</span></h4>
            </template>
            <h5 class="body_S c-gray mb-24">Укажите стоимость или класс обслуживания.</h5>
            <div class="flex ai-c">
                <base-input-float-number
                    class="w-100p mr-24"
                    placeholder="Стоимость"
                    v-model:string-value="formData.stringAmount"
                    v-model:number-value="formData.amount"
                />
                <base-radio-group
                    class="flex jc-sb radio-group"
                    :options="serviceOptions"
                    v-model="formData.serviceClass"
                />
            </div>
        </base-wrapper-gray-border>
        <base-wrapper-gray-border className="ui-contragent__content">
            <template #header>
                <h4 class="Heading_4 mb-12">Для кого?<span class="c-red">*</span></h4>
            </template>
            <h5 class="body_S c-gray mb-24">Лимит может быть создан как для конкретного сотрудника так и для подразделения.</h5>
            <div class="mb-24">
                <base-tooltip
                    class="daily-allowance__tooltip"
                    :type="'basic'"
                    :text="[travellerValue]"
                    :font="'footnote_M'"
                    :range="1"
                >
                    <base-select
                        type="big"
                        label="Сотрудник"
                        with-dropdown
                        v-model="isActiveTraveller"
                        :value="travellerValue"
                    >
                        <base-dropdown-with-api
                            v-if="isActiveTraveller"
                            position-y="bottom"
                            placeholder="ФИО, должность или название компании"
                            search-type="employees"
                            not-data-title="Сотрудники не найдены"
                            v-model:isActive="isActiveTraveller"
                            v-model:activeItems="formData.traveller"
                            :multipleSelection="true"
                            :line-count="3"
                        ></base-dropdown-with-api>
                    </base-select>
                </base-tooltip>
            </div>
            <div>
                <base-tooltip
                    class="daily-allowance__tooltip"
                    :type="'basic'"
                    :text="[departmentsValue]"
                    :font="'footnote_M'"
                    :range="1"
                >
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
                            placeholder="Подразделение"
                            search-type="departments"
                            not-data-title="Сотрудники не найдены"
                            v-model:isActive="isActiveDepartment"
                            v-model:activeItems="formData.departments"
                            :multipleSelection="true"
                            :line-count="5"
                        ></base-dropdown-with-api>
                    </base-select>
                </base-tooltip>
            </div>
        </base-wrapper-gray-border>
        <div>
            <base-button
                type="submit"
                :disabled="disabledSubmitButton"
                classNames="font-button_M button footer__btn_save button_save button_blue mt-40 w-100p"
                :toShowLoading="preloader"
                >Сохранить</base-button
            >
        </div>
    </form>
</template>
<script setup>
import BaseTabsTabBar from '@/components/ui/tabs/BaseTabsTabBar.vue'
import BaseWrapperGrayBorder from '@/components/ui/wrapper/BaseWrapperGrayBorder.vue'
import BaseDropdownWithApi from '@/components/ui/select/BaseDropdownWithApi.vue'
import BaseInputFloatNumber from '@/components/ui/inputs/BaseInputFloatNumber.vue'
import BaseRadioGroup from '@/components/ui/radio/BaseRadioGroup.vue'
import BaseButton from '@/components/ui/buttons/BaseButton.vue'
import BaseSelect from '@/components/ui/select/BaseSelect.vue'
import BaseTooltip from '@ui/BaseTooltip.vue'

import { storeToRefs } from 'pinia'
import { computed, ref, reactive, watch } from 'vue'
import { useAllowancesStore } from '@/store/allowance'

const store = useAllowancesStore()
const { preloader } = storeToRefs(store)

const props = defineProps({
    initialData: {
        type: Object,
        default: () => ({
            expenseType: 'Plane',
            serviceClass: 'Economy',
            stringAmount: '',
            amount: '',
            traveller: [],
            cityFrom: [],
            cityTo: [],
            departments: [],
        }),
    },
})

const emit = defineEmits(['submit'])

const formData = reactive(JSON.parse(JSON.stringify(props.initialData)))

const setExpenseType = (tab) => {
    formData.expenseType = tab.value
}
const tabs = [
    { label: 'На авиабилеты', value: 'Plane' },
    { label: 'На ж/д билеты', value: 'Train' },
]

const serviceOptions = [
    { value: 'Economy', label: 'Эконом' },
    { value: 'Business', label: 'Бизнес' },
]

const isActiveTraveller = ref(false)
const isActiveCity = ref(false)
const isActiveCityTo = ref(false)

const isActiveDepartment = ref(false)

const travellerValue = computed(() =>
    formData.traveller?.length
        ? formData.traveller.map((el) => `${el.lastName} ${el.firstName} • ${el.positionName} • ${el.departmentName}`).join(', ')
        : '',
)

const cityFromValue = computed(() => (formData.cityFrom.length ? formData.cityFrom?.map((el) => el.nameRus).join(', ') : ''))
const cityToValue = computed(() => (formData.cityTo.length ? formData.cityTo?.map((el) => el.nameRus).join(', ') : ''))

const departmentsValue = computed(() =>
    formData.departments.length ? formData.departments?.map((el) => el.name).join(', ') : '',
)

function resetForm() {
    formData.expenseType = 'Plane'
    formData.serviceClass = 'Economy'
    formData.stringAmount = ''
    formData.amount = ''
    formData.traveller = []
    formData.cityFrom = []
    formData.cityTo = []
    formData.departments = []
}

const handleSubmit = () => {
    emit('submit', formData)
    resetForm()
}

const isFormChanged = ref(false)
//следим были ли изменения в полях формы
watch(formData, () => {
    isFormChanged.value = true
})

const disabledSubmitButton = computed(
    () =>
        !isFormChanged.value ||
        !formData.amount ||
        !formData.cityFrom.length ||
        !formData.cityTo.length ||
        !(formData.traveller.length || formData.departments.length),
)
</script>

<style lang="scss" scoped>
.tab-bar-container {
    width: 622px;
}
.radio-group {
    width: 256px;
}
</style>
