<template>
    <base-wrapper-popup
        v-if="showModal"
        @close="onCloseModal"
        :hasCloseIcon="true"
        class="fullwidth p-24"
        v-bind="$attrs"
    >
        <template #header><h3 class="Heading_3">Создание администратора</h3></template>
        <div class="grid-container">
            <BaseInput
                class="grid-row grid-col-4 mr-24 mb-24"
                :isRequired="true"
                placeholder="Фамилия"
                @blur="validate('lastName')"
                maxlen="50"
                :errorText="inputValues.lastName.error"
                @update:modelValue="(text) => changeInputValue(text, 'lastName')"
                
            />
            <BaseInput
                class="grid-row grid-col-4 mr-24 mb-24"
                :isRequired="true"
                placeholder="Имя"
                @blur="validate('firstName')"
                maxlen="50"
                :errorText="inputValues.firstName.error"
                @update:modelValue="(text) => changeInputValue(text, 'firstName')"
                
            />
            <BaseInput
                class="grid-row grid-col-4 mb-24"
                :isRequired="false"
                placeholder="Отчество"
                @blur="validate('middleName')"
                maxlen="50"
                :errorText="inputValues.middleName.error"
                @update:modelValue="(text) => changeInputValue(text, 'middleName')"
                
            />
            <BaseInput
                class="grid-row grid-col-4 mr-24 mb-24"
                :isRequired="true"
                placeholder="Фамилия на латинице"
                @blur="validate('latinLastName')"
                maxlen="50"
                :errorText="inputValues.latinLastName.error"
                @update:modelValue="(text) => changeInputValue(text, 'latinLastName')"
                :modelValue="inputValues.latinLastName.value"
                
            />
            <BaseInput
                class="grid-row grid-col-4 mr-24 mb-24"
                :isRequired="true"
                placeholder="Имя на латинице"
                @blur="validate('latinFirstName')"
                maxlen="50"
                :errorText="inputValues.latinFirstName.error"
                @update:modelValue="(text) => changeInputValue(text, 'latinFirstName')"
                :modelValue="inputValues.latinFirstName.value"
                
            />
            <BaseInput
                class="grid-row grid-col-4 mb-24"
                :isRequired="false"
                placeholder="Отчество на латинице"
                @blur="validate('latinMiddleName')"
                maxlen="50"
                :errorText="inputValues.latinMiddleName.error"
                @update:modelValue="(text) => changeInputValue(text, 'latinMiddleName')"
                :modelValue="inputValues.latinMiddleName.value"
                
            />
            <base-select
                class="grid-row grid-col-6 mr-24 mb-24"
                type="big"
                :isRequired="true"
                label="Пол"
                :value="selectState.activeItem"
                v-model="selectState.isActive"
                with-dropdown
            >
                <base-droplist
                    v-if="selectState.isActive"
                    position-x="left"
                    position-y="bottom"
                    :list="simpleList"
                    v-model="selectState"
                    type="basic"
                    class="fullwidth"
                />
            </base-select>
            <base-input-date
                class="grid-row grid-col-6 mb-24 ml-24"
                placeholder="Дата рождения"
                :isRequired="true"
                @update:modelValue="(text) => changeInputValue(text, 'birthdayDate')"
                @blur="validate('birthdayDate')"
                :modelValue="inputValues.birthdayDate.value"
                minDate="1920-01-01"
                :maxDate="new Date().toISOString().slice(0, 10)"
                :errorText="inputValues.birthdayDate.error"
                
            />
            <base-input-phone
                :disabled="true"
                class="grid-row grid-col-4 mb-24 mr-24"
                @blur="validate('phoneNumber')"
                :error="inputValues.phoneNumber.error"
                v-model="inputValues.phoneNumber.value"
            />
            <BaseInput
                class="grid-row grid-col-4 mb-24 mr-24"
                :isRequired="true"
                placeholder="ИНН"
                @blur="validate('itn')"
                :errorText="inputValues.itn.error"
                @update:modelValue="(text) => changeInputValue(text, 'itn')"
                
            />
            <BaseInput
                class="grid-row grid-col-4 mb-24"
                :isRequired="true"
                placeholder="Email"
                @blur="validate('email')"
                maxlen="64"
                :errorText="inputValues.email.error"
                @update:modelValue="(text) => changeInputValue(text, 'email')"
                
            />
        </div>
        <BaseButton
            v-if="!isSubmit"
            @click="handleSubmit()"
            classNames="font-button_S button"
            :class="!isValidate ? 'gray-4' : 'button_blue'"
            :disabled="!isValidate"
            >Сохранить</BaseButton
        >
        <BaseButton
            v-else
            classNames="font-button_M button restore-password__button restore-password__button-loading button_blue mb-24"
            :toShowLoading="true"
        />
    </base-wrapper-popup>
