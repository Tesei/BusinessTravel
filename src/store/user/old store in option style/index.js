import { defineStore } from 'pinia'
import state from './state'
import actions from './actions'
import getters from './getters'

// Пример и основа для работы с авторизацией и информацией о пользователе

// defineStore объединяет state и actions
/**
 * Создает хранилище пользователя с помощью функции defineStore из Pinia.
 *
 * @param {string} id - Уникальный идентификатор хранилища. В данном случае используется 'user' для идентификации пользовательского хранилища.
 * @param {Object} options - Объект конфигурации хранилища, включающий его состояние и действия.
 * @param {Object} options.state - Функция, возвращающая начальное состояние хранилища.
 *    Используется для хранения и управления данными пользователя.
 * @param {Object} options.actions - Объект с методами, изменяющими состояние хранилища.
 *    Определяет действия для обновления и взаимодействия с данными пользователя.
 */
export const useUserStore = defineStore('user', {
    state,
    actions,
    getters,
    persist: true, // Сохранение данных стора при перезагрузке
})
