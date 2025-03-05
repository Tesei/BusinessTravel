<template>
    <div>
        <base-wrapper-component>
            <template #title>Новая командировка</template>
            <template #button>
                <div
                    class="flex f-center"
                    @click="backToTripsList()"
                >
                    <icon-sprite
                        name="common--arrow_back"
                        className="icon__svg c-cornflower"
                    />
                    Возврат к списку командировок
                </div>
            </template>
            <template #content>
                <base-wrapper-gray-border className="ui-contragent__content">
                    <template #header>
                        <h4 class="Heading_4 mb-24">Первичные данные</h4>
                    </template>
                    <div
                        class="grid__container"
                        :class="{ grid__container_create: !accessCreateNewEmployee }"
                    >
                        <div class="item1">
                            <base-select
                                type="big"
                                label="Командируемый"
                                with-dropdown
                                v-model="isActiveTraveller"
                                :value="travellerValue"
                                :isRequired="true"
                            >
                                <base-dropdown-with-api
                                    v-if="isActiveTraveller"
                                    position-y="bottom"
                                    placeholder="ФИО, должность или название компании"
                                    search-type="employees"
                                    not-data-title="Сотрудники не найдены"
                                    v-model:isActive="isActiveTraveller"
                                    v-model:activeItems="traveller"
                                    :line-count="3"
                                ></base-dropdown-with-api>
                            </base-select>
                        </div>
                        <div class="item2">
                            <base-button
                                v-if="accessCreateNewEmployee"
                                @click="openPopupCreateEmployee"
                                classNames="font-button_S button button__create button_transparent mt-0 w-100p"
                                ><IconSprite
                                    name="common--plus"
                                    className="icon__svg icon__svg_button c-cornflower"
                                />Новый сотрудник</base-button
                            >
                        </div>
                        <div class="item3">
                            <base-select
                                type="big"
                                label="Место отправления"
                                with-dropdown
                                v-model="isActiveDepartureCity"
                                :value="departureCityValue"
                                :isRequired="true"
                            >
                                <base-dropdown-with-api
                                    v-if="isActiveDepartureCity"
                                    position-y="bottom"
                                    v-model:active-items="departureCity"
                                    v-model:is-active="isActiveDepartureCity"
                                    placeholder="Город"
                                    search-type="directions"
                                    not-data-title="Города вылета не найдены"
                                    only-cyrillic
                                    :line-count="10"
                                ></base-dropdown-with-api>
                            </base-select>
                        </div>
                    </div>
                </base-wrapper-gray-border>
                <Transition name="nested">
                    <base-wrapper-gray-border
                        className="ui-contragent__content"
                        class="outer"
                        v-if="show"
                    >
                        <TransitionGroup name="list">
                            <div
                                v-for="(item, idx) in destinations"
                                :key="item.key"
                            >
                                <div
                                    v-if="idx !== 0"
                                    class="flex jc-sb"
                                >
                                    <h4 class="Heading_4 mb-24">Дополнительное место назначения</h4>
                                    <div>
                                        <IconSprite
                                            @click="openPopup(idx)"
                                            name="common--delete"
                                            class="icon__svg icon__delete pointer"
                                        />
                                    </div>
                                </div>
                                <h4
                                    v-else
                                    class="Heading_4 mb-24"
                                >
                                    Место назначения командировки
                                </h4>
                                <div class="grid__container_second">
                                    <div class="item4">
                                        <base-select
                                            type="big"
                                            label="Место назначения"
                                            with-dropdown
                                            v-model="item.value.arrivalCity.isActive"
                                            :value="arrivalCityValue(item.value)"
                                            :isRequired="true"
                                        >
                                            <base-dropdown-with-api
                                                v-if="item.value.arrivalCity.isActive"
                                                position-y="bottom"
                                                v-model:active-items="item.value.arrivalCity.activeItems"
                                                v-model:is-active="item.value.arrivalCity.isActive"
                                                placeholder="Город"
                                                search-type="directions"
                                                not-data-title="Города вылета не найдены"
                                                only-cyrillic
                                                :line-count="10"
                                            ></base-dropdown-with-api>
                                        </base-select>
                                    </div>
                                    <base-input-date
                                        class="item5"
                                        placeholder="Дата отправления"
                                        :isRequired="true"
                                        minDate="1920-01-01"
                                        maxDate="2099-12-31"
                                        v-model="item.value.startDate"
                                    />
                                    <base-input-date
                                        class="item6"
                                        placeholder="Дата прибытия"
                                        :isRequired="true"
                                        minDate="1920-01-01"
                                        maxDate="2099-12-31"
                                        v-model="item.value.endDate"
                                    />
                                </div>
                                <div class="grid__container_third">
                                    <base-select
                                        type="big"
                                        label="Компания назначения"
                                        with-dropdown
                                        v-model="item.value.destinationCompany.isActive"
                                        :value="destinationCompany(item.value)"
                                        :isRequired="true"
                                    >
                                        <base-dropdown-with-api
                                            v-if="item.value.destinationCompany.isActive"
                                            position-y="bottom"
                                            placeholder="Название компании"
                                            search-type="companies"
                                            not-data-title="Компании не найдены"
                                            v-model:isActive="item.value.destinationCompany.isActive"
                                            v-model:activeItems="item.value.destinationCompany.activeItems"
                                            :line-count="5"
                                        ></base-dropdown-with-api>
                                    </base-select>

                                    <base-button
                                        @click="addCompany(item.value)"
                                        :disabled="!item.value.destinationCompany.activeItems.length"
                                        classNames="font-button_S button button__create button_transparent mt-0"
                                        ><IconSprite
                                            :class="{
                                                disabled__icon: !item.value.destinationCompany.activeItems.length,
                                            }"
                                            name="common--plus"
                                            className="icon__svg icon__svg_button c-cornflower"
                                        />Добавить еще одну</base-button
                                    >
                                    <TransitionGroup name="list">
                                        <template
                                            v-for="company in item.value.additionalCompanies"
                                            :key="company.id"
                                        >
                                            <base-select
                                                class="company"
                                                type="big"
                                                label="Компания назначения"
                                                with-dropdown
                                                v-model="company.isActive"
                                                :value="additionalCompanies(item.value, company.id)"
                                                :isRequired="true"
                                            >
                                                <base-dropdown-with-api
                                                    v-if="company.isActive"
                                                    position-y="bottom"
                                                    placeholder="Название компании"
                                                    search-type="companies"
                                                    not-data-title="Компании не найдены"
                                                    v-model:isActive="company.isActive"
                                                    v-model:activeItems="company.activeItems"
                                                    :line-count="10"
                                                >
                                                </base-dropdown-with-api>
                                            </base-select>
                                            <base-button
                                                v-show="!!additionalCompanies(item.value, company.id)"
                                                @click="deleteCompany(item.value, company)"
                                                class="delete__button font-button_S mt-0"
                                            >
                                                <IconSprite
                                                    name="common--delete"
                                                    class="icon__svg icon__delete"
                                                />
                                                Удалить компанию
                                            </base-button>
                                        </template>
                                    </TransitionGroup>
                                </div>
                                <div
                                    class="item9"
                                    v-if="idx === destinations.length - 1"
                                >
                                    <base-button
                                        :disabled="disabledSubmitButton"
                                        @click="addDestination(item.value)"
                                        classNames="font-button_S button button__create button_transparent mt-0 w-100p"
                                        ><IconSprite
                                            name="common--plus"
                                            :class="{
                                                disabled__icon: disabledSubmitButton,
                                            }"
                                            className="icon__svg icon__svg_button c-cornflower"
                                        />Добавить место назначения</base-button
                                    >
                                </div>
                            </div>
                        </TransitionGroup>
                    </base-wrapper-gray-border>
                </Transition>
                <base-textarea
                    maxlen="250"
                    class="mt-32"
                    placeholder="Комментарий"
                    v-model="comment"
                />
            </template>
            <template #footer>
                <div class="footer__btn">
                    <base-button
                        :disabled="disabledSubmitButton"
                        classNames="font-button_M button footer__btn_save button_save button_blue"
                        @click="onSubmit"
                        :toShowLoading="preloader"
                        >Сохранить</base-button
                    >
                </div>
            </template>
        </base-wrapper-component>
        <base-wrapper-popup
            v-if="showRemoveCompanyPopup"
            :hasCloseIcon="false"
        >
            <div class="popup__wrapper">
                <div class="Heading_3">Удаление места назначения</div>
                <div class="body_S">Вы хотите удалить место назначения? Введенные данные не сохранятся</div>
                <div class="popup__wrapper_footer">
                    <base-button
                        @click="removeCompany"
                        class="delete__button delete__button_popup font-button_M mt-0"
                        >Удалить</base-button
                    >
                    <base-button
                        @click="closePopup"
                        classNames="button button_blue font-button_M mt-0"
                        >Отмена</base-button
                    >
                </div>
            </div>
        </base-wrapper-popup>
    </div>
    <popup-create-new-employee
        v-if="isPopupCreateEmployeeOpen"
        @close="closePopupCreateEmployee"
    />
