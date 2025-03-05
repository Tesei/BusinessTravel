<template>
    <base-tooltip
        v-if="isTariffDisabled"
        :range="-23"
        font="footnote_M"
        type="basic"
        :text="['Вне лимита']"
        ><div class="tooltip-block"></div
    ></base-tooltip>
    <div
        class="wrapper p-24 radius-12"
        :class="{
            disable: isTariffDisabled,
            active: isSelected && !isTariffDisabled,
        }"
        @click="changeCurrentTariff"
    >
        <span class="title Heading_4 pb-16"> {{ tariffName }} </span>
        <tariff-included-items :tariff="tariff.item" />
        <span class="price mt-32 Heading_4">{{ tariffPrice.toLocaleString() }} ₽</span>
    </div>
</template>
<script setup>
import { computed, defineEmits } from 'vue'
import BaseTooltip from '@ui/BaseTooltip.vue'
import TariffIncludedItems from '@/components/airSearch/TariffIncludedItems.vue'
import { useAirSearchStore } from '@/store/airSearch/index.js'
const { tripLimit } = useAirSearchStore()

const emit = defineEmits(['selectedTariff'])

const props = defineProps({
    isDisable: {
        type: Boolean,
        default: false,
    },
    tariff: {
        type: Object,
        required: true,
    },
    isSelected: {
        type: Boolean,
        required: true,
        default: false,
    },
})

const tariffName = computed(() => {
    return props.tariff.item.brandName ? props.tariff.item.brandName : `Тариф #${props.tariff.tariffIndex + 1}`
})

const tariffPrice = computed(() => {
    return props.tariff.item.totalPrice
})
const changeCurrentTariff = () => {
    if (props.tariff.item.totalPrice > tripLimit) {
        return
    }
    emit('selectedTariff', props.tariff.item.totalPrice)
}
const isTariffDisabled = computed(() => {
    return props.tariff.item.totalPrice > tripLimit ? true : false
})
</script>
<style scoped lang="scss">
.wrapper {
    border: 1px solid $color-gray-3;
    max-width: 230px;
    margin: 0;
    &:hover {
        cursor: pointer;
        transition: all 0.2s;
    }
}
.tooltip-block {
    position: absolute;
    width: 100%;
    height: 100%;
    height: 267px;
    cursor: pointer;
    z-index: 2;
}
.active {
    border-color: $color-cornflower;
}
.tariff__items:last-of-type {
    margin-bottom: 0;
}
.disable {
    opacity: 0.5;
}
.icon__svg {
    width: 20px;
    height: 20px;
}
</style>
