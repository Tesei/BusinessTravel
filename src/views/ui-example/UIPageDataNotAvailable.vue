<template>
    <header><h1>Data Not Available</h1></header>
    <div
        class="flex ai-fs jc-fs"
        style="width: 100%; height: 100vh"
    >
        <div
            class="flex flex-d-c ai-fs"
            style="gap: 8px; width: 100%; height: 100%"
        >
            <div
                class="ml-24 mr-24"
                style="width: 100%; height: 50%; margin-top: 50px"
            >
                <base-data-not-available
                    title="Нет доступных перелетов"
                    description="Попробуйте изменить параметры фильтров"
                    button-text="Сбросить фильтры"
                ></base-data-not-available>
            </div>
            <div
                class="ml-24 mr-24"
                style="width: 100%; height: 50%; margin-top: 50px"
            >
                <base-data-not-available
                    title="Нет созданных сотрудников"
                    description="Создайте сотрудника и задайте его параметры."
                ></base-data-not-available>
            </div>
        </div>
    </div>
</template>
<script setup>
import BaseDataNotAvailable from '@ui/BaseDataNotAvailable.vue'
</script>
<style></style>
