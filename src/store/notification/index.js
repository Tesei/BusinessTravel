import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNotificationStore = defineStore('notificationStore', () => {
    const catchErrors = ref([])
    const notificationsList = ref([])

    const getNotificationsList = computed(()=> notificationsList.value)

    const setError = (erorrItem) => {
        catchErrors.value.push(erorrItem.response.data)
    }
    const removeError = (index) => {
        catchErrors.value = catchErrors.value.filter((el, i) => i !== index)
    }

    async function setNotification(
        message = 'Успешно',
        color = 'green', // может быть green, blue, red, yellow, gray
        removeTimeout = 3000,
        alwaysVisible = false
    ) {
        // максимум 5 сообщений на экране
        if (notificationsList.value.length < 5){
            notificationsList.value.push({
                message,
                color,
                removeTimeout,
                alwaysVisible,
                id: Math.random()*100,
            })
        } else {
            setTimeout(async () => {await setNotification(message, color, removeTimeout, alwaysVisible)}, 3001)
        }
    }

    async function removeNotification(id) {
        notificationsList.value = notificationsList.value.filter(el => el.id !== id)
    }

    return {
        catchErrors,
        setError,
        removeError,
        getNotificationsList,
        setNotification,
        removeNotification
    }
})
