import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import apiClient from '@/services/apiClient'
import VueCookies from 'vue-cookies'

export const useUserStore = defineStore(
    'user',
    () => {
        const isLoggedIn = ref(false) // Статус авторизации
        const changePasswordAlerts = reactive([])
        const isUserFound= ref(null)
        const directions = reactive({})
        const user = ref ({})
        const incomingTokens = ref({
            accessToken: null,
            refreshToken: null,
            refreshTokenExpiresIn: null,
            type: null,
        })
        const counterpartiesFromID= ref(null)
        // getters.js
        const getUserPermissions = computed(() => {
            return Object.keys(user.value).length ? user.value.permissions : []
        })
        const getUserId = computed( () => {
            return Object.keys(user.value).length ? user.value.id : ''
        })
        const getUserEmployeeId = computed(() => {
            return Object.keys(user.value).length ? user.value.employee?.id : ''
        })

        // actions 
        async function fetchLogIn(data) {
            let formData = new FormData()
            formData.append('username', data.login)
            formData.append('password', data.password)
            try {
                const url = '/v1/auth/login?grant=credentials'
                const res = await apiClient({
                    method: 'POST',
                    url,
                    data: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                incomingTokens.value = { ...res.data }
                await createCookiesTokens(res.data, res.data.refreshTokenExpiresIn)
                mutationLogin(true)
                return res.data
            } catch (error) {
                console.error('Ошибка в action fetchLogIn, ', error.message)
            }
        }
    
        async function createCookiesTokens(dataObj, timeToExpire) {
            try {
                for (let key in dataObj) {
                    VueCookies.remove(key)
                    VueCookies.set(key, dataObj[key], timeToExpire)
                }
            } catch (error) {
                console.error('Ошибка в action createCookiesTokens, ', error.message)
            }
        }
    
        async function deleteAllCookies() {
            VueCookies.keys().forEach((cookie) => VueCookies.remove(cookie))
        }
    
        async function uploadProfile() {
            const url = '/v1/btmanagement/profile'
            try {
                const res = await apiClient({
                    method: 'GET',
                    url,
                })
                user.value = { ...res.data.user }
    
                return res.data.user
            } catch (error) {
                console.error('Ошибка в action uploadProfile, ', error.message)
            }
        }
    
        async function uploadСounterpartyWithID() {
            const url = '/v1/obtmanagement/counterparties/' + user.value.counterparty.id
            try {
                const res = await apiClient({
                    method: 'GET',
                    url,
                })
                counterpartiesFromID.value = { ...res.data }
    
                return
            } catch (error) {
                console.error('Ошибка в action uploadСounterpartyWithID, ', error.message)
            }
        }
    
        async function uploadСounterpartyWithIDAdmin(data) {
            const url = '/v1/obtmanagement/counterparties/' + user.value.counterparty.id + '/admin'
            try {
                const res = await apiClient({
                    method: 'POST',
                    url,
                    data: data,
                })
    
                return res.data
            } catch (error) {
                console.error('Ошибка в action uploadСounterpartyWithIDAdmin, ', error.message)
            }
        }
    
        async function logout() {
            const url = `${import.meta.env.VITE_AUTH_BTUI_SERVICE}/v1/session/logout`
    
            try {
                const res = await apiClient({
                    method: 'POST',
                    url,
                })
                mutationLogin(false)
                return res
            } catch (e) {
                console.error('Ошибка в action logout, ', e.message)
            }
        }
        async function uploadCounterparties(data) {
            const url = `${import.meta.env.VITE_AUTH_BTUI_SERVICE}/v1/obtmanagement/counterparties`
    
            try {
                const res = await apiClient({
                    method: 'POST',
                    url,
                    data: data,
                })
                return res
            } catch (e) {
                console.error('Ошибка в action uploadCounterparties, ', e.message)
            }
        }
        async function uploadCounterpartiesGetInfo(isActive = null) {
            let url = `${import.meta.env.VITE_AUTH_BTUI_SERVICE}/v1/obtmanagement/counterparties?pageSize=1&page=1&isActive=${isActive}&search=`
    
            if (isActive == null) {
                url = `${import.meta.env.VITE_AUTH_BTUI_SERVICE}/v1/obtmanagement/counterparties?pageSize=1&page=1`
            }
            try {
                const res = await apiClient({
                    method: 'GET',
                    url,
                })
                return res
            } catch (error) {
                console.error('Ошибка в action uploadCounterpartiesGetInfo, ', error.message)
            }
        }
        //===============================================================
    
        async function changePassword(newPassword) {
            const params = new URLSearchParams(window.location.search)
            let url = `${import.meta.env.VITE_AUTH_BTUI_SERVICE}/v1/obtmanagement/resetSession/changePassword?resetToken=${params.get(
                'resetToken',
            )}`
            try {
                let fdata = new FormData()
                fdata.append('newPassword', newPassword)
                const res = await apiClient({
                    method: 'POST',
                    url,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    data: fdata,
                })
                return res
            } catch (e) {
                console.error('Ошибка в action changePassword, ' + e)
                mutationAddError(changePasswordAlerts, e)
            }
        }
    
        async function resetPassword(login, redirectUrl) {
            let url = '/v1/obtmanagement/users/resetPassword'
            try {
                const res = await apiClient({
                    method: 'POST',
                    url,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: { login, redirectUrl },
                })
                mutationUserFound(true)
                return res
            } catch (e) {
                console.error('Ошибка в action resetPassword, ' + e)
                mutationUserFound(false)
            }
        }
    
        //===============================================================    

        function mutationUserFound(param) {
            isUserFound.value = param
        }
        function mutationLogin(param) {
            isLoggedIn.value = param
            if (param == false) deleteAllCookies()
        }
        function mutationDirections(param) {
            directions.value = param
        }
        function mutationAddError(stateElem, error) {
            let data = error.response?.data
            if (!data) {
                return
            }
            stateElem.push({
                сorrelationId: data.trx,
                code: data.code,
                message: data.message,
                details: data.details,
                inner: null,
                stackTrace: data.stackTrace,
            })
        }

        return {
            getUserPermissions,
            getUserId,
            getUserEmployeeId,
            fetchLogIn,
            createCookiesTokens,
            deleteAllCookies,
            uploadProfile,
            uploadСounterpartyWithID,
            uploadСounterpartyWithIDAdmin,
            logout,
            uploadCounterparties,
            uploadCounterpartiesGetInfo,
            changePassword,
            resetPassword,
            mutationUserFound,
            mutationLogin,
            mutationDirections,
            mutationAddError,
            isLoggedIn,
            changePasswordAlerts,
            isUserFound,
            directions,
            user,
            incomingTokens,
            counterpartiesFromID,
        }
    },
    {
        persist: [
            {
                pick: [
                    'isLoggedIn',
                    'changePasswordAlerts',
                    'isUserFound',
                    'directions',
                    'user',
                    'incomingTokens',
                    'counterpartiesFromID',
                ],
                storage: localStorage,
            },
        ],
    },
)
