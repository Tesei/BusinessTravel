import { computed } from 'vue'
import { inclineFilter, daysBetween, formatResponseDate } from '@/helpers/helpers.js'

/**
 * Возвращает строку с указанием диапазона дат и количеством дней между ними.
 *
 * @param {string} startDateValue - начальная дата.
 * @param {string} endDateValue - конечная дата.
 * @returns {string} - строка с указанием диапазона дат и количеством дней между ними.
 * Пример возвращаемого значения: 20.12.2024 - 20.12.2025 (366 дней)
 */

export function useFormatDateRange(startDateValue, endDateValue) {
    return computed(() => {
        if (!startDateValue || !endDateValue) {
            return ''
        }

        const startDate = new Date(startDateValue)
        const endDate = new Date(endDateValue)
        const daysDiff = daysBetween(startDate, endDate) + 1
        const plural = inclineFilter(daysDiff, ['день', 'дня', 'дней'])

        return `${formatResponseDate(startDateValue)} - ${formatResponseDate(endDateValue)} (${daysDiff} ${plural})`
    })
}

export function useFormatTimeToMinutes(timeString) {
    const date = new Date(timeString)
    const hours = date.getHours()
    const minutes = date.getMinutes()
    return hours * 60 + minutes
}
