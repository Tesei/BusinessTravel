import apiClient from '@/services/apiClient'
import VueCookies from 'vue-cookies'

// actions.js
export default {
    //===============================================================

    // пример action выполняющего синхронную операцию

    // пример использования во vue компоненте
    // import { onMounted, ref } from 'vue'

    // import { useUserStore } from '@/store/user'
    // const userStore = useUserStore()
    // const name = ref('')
    // onMounted(() => {
    //     name.value = userStore.syncQueryTest()
    // })

    syncQueryTest() {
        let a = 2
        let b = 3

        return a + b
    },

    // пример action выполняющего асинхронную операцию

    // пример использования во vue компоненте
    // import { onMounted, ref } from 'vue'

    // import { useUserStore } from '@/store/user'
    // const userStore = useUserStore()
    // const name = ref('')
    // onMounted(async () => {
    //     name.value = await userStore.asyncQueryTest()
    // })
    async asyncQueryTest() {
        console.log('hello')
        
        // Имитация запроса
        const queryImitation = new Promise((resolve) => {
            setTimeout(() => {
                console.log('hello2')
                resolve('response')
            }, 15000)
        })

        try {
            const reponse = await queryImitation
            return reponse
        } catch (e) {
            console.error('Ошибка в action asyncQueryTest, ' + e)
        }
    },
    //===============================================================

    async fetchLogIn(data) {
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
            this.incomingTokens = { ...res.data }
            await this.createCookiesTokens(res.data, res.data.refreshTokenExpiresIn)
            this.mutationLogin(true)
            return res.data
        } catch (error) {
            console.error('Ошибка в action fetchLogIn, ', error.message)
        }
    },

    async createCookiesTokens(dataObj, timeToExpire) {
        try {
            for (let key in dataObj) {
                VueCookies.remove(key)
                VueCookies.set(key, dataObj[key], timeToExpire)
            }
        } catch (error) {
            console.error('Ошибка в action createCookiesTokens, ', error.message)
        }
    },

    async deleteAllCookies() {
        VueCookies.keys().forEach((cookie) => VueCookies.remove(cookie))
    },

    async uploadProfile() {
        const url = '/v1/btmanagement/profile'
        try {
            const res = await apiClient({
                method: 'GET',
                url,
            })
            this.user = { ...res.data.user }

            return res.data.user
        } catch (error) {
            console.error('Ошибка в action uploadProfile, ', error.message)
        }
    },

    async uploadСounterpartyWithID() {
        const url = '/v1/obtmanagement/counterparties/' + this.user.counterparty.id
        try {
            const res = await apiClient({
                method: 'GET',
                url,
            })
            this.counterpartiesFromID = { ...res.data }

            return
        } catch (error) {
            console.error('Ошибка в action uploadСounterpartyWithID, ', error.message)
        }
    },

    async uploadСounterpartyWithIDAdmin(data) {
        const url = '/v1/obtmanagement/counterparties/' + this.user.counterparty.id + '/admin'
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
    },

    async logout() {
        const url = `${import.meta.env.VITE_AUTH_BTUI_SERVICE}/v1/session/logout`

        try {
            const res = await apiClient({
                method: 'POST',
                url,
            })
            this.mutationLogin(false)
            return res
        } catch (e) {
            console.error('Ошибка в action logout, ', e.message)
        }
    },
    async uploadCounterparties(data) {
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
    },
    async uploadCounterpartiesGetInfo(isActive = null) {
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
    },
    //===============================================================

    async changePassword(newPassword) {
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
            this.mutationAddError(this.changePasswordAlerts, e)
        }
    },

    async resetPassword(login, redirectUrl) {
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
            this.mutationUserFound(true)
            return res
        } catch (e) {
            console.error('Ошибка в action resetPassword, ' + e)
            this.mutationUserFound(false)
        }
    },

    //===============================================================

    // пример action выполняющего мутацию

    // пример использования во vue компоненте
    // import { onMounted, ref } from 'vue'

    // import { useUserStore } from '@/store/user'
    // const userStore = useUserStore()
    // onMounted(() => {
    //     userStore.mutationTest(true)
    //     console.log(userStore.isLoggedIn) // true
    // })
    mutationUserFound(isUserFound) {
        this.isUserFound = isUserFound
    },
    mutationLogin(isLoggedIn) {
        this.isLoggedIn = isLoggedIn
        if (isLoggedIn == false) this.deleteAllCookies()
    },
    mutationDirections(directions) {
        this.directions = directions
    },
    mutationAddError(stateElem, error) {
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
    },
}
