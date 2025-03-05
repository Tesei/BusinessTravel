<template>
    <div class="incorrect-profile">
        <img
            src="@/assets/images/error.png"
            alt="Error Illustration"
        />

        <h1 class="Heading_2 incorrect-profile__title">Ой...</h1>

        <div class="body_S incorrect-profile__text">
            <div class="incorrect-profile__text">
                Здесь могло быть много интересной и полезной информации, но ваш профиль настроен некорректно.
            </div>

            <div v-if="admins.length > 0">
                <p
                    v-if="admins.length === 1"
                    class="incorrect-profile__text"
                >
                    Для изменения этой ситуации рекомендуем обратиться к администратору вашей компании:
                </p>
                <p
                    v-if="admins.length > 1"
                    class="incorrect-profile__text"
                >
                    Для изменения этой ситуации рекомендуем обратиться к администраторам вашей компании:
                </p>
                <ul class="incorrect-profile__admins">
                    <li
                        v-for="admin in admins"
                        :key="admin.emails"
                        class="incorrect-profile__admin"
                    >
                        <strong class="font-button M">{{ formatAdmin(admin) }}</strong
                        >&nbsp;
                        <a :href="`mailto:${admin.emails}`">{{ admin.emails }}</a>
                    </li>
                </ul>
            </div>

            <div
                v-else
                class="incorrect-profile__text"
            >
                Для изменения этой ситуации рекомендуем обратиться к администратору вашей компании.
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/store/user'

const user = useUserStore()

const admins = computed(() => user.user?.counterparty?.admins || [])

const formatAdmin = ({ lastName, firstName, middleName }) => {
    return [lastName, firstName, middleName].filter(Boolean).join(' ')
}
</script>

<style scoped lang="scss">
a {
    color: $color-cornflower;
}

.incorrect-profile {
    text-align: center;
    padding: 40px;
    max-width: 1440px;
}

.incorrect-profile__title {
    padding-top: 40px;
}

.incorrect-profile__text {
    display: inline-block;
    max-width: 670px;
    max-height: 103px;
    padding: 18px 20px 0 20px;
}
</style>
