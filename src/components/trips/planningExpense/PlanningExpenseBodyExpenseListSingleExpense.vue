<template>
    <div class="p-24 bd bd-gray-9 radius-16 flex flex-d-c ai-fs jc-fs mb-24">
        <div class="flex jc-sb ai-c mb-24">
            <h3 class="Heading_4">Расход {{ expenseNumber }}</h3>
            <button
                v-if="editingAvailable"
                @click="emit('deleteExpense', expense.serviceId)"
                class="button button_square button_transparent button_no-border"
            >
                <IconSprite
                    name="common--delete"
                    className="icon__svg c-red"
                />
            </button>
        </div>
        <base-select
            type="big"
            label="Тип"
            with-dropdown
            :value="activeTypeExpense"
            v-model="typeExpenseIsActive"
            disabled
        >
            <base-droplist
                v-if="typeExpenseIsActive"
                position-x="left"
                position-y="bottom"
                :list="typeExpenseList"
                v-model:is-active="typeExpenseIsActive"
                v-model:active-item="activeTypeExpense"
                type="basic"
            ></base-droplist>
        </base-select>
        <div class="flex jc-sb ai-c mb-24 mt-24 flex-row">
            <base-select
                type="big"
                label="Пункт отправления"
                with-dropdown
                :value="startDirectionValue"
                v-model="selectStateFrom.isActive"
                :disabled="!editingAvailable"
            >
                <base-dropdown-with-api
                    v-if="selectStateFrom.isActive"
                    position-y="bottom"
                    v-model:active-items="startDirection"
                    v-model:is-active="selectStateFrom.isActive"
                    placeholder="Пункт отправления"
                    search-type="directions"
                    not-data-title="Города вылета не найдены"
                    only-cyrillic
                    :line-count="10"
                ></base-dropdown-with-api>
            </base-select>
            <base-select
                type="big"
                label="Пункт назначения"
                with-dropdown
                :value="finishDirectionValue"
                v-model="selectStateTo.isActive"
                :disabled="!editingAvailable"
            >
                <base-dropdown-with-api
                    v-if="selectStateTo.isActive"
                    position-y="bottom"
                    v-model:active-items="finishDirection"
                    v-model:is-active="selectStateTo.isActive"
                    placeholder="Пункт назначения"
                    search-type="directions"
                    not-data-title="Города вылета не найдены"
                    only-cyrillic
                    :line-count="10"
                ></base-dropdown-with-api>
            </base-select>
        </div>
        <div class="flex jc-sb ai-c mb-24">
            <base-input-date
                class="input-date mr-24"
                placeholder="Туда"
                :isRequired="true"
                minDate="1920-01-01"
                maxDate="2099-12-31"
                v-model="startDate"
                :disabled="!editingAvailable"
            />
        <!-- закомментировали на момент показа  демо MVP
         
        -->

            <!-- <base-input-date
                class="input-date"
                placeholder="Обратно"
                :isRequired="true"
                minDate="1920-01-01"
                maxDate="2099-12-31"
                v-model="endDate"
                :disabled="!roundTrip"
            /> -->
        </div>
        <!-- закомментировали на момент показа  демо MVP -->
        <!-- <BaseCheckbox
            class="mb-24"
            v-model="roundTrip"
            :label="'Туда и обратно'"
            disabled
        /> -->
        <div class="flex bg-blue-2 radius-16 p-16">
            <div class="flex jc-sb ai-c limit-row">
                <span class="Heading_4">Лимит</span>
                <span class="font-button_M">{{ expenseLimitValue }}</span>
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed, ref, reactive, watch } from 'vue'
import IconSprite from '@/components/interface/IconSprite.vue'
import BaseSelect from '@ui/select/BaseSelect.vue'
import BaseDroplist from '@ui/select/BaseDroplist.vue'
// import BaseCheckbox from '@ui/BaseCheckbox.vue'
import BaseInputDate from '@ui/inputs/BaseInputDate.vue'
import BaseDropdownWithApi from '@ui/select/BaseDropdownWithApi.vue'

const props = defineProps({
    expense: {
        type: Object,
    },
    expenseNumber: {
        type: Number,
        required: true,
    },
})

const typeExpense = computed(() => props.expense?.serviceType)
const typeExpenseIsActive = ref(false)
const typeExpenseList = reactive(['Авиа', 'ЖД'])
const mapingType = {
    Авиа: 'Plane',
    ЖД: 'Train',
}

const activeTypeExpense = computed({
    get() {
        const type = typeExpense.value
        return Object.keys(mapingType).find((key) => mapingType[key] === type) || null
    },
    set(value) {
        if (!Object.keys(mapingType).includes(value)) {
            console.warn(`Unknown type value: ${value}`)
            return
        }
        emit('changeExpense', props.expense.serviceId, 'serviceType', mapingType[value])
    },
})
const selectStateFrom = reactive({
    isActive: false,
    activeItems: [],
})
const selectStateTo = reactive({
    isActive: false,
    activeItems: [],
})

const emit = defineEmits(['deleteExpense', 'changeExpense', 'changeLimit'])

const roundTrip = ref(false)

const startDate = defineModel('startDate')
const endDate = defineModel('endDate')
const startDirection = defineModel('startDirection')
const finishDirection = defineModel('finishDirection')
const itineraryType = defineModel('itineraryType')

const startDirectionValue = computed(() =>
    startDirection.value.length ? startDirection.value.map((el) => el.nameRus).join(', ') : '',
)
const finishDirectionValue = computed(() =>
    finishDirection.value.length ? finishDirection.value.map((el) => el.nameRus).join(', ') : '',
)
const expenseLimitValue = computed(
    () => `${props.expense?.limit === 'не найден' ? 'не найден' : props.expense?.limit?.toLocaleString() + ' ₽'}`,
)

const editingAvailable = computed(() => props.expense.status === 'None')

// Следим за изменениями startDirection и finishDirection
//TODO: сделать аналогичный для селекта ТИП, сейчас он disabled
watch(
    () => startDirection.value, // Массив с зависимостями
    (newValues, oldValues) => {
        if (!oldValues) return

        if (newValues?.[0].id !== oldValues?.[0].id) {
            emit('changeLimit', props.expense.serviceId)
        }
    },
    { immediate: true }, // Для немедленного выполнения при инициализации
)

watch(
    () => finishDirection.value, // Массив с зависимостями
    (newValues, oldValues) => {
        if (!oldValues) return

        if (newValues?.[0].id !== oldValues?.[0].id) {
            emit('changeLimit', props.expense.serviceId)
        }
    },
    { immediate: true }, // Для немедленного выполнения при инициализации
)
// Следим за изменениями roundTrip, если false сбрасываем endDate.value = null
// Сейчас чекбокс отключен,
// т.к.  бэк не обрабатывает эти значения
// должно быть:
//itineraryType - Single - маршрут в одну сторону
//itineraryType - Roundtrip - маршрут туда-обратно

watch(
    () => roundTrip.value,  
    // 
    (newValues) => {
        if (!newValues) {
            endDate.value = null
            itineraryType.value = 'Single'
        } else {
            itineraryType.value = 'Roundtrip'
        }
    },
    { immediate: true }, // Для немедленного выполнения при инициализации
)
</script>

<style scoped lang="scss">
.icon__svg {
    margin-right: 0;
}
.flex {
    width: 100%;
}

.button_square {
    padding: 6px 16px;
}
.limit-row {
    padding: 5px 0;
}
.input-date {
    width: 350px;
}

.flex-row > div {
    width: 350px;
}
</style>
