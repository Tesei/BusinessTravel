<template>
    <base-wrapper-component :is-show-button="false">
        <template #title>Бронирование авиабилета</template>
        <template #button>
            <div
                class="flex f-center"
                @click="handleReturnToAvia"
            >
                <IconSprite
                    name="common--arrow_back"
                    className="icon__svg c-cornflower"
                />
                Назад к поиску авиабилетов
            </div>
        </template>
        <template #content>
            <div class="grid__container">
                <div>
                    <base-wrapper-gray-border
                        className="full-width m-0"
                        class="block-margin"
                    >
                        <div
                            v-for="(direction, index) in tariffs.route.legs"
                            :key="index"
                        >
                            <div
                                class="direction mb-24"
                                :class="{ 'mt-24': index === 1 }"
                            >
                                <span class="Heading_3 direction__title">{{ index ? 'Обратно' : 'Туда' }}</span>
                                <div class="icon__wrapper ml-24">
                                    <IconSprite
                                        name="common--flight-ticket-there"
                                        :className="
                                            index
                                                ? `flight-ticket flight-ticket-back c-gray-2 mr-24 ml-24`
                                                : `flight-ticket c-gray-2 mr-24 ml-24`
                                        "
                                    />
                                </div>
                            </div>
                            <OrderAirTicket :direction="direction" />
                        </div>
                    </base-wrapper-gray-border>
                    <base-wrapper-gray-border className="full-width m-0">
                        <OrderTariffItem />
                    </base-wrapper-gray-border>
                </div>
                <base-wrapper-gray-border className="full-width m-0">
                    <h4 class="Heading_4 mb-24">Информация о пассажире</h4>

                    <div class="passanger__info">
                        <div class="item-fullwidth">
                            <div>
                                <IconSprite
                                    name="common--info"
                                    className="icon__svg"
                                />
                            </div>
                            <div class="footnote_L">
                                Чтобы изменить данные обратитесь к администратору сервиса вашей организации
                            </div>
                        </div>
                        <base-input
                            placeholder="Фамилия кириллицей"
                            :isRequired="true"
                            v-model="lastName"
                            :disabled="true"
                        />
                        <base-input
                            placeholder="Фамилия латиницей"
                            :isRequired="true"
                            v-model="latinLastName"
                            :disabled="true"
                        />
                        <base-input
                            placeholder="Имя кириллицей"
                            :isRequired="true"
                            v-model="firstName"
                            :disabled="true"
                        />
                        <base-input
                            placeholder="Имя латиницей"
                            :isRequired="true"
                            v-model="latinFirstName"
                            :disabled="true"
                        />
                        <div class="patronymic">
                            <base-input
                                class="patronymic_margin"
                                placeholder="Отчество кириллицей"
                                :isRequired="true"
                                v-model="middleName"
                                :disabled="true"
                            />
                            <base-checkbox
                                v-model="checked"
                                label="Нет отчества"
                                :disabled="true"
                            />
                        </div>
                        <base-input
                            placeholder="Отчетство латиницей"
                            :isRequired="true"
                            v-model="latinMiddleName"
                            :disabled="true"
                        />
                        <base-input-date
                            placeholder="Дата рождения"
                            :isRequired="true"
                            :modelValue="birthdayDate"
                            minDate="1920-01-01"
                            :disabled="true"
                        />
                        <div>
                            <base-select
                                class="select-width"
                                type="big"
                                :isRequired="true"
                                label="Пол"
                                :value="gender"
                                v-model="genderIsActive"
                                with-dropdown
                                :disabled="true"
                            >
                                <base-droplist
                                    v-if="genderIsActive"
                                    position-x="left"
                                    position-y="bottom"
                                    :list="genderList"
                                    v-model:isActive="genderIsActive"
                                    v-model:activeItem="gender"
                                    type="basic"
                                />
                            </base-select>
                        </div>
                    </div>
                    <h4 class="Heading_4 mb-24 mt-24">Документ, удостоверяющий личность</h4>
                    <div class="passanger__info">
                        <base-select
                            class="select-width"
                            type="big"
                            :isRequired="true"
                            label="Тип документа"
                            :value="type"
                            v-model="typeIsActive"
                            with-dropdown
                            :error="errors.type"
                        >
                            <base-droplist
                                v-if="typeIsActive"
                                position-x="left"
                                position-y="bottom"
                                :list="typeList"
                                v-model:isActive="typeIsActive"
                                v-model:activeItem="type"
                                type="basic"
                            />
                        </base-select>
                        <base-input
                            placeholder="Серия и номер"
                            :isRequired="true"
                            :modelValue="docsInformation?.number"
                            :disabled="true"
                        />
                        <base-input-date
                            v-if="docsInformation?.type !== 'RussianFederationPassport'"
                            placeholder="Срок действия"
                            :isRequired="true"
                            :modelValue="
                                docsInformation?.expirationDate
                                    ? new Date(docsInformation?.expirationDate)?.toISOString()?.slice(0, 10)
                                    : null
                            "
                            :disabled="true"
                        />
                        <base-select
                            v-if="docsInformation?.type !== 'RussianFederationPassport'"
                            class="select-width"
                            type="big"
                            :isRequired="true"
                            label="Гражданство"
                            :with-dropdown="false"
                            :value="docsInformation?.citizenshipCountryName"
                            :modelValue="false"
                            :disabled="true"
                        >
                        </base-select>
                        <base-input-phone
                            classNames="grid__wrapper"
                            placeholder="Телефон"
                            :isRequired="true"
                            v-model="phoneNumber"
                            :error="errors.phoneNumber"
                            :disabled="true"
                        />
                        <base-input
                            placeholder="Электронная почта"
                            :isRequired="true"
                            v-model="email"
                            :errorText="errors.email"
                        />
                        <div></div>
                        <div class="footer__btn">
                            <base-button
                                classNames="font-button_M button button_save button_blue load-button"
                                :disabled="disabledSaveButton"
                                :toShowLoading="preloader"
                                @click="onSubmit"
                                >Подтвердить заказ</base-button
                            >
                        </div>
                    </div>
                </base-wrapper-gray-border>
            </div>
        </template>
    </base-wrapper-component>
