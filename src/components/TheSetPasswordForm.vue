<template>
    <BaseWrapperGrayBorder class="wrapper mt-80">
        <template #header>
            <h2 class="Heading_3 mb-24">Создание пароля</h2>
        </template>

        <div class="set-password-popup flex flex-d-c">
            <p
                class="footnote_L flex ai-c mb-16"
                v-for="elem in validationRules"
                :key="elem.text"
            >
                <IconSprite
                    name="common--checkmark"
                    className="c-green icon__svg"
                    v-if="elem.isValidated === true"
                />
                <IconSprite
                    name="common--close"
                    className="c-red icon__svg"
                    v-else-if="elem.isValidated === false"
                />
                <IconSprite
                    name="common--bullet"
                    className="c-black icon__svg"
                    v-else
                />
                <span class="width-ft">{{ elem.text }}</span>
            </p>
            <p class="footnote_L flex ai-c mb-8">В пароле должны присутствовать следующие символы:</p>
            <p
                class="footnote_L flex ai-c set-password-symbols"
                v-for="elem in validationSymbols"
                :key="elem.text"
            >
                <IconSprite
                    name="common--checkmark"
                    className="c-green icon__svg"
                    v-if="elem.isValidated === true"
                />
                <IconSprite
                    name="common--close"
                    className="c-red icon__svg"
                    v-else-if="elem.isValidated === false"
                />
                <IconSprite
                    name="common--bullet"
                    className="c-black icon__svg"
                    v-else
                />
                <span class="width-ft">{{ elem.text }}</span>
            </p>
            <form>
                <BaseInputPassword
                    class="mb-24"
                    placeholder="Новый пароль"
                    :isRequired="true"
                    @update:modelValue="(text) => changePassword(text)"
                />
                <BaseInputPassword
                    class="mb-24"
                    placeholder="Повторите пароль"
                    :isRequired="true"
                    @update:modelValue="(text) => changePasswordApprove(text)"
                />
                <BaseNotificationBox
                    v-if="isErrorShow"
                    :style="{ width: '100%' }"
                    class="alert"
                    :notification="{
                        message: error,
                        alwaysVisible: true,
                        picture: true,
                        dinamicClass: 'bg-red-2',
                    }"
                >
                    <IconSprite
                        name="common--info"
                        className="icon__svg"
                    />
                </BaseNotificationBox>
                <div class="flex flex-d-r">
                    <base-checkbox
                        class="mb-16 mr-8 ai-c"
                        v-model="checkboxPrivacy.personal"
                        :disabled="false"
                    />
                    <label class="body_S"
                        >Соглашаюсь
                        <a
                            class="c-cornflower pointer"
                            @click="handleOpenPrivacy('/obt-soglasie-na-obrabotku-person-data')"
                        >
                            с политикой обработки персональных данных</a
                        ></label
                    >
                </div>
                <div class="flex flex-d-r">
                    <base-checkbox
                        class="mb-24 mr-8 ai-c"
                        v-model="checkboxPrivacy.email"
                        :disabled="false"
                    />
                    <label class="body_S"
                        >Соглашаюсь получать <a class="c-cornflower pointer">email-уведомлений про командировку</a></label
                    >
                </div>
                <BaseButton
                    v-if="!isSubmit"
                    :disabled="!isButtonActive"
                    :class="isButtonActive ? 'button_blue' : 'bg-gray-4 alert-button_disabled'"
                    @click="sendResetForm($event)"
                    classNames="font-button_M button flex jc-c alert-button"
                    >Создать пароль</BaseButton
                >
                <BaseButton
                    v-else
                    classNames="font-button_M button restore-password__button button_blue alert-button jc-c"
                    :toShowLoading="true"
                />
            </form>
        </div>
    </BaseWrapperGrayBorder>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

import BaseWrapperGrayBorder from '@ui/wrapper/BaseWrapperGrayBorder.vue'
import IconSprite from '@/components/interface/IconSprite.vue'
import BaseInputPassword from '@ui/inputs/BaseInputPassword.vue'
import BaseButton from '@ui/buttons/BaseButton.vue'
import BaseNotificationBox from '@ui/alert/depricatedBaseNotificationBox.vue'
import BaseCheckbox from '@ui/BaseCheckbox.vue'
import { useUserStore } from '@/store/user'
import router from '@/router'
const userStore = useUserStore()

