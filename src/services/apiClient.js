// src/apiClient.js
import axios from 'axios'
import { useNotificationStore } from '@/store/notification'
import { useUserStore } from '@/store/user'

// Базовая настройка клиента axios
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_AUTH_BTUI_SERVICE, // базовый URL
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Перехватчик запроса для токена
apiClient.interceptors.request.use(
    (config) => {
        const typeToken = useUserStore().incomingTokens.type
        const accessToken = useUserStore().incomingTokens.accessToken
        const autToken = typeToken && accessToken ? typeToken + ' ' + accessToken : ''
        if (autToken) config.headers.Authorization = autToken
        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

// Перехватчик ответа для отслеживания ошибок
apiClient.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        // Обработка ошибок
        if (error.response) {
            // Сервер вернул ответ с ошибкой
            console.error('Error:', error.response.data.message || 'Ошибка сервера')
            useNotificationStore().setError(error)
        } else {
            console.error('Network Error:', error.message || 'Ошибка сети')
        }
        return Promise.reject(error)
    },
)

export default apiClient
