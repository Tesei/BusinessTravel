<template>
    <div
        class="card-settings avia-drop__settings-wrapper bg-white"
        :style="position"
        @click.stop
    >
        <slot></slot>
        <div class="avia-drop__ceckboxes scrollbar-presets_gray_small">
            <div
                class="avia-drop__ceckbox-item radiobutton__default-big pointer"
                v-for="(item, index) in list"
                :key="item"
                @click="changeActiveItem(item)"
            >
                <input
                    type="radio"
                    class="radiobutton__input"
                    :class="{ 'radiobutton__input-active': activeItem === item }"
                    :id="'radiobutton__default-big' + index"
                    name="radio"
                />
                <label
                    class="body_S pointer"
                    :for="'radiobutton__default-big' + index"
                    >{{ item }}</label
                >
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'

/**
 * @property {Array} list Массив значений.
 * @property {String} positionY Расположение по оси Y ('top', 'bottom').
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
})
// Управление состоянием isActive и activeItem родителя
const isActive = defineModel('isActive')
const activeItem = defineModel('activeItem')

const position = reactive({ position: 'absolute', zIndex: 1, left: 0 })

const changeActiveItem = (item) => {
    if (item !== activeItem.value) {
        activeItem.value = item
        isActive.value = false
    }
}

onMounted(() => {
    if (props.positionY === 'bottom') {
        position.top = 'calc(100% + 8px)'
    } else {
        position.bottom = 'calc(100% + 8px)'
    }
})
</script>

<style scoped lang="scss">
// .radiobutton__input
.radiobutton__input {
    display: none;
}

// .avia-drop__settings-wrapper
.avia-drop__settings-wrapper {
    padding: 8px 20px 16px;
    width: 100%;
    max-width: 100%;
    cursor: default;
}

// .avia-drop__ceckboxes
.avia-drop__ceckboxes {
    max-height: 96px;
    overflow-y: auto;
}

// .avia-drop__ceckbox-item
.avia-drop__ceckbox-item {
    margin-bottom: 12px;

    &:last-of-type {
        margin-bottom: 0;
    }
}
</style>
