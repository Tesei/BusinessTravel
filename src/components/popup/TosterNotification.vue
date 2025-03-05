<template>
    <div class="popup-notification">
        <TransitionGroup
            tag="div"
            name="list"
        >
            <base-notification-box-2
                v-for="notification in notificationStore.getNotificationsList"
                :key="notification.id"
                :always-visible="notification.alwaysVisible"
                :remove-timeout="notification.removeTimeout"
                :color="notification.color"
                @remove="notificationStore.removeNotification(notification.id)"
                class="mb-12"
            >
            {{ notification.message }}
        </base-notification-box-2>
        </TransitionGroup>
    </div>
</template>

/** * Компонент выводит на экран массив уведомлений сверху-справа
(https://www.figma.com/design/SE7C5Kn3fKe5HPWXh0H2TR/OBT-Business-travel?node-id=617-18144&m=dev ) (пустые сообщения не выводятся)

*/
<script setup>
import BaseNotificationBox2 from '@ui/alert/BaseNotificationBox.vue'
import { useNotificationStore } from '@/store/notification'
const notificationStore = useNotificationStore()

</script>

<style scoped lang="scss">
@use '@/style/animation.scss';

.popup-notification {
    position: absolute;
    top: 101px;
    right: 0;
    display: flex;
    flex-direction: column;
    z-index: 2200;
}

.popup-notification::-webkit-scrollbar {
    width: 8px;
    border-radius: $border-radius-8;
    background-color: transparent;
}

.popup-notification::-webkit-scrollbar-thumb {
    border-radius: $border-radius-8;
    background-color: $color-gray-2;
}
</style>
