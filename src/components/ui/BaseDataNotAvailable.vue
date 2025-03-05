<template>
    <section class="not-result">
        <icon-sprite
            className="not-result__svg"
            name="common--empty-search"
        ></icon-sprite>
        <div class="not-result__text-wrapper">
            <h4 class="Heading_4 not-result__title">{{ title }}</h4>
            <p class="footnote_L not-result__text">{{ description }}</p>
        </div>
        <button
            v-if="buttonText"
            @click="handleClick"
            class="not-result__button font-button_M"
        >
            {{ buttonText }}
        </button>
    </section>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import IconSprite from '@/components/interface/IconSprite.vue'
/**
 * @property {String} title Главный текст компонента
 * @property {String} description Текст компонента
 * @property {String} buttonText Текст кнопки. При отсутствии кнопка недоступна
 */
const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    buttonText: {
        type: String,
        default: '',
    },
})

const emit = defineEmits(['handleClick'])

const handleClick = () => {
    emit('handleClick')
}
</script>

<style scoped lang="scss">
// изменить UI KIT
.not-result {
    max-width: 100%;
    height: 100%;
    justify-content: center;
    padding-top: 0;

    &__title,
    &__text {
        text-align: center;
    }
}
</style>
