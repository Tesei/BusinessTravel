/**
 * Helper форматирования даты до '01.01.2025'
 * @argument {String} date Дата в формате String ('2025-01-01T00:00:00Z').
 */
export const formatResponseDate = (date) => {
    return date.split('T')[0].split('-').reverse().join('.')
}

/**
 * Helper форматирования даты до '01.01.2025 20:21'
 * @argument {String} date Дата в формате String ('2025-01-01T00:00:00Z').
 */
export const formatResponseDateWithHours = (date) => {
    if (!date) {
        return ''
    }
    const days = date.substring(0, 10).split('-').reverse().join('.')
    const hours = date.substring(11, 16)
    return days + ' ' + hours
}

/**
 * Преобразует дату из формата UTC в локальное время и возвращает её в заданном формате.
 * Форматирует дату и время в строку на основе переданного шаблона.
 *
 * @param {String} utcDateString - Дата в формате строки UTC, например, '2025-01-01T00:00:00Z'.
 * @param {String} [format='DD.MM.YYYY HH:mm'] - Шаблон для форматирования даты и времени.
 *   Поддерживаемые плейсхолдеры:
 *   - 'DD' — день месяца (две цифры),
 *   - 'MM' — месяц (две цифры),
 *   - 'YYYY' — год (четыре цифры),
 *   - 'HH' — часы (две цифры, 24-часовой формат),
 *   - 'mm' — минуты (две цифры).
 * @returns {String} Отформатированная строка даты и времени.
 * @example
 * formatUtcToLocalDateTime("2023-10-05T14:30:00Z");
 * // Возвращает "05.10.2023 17:30"
 *  @example
 * formatUtcToLocalDateTime("2023-10-05T14:30:00Z", "DD.MM HH:mm");
 * // Возвращает "05.10 17:30"
 *
 */
export function formatUtcToLocalDateTime(utcDateString, format = 'DD.MM.YYYY HH:mm') {
    // Проверка на пустую строку, null, undefined и т.д.
    if (!utcDateString) {
        console.error('Date string is empty or undefined')
        return ''
    }

    // Создание объекта Date
    const date = new Date(utcDateString)

    // Проверка, что дата валидна
    if (isNaN(date.getTime())) {
        console.error('Invalid date string provided')
        return ''
    }

    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')

    return format.replace('DD', day).replace('MM', month).replace('YYYY', year).replace('HH', hours).replace('mm', minutes)
}

/**
 * Helper расчета количества дней между датами
 * @argument {Date} startDate Дата начала.
 * @argument {Date} endDate Дата окончания.
 */
export const daysBetween = (startDate, endDate) => {
    if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
        throw new Error('Применяйте корректные объекты Date.')
    }

    const diffTime = Math.abs(
        Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()) -
            Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()),
    )
    return Math.round(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Helper склонения слов в зависимости от количества
 * @argument {Number} value Количество.
 * @argument {Array} words Массив слов по возрастанию ['турист','туриста','туристов'].
 */
export const inclineFilter = (value, words) => {
    let result

    if ((value % 100 > 9 && value % 100 < 20) || (value % 10 > 4 && value % 10 < 10) || value % 10 === 0) {
        result = words[2]
    } else if (value % 10 === 1) {
        result = words[0]
    } else {
        result = words[1]
    }

    return result
}

/**
 * Helper получения ключа по значению в объекте
 * @argument {String} value Значение.
 * @argument {Object} object Объект.
 */
export const getKeyByValue = (object, value) => Object.keys(object).find((key) => object[key] === value)

/**
 * Helper получения даты в формате "12 янв 2025"
 * @argument {String} string Дата в формате String ('2025-01-01T00:00:00Z').
 */
export const formatDate = (string) => {
    let date = new Date(string)
    let day = date.getUTCDate()
    let monthIndex = date.getUTCMonth()
    let year = date.getUTCFullYear()

    let months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
    let monthName = months[monthIndex]

    return day + ' ' + monthName + ' ' + year
}

/**
 * Helper получения разницы между датами в формате "1д 5ч 14м"
 * @argument {String} endDate Дата в формате String ('2025-01-01T00:00:00Z').
 * @argument {String} startDate Дата в формате String ('2025-01-01T00:00:00Z').
 * @argument {Boolean} iso Формат вывода: true - '10:00:00', false - '1д 4ч 10м'
 */
export const timeBetween = (endDate, startDate, iso) => {
    let diff = Date.parse(endDate) - Date.parse(startDate)

    // Преобразование времени в дни, часы, минуты и секунды
    let days = Math.floor(diff / (1000 * 3600 * 24))
    let hours = Math.floor((diff / (1000 * 3600)) % 24)
    let minutes = Math.floor((diff / 1000 / 60) % 60)

    if (!iso) {
        return diff >= 0
            ? `${days ? days : ''}${days ? 'д' : ''}${hours ? (days ? ' ' + hours : hours) : ''}${hours ? 'ч' : ''}${
                  minutes ? (days || hours ? ' ' + minutes : minutes) : '' // eslint-disable-line
              }${minutes ? 'м' : ''}` // eslint-disable-line
            : 'Конечная дата должна быть позже, чем начальная дата!'
    } else {
        return diff >= 0
            ? `${days ? days + '.' : ''}${
                  hours ? (String(hours).length > 1 ? hours : '0' + hours) : '00' // eslint-disable-line
              }:${minutes ? (String(minutes).length > 1 ? minutes : '0' + minutes) : '00'}:00` // eslint-disable-line
            : 'Конечная дата должна быть позже, чем начальная дата!'
    }
}

/**
 * Helper суммирования времени (формат возвращаемого значения - "1д 5ч 14м")
 * @argument {Array} times Массив с количеством времени '['08:30:00', '12:05:00', '1.15:35:00']'.
 */
export const sumAndFormatTimes = (times) => {
    let obj = { minutes: 0, hours: 0, days: 0 }
    times.forEach((time) => {
        let timeString
        if (time.includes('.')) {
            let tempArr = time.split('.')
            obj.days += +tempArr[0]
            timeString = tempArr[1]
        } else {
            timeString = time
        }
        let tempArr = timeString.split(':')
        obj.hours += +tempArr[0]
        obj.minutes += +tempArr[1]
    })

    for (const key in obj) {
        switch (key) {
            case 'minutes':
                obj.hours += Math.floor(obj.minutes / 60)
                obj.minutes = Math.floor(obj.minutes % 60)
                break
            case 'hours':
                obj.days += Math.floor(obj.hours / 24)
                obj.hours = Math.floor(obj.hours % 24)
                break
        }
    }
    if (times.length) {
        return `${obj.days ? obj.days : ''}${obj.days ? 'д' : ''}${
            obj.hours ? (obj.days ? ' ' + obj.hours : obj.hours) : ''
        }${obj.hours ? 'ч' : ''}${
            obj.minutes ? (obj.days || obj.hours ? ' ' + obj.minutes : obj.minutes) : ''
        }${obj.minutes ? 'м' : ''}`
    } else return ''
}

/**
 * Helper выводит  фамилию и инициалы - "Петров А.В.")
 * @argument {Object}  объект содержащий firstName, lastName, middleName '.
 */
export const getShortName = (obj) => {
    if (!obj) return ''
    const { firstName = '', lastName = '', middleName = '' } = obj
    return `${lastName} ${firstName ? firstName[0] + '.' : ''} ${middleName ? middleName[0] + '.' : ''}`
}
