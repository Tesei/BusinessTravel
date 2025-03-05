<template>
    <div>
        <base-input
            :placeholder="placeholder"
            :isRequired="isRequired"
            v-model="stringValue"
            @input="filterNum"
            :errorText="errorText"
            :maxlen="maxlen"
            :disabled="disabled"
        >
            <template v-slot:icon>
                <slot name="icon"></slot>
            </template>
        </base-input>
    </div>
</template>

<script setup>
// Компонент возвращает строку в формате toLoacaleString("ru") и число с запятой до 2 знаков (например, строка 2 345,21 будет преобразована к формату 2345.21)

import BaseInput from '@/components/ui/inputs/BaseInput.vue'
import { onMounted } from 'vue'

const props = defineProps({
    errorText: { type: String, required: false, default: '' }, // ошибка валидации
    isRequired: { type: Boolean, default: false }, // обязательное поле
    maxlen: { type: String, default: null }, // максимальная количество вводимых символов
    placeholder: { type: String, required: true },
    disabled: { type: Boolean, default: false },
})

// компонент возвращает строку в формате toLocaleString('ru') и число
const stringValue = defineModel('stringValue')
const numberValue = defineModel('numberValue')

const filterNum = () => {
    // Удаляем пробелы из строки и проверяем, является ли она числом
    const sanitizedValue = stringValue.value.replace(/s+/g, '')
    if (!parseInt(sanitizedValue)) {
        stringValue.value = null
        numberValue.value = null
        return
    }

    // Удаляем все символы, кроме цифр и запятых
    stringValue.value = stringValue.value.replace(/[^,0-9\s+]/g, '')

    // Проверяем наличие запятой для разделения целой и дробной части
    if (stringValue.value.includes(',')) {
        let parts = stringValue.value.split(',')
        stringValue.value =
            Number(parts[0].replace(/\s+/g, '')).toLocaleString('ru') +
            ',' +
            parts[1].replace(/\D/g, '').replaceAll(',', '').slice(0, 2)
        numberValue.value = parseFloat(stringValue.value.replace(/\s+/g, '').replaceAll(',', '.')).toFixed(2)
    } else {
        stringValue.value = Number(stringValue.value.replace(/\D/g, '')).toLocaleString('ru')
        numberValue.value = Number(stringValue.value.replace(/\D/g, ''))
    }
}

onMounted(() => {
    if (stringValue.value) {
        stringValue.value = stringValue.value.toLocaleString('ru')
    }
})
</script>

<style lang="scss" scoped></style>
