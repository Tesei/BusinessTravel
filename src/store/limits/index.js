import { defineStore } from 'pinia'
import { reactive, ref, computed } from 'vue'
import apiClient from '@/services/apiClient'

import { useNotificationStore } from '@/store/notification/index.js'
import { useRouter } from 'vue-router'

const limitsAPI = '/v1/btmanagement/limits/'

export const useLimitsStore = defineStore('limits', () => {
    const router = useRouter()
    const notificationStore = useNotificationStore()
    const { setNotification } = notificationStore

    const searchParams = reactive({
        page: 1,
        pageSize: 30,
        search: '',
    })
    const preloader = ref(false)
    const singleLimit = ref(null)
    const limitsCount = reactive({
        Avia: 0,
        Train: 0,
    })
    const folderNameGuide = ref({
        Avia: 'Авиабилеты',
        Train: 'Ж/Д билеты',
    })
    const currentTotalCount = ref(0)
    const limits = ref([])
    const activeTabValue = ref('Avia')

    // GETTERS
    const getSingleLimit = computed(() => singleLimit.value)

    // ACTIONS
    const createLimit = async (data) => {
        preloader.value = true
        try {
            await apiClient({
                method: 'POST',
                url: limitsAPI,
                data,
            })
            router.push({ name: 'limits' })
            setNotification('Лимит успешно создан', 'green')
        } catch (error) {
            console.error('Ошибка в createLimit:', error.message)
            throw error
        } finally {
            preloader.value = false
        }
    }
    const fetchLimits = (tab) => {
        if (tab === 'Avia') {
            fetchLimitsPlane()
        } else {
            fetchLimitsTrain()
        }
    }
    const fetchLimitsPlane = async () => {
        preloader.value = true
        try {
            let limitsResponse
            if (!searchParams.search) {
                limitsResponse = await apiClient({
                    method: 'GET',
                    url: limitsAPI + `?pageSize=${searchParams.pageSize}&page=${searchParams.page}&expenseType=plane`,
                })
            } else {
                limitsResponse = await apiClient({
                    method: 'GET',
                    url:
                        limitsAPI +
                        `?pageSize=${searchParams.pageSize}&page=${searchParams.page}&expenseType=plane&search=${searchParams.search}`,
                })
            }

            limits.value = limitsResponse.data.items.map((item) => ({ ...item, isChecked: false }))
            limitsCount.Avia = limitsResponse.data.totalCount
            currentTotalCount.value = limitsResponse.data.totalCount
        } catch (error) {
            console.error('Ошибка в fetchLimitsPlane:', error.message)
            throw error
        } finally {
            preloader.value = false
        }
    }
    const fetchLimitsTrain = async () => {
        preloader.value = true
        try {
            let limitsResponse
            if (!searchParams.search) {
                limitsResponse = await apiClient({
                    method: 'GET',
                    url: limitsAPI + `?pageSize=${searchParams.pageSize}&page=${searchParams.page}&expenseType=train`,
                })
            } else {
                limitsResponse = await apiClient({
                    method: 'GET',
                    url:
                        limitsAPI +
                        `?pageSize=${searchParams.pageSize}&page=${searchParams.page}&expenseType=train&search=${searchParams.search}`,
                })
            }
            limits.value = limitsResponse.data.items.map((item) => ({ ...item, isChecked: false }))
            limitsCount.Train = limitsResponse.data.totalCount
            currentTotalCount.value = limitsResponse.data.totalCount
        } catch (error) {
            console.error('Ошибка в fetchLimitsTrain:', error.message)
            throw error
        } finally {
            preloader.value = false
        }
    }

    const fetchLimitById = async (id) => {
        preloader.value = true
        try {
            const res = await apiClient({
                method: 'GET',
                url: limitsAPI + id,
            })
            singleLimit.value = res.data
            return res.data
        } catch (error) {
            console.error('Ошибка в fetchLimitById:', error.message)
            throw error
        } finally {
            preloader.value = false
        }
    }

    const putLimitById = async (data, id) => {
        preloader.value = true
        try {
            await apiClient({
                method: 'PUT',
                url: limitsAPI + id ,
                data
            })
            router.push({ name: 'limits' })
            setNotification('Лимит изменен', 'green')
        } catch (error) {
            console.error('Ошибка в putLimitById:', error.message)
            throw error
        } finally {
            preloader.value = false
        }
    }

    return {
        limitsCount,
        folderNameGuide,
        limits,
        preloader,
        searchParams,
        currentTotalCount,
        activeTabValue,
        fetchLimitsPlane,
        fetchLimitsTrain,
        fetchLimits,
        createLimit,
        fetchLimitById,
        getSingleLimit,
        putLimitById
    }
})
