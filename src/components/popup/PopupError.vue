<template>
    <div class="popup-error">
        <TransitionGroup
            tag="div"
            name="fade"
        >
            <base-alert-box-error
                v-for="(alert, index) in notificationStore.catchErrors"
                :key="alert.trx || alert.сorrelationId"
                :alert="alert"
                :removeAlert="removeAlert"
                :handleOpenModal="handleOpenModal"
                :index="index"
            />
        </TransitionGroup>
    </div>
    <div>
        <base-wrapper-popup
            v-if="showModal"
            @close="onCloseModal"
            :hasCloseIcon="false"
        >
            <div class="modal-content">
                <div class="Heading_2 modal-content__title">
                    Ошибка
                    <IconSprite
                        name="common--close"
                        className="icon__svg_32"
                        @click="onCloseModal"
                    />
                </div>
                <base-notification-box
                    :style="{ width: '100%' }"
                    :notification="{
                        message: `Просим сохранить информацию ниже для обращения в техническую поддержку. Это позволит нам быстрее разобраться с
				проблемой.`,
                        alwaysVisible: true,
                        picture: true,
                    }"
                >
                    <IconSprite
                        name="common--info"
                        className="icon__svg"
                    />
                </base-notification-box>
                <div class="Heading_2 modal-content__info">
                    Correlation ID: &nbsp; <span class="body_S"> {{ modalMessage.сorrelationId || modalMessage.trx }}</span>
                </div>
                <div class="body_S error-data">
                    <span class="footnote_14 error-data__title"> Отладочная информация: </span>
                    <textarea
                        ref="textareaRef"
                        v-model="text"
                        class="error-data__body"
                    >
                    </textarea>
                </div>
                <div class="modal-content__button-block">
                    <button
                        @click="copyText"
                        class="main-bottom__button"
                    ><p class="font-button_M main-bottom__button-text">Копировать текст ошибки</p>
                    </button>
                    <button
                        @click="onCloseModal"
                        class="main-bottom__button main-bottom__button_filled"
                    >
                    <p class="font-button_M main-bottom__button-text">Закрыть</p>
                    </button>
                </div>
            </div>
        </base-wrapper-popup>
    </div>
</template>
/**
* Компонент выводит на экран массив уведомлений снизу-справа (макет в figma
https://www.figma.com/design/SE7C5Kn3fKe5HPWXh0H2TR/OBT-Business-travel?node-id=1378-23956&node-type=frame&m=dev)
* при нажатии на кнопку "Подробнее" (по умолчанию отображается) открывается модальное окно с информацией об ошибке
* @param {Array} notificationStore.catchErrors - Массив уведомлений
* @typedef {Object} alert * @property {number} id - Уникальный идентификатор уведомления
* @property {string} message - Текст уведомления
* @property {string} [dinamicClass] - Класс для динамического стиля уведомления (необязательный)
* @property {boolean} [hideBtnMore] - скрывает кнопку "Подробнее" (необязательный)
* @param {function} [removeAlert] - Функция которая
вызывается при клике на кнопку закрытия уведомления, возвращает {Object} alert на котором была вызвана (необязательный) * @example
*
<!--     <popup-error
                    :notificationStore.catchErrors="[
                        {
                            сorrelationId: "44600224cd6-ef08-41bc-a580-ff087ad2f00b",
                            code: "ValidationException",
                            message: "Сообщение об ошибке",
                            details: [
                                {
                                propertyName: "DailyAllowance.CounterpartyStructureInfo[0].Type",
                                errorMessage: "Свойство <type> не может быть пустым."
                                }
                            ],
                            inner: null,
                            stackTrace: "   at Application.Behaviors.RequestValidationBehavio ",
                            hideBtnMore: true,
                        }]"

                    :removeAlert="removeAlert"
                />
            const removeAlert = (alert) => {
            console.log('removeAlert', alert)
            arrAlerts.value = arrAlerts.value.filter((alert) => alert.сorrelationId !== message.сorrelationId)
        }
     -->
*/
<script setup>
import { ref } from 'vue'
import BaseAlertBoxError from '@ui/alert/BaseAlertBoxError.vue'
import IconSprite from '@/components/interface/IconSprite.vue'
import BaseNotificationBox from '@ui/alert/depricatedBaseNotificationBox.vue'
import BaseWrapperPopup from '@ui/wrapper/BaseWrapperPopup.vue'
import { useNotificationStore } from '@/store/notification'
const notificationStore = useNotificationStore()

