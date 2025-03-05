<template>
    <div
        :class="isActive ? mainClass + 'base-select-active' : mainClass + ''"
        v-click-outside="outside"
        @click="changeModel"
    >
        <IconSprite
            v-if="icon.withIcon"
            :name="icon.name"
            :className="iconClasses"
        />
        <div
            v-if="label"
            class="base-select__label tr-all-3"
            :class="labelClasses"
        >
            {{ label }}
        </div>
        <div
            v-if="value"
            class="base-select__value"
            :class="valueClasses"
        >
            <slot name="countryFlag"></slot>
            <span>{{ value }}</span>
        </div>
        <IconSprite
            name="common--arrow-down-big"
            :className="iconClasses"
            v-bind="$attrs"
        />
        <div
            @click.stop
            v-if="error"
            class="base-select__error"
            :class="type === 'basic' ? 'footnote_S' : type === 'big' ? 'footnote_M' : ''"
        >
            {{ error }}
        </div>
        <slot></slot>
    </div>
</template>

<script setup>
import { defineProps, computed, defineModel, useAttrs } from 'vue'
import IconSprite from '@/components/interface/IconSprite.vue'

/**
 * @property {String} type Тип селекта (mini, basic, big).
 * @property {String} label Текст label.
 * @property {String} value Текст value.
 * @property {Boolean} disabled Заблокирован или нет.
 * @property {String} error Текст сообщения об ошибке.
 * @property {Boolean} withDropdown Будет ли использоваться Droplist (для корректной работы click-outside).
 * @property {Boolean} icon  Иконка перед value. withIcon-есть ли иконка, name - id svg иконки
 */
const props = defineProps({
    type: {
        type: String,
        required: true,
        validator(value) {
            return ['mini', 'basic', 'big'].includes(value)
        },
    },
    label: {
        type: String,
        validator(value, props) {
            if (props.type === 'mini') {
                return !value
            }
            if (props.type === 'basic' || props.type === 'big') return true
        },
    },
    value: {
        type: String,
    },
    disabled: {
        type: Boolean,
    },
    error: {
        type: String,
        validator(value, props) {
            if (props.type === 'mini') {
                return !value
            }
            if (props.type === 'basic' || props.type === 'big') return true
        },
    },
    withDropdown: {
        type: Boolean,
        required: true,
    },
    isRequired: {
        type: Boolean,
        default: false,
    },
    icon: {
        type: Object,
        default: () => {
            return {
                withIcon: false,
                name: '',
            }
        },
    },
})
// Управление состоянием isActive родителя
const isActive = defineModel({ type: Boolean, required: true })

const { labelFont } = useAttrs()

const emit = defineEmits(['blur'])

const mainClass = computed(() => {
    let classes = 'base-select '
    if (props.type === 'mini') classes = classes + 'base-select-mini '
    if (props.type === 'basic') classes = classes + 'base-select-basic radius-8 '
    if (props.type === 'big') classes = classes + 'base-select-big radius-8 '
    if (props.disabled) classes = classes + 'base-select-disabled '
    if (props.error) classes = classes + 'base-select-error '
    return classes
})

const labelClasses = computed(() => {
    if (props.type === 'basic') {
        if (props.isRequired) {
            return props.value ? 'footnote_S active required' : 'footnote_L required'
        } else {
            return props.value ? 'footnote_S active' : 'footnote_L'
        }
    }
    if (props.type === 'big') {
        let font = labelFont ? labelFont : 'footnote_M_S'
        if (props.isRequired) {
            return props.value ? font + ' active required' : 'body_S required'
        } else {
            return props.value ? font + ' active' : 'body_S'
        }
    } else return ''
})

const valueClasses = computed(() => {
    if (props.type === 'basic' || props.type === 'mini') {
        return props.label ? 'footnote_L active' : 'footnote_L'
    }
    if (props.type === 'big') {
        return props.label ? 'body_S active' : 'body_S'
    } else return ''
})

