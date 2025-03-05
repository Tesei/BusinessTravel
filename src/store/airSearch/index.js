import { defineStore } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import apiClient from '@/services/apiClient'
import { computed, reactive, ref } from 'vue'
import { daysBetween, formatResponseDate, inclineFilter } from '@/helpers/helpers.js'
import { useNotificationStore } from '@/store/notification/index.js'

const tripsAPI = '/v1/btservice/trips/'
const airportAPI = '/v1/air/airports'
const airAPI = '/v1/btservice/air/'
const employeeAPI = '/v1/btmanagement/employees'
const personAPI = '/v1/btmanagement/person'

export const useAirSearchStore = defineStore(
    'airSearch',
    () => {
        const router = useRouter()
        const route = useRoute()
        // STATE
        const loader = ref(false)
        const trip = ref(null)
        const person = ref({ info: null, documents: null })
        const tariff = ref(null)
        const tariffs = ref(null)
        const order = ref(null)
        const preloader = ref(false)
        const tripInfo = ref({
            employeeName: '',
            toDirection: '',
            dates: '',
        })
        const chosenTripServiceId = ref('')
        const tripItineraryType = ref('')
        const tripLimit = ref(0)

        const from = ref({})
        const fromList = ref([])
        const fromPreloader = ref(false)
        const to = ref({})
        const toList = ref([])
        const toPreloader = ref(false)
        const departureDate = ref('')
        const departureDateError = ref('')
        const returnDate = ref('')
        const returnDateError = ref('')
        const cabinClass = ref('Economy')
        const cabinClassGuide = reactive({
            Economy: 'Эконом',
            Business: 'Бизнес',
        })
        const adult = ref(1)

        const airlines = ref([])
        const airports = ref([])
        const equipments = ref([])
        const prices = ref([])
        const filteredPrices = ref([])
        const flightsPreloader = ref(false)

        const selectedTariff = ref([])
        const isFiltersCleared = ref(false)
        // GETTERS
        const getIsDisabledBtn = computed(() => {
            if (tripItineraryType.value === 'Single') {
                return !!(
                    !Object.keys(from.value).length ||
                    !Object.keys(to.value).length ||
                    !departureDate.value ||
                    departureDateError.value ||
                    returnDateError.value ||
                    !cabinClass.value
                )
            } else {
                return !!(
                    !Object.keys(from.value).length ||
                    !Object.keys(to.value).length ||
                    !departureDate.value ||
                    departureDateError.value ||
                    !returnDate.value ||
                    returnDateError.value ||
                    !cabinClass.value
                )
            }
        })

        const getFlightsPayload = computed(() => {
            let payload = {
                from: from.value.code,
                to: to.value.code,
                departureDate: departureDate.value,
                cabinClass: cabinClass.value,
                passengers: {
                    adult: adult.value,
                },
            }
            if (returnDate.value) payload.returnDate = returnDate.value
            return payload
        })

        // ACTIONS
        function prepareDataToFetch(tripId, tripServiceId) {
            chosenTripServiceId.value = tripServiceId
            fetchTripInfo(tripId)
        }
        const fetchTripInfo = async (id) => {
            preloader.value = true
            try {
                const response = await apiClient({
                    method: 'GET',
                    url: tripsAPI + id,
                })
                tripInfo.value.employeeName = response.data.employee.fullName
                tripInfo.value.toDirection = response.data.stages[0].toDirection.name
                setTripInfoDates(response.data.startDate, response.data.endDate)
                let chosenService = response.data.services.find((el) => el.tripServiceId === chosenTripServiceId.value)
                departureDate.value = chosenService.dateBegin.split('T')[0]
                tripItineraryType.value = chosenService.itineraryType
                tripLimit.value = chosenService.limit
                trip.value = response.data
            } catch (error) {
                console.error('Ошибка в fetchTripInfo:', error.message)
                await router.push('/trips/' + id)
                throw error
            } finally {
                preloader.value = false
            }
        }

        const fetchAirportList = async ({ type, search }) => {
            type === 'from' ? (fromPreloader.value = true) : (toPreloader.value = true)
            try {
                const response = await apiClient({
                    method: 'GET',
                    url: airportAPI,
                    params: { search },
                })
                setDirectionList(type, response.data)
            } catch (error) {
                console.error('Ошибка в fetchAirportList:', error.message)
                throw error
            } finally {
                type === 'from' ? (fromPreloader.value = false) : (toPreloader.value = false)
            }
        }

        const fetchFlights = async () => {
            flightsPreloader.value = true
            try {
                const response = await apiClient({
                    method: 'POST',
                    url: airAPI + 'flights',
                    timeout: 60000,
                    data: getFlightsPayload.value,
                })
                response.data.airlines.length ? (airlines.value = response.data.airlines) : (airlines.value = [])
                response.data.airports.length ? (airports.value = response.data.airports) : (airports.value = [])
                response.data.equipments.length ? (equipments.value = response.data.equipments) : (equipments.value = [])
                response.data.prices.length ? (prices.value = response.data.prices) : (prices.value = [])
                filteredPrices.value = response.data.prices
            } catch (error) {
                console.error('Ошибка в fetchFlights:', error.message)
                airlines.value = []
                airports.value = []
                equipments.value = []
                prices.value = []
                throw error
            } finally {
                flightsPreloader.value = false
            }
        }

        const fetchTariffs = async (payload) => {
            try {
                const response = await apiClient({
                    method: 'POST',
                    url: airAPI + 'flights/price',
                    data: payload,
                })
                tariffs.value = response.data
                return response.data
            } catch (error) {
                console.error('Ошибка в fetchTariffs:', error.message)
                throw error
            }
        }

        const setTripInfoDates = (startDate, endDate) => {
            const diffDays = daysBetween(new Date(startDate), new Date(endDate))
            tripInfo.value.dates = `${formatResponseDate(startDate)} - ${formatResponseDate(endDate)} (${diffDays} ${inclineFilter(diffDays, ['день', 'дня', 'дней'])})`
        }

        const setDirectionList = (type, data) => {
            let list
            type === 'from' ? (list = fromList.value) : (list = toList.value)
            list.splice(0, list.length)
            data.forEach((el) => {
                list.push({
                    code: el.city.code,
                    name: el.city.name,
                    countryName: el.country.name,
                })
                if (el.airports.length > 1) {
                    el.airports.forEach((airport) => {
                        if (airport.code !== el.city.code) {
                            list.push({
                                code: airport.code,
                                name: el.city.name + '. ' + airport.name,
                                countryName: el.country.name,
                            })
                        }
                    })
                }
            })
        }
        const selectTariff = (tariffs) => {
            selectedTariff.value = tariffs
            tariff.value = tariffs
        }
        const filterPrice = (data, { priceMin = 0, priceMax = 0 }) => {
            return data.filter((el) => el.price >= priceMin && el.price <= priceMax)
        }

        const filterDepartureTime = (data, { min = 0, max = 0 }) => {
            return data.filter((item) => {
                const departureMinutes = item.route.legs[0].segments.map((segment) => {
                    const departureDate = new Date(segment.departureDate)
                    return departureDate.getHours() * 60 + departureDate.getMinutes()
                })

                return departureMinutes.some((minutes) => minutes >= min && minutes <= max)
            })
        }
        const filterArrivalTime = (data, { min = 0, max = 0 }) => {
            return data.filter((item) => {
                const arrivalMinutes = item.route.legs[0].segments.map((segment) => {
                    const arrivalDate = new Date(segment.arrivalDate)
                    return arrivalDate.getHours() * 60 + arrivalDate.getMinutes()
                })

                return arrivalMinutes.some((minutes) => minutes >= min && minutes <= max)
            })
        }
        const filterAirlines = (data, currentAirlineCode) => {
            return data.filter((el) =>
                el.route.legs.some((leg) => leg.segments.some((segment) => segment.carrier === currentAirlineCode)),
            )
        }
        const filterTransfers = (data, currentTransferTypes) => {
            return data.filter((item) => {
                const legs = item.route.legs
                let totalTransfers = 0

                for (const leg of legs) {
                    totalTransfers += leg.segments.length - 1
                }
                if (totalTransfers === 0 && currentTransferTypes.includes(1)) {
                    return true // Без пересадок
                } else if (totalTransfers === 1 && currentTransferTypes.includes(2)) {
                    return true // Одна пересадка
                } else if (totalTransfers > 1 && currentTransferTypes.includes(3)) {
                    return true // Две и более пересадки
                }

                return false
            })
        }
        const filterAirport = (data, airports) => {
            return data.filter((item) =>
                item.route.legs.some((leg) => leg.segments.some((segment) => airports.includes(segment.origin))),
            )
        }

        const clearFilters = () => {
            isFiltersCleared.value = true
            setTimeout(() => {
                isFiltersCleared.value = false
            }, 5000)
            filteredPrices.value = prices.value
        }

        const applyFilters = (filters) => {
            let results = prices.value

            if (filters.some((el) => el.price)) {
                results = filterPrice(results, {
                    priceMin: filters.find((el) => el.price).price.priceMin,
                    priceMax: filters.find((el) => el.price).price.priceMax,
                })
            }
            if (filters.some((el) => el.departureTime)) {
                results = filterDepartureTime(results, {
                    min: filters.find((el) => el.departureTime).departureTime.min,
                    max: filters.find((el) => el.departureTime).departureTime.max,
                })
            }
            if (filters.some((el) => el.arrivalTime)) {
                results = filterArrivalTime(results, {
                    min: filters.find((el) => el.arrivalTime).arrivalTime.min,
                    max: filters.find((el) => el.arrivalTime).arrivalTime.max,
                })
            }
            if (filters.some((el) => el.airlines && el.airlines)) {
                results = filterAirlines(results, filters.find((el) => el.airlines).airlines.code)
            }
            if (filters.some((el) => el.transfers && el.transfers.length)) {
                results = filterTransfers(results, filters.find((el) => el.transfers).transfers)
            }
            if (filters.some((el) => el.airport && el.airport.length)) {
                results = filterAirport(results, filters.find((el) => el.airport).airport)
            }
            if (isFiltersCleared.value === true) {
                filteredPrices.value = prices.value
            } else {
                filteredPrices.value = results
            }

            // isFiltersCleared.value = false
        }
        const fetchEmployeeData = async (employeeID) => {
            preloader.value = true
            try {
                const res = await apiClient({
                    method: 'GET',
                    url: `${employeeAPI}/${employeeID}`,
                })
                person.value.info = res.data
                if (res.data.personId) {
                    await fetchEmployeeDocs(res.data.personId)
                }
            } catch (error) {
                console.error('Ошибка в fetchEmployeeData:', error.message)
                throw error
            } finally {
                preloader.value = false
            }
        }

        const fetchEmployeeDocs = async (personID) => {
            const docs = {
                RussianFederationPassport: 'Паспорт РФ',
                RussianInternationalPassport: 'Заграничный паспорт РФ',
                ForeignPassport: 'Паспорт иностранного гражданина',
            }
            try {
                const res = await apiClient({
                    method: 'GET',
                    url: `${personAPI}/${personID}/documents`,
                })
                person.value.documents = res.data
                person.value.docsList = res.data.documents.map((item) => docs[item.type])
            } catch (error) {
                console.error('Ошибка в fetchEmployeeDocs:', error.message)
                throw error
            }
        }

        const orderCreate = async (data) => {
            preloader.value = true
            try {
                const res = await apiClient({
                    method: 'POST',
                    url: `${airAPI}orders`,
                    data,
                })
                router.push(`/${route.params.tripNumber}/air/${res.data.orderId}/order-confirm`)
            } catch (error) {
                console.error('Ошибка в orderCreate:', error.message)
            } finally {
                preloader.value = false
            }
        }

        const fetchServiceOrder = async (id) => {
            preloader.value = true
            try {
                const res = await apiClient({
                    method: 'GET',
                    url: airAPI + 'orders/' + id,
                })
                order.value = res.data
            } catch (error) {
                console.error('Ошибка в fetchServiceOrder:', error.message)
            } finally {
                preloader.value = false
            }
        }
        const declineOrder = async (orderId) => {
            const { setNotification } = useNotificationStore()
            preloader.value = true
            try {
                const res = await apiClient({
                    method: 'GET',
                    url: `${airAPI}orders/${orderId}/cancel`,
                })
                router.push({ name: 'trips-card', params: { tripNumber: route.params.tripNumber } })
                if (res.status === 204) {
                    await setNotification('Заказ успешно аннулирован')
                }
            } catch (error) {
                console.error('Ошибка в declineOrder:', error.message)
            } finally {
                preloader.value = false
            }
        }
        const confirmOrder = async (orderId) => {
            const { setNotification } = useNotificationStore()
            loader.value = true
            try {
                const res = await apiClient({
                    method: 'PUT',
                    url: `${airAPI}` + `${orderId}/confirm`,
                })
                router.push({ name: 'trips-card', params: { tripNumber: route.params.tripNumber } })
                if (res.status === 204) {
                    await setNotification('Заказ успешно подтверждён, билет выписан')
                }
            } catch (error) {
                console.error('Ошибка в confirmOrder:', error.message)
            } finally {
                loader.value = false
            }
        }
        const sortPrice = (type) => {
            let result = filteredPrices.value

            if (type === 1) {
                result = result.sort((a, b) => a.price - b.price)
            } else if (type === 2) {
                result = result.sort((a, b) => b.price - a.price)
            }
            filteredPrices.value = result
        }
        return {
            order,
            tariff,
            tariffs,
            person,
            trip,
            tripInfo,
            preloader,
            loader,
            chosenTripServiceId,
            tripItineraryType,
            tripLimit,
            from,
            fromList,
            fromPreloader,
            to,
            toList,
            toPreloader,
            departureDate,
            departureDateError,
            returnDate,
            returnDateError,
            cabinClass,
            cabinClassGuide,
            adult,
            airlines,
            airports,
            equipments,
            prices,
            filteredPrices,
            getIsDisabledBtn,
            flightsPreloader,
            selectedTariff,
            isFiltersCleared,
            prepareDataToFetch,
            fetchAirportList,
            fetchFlights,
            filterPrice,
            filterDepartureTime,
            fetchTariffs,
            selectTariff,
            applyFilters,
            fetchEmployeeData,
            orderCreate,
            fetchServiceOrder,
            declineOrder,
            confirmOrder,
            clearFilters,
            sortPrice,
        }
    },
    {
        persist: [
            {
                pick: ['tripInfo', 'tripLimit', 'trip', 'person', 'tariffs', 'tariff', 'chosenTripServiceId'],
                storage: localStorage,
            },
        ],
    },
)
