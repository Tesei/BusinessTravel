<template>
    <Teleport to="body">
        <div
            class="ui-pop-up__wrapper"
            @click.self="emit('close')"
        >
            <div
                class="bg-white radius-16 ui-pop-up__content"
                v-bind="$attrs"
            >
                <div class="ui-pop-up__header">
                    <p class="Heading_3">
                        <slot name="header"></slot>
                    </p>
                    <IconSprite
                        v-if="hasCloseIcon"
                        name="common--close"
                        className="c-black ui-pop-up__close-icon"
                        @click="emit('close')"
                    />
                </div>
                <div class="ui-pop-up__body">
                    <slot></slot>
                </div>
                <div class="ui-pop-up__footer">
                    <slot name="footer"></slot>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
/**
Компонент-оболочка для создания окна поп апа в центре экрана.
* нажатие вне границ поп апа приводит к вызову эмита close
* пропс на наличие закрывающей иконки
* наполнение через слоты
*/
import IconSprite from '@/components/interface/IconSprite.vue'

defineProps({
    hasCloseIcon: {
        type: Boolean,
        default: true,
    },
})
const emit = defineEmits(['close'])
</script>

<style scoped lang="scss">
.ui-pop-up {
    // .ui-pop-up__wrapper
    &__wrapper {
        background: rgba(65, 65, 65, 0.7);
        height: 100%;
        left: 0;
        position: fixed;
        top: 0;
        width: 100%;
        overflow-y: auto;
        z-index: 2200;
        transition: opacity 0.3s ease;
    }

    // .ui-pop-up__content
    &__content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-height: 90%;
        transition: all 0.3s ease;
    }

    // .ui-pop-up__header
    &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    // .ui-pop-up__close-icon
    &__close-icon {
        height: 32px;
        width: 32px;
        cursor: pointer;
        z-index: 2000;
        transition: all 0.2s ease 0s;
        @media (min-width: $md2+px) {
            &:hover {
                transform: scale(1.15);
            }
        }
    }

    // .ui-pop-up__body
    &__body {
    }

    // .ui-pop-up__footer
    &__footer {
    }
}
.fullwidth {
    width: 100%;
    max-width: 1170px;
}
</style>
