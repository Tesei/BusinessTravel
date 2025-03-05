<template>
    <div :class="classNames">
        <div class="header Heading_4">
            <div
                v-for="(name, index) in props.header"
                :key="index"
            >
                {{ name }}
            </div>
        </div>
        <div
            class="content body_M"
            v-for="(service, index) in props.services"
            :key="index"
        >
            <div
                v-for="(object, index) in service"
                :key="index"
            >
                {{ object }}
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    classNames: { type: String, required: false }, // для пользовательской стилизации компонента
    header: { type: Array, required: false, default: () => ['Услуга', 'Операция', 'Маршрут', 'Тип операции', 'Сумма сбора'] }, // header таблицы
    services: { type: Array, required: true }, // body таблицы
})
</script>

<style lang="scss" scoped>
.header {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
    width: 100%;

    padding: 16px 24px;
    background-color: $color-blue-2;
    color: $color-gray;
    border-radius: 8px 8px 0 0;
}

.content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
    width: 100%;

    padding: 8px 24px;
    background-color: $color-white;
    color: $color-black;
    border-width: 1px;
    border-color: $color-gray-3;
    border-style: none solid solid solid;

    &:last-child {
        border-radius: 0 0 8px 8px;
    }
}
</style>
