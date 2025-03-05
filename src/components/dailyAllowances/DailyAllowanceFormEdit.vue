<template>
    <div>
        <div v-if="preloader">
            <base-skeleton
                v-for="index in 4"
                :key="index"
                class="mb-24"
                skeleton-height="154px"
            />
        </div>

        <base-wrapper-component
            v-else
            :shortText="true"
        >
            <template #title
                ><span>Редактирование суточных</span>
                <span class="footnote_L c-gray mt-4 block">Задайте дневную компенсацию для командировки</span></template
            >
            <template #button>
                <span
                    class="flex f-center"
                    @click="backToDailyAllowancesList()"
                >
                    <icon-sprite
                        name="common--arrow_back"
                        className="icon__svg c-cornflower"
                    />
                    Ко всем суточным
                </span>
            </template>
            <template #content>
                <base-wrapper-gray-border className="ui-contragent__content">
                    <template #header>
                        <h4 class="Heading_4 mb-24">Дневная компенсация</h4>
                    </template>
                    <base-input-float-number
                        placeholder="Суточные, ₽/день"
                        :isRequired="true"
                        v-model:string-value="stringAmount"
                        v-model:number-value="amount"
                    />
                </base-wrapper-gray-border>
                <base-wrapper-gray-border className="ui-contragent__content">
                    <template #header>
                        <h4 class="Heading_4 mb-24">Направление</h4>
                    </template>
                    <base-select
                        type="big"
                        label="Направление"
                        with-dropdown
                        v-model="isActiveCity"
                        :value="cityValue"
                        :isRequired="true"
                    >
                        <base-dropdown-with-api
                            v-if="isActiveCity"
                            position-y="bottom"
                            v-model:active-items="city"
                            v-model:is-active="isActiveCity"
                            placeholder="Город"
                            search-type="directions"
                            not-data-title="Города вылета не найдены"
                            only-cyrillic
                            :line-count="10"
                        ></base-dropdown-with-api>
                    </base-select>
                </base-wrapper-gray-border>
                <base-wrapper-gray-border className="ui-contragent__content">
                    <template #header>
                        <h4 class="Heading_4 mb-24">Для кого?<span class="c-red">*</span></h4>
                    </template>
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
                                    v-model:activeItems="traveller"
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
                                    v-model:activeItems="departments"
                                    :multipleSelection="true"
                                    :line-count="5"
                                ></base-dropdown-with-api>
                            </base-select>
                        </base-tooltip>
                    </div>
                </base-wrapper-gray-border>
            </template>
            <template #footer>
                <div class="footer__btn">
                    <base-button
                        :disabled="!disabledSubmitButton"
                        classNames="font-button_M button footer__btn_save button_save button_blue mt-40 w-100p"
                        @click="onSubmit"
                        :toShowLoading="preloader"
                        >Сохранить</base-button
                    >
                </div>
            </template>
        </base-wrapper-component>
    </div>
</template>
<script setup>
import { onMounted, watch } from 'vue'
import IconSprite from '@/components/interface/IconSprite.vue'
import BaseWrapperGrayBorder from '@/components/ui/wrapper/BaseWrapperGrayBorder.vue'
import BaseWrapperComponent from '@/components/ui/wrapper/BaseWrapperComponent.vue'
import BaseDropdownWithApi from '@/components/ui/select/BaseDropdownWithApi.vue'
import BaseInputFloatNumber from '@/components/ui/inputs/BaseInputFloatNumber.vue'
import BaseButton from '@/components/ui/buttons/BaseButton.vue'
import BaseSelect from '@/components/ui/select/BaseSelect.vue'
import BaseSkeleton from '@ui/BaseSkeleton.vue'
import BaseTooltip from '@ui/BaseTooltip.vue'

import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useAllowancesStore } from '@/store/allowance'
import { useEmployeeStore } from '@/store/employee'

const store = useAllowancesStore()
const { preloader, getSingleDailyAllowance } = storeToRefs(store)
const employeeStore = useEmployeeStore()

const router = useRouter()

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
})

onMounted(async () => {
    await store.fetchDailyAllowancesById(props.id)
    setFormValues(getSingleDailyAllowance.value)
})

const stringAmount = ref('')
const amount = ref('')
const traveller = ref([])
const city = ref([])
const departments = ref([])

const isActiveTraveller = ref(false)
const isActiveCity = ref(false)
const isActiveDepartment = ref(false)

const travellerValue = computed(() =>
    traveller.value?.length
        ? traveller.value.map((el) => `${el.lastName} ${el.firstName} • ${el.positionName} • ${el.departmentName}`).join(', ')
        : '',
)

const cityValue = computed(() => (city.value.length ? city.value?.map((el) => el.nameRus).join(', ') : ''))

const departmentsValue = computed(() => (departments.value.length ? departments.value?.map((el) => el.name).join(', ') : ''))

const isFormChanged = ref(false)

const disabledSubmitButton = computed(() => 
    !!isFormChanged.value && !!amount.value && city.value.length && 
    (traveller.value.length || departments.value.length)
)

const backToDailyAllowancesList = () => {
    router.push('/settings/daily-allowances')
}

const onSubmit = async () => {
    const employees = traveller.value.map((item) => ({ id: item.id, type: 'employee' }))
    const departaments = departments.value.map((item) => ({ id: item.id, type: 'department' }))

    const request = {
        id: props.id,
        dailyAllowance: {
            amount: Number(amount.value),
            directionId: city.value[0].id,
            counterpartyStructureInfo: [...employees, ...departaments],
        },
    }
    await store.putDailyAllowances(request)
}

async function fetchEmployeeData(newDailyAllowance) {
    const employeeData = await Promise.all(
        newDailyAllowance.employees.map(async (employee) => {
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

async function setFormValues(newDailyAllowance) {
    const employeeData = await fetchEmployeeData(newDailyAllowance)

    stringAmount.value = String(newDailyAllowance.amount).replace('.', ',')
    amount.value = newDailyAllowance.amount
    traveller.value = employeeData
    city.value = [{ ...newDailyAllowance.direction, nameRus: newDailyAllowance.direction?.name }]
    departments.value = newDailyAllowance.departments
}
//следим были ли изменения в полях формы
watch(
    [amount, traveller, city, departments],
    (_, [oldAmount, oldTraveller, oldCity, oldDepartments]) => {
        if (oldAmount === '' || !oldTraveller || !oldCity || !oldDepartments) {
            return
        }
        isFormChanged.value = true
    },
)
</script>

<style lang="scss" scoped>
.mt-4 {
    margin-top: 4px;
}
</style>
