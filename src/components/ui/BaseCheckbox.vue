<template>
    <label
        class="input__checkbox"
        :class="classNames"
    >
        <input
            type="checkbox"
            v-model="model"
            :value="value"
            :disabled="disabled"
            :indeterminate="indeterminate"
        />
        <span class="input__checkmark">
            <IconSprite
                name="default-checkbox"
                class="icon__svg default-checkbox"
            />
            <IconSprite
                name="default-checkbox-hover"
                class="icon__svg default-checkbox-hover"
            />
            <IconSprite
                name="default-checkbox-disable"
                class="icon__svg default-checkbox-disable"
            />
            <IconSprite
                name="checked-checkbox"
                class="icon__svg checked-checkbox"
            />
            <IconSprite
                name="checked-checkbox-hover"
                class="icon__svg checked-checkbox-hover"
            />
            <IconSprite
                name="checked-checkbox-disabled"
                class="icon__svg checked-checkbox-disabled"
            />
            <IconSprite
                name="indeterminate-checkbox"
                class="icon__svg indeterminate-checkbox"
            />
            <IconSprite
                name="indeterminate-checkbox-hover"
                class="icon__svg indeterminate-checkbox-hover"
            />
        </span>
        <span
            v-if="label"
            class="label__checkbox"
            >{{ label }}</span
        >
    </label>
</template>

<script setup>
import { computed, defineEmits } from 'vue'
import IconSprite from '@/components/interface/IconSprite.vue'

const props = defineProps({
    classNames: { type: String, required: false }, // для пользовательской стилизации компонента
    modelValue: { type: [Array, Boolean], required: true }, // свойство используется для реализации двустороннего связывания в v-model
    value: { type: [Boolean, Object], required: false }, // свойство используется для нахождения объекта в массиве
    label: { type: String, required: false }, // label для чекбокса
    disabled: { type: Boolean, default: false, required: false }, // свойство, отключающее чекбокс
    indeterminate: { type: Boolean, default: false, required: false }, // свойство, отвечающее за неопределенное состояние чекбокса (встречается во множественном выборе)
})
const emit = defineEmits(['update:modelValue'])
const model = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    },
})
</script>

<style lang="scss" scoped></style>
