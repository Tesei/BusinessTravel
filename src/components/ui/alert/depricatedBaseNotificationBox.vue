<template>
    <div
        v-if="isVisible && notification.message.trim()"
        class="alert"
        :class="notification.dinamicClass ? notification.dinamicClass : ' alert__default'"
    >
        <div v-if="notification.picture"><slot></slot></div>
        <div class="footnote_14">
            {{ notification.message }}
        </div>
    </div>
</template>
/** * Компонент выводит на экран уведомление
(https://www.figma.com/design/SE7C5Kn3fKe5HPWXh0H2TR/OBT-Business-travel?node-id=617-18144&m=dev ) (пустое сообщение не выводятся)
* и автоматически скрывает их через 3 секунды после отображения если не задан параметр(removeTimeout), * чтобы сообщение не
скрывалось нужно задать свойство alwaysVisible: true, * @param {Object} notification - Уведомление * @typedef {Object}
Notification * @property {number} id - Уникальный идентификатор уведомления * @property {string} message - Текст уведомления *
@property {string} [dinamicClass] - Класс для динамического стиля уведомления (необязательный) * @property {number}
[removeTimeout] - Количество милисекунд через которое будет удалено уведомление (необязательный) * @property {boolean}
[alwaysVisible] - Сообщение не удаляется (необязательный) * принимает картинку через слоты, для этого необходимо задать свойство
picture: true и обернуть картинку в компонент @example
<!-- *           <base-notification-box
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
                        </base-notification-box> -->
*/
<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
    notification: {
        type: Object,
        required: true,
    },
})
const isVisible = ref(true)
onMounted(() => {
    if (!props.notification?.alwaysVisible) {
        setTimeout(() => {
            isVisible.value = false
        }, props.notification.removeTimeout || 3000)
    }
})
</script>

<style scoped lang="scss">
.alert {
    color: $color-black;
    align-items: center;
    text-align: left;
}
</style>
