<template>
    <p>Множественный выбор в виде массива объектов</p>
    <p>{{ selectedPeople }}</p>

    <template
        v-for="person in people"
        :key="person.name"
    >
        <BaseCheckbox
            :label="person.name"
            v-model="selectedPeople"
            :value="person"
            :disabled="person.disabled"
            :indeterminate="person.indeterminate"
        />
    </template>
    <br />
    <p>Единственный выбор</p>
    <div>
        <BaseCheckbox
            :label="`Значение: ${isSelected}`"
            v-model="isSelected"
            :disabled="false"
        />
    </div>
</template>

<script setup>
import BaseCheckbox from '@ui/BaseCheckbox.vue'
import { ref } from 'vue'

const people = ref([
    {
        name: 'Михаил',
        age: 20,
        sex: 'Male',
        disabled: true,
    },
    {
        name: 'Василий',
        age: 30,
        sex: 'Male',
        disabled: true,
    },
    {
        name: 'Антон',
        age: 24,
        sex: 'Male',
    },
    {
        name: '',
        age: 20,
        sex: 'Female',
        disabled: false,
        indeterminate: true,
    },
])

const selectedPeople = ref([
    {
        name: 'Михаил',
        age: 20,
        sex: 'Male',
        disabled: true,
    },
])
const isSelected = ref(false)
</script>

<style lang="scss" scoped></style>
