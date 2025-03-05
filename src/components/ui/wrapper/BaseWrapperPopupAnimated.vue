<template>
    <Teleport to="body">
        <Transition name="modal">
            <div
                v-if="show"
                class="modal-mask"
                @click.self="$emit('close')"
            >
                <div class="modal-container">
                    <div class="modal-header">
                        <div class="Heading_3">
                            <slot name="header"></slot>
                        </div>
                        <IconSprite
                            v-if="hasCloseIcon"
                            name="common--close"
                            className="c-black modal-header__close-icon"
                            @click="$emit('close')"
                        />
                    </div>
                    <div class="modal-body">
                        <slot name="body"></slot>
                    </div>
                    <div
                        v-if="$slots.footer"
                        class="modal-footer"
                    >
                        <slot name="footer"></slot>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
// Модальное окно предназначено для отправки форм (есть 3 слота: header, body, footer). Можно использовать и под другие цели.
// Попап позиционирется относительно body
// В попап нужно передавать пропс show для работы анимации

import IconSprite from '@/components/interface/IconSprite.vue'

const props = defineProps({
    show: { type: Boolean, required: true },
    hasCloseIcon: { type: Boolean, default: true },
})

const emit = defineEmits(['close'])
</script>

<style lang="scss" scoped>
@use '@/style/animation.scss';

.modal-mask {
    position: fixed;
    z-index: 2100;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(65, 65, 65, 0.7);
    display: flex;
    transition: opacity 0.3s ease;
}

.modal-container {
    width: auto;
    min-width: 570px;
    margin: auto;
    padding: 24px;
    background-color: $color-white;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;

    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    // modal-header__close-icon
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
}

.modal-body {
}

.modal-footer {
}
</style>
