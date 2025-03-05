<template>
    <div
        v-if="visible" 
        class="radius-8 base-alert"
        :class="'alert__attention' || alert.dinamicClass"
    >
        <div class="Heading_4 c-black mb-8 flex ai-c jc-sb base-alert__title">
            Ошибка
            <IconSprite
                name="common--close"
                className="icon__svg"
                @click="handleClose"
            />
        </div>
        <div class="footnote_14 c-black base-alert__message">{{ alert.message }}</div>
        <button
            v-if="!alert.hideBtnMore"
            @click="handleOpenModal(alert), handleClose()"
            class="c-black bg-white radius-8 mt-8 font-button_S base-alert__button"
        >
            Подробнее
        </button>
    </div>
</template>
/**
Компонент выводит на экран уведомление об ошибке.
@param {Object} alert - Объект уведомления
@param {string} alert.message - Текст уведомления
@param {string} [alert.dinamicClass] - Класс для динамического стиля уведомления (необязательный)
@param {boolean} [alert.hideBtnMore] - Скрывает кнопку "Подробнее" (необязательный)
@param {function} [removeAlert] - Функция, вызываемая при клике на кнопку закрытия уведомления (необязательный)
@param {function} handleOpenModal - Функция, вызываемая при клике на кнопку "Подробнее"
**/
<script setup>
import { ref } from 'vue'
import IconSprite from '@/components/interface/IconSprite.vue'

const props = defineProps({
    alert: {
        type: Object,
        required: true,
    },
    removeAlert: {
        type: Function,
        required: false,
    },
    handleOpenModal: {
        type: Function,
        required: true,
    },
    index: {
        type: Number,
        required: true,
    },
    onCloseModal: {
        type: Function,
        required: false,}
})

const visible = ref(true)
const handleClose = () => {
    visible.value = false
    if (props.onCloseModal) {
        props.onCloseModal()
    }
    if (props.removeAlert) {
        props.removeAlert(props.index)
    }
}
</script>

<style scoped lang="scss">
.base-alert {
    min-width: 270px;
    min-height: 100px;
    padding: 16px;
    display: flex;
    flex-direction: column;
}
.base-alert:not(:only-child) {
    margin-bottom: 8px;
}

.base-alert__title {
 }

.icon__svg {
    margin-right: 0;
    cursor: pointer;
}

.base-alert__message {
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
}

.base-alert__button {
    border: none;
    padding: 8px 16px;
}
</style>
