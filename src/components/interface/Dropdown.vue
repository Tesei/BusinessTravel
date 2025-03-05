<template>
    <div
        class="cities-geolocation card-settings"
        :class="theme"
    >
        <div class="cities-geolocation__content">
            <ul class="cities-geolocation__scroll-area scrollbar-presets_gray_small body_S">
                <li
                    @click="handleClick(option.route)"
                    class="cities-geolocation__city-item flex-jcsb-aifs flex-jcsb-aifs"
                    v-for="(option, index) in options"
                    :key="index"
                >
                    <span  class="body_S cities-geolocation__city">{{ option.label || option }}</span>
                    <svg class="icon__svg cities-geolocation__icon">
                        <use xlink:href="#common--checkmark"></use>
                    </svg>
                </li>
            </ul>
        </div>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const handleClick = (route) => {
    if (!route) return
    router.push(route)
}
const props = defineProps({
    options: {
        type: Object,
        default: () => {},
    }, // элементы выпадающего списка
    theme: {
        type: String,
        default: 'base',
    }, // класс
})
</script>
<style lang="scss" scoped>
// .header-dropdown
.header-dropdown {
    width: 196px;
    position: absolute;
    top: 34px;
    left: -98px;
    z-index: 1;
    background-color: $color-white;

    // .cities-geolocation
    .cities-geolocation {
        // .cities-geolocation__scroll-area
        &__scroll-area {
            margin: 4px;
        }

        // .cities-geolocation__city-item
        &__city-item {
            margin: 0;
            min-height: 54px;
            height: auto;
            text-align: justify;
        }
    }
}
</style>
