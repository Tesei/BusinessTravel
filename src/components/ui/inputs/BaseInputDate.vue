<template>
    <div
        :class="errorClass"
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
                    :type="type"
                    v-model="internalValue"
                    @focus="handleFocus"
                    @blur="handleBlur"
                    :min="minDate"
                    :max="maxDate"
                    :disabled="disabled"
                />
                <label
                    class="body_S input__placeholder"
                    :class="{ active: isActive || isFilled, footnote_12: isActive || isFilled, required: isRequired }"
                >
                    {{ placeholder }}
                </label>
                <IconSprite
                    name="calendar"
                    class="input__svg input__svg-eye"
                />
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
import { computed, onMounted, ref, watch } from 'vue'
import IconSprite from '@/components/interface/IconSprite.vue'

const props = defineProps({
    placeholder: {
        type: String,
        required: true,
        default: '',
    },
    errorText: {
        type: String,
        default: '',
    },
    isRequired: {
        type: Boolean,
        default: false,
    },
    minDate: {
        type: String,
        default: '',
    },
    maxDate: {
        type: String,
        default: '',
    },
    disabled: {
        type: Boolean,
        default: false,
    },
})

const type = ref('text')
const emit = defineEmits(['focus', 'blur'])

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
    type.value = 'date'
    emit('focus')
}

const handleBlur = () => {
    isActive.value = false
    if (internalValue.value) {
        type.value = 'date'
    } else type.value = 'text'
    emit('blur')
}

const focusInput = () => inputRef.value?.focus()

onMounted(() => {
    if (internalValue.value) {
        isActive.value = true // Устанавливаем активность плейсхолдера
        type.value = 'date'
    }
})
watch(internalValue, (newValue) => {
    if (newValue) {
        handleFocus()
    }
})
</script>

<style scoped lang="scss">
.input__field {
    padding: 19px 0 0 14px;
    appearance: none;

    &:focus {
        border-color: $color-gray;
    }
    &::-webkit-calendar-picker-indicator {
        opacity: 0;
        display: block;
        position: absolute;
        right: 16px;
        top: 50%;
        transform: translateY(-50%);
        width: 24px;
        height: 24px;
        cursor: pointer;
        z-index: 1;
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

input[type='text'] ~ .input__svg-eye {
    position: relative;
    display: none;
}

input[type='date'] ~ .input__svg-eye {
    display: block;
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
}
</style>
