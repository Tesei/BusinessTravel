<template>
    <div
        :class="mainClasses"
        :style="position"
        @click.stop
    >
        <input
            v-if="type === 'search'"
            class="base-droplist__input body_S radius-8"
            :placeholder="placeholder"
            v-model="inputValue"
        />
        <div class="base-droplist__items custom-scroll">
            <div
                class="item body_S"
                v-for="(item, index) in filteredList"
                @click="changeActiveItem(item)"
                :key="index"
            >
                {{ item }}
                <IconSprite
                    v-if="item === activeItem"
                    name="common--checkmark"
                    className="icon"
                />
            </div>
            <div
                v-if="!filteredList.length"
                class="not-found body_S"
            >
                Ничего не найдено...
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, defineModel, defineProps, onMounted, reactive, ref } from 'vue'
import IconSprite from '@/components/interface/IconSprite.vue'
/**
 * @property {String} type Тип droplist ('basic', 'search').
 * @property {Array} list Массив значений.
 * @property {String} positionY Расположение по оси Y ('top', 'bottom').
 * @property {String} positionX Расположение по оси X ('left', 'right', 'center').
 * @property {String} placeholder Placeholder для инпута.
 */
const props = defineProps({
    type: {
        type: String,
        required: true,
        validator(value) {
            return ['basic', 'search'].includes(value)
        },
    },
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
    positionX: {
        type: String,
        required: true,
        validator(value) {
            return ['left', 'right', 'center'].includes(value)
        },
    },
    placeholder: {
        type: String,
    },
})
// Управление состоянием isActive и activeItem родителя
const isActive = defineModel('isActive')
const activeItem = defineModel('activeItem')

const inputValue = ref('')
const position = reactive({})

const mainClasses = computed(() => {
    let classes = 'base-droplist shadow-5dp '
    if (props.type === 'basic') classes = classes + 'base-droplist-basic radius-8'
    if (props.type === 'search') classes = classes + 'base-droplist-search radius-16'
    return classes
})
const filteredList = computed(() => props.list.filter((el) => el.toLowerCase().includes(inputValue.value.toLowerCase())))
const changeActiveItem = (item) => {
    if (JSON.stringify(item) === JSON.stringify(activeItem.value)) {
        activeItem.value = ''
    } else {
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
    if (props.positionX === 'right') {
        position.right = 0
    } else if (props.positionX === 'left') {
        position.left = 0
    } else if (props.positionX === 'center') {
        position.left = '50%'
        position.transform = 'translateX(-50%)'
    }
})
</script>

<style scoped lang="scss">
// TODO Убрать стили после исправления UI KIT
.base-droplist {
    background-color: $color-white;
    position: absolute;
    z-index: 20;
    cursor: default;
    display: flex;
    flex-direction: column;
    &__input {
        width: 100%;
        height: 56px;
        margin-bottom: 16px;
        border: 1px solid $color-gray-9;
        padding: 16px;
    }
    &__items {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        .item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px;
            max-width: 100%;
            background-color: $color-white;
            min-height: 54px;
            cursor: pointer;
            white-space: nowrap;
            overflow: hidden;
            .icon {
                width: 24px;
                height: 24px;
            }
            &:hover {
                background-color: $color-gray-6;
            }
        }
    }
}
.base-droplist-basic {
    padding: 8px 0;
    height: fit-content;
    width: 328px;
    .base-droplist__items {
        height: fit-content;
        max-height: 216px;
    }
}
.base-droplist-search {
    padding: 24px;
    max-height: 444px;
    min-width: 318px;
    .base-droplist__items {
        height: fit-content;
        max-height: calc(100% - 72px);

        .not-found {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 372px;
            color: $color-gray;
        }
    }
}
.custom-scroll {
    &::-webkit-scrollbar {
        width: 3px;
    }

    &::-webkit-scrollbar-track {
        background-color: transparent;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: $color-gray-4;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        transition: 0.3s;

        &:active,
        &:hover {
            transition: 0.3s;
            cursor: pointer;
        }
    }
}
</style>
