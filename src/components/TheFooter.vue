<template>
    <div class="flex ai-c jc-sb pt-40 pb-40 footer">
        <div>
            <a
                class="Heading_5 mb-4 pointer c-black block"
                href="tel:8 800 775 775 8"
                >8 800 775 775 8</a
            >
            <span class="footnote_L">© ООО ТТ-Трэвел 2025</span>
        </div>
        <a
            @click="handleOpenPrivacy('/obt-soglasie-na-obrabotku-person-data')"
            class="footer__link footnote_L pointer"
            >Политика обработки персональных данных</a
        >
        <a class="footer__link footnote_L pointer">Политика получение email-уведомлений</a>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleOpenPrivacy = (url) => {
    const fullUrl = router.resolve({ path: url }).href
    window.open(fullUrl, '_blank')
}
</script>
<style scoped lang="scss">
.footer__link {
    text-decoration: underline;
    text-decoration-color: $color-gray;
}
.footer {
    max-width: 1170px;
    width: 100%;
}
</style>
