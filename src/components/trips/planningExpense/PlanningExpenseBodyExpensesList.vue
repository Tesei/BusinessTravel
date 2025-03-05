<template>
    <div>
        <base-data-not-available
            v-if="!expensesData?.length && !loading"
            class="mt-32 pb-40 pt-40 not-available"
            :title="'Расходов нет'"
            description="Создайте расход, чтобы оформить трэвел-услугу"
        ></base-data-not-available>
        <template v-if="!loading">
            <planning-expense-body-expense-list-single-expense
                v-for="(expense, index) in expensesData"
                :key="expense.serviceId"
                :expense="expense"
                :expenseNumber="index + 1"
                @deleteExpense="handleDeleteExpense"
                @changeExpense="handleChangeExpense"
                @changeLimit="handleChangeLimit"
                v-model:start-date="expense.dateBegin"
                v-model:end-date="expense.dateEnd"
                v-model:start-direction="expense.startDirection"
                v-model:finish-direction="expense.finishDirection"
                v-model:itinerary-type="expense.itineraryType"
            />
        </template>
        <div
            v-if="!loading"
            class="flex ai-c mt-24"
            :class="expensesData?.length ? 'jc-sb' : 'jc-c'"
        >
            <base-button
                @click="handleAddExpense"
                :disabled="buttonAddDisabled"
                class="font-button_M button button_transparent button_small"
                :class="{ button_transparent_disabled: buttonAddDisabled }"
            >
                <IconSprite
                    name="common--plus"
                    className="button__icon"
                />Расход</base-button
            >
            <base-button
                @click="handleSave"
                class="font-button_M button button_blue button_small ml-12"
                >Сохранить</base-button
            >
        </div>
    </div>
</template>
<script setup>
import { ref, watch, computed } from 'vue'
import BaseDataNotAvailable from '@ui/BaseDataNotAvailable.vue'
import BaseButton from '@ui/buttons/BaseButton.vue'
import IconSprite from '@/components/interface/IconSprite.vue'
import { useRouter, useRoute } from 'vue-router'
import PlanningExpenseBodyExpenseListSingleExpense from '@/components/trips/planningExpense/PlanningExpenseBodyExpenseListSingleExpense.vue'
import { useTripsStore } from '@/store/trips/index.js'

const tripsStore = useTripsStore()
const router = useRouter()
const route = useRoute()
const tripId = route.params.tripNumber

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

const handleSave = async () => {
    const dailyAllowanceId = await tripsStore.getDailyAllowances([
        {
            employeeId: props.trip.employee.id,
            directionId: props.trip.stages[0].toDirection.id,
        },
    ])

    const params = {
        employeeId: props.trip.employee.id,
        startDate: props.trip.startDate,
        endDate: props.trip.endDate,
        comment: props.trip.comment,
        stages: props.trip.stages.map((item) => {
            const receivingCompaniesId = item.companiesReceiving?.map((item) => item.id)
            return {
                position: item.position,
                dailyAllowanceId: dailyAllowanceId[0],
                dateDeparture: item.dateDeparture,
                dateArrival: item.dateArrival,
                fromDirectionId: item.fromDirection.id,
                toDirectionId: item.toDirection.id,
                receivingCompanies: receivingCompaniesId,
            }
        }),
    }

    params.services = expensesData.value.map((item) => ({
        dateBegin: item.dateBegin,
        dateEnd: item.dateEnd,
        limitId: item.limitId,
        serviceType: item.serviceType,
        itineraryType: 'Single',
        //  пока itineraryType захардкожен, т.к. бэк не обрабатывает это поле
        // изменить по готовности бэка (значение д.б. привязано к чекбоксу "туда и обратно")
        startDirectionId: item.startDirection[0].id,
        finishDirectionId: item.finishDirection[0].id,
        extraLimit: item.extraLimit,
        extraLimitComment: item.extraLimitComment,
        stageSequenceId: props.trip.stages?.[0]?.position,
        // stageSequenceId сейчас берем из props.trip.stages?.[0]?.position,
        // но мб несколько stages и пока неизвестно где брать нужный
    }))

    const response = await tripsStore.putTrip(tripId, params)

    if (response.status === 204) {
        router.push(`/trips/${tripId}`)
    }
}

