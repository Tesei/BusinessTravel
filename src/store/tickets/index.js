import { defineStore } from 'pinia'
import apiClient from '@/services/apiClient'

const API = '/v1/btservice/trips/'
const airAPI = '/v1/btservice/air/'

export const useTicketsStore = defineStore(
    'tickets',
    () => {
        // STATE

        // GETTERS
        const fetchServiceById = async (tripId, tripServiceId) => {
            try {
                const response = await apiClient({
                    method: 'GET',
                    url: `${API}${tripId}/service/${tripServiceId}`,
                })
                return response.data
            } catch (error) {
                console.error('Ошибка в fetchServiceById:', error.message)
            }
        }

        const fetchOrderById = async (orderId) => {
            try {
                const response = await apiClient({
                    method: 'GET',
                    url: `${airAPI}orders/${orderId}`,
                })
                return response.data
            } catch (error) {
                console.error('Ошибка в fetchOrderById:', error.message)
            }
        }
        const downloadTicketById = async (orderId) => {
            try {
                const response = await apiClient({
                    method: 'GET',
                    url: `${airAPI}orders/${orderId}/tickets`,
                    responseType: 'arraybuffer',
                })
                if (response.status === 200) {
                    if (response.headers['content-type'] === 'application/pdf') {
                        const blob = new Blob([response.data], { type: 'application/pdf' })
                        const url = window.URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = 'ticket.pdf'
                        document.body.appendChild(a)
                        a.click()
                        a.remove()
                        window.URL.revokeObjectURL(url)
                    } else {
                        console.error('Ошибка: Ожидался PDF, но получен HTML')
                    }
                }
            } catch (error) {
                console.error('Ошибка в downloadTicketById:', error.message)
            }
        }

        return {
            fetchServiceById,
            fetchOrderById,
            downloadTicketById,
        }
    },
    {},
)
