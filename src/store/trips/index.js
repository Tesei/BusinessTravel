import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { useUserStore } from '@/store/user/index.js'
import { useNotificationStore } from '@/store/notification/index.js'
import apiClient from '@/services/apiClient'
import { useRouter } from 'vue-router'

const API = '/v1/btservice/trips/'

export const useTripsStore = defineStore(
    'trips',
    () => {
        // STATE
        const router = useRouter()
        const tripNumber = ref('')
        const startDate = ref('')
        const endDate = ref('')
        const status = ref('')
        const statusGuide = reactive({
            Draft: {
                name: 'Черновик',
                color: 'bg-gray-5',
                icon: 'common--edit'
            },
            InProgress: {
                name: 'В командировке',
                color: ['bg-cornflower', 'c-white'],
                icon: 'common--flight'
            },
            Rejected: {
                name: 'Отклонена согласующим',
                color: 'bg-red-2',
                icon: 'common--info'
            },
            Revoked: {
                name: 'Отозвана',
                color: 'bg-red-2',
                icon: 'common--info'
            },
            Approval: {
                name: 'На согласовании',
                color: 'bg-blue-2',
                icon: 'common--time'
            },
            Approved: {
                name: 'Согласована',
                color: ['bg-green', 'c-white'],
                icon: 'common--check'
            },
            Report: {
                name: 'Ожидает отчета',
                color: 'bg-blue-2',
                icon: 'common--time'
            },
            ExpenseApproval: {
                name: 'Согласование доп. расходов',
                color: 'bg-blue-2',
                icon: ''// todo уточнить
            },
            RejectedReport: {
                name: 'Расход отклонен',
                color: 'bg-red-2',
                icon: ''// todo уточнить
            },
            Cancelled: {
                name: 'Отменен',
                color: 'bg-red-2',
                icon: 'common--info'
            },
            Complete: {
                name: 'Завершен',
                color: 'bg-gray-5',
                icon: 'common--check'
            },
        })

        const getStatusGuideNames = computed(() => {
            const names = {}
            for (const [key, objValue] of Object.entries(statusGuide)) {
                names[key] = objValue.name
            }
            return names
        })
        const getStatusGuideСolors = computed(() => {
            const colors = {}
            for (const [key, objValue] of Object.entries(statusGuide)) {
                colors[key] = objValue.color
            }
            return colors
        })
        const getStatusGuideIcons = computed(() => {
            const icons = {}
            for (const [key, objValue] of Object.entries(statusGuide)) {
                icons[key] = objValue.icon
            }
            return icons
        })

        const availableFolderStatuses = reactive({
            Upcoming: ['Draft', 'InProgress', 'Rejected', 'Revoked'],
            OnApproval: ['Approval', 'Approved'],
            Report: ['Report', 'ExpenseApproval', 'RejectedReport'],
            Complete: ['Cancelled', 'Complete'],
        })

        const toDirectionId = ref([])

        const userType = ref('')
        const userTypeGuide = reactive({
            creatorUserId: 'Я - создатель',
            employeeId: 'Я - командируемый',
        })

        const tripsFolder = ref('Upcoming')
        const folderNameGuide = reactive({
            Upcoming: 'Предстоящие',
            OnApproval: 'На согласовании',
            Report: 'Пора сдавать отчеты',
            Complete: 'Завершенные',
            All: 'Все',
        })

        const sort = ref('По убыванию')
        const sortList = ref(['По убыванию', 'По возрастанию'])

        const page = ref(1)
        const pageSize = ref(30)

        const trips = ref([])
        const getTrips = computed(() => trips.value)
        const tripsCount = reactive({
            Upcoming: 0,
            OnApproval: 0,
            Report: 0,
            Complete: 0,
        })

        const preloader = ref(false)
        const singleTrip = ref({})
        const getSingleTrip = computed(() => singleTrip.value)
        const getServicesOfTrip = computed(() => singleTrip.value?.services)
        const getSingleTripStatus = computed(() => singleTrip.value?.status)
        const historyTrip = ref([])
        const singleTripActions = ref({})
        const getSingleTripActions = computed(() => singleTripActions.value)

        // GETTERS
        const getStatusObj = computed(() => {
            if (Object.keys(availableFolderStatuses).length) {
                return tripsFolder.value
                    ? Object.fromEntries(
                        availableFolderStatuses[tripsFolder.value].map((el) => [el, getStatusGuideNames.value[el]])
                    )
                    : Object.fromEntries(
                        Object.values(availableFolderStatuses)
                          .flat() // eslint-disable-line
                            .map((el) => [el, getStatusGuideNames.value[el]])  
                    )
            } else {
                return {}
            }
        })
        const getTripsSearchPayload = computed(() => {
            const { getUserId } = useUserStore()
            let payload = {
                page: page.value,
                pageSize: pageSize.value,
                filter: {},
            }
            if (tripsFolder.value) payload.filter.folder = tripsFolder.value
            if (tripNumber.value) payload.filter.tripNumber = +tripNumber.value
            if (status.value) payload.filter.status = status.value
            if (startDate.value) payload.filter.startDate = startDate.value
            if (endDate.value) payload.filter.endDate = endDate.value
            if (userType.value) payload.filter[userType.value] = getUserId
            if (toDirectionId.value.length) payload.filter.toDirectionId = toDirectionId.value[0].id
            return payload
        })
        const getStartDateError = computed(() => {
            return !!(startDate.value && (isNaN(Date.parse(startDate.value)) || startDate.value.length > 10))
        })
        const getEndDateError = computed(() => {
            if (!startDate.value && endDate.value) {
                return true
            } else
                return !!(
                    startDate.value &&
                    endDate.value &&
                    (isNaN(Date.parse(endDate.value)) ||
                        endDate.value.length > 10 ||
                        new Date(startDate.value) > new Date(endDate.value))
                )
        })
        const getSortTrips = computed(() => {
            if (sort.value === 'По убыванию') {
                return trips.value.sort((a, b) => {
                    return new Date(b.startDate) - new Date(a.startDate)
                })
            } else if (sort.value === 'По возрастанию') {
                return trips.value.sort((a, b) => {
                    return new Date(a.startDate) - new Date(b.startDate)
                })
            } else return trips.value
        })

        // ACTIONS

        const fetchTrips = async () => {
            preloader.value = true
            try {
                const tripsResponse = await apiClient({
                    method: 'POST',
                    url: API + 'find',
                    data: getTripsSearchPayload.value,
                })
                trips.value = tripsResponse.data.trips
                fetchTotalCount()
                // выполняется fetchTotalCount, т.к. сейчас fetchTrips вызвращает некорректный totalCount
                if (tripsResponse.data.trips.length) {
                    const tripsArrId = tripsResponse.data.trips.map((el) => el.id)
                    await fetchActionsOfTripSeveral(tripsArrId)
                }
            } catch (error) {
                console.error('Ошибка в fetchTrips:', error.message)
                throw error
            } finally {
                preloader.value = false
            }
        }

        const fetchTotalCount = async () => {
            preloader.value = true
            try {
                const tripsResponse = await apiClient({
                    method: 'GET',
                    url: API + 'total',
                })

                tripsResponse.data.folders.forEach((el) => {
                    availableFolderStatuses[el.name] = el.tripStatuses
                    tripsCount[el.name] = el.count
                })
            } catch (error) {
                console.error('Ошибка в fetchTotalCount:', error.message)
                throw error
            } finally {
                preloader.value = false
            }
        }

        const fetchSingleTrip = async (id) => {
            preloader.value = true
            try {
                const tripsResponse = await apiClient({
                    method: 'GET',
                    url: API + id,
                })
                singleTrip.value = tripsResponse.data
            } catch (error) {
                console.error('Ошибка в fetchSingleTrip:', error.message)
                throw error
            } finally {
                preloader.value = false
            }
        }

        const fetchActionsOfTripSeveral = async (arr) => {
            try {
                const actions = await apiClient({
                    method: 'POST',
                    url: API + 'actions',
                    data: { tripIds: arr },
                })
                trips.value.forEach((el) => {
                    el.actions = actions.data.find((item) => item.tripId === el.id).actions
                })
            } catch (error) {
                console.error('Ошибка в fetchActionsOfTripSeveral:', error.message)
                throw error
            }
        }

        const fetchActionsOfTripSingle = async (id) => {
            try {
                const actions = await apiClient({
                    method: 'POST',
                    url: API + 'actions',
                    data: { tripIds: [id] },
                })
                trips.value = actions.data // TODO заменить потом, оставить только singleTripActions.value
                singleTripActions.value = actions.data[0]
            } catch (error) {
                console.error('Ошибка в fetchActionsOfTripSingle:', error.message)
                throw error
            }
        }

        const deleteTrip = async (id) => {
            const { setNotification } = useNotificationStore()
            preloader.value = true
            try {
                const tripsResponse = await apiClient({
                    method: 'DELETE',
                    url: API + id,
                })
                if (tripsResponse.status === 204) await setNotification('Командировка удалена', 'green')
                return tripsResponse.status
            } catch (error) {
                console.error('Ошибка в deleteTrip:', error.message)
                throw error
            } finally {
                preloader.value = false
            }
        }

        const sendForApproval = async (id, report = false) => {
            const { setNotification } = useNotificationStore()
            preloader.value = true
            try {
                const tripsResponse = await apiClient({
                    method: 'POST',
                    url: API + id + '/actions/send-for-approval',
                    data: '',
                })
                if (tripsResponse.status === 204){
                    await setNotification(
                        `${report ? 'Отчет отправлен' : 'Командировка отправлена'} на согласование`,
                        'green',
                    )
                }
                return tripsResponse.status
            } catch (error) {
                console.error('Ошибка в sendForApproval:', error.message)
                throw error
            } finally {
                preloader.value = false
            }
        }

        const revokeTrip = async (id, reason) => {
            const { setNotification } = useNotificationStore()
            preloader.value = true
            try {
                const tripsResponse = await apiClient({
                    method: 'POST',
                    url: API + id + '/actions/revoke',
                    data: reason,
                })
                if (tripsResponse.status === 204) await setNotification('Командировка отозвана', 'green')
                return tripsResponse.status
            } catch (error) {
                console.error('Ошибка в revokeTrip:', error.message)
                throw error
            } finally {
                preloader.value = false
            }
        }

        const cancelTrip = async (id, reason) => {
            const { setNotification } = useNotificationStore()
            preloader.value = true
            try {
                const tripsResponse = await apiClient({
                    method: 'POST',
                    url: API + id + '/actions/cancel',
                    data: reason,
                })
                if (tripsResponse.status === 204) await setNotification('Командировка отменена', 'green')
                return tripsResponse.status
            } catch (error) {
                console.error('Ошибка в cancelTrip:', error.message)
                throw error
            } finally {
                preloader.value = false
            }
        }
        const rejectTrip = async (id, reason) => {
            const { setNotification } = useNotificationStore()
            preloader.value = true
            try {
                await fetchSingleTrip(id)
                const stepId = singleTrip.value.approveDetails.currentStepId
                const tripsResponse = await apiClient({
                    method: 'POST',
                    url: API + id + `/actions/step/${stepId}/reject`,
                    data: reason,
                })
                if (tripsResponse.status === 204) await setNotification('Командировка отклонена', 'green')
                return tripsResponse.status
            } catch (error) {
                console.error('Ошибка в rejectTrip:', error.message)
                throw error
            } finally {
                preloader.value = false
            }
        }
        const rejectReport = async (id) => {
            const { setNotification } = useNotificationStore()
            preloader.value = true
            try {
                const tripsResponse = await apiClient({
                    method: 'POST',
                    url: API + id + '/actions/reject-report',
                    data: '',
                })
                if (tripsResponse.status === 204) await setNotification('Расход отклонен', 'green')
                return tripsResponse.status
            } catch (error) {
                console.error('Ошибка в rejectReport:', error.message)
                throw error
            } finally {
                preloader.value = false
            }
        }
        const approveTrip = async (id, isExpenses = false) => {
            const { setNotification } = useNotificationStore()
            preloader.value = true
            try {
                await fetchSingleTrip(id)
                const stepId = singleTrip.value.approveDetails.currentStepId
                const tripsResponse = await apiClient({
                    method: 'POST',
                    url: API + id + `/actions/step/${stepId}/approve`,
                    data: '',
                })

                if (tripsResponse.status === 204) {
                    await setNotification(`${isExpenses ? 'Доп. расходы согласованы' : 'Командировка согласована'}`)
                }
                return tripsResponse.status
            } catch (error) {
                console.error('Ошибка в approveTrip:', error.message)
                throw error
            } finally {
                preloader.value = false
            }
        }

        const getDailyAllowances = async (directionsIds) => {
            preloader.value = true
            const promises = directionsIds.map(
                async (item) =>
                    await apiClient({
                        method: 'GET',
                        url: 'v1/btservice/dailyAllowances/resolve',
                        params: item,
                    }),
            )
            try {
                const ids = await Promise.all(promises)
                return ids.map((item) => item.data.id)
            } catch (error) {
                console.error('Ошибка в getDailyAllowances:', error.message)
                preloader.value = false
                throw error
            } finally {
                preloader.value = false
            }
        }

        const createTrip = async (data) => {
            try {
                const res = await apiClient({
                    method: 'POST',
                    url: 'v1/btservice/trips',
                    data,
                })
                router.push(`${res.data}`)
            } catch (error) {
                console.error('Ошибка в createTrip:', error.message)
                preloader.value = false
                throw error
            } finally {
                preloader.value = false
            }
        }

        const getLimit = async (expenseType, startDirectionId, finishDirectionId, employeeId) => {
            try {
                const response = await apiClient({
                    method: 'GET',
                    url: '/v1/btservice/limits/resolve',
                    params: {
                        expenseType,
                        startDirectionId,
                        finishDirectionId,
                        employeeId,
                    },
                })
                return response.data
            } catch (error) {
                console.error('Ошибка в getLimit:', error.message)
                throw error
            }
        }

        const putTrip = async (id, data) => {
            try {
                const response = await apiClient({
                    method: 'PUT',
                    url: API + id,
                    data,
                })
                return response
            } catch (error) {
                console.error('Ошибка в putTrip:', error.message)
                throw error
            }
        }

        const fetchHistoryTrip = async (id) => {
            preloader.value = true
            try {
                const response = await apiClient({
                    method: 'GET',
                    url: API + id + '/history',
                })
                historyTrip.value = response.data
            } catch (error) {
                console.error('Ошибка в fetchHistoryTrip:', error.message)
                throw error
            } finally {
                preloader.value = false
            }
        }


        return {
            tripNumber,
            startDate,
            endDate,
            status,
            getStatusGuideNames,
            availableFolderStatuses,
            toDirectionId,
            userType,
            userTypeGuide,
            tripsFolder,
            tripsCount,
            folderNameGuide,
            sort,
            sortList,
            page,
            pageSize,
            preloader,
            getStatusObj,
            getTripsSearchPayload,
            getSortTrips,
            getStartDateError,
            getEndDateError,
            fetchTrips,
            fetchSingleTrip,
            getSingleTrip,
            deleteTrip,
            sendForApproval,
            revokeTrip,
            cancelTrip,
            rejectTrip,
            rejectReport,
            getDailyAllowances,
            createTrip,
            approveTrip,
            fetchActionsOfTripSingle,
            getLimit,
            singleTrip,
            getTrips,
            putTrip,
            fetchHistoryTrip,
            historyTrip,
            singleTripActions,
            getSingleTripActions,
            getServicesOfTrip,
            getSingleTripStatus,
            getStatusGuideСolors,
            getStatusGuideIcons,
        }
    },
    {
        persist: [
            {
                pick: ['availableFolderStatuses'],
                storage: localStorage,
            },
        ],
    },
)
