<template>
    <div class="pt-32 pb-32">
        <div class="header flex ai-c jc-sb">
            <h2 class="Heading_2"><slot name="title"></slot></h2>
            <div
                class="c-cornflower font-button_S pointer button-back"
                :class="{ 'max-width-1': shortText }"
            >
                <slot name="button"></slot>
            </div>
        </div>
        <div class="content">
            <slot name="content"></slot>
        </div>
        <slot name="footer">
            <BaseButton
                v-if="isShowButton"
                @click="$emit('submit')"
                classNames="font-button_S button"
                :class="isDisabledButton ? 'gray-4' : 'button_blue'"
                :disabled="isDisabledButton"
                >Сохранить</BaseButton
            >
        </slot>
    </div>
</template>
<script setup>
import BaseButton from '@ui/buttons/BaseButton.vue'

const emit = defineEmits(['submit'])
const props = defineProps({
    isDisabledButton: {
        type: Boolean,
        default: false,
    },
    isShowButton: {
        type: Boolean,
        default: true,
    },
    shortText: {
        type: Boolean,
        default: false,
    },
})
/* Пример использования обертки приведен в компоненте UIBaseWrapperComponent.vue */
</script>
<style lang="scss" scoped>
// .button
.button {
    width: 100%;
    justify-content: center;
    margin-top: 40px;
}
.button-back {
    max-width: 286px;
    width: 100%;
}
.max-width-1 {
    max-width: 194px;
}
</style>
