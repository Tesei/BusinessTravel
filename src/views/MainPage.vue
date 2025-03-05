<template>
    <the-header />
    <RouterView class="f-auto"/>
    <the-footer />
    <toster-notification/>
</template>

<script setup>
import { RouterView } from 'vue-router'
import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'
import TosterNotification from '@/components/popup/TosterNotification.vue'
</script>
