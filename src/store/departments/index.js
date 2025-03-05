import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '@/services/apiClient'
import { useNotificationStore } from '@/store/notification/index.js'

const API = '/v1/btmanagement/departments'
const employees = '/v1/btmanagement/employees'

export const useDepartmentsStore = defineStore('departmentsStore', () => {
    const notificationStore = useNotificationStore()
    const { setNotification } = notificationStore
    // STATE
    const departmentsTree = ref([])
    const isDepartmentsLoading = ref(true)
    const foundDepartments = ref([])
    const showCreateModal = ref(false)
    const showDeleteModal = ref(false)
    const department = ref(null)
    const currentPopup = ref('')
    const head = ref('')
    // ACTIONS
    const setCurrentPopup = (action) => {
        currentPopup.value = action
    }
    const handleOpenPopup = async (node, action) => {
        setCurrentPopup(action)
        showCreateModal.value = true
        department.value = node
        if (action === 'DepartmentEdit') {
            await fetchDepartment(department.value.id)
        }
    }
    const handleClosePopup = () => {
        showCreateModal.value = false
        department.value = null
        setCurrentPopup('')
    }

    const handleOpenDeletePopup = (node) => {
        showDeleteModal.value = true
        department.value = node
    }
    const handleCloseDeletePopup = () => {
        showDeleteModal.value = false
        department.value = null
    }
    const createNewDepartment = async (data) => {
        isDepartmentsLoading.value = true
        try {
            const res = await apiClient({
                method: 'POST',
                url: API,
                data,
            })
            setNotification('Подразделение успешно создано', 'green')
            return res.data
        } catch (error) {
            console.error('Ошибка в createNewDepartment:', error.message)
            throw error
        } finally {
            isDepartmentsLoading.value = false
        }
    }
    async function fetchDepartmentsTree() {
        try {
            const res = await apiClient({
                method: 'GET',
                url: `${API}/tree`,
            })
            isDepartmentsLoading.value = true
            if (res) {
                departmentsTree.value = res.data
            }

            return res
        } catch (error) {
            console.error('Ошибка в fetchDepartmentsTree:', error.message)
        } finally {
            isDepartmentsLoading.value = false
        }
    }
    async function fetchDepatmentsSearch(searchText) {
        try {
            const res = await apiClient({
                method: 'GET',
                url: `${API}?&page=1&pageSize=30&search=${searchText}`,
            })
            foundDepartments.value = res.data.items
            return res
        } catch (error) {
            console.error('Ошибка в fetchDepatmentsSearch:', error.message)
        }
    }

    const deleteDepartment = async (id) => {
        isDepartmentsLoading.value = true
        try {
            const res = await apiClient({
                method: 'DELETE',
                url: `${API}/${id}`,
            })
            return res
        } catch (error) {
            console.error('Ошибка в deleteDepartment:', error.message)
            throw error
        } finally {
            isDepartmentsLoading.value = false
        }
    }

    async function appointHead(data) {
        isDepartmentsLoading.value = true
        try {
            await apiClient({
                method: 'PUT',
                url: `${API}/head`,
                data,
            })
            await fetchDepartment(department.value.id)
        } catch (error) {
            console.error('Ошибка в appointHead:', error.message)
            throw error
        } finally {
            isDepartmentsLoading.value = false
        }
    }
    async function editDepartment(data, id) {
        isDepartmentsLoading.value = true
        try {
            const res = await apiClient({
                method: 'PUT',
                url: `${API}/${id}`,
                data,
            })
            setNotification('Подразделение успешно изменено', 'green')
            return res.status
        } catch (error) {
            console.error('Ошибка в editDepartment:', error.message)
        } finally {
            isDepartmentsLoading.value = false
        }
    }
    async function fetchDepartment(id) {
        isDepartmentsLoading.value = true
        try {
            const res = await apiClient({
                method: 'GET',
                url: `${API}/${id}`,
            })
            department.value = res.data
            if (department.value?.headEmployeeId) {
                await fetchEmployee(department.value?.headEmployeeId)
            }
        } catch (error) {
            console.error('Ошибка в fetchDepartment:', error.message)
        } finally {
            isDepartmentsLoading.value = false
        }
    }
    async function fetchEmployee(id) {
        isDepartmentsLoading.value = true
        try {
            const res = await apiClient({
                method: 'GET',
                url: `${employees}/${id}`,
            })
            head.value = res.data
        } catch (error) {
            console.error('Ошибка в fetchEmployee:', error.message)
        } finally {
            isDepartmentsLoading.value = false
        }
    }
    async function removeHeadEmployee(id) {
        isDepartmentsLoading.value = true
        try {
            await apiClient({
                method: 'DELETE',
                url: `${API}/${id}/head`,
            })
            await fetchDepartment(department.value.id)
        } catch (error) {
            console.error('Ошибка в removeHeadEmployee:', error.message)
        } finally {
            isDepartmentsLoading.value = false
        }
    }
    return {
        fetchDepartmentsTree,
        fetchDepatmentsSearch,
        createNewDepartment,
        handleOpenPopup,
        handleClosePopup,
        departmentsTree,
        isDepartmentsLoading,
        foundDepartments,
        department,
        showCreateModal,
        showDeleteModal,
        currentPopup,
        head,
        handleOpenDeletePopup,
        handleCloseDeletePopup,
        deleteDepartment,
        setCurrentPopup,
        appointHead,
        fetchEmployee,
        removeHeadEmployee,
        editDepartment,
    }
})
