<template>
    <div class="bg-gray-6 radius-8 skeleton-block"></div>
</template>

<script setup>
import { defineProps } from 'vue'

/**
 * Компонент представляет собой скелетон загрузки.
 *
 * @property {String} skeletonHeight Высота компонента.
 */

const props = defineProps({
    skeletonHeight: {
        type: String,
        default: '56px',
    },
})
</script>

<style scoped lang="scss">
.skeleton-block {
    width: 100%;
    height: v-bind(skeletonHeight);
    background-image: $loading-gradient;
    background-size: 1000px 104px;
    animation: load 1.5s infinite;
}

@keyframes load {
    0% {
        background-position: -468px 0;
    }
    100% {
        background-position: 468px 0;
    }
}
</style>