</template>
<script setup>
import BaseInput from '@ui/inputs/BaseInput.vue'
import BaseDroplist from '@ui/select/BaseDroplist.vue'
import BaseSelect from '@ui/select/BaseSelect.vue'
import BaseInputDate from '@ui/inputs/BaseInputDate.vue'
import BaseInputPhone from '@ui/inputs/BaseInputPhone.vue'
import { reactive, ref, computed, watch } from 'vue'
import BaseWrapperPopup from '@ui/wrapper/BaseWrapperPopup.vue'
import BaseButton from '@ui/buttons/BaseButton.vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

const selectState = reactive({ isActive: false, activeItem: '' })
const simpleList = reactive(['Женский', 'Мужской'])
const inputValues = reactive({
    firstName: { value: null, error: null },
    lastName: { value: null, error: null },
    middleName: { value: null, error: null },
    latinFirstName: { value: null, error: null },
    latinLastName: { value: null, error: null },
    latinMiddleName: { value: null, error: null },
    email: { value: null, error: null },
    gender: { value: null, error: null },
    birthdayDate: { value: null, error: null },
    phoneNumber: { value: null, error: null },
    itn: { value: null, error: null },
    redirectUri: {
        value: `${window.location.hostname === 'localhost' ? import.meta.env.VITE_AUTH_BTUI_SERVICE : window.location.origin}/create-password`,
        error: null,
    },
})

let showModal = ref(true)

