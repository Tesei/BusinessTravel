<template>
    <BaseWrapperPopup
        class="popup-add-employee p-24"
        @close="isClosing = true"
    >
        <template v-slot:header>
            <h3 class="Heading_3">Создание нового сотрудника</h3>
        </template>

        <div class="form">
            <h4 class="mt-32 mb-24 Heading_4">Основная информация</h4>
            <div class="row mb-24">
                <base-input
                    placeholder="Фамилия"
                    :isRequired="true"
                    :errorText="errors.lastName"
                    :disabled="isSuccessCreated"
                    maxlen="50"
                    v-model="lastNameValue"
                    @blur="validateField('lastName')"
                />
                <base-input
                    placeholder="Фамилия латиницей"
                    :isRequired="true"
                    :errorText="errors.latinLastName"
                    :disabled="isSuccessCreated"
                    maxlen="50"
                    v-model="latinLastNameValue"
                    @blur="validateField('latinLastName')"
                />
            </div>
            <div class="row mb-24">
                <base-input
                    placeholder="Имя"
                    :isRequired="true"
                    :errorText="errors.firstName"
                    :disabled="isSuccessCreated"
                    maxlen="50"
                    v-model="firstNameValue"
                    @blur="validateField('firstName')"
                />
                <base-input
                    placeholder="Имя латиницей"
                    :isRequired="true"
                    :errorText="errors.latinFirstName"
                    :disabled="isSuccessCreated"
                    maxlen="50"
                    v-model="latinFirstNameValue"
                    @blur="validateField('latinFirstName')"
                />
            </div>
            <div class="row mb-32">
                <base-input
                    placeholder="Отчество"
                    :errorText="errors.middleName"
                    :disabled="isSuccessCreated"
                    maxlen="50"
                    v-model="middleNameValue"
                    @blur="validateField('middleName')"
                />
                <base-input
                    placeholder="Отчество латиницей"
                    :errorText="errors.latinMiddleName"
                    :disabled="isSuccessCreated"
                    maxlen="50"
                    v-model="latinMiddleNameValue"
                    @blur="validateField('latinMiddleName')"
                />
            </div>
            <h4 class="mb-16 Heading_4">Дополнительная информация</h4>
            <div :class="['row mb-16', { 'mt-32': errors.gender }]">
                <base-select
                    type="big"
                    label="Пол"
                    with-dropdown
                    isRequired
                    :disabled="isSuccessCreated"
                    :value="gender"
                    v-model="selectGenderState.isActive"
                    :error="errors.gender"
                    @blur="validateField('gender')"
                >
                    <base-droplist
                        v-if="selectGenderState.isActive"
                        position-x="center"
                        position-y="bottom"
                        :list="genderList"
                        v-model:isActive="selectGenderState.isActive"
                        v-model:activeItem="gender"
                        type="search"
                        placeholder="Пол"
                    ></base-droplist>
                </base-select>
                <base-input-date
                    placeholder="Дата рождения"
                    v-model="dateOfBirth"
                    :disabled="isSuccessCreated"
                    :errorText="errors.dateOfBirth"
                    :isRequired="true"
                    :minDate="'1920-01-01'"
                    :maxDate="new Date().toISOString().slice(0, 10)"
                    @blur="validateField('dateOfBirth')"
                />
            </div>
            <div :class="['row mb-8', { 'mt-32': errors.gender }]">
                <base-checkbox
                    v-model="isDepartmentHead"
                    :disabled="isSuccessCreated"
                    label="Руководитель подразделения"
                />
            </div>
            <div :class="['row mb-16', { 'mb-32': errors.departmentId || errors.positionId }]">
                <base-select
                    type="big"
                    label="Подразделение"
                    with-dropdown
                    isRequired
                    :disabled="isSuccessCreated"
                    :value="departmentsIdValue"
                    :error="errors.departmentId"
                    v-model="departmentsIsActive"
                    @blur="validateField('departmentId')"
                >
                    <base-dropdown-with-api
                        v-if="departmentsIsActive"
                        position-y="bottom"
                        position-x="center"
                        location-type="country"
                        v-model:active-items="departmentId"
                        v-model:is-active="departmentsIsActive"
                        placeholder="Подразделение"
                        search-type="departments"
                        not-data-title="Подразделения не найдены"
                        :line-count="3"
                    />
                </base-select>
                <base-select
                    type="big"
                    label="Должность"
                    with-dropdown
                    :disabled="isSuccessCreated"
                    isRequired
                    :error="errors.positionId"
                    :value="positionIdValue"
                    v-model="positionsIsActive"
                    @blur="validateField('positionId')"
                >
                    <base-dropdown-with-api
                        v-if="positionsIsActive"
                        position-y="bottom"
                        position-x="center"
                        location-type="country"
                        v-model:active-items="positionId"
                        v-model:is-active="positionsIsActive"
                        placeholder="Должность"
                        search-type="positions"
                        not-data-title="Должности не найдены"
                        :line-count="3"
                    />
                </base-select>
            </div>
            <div class="row mb-16">
                <base-input
                    placeholder="ИНН"
                    :isRequired="true"
                    :errorText="errors.itn"
                    :disabled="isSuccessCreated"
                    type="number"
                    maxlen="12"
                    v-model="itn"
                    @blur="validateField('itn')"
                />
                <base-input
                    placeholder="Табельный номер"
                    :isRequired="true"
                    :errorText="errors.personnelNumber"
                    :disabled="isSuccessCreated"
                    maxlen="40"
                    v-model="personnelNumber"
                    @blur="validateField('personnelNumber')"
                />
            </div>
            <div class="row mb-32">
                <base-input-phone
                    isRequired
                    v-model="phoneNumber"
                    :error="errors.phoneNumber"
                    :disabled="isSuccessCreated"
                    @blur="validateField('phoneNumber')"
                />
                <base-input
                    placeholder="Email"
                    :isRequired="true"
                    :disabled="isSuccessCreated"
                    maxlen="64"
                    v-model="email"
                    :errorText="errors.email"
                    @blur="validateField('email')"
                />
            </div>
        </div>

        <template v-slot:footer>
            <base-button
                v-if="!isSuccessCreated"
                classNames="font-button_S button button_blue popup-add-employee__btn-save"
                :toShowLoading="preloader"
                :disabled="!meta.valid"
                @click="save()"
            >
                Сохранить
            </base-button>
            <base-button
                v-else
                classNames="font-button_S button button_blue popup-add-employee__btn-save"
                @click="openAddDocumentPopup"
            >
                Добавить документ сотруднику
            </base-button>
        </template>
    </BaseWrapperPopup>

    <BaseWrapperPopup
        v-if="isClosing"
        class="popup-add-employee p-24"
        @close="isClosing = true"
        :hasCloseIcon="false"
    >
        <template v-slot:header>
            <h3 class="Heading_3">Добавление документа для сотрудника</h3>
        </template>
        <div class="body_S mt-32 mb-32 close-text">Отменить создание нового сотрудника? Введенные данные не сохранятся</div>
        <template v-slot:footer>
            <div class="flex f-center">
                <base-button
                    class="button_transparent mr-32 popup-add-employee__btn-cancel"
                    @click="$emit('close')"
                >
                    Отменить
                </base-button>
                <base-button
                    class="button_blue"
                    @click="isClosing = false"
                >
                    Продолжить
                </base-button>
            </div>
        </template>        
    </BaseWrapperPopup>

    <popup-tourist-add-document
        v-if="showAddDocument"
        :employeeId="employeeId"
        @close="closeAddDocumentPopup"
        @success="$emit('close')"
    />
