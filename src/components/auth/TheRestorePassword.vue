<template>
    <div>
        <div class="restore-password flex flex-d-c">
            <h3 class="Heading_3 mb-24">Восстановление пароля</h3>
            <p class="body_M mb-24">Письмо о восстановлении пароля будет отправлено вам на Email</p>
            <TransitionGroup name="fade">
                <BaseNotificationBox
                    v-if="isInputActive"
                    class="restore-password__notification"
                    :notification="{
                        message: `Если не получается вспомнить, обратитесь к администратору организации`,
                        alwaysVisible: true,
                        picture: true,
                        dinamicClass: 'bg-gray-6',
                    }"
                >
                    <IconSprite
                        name="common--info"
                        className="icon__svg restore-password__svg"
                    />
                </BaseNotificationBox>
            </TransitionGroup>
            <BaseInput
                class="restore-password__input mb-24"
                :class="isInputActive ? 'mt-24' : ''"
                placeholder="Логин"
                name="login"
                :isRequired="true"
                @focus="isInputActive = true"
                @blur="isInputActive = false"
                @update:modelValue="handleInput"
            />
            <BaseButton
                v-if="!isSubmit"
                classNames="font-button_M button restore-password__button"
                :class="isDisableButton ? 'gray-4' : 'button_blue'"
                :disabled="isDisableButton"
                @handleClick="handleSubmit"
                >Восстановить пароль</BaseButton
            >
            <BaseButton
                v-else
                classNames="font-button_M button restore-password__button restore-password__button-loading button_blue"
                :toShowLoading="true"
            />
        </div>
    </div>
</template>
<script setup>
import BaseButton from '@ui/buttons/BaseButton.vue'
import BaseNotificationBox from '@ui/alert/depricatedBaseNotificationBox.vue'
import BaseInput from '@ui/inputs/BaseInput.vue'
import IconSprite from '@/components/interface/IconSprite.vue'
import { ref } from 'vue'
import { useUserStore } from '@/store/user'
import { useNotificationStore } from '@/store/notification'
import router from '@/router'

const userStore = useUserStore()
const notificationStore = useNotificationStore()

const isDisableButton = ref(true)

const isSubmit = ref(false)
const isSubmitSuccess = ref(null)
const isInputActive = ref(false)

const inputValue = ref(null)

const handleInput = (value) => {
    inputValue.value = value.trim()
    isDisableButton.value = inputValue.value ? false : true
    isSubmitSuccess.value = null
    notificationStore.removeError(0)
}

const handleSubmit = async () => {
    isDisableButton.value = true
    isSubmit.value = true
    const data = await userStore
        .resetPassword(
            inputValue.value,
            `${window.location.hostname === 'localhost' ? import.meta.env.VITE_AUTH_BTUI_SERVICE : window.location.origin}/create-password`,
        )
        .then((isDisableButton.value = false))
    if (data) {
        router.push({ path: '/auth', redirect: '/auth', query: { isRedirectFromRestore: true } })
        isSubmitSuccess.value = true
    } else {
        isSubmit.value = false
        isSubmitSuccess.value = false
    }
}
</script>
<style lang="scss" scoped>
@use '@/style/animation.scss';
// .restore-password
.restore-password {
    max-width: 570px;
    padding: 24px;
    outline: 1px solid $color-gray-9;
    border-radius: $border-radius-16;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    // .restore-password__button
    &__button {
        justify-content: center;

        // .restore-password__button-loading
        &-loading {
            padding: 12px 32px;
        }
    }

    // .restore-password__notification
    &__notification {
        width: 100%;
        margin-bottom: 0;
    }

    // .restore-password__svg
    &__svg {
        margin: 0;
    }

    // .restore-password__input
    &__input {
        width: 100%;
    }
}
</style>
