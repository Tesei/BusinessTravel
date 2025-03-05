<template>
    <BaseWrapperPopup
        class="popup-tourists-add-doc p-24"
        :hasCloseIcon="!isClosing"
        @close="isClosing = true"
    >
        <template v-slot:header>
            <h3 class="Heading_3">Добавление документа для сотрудника</h3>
        </template>

        <div v-if="isClosing">
            <div class="body_S mt-32 mb-32 close-text">Отменить добавление документа для сотрудника? Введенные данные не сохранятся</div>
        </div>
        <div
            class="popup-tourists-add-doc__content"
            :class="{'popup-tourists-add-doc__content_open': selectDocumentTypeState.isActive}"
            v-else
        >
            <base-select
                class="mt-32 mb-32"
                type="big"
                label="Документ"
                with-dropdown
                isRequired
                :value="selectDocumentTypeState.activeItem"
                v-model="selectDocumentTypeState.isActive"
            >
                <base-droplist
                    v-if="selectDocumentTypeState.isActive"
                    position-x="center"
                    position-y="bottom"
                    :list="documentTypeList"
                    v-model:isActive="selectDocumentTypeState.isActive"
                    v-model:activeItem="selectDocumentTypeState.activeItem"
                    type="search"
                    placeholder="Документ"
                ></base-droplist>
            </base-select>

            <div class="mb-32">
                <div v-if="selectDocumentTypeState.activeItem === 'Паспорт РФ'">
                    <base-input
                        placeholder="Серия и номер паспорта"
                        :isRequired="true"
                        :error-text="errors.number"
                        v-maska:unmaskedValue.unmasked="optionsRf"
                        v-model="russianPassport"
                        @blur="validateField('number')"
                    />
                </div>
                <div v-else-if="selectDocumentTypeState.activeItem === 'Заграничный паспорт РФ'">
                    <base-input
                        class="mb-32"
                        placeholder="Номер паспорта"
                        :isRequired="true"
                        :error-text="errors.numberInternational"
                        v-maska:unmaskedValue.unmasked="optionsBorder"
                        v-model="russianInternationalPassport"
                        @blur="validateField('numberInternational')"
                    />
                    <base-input-date
                        placeholder="Срок действия паспорта"
                        :isRequired="true"
                        :error-text="errors.expirationDateInternational"
                        :minDate="new Date().toISOString().slice(0, 10)"
                        maxDate="2099-12-31"
                        v-model="internationalPassportDate"
                        @blur="validateField('expirationDateInternational')"
                    />
                </div>
                <div v-else-if="selectDocumentTypeState.activeItem === 'Паспорт иностранного гражданина'">
                    <base-input
                        class="mb-32"
                        placeholder="Номер паспорта"
                        :isRequired="true"
                        maxlen="16"
                        :error-text="errors.numberForeign"
                        v-model="foreignPassport"
                        @blur="validateField('numberForeign')"
                    />
                    <base-input-date
                        class="mb-32"
                        placeholder="Срок действия паспорта"
                        :isRequired="true"
                        :error-text="errors.expirationDateForeign"
                        :minDate="new Date().toISOString().slice(0, 10)"
                        maxDate="2099-12-31"
                        v-model="foreignPassportDate"
                        @blur="validateField('expirationDateForeign')"
                    />
                    <base-select
                        type="big"
                        label="Гражданство"
                        with-dropdown
                        isRequired
                        :error="errors.toDirectionId"
                        :value="toDirectionIdValue"
                        v-model="toDirectionIdIsActive"
                        @blur="validateField('toDirectionId')"
                    >
                        <base-dropdown-with-api
                            v-if="toDirectionIdIsActive"
                            position-y="bottom"
                            position-x="center"
                            location-type="country"
                            v-model:active-items="toDirectionId"
                            v-model:is-active="toDirectionIdIsActive"
                            placeholder="Гражданство"
                            search-type="directions"
                            not-data-title="Гражданство не найдены"
                            :line-count="5"
                        />
                    </base-select>
                </div>
            </div>
        </div>

        <template v-slot:footer>
            <div
                v-if="isClosing"
                class="flex f-center"
            >
                <base-button
                    classNames="font-button_S button button_transparent mr-32 popup-tourists-add-doc__btn-cancel"
                    @click="$emit('close')"
                >
                    Отменить
                </base-button>
                <base-button
                    classNames="font-button_S button button_blue"
                    @click="isClosing = false"
                >
                    Продолжить
                </base-button>
            </div>
            <base-button
                v-else
                classNames="font-button_S button button_blue popup-tourists-add-doc__btn-save"
                :disabled="!meta.valid"
                :toShowLoading="isLoading"
                @click="save"
            >
                Сохранить
            </base-button>
        </template>
    </BaseWrapperPopup>
