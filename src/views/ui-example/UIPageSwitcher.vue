<template>
    <div class="flex flex-d-c ai-fs">
        <BaseSwitcher @handleChange="(e) => {
        handleChange(e)
    }" />
        <BaseSwitcher textDescription="test" textHeader="123" :default-detected="true" />
    </div>
</template>
<script setup>
import BaseSwitcher from '@ui/switcher/BaseSwitcher.vue'

const handleChange = (e) => {
    alert(e)
}
</script>
<style></style>