const emploeeyId = computed(() => {
    return props.trip?.employee?.id
})

const getLimit = async (type, fromDirection, toDirection) => {
    let limit
    try {
        limit = await tripsStore.getLimit(type, fromDirection, toDirection, emploeeyId.value)
    } catch (error) {
        limit = { amount: 'не найден', id: 'notFound' }
        console.error('Ошибка в getLimit при получении лимита:', error)
    }
    return limit
}
const expensesData = ref([])

// Асинхронная функция для загрузки данных
const loadExpensesData = async () => {
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
                dateBegin: el.dateBegin.slice(0, 10),
                startDirection: [{ ...el.fromDirection, nameRus: el.fromDirection.name }],
                finishDirection: [{ ...el.toDirection, nameRus: el.toDirection.name }],
                // TODO: не мапить serviceType, т.к. сейчас он disabled и 'Plane' по умолчанию
                serviceType: 'Plane',
                limit: 0, // Сначала ставим 0, так как лимит будет загружен позже
            }
        })

        // Обновляем данные без лимитов
        expensesData.value = data

        // Теперь загружаем лимиты асинхронно для каждого элемента
        const updatedData = await Promise.all(
            expensesData.value.map(async (el) => {
                const limit = await getLimit('Plane', el.fromDirection.id, el.toDirection.id)
                // Возвращаем обновленный объект с лимитом
                return {
                    ...el,
                    limit: limit.amount,
                    limitId: limit.id,
                }
            }),
        )

        // Обновляем expensesData с лимитами
        expensesData.value = updatedData
    } catch (error) {
        console.error('Ошибка в loadExpensesData при загрузке данных:', error)
    }
}

watch(
    () => props.trip.services,
    () => {
        loadExpensesData()
    },
    { immediate: true },
)

const handleAddExpense = async () => {
    expensesData.value.push({
        serviceId: Date.now(),
        dateBegin: new Date().toISOString().slice(0, 10),
        dateEnd: null,
        status: 'None',
        fromDirection: props.trip.stages[0].fromDirection,
        toDirection: props.trip.stages[0].toDirection,
        startDirection: [{ ...props.trip.stages[0].fromDirection, nameRus: props.trip.stages[0].fromDirection.name }],
        finishDirection: [{ ...props.trip.stages[0].toDirection, nameRus: props.trip.stages[0].toDirection.name }],
        serviceType: 'Plane',
        limit: 0,
    })
    const limit = await getLimit('Plane', props.trip.stages[0].fromDirection.id, props.trip.stages[0].toDirection.id)
    expensesData.value[expensesData.value.length - 1].limit = limit.amount
    expensesData.value[expensesData.value.length - 1].limitId = limit.id
}
const handleDeleteExpense = (id) => {
    expensesData.value = expensesData.value.filter((item) => item.serviceId !== id)
}
const handleChangeExpense = (id, key, value) => {
    expensesData.value = expensesData.value.map((item) => {
        if (item.serviceId === id) {
            item[key] = value
        }
        return item
    })
}
const handleChangeLimit = async (id) => {
    let newLimit
    const expenseValue = expensesData.value.find((item) => item.serviceId === id)
    newLimit = await getLimit('Plane', expenseValue.startDirection[0].id, expenseValue.finishDirection[0].id)

    expensesData.value = expensesData.value.map((item) => {
        if (item.serviceId === id) {
            item.limit = newLimit.amount
            item.limitId = newLimit.id
        }
        return item
    })
}

const buttonAddDisabled = computed(() => expensesData.value.length >= 10)
</script>

<style scoped lang="scss">
.not-available {
    padding-bottom: 0;
    height: auto;
    margin-top: 270px;
}
:deep(.not-result__text-wrapper) {
    margin-bottom: 0px;
}
</style>