</template>

<script setup>
import BaseWrapperPopup from '@/components/ui/wrapper/BaseWrapperPopup.vue'
import BaseSelect from '@/components/ui/select/BaseSelect.vue'
import BaseDroplist from '@/components/ui/select/BaseDroplist.vue'
import BaseButton from '@ui/buttons/BaseButton.vue'
import BaseInput from '@/components/ui/inputs/BaseInput.vue'
import BaseInputDate from '@/components/ui/inputs/BaseInputDate.vue'
import BaseDropdownWithApi from '@/components/ui/select/BaseDropdownWithApi.vue'
import { vMaska } from 'maska/vue'
import { computed, defineProps, reactive, ref } from 'vue'
import { useEmployeeStore } from '@/store/employee/index.js'
import { validatePersonAddDocumentSchema } from '@/composables/useZodValidSchema'
import { useField, useForm } from 'vee-validate'

const employeeStore = useEmployeeStore()
const emit = defineEmits(['close', 'success'])
const props = defineProps({
    employeeId: {
        type: String,
        default: '',
    }
})

const optionsRf = { mask: '#### - ### ###' }
const optionsBorder = { mask: '#########' }
const isClosing = ref(false)
const isLoading = ref(false)
const unmaskedValueRf = ref('')
const unmaskedValueBorder = ref('')

const documentTypeList = reactive(['Паспорт РФ', 'Заграничный паспорт РФ', 'Паспорт иностранного гражданина'])
const selectDocumentTypeState = reactive({ isActive: false, activeItem: 'Паспорт РФ' })

const toDirectionIdIsActive = ref(false)

const passportType = computed(() => {
    let type = 'russianFederationPassport'

    switch (selectDocumentTypeState.activeItem) {
        case 'Паспорт РФ':
            type = 'russianFederationPassport'
            break
        case 'Заграничный паспорт РФ':
            type = 'russianInternationalPassport'
            break
        case 'Паспорт иностранного гражданина':
            type = 'foreignPassport'
            break
    }

    return type
})

const validationSchema = computed(() => {
    return validatePersonAddDocumentSchema[passportType.value]
})

const { errors, meta, validateField } = useForm({
    validationSchema, // Используем преобразованную схему
})

const { value: russianPassport } = useField('number')
const { value: russianInternationalPassport } = useField('numberInternational')
const { value: foreignPassport } = useField('numberForeign')
const { value: internationalPassportDate } = useField('expirationDateInternational')
const { value: foreignPassportDate } = useField('expirationDateForeign')
const { value: toDirectionId } = useField('toDirectionId', undefined, {
    initialValue: [],
})

const toDirectionIdValue = computed(() => {
    return toDirectionId.value && toDirectionId.value.length ? toDirectionId.value.map((el) => el.nameRus).join(', ') : ''
})

const save = async () => {
    try {
        isLoading.value = true
        const payload = {
            russianFederationPassport: {
                type: 'russianFederationPassport',
                number: russianPassport.value && russianPassport.value.replace(/[\s-]/g, ''),
                expirationDate: null,
                citizenshipCountryCode: 'RU',
            },
            russianInternationalPassport: {
                type: 'russianInternationalPassport',
                number: russianInternationalPassport.value,
                expirationDate: internationalPassportDate.value,
                citizenshipCountryCode: 'RU',
            },
            foreignPassport: {
                type: 'foreignPassport',
                number: foreignPassport.value,
                expirationDate: foreignPassportDate.value,
                citizenshipCountryCode: toDirectionId.value && toDirectionId.value[0] && toDirectionId.value[0].alpha2Code,
            },
        }

        const data = payload[passportType.value]
        const employeeData = await employeeStore.fetchEmployeeData(props.employeeId)
        await employeeStore.postPersonDocument(employeeData.personId, data)
        isLoading.value = false
        emit('close')
        emit('success')
    } catch (e) {
        isLoading.value = false
        console.error('Error save in postPersonDocument:', e)
    }
}

defineExpose({ unmaskedValueRf, unmaskedValueBorder })
</script>

<style scoped lang="scss">
.popup-tourists-add-doc {
    //.popup-tourists-add-doc__content
    &__content {
        width: 722px;
    //.popup-tourists-add-doc__content_open
        &_open {
            min-height: 290px;
        }
    }
    .close-text {
        width: 722px;
    }
    .popup-tourists-add-doc__btn-save {
        margin: 0 auto;
    }
    .popup-tourists-add-doc__btn-cancel {
        border-color: $color-red;
        color: $color-red;
    }
}
</style>