</template>

<script setup>
import BaseWrapperPopup from '@/components/ui/wrapper/BaseWrapperPopup.vue'
import BaseSelect from '@/components/ui/select/BaseSelect.vue'
import BaseDroplist from '@/components/ui/select/BaseDroplist.vue'
import BaseCheckbox from '@/components/ui/BaseCheckbox.vue'
import BaseButton from '@ui/buttons/BaseButton.vue'
import BaseInput from '@/components/ui/inputs/BaseInput.vue'
import BaseInputDate from '@/components/ui/inputs/BaseInputDate.vue'
import BaseDropdownWithApi from '@/components/ui/select/BaseDropdownWithApi.vue'
import BaseInputPhone from '@/components/ui/inputs/BaseInputPhone.vue'
import PopupTouristAddDocument from '@/components/employees/PopupTouristAddDocument.vue'
import { computed, reactive, ref } from 'vue'
import { useUserStore } from '@/store/user/index.js'
import { useEmployeeStore } from '@/store/employee/index.js'
import { storeToRefs } from 'pinia'
import { useNotificationStore } from '@/store/notification'

import { useForm, useField } from 'vee-validate'
import { validateCreateEmployeeSchema } from '@/composables/useZodValidSchema'
import { useTranslit } from '@/composables/useTranslit'

const { translit } = useTranslit()

const userStore = useUserStore()
const employeeStore = useEmployeeStore()
const { preloader, employeeId } = storeToRefs(employeeStore)
const notificationStore = useNotificationStore()

const emit = defineEmits(['close'])

const { errors, meta, validateField } = useForm({
    validationSchema: validateCreateEmployeeSchema, // Используем преобразованную схему
})

