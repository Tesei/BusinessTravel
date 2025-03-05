import { defineStore } from 'pinia'
import { reactive, ref, computed, watch  } from 'vue'
import apiClient from '@/services/apiClient'
import { useNotificationStore } from '@/store/notification/index.js'
import { useRouter } from 'vue-router'

const dailyAllowancesAPI = '/v1/btmanagement/dailyAllowances'

export const useAllowancesStore = defineStore('allowances', () => {
    const router = useRouter()
    const notificationStore = useNotificationStore()
    const { setNotification } = notificationStore
    // STATE
    const preloader = ref(false)

    const dailyAllowances = reactive({
        items: [],
        countRecords: 0,
        advancedSearch: false, // флаг, что был поиск с параметром search, для вывода другого сообщения если нет результатов
    })

    const searchParams = reactive({
        page: 1,
        pageSize: 30,
        search: '',
    })

    const singleDailyAllowance = ref({})

    // логика чекбокса выбрать все
    // =================================
    // Состояние чекбокса "Выбрать все"
    const checkAll = ref(false)

    // Вычисляемое свойство: хотя бы один элемент выбран
    const isSomeChecked = computed(() => dailyAllowances.items.some((el) => el.isChecked))

    // Вычисляемое свойство: все элементы выбраны
    const isAllChecked = computed(() => dailyAllowances.items.every((el) => el.isChecked))

    // Вычисляемое свойство: ни один элемент не выбран
    const isAllEmpty = computed(() => dailyAllowances.items.every((el) => !el.isChecked))

    // Вычисляемое свойство: неопределенное состояние (частично выбрано)
    const indeterminate = computed(() => isSomeChecked.value && !isAllChecked.value)

    // Обновление состояния всех элементов при изменении checkAll
    watch(checkAll, (newValue) => {
        dailyAllowances.items = dailyAllowances.items.map((el) => ({
            ...el,
            isChecked: newValue,
        }))
    })

    // Обновление checkAll при изменении состояния элементов
    watch([isAllChecked, isAllEmpty], ([allChecked, allEmpty]) => {
        if (allChecked) {
            checkAll.value = true
        } else if (allEmpty) {
            checkAll.value = false
        }
        // Если ни allChecked, ни allEmpty не true, оставляем checkAll.value без изменений
    })
    //================================

    // GETTERS
    const getDailyAllowancesArray = computed(() => dailyAllowances.items)
    const getSingleDailyAllowance = computed(() => singleDailyAllowance.value)

    // ACTIONS
    const createDailyAllowances = async (data) => {
        preloader.value = true
        try {
            await apiClient({
                method: 'POST',
                url: dailyAllowancesAPI,
                data,
            })
            // нужно сделать DailyAllowancesPage
            router.push('/settings/daily-allowances')
            setNotification('Суточные успешно созданы', 'green')
        } catch (error) {
            console.error('Ошибка в createDailyAllowances:', error.message)
            throw error
        } finally {
            preloader.value = false
        }
    }

    const fetchDailyAllowances = async () => {
        preloader.value = true
        dailyAllowances.advancedSearch = Boolean(searchParams.search)
        try {
            const response = await apiClient({
                method: 'GET',
                url: dailyAllowancesAPI,
                params: searchParams,
            })

            dailyAllowances.items = response.data.items.map((item) => ({ ...item, isChecked: false }))
            dailyAllowances.countRecords = response.data.totalCount
            return response.data
        } catch (error) {
            console.error('Ошибка в fetchDailyAllowances при получении суточных:', error.message)
            throw error
        } finally {
            preloader.value = false
        }
    }

    const fetchDailyAllowancesById = async (id) => {
        preloader.value = true
        dailyAllowances.advancedSearch = Boolean(searchParams.search)
        try {
            const response = await apiClient({
                method: 'GET',
                url: dailyAllowancesAPI + '/' + id,
            })

            singleDailyAllowance.value = response.data

        } catch (error) {
            console.error('Ошибка в fetchDailyAllowancesById при получении суточных:', error.message)
            throw error
        } finally {
            preloader.value = false
        }
    }

    const putDailyAllowances = async (data) => {
        preloader.value = true
        try {
            await apiClient({
                method: 'PUT',
                url: dailyAllowancesAPI + '/' + data.id,
                data,
            })
            // нужно сделать DailyAllowancesPage
            router.push('/settings/daily-allowances')
            setNotification('Суточные изменены', 'green')
        } catch (error) {
            console.error('Ошибка в putDailyAllowances:', error.message)
            throw error
        } finally {
            preloader.value = false
        }
    }


    return {
        preloader,
        createDailyAllowances,
        dailyAllowances,
        searchParams,
        fetchDailyAllowances,
        checkAll,
        isSomeChecked,
        isAllChecked,
        isAllEmpty,
        indeterminate,
        getDailyAllowancesArray,
        fetchDailyAllowancesById,
        getSingleDailyAllowance,
        putDailyAllowances
    }
})
