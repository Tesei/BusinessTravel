<template>
    <div
        class="switch-item"
        :class="[classNames]"
    >
        <div
            class="text-block"
            :isText="isText"
            :class="isText ? [classMargin, classHeight] : ''"
        >
            <span class="switch-label"><slot></slot></span>
            <span class="switch-description"><slot name="textDescription"></slot></span>
        </div>
        <label class="switch">
            <input
                type="checkbox"
                @change="handleChange"
                v-model="detected"
                :disabled="disabled"
            />
            <span class="slider"></span>
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
 *                               Необязательное свойство, по умолчанию 'default'.
 *
 * @property {Boolean} defaultDetected Устанавливает начальное состояние для переключателя (чекбокса).
 *                                     Если true, переключатель будет активирован по умолчанию.
 *                                     Необязательное свойство, по умолчанию false.
 *
 * @property {Boolean} disabled Флаг, указывающий, должен ли переключатель быть отключен.
 *                              Если true, компонент становится неактивным, и пользователю будет запрещено
 *                              его изменять.
 *                              Необязательное свойство, по умолчанию false.
 *
 * @property {Boolean} isText Флаг, указывающий, на наличие текста (содержимого) в div.
 *                              Если true, модификаторы текста становятся активными, если false, то применяться не будут.
 *                              Обязательное свойство, по умолчанию false.
 *
 * @property {String} textHeader Текст заголовка для компонента. Показывает основной текст, который будет
 *                               отображаться рядом с переключателем.
 *                               Необязательное свойство, по умолчанию пустая строка ''.
 *
 * @property {String} classMargin Класс для настройки внешнего отступа у текстового блока.
 *                                Если `isText` установлено в `true`, то добавляется класс `text-block_margin`,
 *                                или другой указанный класс.
 *                                Необязательное свойство, по умолчанию 'text-block_margin'.
 *
 * @property {String} classHeight Класс для настройки высоты текстового блока.
 *                                Если `isText` установлено в `true`, то добавляется класс `text-block_height`,
 *                                или другой указанный класс.
 *                                Необязательное свойство, по умолчанию 'text-block_height'.
 */

const props = defineProps({
    classNames: {
        type: String,
        required: false,
        default: 'default',
    },
    classMargin: {
        type: String,
        required: false,
        default: 'text-block_margin',
    },
    classHeight: {
        type: String,
        required: false,
        default: 'text-block_height',
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
    textHeader: {
        type: String,
        required: false,
        default: '',
    },
    isText: {
        type: Boolean,
        required: true,
        default: false,
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

<style scoped></style>
