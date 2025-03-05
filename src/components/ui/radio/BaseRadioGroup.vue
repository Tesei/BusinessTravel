<template>
    <div class="flex">
        <div
            v-for="option in options"
            :key="option.value"
        >
            <input
                type="radio"
                class="radiobutton__input"
                :class="{ 'radiobutton__input-active': model === option.value }"
                :id="`radiobutton__${option.value}`"
                :value="option.value"
                v-model="model"
            />
            <label
                class="body_S pointer"
                :for="`radiobutton__${option.value}`"
            >
                {{ option.label }}
            </label>
        </div>
    </div>
</template>

<script setup>
// Компонент отображает список радиокнопок.
// Принимает массив объектов лэйблов и значений через props options и model.
// Пример использования:
// <base-radio-group
//     :options="[
//     { value: 'economy', label: 'Эконом' },
//     { value: 'business', label: 'Бизнес' },
// ]"
//     v-model="serviceClass"
// />


const props = defineProps({
    options: {
        type: Array,
        required: true,
    },
})

const model = defineModel()

</script>

<style scoped lang="scss">
.radiobutton__input {
    display: none;
}
</style>
