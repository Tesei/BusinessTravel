<template>
    <base-wrapper-component :is-show-button="false">
        <template #title>Подтверждение данных</template>
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
                        class="mb-24"
                    >
                        <div class="flex ai-c">
                            <div>
                                <IconSprite
                                    name="common--time"
                                    className="icon__svg"
                                    :class="{ 'c-red': time === '00:00' }"
                                />
                            </div>
                            <div
                                class="Heading_3"
                                :class="{ 'c-red': time === '00:00' }"
                            >
                                {{ time }}
                            </div>
                        </div>
                        <div class="lines"></div>
                        <div class="flex flex-d-c">
                            <div class="footnote_L c-gray mb-8">Номер бронирования PNR</div>
                            <div class="body_S">{{ order?.pnr }}</div>
                        </div>
                    </base-wrapper-gray-border>
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
                    <div
                        v-for="(passenger, index) in passangers"
                        :key="index"
                    >
                        <h4 class="Heading_4 mb-24">Информация о пассажире</h4>
                        <div class="passanger__info">
                            <div class="flex flex-d-c">
                                <div class="footnote_L c-gray mb-8">ФИО пассажира на кириллице</div>
                                <div class="body_S">
                                    {{ passenger.lastName }} {{ passenger.firstName }} {{ passenger.middleName }}
                                </div>
                            </div>
                            <div class="flex flex-d-c">
                                <div class="footnote_L c-gray mb-8">ФИО пассажира на латинице</div>
                                <div class="body_S">
                                    {{ passenger.lastNameTransliteration }} {{ passenger.firstNameTransliteration }}
                                    {{ passenger.middleNameTransliteration }}
                                </div>
                            </div>
                            <div class="flex flex-d-c">
                                <div class="footnote_L c-gray mb-8">Дата рождения пассажира</div>
                                <div class="body_S">{{ dayjs(passenger.dateOfBirth).format('DD.MM.YYYY') }}</div>
                            </div>
                            <div class="flex flex-d-c">
                                <div class="footnote_L c-gray mb-8">Пол</div>
                                <div class="body_S">{{ passenger.gender === 'Male' ? 'Мужской' : 'Женский' }}</div>
                            </div>
                        </div>
                        <h4 class="Heading_4 mb-24 mt-24">Документ, удостоверяющий личность</h4>
                        <div class="passanger__info">
                            <div class="flex flex-d-c">
                                <div class="footnote_L c-gray mb-8">Тип документа</div>
                                <div class="body_S">
                                    {{ docs[passenger.documentType] }}
                                </div>
                            </div>
                            <div class="flex flex-d-c">
                                <div class="footnote_L c-gray mb-8">Серия и номер документа</div>
                                <div class="body_S">
                                    {{ tomaskedNumber(passenger) }}
                                </div>
                            </div>
                            <div class="flex flex-d-c">
                                <div class="footnote_L c-gray mb-8">Срок действия</div>
                                <div class="body_S">{{ dayjs(passenger.documentExpirationDate).format('DD.MM.YYYY') }}</div>
                            </div>
                            <div class="flex flex-d-c">
                                <div class="footnote_L c-gray mb-8">Гражданство</div>
                                <div class="body_S">{{ passenger.documentIssuerCountryCode }}</div>
                            </div>
                            <div class="flex flex-d-c">
                                <div class="footnote_L c-gray mb-8">Телефон</div>
                                <div class="body_S">{{ tomaskedPhone(passenger.phone) }}</div>
                            </div>
                            <div class="flex flex-d-c">
                                <div class="footnote_L c-gray mb-8">Электронная почта</div>
                                <div class="body_S">{{ passenger.email }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="footer__btn">
                        <base-button
                            classNames="font-button_M button button__create button_transparent mt-0 decline-button"
                            :toShowLoading="preloader"
                            :disabled="loader"
                            @click="decline"
                            >Отменить бронирование</base-button
                        >
                        <base-button
                            classNames="font-button_M button button_save button_blue order-button"
                            :toShowLoading="loader"
                            @click="confirm"
                            >Подтвердить покупку</base-button
                        >
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
import BaseButton from '@ui/buttons/BaseButton.vue'
import OrderTariffItem from '@/components/airSearch/order/OrderTariffItem.vue'

import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useAirSearchStore } from '@/store/airSearch'
import { storeToRefs } from 'pinia'
import OrderAirTicket from '@/components/airSearch/order/OrderAirTicket.vue'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

const route = useRoute()
const router = useRouter()

const store = useAirSearchStore()

const { order, tariffs, preloader, loader } = storeToRefs(store)

const time = ref('')
const intervalId = ref(null)

onMounted(() => {
    const endDate = dayjs.utc(order.value.ticketingTimeLimit).format('YYYY-MM-DD HH:mm:ss')
    const currentDate = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const endTime = dayjs(order.value.ticketingTimeLimit)

    if (dayjs(endDate).isBefore(dayjs(currentDate))) {
        time.value = '00:00'
        return
    }

    intervalId.value = setInterval(() => {
        time.value = dayjs.utc(endTime.diff(dayjs())).format('mm:ss')
        if (time.value == '00:00') {
            clearInterval(intervalId.value)
        }
    }, 1000)
})
onUnmounted(() => {
    clearInterval(intervalId.value)
})

const docs = ref({
    RussianFederationPassport: 'Паспорт РФ',
    RussianInternationalPassport: 'Заграничный паспорт РФ',
    ForeignPassport: 'Паспорт иностранного гражданина',
})

const tomaskedNumber = (pas) => {
    switch (pas.documentType) {
        case 'RussianFederationPassport':
            return `${pas.documentNumber.slice(0, 2)} ${pas.documentNumber.slice(2, 4)} ${pas.documentNumber.slice(4)}`
        case 'RussianInternationalPassport':
            return `${pas.documentNumber.slice(0, 2)} ${pas.documentNumber.slice(2)}`
        default:
            return `${pas.documentNumber.slice(0, 2)} ${pas.documentNumber.slice(2, 4)} ${pas.documentNumber.slice(4)}`
    }
}

const tomaskedPhone = (phone) => {
    return `${phone.slice(0, 2)} (${phone.slice(2, 5)}) ${phone.slice(5, 8)}-${phone.slice(8, 10)}-${phone.slice(10, 12)}`
}

const handleReturnToAvia = () => {
    router.push(`/${route.params.tripNumber}/air/price`)
}

const passangers = computed(() => {
    return order.value.passengers
})

const decline = async () => {
    await store.declineOrder(route.params.orderId)
}
const confirm = async () => {
    await store.confirmOrder(route.params.orderId)
}
</script>

<style lang="scss" scoped>
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
    margin-bottom: 24px;
    gap: 24px;
    width: 100%;
    grid-template-columns: repeat(2, 1fr);
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

.icon {
    width: 24px;
    height: 24px;
}

.lines {
    width: 100%;
    margin: 16px 0;
    border-top: 1px solid $color-gray-3;
}

.block-margin {
    margin: 0 0 24px 0;
}

.decline-button {
    align-items: center;
    justify-content: center;
    min-width: 254px;
    margin-right: 16px;
}

.order-button {
    align-items: center;
    justify-content: center;
    min-width: 225px;
}

.button {
    margin-top: 0;
    padding: 11px 24px;
}
</style>
