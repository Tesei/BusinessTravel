<template>
    <div class="flex flex-d-c ai-fs">
        <BaseSwitcherLabel @handleChange="(e) => {
        handleChange(e)
    }" />
        <BaseSwitcherLabel textDescription="test" textHeader="123" :default-detected="true" />
    </div>
</template>
<script setup>
import BaseSwitcherLabel from '@ui/switcher/BaseSwitcherLabel.vue'

const handleChange = (e) => {
    alert(e)
}
</script>
<style></style>
