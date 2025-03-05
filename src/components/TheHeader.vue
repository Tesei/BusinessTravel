<template>
    <header class="header flex jc-sb">
        <nav class="header__left flex ai-c">
            <base-link to="/auth">
                <img
                    class="header__logo pointer"
                    src="@/assets/icons/logo.svg"
                />
            </base-link>
            
            <base-link
                v-if="user.isLoggedIn && isTripAccess"
                to="/trips"
                class="footnote_L header__navigation_item c-black"
                :class="{ active: currentRouteName === 'trips' }"
            >
                Командировки
            </base-link>
        </nav>
        <div
            class="header__right flex"
            v-if="user.isLoggedIn"
        >
            <div class="header__info flex ai-c">
                <span
                    v-if="userName"
                    class="footnote_L"
                    >{{ userName }}</span
                >
                <span v-if="userName">&bull;</span>
                <span
                    v-if="user.user?.counterparty?.shortName"
                    class="footnote_L"
                    >{{ user.user.counterparty.shortName }}</span
                >
            </div>
            <div
                v-if="user.isLoggedIn"
                class="header__settings flex"
            >
                <div
                    class="header__svg_wrapper"
                    @click.stop="handleToggleModal"
                >
                    <IconSprite
                        name="common--settings"
                        className="icon__svg header__svg"
                    />
                </div>
                <Dropdown
                    class="header__dropdown"
                    v-if="isShowDropdown && availableOptions.length"
                    :options="availableOptions"
                    theme="header-dropdown"
                    id="settings"
                />
            </div>

            <IconSprite
                v-if="user.isLoggedIn"
                @click="handleExit()"
                name="common--exit"
                className="icon__svg header__svg"
            />
        </div>
        <div
            class="header__right flex"
            v-if="!user.isLoggedIn && isLoginButtonShow"
        >
            <BaseButton
                @click="handleLogin()"
                classNames="font-button_S button button_blue header__button"
                >Войти</BaseButton
            >
        </div>
    </header>
</template>

<script setup>
import IconSprite from '@/components/interface/IconSprite.vue'
import BaseLink from '@ui/BaseLink.vue'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/store/user'
import Dropdown from '@/components/interface/Dropdown.vue'
import BaseButton from '@ui/buttons/BaseButton.vue'
import router from '@/router'
import { useAvailableOptions } from '@/composables/useAvailableOptions'
const { availableOptions } = useAvailableOptions()

const user = useUserStore()
const props = defineProps({
    isCorrectProfile: {
        type: Boolean,
        default: true,
    },
})
const emit = defineEmits(['exitFromAccount'])

let isShowDropdown = ref(false)

const handleExit = async () => {
    await user.logout()
    router.push('/auth')
}
const handleLogin = () => {
    router.push('/auth')
}

const currentRouteName = computed(() => {
    return router.currentRoute.value.name
})

const isLoginButtonShow = computed(() => {
    switch (router.currentRoute.value.name) {
        case 'AuthPage':
            return false
        case 'restore-password':
            return false
        case 'create-password':
            return false
        default:
            return true
    }
})

const userName = computed(() => {
    if (!user.user.firstName || !user.user.lastName) {
        return
    }
    let fullName = (user.user.lastName + ' ' + user.user.firstName + ' ' + user.user.middleName)
        .split(/\s+/)
        .map((w, i) => (i ? w.substring(0, 1).toUpperCase() + '.' : w))
        .join(' ')
    return fullName
})
const isTripAccess = computed(() => {
    if (user?.user?.permissions?.includes('BusinessTravel:trip.read')) {
        return true
    } else {
        return false
    }
})

const handleToggleModal = () => {
    isShowDropdown.value = !isShowDropdown.value
}
onMounted(() => {
    document.addEventListener('click', (e) => {
        if (!e.target.classList.contains('header__svg') || !e.target.classList.length) {
            if (isShowDropdown.value) {
                isShowDropdown.value = false
            }
        }
    })
})
onUnmounted(() => {
    document.removeEventListener('click', (e) => {
        if (!e.target.classList.contains('header__svg') || !e.target.classList.length) {
            if (isShowDropdown.value) {
                isShowDropdown.value = false
            }
        }
    })
})
</script>

<style scoped lang="scss">
.header {
    max-width: 1440px;
    width: 100%;
    padding: 16px 0;
    margin: 0 auto;
    border-bottom: 1px solid $color-gray-3;

    // .header__button
    &__button {
        padding: 8px 20px;
    }

    // .header__settings
    &__settings {
        position: relative;
    }

    // .header__left
    &__left {
        column-gap: 48px;
    }

    // .header__logo
    &__logo {
        max-width: 80px;
        max-height: 38px;
    }

    // .header__navigation
    &__navigation {
        column-gap: 24px;
        position: relative;

        // .header__navigation_item
        &_item {
            &:hover {
                font-weight: 600;
                cursor: pointer;
            }
        }
        &_item.active {
            font-weight: 600;
        }
    }

    // .header__info
    &__info {
        column-gap: 8px;
        margin-right: 24px;
    }

    // .header__svg
    &__svg {
        align-self: center;
        margin: 0;
        z-index: 0;

        // .header__svg_wrapper
        &_wrapper {
            display: flex;
        }

        &:first-child {
            margin-right: 24px;
        }

        &:hover {
            cursor: pointer;
        }
    }
}
</style>