const iconClasses = computed(() => {
    if (props.type === 'mini') {
        return props.value ? 'base-select__icon tr-all-3 ml-4' : 'base-select__icon tr-all-3'
    } else return 'base-select__icon tr-all-3 ml-8'
})

const changeModel = () => {
    if (!props.disabled) isActive.value = !isActive.value
    if (isActive.value) emit('blur')
}
const outside = () => {
    if (props.withDropdown) isActive.value = false
    if (isActive.value) emit('blur')
}
</script>

<style lang="scss" scoped>
// TODO Убрать стили после исправления UI KIT
.base-select {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    cursor: pointer;
    color: $color-black;
    position: relative;

    &__icon {
        flex-basis: 24px;
        flex-shrink: 0;
        width: 24px;
        height: 24px;
    }
}

.base-select-mini {
    height: 24px;
    .base-select__value {
        white-space: nowrap;
        overflow: hidden;
    }
}

.base-select-basic {
    border: 1px solid $color-gray-9;
    padding: 12px;
    height: 44px;
    .base-select__value {
        white-space: nowrap;
        color: $color-black;
        overflow: hidden;
        display: flex;
        align-items: center;
    }
    .base-select__value.active {
        transform: translateY(8px);
    }
    .base-select__label {
        white-space: nowrap;
        color: $color-black;
        overflow: hidden;
        min-width: 46px;
    }
    .base-select__label.active {
        position: absolute;
        top: 5px;
        left: 12px;
        color: $color-gray;
        max-width: calc(100% - 48px);
    }
    &:hover {
        border: 1px solid $color-gray-2;
    }
}
.required::after {
    content: '*';
    color: $color-red;
    top: -1px;
    left: 0;
    position: relative;
}

.base-select-big {
    border: 1px solid $color-gray-9;
    padding: 16px;
    height: 56px;
    .base-select__value {
        white-space: nowrap;
        color: $color-black;
        overflow: hidden;
        display: flex;
        align-items: center;
    }
    .base-select__value.active {
        transform: translateY(8px);
    }
    .base-select__label {
        white-space: nowrap;
        color: $color-gray;
        overflow: hidden;
    }
    .base-select__label.active {
        position: absolute;
        top: 5px;
        left: 16px;
        color: $color-gray;
        max-width: calc(100% - 56px);
    }
    &:hover {
        border: 1px solid $color-gray-2;
    }
}

.base-select-basic.base-select-active,
.base-select-big.base-select-active {
    border: 1px solid $color-gray;
    .base-select__icon {
        color: $color-black;
    }
}

.base-select-basic.base-select-error {
    border: 1px solid $color-red;
    .base-select__error {
        max-width: 100%;
        position: absolute;
        top: calc(100% + 4px);
        left: 0;
        color: $color-red;
        cursor: default;
    }
}

.base-select-big.base-select-error {
    border: 1px solid $color-red;
    .base-select__error {
        max-width: 100%;
        position: absolute;
        top: calc(100% + 8px);
        left: 0;
        color: $color-red;
        cursor: default;
    }
}

.base-select-active {
    .base-select__icon {
        transform: rotate(180deg);
    }
}

.base-select-disabled {
    color: $text-disabled;
    cursor: default;
    .base-select__label,
    .base-select__label.active {
        color: $text-disabled;
    }
    .base-select__value {
        color: $text-disabled;
    }
    .base-select__icon {
        color: $color-gray-4;
    }
}

.base-select-basic.base-select-disabled,
.base-select-big.base-select-disabled {
    border: 1px solid $color-gray-4;
    &:hover {
        border: 1px solid $color-gray-4;
    }
}

@media (max-width: 768px) {
    .base-select {
        &__icon {
            flex-basis: 16px;
            min-width: 16px;
            height: 16px;
        }
    }
}

.ml-4 {
    margin-left: 4px;
}
.small-svg {
    width: 20px;
    height: 20px;
    flex-basis: 20px;
    min-width: 20px;
}
span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
