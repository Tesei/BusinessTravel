<template>
    <div>
        <BaseWrapperGrayBorder
            class="auth"
            className="ui-login__content"
        >
            <template #header>
                <h3 class="Heading_3 block mb-24 auth__title">Авторизация</h3>
            </template>

            <form
                @submit.prevent="toSend"
                class="auth__inputs-block"
            >
                <BaseInput
                    class="body_S mb-24 auth__input-login"
                    :placeholder="'Логин'"
                    v-model.trim="passData.login"
                    isRequired
                />
                <BaseInputPassword
                    class="body_S mb-24 auth__input-password"
                    v-model.trim="passData.password"
                    isRequired
                />

                <a
                    href="/restore-password"
                    class="body_S mb-24 c-gray auth__forgot-password"
                    >Забыли пароль?
                </a>
                <BaseButton
                    class="jc-c auth__btn"
                    :disabled="!isReadyToSend"
                    :toShowLoading="showLoader"
                    classNames="font-button_M button button_blue"
                    :iconName="'common--delete'"
                >
                    Войти
                </BaseButton>
            </form>
        </BaseWrapperGrayBorder>
    </div>
</template>

<script setup>
import { ref, computed, reactive} from 'vue'
import { useUserStore } from '@/store/user'
import BaseButton from '@ui/buttons/BaseButton.vue'
import BaseInput from '@ui/inputs/BaseInput.vue'
import BaseInputPassword from '@ui/inputs/BaseInputPassword.vue'
import BaseWrapperGrayBorder from '@ui/wrapper/BaseWrapperGrayBorder.vue'
import { useRouter } from 'vue-router'
const userStore = useUserStore()
const router = useRouter()


// Данные реального пользователя указаныпо умолчанию временно
const passData = reactive({
    login: import.meta.env.VITE_INPUT_LOGIN,
    password: import.meta.env.VITE_INPUT_PASSWORD,
})
const isReadyToSend = computed(() => !!passData.login && !!passData.password)
const showLoader = ref(false)

const toSend = async () => {
    showLoader.value = true
    try {
        const response = await userStore.fetchLogIn(passData)
        if (response?.accessToken) {
            const profile = await userStore.uploadProfile()
            if (profile?.permissions?.length > 0)
                router.push({ name: 'WelcomePage' })
            else router.push('/incorrect-profile')
        }
    } catch (error) {
        console.error('Ошибка в toSend, ', error.message)
    }
    showLoader.value = false
}
</script>

<style lang="scss" scoped>
.auth {
    // auth__title
    &__title {
    }

    // .auth__inputs-block
    &__inputs-block {
    }

    // .auth__input-login
    &__input-login {
    }

    // .auth__input-password
    &__input-password {
    }

    // auth__forgot-password
    &__forgot-password {
        display: inline-block;
    }

    // .auth__btn
    &__btn {
        width: 100%;
    }
}
</style>