</template>
<script setup>
import IconSprite from '@/components/interface/IconSprite.vue'
import BaseWrapperGrayBorder from '@ui/wrapper/BaseWrapperGrayBorder.vue'
import BaseWrapperComponent from '@ui/wrapper/BaseWrapperComponent.vue'
import BaseWrapperPopup from '@ui/wrapper/BaseWrapperPopup.vue'
import BaseTextarea from '@ui/inputs/BaseTextarea.vue'
import BaseDropdownWithApi from '@ui/select/BaseDropdownWithApi.vue'
import BaseSelect from '@ui/select/BaseSelect.vue'
import BaseButton from '@ui/buttons/BaseButton.vue'
import BaseInputDate from '@ui/inputs/BaseInputDate.vue'

import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import { validateSchema } from '@/composables/useZodValidSchema'
import { useField, useFieldArray, useForm } from 'vee-validate'
import { useTripsStore } from '@/store/trips'
import { useUserStore } from '@/store/user'
import { storeToRefs } from 'pinia'
import PopupCreateNewEmployee from '@/components/employees/PopupCreateNewEmployee.vue'

const userStore = useUserStore()
const store = useTripsStore()
const { preloader } = storeToRefs(store)

const router = useRouter()

const isActiveTraveller = ref(false)
const isActiveDepartureCity = ref(false)
const showRemoveCompanyPopup = ref(false)
const currentIdx = ref(null)

