<template>
    <div
        class="avia-drop__wrapper-list card-settings"
        :style="position"
        @click.stop
    >
        <ul class="avia-drop__list scrollbar-presets_gray_small">
            <template v-if="preloader">
                <base-skeleton
                    v-for="count in lineCount"
                    :key="count"
                    skeleton-height="28px"
                    class="mb-16 mt-16"
                ></base-skeleton
            ></template>
            <template v-if="!preloader">
                <template v-if="list.length">
                    <li
                        class="avia-drop__item flex-jcsb-aifs"
                        :class="{ active: activeItem.code === item.code }"
                        v-for="item in list"
                        :key="item.code"
                        @click="changeActiveItem(item)"
                    >
                        <div class="item-for-drop-search__coordinats">
                            <p class="item-for-drop-search__city body_S">{{ item.name }}</p>
                            <p class="item-for-drop-search__country footnote_L">{{ item.countryName }}</p>
                        </div>
                        <p class="item-for-drop-search__short-airport-name footnote_L">{{ item.code }}</p>
                    </li>
                </template>
                <template v-else>
                    <base-data-not-available
                        title="Нет найденных направлений"
                        description="Введите как минимум 3 символа для поиска."
                    ></base-data-not-available>
                </template>
            </template>
        </ul>
    </div>
</template>

<script setup>
import { computed, defineModel, defineProps, onMounted, reactive } from 'vue'
import BaseSkeleton from '@ui/BaseSkeleton.vue'
import BaseDataNotAvailable from '@ui/BaseDataNotAvailable.vue'
/**
 * @property {Array} list Массив значений.
 * @property {String} positionY Расположение по оси Y ('top', 'bottom').
 * @property {Number} lineCount Количество строк.
 */
const props = defineProps({
    list: {
        type: Array,
        required: true,
    },
    positionY: {
        type: String,
        required: true,
        validator(value) {
            return ['top', 'bottom'].includes(value)
        },
    },
    lineCount: {
        type: Number,
        required: true,
    },
    preloader: {
        type: Boolean,
        required: true,
    },
})
// Управление состоянием isActive и activeItem родителя
const isActive = defineModel('isActive')
const activeItem = defineModel('activeItem')

const position = reactive({ zIndex: 1 })

const maxHeight = computed(() => {
    return props.lineCount * 60 + 'px'
})

const changeActiveItem = (item) => {
    if (JSON.stringify(item) === JSON.stringify(activeItem.value)) {
        activeItem.value = ''
    } else {
        activeItem.value = item
        isActive.value = false
    }
}
onMounted(() => {
    position.position = 'absolute'
    position.left = '0'
    if (props.positionY === 'bottom') {
        position.top = 'calc(100% + 8px)'
    } else {
        position.bottom = 'calc(100% + 8px)'
    }
})
</script>

<style scoped lang="scss">
.avia-drop__wrapper-list {
    min-width: 100%;
}

.avia-drop__list {
    max-height: v-bind(maxHeight);
}

.avia-drop__item:hover {
    background-color: $color-gray-6;
}
.avia-drop__item.active {
    background-color: $color-blue-2;
}
</style>
