<template>
    <button
        v-if="!link"
        class="button font-button_M jc-c"
        :disabled="disabled"
        type="submit"
        :class="classNames"
    >
        <IconSprite
            v-if="toShowLoading"
            name="common--loader"
            className="button__icon button__icon_mr0 button__loader_animation"
        />
        <slot v-else>
            <IconSprite
                name="common--loader"
                className="button__icon button__icon_mr0 button__loader_animation"
            />
        </slot>
    </button>
    <a
        v-else
        :href="props.link"
        :target="linkTarget"
        :class="[classNames, { button_disabled: disabled }]"
    >
        <IconSprite
            v-if="toShowLoading"
            name="common--loader"
            className="button__icon button__icon_mr0 button__loader_animation"
        />
        <slot v-else>
            <IconSprite
                name="common--loader"
                className="button__icon button__icon_mr0 button__loader_animation"
            />
        </slot>
    </a>
</template>

<script setup>
import IconSprite from '@/components/interface/IconSprite.vue'

/**
 * Доработанная Кнопка
 *
 * @property {String|null} props.link URL ссылки, может быть строкой или null. Если не передавать - будет кнопкой
 * @property {String} props.linkTarget Атрибут target для ссылки (например, `_self`, `_blank`).
 * @property {Boolean} props.disabled Флаг, указывающий, отключен ли компонент. Добавляет в случае true класс button_disabled
 */

const props = defineProps({
    link: {
        type: [String, null],
        required: false,
        default: null,
    },
    linkTarget: {
        type: String,
        required: false,
        default: '_self',
    },
    disabled: {
        type: Boolean,
        required: false,
        default: false,
    },
    // Пропсами ниже не стоит пользоваться (необходимы для совместимости)
    classNames: { // Альтернатива - Пиши классы сразу на компоненте
        type: String,
        required: false,
        default: '',
    },
    toShowLoading: { // Альтернатива - скрывай данные для слота и вместо надписи появится прелоадер
        type: Boolean,
        required: false,
        default: false,
    },
})


</script>

<style scoped lang="scss">
.button_transparent_disabled:hover {
    color: $text-disabled;
    border-color: $text-disabled;
    cursor: default;
}

.button_red {
    border-color: $color-red;
    color: $color-red;
}

.button__icon {
    color: inherit;
}

</style>
