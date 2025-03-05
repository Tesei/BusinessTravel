import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import apiClient from '@/services/apiClient'

const employeeAPI = '/v1/btmanagement/employees'
const personAPI = '/v1/btmanagement/person'

export const useEmployeeStore = defineStore(
    'employee',
    () => {
        // STATE
        const preloader = ref(false)
        const employeeData = ref({})
        const employeeId = ref(null)

        // GETTERS
        const getEmployeeData = computed(() => employeeData.value)

        // ACTIONS
        const fetchEmployeeData = async (employeeID) => {
            preloader.value = true
            try {
                const res = await apiClient({
                    method: 'GET',
                    url: `${employeeAPI}/${employeeID}`,
                })
                employeeData.value = res.data
                return res.data
            } catch (error) {
                console.error('Ошибка в fetchEmployeeData:', error.message)
                throw error
            } finally {
                preloader.value = false
            }
        }

        const postEmployee = async (payload) => {
            preloader.value = true
            try {
                const res = await apiClient({
                    method: 'POST',
                    url: employeeAPI,
                    data: payload
                })
                employeeId.value = res.data
                return res.data
            } catch (error) {
                console.error('Ошибка в postEmployee:', error.message)
                throw error
            } finally {
                preloader.value = false
            }
        }

        const putRegisterUser = async (personId) => {
            preloader.value = true
            try {
                const res = await apiClient({
                    method: 'PUT',
                    url: `${employeeAPI}/${personId}/registerUser`,
                })
                return res
            } catch (error) {
                console.error('Ошибка в putRegisterUser:', error.message)
                throw error
            } finally {
                preloader.value = false
            }
        }

        const postPersonDocument = async (personId, paiload) => {
            preloader.value = true
            try {
                const res = await apiClient({
                    method: 'POST',
                    url: `${personAPI}/${personId}/documents`,
                    data: paiload
                })
                return res
            } catch (error) {
                console.error('Ошибка в postPersonDocument:', error.message)
                throw error
            } finally {
                preloader.value = false
            }
        }

        return {
            preloader,
            employeeId,
            fetchEmployeeData,
            getEmployeeData,
            postEmployee,
            putRegisterUser,
            postPersonDocument
        }
    },
    {
        persist: [
            {
                pick: [],
                storage: localStorage,
            },
        ],
    },
)
