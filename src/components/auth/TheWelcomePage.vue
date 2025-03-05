<template>
    <div class="welcome-page">
        <img
            src="@/assets/images/welcome.png"
            alt="Welcome"
            class="welcome-page__image"
        />

        <h1 class="Heading_2 welcome-page__title">Добро пожаловать!</h1>

        <div class="body_S welcome-page__content">
            <p class="welcome-page__description">Мы помогаем достичь результатов в каждой вашей деловой поездке.</p>

            <p class="welcome-page__description">
                Вопросы по процессу оформления командировок отправляйте
                <template v-if="admins.length === 0"> администратору вашей компании. </template>
                <template v-else>
                    <span>
                        <template v-if="admins.length === 1"> администратору вашей компании: </template>
                        <template v-else> администраторам вашей компании: </template>
                    </span>
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
                </template>
            </p>

            <p class="welcome-page__description">
                По другим вопросам пишите нам:
                <a href="mailto:obt-hd@fstravel.ru">obt-hd@fstravel.ru</a>
            </p>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/store/user'

// Получаем пользователя и вычисляем список администраторов
const user = useUserStore()

const admins = computed(() => user.user?.counterparty?.admins || [])

// Функция для форматирования имени администратора
const formatAdmin = ({ lastName, firstName, middleName }) => {
    return [lastName, firstName, middleName].filter(Boolean).join(' ')
}
</script>

<style scoped lang="scss">
a {
    color: $color-cornflower;
}

.welcome-page {
    text-align: center;
    padding: 40px;
    max-width: 1440px;
}

.welcome-page__title {
    margin-top: 40px;
}

.welcome-page__content {
    margin-top: 20px;
    display: inline-block;
    max-width: 670px;
}

.welcome-page__description {
    padding: 18px 20px 0 0;
}
</style>
