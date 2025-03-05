<template>
    <div :class="[classNames]">
        <span class="switch-lebel__text footnote_L"><slot></slot></span>
        <label class="switch-lebel__switch">
            <input
                type="checkbox"
                class="switch-lebel__input"
                @change="handleChange"
                v-model="detected"
                :disabled="disabled"
            />
            <span class="switch-lebel__slider"></span>
        </label>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted } from 'vue'

/**
 * Определяет пользовательские классы для стилизации компонента.
 *
 * @property {String} classNames Пользовательские классы для стилизации компонента.
 *                               Принимает строку с названиями классов, которые применяются к основному div.
 *                               Необязательное свойство, по умолчанию 'switch-lebel__item'.
 *
 * @property {Boolean} defaultDetected Устанавливает начальное состояние для переключателя (чекбокса).
 *                                     Если true, переключатель будет активирован по умолчанию.
 *                                     Необязательное свойство, по умолчанию false.
 *
 * @property {Boolean} disabled Флаг, указывающий, должен ли переключатель быть отключен.
 *                              Если true, компонент становится неактивным, и пользователю будет запрещено
 *                              его изменять.
 *                              Необязательное свойство, по умолчанию false.
 */

const props = defineProps({
    classNames: {
        type: String,
        required: false,
        default: 'switch-lebel__item',
    },
    defaultDetected: {
        type: Boolean,
        required: false,
        default: false,
    },
    disabled: {
        type: Boolean,
        required: false,
        default: false,
    },
    text: {
        type: String,
        required: false,
        default: '',
    },
    fontText: {
        type: String,
        required: false,
        default: 'footnote_L',
    },
})

const emit = defineEmits(['handleChange'])

const handleChange = () => {
    emit('handleChange', detected.value)
}

const detected = ref(false)

onMounted(() => {
    detected.value = props.defaultDetected
})
</script>

<style scoped lang="scss">
// .switch-contragent
.switch-contragent {
    display: flex;
    // .switch-contragent .switch
    .switch {
        margin: 0;
        height: 24px;
        // .switch-contragent .switch-lebel__text
        &-lebel__text {
            margin-right: 8px;
        }
    }
}
</style>
