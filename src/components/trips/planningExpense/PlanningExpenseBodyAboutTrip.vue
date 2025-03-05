<template>
    <div class="flex flex-d-c ai-fs jc-fs">
        <template v-if="loading">
            <base-skeleton
                skeleton-height="104px"
                class="mb-40"
            />
        </template>
        <div
            v-else
            class="p-24 bd bd-gray-9 radius-16 flex flex-d-c ai-fs jc-fs mb-24"
        >
            <template
                :key="service.serviceId"
                v-for="(service, index) in limitData"
            >
                <div class="flex jc-sb ai-c mb-12">
                    <div class="footnote_L c-gray">Билет на {{ service?.expenseType }}</div>
                    <div class="body_S">
                        {{ formattedLimits[index] }}
                    </div>
                </div>
            </template>
            <div class="flex jc-sb ai-c">
                <div class="footnote_L c-gray">Итого</div>
                <div class="body_S">{{ totalPrice }}</div>
            </div>
        </div>
        <div class="p-24 bd bd-gray-9 radius-16 flex flex-d-c ai-fs jc-fs">
            <div class="flex jc-sb ai-c Heading_4 mb-24">Данные о командировке</div>
            <div class="footnote_L c-gray mb-8">Даты командировки</div>
            <div class="body_S mb-24">{{ useFormatDateRange(trip.startDate, trip.endDate) }}</div>
            <div class="footnote_L c-gray mb-8">ФИО командируемого</div>
            <div class="body_S mb-24">{{ trip.employee?.fullName }}</div>
            <template v-if="trip.stages?.length">
                <div class="footnote_L c-gray mb-8">{{ citiesText }}</div>
                <div class="body_S">
                    <span>{{ sortedDestinations }}</span>
                </div>
            </template>
        </div>
    </div>
</template>
<script setup>
import { computed, ref, watch } from 'vue'
import BaseSkeleton from '@ui/BaseSkeleton.vue'
import { useFormatDateRange } from '@/composables/useFormatDateRange'
import { useTripsStore } from '@/store/trips/index.js'

const tripsStore = useTripsStore()

const props = defineProps({
    trip: {
        type: Object,
        required: true,
    },
    loading: {
        type: Boolean,
        required: true,
    },
})

const citiesText = computed(() => {
    return `Город${props.trip.stages?.length > 1 ? 'а' : ''} назначения`
})

// сортируем, т.к. на бэке не реализована сортировка
const sortedDestinations = computed(() => {
    return props.trip.stages
        .toSorted((a, b) => {
            return a.position - b.position
        })
        .map((item) => item.toDirection.name)
        .join(', ')
})

const limitData = ref([])

const formattedLimits = computed(() => {
    return limitData.value.map((el) => {
        return el.limit === 'не найден' ? 'не найден' : el.limit.toLocaleString() + ' ₽'
    })
})

const loadLimitData = async () => {
    try {
        // Проверяем, что services существует и является массивом
        if (!Array.isArray(props.trip.services)) {
            console.error('Ошибка: props.trip.services не является массивом или пусто')
            return
        }

        // Промапливаем данные без асинхронных запросов для лимита
        const data = props.trip.services?.map((el) => {
            return {
                ...el,
                expenseType: el.expenseType === 'Train' ? 'Поезд' : 'Самолет',
            }
        })

        // Обновляем данные без лимитов
        limitData.value = data

        // Теперь загружаем лимиты асинхронно для каждого элемента
        const updatedData = await Promise.all(
            limitData.value.map(async (el) => {
                //TODO: сейчас 'Plane' захардкожен, т.к. нет других вариантов, в дальнейшем брать из el.serviceType
                let limit
                try {
                    limit = await tripsStore.getLimit('Plane', el.fromDirection.id, el.toDirection.id, props.trip?.employee?.id)
                } catch (error) {
                    limit = { amount: 'не найден', id: 'notFound' }
                    console.error('Ошибка в updatedData при получении лимита:', error)
                }
                // Возвращаем обновленный объект с лимитом
                return {
                    ...el,
                    limit: limit.amount,
                }
            }),
        )

        // Обновляем expensesData с лимитами
        limitData.value = updatedData
    } catch (error) {
        console.error('Ошибка в loadLimitData при загрузке данных:', error)
    }
}

watch(
    () => props.trip.services,
    () => {
        loadLimitData()
    },
    { immediate: true },
)

const totalPrice = computed(() => {
    if (limitData.value.some((el) => el.limit === 'не найден')) return 'не найден'

    return limitData.value.reduce((ac, el) => ac + el.limit, 0).toLocaleString() + ' ₽'
})

</script>

<style scoped lang="scss">
.flex {
    width: 100%;
}
</style>
