<template>
    <header><h1 class="hello-title">Tooltips (hover on red circles)</h1></header>
    <div
        class="flex jc-c"
        style="width: 100%; height: 100vh; flex-wrap: wrap; align-content: flex-start; max-width: 1170px; margin: 0 auto"
    >
        <div
            v-for="(tooltip, index) in tooltipsProps"
            class="flex ai-c jc-c"
            style="width: 300px; height: 300px"
            :key="index"
        >
            <base-tooltip
                :type="tooltip.type"
                :font="tooltip.font"
                :range="tooltip.range"
                :title="tooltip.title"
                :text="tooltip.text"
                :reference="tooltip.reference"
                :icon-blocks="tooltip.iconBlocks"
                :double-text-blocks="tooltip.doubleTextBlocks"
            >
                <div
                    class="bg-red radius-50p pointer"
                    style="width: 16px; height: 16px"
                ></div>
            </base-tooltip>
        </div>
    </div>
</template>

<script setup>
import BaseTooltip from '@ui/BaseTooltip.vue'
import { reactive } from 'vue'
const tooltipsProps = reactive([
    {
        type: 'basic',
        font: 'footnote_S',
        range: 8,
        text: ['Длительная пересадка'],
    },
    {
        type: 'basic',
        font: 'footnote_M',
        range: 8,
        text: ['Длительная пересадка'],
    },
    {
        type: 'basic',
        font: 'footnote_L',
        range: 8,
        text: ['Длительная пересадка'],
    },
    {
        type: 'basic',
        font: 'footnote_M',
        title: 'Заголовок',
        range: 8,
        text: ['Длительная пересадка'],
    },
    {
        type: 'basic',
        font: 'footnote_M',
        title: 'Заголовок',
        range: 8,
        text: ['Длительная пересадка', 'Длительная пересадка', 'Длительная пересадка'],
    },
    {
        type: 'basic',
        font: 'footnote_M',
        title: 'Заголовок',
        range: 8,
        text: ['Длительная пересадка', 'Длительная пересадка', 'Длительная пересадка'],
        reference: {
            text: 'Смотреть информацию о тарифах',
            href: '#',
            target: '_blank',
        },
    },
    {
        type: 'basic',
        font: 'footnote_S',
        range: 8,
        iconBlocks: [
            {
                lineColor: 'green',
                icon: 'hotel-facilities--food',
                text: 'Бесплатная отмена',
            },
            {
                lineColor: 'yellow',
                icon: 'hotel-facilities--food',
                text: 'Бесплатная отмена',
            },
            {
                lineColor: 'orange',
                icon: 'hotel-facilities--food',
                text: 'Бесплатная отмена',
            },
            {
                lineColor: 'red',
                icon: 'hotel-facilities--food',
                text: 'Бесплатная отмена',
            },
        ],
        reference: {
            text: 'Смотреть информацию о тарифах',
            href: '#',
            target: '_blank',
        },
    },
    {
        type: 'basic',
        font: 'footnote_M',
        range: 8,
        iconBlocks: [
            {
                lineColor: 'green',
                icon: 'hotel-facilities--food',
                text: 'Бесплатная отмена',
            },
            {
                lineColor: 'yellow',
                icon: 'hotel-facilities--food',
                text: 'Бесплатная отмена',
            },
            {
                lineColor: 'orange',
                icon: 'hotel-facilities--food',
                text: 'Бесплатная отмена',
            },
            {
                lineColor: 'red',
                icon: 'hotel-facilities--food',
                text: 'Бесплатная отмена',
            },
        ],
        reference: {
            text: 'Смотреть информацию о тарифах',
            href: '#',
            target: '_blank',
        },
    },
    {
        type: 'basic',
        font: 'footnote_L',
        range: 8,
        iconBlocks: [
            {
                lineColor: 'green',
                icon: 'hotel-facilities--food',
                text: 'Бесплатная отмена',
            },
            {
                lineColor: 'yellow',
                icon: 'hotel-facilities--food',
                text: 'Бесплатная отмена',
            },
            {
                lineColor: 'orange',
                icon: 'hotel-facilities--food',
                text: 'Бесплатная отмена',
            },
            {
                lineColor: 'red',
                icon: 'hotel-facilities--food',
                text: 'Бесплатная отмена',
            },
        ],
        reference: {
            text: 'Смотреть информацию о тарифах',
            href: '#',
            target: '_blank',
        },
    },
    {
        type: 'basic',
        font: 'footnote_S',
        range: 8,
        doubleTextBlocks: [
            {
                lineColor: 'green',
                texts: ['Бесплатная отмена', 'Бесплатная отмена'],
            },
            {
                lineColor: 'yellow',
                texts: ['Бесплатная отмена', 'Бесплатная отмена'],
            },
            {
                lineColor: 'orange',
                texts: ['Бесплатная отмена', 'Бесплатная отмена'],
            },
            {
                lineColor: 'red',
                texts: ['Бесплатная отмена', 'Бесплатная отмена'],
            },
        ],
        reference: {
            text: 'Смотреть информацию о тарифах',
            href: '#',
            target: '_blank',
        },
    },
    {
        type: 'basic',
        font: 'footnote_M',
        range: 8,
        doubleTextBlocks: [
            {
                lineColor: 'green',
                texts: ['Бесплатная отмена', 'Бесплатная отмена'],
            },
            {
                lineColor: 'yellow',
                texts: ['Бесплатная отмена', 'Бесплатная отмена'],
            },
            {
                lineColor: 'orange',
                texts: ['Бесплатная отмена', 'Бесплатная отмена'],
            },
            {
                lineColor: 'red',
                texts: ['Бесплатная отмена', 'Бесплатная отмена'],
            },
        ],
        reference: {
            text: 'Смотреть информацию о тарифах',
            href: '#',
            target: '_blank',
        },
    },
    {
        type: 'basic',
        font: 'footnote_L',
        range: 8,
        doubleTextBlocks: [
            {
                lineColor: 'green',
                texts: ['Бесплатная отмена', 'Бесплатная отмена'],
            },
            {
                lineColor: 'yellow',
                texts: ['Бесплатная отмена', 'Бесплатная отмена'],
            },
            {
                lineColor: 'orange',
                texts: ['Бесплатная отмена', 'Бесплатная отмена'],
            },
            {
                lineColor: 'red',
                texts: ['Бесплатная отмена', 'Бесплатная отмена'],
            },
        ],
        reference: {
            text: 'Смотреть информацию о тарифах',
            href: '#',
            target: '_blank',
        },
    },
    {
        type: 'side',
        font: 'footnote_S',
        range: 8,
        text: ['Text', 'Text', 'Text'],
    },
    {
        type: 'side',
        font: 'footnote_M',
        range: 8,
        text: ['Text', 'Text', 'Text'],
    },
    {
        type: 'side',
        font: 'footnote_L',
        range: 8,
        text: ['Text', 'Text', 'Text'],
    },
    {
        type: 'side',
        font: 'footnote_M',
        title: 'Заголовок',
        range: 8,
        text: ['Text'],
    },
    {
        type: 'side',
        font: 'footnote_M',
        title: 'Заголовок',
        range: 8,
        text: ['Text', 'Text', 'Text'],
    },
    {
        type: 'side',
        font: 'footnote_M',
        title: 'Заголовок',
        range: 8,
        text: ['Text', 'Text', 'Text'],
        reference: {
            text: 'Смотреть информацию о тарифах',
            href: '#',
            target: '_blank',
        },
    },
    {
        type: 'side',
        font: 'footnote_S',
        range: 8,
        iconBlocks: [
            {
                lineColor: 'green',
                icon: 'hotel-facilities--food',
                text: 'Бесплатная отмена',
            },
            {
                lineColor: 'yellow',
                icon: 'hotel-facilities--food',
                text: 'Бесплатная отмена',
            },
            {
                lineColor: 'orange',
                icon: 'hotel-facilities--food',
                text: 'Бесплатная отмена',
            },
            {
                lineColor: 'red',
                icon: 'hotel-facilities--food',
                text: 'Бесплатная отмена',
            },
        ],
        reference: {
            text: 'Смотреть информацию о тарифах',
            href: '#',
            target: '_blank',
        },
    },
    {
        type: 'side',
        font: 'footnote_M',
        range: 8,
        iconBlocks: [
            {
                lineColor: 'green',
                icon: 'hotel-facilities--food',
                text: 'Бесплатная отмена',
            },
            {
                lineColor: 'yellow',
                icon: 'hotel-facilities--food',
                text: 'Бесплатная отмена',
            },
            {
                lineColor: 'orange',
                icon: 'hotel-facilities--food',
                text: 'Бесплатная отмена',
            },
            {
                lineColor: 'red',
                icon: 'hotel-facilities--food',
                text: 'Бесплатная отмена',
            },
        ],
        reference: {
            text: 'Смотреть информацию о тарифах',
            href: '#',
            target: '_blank',
        },
    },
    {
        type: 'side',
        font: 'footnote_L',
        range: 8,
        iconBlocks: [
            {
                lineColor: 'green',
                icon: 'hotel-facilities--food',
                text: 'Бесплатная отмена',
            },
            {
                lineColor: 'yellow',
                icon: 'hotel-facilities--food',
                text: 'Бесплатная отмена',
            },
            {
                lineColor: 'orange',
                icon: 'hotel-facilities--food',
                text: 'Бесплатная отмена',
            },
            {
                lineColor: 'red',
                icon: 'hotel-facilities--food',
                text: 'Бесплатная отмена',
            },
        ],
        reference: {
            text: 'Смотреть информацию о тарифах',
            href: '#',
            target: '_blank',
        },
    },
    {
        type: 'side',
        font: 'footnote_S',
        range: 8,
        doubleTextBlocks: [
            {
                lineColor: 'green',
                texts: ['Бесплатная отмена', 'Бесплатная отмена'],
            },
            {
                lineColor: 'yellow',
                texts: ['Бесплатная отмена', 'Бесплатная отмена'],
            },
            {
                lineColor: 'orange',
                texts: ['Бесплатная отмена', 'Бесплатная отмена'],
            },
            {
                lineColor: 'red',
                texts: ['Бесплатная отмена', 'Бесплатная отмена'],
            },
        ],
        reference: {
            text: 'Смотреть информацию о тарифах',
            href: '#',
            target: '_blank',
        },
    },
    {
        type: 'side',
        font: 'footnote_M',
        range: 8,
        doubleTextBlocks: [
            {
                lineColor: 'green',
                texts: ['Бесплатная отмена', 'Бесплатная отмена'],
            },
            {
                lineColor: 'yellow',
                texts: ['Бесплатная отмена', 'Бесплатная отмена'],
            },
            {
                lineColor: 'orange',
                texts: ['Бесплатная отмена', 'Бесплатная отмена'],
            },
            {
                lineColor: 'red',
                texts: ['Бесплатная отмена', 'Бесплатная отмена'],
            },
        ],
        reference: {
            text: 'Смотреть информацию о тарифах',
            href: '#',
            target: '_blank',
        },
    },
    {
        type: 'side',
        font: 'footnote_L',
        range: 8,
        doubleTextBlocks: [
            {
                lineColor: 'green',
                texts: ['Бесплатная отмена', 'Бесплатная отмена'],
            },
            {
                lineColor: 'yellow',
                texts: ['Бесплатная отмена', 'Бесплатная отмена'],
            },
            {
                lineColor: 'orange',
                texts: ['Бесплатная отмена', 'Бесплатная отмена'],
            },
            {
                lineColor: 'red',
                texts: ['Бесплатная отмена', 'Бесплатная отмена'],
            },
        ],
        reference: {
            text: 'Смотреть информацию о тарифах',
            href: '#',
            target: '_blank',
        },
    },
])
</script>
