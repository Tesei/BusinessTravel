<template>
    <div class="mb-80 mt-0 wrapper">
        <base-wrapper-gray-border
            class="wrapper mt-0 mb-24"
            className="full-width"
            v-for="(service, index) in serviceInfo"
            :key="index"
        >
            <div class="ticket__title flex ai-c mb-16">
                <h4 class="Heading_4 mr-12">Билет на самолет {{ totalPrice(service) }}&nbsp;₽</h4>
                <div class="ticket__status bg-turquoise-2 footnote_L pt-4 pb-4 pr-8 pl-8">{{ status(service) }}</div>
                <IconSprite
                    @click="downloadTicket(service)"
                    name="common--download"
                    className="icon__svg download__svg c-cornflower pointer"
                />
            </div>
            <div class="flex jc-sb">
                <div class="ticket__items mr-16">
                    <air-ticket
                        v-for="(direction, index) in mappedSegments(service)"
                        :key="index"
                        :class="{
                            'mb-16': isMultipleTickets(index, service),
                        }"
                        :direction="direction"
                        :airlines="airlines(service)"
                        :airports="airports(service)"
                        :equipments="equipments(service)"
                    ></air-ticket>
                </div>
                <tariff-included-items
                    class="ticket__tariff ai-fs mb-16"
                    :tariff="transformData(service)"
                />
            </div>
        </base-wrapper-gray-border>
        <base-skeleton
            v-if="isLoading && !serviceInfo"
            skeleton-height="320px"
        ></base-skeleton>
    </div>
</template>
<script setup>
import BaseWrapperGrayBorder from '@ui/wrapper/BaseWrapperGrayBorder.vue'
import IconSprite from '@/components/interface/IconSprite.vue'
import AirTicket from '@/components/airSearch/AirTicket.vue'
import TariffIncludedItems from '@/components/airSearch/TariffIncludedItems.vue'
import BaseSkeleton from '@ui/BaseSkeleton.vue'
import { onMounted, ref } from 'vue'
import { useTicketsStore } from '@/store/tickets/index.js'
const { fetchServiceById, fetchOrderById, downloadTicketById } = useTicketsStore()

const currentService = ref(null)
const serviceInfo = ref(null)
const orderInfo = ref(null)
const isLoading = ref(true)
const props = defineProps({
    tripServices: {
        type: Object,
        required: true,
    },
    tripNumber: {
        type: String,
        required: true,
        default: '',
    },
})
const totalPrice = (service) => {
    return service?.orderDetails.totalAmount.toLocaleString('ru')
}
const status = (service) => {
    return service?.status === 'Ordered' ? 'Куплено' : ''
}
const mappedSegments = (service) => {
    return service.serviceDetails.route.segments.flatMap((el) => {
        const segment = el
        return {
            segments: [
                {
                    key: segment.id,
                    origin: segment.departureAirportCode, // Код аэропорта отправления
                    destination: segment.arrivalAirportCode, // Код аэропорта прибытия
                    departureDate: segment.departureDateTime, // Дата отправления
                    arrivalDate: segment.arrivalDateTime, // Дата прибытия
                    departureTerminal: segment.departureTerminal, // Терминал отправления
                    arrivalTerminal: segment.arrivalTerminal, // Терминал прибытия
                    carrier: segment.carrierCode, // Код перевозчика
                    flightNumber: segment.flightNumber, // Номер рейса
                    equipment: segment.equipmentCode, // Код оборудования
                    flightTime: segment.travelTime, // Время полета
                    operatingCarrier: segment.operatingCarrierCode, // Код оператора
                    operatingFlightNumber: segment.flightNumber, // Номер рейса оператора
                    landingsSegments: segment.landingSegments, // Сегменты приземления
                },
            ],
        }
    })
}
const airlines = (service) => {
    return service?.serviceDetails.route.segments.map((segment) => ({
        code: segment.carrierCode,
        name: segment.carrierName,
        internationalName: segment.carrierName,
    }))
}
const airports = (service) => {
    if (!service) return
    const departureAirport = service?.serviceDetails.route.segments.map((segment) => ({
        code: segment.departureAirportCode,
        name: segment.departureAirportName,
        internationalName: segment.departureAirportName,
        cityCode: segment.departureCityCode,
        cityName: segment.departureCityName,
        internationalCityName: segment.departureCityName,
    }))
    const arrivalAirport = service?.serviceDetails.route.segments.map((segment) => ({
        code: segment.arrivalAirportCode,
        name: segment.arrivalAirportName,
        internationalName: segment.arrivalAirportName,
        cityCode: segment.arrivalCityCode,
        cityName: segment.arrivalCityName,
        internationalCityName: segment.arrivalCityName,
    }))
    return [...departureAirport, ...arrivalAirport]
}
const equipments = (service) => {
    if (!service) return
    return service?.serviceDetails.route.segments.map((segment) => ({
        code: segment.equipmentCode,
        internationalName: segment.equipmentName,
    }))
}
const transformData = (service) => {
    const segments = {
        changeableType: service.serviceDetails.changeableType,
        refundableType: service.serviceDetails.refundableType,
        details: service.serviceDetails.passengerSegments.map((segment) => ({
            segments: [
                {
                    baggageCount: segment.baggageCount,
                    baggageMaxWeight: {
                        value: segment.baggageMaxWeight.value || null,
                        unit: segment.baggageMaxWeight.unit || null,
                    },
                    carryOnCount: segment.carryOnCount,
                },
            ],
        })),
    }

    return segments
}
const isMultipleTickets = (index, service) => {
    return index !== mappedSegments(service).length && mappedSegments(service).length > 1
}
const downloadTicket = async (service) => {
    if (!serviceInfo.value) {
        return
    }
    try {
        await downloadTicketById(service.orderDetails.orderId)
    } catch (error) {
        console.error('Error downloading ticket:', error)
    }
}
onMounted(async () => {
    try {
        currentService.value = props.tripServices?.filter((el) => el.status === 'Ordered') || []

        if (currentService?.value?.length > 0) {
            serviceInfo.value = await Promise.all(
                currentService.value.map((el) => fetchServiceById(props.tripNumber, el.tripServiceId)),
            )
        }
        if (serviceInfo?.value?.length > 0) {
            orderInfo.value = await Promise.all(serviceInfo.value.map((el) => fetchOrderById(el.orderDetails.orderId)))
        }
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error)
    } finally {
        isLoading.value = false
    }
})
</script>
<style scoped>
.wrapper {
    max-width: 770px;
    width: 100%;
    overflow: visible;
}
.ticket__status {
    max-width: fit-content;
}
.download__svg {
    margin-left: auto;
}
.ticket__tariff {
    width: 176px;
    height: 100%;
    align-self: self-end;
}
.ticket__items {
    width: 100%;
    max-width: 530px;
}
</style>
