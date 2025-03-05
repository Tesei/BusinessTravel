<template>
    <div
        :class="[errorClass, { disabled }]"
        class="input-container"
    >
        <div
            class="input__wrapper"
            @click="focusInput"
        >
            <div class="input__wrapper">
                <input
                    ref="inputRef"
                    class="body_S input__field"
                    :class="disabled ? 'c-text-disabled bg-white input__field_disabled' : ''"
                    :disabled="disabled"
                    type="text"
                    v-model="internalValue"
                    @focus="handleFocus"
                    @blur="handleBlur($event)"
                    @keydown="handleKeyDown($event)"
                    @keyup.enter="emit('submit')"
                    :maxlength="maxlen"
                />
                <label
                    class="body_S input__placeholder"
                    :class="{ active: isActive || isFilled, footnote_12: isActive || isFilled, required: isRequired }"
                >
                    {{ placeholder }}
                </label>
                <slot name="icon"></slot>
            </div>
            <span
                v-if="errorText"
                class="footnote_12 input__error-text"
            >
                {{ errorText }}
            </span>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, defineModel } from 'vue'

const props = defineProps({
    placeholder: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        default: '',
    },
    type: {
        type: String,
        default: 'text',
    },
    errorText: {
        type: String,
        default: '',
    },
    isRequired: {
        type: Boolean,
        default: false,
    },
    maxlen: {
        type: String,
        default: null,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['focus', 'blur', 'keydown', 'submit'])

// Локальное состояние
const internalValue = defineModel()

const isActive = ref(false)
const inputRef = ref(null)

const isFilled = computed(() => !!internalValue.value)
const errorClass = computed(() => ({
    'input input-error': props.errorText,
    'input input-default': !props.errorText,
}))

const handleFocus = () => {
    isActive.value = true
    emit('focus')
}

const handleBlur = (event) => {
    isActive.value = false
    emit('blur', event)
}

const focusInput = () => inputRef.value?.focus()

const handleKeyDown = (event) => {
    emit('keydown', event)
}

onMounted(() => {
    if (internalValue.value) {
        isActive.value = true // Устанавливаем активность плейсхолдера
    }
})
</script>

<style scoped lang="scss">
/* Основной стиль для поля */
.input__field {
    padding: 19px 0 0 14px;

    &:focus {
        border-color: $color-gray;
    }
}
.input__field_disabled {
    border-color: $color-gray-4 !important;
    cursor: default;
}
.input__wrapper {
    position: relative;
}

.input__error-text {
    top: 8px;
    position: relative;
}

.input__placeholder {
    position: absolute;
    pointer-events: none;
    transition: all 0.2s ease;
}

.input__placeholder.active {
    top: 19px;
}

.required::after {
    content: '*';
    color: $color-red;
    top: -1px;
    left: 0px;
    position: relative;
}

input:focus + label,
.active {
    top: 17px;
    left: 16px;
    transition: all 0.2s ease;
}
.restore-password__input {
    .input__field {
        max-width: 100%;
    }
    input:focus + label,
    .active {
        top: 15px;
    }
}
</style>