const accessCreateNewEmployee = computed(() => {
    return userStore.user?.permissions?.some((el) => el === 'BusinessTravelManagement:employees.new')
})
const isPopupCreateEmployeeOpen = ref(false)
const openPopupCreateEmployee = () =>  isPopupCreateEmployeeOpen.value = true
const closePopupCreateEmployee = () =>  isPopupCreateEmployeeOpen.value = false

const travellerValue = computed(() =>
    traveller.value.length
        ? traveller.value.map((el) => `${el.lastName} ${el.firstName} • ${el.positionName} • ${el.departmentName}`).join(', ')
        : '',
)

const departureCityValue = computed(() =>
    departureCity.value.length ? departureCity.value.map((el) => el.nameRus).join(', ') : '',
)

const show = computed(() => Boolean(traveller.value.length && departureCity.value.length))

const disabledSubmitButton = computed(() => {
    return Object.values(errors.value)?.some((item) => item)
})

const validationSchema = validateSchema()
const { handleSubmit, errors } = useForm({
    validationSchema,
    initialValues: {
        destinations: [
            {
                arrivalCity: { isActive: false, activeItems: [] },
                startDate: null,
                endDate: null,
                destinationCompany: { isActive: false, activeItems: [] },
                additionalCompanies: [],
            },
        ],
    },
})

const { value: traveller } = useField('traveller')
const { value: departureCity } = useField('departureCity')
const { value: comment } = useField('comment')
const { remove, push, fields: destinations } = useFieldArray('destinations')

const backToTripsList = () => {
    router.push({ name: 'trips' })
}

const onSubmit = handleSubmit(async (values) => {
    const requestParams = values.destinations.map((item) => ({
        DirectionId: item.arrivalCity.activeItems[0].id,
        EmployeeId: values.traveller[0].id,
    }))
    const directionsIds = await store.getDailyAllowances(requestParams)
    const employeeId = values.traveller[0].id
    const startDate = values.destinations[0].startDate
    const endDate = values.destinations.at(-1).endDate
    const stages = values.destinations.map((item, idx, array) => {
        return {
            position: idx,
            dailyAllowanceId: directionsIds[idx],
            dateDeparture: item.startDate,
            dateArrival: item.endDate,
            fromDirectionId: idx === 0 ? values.departureCity[0].id : array[idx - 1].arrivalCity.activeItems[0].id,
            toDirectionId: item.arrivalCity.activeItems[0].id,
            receivingCompanies: [
                item.destinationCompany.activeItems[0].id,
                ...item.additionalCompanies.filter((item) => !!item?.activeItems[0]?.id).map((item) => item?.activeItems[0]?.id),
            ],
        }
    })
    const request = { employeeId, startDate, endDate, comment: values.comment, stages }
    await store.createTrip(request)
})

