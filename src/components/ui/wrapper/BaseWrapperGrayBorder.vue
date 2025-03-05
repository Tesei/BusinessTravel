<template>
    <div>
        <div class="ui-login__wrapper">
            <div
                class="bd radius-16 p-24 bg-white bd-gray-9"
                :class="className"
            >
                <div
                    class="ui-login__header"
                    :class="className + '_header'"
                >
                    <slot name="header"></slot>
                </div>

                <div class="ui-login__body">
                    <slot></slot>
                </div>
                <div
                    class="ui-login__body"
                    v-if="!$slots.default"
                >
                    <base-skeleton
                        :skeletonHeight="skeletonHeight"
                        class="mb-24"
                    />
                </div>

                <div class="ui-login__footer">
                    <slot name="footer"></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import BaseSkeleton from '@ui/BaseSkeleton.vue'
import { computed } from 'vue'
const props = defineProps({
    numOfRows: {
        default: 1,
    },
    className: {
        type: String,
        default: '',
    },
})
const skeletonHeight = computed(() => {
    return `${props.numOfRows * 56 + 24 * (props.numOfRows - 1)}px`
})

/**
Компонент-оболочка для создания окна с границами в центре экрана.
* наполнение через слоты
*/
</script>

<style scoped lang="scss">
.ui-login {
    // .ui-login__wrapper
    &__wrapper {
    }

    // .ui-login__content
    &__content {
        width: 100%;
        max-width: 570px;
        margin: 80px auto;
        padding: 24px;
        border-radius: $border-radius-16;
        border: 1px solid $color-gray-9;
    }

    // .ui-login__header
    &__header {
    }

    // .ui-login__body
    &__body {
    }

    // .ui-login__footer
    &__footer {
    }
}

// .ui-contragent
.ui-contragent {
    // .ui-contragent__content
    &__content {
        max-width: 100%;
        margin: 40px auto 0 auto;
        // .ui-contragent__content_header
        &_header {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
        }
    }
}
// .ui-content
.ui-content {
    // .ui-content__32
    &__32 {
        max-width: 100%;
        margin: 32px auto 0;
    }
    // .ui-content__40
    &__40 {
        max-width: 100%;
        margin: 40px auto 0;
    }
}

.m-0 {
    margin: 0;
}

.full-width {
    max-width: 100%;
}
</style>
