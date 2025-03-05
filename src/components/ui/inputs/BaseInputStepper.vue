<template>
    <div :style="{ width: `${width}px` }">
        <div class="flex ai-c">
            <div
                class="input-number-stepper input-number-stepper_big"
                :class="{ 'input-number-stepper_error': isError, 'input-number-stepper_disabled': isDisabled }"
            >
                <button
                    class="input-number-stepper__btn"
                    @click="stepMinus"
                    :disabled="isDisabled"
                >
                    <icon-sprite
                        name="common--minus"
                        :className="iconMinusStyles"
                    />
                </button>
                <input
                    class="input-number-stepper__input font-button_M ellipsis"
                    type="number"
                    aria-label="input-number-stepper"
                    :disabled="isDisabled"
                    :value="!isPlaceholderShow ? inputValue : ''"
                    :placeholder="placeholder"
                    @blur="handleBlur($event.target.value)"
                    onkeydown="javascript: return ['Backspace','Delete','ArrowLeft','ArrowRight'].includes(event.code) ? true : !isNaN(Number(event.key)) &amp;&amp; event.code!=='Space'"
                />
                <button
                    class="input-number-stepper__btn"
                    @click="stepPlus"
                    :disabled="isDisabled"
                >
                    <icon-sprite
                        name="common--plus"
                        :className="iconPlusStyles"
                    />
                </button>
            </div>
            <div class="ml-8">
                <base-tooltip
                    v-if="isIconShow"
                    class="stepper__tooltip"
                    :type="tooltip.type"
                    :font="tooltip.font"
                    :range="tooltip.range"
                    :title="tooltip.title"
                    :text="tooltip.text"
                    :reference="tooltip.reference"
                    :icon-blocks="tooltip.iconBlocks"
                    :double-text-blocks="tooltip.doubleTextBlocks"
                >
                    <icon-sprite
                        name="common--info"
                        class="stepper__icon c-gray pointer"
                    />
                </base-tooltip>
            </div>
        </div>
        <div
            class="input-number-stepper__description footnote_M_S"
            :class="{ 'input-number-stepper__error': isError }"
        >
            {{ labelText }}
        </div>
    </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import IconSprite from '@/components/interface/IconSprite.vue'
import BaseTooltip from '@/components/ui/BaseTooltip.vue'

/**
 * @property {Number} width  ширина степпера
 * @property {Number} minValue минимальное допустимое значение
 * @property {Number} currentValue текущее значение инпута
 * @property {Number} maxValue максимальное допустимое значение
 * @property {Number} step шаг изменения значения инпута
 * @property {String} height высота степпера:
 *                                          .input-number-stepper_big - 56px
 *                                          .input-number-stepper_middle - 48px
 *                                          .input-number-stepper_small - 40px
 * @property {Boolean} isError есть ли ошибка
 * @property {String} labelText текст внизу степпера
 * @property {Boolean} isDisabled задизейблен ли степпер
 * @property {String} placeholder плейсхолдер инпута
 * @property {Boolean} isIconShow иконка тултипа информации рядом со степпером
 *  * @property {Object} tooltip тултип при наведении на иконку информации
 *
 *
 */

const props = defineProps({
    width: {
        type: Number,
        required: true,
        default: 128,
    },
    height: {
        type: String,
        required: false,
        default: 'input-number-stepper_big',
        validator(value) {
            return ['input-number-stepper_big', 'input-number-stepper_middle', 'input-number-stepper_small'].includes(value)
        },
    },
    minValue: {
        type: Number,
        required: true,
        default: 0,
    },
    currentValue: {
        type: Number,
        required: false,
    },
    maxValue: {
        type: Number,
        required: true,
        default: 100,
    },
    step: {
        type: Number,
        required: true,
        default: 1,
    },
    isError: {
        type: Boolean,
        required: false,
        default: false,
    },
    labelText: {
        type: String,
        required: false,
        default: '',
    },
    isDisabled: {
        type: Boolean,
        required: false,
        default: false,
    },
    placeholder: {
        type: String,
        required: false,
        default: '',
    },
    isIconShow: {
        type: Boolean,
        required: false,
        default: false,
    },
    tooltip: {
        type: Object,
        required: false,
    },
})

const inputValue = ref(props.currentValue ? props.currentValue : props.minValue)
const isPlaceholderShow = ref(false)

const inputValueModel = defineModel()

const stepMinus = () => {
    if (inputValue.value > props.minValue && !props.isDisabled) {
        isPlaceholderShow.value = false
        inputValue.value -= props.step
        inputValueModel.value = inputValue.value
    }
}
const stepPlus = () => {
    if (inputValue.value < props.maxValue && !props.isDisabled) {
        isPlaceholderShow.value = false
        inputValue.value += props.step
        inputValueModel.value = inputValue.value
    }
}
const disabledButtons = computed(() => {
    const values = {
        isMinusDisabled: false,
        isPlusDisabled: false,
    }
    if (inputValue.value <= props.minValue) {
        values.isMinusDisabled = true
    } else {
        values.isMinusDisabled = false
    }

    if (inputValue.value >= props.maxValue) {
        values.isPlusDisabled = true
    } else {
        values.isPlusDisabled = false
    }

    return values
})
const handleBlur = (value) => {
    console.log(value)
    inputValue.value = 0
    if (value > props.maxValue) {
        inputValue.value = props.maxValue
        inputValueModel.value = inputValue.value
        value
    } else if (value < props.minValue) {
        inputValue.value = props.minValue
        inputValueModel.value = inputValue.value
    }
}
const iconMinusStyles = computed(() => {
    return `${disabledButtons.value.isMinusDisabled || props.isDisabled ? 'c-gray-4' : 'c-cornflower'} input-number-stepper__icon`
})
const iconPlusStyles = computed(() => {
    return `${disabledButtons.value.isPlusDisabled || props.isDisabled ? 'c-gray-4' : 'c-cornflower'} input-number-stepper__icon`
})
onMounted(() => {
    if (props.placeholder) {
        isPlaceholderShow.value = true
    }
})
</script>
<style scoped>
.input-number-stepper__description {
    position: relative;
    margin-top: 4px;
}
.stepper__icon {
    width: 24px;
    height: 24px;
}
.stepper__tooltip {
    text-align: center;
}
</style>
