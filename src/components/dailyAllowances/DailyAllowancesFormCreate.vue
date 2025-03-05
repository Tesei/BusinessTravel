<template>
    <div>
        <base-wrapper-component :shortText="true">
            <template #title
                ><div>Создание суточных</div>
                <div class="footnote_L c-gray mt-4">Задайте дневную компенсацию для командировки</div></template
            >
            <template #button>
                <div
                    class="flex f-center"
                    @click="backToDailyAllowancesList()"
                >
                    <icon-sprite
                        name="common--arrow_back"
                        className="icon__svg c-cornflower"
                    />
                    Ко всем суточным
                </div>
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
                        <base-select
                            type="big"
                            label="Сотрудник"
                            with-dropdown
                            v-model="isActiveTraveller"
                            :value="travellerValue"
                            :isRequired="false"
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
                    </div>
                    <div>
                        <base-select
                            type="big"
                            label="Подразделение"
                            with-dropdown
                            v-model="isActiveDepartment"
                            :value="departmentsValue"
                            :isRequired="false"
                        >
                            <base-dropdown-with-api
                                v-if="isActiveDepartment"
                                position-y="bottom"
                                placeholder="Подразделение"
                                search-type="departments"
                                not-data-title="Подразделения не найдены"
                                v-model:isActive="isActiveDepartment"
                                v-model:activeItems="departments"
                                :multipleSelection="true"
                                :line-count="5"
                            ></base-dropdown-with-api>
                        </base-select>
                    </div>
                </base-wrapper-gray-border>
            </template>
            <template #footer>
                <div class="footer__btn">
                    <base-button
                        :disabled="!disabledSubmitButton"
                        classNames="font-button_M button footer__btn_save button_save button_blue mt-40"
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
import IconSprite from '@/components/interface/IconSprite.vue'
import BaseWrapperGrayBorder from '@/components/ui/wrapper/BaseWrapperGrayBorder.vue'
import BaseWrapperComponent from '@/components/ui/wrapper/BaseWrapperComponent.vue'
import BaseDropdownWithApi from '@/components/ui/select/BaseDropdownWithApi.vue'
import BaseInputFloatNumber from '@/components/ui/inputs/BaseInputFloatNumber.vue'
import BaseButton from '@/components/ui/buttons/BaseButton.vue'
import BaseSelect from '@/components/ui/select/BaseSelect.vue'

import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useAllowancesStore } from '@/store/allowance'

const store = useAllowancesStore()
const { preloader } = storeToRefs(store)

const router = useRouter()

const stringAmount = ref('')
const amount = ref('')
const traveller = ref([])
const city = ref([])
const departments = ref([])
const isActiveTraveller = ref(false)
const isActiveCity = ref(false)
const isActiveDepartment = ref(false)

const travellerValue = computed(() =>
    traveller.value.length
        ? traveller.value.map((el) => `${el.lastName} ${el.firstName} • ${el.positionName} • ${el.departmentName}`).join(', ')
        : '',
)

const cityValue = computed(() => (city.value.length ? city.value?.map((el) => el.nameRus).join(', ') : ''))

const departmentsValue = computed(() => (departments.value.length ? departments.value?.map((el) => el.name).join(', ') : ''))
const disabledSubmitButton = computed(() => {
    return (
        (!!amount.value && traveller.value.length && city.value.length) ||
        (departments.value.length && city.value.length && !!amount.value)
    )
})

const backToDailyAllowancesList = () => {
    router.push('/settings/daily-allowances')
}

const onSubmit = async () => {
    const employees = traveller.value.map((item) => ({ id: item.id, type: 'employee' }))
    const departaments = departments.value.map((item) => ({ id: item.id, type: 'department' }))

    const request = {
        dailyAllowance: {
            amount: Number(amount.value),
            directionId: city.value[0].id,
            counterpartyStructureInfo: [...employees, ...departaments],
        },
    }
    await store.createDailyAllowances(request)
}
</script>

<style lang="scss" scoped>
.mt-4 {
    margin-top: 4px;
}

.button {
    width: 100%;
    justify-content: center;
}
</style>
