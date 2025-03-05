<template>
    <div :class="errorClass" @click="focusInput">
        <div class="input__wrapper">
            <input
                ref="inputField"
                class="body_S input__field"
                v-model="internalValue"
                :type="showPassword ? 'text' : 'password'"
                @focus="handleFocus"
                @blur="handleBlur"
                @keyup.enter="emit('submit')"
            />
            <label
                class="body_S input__placeholder"
                :class="{ active: isActive || isFilled, footnote_12: isActive || isFilled, required: isRequired }"
            >
                {{ placeholder }}
            </label>
            <IconSprite
                @click="togglePasswordVisibility"
                :name="showPassword ? 'common--eye-open' : 'common--eye-hide'"
                class="input__svg input__svg-eye"
            />
        </div>
        <span v-if="errorText" class="footnote_12 input__error-text">{{ errorText }}</span>
    </div>
</template>

<script setup>
import IconSprite from '@/components/interface/IconSprite.vue'
import { ref, computed, onMounted } from 'vue'

const props = defineProps({

    placeholder: {
        type: String,
        required: false,
        default: 'Пароль'
    },
    errorText: {
        type: String,
        default: '',
    },
    isRequired: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['focus', 'blur', 'submit'])
const internalValue = defineModel()

const showPassword = ref(false)
const isActive = ref(false)
const isFilled = computed(() => !!internalValue.value)
const inputField = ref(null)

const errorClass = computed(() => ({
    'input input-error': props.errorText,
    'input input-default': !props.errorText,
}))

const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value
}

const handleFocus = () => {
    isActive.value = true
    emit('focus')
}

const handleBlur = () => {
    isActive.value = false
    emit('blur')
}

// Устанавливаем активное состояние при загрузке, если поле заполнено
onMounted(() => {
    if (internalValue.value) {
        isActive.value = true
    }
})

const focusInput = () => {
    if (inputField.value) {
        inputField.value.focus()
    }
}
</script>

<style lang="scss" scoped>
.input__placeholder {
    position: absolute;
    pointer-events: none;
    transition: all 0.2s ease;
}

.input__placeholder.active {
    top: 19px;
}

.input__field {
    padding: 16px 0 0 14px;
    &:focus {
        border-color: $color-gray;
    }
}

.input__svg-eye {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
}

.required::after {
    content: '*';
    color: $color-red;
    top: -1px;
    left: 1px;
    position: relative;
}
</style>
