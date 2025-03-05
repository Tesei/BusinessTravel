<template>
    <div class="_container flex flex-d-c">
        <main-page/>
        <popup-error/>
        
    </div>
</template>

<script setup>
import MainPage from '@/views/MainPage.vue'
import PopupError from '@/components/popup/PopupError.vue'

</script>

<style scoped lang="scss">
._container{
    min-height: 100%;
    position: relative;
}
</style>
