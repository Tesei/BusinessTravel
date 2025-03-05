<template>
    <button
        class="button icon-animation"
        :disabled="disabled"
        type="submit"
    >
        <IconSprite
            :name="iconName"
            class="button__icon"
        />
        <slot></slot>
    </button>
</template>

<script setup>
import IconSprite from '@/components/interface/IconSprite.vue'

/**
 * Доработанная Кнопка с иконкой
 *
 * @property {Boolean} props.disabled Флаг, указывающий, отключен ли компонент. Добавляет в случае true класс button_disabled
 * @property {String} props.iconName Название иконки в спрайте
 * 
 */

defineProps({
    disabled: {
        type: Boolean,
        required: false,
        default: false,
    },
    iconName: {
        type: String,
        required: true,
        default: 'common--plus',
    },
})

</script>

<style scoped lang="scss">
@use '@/style/animation.scss';

.button__icon {
    color: inherit;
}

</style>
