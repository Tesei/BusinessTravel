<template>
    <div
        class="flex"
        :class="classNames"
    >
        <div
            style="width: 152px"
            class="mr-8"
        >
            <base-select
                type="big"
                :with-dropdown="false"
                :disabled="props.disabled"
                :value="countryCode.activeItem"
                v-model="countryCode.isActive"
            >
                <template v-slot:countryFlag>
                    <IconSprite
                        :name="countryFlag"
                        style="width: 34px; height: 24px; margin-right: 8px"
                    />
                </template>
                <base-droplist
                    v-if="countryCode.isActive"
                    position-x="center"
                    position-y="bottom"
                    :list="countryCodeList.map((item) => item.code)"
                    v-model:isActive="countryCode.isActive"
                    v-model:activeItem="countryCode.activeItem"
                    type="basic"
                ></base-droplist>
            </base-select>
        </div>
        <div style="width: 100%">
            <base-input
                placeholder="Телефон"
                :isRequired="true"
                v-maska:unmaskedValue.unmasked="options"
                v-model="maskedValue"
                :errorText="props.error"
                @blur="handleBlur()"
                :disabled="isInputDisabled"
            />
        </div>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import BaseInput from '@ui/inputs/BaseInput.vue'
import BaseSelect from '@ui/select/BaseSelect.vue'
import BaseDroplist from '@ui/select/BaseDroplist.vue'
import IconSprite from '@/components/interface/IconSprite.vue'
import { vMaska } from 'maska/vue'
import { reactive } from 'vue'

const props = defineProps({
    disabled: { type: Boolean, default: false }, // отключает выбор кода страны
    classNames: { type: String, required: false }, // для пользовательской стилизации компонента
    error: { type: String, required: false, default: '' }, // ошибка валидации
    isInputDisabled: { type: Boolean, default: false }, // отключает возможность пользовательского ввода
})
const emit = defineEmits(['blur'])

const countryCode = reactive({ isActive: false, activeItem: '+7' })
const countryCodeList = reactive([
    { code: '+7', name: 'RU' },
    { code: '+375', name: 'BEL' },
])
const countryFlag = computed(() => {
    return countryCodeList.find((item) => item.code === countryCode.activeItem).name
})

const model = defineModel()
const maskedValue = ref(model.value?.slice(countryCode.activeItem.length))
const unmaskedValue = ref('')

const options = reactive({
    mask: '(###) ###-##-##',
})

defineExpose({ unmaskedValue })

function update() {
    model.value = countryCode.activeItem + unmaskedValue.value
}

const handleBlur = () => {
    emit('blur')
}
watch([unmaskedValue, countryCode], update)
</script>

<style lang="scss" scoped></style>