</template>
<script setup>
import { useRoute, useRouter } from 'vue-router'
import BaseWrapperComponent from '@ui/wrapper/BaseWrapperComponent.vue'
import BaseWrapperGrayBorder from '@ui/wrapper/BaseWrapperGrayBorder.vue'
import IconSprite from '@/components/interface/IconSprite.vue'
import BaseInput from '@ui/inputs/BaseInput.vue'
import BaseInputDate from '@ui/inputs/BaseInputDate.vue'
import BaseInputPhone from '@ui/inputs/BaseInputPhone.vue'
import BaseSelect from '@ui/select/BaseSelect.vue'
import BaseDroplist from '@ui/select/BaseDroplist.vue'
import BaseCheckbox from '@ui/BaseCheckbox.vue'
import BaseButton from '@ui/buttons/BaseButton.vue'
import OrderTariffItem from '@/components/airSearch/order/OrderTariffItem.vue'

import { computed, ref } from 'vue'
import { useField, useForm } from 'vee-validate'
import { orderCreateValidateSchema } from '@/composables/useZodValidSchema'
import { useAirSearchStore } from '@/store/airSearch'
import { storeToRefs } from 'pinia'
import OrderAirTicket from '@/components/airSearch/order/OrderAirTicket.vue'

const route = useRoute()
const router = useRouter()

const store = useAirSearchStore()

const { person, tariffs, preloader, tariff, chosenTripServiceId } = storeToRefs(store)

const genderIsActive = ref(false)
const genderList = ref(['Мужской', 'Женский'])
const typeIsActive = ref(false)
const typeList = ref(person.value.docsList)
const docs = ref({
    'Паспорт РФ': 'RussianFederationPassport',
    'Заграничный паспорт РФ': 'RussianInternationalPassport',
    'Паспорт иностранного гражданина': 'ForeignPassport',
})

const checked = ref(false)

const validationSchema = orderCreateValidateSchema({ person })
const { handleSubmit, errors } = useForm({
    validationSchema,
})

const { value: lastName } = useField('lastName')
const { value: firstName } = useField('firstName')
const { value: middleName } = useField('middleName')
const { value: latinLastName } = useField('latinLastName')
const { value: latinFirstName } = useField('latinFirstName')
const { value: latinMiddleName } = useField('latinMiddleName')
const { value: gender } = useField('gender')

const { value: type } = useField('type')
const { value: phoneNumber } = useField('phoneNumber')
const { value: email } = useField('email')

const onSubmit = handleSubmit(async (values) => {
    const requestParams = {
        priceKey: tariff.value.key,
        priceCacheKey: tariffs.value.cacheKey,
        bookingEmail: values.email,
        bookingPhoneNumber: values.phoneNumber,
        passengers: [
            {
                documentId: docsInformation.value.id,
                passengerType: 'Adult',
            },
        ],
        tripServiceId: chosenTripServiceId.value, // надо chosenTripServiceId,
    }
    await store.orderCreate(requestParams)
})

const handleReturnToAvia = () => {
    router.push(`/${route.params.tripNumber}/air/price`)
}

const docsInformation = computed(() => {
    return person.value.documents.documents.find((item) => item.type === docs.value[type.value])
})

const birthdayDate = computed(() => {
    return person.value.info.birthdayDate ? new Date(person.value.info.birthdayDate).toISOString().slice(0, 10) : null
})

const disabledSaveButton = computed(() => {
    return Object.values(errors.value)?.some((item) => item) || !type.value
})
</script>

<style lang="scss" scoped>
.block-margin {
    margin: 0 0 24px 0 !important;
}

.grid__container {
    display: grid;
    width: 100%;
    column-gap: 30px;
    margin: 32px 0;
    grid-template-columns: minmax(100px, 370px) minmax(100px, 760px);
    grid-template-rows: repeat(2, auto);

    word-break: break-word;
}

.passanger__info {
    display: grid;
    gap: 24px;

    grid-template-columns: repeat(2, 1fr);
}

.patronymic {
    display: flex;
    flex-direction: column;
    //patronymic_margin
    &_margin {
        margin-bottom: 13px;
    }
}

.footer__btn {
    display: flex;
    width: 100%;
    justify-content: flex-end;
}

.flight-ticket {
    width: 32px;
    height: 32px;
}
.flight-ticket-back {
    transform: rotate(180deg);
}

.direction {
    width: 100%;
    text-align: center;
    display: flex;
}
.direction__title {
    max-width: 123px;
    width: 100%;
    text-align: start;
}
.icon__wrapper {
    width: 100%;
    position: relative;
    max-width: 565px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}
.icon__wrapper::before,
.icon__wrapper::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 50%;
    max-width: 242.5px;
    height: 1px;
    background: transparent;
    border-top: 1px dotted $color-gray-2;
}
.icon__wrapper::before {
    left: -24px;
}

.icon__wrapper::after {
    right: -24px;
}

.load-button {
    align-items: center;
    justify-content: center;
    min-width: 204px;
}

.button {
    margin-top: 0;
    padding: 12px 24px;
}

.item-fullwidth {
    grid-column: 1 / -1;

    display: flex;
    align-items: center;
    justify-content: start;

    padding: 16px;
    border-radius: 8px;
    background-color: $color-gray-6;
    word-break: break-word;
}
</style>