const firstCharUpper = (val) => {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1)
}

const { value: lastName, setValue: setLastName } = useField('lastName')
const { value: latinLastName, setValue: setlatinLastName } = useField('latinLastName')
const lastNameValue = computed({
    get() {
        return lastName.value
    },
    set(val) {
        setLastName(firstCharUpper(val))
        setlatinLastName(translit(firstCharUpper(val)))
    },
})

const latinLastNameValue = computed({
    get() {
        return latinLastName.value
    },
    set(val) {
        setlatinLastName(translit(firstCharUpper(val)))
    },
})

const { value: firstName, setValue: setFirstName } = useField('firstName')
const { value: latinFirstName, setValue: setlatinFirstName } = useField('latinFirstName')
const firstNameValue = computed({
    get() {
        return firstName.value
    },
    set(val) {
        setFirstName(firstCharUpper(val))
        setlatinFirstName(translit(firstCharUpper(val)))
    },
})

const latinFirstNameValue = computed({
    get() {
        return latinFirstName.value
    },
    set(val) {
        setlatinFirstName(translit(firstCharUpper(val)))
    },
})

const { value: middleName, setValue: setMiddleName } = useField('middleName')
const { value: latinMiddleName, setValue: setlatinMiddleName } = useField('latinMiddleName')
const middleNameValue = computed({
    get() {
        return middleName.value
    },
    set(val) {
        setMiddleName(firstCharUpper(val))
        setlatinMiddleName(translit(firstCharUpper(val)))
    },
})

const latinMiddleNameValue = computed({
    get() {
        return latinMiddleName.value
    },
    set(val) {
        setlatinMiddleName(translit(firstCharUpper(val)))
    },
})

const { value: dateOfBirth } = useField('dateOfBirth')
const { value: gender } = useField('gender')
const { value: positionId } = useField('positionId')
const { value: departmentId } = useField('departmentId')
const { value: itn } = useField('itn')
const { value: personnelNumber } = useField('personnelNumber')
const { value: phoneNumber } = useField('phoneNumber')
const { value: email } = useField('email')

const genderList = reactive(['Мужской', 'Женский'])
const selectGenderState = reactive({ isActive: false, activeItem: '' })

const departmentsIsActive = ref(false)
const departmentsIdValue = computed(() => {
    return departmentId.value.length ? departmentId.value.map((el) => el.name).join(', ') : ''
})

const positionsIsActive = ref(false)
const positionIdValue = computed(() => {
    return positionId.value.length ? positionId.value.map((el) => el.name).join(', ') : ''
})

const genderValue = computed(() => {
    switch (gender.value.toLowerCase()) {
        case 'мужской':
            return 'Male'
        case 'женский':
            return 'Female'
    }

    return ''
})

const isDepartmentHead = ref(false)

const showAddDocument = ref(false)
const openAddDocumentPopup = () => {
    showAddDocument.value = true
}
const closeAddDocumentPopup = () => {
    showAddDocument.value = false
}
const isClosing = ref(false)
const isSuccessCreated = ref(false)

const save = async () => {
    try {
        const payload = {
            departmentId: departmentId.value[0].id,
            positionId: positionId.value[0].id,
            counterpartyId: userStore.user.counterparty.id,
            personalData: {
                dateOfBirth: dateOfBirth.value,
                phoneNumber: phoneNumber.value,
                firstName: firstName.value,
                lastName: lastName.value,
                middleName: middleName.value,
                latinFirstName: latinFirstName.value,
                latinLastName: latinLastName.value,
                latinMiddleName: latinMiddleName.value,
                gender: genderValue.value,
                itn: String(itn.value),
            },
            personnelNumber: personnelNumber.value,
            email: email.value,
            isDepartmentHead: isDepartmentHead.value,
        }
        await employeeStore.postEmployee(payload)
        const res = await employeeStore.putRegisterUser(employeeId.value)
        if (res.status === 204) {
            isSuccessCreated.value = true
            notificationStore.setNotification('Сохранение данных прошло успешно')
        }
    } catch (e) {
        console.error('Error save in registerUsers:', e)
    }
}
</script>

<style scoped lang="scss">
.popup-add-employee {
    .close-text {
        width: 722px;
    }
    .form {
        width: 722px;
        .row {
            width: 100%;
            display: grid;
            grid-template-columns: calc(50% - 8px) calc(50% - 8px);
            align-items: flex-start;
            column-gap: 16px;
        }
    }
    .popup-add-employee__btn-save {
        margin: 0 auto;
    }
    .popup-add-employee__btn-cancel {
        border-color: $color-red;
        color: $color-red;
    }
}
</style>
