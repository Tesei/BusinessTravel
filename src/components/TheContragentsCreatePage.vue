<template>
    <div v-if="isPageShow">
        <base-wrapper-component
            :isDisabledButton="!isButtonActive"
            @submit="handleSubmit"
        >
            <template #title>Создание контрагента</template>
            <template #button>
                <div
                    class="flex f-center"
                    @click="backToContragentsList()"
                >
                    <IconSprite
                        name="common--arrow_back"
                        className="icon__svg c-cornflower"
                    />
                    Возврат к списку контрагентов
                </div>
            </template>
            <template #content>
                <BaseWrapperGrayBorder className="ui-contragent__content">
                    <template #header>
                        <h4 class="Heading_4">Данные контрагента</h4>
                        <div class="flex ai-c jc-sb">
                            <BaseSwitcherLabel
                                classNames="switch-contragent mr-32"
                                :default-detected="true"
                                @handleChange="(event) => changeCheckboxActive(event)"
                                ><span :class="inputValues.isActive ? 'body_S c-green' : 'body_S'"
                                    >Активен</span
                                ></BaseSwitcherLabel
                            >
                            <BaseSwitcherLabel
                                classNames="switch-contragent"
                                :default-detected="false"
                                @handleChange="(event) => changeCheckboxBlock(event)"
                                ><span :class="inputValues.isBlocked ? 'body_S c-red' : 'body_S'"
                                    >Блокировка</span
                                ></BaseSwitcherLabel
                            >
                        </div>
                    </template>
                    <div class="grid-container">
                        <BaseInput
                            class="grid-row grid-col-6 mr-24 mb-24 mt-24"
                            placeholder="Полное наименование"
                            :isRequired="true"
                            maxlen="249"
                            @update:modelValue="(text) => changeInputValue(text, 'fullName')"
                        />
                        <BaseInput
                            class="grid-row grid-col-6 mb-24 mt-24"
                            placeholder="Краткое наименование"
                            :isRequired="true"
                            maxlen="249"
                            @update:modelValue="(text) => changeInputValue(text, 'shortName')"
                        />
                        <BaseInput
                            class="grid-row grid-col-4 mr-24 mb-24"
                            placeholder="ИНН"
                            :isRequired="true"
                            @update:modelValue="(text) => changeInputValue(text, 'itn')"
                            @blur="validate('itn')"
                            :errorText="error.itn"
                            
                        />
                        <BaseInput
                            class="grid-row grid-col-4 mr-24 mb-24"
                            placeholder="ОКПО"
                            :isRequired="true"
                            @update:modelValue="(text) => changeInputValue(text, 'okpo')"
                            @blur="validate('okpo')"
                            :errorText="error.okpo"
                            
                        />
                        <BaseInput
                            class="grid-row grid-col-4 mb-24"
                            placeholder="КПП"
                            @update:modelValue="(text) => changeInputValue(text, 'iec')"
                            @blur="validate('iec')"
                            :errorText="error.iec"
                            
                        />
                        <BaseInputPhone
                            class="grid-row grid-col-12 mb-24"
                            :disabled="true"
                            :error="error.phoneNumber"
                            @blur="validate('phoneNumber')"
                            v-model="inputValues.phoneNumber"
                        />

                        <BaseInput
                            class="grid-row grid-col-4 mr-24 mb-24"
                            placeholder="Фамилия руководителя"
                            :isRequired="true"
                            @update:modelValue="(text) => changeInputValue(text, 'headLastName')"
                            @blur="validate('headLastName')"
                            maxlen="50"
                            :errorText="error.headLastName"
                            
                        />
                        <BaseInput
                            class="grid-row grid-col-4 mr-24 mb-24"
                            placeholder="Имя руководителя"
                            :isRequired="true"
                            @update:modelValue="(text) => changeInputValue(text, 'headFirstName')"
                            @blur="validate('headFirstName')"
                            maxlen="50"
                            :errorText="error.headFirstName"
                            
                        />
                        <BaseInput
                            class="grid-row grid-col-4 mb-24"
                            placeholder="Отчество руководителя"
                            @update:modelValue="(text) => changeInputValue(text, 'headMiddleName')"
                            @blur="validate('headMiddleName')"
                            maxlen="50"
                            :errorText="error.headMiddleName"
                            
                        />
                        <BaseInput
                            class="grid-row grid-col-4 mr-24"
                            placeholder="Фамилия бухгалтера"
                            :isRequired="true"
                            @update:modelValue="(text) => changeInputValue(text, 'mainAccountantLastName')"
                            @blur="validate('mainAccountantLastName')"
                            maxlen="50"
                            :errorText="error.mainAccountantLastName"
                            
                        />
                        <BaseInput
                            class="grid-row grid-col-4 mr-24"
                            placeholder="Имя бухгалтера"
                            :isRequired="true"
                            @update:modelValue="(text) => changeInputValue(text, 'mainAccountantFirstName')"
                            @blur="validate('mainAccountantFirstName')"
                            maxlen="50"
                            :errorText="error.mainAccountantFirstName"
                            
                        />
                        <BaseInput
                            class="grid-row grid-col-4"
                            placeholder="Отчество бухгалтера"
                            @update:modelValue="(text) => changeInputValue(text, 'mainAccountantMiddleName')"
                            @blur="validate('mainAccountantMiddleName')"
                            maxlen="50"
                            :errorText="error.mainAccountantMiddleName"
                            
                        />
                    </div>
                </BaseWrapperGrayBorder>
                <BaseWrapperGrayBorder
                    class="block"
                    className="ui-contragent__content"
                >
                    <template #header>
                        <h4 class="Heading_4">Юридический адрес</h4>
                    </template>
                    <div class="grid-container">
                        <BaseInput
                            class="grid-row grid-col-6 mr-24 mb-24 mt-24"
                            placeholder="Индекс"
                            :isRequired="true"
                            maxlen="20"
                            @update:modelValue="(text) => changeInputValue(text, 'postIndex')"
                        />
                        <div class="grid-row grid-col-6 mb-24 mt-24">
                            <base-select
                                type="big"
                                label="Город"
                                with-dropdown
                                :value="
                                    selectState.activeItems.length
                                        ? selectState.activeItems.map((el) => el.nameRus).join(', ')
                                        : ''
                                "
                                v-model="selectState.isActive"
                                :isRequired="true"
                            >
                                <base-dropdown-with-api
                                    v-if="selectState.isActive"
                                    position-y="bottom"
                                    v-model:active-items="selectState.activeItems"
                                    v-model:is-active="selectState.isActive"
                                    placeholder="Город"
                                    search-type="directions"
                                    not-data-title="Города вылета не найдены"
                                    multiple-selection
                                    only-cyrillic
                                    :line-count="10"
                                ></base-dropdown-with-api>
                            </base-select>
                        </div>
                        <BaseInput
                            class="grid-row grid-col-3 mr-24"
                            placeholder="Улица"
                            :isRequired="true"
                            maxlen="45"
                            @update:modelValue="(text) => changeInputValue(text, 'street')"
                        />
                        <BaseInput
                            class="grid-row grid-col-3 mr-24"
                            placeholder="Дом"
                            :isRequired="true"
                            maxlen="5"
                            @keydown="validateKeyDown($event, 'house')"
                            @update:modelValue="(text) => changeInputValue(text, 'house')"
                        />
                        <BaseInput
                            class="grid-row grid-col-3 mr-24"
                            placeholder="Корпус"
                            maxlen="15"
                            @keydown="validateKeyDown($event, 'building')"
                            @update:modelValue="(text) => changeInputValue(text, 'building')"
                        />
                        <BaseInput
                            class="grid-row grid-col-3"
                            placeholder="Квартира"
                            maxlen="15"
                            @keydown="validateKeyDown($event, 'building')"
                            @update:modelValue="(text) => changeInputValue(text, 'flat')"
                        />
                    </div>
                </BaseWrapperGrayBorder>
            </template>
        </base-wrapper-component>
    </div>
