import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import apiClient from '@/services/apiClient'

const API = '/v1/obtmanagement/contracts'

export const useContractsStore = defineStore('contracts', () => {
    // STATE
    const contracts = ref([])
    const openContracts = ref([])
    const selectedContracts = ref([])
    const allChecked = ref(false)
    const loading = ref(false)
    const clientCount = ref(null)
    const providerCount = ref(null)
    const currentContractType = ref('Client')
    const error = ref(null)

    // GETTERS
    const getContractById = computed(() => {
        return (contractId) => openContracts.value.find((contract) => contract.id === contractId)
    })

    const indeterminate = computed(() => {
        if (selectedContracts.value.length) {
            return contracts.value.length !== selectedContracts.value.length
        } else return false
    })

    // ACTIONS
    function clearContracts() {
        contracts.value = []
        clientCount.value = null
        providerCount.value = null
    }
    function isAllChecked(value) {
        if (value) {
            selectedContracts.value = [...contracts.value]
        } else selectedContracts.value = []
    }
    function controlSelectedContracts() {
        if (selectedContracts.value.length === contracts.value.length) {
            allChecked.value = true
        }
        if (!selectedContracts.value.length) allChecked.value = false
    }
    function transformResponse(response) {
        return response.reduce((acc, cur) => {
            if (!cur.operationDetails.length) {
                const newService = {
                    ...cur,
                    expenseType: cur.expenseType === 'Plane' ? 'РЖД' : 'Aвиа',
                    routeType: cur.routeType === 'Single' ? 'В одну сторону' : 'Туда и обратно',
                    operationType: cur.operationType === 'Online' ? 'Онлайн' : 'Оффлайн',
                }
                delete newService.operationDetails
                acc.push({ ...newService })
                return acc
            } else {
                cur.operationDetails.forEach((item) => {
                    const operationDetails = {
                        ...item,
                        type: item.type === 'Buy' ? 'Покупка' : item.type === 'Exchange' ? 'Обмен' : 'Возврат',
                    }
                    const newService = {
                        ...cur,
                        expenseType: cur.expenseType === 'Plane' ? 'РЖД' : 'Aвиа',
                        routeType: cur.routeType === 'Single' ? 'В одну сторону' : 'Туда и обратно',
                        operationType: cur.operationType === 'Online' ? 'Онлайн' : 'Оффлайн',
                    }
                    delete newService.operationDetails
                    acc.push({ ...newService, ...operationDetails })
                })
                return acc
            }
        }, [])
    }
    async function fetchContractsList() {
        const types = ['Client', 'Provider']
        const promises = types.map((item) =>
            apiClient({
                method: 'GET',
                url: `${API}`,
                params: { pageSize: 30, page: 1, contractType: item },
            }),
        )
        loading.value = true
        try {
            const res = await Promise.all(promises)
            contracts.value = res[0].data.items
            clientCount.value = res[0].data.totalCount
            providerCount.value = res[1].data.totalCount
        } catch (error) {
            console.log(error, 'ошибка в fetchContractsList')
            error.value = error.response.data?.message
        } finally {
            loading.value = false
        }
    }
    async function fetchContracts(params) {
        const filteredParams = Object.entries(params).reduce((acc, [key, value]) => {
            if (value != null && value !== '' && value !== true) acc[key] = value
            return acc
        }, {})
        contracts.value = []
        selectedContracts.value = []
        error.value = null
        currentContractType.value = params.contractType
        loading.value = true
        try {
            const res = await apiClient({
                method: 'GET',
                url: `${API}`,
                params: filteredParams,
            })
            contracts.value = res.data.items
            if (currentContractType.value === 'Client') clientCount.value = res.data.totalCount
            else providerCount.value = res.data.totalCount
        } catch (error) {
            console.log(error, 'ошибка в fetchContracts')
            error.value = error.response.data?.message
        } finally {
            loading.value = false
        }
    }
    async function fetchContract(id) {
        if (!openContracts.value.find((item) => item.id === id)) {
            try {
                const res = await apiClient({
                    method: 'GET',
                    url: `${API}/${id}/serviceFee`,
                })
                openContracts.value.push({
                    data: transformResponse(res.data),
                    id: id,
                })
            } catch (error) {
                console.log(error, 'ошибка в fetchContract')
                error.value = error.response.data?.message
            }
        }
    }

    return {
        contracts,
        openContracts,
        selectedContracts,
        allChecked,
        loading,
        error,
        clientCount,
        providerCount,
        currentContractType,
        indeterminate,
        getContractById,
        isAllChecked,
        controlSelectedContracts,
        fetchContracts,
        fetchContract,
        clearContracts,
        fetchContractsList,
    }
})
