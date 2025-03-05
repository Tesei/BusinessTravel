import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import apiClient from '@/services/apiClient'

const positionsAPI = '/v1/btmanagement/positions/'

export const usePositionsStore = defineStore('positions', () => {
    const searchParams = reactive({
        page: 1,
        pageSize: 30,
        search: '',
    })
    const preloader = ref(false)
    const positions = ref({})
    const positionsTotalCount = ref(0)

    const fetchPositions = async () => {
        preloader.value = true
        try {
            let positionsResponse
            if (!searchParams.search) {
                positionsResponse = await apiClient({
                    method: 'GET',
                    url: positionsAPI + `?pageSize=${searchParams.pageSize}&page=${searchParams.page}`,
                })
            } else {
                positionsResponse = await apiClient({
                    method: 'GET',
                    url:
                        positionsAPI +
                        `?pageSize=${searchParams.pageSize}&page=${searchParams.page}&search=${searchParams.search}`,
                })
            }

            positions.value = positionsResponse?.data?.items?.map((item) => ({ ...item, isChecked: false }))
            positionsTotalCount.value = positionsResponse.data.totalCount
        } catch (error) {
            console.error('Ошибка в fetchPositions:', error.message)
            throw error
        } finally {
            preloader.value = false
        }
    }

    const createPosition = async (data) => {
        preloader.value = true
        try {
            const res = await apiClient({
                method: 'POST',
                url: positionsAPI,
                data,
            })
            return res
        } catch (error) {
            console.error('Ошибка в createPosition:', error.message)
            throw error
        } finally {
            preloader.value = false
        }
    }

    const putPosition = async (data, id) => {
        preloader.value = true
        try {
            const res = await apiClient({
                method: 'PUT',
                url: positionsAPI + id,
                data,
            })
            return res
        } catch (error) {
            console.error('Ошибка в putPosition:', error.message)
            throw error
        } finally {
            preloader.value = false
        }
    }

    return {
        preloader,
        searchParams,
        positions,
        positionsTotalCount,
        fetchPositions,
        createPosition,
        putPosition,
    }
})
