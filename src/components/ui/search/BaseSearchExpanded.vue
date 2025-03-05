<template>
    <div class="flex-jcsb-aifs flex-d-c">
        <div class="mb-16 mt-16 search-row">
            <div class="search-row__item">
                <base-input
                    placeholder="Номер командировки"
                    v-maska="tripNumberMaskaOptions"
                    v-model="tripNumber"
                />
            </div>
            <div class="search-row__item">
                <base-input-date
                    placeholder="Дата начала"
                    v-model="startDate"
                    :error-text="startDateError ? 'Неверная дата' : ''"
                />
            </div>
            <div class="search-row__item">
                <base-input-date
                    placeholder="Дата окончания"
                    v-model="endDate"
                    :error-text="endDateError ? 'Неверная дата' : ''"
                />
            </div>
        </div>
        <div class="mb-16 search-row">
            <div class="search-row__item">
                <base-select
                    type="big"
                    label="Статус заявки"
                    with-dropdown
                    :value="statusOrder"
                    v-model="statusIsActive"
                >
                    <base-droplist
                        v-if="statusIsActive"
                        position-x="left"
                        position-y="bottom"
                        :list="statusList"
                        v-model:is-active="statusIsActive"
                        v-model:active-item="statusOrder"
                        type="basic"
                    ></base-droplist>
                </base-select>
            </div>
            <div class="search-row__item">
                <base-select
                    type="big"
                    label="Город назначения"
                    with-dropdown
                    :value="toDirectionIdValue"
                    v-model="toDirectionIdIsActive"
                >
                    <base-dropdown-with-api
                        v-if="toDirectionIdIsActive"
                        position-y="bottom"
                        v-model:active-items="toDirectionId"
                        v-model:is-active="toDirectionIdIsActive"
                        placeholder="Город назначения"
                        search-type="directions"
                        not-data-title="Города назначения не найдены"
                        :line-count="5"
                    ></base-dropdown-with-api>
                </base-select>
            </div>
            <div class="search-row__item">
                <base-select
                    type="big"
                    label="Командируемый"
                    with-dropdown
                    :value="userType"
                    v-model="userTypeIsActive"
                >
                    <base-droplist
                        v-if="userTypeIsActive"
                        position-x="left"
                        position-y="bottom"
                        :list="userTypeList"
                        v-model:is-active="userTypeIsActive"
                        v-model:active-item="userType"
                        type="basic"
                    ></base-droplist>
                </base-select>
            </div>
        </div>
        <base-button
            @click="emit('buttonClick')"
            classNames="font-button_M button button_blue search-button"
            :disabled="endDateError || startDateError || preloader"
            >{{ placeholder }}</base-button
        >
    </div>
</template>

<script setup>
import BaseInput from '@ui/inputs/BaseInput.vue'
import BaseInputDate from '@ui/inputs/BaseInputDate.vue'
import BaseButton from '@ui/buttons/BaseButton.vue'
import BaseSelect from '@ui/select/BaseSelect.vue'
import BaseDroplist from '@ui/select/BaseDroplist.vue'
import { computed, reactive, ref, watch } from 'vue'
import BaseDropdownWithApi from '@ui/select/BaseDropdownWithApi.vue'
import { vMaska } from 'maska/vue'

/**
 * @property {String} placeholder Текст кнопки.
 * @property {Array} statusObj Объект значений выпадающего списка статусов (required).
 * @property {Array} userTypeList Массив значений выпадающего списка типов юзера (required).
 * @property {Boolean} startDateError Ошибка даты начала (required).
 * @property {Boolean} endDateError Ошибка даты окончания (required).
 * @property {Boolean} preloader Прелоадер запроса.
 */
const props = defineProps({
    placeholder: {
        type: String,
        default: 'Поиск',
    },
    statusObj: {
        type: Object,
        required: true,
    },
    userTypeList: {
        type: Array,
        required: true,
    },
    startDateError: {
        type: Boolean,
        required: true,
    },
    endDateError: {
        type: Boolean,
        required: true,
    },
    preloader: {
        type: Boolean,
    },
})

/**
 * @model {String} tripNumber Модель для input Номер командировки (required).
 * @model {String} startDate Модель для input Дата начала (required).
 * @model {String} endDate Модель для input Дата окончания (required).
 * @model {String} statusOrder Модель для select Статус заявки (required).
 * @model {Array} toDirectionId Модель для select Город назначения (required).
 * @model {String} userType Модель для select Командируемый (required).
 */
const tripNumber = defineModel('tripNumber', { required: true })
const startDate = defineModel('startDate', { required: true })
const endDate = defineModel('endDate', { required: true })
const status = defineModel('status', { required: true })
const toDirectionId = defineModel('toDirectionId', { required: true })
const userType = defineModel('userType', { required: true })

const emit = defineEmits(['buttonClick'])

const statusOrder = ref('')
const statusIsActive = ref(false)
const toDirectionIdIsActive = ref(false)
const userTypeIsActive = ref(false)
const tripNumberMaskaOptions = reactive({
    mask: 'a########',
    tokens: {
        a: { pattern: /[1-9]/ },
    },
})

const toDirectionIdValue = computed(() => {
    return toDirectionId.value.length ? toDirectionId.value.map((el) => el.nameRus).join(', ') : ''
})
const statusList = computed(() => Object.values(props.statusObj))

watch(statusOrder, () => {
    let arr = Object.entries(props.statusObj).find((item) => item[1] === statusOrder.value)
    if (arr) status.value = arr[0]
})
</script>

<style scoped lang="scss">
.search-row {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, minmax(100px, 1fr));
    gap: 24px;
}

.search-button {
    margin-left: auto;
}
</style>