</template>
<script setup>
import IconSprite from '@/components/interface/IconSprite.vue'
import BaseWrapperGrayBorder from '@ui/wrapper/BaseWrapperGrayBorder.vue'
import BaseWrapperComponent from '@ui/wrapper/BaseWrapperComponent.vue'
import BaseInput from '@ui/inputs/BaseInput.vue'
import { computed, reactive, watch } from 'vue'
import { useUserStore } from '@/store/user'
import BaseSwitcherLabel from '@ui/switcher/BaseSwitcherLabel.vue'
import BaseSelect from '@ui/select/BaseSelect.vue'
import BaseDropdownWithApi from '@ui/select/BaseDropdownWithApi.vue'
import router from '@/router'
import BaseInputPhone from '@ui/inputs/BaseInputPhone.vue'
const userStore = useUserStore()

const inputValues = reactive({
    fullName: '',
    shortName: '',
    itn: '',
    iec: '',
    okpo: '',
    phoneNumber: '',
    headFirstName: '',
    headLastName: '',
    headMiddleName: '',
    mainAccountantFirstName: '',
    mainAccountantLastName: '',
    mainAccountantMiddleName: '',
    isActive: true,
    isBlocked: false,
    address: {
        directionId: 0,
        postIndex: '',
        street: '',
        house: '',
        building: 0,
        flat: 0,
    },
})
const selectState = reactive({ isActive: false, activeItems: [] })
const error = reactive({
    itn: null,
    iec: null,
    okpo: null,
    phoneNumber: null,
    headFirstName: null,
    headLastName: null,
    headMiddleName: null,
    mainAccountantFirstName: null,
    mainAccountantLastName: null,
    mainAccountantMiddleName: null,
})

