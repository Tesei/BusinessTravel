<template>
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
</template>
<script setup>
import { computed } from 'vue'
import IconSprite from '@/components/interface/IconSprite.vue'
const props = defineProps({
    tariff: {
        type: Object,
        required: true,
    },
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
const tariffBaggageAmount = computed(() => {
    if (!tariffBaggage.value && tariffBaggageWeightValue?.value === null) {
        return 'Нет информации по сервису'
    } else {
        if (tariffBaggage.value && tariffBaggageWeightValue?.value)
            return `Багаж ${tariffBaggageWeightValue?.value} ${tariffBaggageWeightUnit.value}`
        else if (tariffBaggage.value === 0 && tariffBaggageWeightValue?.value)
            return `Багаж ${tariffBaggageWeightValue?.value} ${tariffBaggageWeightUnit.value} платный`
        else return 'Без багажа'
    }
})
const tariffCarryOn = computed(() => {
    const tariffCarryOnCount = props.tariff.details
        .flatMap((detail) => {
            return detail.segments?.map((segment) => {
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
    const type = props.tariff.changeableType

    if (type === 'Changeable') return 'Доступен обмен'
    else if (type === 'NonChangeable') return 'Без обмена'
    else return 'Обмен платный'
})

const tariffRefundableType = computed(() => {
    const type = props.tariff.refundableType

    if (type === 'Refundable') return 'Доступен возврат'
    else if (type === 'NonRefundable') return 'Без возврата'
    else return 'Возврат платный'
})
const tariffBaggage = computed(() => {
    return props.tariff.details.map((detail) => {
        return detail.segments[0]?.baggageCount
    })[0]
})

const tariffBaggageWeightValue = computed(() => {
    return props.tariff.details.map((detail) => {
        if (detail.segments[0].baggageMaxWeight !== null) {
            return detail.segments[0].baggageMaxWeight?.value
        } else {
            return null
        }
    })[0]
})
const tariffBaggageWeightUnit = computed(() => {
    return props.tariff.details.flatMap((detail) => {
        if (detail.segments[0].baggageMaxWeight !== null) {
            return detail.segments[0].baggageMaxWeight?.unit
        } else {
            return null
        }
    })[0]
})
</script>
