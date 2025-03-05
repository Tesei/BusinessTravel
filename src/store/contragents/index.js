import { defineStore } from 'pinia'
import { reactive } from 'vue'
import apiClient from '@/services/apiClient'

export const useContragentsStore = defineStore('contragentsStore', () => {
    const contragents = reactive({
        active: null,
        inactive: null,
        all: null,
        items: [],
        countRecords: 0,
        loading: false,
        advancedSearch: false, // флаг, что был поиск с параметром search, для вывода другого сообщения если нет результатов
    })

    const searchParams = reactive({
        page: 1,
        pageSize: 3,
        isActive: true,
        isBlocked: null,
        search: '',
    })

    // запросы
    //============================

    //получение списка контрагентов
    const fetchCounterparties = async (params) => {
        const url = `${import.meta.env.VITE_AUTH_BTUI_SERVICE}/v1/obtmanagement/counterparties`
        contragents.loading = true
        try {
            const response = await apiClient({
                method: 'GET',
                url,
                params,
            })
            return response.data
        } catch (error) {
            console.error('Ошибка в fetchCounterparties при получении контрагентов:', error.message)
            throw error // Выбрасываем ошибку, чтобы её можно было обработать на уровне вызова
        } finally {
            contragents.loading = false
        }
    }
    // Получение контрагента по ID
    const fetchContragentById = async (id) => {
        const url = `${import.meta.env.VITE_AUTH_BTUI_SERVICE}/v1/obtmanagement/counterparties/${id}`
        try {
            const response = await apiClient({
                method: 'GET',
                url,
            })
            return response.data // Возвращаем данные контрагента
        } catch (error) {
            console.error('Ошибка в fetchContragentById при получении контрагента:', error.message)
            throw error
        }
    }

    // Изменение данных контрагента
    const putContragentById = async (id, data) => {
        const url = `${import.meta.env.VITE_AUTH_BTUI_SERVICE}/v1/obtmanagement/counterparties/${id}`

        try {
            const response = await apiClient({
                method: 'PUT',
                url,
                data,
            })
            return response.data // Возвращаем данные контрагента
        } catch (error) {
            console.error('Ошибка в putContragentById при изменении данных контрагента:', error.message)
            throw error
        }
    }

    // Actions
    // Получаем контрагентов
    const getCounterparties = async (params) => {
        // Если params === 'getAll, то загружаем все три набора данных
        if (params === 'getAll') {
            const params1 = { page: 1, pageSize: 1, isActive: true }
            const params2 = { page: 1, pageSize: 1, isActive: false }
            const params3 = { page: 1, pageSize: 1 }

            try {
                const [active, inactive, all] = await Promise.all([
                    fetchCounterparties(params1),
                    fetchCounterparties(params2),
                    fetchCounterparties(params3),
                ])

                // Обновляем данные
                contragents.active = active.totalCount
                contragents.inactive = inactive.totalCount
                contragents.all = all.totalCount
            } catch (error) {
                console.error('Ошибка в getCounterparties при получении статистики контрагентов:', error)
            }
        } else {
            try {
                // устанавливаем флаг поиска (использовалась ли поисковая строка)
                contragents.advancedSearch = Boolean(contragents.advancedSearch)
                const res = await fetchCounterparties(searchParams)
                contragents.items = res.items || [] // Обновляем список контрагентов
                contragents.countRecords = Number(res.totalCount)
                const statusMap = {
                    true: 'active',
                    false: 'inactive',
                    null: 'all',
                }
                // Обновляем данные для текущего таба
                contragents[statusMap[searchParams.isActive]] = res.totalCount
            } catch (error) {
                console.error('Ошибка в getCounterparties при получении списка контрагентов:', error)
            }
        }
    }

    const toggleActiveOrBlock = async (contragentId, property) => {
        try {
            // Получаем данные контрагента
            const contragent = await fetchContragentById(contragentId)

            // Убираем ненужные поля
            // eslint-disable-next-line no-unused-vars
            const { id, admins, ...rest } = contragent

            let patchData
            if (property === 'isActive') {
                patchData = {
                    ...rest,
                    isActive: !rest.isActive,
                }
            } else if (property === 'isBlocked') {
                patchData = {
                    ...rest,
                    isBlocked: !rest.isBlocked,
                }
            }

            await putContragentById(contragentId, patchData)
            await getCounterparties()

            // если меняем активность, то нужно обновлять данные по табам
            // TODO: внести правки по БЭКу, чтобы fetchCounterparties возвращал данные
            // по количеству активных и неактивных контрагентов в одном запросе,
            // сейчас нужен отдельный запрос на каждую группу (active, inactive, all)
            //
            if (property === 'isActive') {
                switch (searchParams.isActive) {
                    case true: {
                        const inactive = await fetchCounterparties({ page: 1, pageSize: 1, isActive: false })
                        contragents.inactive = inactive.totalCount
                        break
                    }
                    case false: {
                        const active = await fetchCounterparties({ page: 1, pageSize: 1, isActive: true })
                        contragents.active = active.totalCount
                        break
                    }
                    case null: {
                        const [active2, inactive2] = await Promise.all([
                            fetchCounterparties({ page: 1, pageSize: 1, isActive: true }),
                            fetchCounterparties({ page: 1, pageSize: 1, isActive: false }),
                        ])
                        contragents.active = active2.totalCount
                        contragents.inactive = inactive2.totalCount
                        break
                    }
                }
                // getCounterparties('getAll')// Обновляем данные по табам (активные, неактивные, все)
            }
        } catch (error) {
            console.error('Ошибка в toggleActiveOrBlock:', error)
            throw error
        }
    }

    const changeActivePage = (page) => {
        searchParams.page = page
        getCounterparties()
    }

    const changePageSize = (count) => {
        searchParams.pageSize = count
        getCounterparties()
    }

    return {
        contragents,
        getCounterparties,
        toggleActiveOrBlock,
        searchParams,
        changeActivePage,
        changePageSize,
    }
})