const backToContragentsList = async () => {
    await userStore.uploadCounterpartiesGetInfo(true)
    await userStore.uploadCounterpartiesGetInfo(false)
    await userStore.uploadCounterpartiesGetInfo()
    router.push('/settings')
}

const changeCheckboxActive = (event) => {
    inputValues.isActive = event
}
const changeCheckboxBlock = (event) => {
    inputValues.isBlocked = event
}
const changeInputValue = (text, fieldName) => {
    const arrayOfKeys = []
    Object.keys(inputValues.address).forEach((key) => {
        arrayOfKeys.push(key)
    })
    if (arrayOfKeys.includes(fieldName)) {
        inputValues.address[fieldName] = text
    } else {
        inputValues[fieldName] = text
    }
}

/* Валидация:
        validateKeyDown - используется для ограничения при попытке ввода спец символов
        validate - основная валидация
*/
const validateKeyDown = (event, fieldName) => {
    let regex = null
    switch (fieldName) {
        case 'house':
            regex = /^[^-!"@#№;.,:?*()_+$%^&*+><~/`]*$/
            break
        case 'building':
            regex = /^[^!"@#№;.,:?*()_+$%^&*+><~/`]*$/
    }
    if (!regex.test(event.key)) {
        event.preventDefault()
    }
}
const validate = (fieldName) => {
    const nameRegex = /^[А-Яа-яЁё]+([- ]?[А-Яа-яЁё0-9]+){0,2}$/
    switch (fieldName) {
        case 'itn':
            if (inputValues.itn.length == 10 || inputValues.itn.length == 12) {
                error.itn = null
            } else {
                error.itn = 'ИНН должен состоять из 10 или 12 цифр'
            }
            break
        case 'iec':
            if (inputValues.iec.length == 9) {
                error.iec = null
            } else {
                error.iec = 'КПП должен состоять из 9 цифр'
            }
            break
        case 'okpo':
            if (inputValues.okpo.length == 8 || inputValues.okpo.length == 10) {
                error.okpo = null
            } else {
                error.okpo = 'ОКПО должен состоять из 8 или 10 цифр'
            }
            break
        case 'phoneNumber':
            if (inputValues.phoneNumber.replace(/^\+7/, '').length == 10) {
                error.phoneNumber = null
            } else {
                error.phoneNumber = 'Номер телефона должен состоять из 10 цифр'
            }
            break
        case 'headLastName':
            validateName(
                'headLastName',
                'Фамилия руководителя должна содержать больше одной буквы кириллицы, не более двух дефисов или пробела',
            )
            break
        case 'headFirstName':
            validateName(
                'headFirstName',
                'Имя руководителя должно содержать больше одной буквы кириллицы, не более двух дефисов или пробела',
            )
            break
        case 'headMiddleName':
            validateName(
                'headMiddleName',
                'Отчество руководителя должно содержать больше одной буквы кириллицы, не более двух дефисов или пробела',
            )
            break
        case 'mainAccountantFirstName':
            validateName(
                'mainAccountantFirstName',
                'Имя бухгалтера должно содержать больше одной буквы кириллицы, не более двух дефисов или пробела',
            )
            break
        case 'mainAccountantLastName':
            validateName(
                'mainAccountantLastName',
                'Фамилия бухгалтера должна содержать больше одной буквы кириллицы, не более двух дефисов или пробела',
            )
            break
        case 'mainAccountantMiddleName':
            validateName(
                'mainAccountantMiddleName',
                'Отчество бухгалтера должно содержать больше одной буквы кириллицы, не более двух дефисов или пробела',
            )
    }
    function validateName(fieldName, errorText) {
        if (nameRegex.test(inputValues[fieldName]) && inputValues[fieldName].length > 1) {
            error[fieldName] = null
        } else {
            error[fieldName] = errorText
        }
    }
}

const isButtonActive = computed(() => {
    if (
        inputValues.fullName &&
        inputValues.shortName &&
        inputValues.itn &&
        inputValues.okpo &&
        inputValues.phoneNumber &&
        inputValues.headFirstName &&
        inputValues.headLastName &&
        inputValues.mainAccountantFirstName &&
        inputValues.mainAccountantLastName &&
        inputValues.address.postIndex &&
        inputValues.address.directionId &&
        inputValues.address.street &&
        inputValues.address.house &&
        isValidate.value
    ) {
        return true
    } else {
        return false
    }
})
const isPageShow = computed(() => {
    return userStore.user?.permissions?.some((el) => el === 'Management:counterparties.read')
})
const isValidate = computed(() => {
    const notRequiredFields = ['headMiddleName', 'mainAccountantMiddleName', 'iec']
    let requiredFieldsError = { ...error }
    for (let key in requiredFieldsError) {
        if (notRequiredFields.includes(key)) {
            delete requiredFieldsError[key]
        }
    }
    return !Object.values(requiredFieldsError).some((value) => value != null)
})

const handleSubmit = async () => {
    removeEmptyFields(inputValues)
    removeEmptyFields(inputValues.address)

    if (!isValidate.value) {
        return
    }
    console.log(inputValues)
    const uploadCounterparties = await userStore.uploadCounterparties(inputValues)
    if (uploadCounterparties) {
        await userStore.uploadСounterpartyWithID()
    }

    function removeEmptyFields(obj) {
        for (const key in obj) {
            if (obj[key] === '' || obj[key] === null || obj[key] === undefined || obj[key] === 0) {
                delete obj[key]
            }
        }
    }
}
watch(selectState, (newValue) => {
    inputValues.address.directionId = newValue.activeItems[0]?.id
})
</script>
<style lang="scss">
.block {
    width: 100%;
    max-width: 100%;
}
.button__icon {
    width: 16px;
    height: 16px;
}
.grid-container {
    padding: 0;
    gap: 0;
}
.grid-row {
    min-height: 56px;
    background-color: transparent;
    justify-content: unset;
    border-radius: 8px;
    align-items: flex-start;
}
.button {
    width: 100%;
}
.input__phone-code {
    max-width: 152px;
}
</style>
