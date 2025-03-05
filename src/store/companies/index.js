import { defineStore } from 'pinia'
import { reactive, ref, computed } from 'vue'
import apiClient from '@/services/apiClient'

const API = '/v1/btmanagement/companies/receiving'

export const useCompaniesStore = defineStore('companies', () => {
    // STATE
    const preloader = ref(false)

    const companies = reactive({
        items: [],
        countRecords: 0,
        advancedSearch: false, // флаг, что был поиск с параметром search, для вывода другого сообщения если нет результатов
    })

    const searchParams = reactive({
        page: 1,
        pageSize: 30,
        search: '',
    })

    // GETTERS
    const getCompaniesItems = computed(() => companies.items)

    // ACTIONS
    const fetchCompanies = async () => {
        preloader.value = true
        companies.advancedSearch = Boolean(searchParams.search)
        try {
            const response = await apiClient({
                method: 'GET',
                url: API,
                params: searchParams,
            })
            companies.items = response.data.items
            companies.countRecords = response.data.totalCount
            return response.data
        } catch (error) {
            console.error('Ошибка в fetchCompanies при получении компаний:', error.message)
            throw error
        } finally {
            preloader.value = false
        }
    }

    return {
        preloader,
        searchParams,
        companies,
        getCompaniesItems,
        fetchCompanies,
    }
})
