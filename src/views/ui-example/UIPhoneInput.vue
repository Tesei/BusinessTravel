<template>
    <base-input-phone
        :classNames="'mt-32 mb-32'"
        v-model="phone"
        :error="phoneError"
        :disabled="true"
    />
    <h3>Телефон: {{ phone }}</h3>
</template>

<script setup>
import BaseInputPhone from '@ui/inputs/BaseInputPhone.vue'
import { computed } from 'vue'
import { ref } from 'vue'

const phone = ref('')
const phoneError = computed(() => {
    if (!phone.value || phone.value.length === 12 || ['+7', '+375'].includes(phone.value) || phone.value.length === 14) return ''
    else return 'Некорректный номер телефона'
})
</script>

<style lang="scss" scoped></style>