const addCompany = (value) => {
    const iniqueID = Date.now().toString(36)
    value.additionalCompanies.push({
        isActive: false,
        activeItems: [],
        id: iniqueID,
    })
}

const deleteCompany = (value, company) => {
    value.additionalCompanies = value.additionalCompanies.filter((item) => item.id !== company.id)
}

const addDestination = (value) => {
    push({
        arrivalCity: { isActive: false, activeItems: [] },
        startDate: value.endDate,
        endDate: null,
        destinationCompany: { isActive: false, activeItems: [] },
        additionalCompanies: [],
    })
}

const openPopup = (idx) => {
    showRemoveCompanyPopup.value = true
    currentIdx.value = idx
}

const closePopup = () => {
    showRemoveCompanyPopup.value = false
}
const removeCompany = () => {
    showRemoveCompanyPopup.value = false
    remove(currentIdx.value)
    currentIdx.value = null
}

// вычесление value для селектов
const arrivalCityValue = (value) =>
    value.arrivalCity.activeItems.length ? value.arrivalCity.activeItems.map((el) => el.nameRus).join(', ') : ''

const destinationCompany = (value) =>
    value.destinationCompany.activeItems.length ? value.destinationCompany.activeItems.map((el) => el.name).join(', ') : ''

const additionalCompanies = (value, company) =>
    value.additionalCompanies.find((obj) => obj.id === company).activeItems.length
        ? value.additionalCompanies
            .find((obj) => obj.id === company)
            .activeItems.map((item) => item.name)
            .join(', ')
        : ''
</script>

<style lang="scss" scoped>
.icon__delete {
    margin-right: 0;
    color: $color-red;
}

.delete__button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    line-height: 24px;
    background: none;
    padding: 7px 20px;
    color: $color-red;
    border: 1px solid $color-red;
    //delete__button_popup
    &_popup {
        padding: 16px 32px;
    }
}

.grid__container {
    display: grid;
    width: 100%;
    gap: 24px;

    grid-template-columns: minmax(200px, 853px) minmax(100px, 245px);
    grid-template-rows: repeat(2, auto);

    grid-template-areas:
        'a b'
        'c c';
    //grid__container_create
    &_create {
        grid-template-columns: 1fr 0px;
        gap: 0;
        row-gap: 24px;
    }
}

.item1 {
    grid-area: a;
}
.item2 {
    grid-area: b;
}
.item3 {
    grid-area: c;
}

.mt-0 {
    margin-top: 0;
}

.nested-enter-active,
.nested-leave-active {
    transition: all 0.5s ease-in-out;
}
.nested-leave-active {
    transition-delay: 0.25s;
}

.nested-enter-from,
.nested-leave-to {
    transform: translateY(30px);
    opacity: 0;
}

.nested-enter-active .inner,
.nested-leave-active .inner {
    transition: all 0.5s ease-in-out;
}
.nested-enter-active .inner {
    transition-delay: 0.25s;
}

.nested-enter-from .inner,
.nested-leave-to .inner {
    transform: translateX(30px);
    opacity: 0.001;
}

.grid__container_second {
    display: grid;
    width: 100%;
    gap: 24px;

    grid-template-columns: repeat(2, 1fr);

    grid-template-areas:
        'd d'
        'e f';
}
.item4 {
    grid-area: d;
}
.item5 {
    grid-area: e;
}
.item6 {
    grid-area: f;
}

.grid__container_third {
    display: grid;
    width: 100%;
    gap: 24px;
    margin: 24px 0 48px 0;
    grid-template-columns: minmax(200px, 790px) minmax(100px, 308px);
}

.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

.popup__wrapper {
    display: flex;
    width: 770px;
    flex-direction: column;
    padding: 24px;
    gap: 32px;
    //popup__wrapper_footer
    &_footer {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 32px;
    }
}
.disabled__icon {
    color: $text-disabled;
}

.button {
    justify-content: center;
}

.footer__btn {
    display: flex;
    width: 100%;
    justify-content: flex-end;
    //footer__btn_save
    &_save {
        width: auto;
        justify-content: center;
        margin-top: 40px;
    }
}

.company {
    grid-column-start: 1;
    grid-column-end: 2;
}
</style>
