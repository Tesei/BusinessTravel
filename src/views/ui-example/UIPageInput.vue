<template>
    <div>
        <BaseInput
            placeholder="Фамилия"
            :isRequired="true"
        />
    </div>
    <br />
    <div>
        <BaseInput
            placeholder="Имя"
            :isRequired="true"
        />
    </div>
    <br />
    <div>
        <BaseInput
            placeholder="Логин"
            v-model="login"
            :isRequired="true"
        />
    </div>
    <br />
    <div>
        <BaseInputPassword
            placeholder="Пароль"
            v-model="password"
            :isRequired="true"
        />
    </div>
    <br />
    <div>
        <BaseInputPassword
            placeholder="Новый пароль"
            :isRequired="true"
        />
    </div>
    <br />
    <div>
        <BaseInputPassword
            placeholder="Повторите пароль"
            :isRequired="true"
        />
    </div>
    <br />
    <div>
        <BaseInputDate
            v-model="departureDate"
            placeholder="Дата вылета"
            :isRequired="true"
        />
    </div>
    <br />
    <div>
        <BaseInputDate
            v-model="arrivalDate"
            placeholder="Дата прилета"
            :isRequired="true"
        />
    </div>
    <div>
        <BaseInputFloatNumber
            placeholder="Суточные, ₽/день"
            :isRequired="true"
            v-model:string-value="string"
            v-model:number-value="number"
        />
        <div>{{ string }}</div>
        <div>{{ number }}</div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseInput from '@ui/inputs/BaseInput.vue'
import BaseInputDate from '@ui/inputs/BaseInputDate.vue'
import BaseInputPassword from '@ui/inputs/BaseInputPassword.vue'
import BaseInputFloatNumber from '@/components/ui/inputs/BaseInputFloatNumber.vue'

const login = ref('')
const password = ref('')
const departureDate = ref('')
const arrivalDate = ref('')

const string = ref('')
const number = ref()
</script>

<style></style>
