<template>
    <div class="wrapper m-0">
        <span class="title Heading_3 pb-16"> {{ tariffName }} </span>
        <div class="tariff__items flex flex-d-c">
            <div class="tariff__item mb-12 flex ai-c">
                <IconSprite
                    :name="'tariff--Property-1=' + imageName.carryOn"
                    className="icon__svg"
                />
                <span class="footnote_L">{{ tariffCarryOn }}</span>
            </div>
            <div class="tariff__item mb-12 flex ai-c">
                <IconSprite
                    :name="'tariff--Property-1=' + imageName.baggage"
                    className="icon__svg"
                />
                <span class="footnote_L">{{ tariffBaggageAmount }}</span>
            </div>
            <div class="tariff__item mb-12 flex ai-c">
                <IconSprite
                    :name="'tariff--Property-1=' + imageName.changeable"
                    className="icon__svg"
                />
                <span class="footnote_L">{{ tariffChangeableType }}</span>
            </div>
            <div class="tariff__item flex ai-c">
                <IconSprite
                    :name="'tariff--Property-1=' + imageName.refundable"
                    className="icon__svg"
                />
                <span class="footnote_L">{{ tariffRefundableType }}</span>
            </div>
        </div>
        <div class="line"></div>
        <div class="flex ai-c jc-sb">
            <div class="c-gray footnote_L">Итого</div>
            <div class="price Heading_4">{{ tariffPrice.toLocaleString() }} ₽</div>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue'
import IconSprite from '@/components/interface/IconSprite.vue'
import { useAirSearchStore } from '@/store/airSearch'
import { storeToRefs } from 'pinia'

const props = defineProps({
    isDisable: {
        type: Boolean,
        default: false,
    },
})

const store = useAirSearchStore()
const { tariff } = storeToRefs(store)

const tariffName = computed(() => {
    return tariff.value.brandName || 'Тариф'
})

//  кол-во мест сдаваемого багажа
const tariffBaggage = computed(() => {
    return tariff.value.details
        .flatMap((detail) => {
            return detail.segments.map((segment) => {
                return segment.baggageCount
            })
        })
        .join(', ')
})

const tariffBaggageWeight = computed(() => {
    return tariff.value.details
        .flatMap((detail) => {
            return detail.segments.map((segment) => {
                if (segment.baggageMaxWeight) {
                    return `${segment.baggageMaxWeight.value} ${segment.baggageMaxWeight.unit}`
                } else {
                    return ''
                }
            })
        })
        .join(', ')
})

const tariffBaggageAmount = computed(() => {
    if (tariffBaggage.value === null && tariffBaggageWeight.value === null) {
        return 'Нет информации по сервису'
    } else {
        if (tariffBaggage.value && tariffBaggageWeight.value) return `Багаж ${tariffBaggageWeight.value}`
        else if (tariffBaggage.value === 0 && tariffBaggageWeight.value) return `Багаж ${tariffBaggageWeight.value} платный`
        else return 'Без багажа'
    }
})
const tariffCarryOn = computed(() => {
    const tariffCarryOnCount = tariff.value.details
        .flatMap((detail) => {
            return detail.segments.map((segment) => {
                return segment.carryOnCount
            })
        })
        .join(', ')

    if (tariffCarryOnCount === null) {
        return 'Нет информации по сервису'
    } else {
        return 'Ручная кладь'
    }
})

const tariffChangeableType = computed(() => {
    const type = tariff.value.changeableType

    if (type === 'Changeable') return 'Доступен обмен'
    else if (type === 'NonChangeable') return 'Без обмена'
    else return 'Обмен платный'
})

const tariffRefundableType = computed(() => {
    const type = tariff.value.refundableType

    if (type === 'Refundable') return 'Доступен возврат'
    else if (type === 'NonRefundable') return 'Без возврата'
    else return 'Возврат платный'
})
const tariffPrice = computed(() => {
    return tariff.value.totalPrice
})
const imageName = computed(() => {
    // included, notIncluded, paid
    const getStatus = (value, defaultValue) => {
        if (value.toLowerCase().includes('без')) return 'close'
        if (value.toLowerCase().includes('платный')) return 'rubel'
        return defaultValue
    }

    return {
        baggage: getStatus(tariffBaggageAmount.value, 'Default'),
        carryOn: tariffCarryOn.value.toLowerCase().includes('нет информации по сервису') ? 'close' : 'Default',
        refundable: getStatus(tariffRefundableType.value, 'Default'),
        changeable: getStatus(tariffChangeableType.value, 'Default'),
    }
})
</script>
<style scoped lang="scss">
.tariff__items:last-of-type {
    margin-bottom: 0;
}
.icon__svg {
    width: 20px;
    height: 20px;
}
.line {
    width: 100%;
    margin: 12px 0px;
    border-top: 1px solid $color-gray-3;
}
</style>
