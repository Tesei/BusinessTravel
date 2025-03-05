import { defineStore } from 'pinia'
import { computed } from 'vue'
import apiClient from '@/services/apiClient'
import { formatUtcToLocalDateTime } from '@/helpers/helpers.js'
import { statusTranslate } from '@/helpers/translate.js'

import { useTripsStore } from '@/store/trips/index.js'
import { useUserStore } from '@/store/user/index.js'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/store/notification/index.js'

const userStore = useUserStore()
const tripsStore = useTripsStore()
const notificationStore = useNotificationStore()
const { setNotification } = notificationStore

const API = '/v1/btservice/trips/'

export const useApproveStore = defineStore('approveStore', () => {
    const router = useRouter()
    const tripId = computed(() => tripsStore.getSingleTrip.id)
    const currrentStepId = computed(() => tripsStore?.getSingleTrip?.approveDetails?.currentStepId || isUserApprover.value)
    // Шаги согласования и проверяющие персоны
    //===============================================================

    const getApproversStatusList = computed(() => {
        const arr = []
        tripsStore?.getSingleTrip?.approveDetails?.approveSteps?.forEach((step) => {
            let stepId = step.id
            if (step.status === 'Pending') {
                if (step.requiredApprovers.length > 1) {
                    arr.push(...createSeveralApprovers(step, stepId))
                } else {
                    arr.push({
                        status: 'Pending',
                        title: step.requiredApprovers[0].employee.fullName,
                        description: 'ожидает согласования',
                        id: step.requiredApprovers[0].employee.id,
                        step: stepId,
                    })
                }
            } else {
                arr.push({
                    status: step.status,
                    title: step.completedBy.fullName,
                    description: createApproveDescription(step),
                    id: step.completedBy.id,
                    step: stepId,
                })
            }
        })
        return arr
    })

    function createApproveDescription(step) {
        return formatUtcToLocalDateTime(step.completedDate) + ' ' + statusTranslate[step.status]
    }

    function createSeveralApprovers(step, stepNumber) {
        let stepArr = []
        step.requiredApprovers.forEach((persona, index) => {
            stepArr.push({
                status: index === 0 ? 'Pending' : '',
                title: persona.employee.fullName,
                description: 'ожидает согласования',
                id: persona.employee.id,
                step: stepNumber,
            })
        })
        return stepArr
    }
    //===============================================================

    // Проверка, является ли пользователь проверяющим
    //===============================================================
    const isUserApprover = computed(() => {
        const id = userStore.getUserEmployeeId
        let isApprover = false
        getApproversStatusList.value.forEach((item) => {
            if (item?.id.replaceAll(' ', '') === id.replaceAll(' ', '') && item?.status !== 'Approved') isApprover = item.step
        })
        return isApprover
    })

    // Получение списка действий
    //===============================================================
    const getTripActions = computed(() => {
        let arr = tripsStore.getTrips[0]?.actions
        if (arr?.includes('Approve') && isUserApprover.value === false) {
            return arr?.filter((item) => item !== 'Approve')
        } else return arr
    })
    // Заменены кнопки на валидные
    const getModefiedTripActions = computed(() => {
        if (tripsStore?.getSingleTripStatus === 'Draft') {
            return [...getTripActions.value].reverse()
        }
        if (tripsStore?.getSingleTripStatus === 'Revoked') {
            return getTripActions.value.map((item) => {
                if (item === 'SendForApproval') item = 'SendForApprovalBack'
                if (item === 'Cancel') item = ''
                return item
            })
        }
        if (tripsStore?.getSingleTripStatus === 'Rejected') {
            return getTripActions.value.map((item) => {
                if (item === 'Cancel') item = ''
                return item
            })
        }
        if (tripsStore?.getSingleTripStatus === 'Cancelled') {
            return getTripActions.value.map((item) => {
                if (item === 'Revoke') item = ''
                return item
            })
        } else return getTripActions.value
    })

    // Отозвать
    const fetchRevokeSolution = async (comments) => {
        try {
            await apiClient({
                method: 'POST',
                url: API + tripId.value + '/actions/revoke',
                data: comments,
            })
            await tripsStore.fetchActionsOfTripSingle(tripId.value)
            await tripsStore.fetchSingleTrip(tripId.value)
        } catch (error) {
            console.error('Ошибка в fetchRevokeSolution:', error.message)
            throw error
        }
    }

    // Отклонить
    const fetchRejectSolution = async (comments) => {
        try {
            await apiClient({
                method: 'POST',
                url: API + tripId.value + '/actions/step/' + currrentStepId.value + '/reject',
                data: comments,
            })
            await tripsStore.fetchActionsOfTripSingle(tripId.value)
            await tripsStore.fetchSingleTrip(tripId.value)
        } catch (error) {
            console.error('Ошибка в fetchRejectSolution:', error.message)
            throw error
        }
    }

    // Отменить
    const fetchCancelSolution = async (comments) => {
        try {
            await apiClient({
                method: 'POST',
                url: API + tripId.value + '/actions/cancel',
                data: comments,
            })
            await tripsStore.fetchActionsOfTripSingle(tripId.value)
            await tripsStore.fetchSingleTrip(tripId.value)
        } catch (error) {
            console.error('Ошибка в fetchCancelSolution:', error.message)
            throw error
        }
    }
    // Согласовать
    const fetchApproveSolution = async () => {
        try {
            await apiClient({
                method: 'POST',
                url: API + tripId.value + '/actions/step/' + currrentStepId.value + '/approve',
                data: '',
            })
            await tripsStore.fetchActionsOfTripSingle(tripId.value)
            await tripsStore.fetchSingleTrip(tripId.value)
        } catch (error) {
            console.error('Ошибка в fetchApproveSolution:', error.message)
            throw error
        }
    }

    //Удалить
    const fetchDeleteSolution = async () => {
        try {
            const tripsResponse = await apiClient({
                method: 'DELETE',
                url: API + tripId.value,
            })
            if (tripsResponse.status === 204) {
                router.push({ name: 'trips' })
                setNotification('Командировка удалена', 'green')
            }
        } catch (error) {
            console.error('Ошибка в fetchDeleteSolution:', error.message)
            throw error
        }
    }

    return {
        fetchRevokeSolution,
        fetchRejectSolution,
        fetchApproveSolution,
        fetchCancelSolution,
        getApproversStatusList,
        isUserApprover,
        getTripActions,
        getModefiedTripActions,
        currrentStepId,
        fetchDeleteSolution,
    }
})
