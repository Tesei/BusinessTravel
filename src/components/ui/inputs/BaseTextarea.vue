<template>
    <div
        class="base-textarea"
        :class="{
                'base-textarea-active': isFocused,
                'base-textarea-disabled': disabled,
            }"
    >
        <textarea
            class="base-textarea__input body_S custom-scroll"
            v-model="value"
            :disabled="disabled"
            @focus="handleFocus"
            @blur="handleFocus"
            :maxlength="maxlen"
        ></textarea>
        <div
            class="base-textarea__label tr-all-3"
            :class="{ active: value, body_S: !value, footnote_M: value }"
        >
            {{ placeholder }}
        </div>
        <div
            v-if="error"
            class="base-textarea__error footnote_12"
        >
            {{ error }}
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
/**
 * @property {String} placeholder Текст placeholder.
 * @property {Boolean} disabled Заблокирован ли ввод.
 * @property {String} error Текст error.
 */
const props = defineProps({
    placeholder: {
        type: String,
        required: true,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    error: {
        type: String,
    },
    maxlen: {
        type: String,
        default: null,
    },
})

const value = defineModel({ type: String })

const isFocused = ref(false)

const handleFocus = () => {
    isFocused.value = !isFocused.value
}
</script>

<style scoped lang="scss">
.base-textarea {
    width: 100%;
    height: 100%;
    position: relative;
    border: 1px solid;
    border-color: $color-gray-9;
    border-radius: $border-radius-8;

    // base-textarea__input
    &__input {
        width: 100%;
        height: 100%;
        resize: none;
        padding: 16px;
        border-radius: $border-radius-8;
        color: $color-black;

        &:focus-visible {
            outline: none;
        }
        &:disabled {
            background-color: $color-white;
        }
    }

    // base-textarea__label
    &__label {
        position: absolute;
        top: 16px;
        left: 16px;
        color: $color-gray;
        width: calc(100% - 32px);
        overflow: hidden;
        white-space: nowrap;
    }

    &__label.active {
        top: 0;
        left: 0;
        padding: 8px 0 0 16px;
        width: 100%;
        background-color: $color-white;
        border-radius: $border-radius-8;
    }

    &:has(.base-textarea__label.active) {
        .base-textarea__input {
            padding-top: 28px;
        }
    }

    // base-textarea__error
    &__error {
        position: absolute;
        top: calc(100% + 12px);
        left: 0;
        color: $color-red;
        max-width: 100%;

        @media (max-width: 768px) {
            top: calc(100% + 8px);
        }
    }

    &:hover {
        border: 1px solid $color-gray-2;
    }
}

.base-textarea-active {
    border: 1px solid $color-gray;
    &:hover {
        border: 1px solid $color-gray;
    }
}

.base-textarea-disabled {
    border: 1px solid $color-gray-4;
    .base-textarea__label {
        color: $text-disabled;
    }
    &:hover {
        border: 1px solid $color-gray-4;
    }
}

.custom-scroll {
    &::-webkit-scrollbar {
        width: 3px;
    }

    &::-webkit-scrollbar-track {
        background-color: transparent;
        -webkit-border-radius: $border-radius-4;
        -moz-border-radius: $border-radius-4;
        border-radius: $border-radius-4;
        margin: 8px 0;
    }

    &::-webkit-scrollbar-thumb {
        background-color: $color-gray-4;
        -webkit-border-radius: $border-radius-4;
        -moz-border-radius: $border-radius-4;
        border-radius: $border-radius-4;
        transition: 0.3s;

        &:active,
        &:hover {
            transition: 0.3s;
            cursor: pointer;
        }
    }
}
</style>
