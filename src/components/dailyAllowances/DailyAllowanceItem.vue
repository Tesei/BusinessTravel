<template>
    <div class="bg-gray-6 radius-8 daily-allowance">
        <div class="daily-allowance__content">
            <div class="service">
                <BaseCheckbox v-model="isChecked" />
            </div>
            <div>
                <span class="Heading_5 ellipsis">{{ dailyAllowance.directionName }}</span>
            </div>
            <div>
                <base-tooltip
                    class="daily-allowance__tooltip"
                    :type="'basic'"
                    :text="[departmentNames]"
                    :font="'footnote_M'"
                    :range="1"
                >
                    <span class="body_S ellipsis">
                        {{ departmentNames }}
                    </span>
                </base-tooltip>
            </div>
            <div>
                <base-tooltip
                    class="daily-allowance__tooltip"
                    :type="'basic'"
                    :text="[fullNames]"
                    :font="'footnote_M'"
                    :range="1"
                >
                    <span class="body_S ellipsis">
                        {{ shortNames }}
                    </span>
                </base-tooltip>
            </div>
            <div>
                <span class="body_S ellipsis"> {{ dailyAllowance.amount.toLocaleString() }} ₽/день</span>
            </div>
            <div
                :class="['pointer', { disabled: disabledEdit }]"
                @click="emit('handleEdit', dailyAllowance.id)"
            >
                <IconSprite
                    name="edit"
                    class="icon__svg"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import BaseCheckbox from '@/components/ui/BaseCheckbox.vue'
import IconSprite from '@/components/interface/IconSprite.vue'
import { getShortName } from '@/helpers/helpers'
import BaseTooltip from '@ui/BaseTooltip.vue'

const props = defineProps({
    dailyAllowance: { type: Object, required: true },
    disabledEdit: { type: Boolean, required: true },
})

const emit = defineEmits(['handleEdit'])

const departmentNames = computed(() => props.dailyAllowance.departmentNames.join(', '))

const shortNames = computed(() => {
    // Проверяем, что employees существует и является массивом
    if (!Array.isArray(props.dailyAllowance.employees)) {
        console.error('Employees is not an array')
        return ''
    }

    // Форматируем имена всех сотрудников и объединяем их
    return props.dailyAllowance.employees
        .map(getShortName) // Форматируем каждого сотрудника
        .filter(Boolean) // Убираем пустые строки
        .join(', ') // Объединяем через запятую
})

const fullNames = computed(() =>
    props.dailyAllowance.employees
        .map((employee) => (employee.lastName || '') + ' ' + (employee.firstName || '') + ' ' + (employee.middleName || ''))
        .join(', '),
)

const isChecked = defineModel('isChecked', { required: true })
</script>

<style lang="scss" scoped>
.daily-allowance {
    width: 100%;
    padding: 20px;

    //.daily-allowance:not(:last-child)
    &:not(:last-child) {
        margin-bottom: 24px;
    }
    // .daily-allowance__content
    &__content {
        display: grid;
        align-items: center;
        grid-template-columns: 24px 240px 240px 240px 1fr 24px;
        width: 100%;
        gap: 16px;
    }

    .disabled {
        pointer-events: none;
    }
    .icon__svg {
        margin-right: 0;
    }
    
    .daily-allowance__tooltip{
        display: inline-block;
        max-width: 100%;
    }
}
</style>
