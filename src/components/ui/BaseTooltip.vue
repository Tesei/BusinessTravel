<template>
    <div
        style="position: relative"
        @mouseenter="isShow = true"
        @mouseleave="isShow = false"
    >
        <slot></slot>
        <div
            :class="mainClasses"
            :style="{ ...position, visibility: isShow ? 'visible' : 'hidden' }"
            style="cursor: default"
        >
            <p
                v-if="title"
                class="font-button_S tooltip__title"
            >
                {{ title }}
            </p>
            <p
                v-for="(textBlock, index) in text"
                :key="index"
            >
                {{ textBlock }}
            </p>
            <template v-if="iconBlocks.length">
                <div
                    class="tooltip__text"
                    v-for="(iconBlock, index) in iconBlocks"
                    :key="index"
                >
                    <div
                        class="line"
                        :class="`line_${iconBlock.lineColor}`"
                    ></div>
                    <icon-sprite
                        :name="iconBlock.icon"
                        :class-name="font === 'footnote_L' ? 'mr-8 icon-tableware' : 'mr-8 icon-tableware_small'"
                    ></icon-sprite>
                    {{ iconBlock.text }}
                </div>
            </template>
            <template v-if="doubleTextBlocks.length">
                <div
                    class="tooltip__text"
                    v-for="(doubleTextBlock, index) in doubleTextBlocks"
                    :key="index"
                >
                    <div
                        class="line"
                        :class="`line_${doubleTextBlock.lineColor}`"
                    ></div>
                    <div>
                        <p
                            v-for="(text, index) in doubleTextBlock.texts"
                            :key="index"
                            class="text"
                        >
                            {{ text }}
                        </p>
                    </div>
                </div>
            </template>
            <div v-if="showLink">
                <a
                    :href="reference.href"
                    :class="font"
                    >{{ reference.text }}</a
                >
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, defineProps, onMounted, reactive, ref } from 'vue'
import IconSprite from '@/components/interface/IconSprite.vue'
/**
 @param {string} type - Тип тултипа (basic, side) required
 @param {string} font - Размер Шрифта (footnote_S, footnote_M, footnote_L) required
 @param {number} range - Расстояние от родителя required
 @param {string} title - Текст заголовка optional
 @param {array} text - Массив текстов для тултипа optional
 @param {object} reference - Объект ссылки (target - _blank или _self, href - ссылка, text - текст ссылки) optional
 @param {array} iconBlocks - Массив блоков с icon (состоит из объектов с полями: text - текст блока, lineColor - цвет линии ('green', 'yellow', 'orange', 'red'), icon - id иконки из sprite.svg) optional
 @param {array} doubleTextBlocks - Массив блоков с простым текстом (состоит из объектов с полями: texts - массив текстов блока, lineColor - цвет линии ('green', 'yellow', 'orange', 'red')) optional
 **/
const props = defineProps({
    type: {
        type: String,
        required: true,
        validator(value) {
            return ['basic', 'side'].includes(value)
        },
    },
    font: {
        type: String,
        required: true,
        validator(value) {
            return ['footnote_S', 'footnote_M', 'footnote_L'].includes(value)
        },
    },
    range: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        default: '',
    },
    text: {
        type: Array,
        default: () => [],
    },
    reference: {
        type: Object,
        default: () => {},
        validator(value) {
            if (!Object.keys(value).length) return true
            else {
                return !(!value.target || !['_self', '_blank'].includes(value.target) || !value.href || !value.text)
            }
        },
    },
    iconBlocks: {
        type: Array,
        default: () => [],
        validator(value) {
            if (!value.length) return true
            else {
                return !(
                    value.some((el) => !el.text) ||
                    value.some((el) => !['green', 'yellow', 'orange', 'red'].includes(el.lineColor)) ||
                    value.some((el) => !el.icon)
                )
            }
        },
    },
    doubleTextBlocks: {
        type: Array,
        default: () => [],
        validator(value) {
            if (!value.length) return true
            else {
                return !(
                    value.some((el) => !el.texts || !el.texts.length) ||
                    value.some((el) => !['green', 'yellow', 'orange', 'red'].includes(el.lineColor))
                )
            }
        },
    },
})

const isShow = ref(false)
const position = reactive({ position: 'absolute' })

const mainClasses = computed(() => {
    if (props.type === 'basic') return `tooltip tr-all-2 ${props.font}`
    if (props.type === 'side') return `tooltip__right tr-all-2 ${props.font}`
    else return ''
})

const showLink = computed(() => {
    return props.reference?.text && props.reference?.href && props.reference?.target
})
const init = () => {
    if (props.type === 'basic') {
        position.bottom = `calc(100% + 8px + ${props.range}px)`
        position.right = '50%'
        position.transform = 'translateX(50%)'
    }
    if (props.type === 'side') {
        position.right = `calc(100% + 8px + ${props.range}px)`
        position.bottom = '50%'
        position.transform = 'translateY(50%)'
    }
}

onMounted(() => {
    init()
})
</script>

<style scoped lang="scss">
// TODO Убрать стили после доработки UI KIT
.tooltip {
    z-index: 1;
    overflow-wrap: break-word;
}
.tooltip:after {
    position: absolute;
    content: '';
    left: 50%;
    top: 100%;
    border-top: 8px solid $color-white;
    border-right: 7px solid transparent;
    border-left: 7px solid transparent;
    border-bottom: none;
    transform: translateX(-50%);
}
.tooltip__right {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.tooltip__right:after {
    position: absolute;
    content: '';
    left: 100%;
    top: 50%;
    border-top: 7px solid transparent;
    border-bottom: 7px solid transparent;
    border-right: none;
    border-left: 8px solid $color-white;
    transform: translateY(-50%);
}
</style>