const validationRules = ref({
    minLength: {
        text: 'Минимальная длина пароля - 12 символов',
        isValidated: null,
    },
    notAllowed: {
        text: 'Недопустимо использовать в качестве пароля либо его части повторяющиеся символы и расположенные рядом в алфавите или на клавиатуре (1111, йцук1234, qwer1234, Aq1Sw2De3 и т.п.)',
        isValidated: null,
    },
})

const validationSymbols = ref({
    upperCaseLetters: {
        text: 'Буквы в верхнем регистре',
        isValidated: null,
    },
    lowerCaseLetters: {
        text: 'Буквы в нижнем регистре',
        isValidated: null,
    },
    numbers: {
        text: 'Цифры',
        isValidated: null,
    },
    specialSymbols: {
        text: 'Специальные символы ~! # $ %^& *\'( ) _ + =<> \' ?',
        isValidated: null,
    },
})
const checkboxPrivacy = ref({
    personal: false,
    email: false,
})

const password = ref('')
const passwordApprove = ref('')

const error = ref('')

const isSubmit = ref(false)
const validationRulesValue = validationRules.value
const validationSymbolsVal = validationSymbols.value

const isErrorShow = ref(false)
const changePassword = (text) => {
    password.value = text.trim()
    validateAll()
    isErrorShow.value = false
}

const changePasswordApprove = (text) => {
    passwordApprove.value = text.trim()
    validateAll()
    isErrorShow.value = false
}

const handleOpenPrivacy = (url) => {
    const fullUrl = router.resolve({ path: url }).href
    window.open(fullUrl, '_blank')
}
const isButtonActive = computed(() => {
    return !!(password.value && passwordApprove.value && checkboxPrivacy.value.personal && checkboxPrivacy.value.email)
})

// валидация повторяющихся и расположенныx рядом в алфавите или на клавиатуре символов
const isValidPasswordKeyboardSameCharacter = (password) => {
    function hasValidLength(password) {
        return password.length >= 8
    }

    function hasRepeatingCharacters(password) {
        const regex = /(.)\1{2,}/ // три и более одинаковых символа подряд
        return !regex.test(password)
    }

    function hasSequentialCharacters(password) {
        const keyboard = 'qwertyuiopasdfghjklzxcvbnmйцукенгшщзфывапролджэячсмитьбю'
        for (let i = 0; i < keyboard.length - 2; i++) {
            const seq = keyboard.substring(i, i + 3)
            if (password.includes(seq)) {
                return false // есть последовательные символы
            }
        }
        return true
    }

    function hasRequiredCharacters(password) {
        const hasLetter = /[a-zA-Zа-яёА-ЯЁ]/.test(password)
        const hasNumber = /\d/.test(password)
        const hasSpecial = /[^\w\s-]/.test(password)
        // const hasSpecial = /[!@#$%^&*()_+~`={}\[\]:;"'<>,.?/]/.test(password)
        return hasLetter && hasNumber && hasSpecial
    }

    return (
        hasValidLength(password) &&
        hasRepeatingCharacters(password) &&
        hasSequentialCharacters(password) &&
        hasRequiredCharacters(password)
    )
}