const translit = (text) => {
    const translitMap = {
        А: 'A',
        а: 'a',
        Б: 'B',
        б: 'b',
        В: 'V',
        в: 'v',
        Г: 'G',
        г: 'g',
        Д: 'D',
        д: 'd',
        Е: 'E',
        е: 'e',
        Ё: 'Yo',
        ё: 'yo',
        Ж: 'Zh',
        ж: 'zh',
        З: 'Z',
        з: 'z',
        И: 'I',
        и: 'i',
        Й: 'Y',
        й: 'y',
        К: 'K',
        к: 'k',
        Л: 'L',
        л: 'l',
        М: 'M',
        м: 'm',
        Н: 'N',
        н: 'n',
        О: 'O',
        о: 'o',
        П: 'P',
        п: 'p',
        Р: 'R',
        р: 'r',
        С: 'S',
        с: 's',
        Т: 'T',
        т: 't',
        У: 'U',
        у: 'u',
        Ф: 'F',
        ф: 'f',
        Х: 'Kh',
        х: 'kh',
        Ц: 'Ts',
        ц: 'ts',
        Ч: 'Ch',
        ч: 'ch',
        Ш: 'Sh',
        ш: 'sh',
        Щ: 'Sch',
        щ: 'sch',
        Ъ: '',
        ъ: '', // твердый знак
        Ы: 'Y',
        ы: 'y',
        Ь: '',
        ь: '', // мягкий знак
        Э: 'E',
        э: 'e',
        Ю: 'Yu',
        ю: 'yu',
        Я: 'Ya',
        я: 'ya',
    }

    return text
        .split('')
        .map((char) => translitMap[char] || char)
        .join('')
}
const onCloseModal = () => {
    showModal.value = false
}
const changeInputValue = (value, fieldName) => {
    inputValues[fieldName].value = value.trim()

    if (fieldName === 'firstName' || fieldName === 'lastName' || fieldName === 'middleName') {
        const latinFieldName = `latin${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`
        inputValues[latinFieldName].value = translit(value)
    }
    if (fieldName === 'gender') {
        inputValues.gender.value = selectState.activeItem
    }
}
const validate = (fieldName) => {
    const nameRegex = /^[А-Яа-яЁё]+([- ]?[А-Яа-яЁё0-9]+){0,2}$/
    const emailRegex =  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/
    // const emailRegex = /^[a-zA-Z0-9`!;%:?()\-_=+\/.,\[\]]+@[a-zA-Z0-9_-]+\.[a-zA-Z]{2,}$/
    let phoneRegex = /\+\d{11}$/
    let currentDate = new Date()
    let inputDate = new Date(inputValues.birthdayDate.value)
    let minDate = new Date('01.01.1920')
    switch (fieldName) {
        case 'lastName':
            validateName('lastName', 'Фамилия должна содержать больше одной буквы кириллицы, не более двух дефисов или пробела')
            break
        case 'firstName':
            validateName('firstName', 'Имя должно содержать больше одной буквы кириллицы, не более двух дефисов или пробела')
            break
        case 'middleName':
            validateName('firstName', 'Отчество должно содержать больше одной буквы кириллицы, не более двух дефисов или пробела')
            break
        case 'latinLastName':
            validateName(
                'latinLastName',
                'Фамилия должна содержать больше одной буквы латиницы, не более двух дефисов или пробела',
            )
            break
        case 'latinFirstName':
            validateName('latinFirstName', 'Имя должно содержать больше одной буквы кириллицы, не более двух дефисов или пробела')
            break
        case 'latinMiddleName':
            validateName(
                'latinMiddleName',
                'Отчество должно содержать больше одной буквы кириллицы, не более двух дефисов или пробела',
            )
            break
        case 'itn':
            if (inputValues.itn.value.length == 10 || inputValues.itn.value.length == 12) {
                inputValues.itn.error = null
            } else {
                inputValues.itn.error = 'ИНН должен состоять из 10 или 12 цифр'
            }
            break
        case 'email':
            if (emailRegex.test(inputValues.email.value)) {
                inputValues.email.error = null
            } else {
                inputValues.email.error = 'Неверный формат электронной почты'
            }
            break
        case 'phoneNumber':
            if (phoneRegex.test(inputValues.phoneNumber.value)) {
                inputValues.phoneNumber.error = null
            } else {
                inputValues.phoneNumber.error = 'Номер телефона должен состоять из 10 цифр'
            }
            break
        case 'birthdayDate':
            if (inputDate < minDate) {
                inputValues.birthdayDate.error = 'Дата рождения должна быть больше или равна 01.01.1920'
            } else if (inputDate > currentDate) {
                inputValues.birthdayDate.error = 'Дата рождения должна быть меньше или равна текущей дате'
            } else {
                inputValues.birthdayDate.error = null
            }
    }

    function validateName(fieldName, errorText) {
        if (nameRegex.test(inputValues[fieldName].value) && inputValues[fieldName].value.length > 1) {
            inputValues[fieldName].error = null
        } else {
            inputValues[fieldName].error = errorText
        }
    }
}
const isValidate = computed(() => {
    let requiredFields = [
        'firstName',
        'lastName',
        'latinFirstName',
        'latinFirstName',
        'latinLastName',
        'gender',
        'birthdayDate',
        'phoneNumber',
        'itn',
        'email',
    ]
    let arrayRequiredFields = { ...inputValues }
    for (const key in inputValues) {
        if (!requiredFields.includes(key)) {
            delete arrayRequiredFields[key]
        }
    }

    return Object.values(arrayRequiredFields).every((item) => item.value && !item.error)
})

const isSubmit = ref(false)
const handleSubmit = async () => {
    if (!isValidate.value) {
        return
    }
    isSubmit.value = true
    const inputValuesWithoutError = Object.fromEntries(Object.entries(inputValues).map(([key, { value }]) => [key, value]))
    inputValuesWithoutError.birthdayDate = new Date(inputValuesWithoutError.birthdayDate).toISOString()
    inputValuesWithoutError.gender = inputValuesWithoutError.gender == 'Женский' ? 'Female' : 'Male'
    let adminCounterparties = await userStore.uploadСounterpartyWithIDAdmin(inputValuesWithoutError)
    if (adminCounterparties) {
        await userStore.uploadСounterpartyWithID()
        isSubmit.value = false
    } else {
        isSubmit.value = false
    }
}
watch(selectState, (newValue) => {
    inputValues.gender.value = newValue.activeItem
})
</script>
<style scoped lang="scss">
.grid-row {
    min-height: 56px;
    background-color: transparent;
    border-radius: $border-radius-8;
    align-items: start;
}
.grid-container {
    gap: 0;
    padding: 0;
    margin-top: 24px;
    align-items: start;
}
.fullwidth {
    width: 100% !important;
}
.button {
    width: 100%;
    justify-content: center;
}
</style>