let showModal = ref(false)
let modalMessage = ref(null)
let text = ref(null)
const textareaRef = ref(null)

const onCloseModal = () => {
    showModal.value = false
    modalMessage.value = null
}
const handleOpenModal = (message) => {
    modalMessage.value = message
    text.value = JSON.stringify(modalMessage.value, null, 2)
    showModal.value = true
}

const copyText = async () => {
    try {
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(text.value)
        } else {
            // Если Clipboard API не поддерживается, используем старый способ через execCommand
            // Создаем временный textarea для копирования текста
            const textarea = document.createElement('textarea')
            textarea.value = text.value
            document.body.appendChild(textarea)

            // Выбираем текст в textarea
            textarea.select()
            textarea.setSelectionRange(0, textarea.value.length) // Для мобильных устройств

            // Пытаемся скопировать текст с помощью execCommand
            document.execCommand('copy')
            document.body.removeChild(textarea) // Удаляем временный элемент
        }

        // Выделяем скопированный текст
        if (textareaRef.value) {
            textareaRef.value.focus()
            textareaRef.value.select()
        }
    } catch (error) {
        console.error('Ошибка при копировании текста:', error)
    }
}

const removeAlert = (index) => {
    notificationStore.removeError(index)
}
</script>

<style scoped lang="scss">
@use '@/style/animation.scss';

.popup-error {
    position: fixed;
    bottom: 0;
    right: 0px;
    display: flex;
    flex-direction: column;
    max-height: 90vh;
    overflow-y: auto;
    overflow-x: hidden;
    max-width: 270px;
    width: 100%;
    z-index: 2200;
}

.popup-error::-webkit-scrollbar {
    width: 8px;
    border-radius: $border-radius-8;
    background-color: transparent;
}

.popup-error::-webkit-scrollbar-thumb {
    border-radius: $border-radius-8;
    background-color: $color-gray-2;
}

.modal-content__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    color: $color-black;
}
.modal-content__title .icon__svg_32 {
    cursor: pointer;
}

.modal-content__info {
    display: flex;
    align-items: center;
    text-align: left;
    margin-bottom: 32px;
    color: $color-black;
}
.error-data {
    text-align: left;
    display: flex;
    flex-direction: column;
    padding: 8px 0 8px 16px;
    border-radius: $border-radius-8;
    border: 1px solid $color-gray-9;
    margin-bottom: 16px;
}
.error-data__title {
    color: $color-gray;
}
.error-data__body {
    max-width: 746px;
    width: 100%;
    height: 164px;
    padding-right: 10px;
    word-break: break-word;
    overflow-x: hidden;
    overflow-y: auto;
    resize: none;
    background-color: $color-white;
    color: $color-black;
}

.error-data__body:focus-visible {
    outline: none;
}

.error-data__body::-webkit-scrollbar {
    width: 4px;
    border-radius: $border-radius-8;
    background-color: transparent;
}

.error-data__body::-webkit-scrollbar-thumb {
    border-radius: $border-radius-8;
    background-color: $color-gray-2;
}
.modal-content {
    max-width: 828px;
    width: 100%;
    padding: 32px;
}

.modal-content__button-block {
    display: flex;
    justify-content: space-between;
}

.main-bottom__button:not(:last-child) {
    margin-right: 32px;
}

.main-bottom__button_filled {
    background-color: $color-cornflower;
    color: $color-white;
}
</style>