const validateAll = () => {
    let isValidated = true

    // количество символов
    if (password.value.length < 12) {
        isValidated = false
        error.value = 'Условия для создания пароля не выполнены'
        validationRulesValue.minLength.isValidated = null
    } else {
        validationRulesValue.minLength.isValidated = true

        // Валидация на одинаковые символы

        if (!isValidPasswordKeyboardSameCharacter(password.value)) {
            isValidated = false
            error.value = 'Условия для создания пароля не выполнены'
            validationRulesValue.notAllowed.isValidated = null
        } else {
            validationRulesValue.notAllowed.isValidated = true
        }
    }

    // спец символы
    const specialSymbols = /[~!#$%^&*()_+=<>'?]/
    if (!specialSymbols.test(password.value)) {
        isValidated = false
        error.value = 'Условия для создания пароля не выполнены'
        validationSymbolsVal.specialSymbols.isValidated = null
    } else {
        validationSymbolsVal.specialSymbols.isValidated = true
    }

    // наличие букв нижнего регистра
    let lowCaseValidation = /[a-zа-яё]/
    if (!lowCaseValidation.test(password.value)) {
        isValidated = false
        error.value = 'Условия для создания пароля не выполнены'
        validationSymbolsVal.lowerCaseLetters.isValidated = null
    } else {
        validationSymbolsVal.lowerCaseLetters.isValidated = true
    }

    // наличие букв верхнего регистра
    let upperCaseValidation = /[A-ZА-ЯЁ]/
    if (!upperCaseValidation.test(password.value)) {
        isValidated = false
        error.value = 'Условия для создания пароля не выполнены'
        validationSymbolsVal.upperCaseLetters.isValidated = null
    } else {
        validationSymbolsVal.upperCaseLetters.isValidated = true
    }

    // наличие цифр
    let digitValidation = /(?=.*\d)/
    if (!digitValidation.test(password.value)) {
        isValidated = false
        error.value = 'Условия для создания пароля не выполнены'
        validationSymbolsVal.numbers.isValidated = null
    } else {
        validationSymbolsVal.numbers.isValidated = true
    }

    // Валидация по совпадению
    if (password.value != passwordApprove.value) {
        isValidated = false
        error.value = 'Пароли не совпадают'
    }

    if (!password.value) {
        validationRulesValue.notAllowed.isValidated = null
        validationSymbolsVal.numbers.isValidated = null
        validationSymbolsVal.lowerCaseLetters.isValidated = null
        validationSymbolsVal.specialSymbols.isValidated = null
        validationRulesValue.minLength.isValidated = null
    }

    if (isValidated) {
        error.value = ''
    }
}
const sendResetForm = async (e) => {
    isSubmit.value = true
    isErrorShow.value = true
    e.preventDefault()

    // true - правило соблюдено (зеленая отметка рядом с правилом создания пароля на странице)
    // false - правило  НЕ соблюдено (красный крестик рядом с правилом создания пароля на странице)

    validationRulesValue.notAllowed.isValidated = !!validationRulesValue.notAllowed.isValidated

    validationSymbolsVal.numbers.isValidated = !!validationSymbolsVal.numbers.isValidated
    validationSymbolsVal.lowerCaseLetters.isValidated = !!validationSymbolsVal.lowerCaseLetters.isValidated
    validationSymbolsVal.upperCaseLetters.isValidated = !!validationSymbolsVal.upperCaseLetters.isValidated
    validationSymbolsVal.specialSymbols.isValidated = !!validationSymbolsVal.specialSymbols.isValidated
    validationRulesValue.minLength.isValidated = !!validationRulesValue.minLength.isValidated

    if (!error.value) {
        const data = await userStore.changePassword(password.value)
        if (!data) {
            isSubmit.value = false
        } else {
            router.push('/auth')
        }
    }
    isSubmit.value = false
}

watch(password, (newValue, oldValue) => {
    if (newValue !== oldValue) {
        isSubmit.value = false
    }
})
watch(passwordApprove, (newValue, oldValue) => {
    if (newValue !== oldValue) {
        isSubmit.value = false
    }
})
</script>

<style scoped lang="scss">
.wrapper {
    max-width: 570px;
    margin: 80px auto 0 auto;
}
// .width-ft
.width-ft {
    width: fit-content;
}

// .set-password
.set-password {
    // .set-password-popup
    &-popup {
        // .icon__svg
        .icon__svg {
            margin-right: 4px;
        }
    }
    // .set-password-symbols
    &-symbols {
        margin-bottom: 8px;
        // &:last-of-type
        &:last-of-type {
            margin-bottom: 24px;
            max-width: 187px;
        }
    }
}

// .icon__svg
.icon__svg {
    width: 24px;
    height: 24px;
}

// .alert
.alert {
    min-height: 56px;
    margin-bottom: 24px;
    // .alert-box
    &-box {
        position: absolute;
        bottom: 0;
        right: 0;
    }
    // .alert-button
    &-button {
        width: 100%;
        // &_disabled
        &_disabled {
            color: $text-disabled;
        }
    }
}
</style>
