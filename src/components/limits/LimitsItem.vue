<template>
    <div class="bg-gray-6 radius-8 limit hover-bg-gray-5 pointer">
        <div class="limit__content">
            <div>
                <span class="Heading_5 ellipsis">{{ directionNames }}</span>
            </div>
            <div>
                <base-tooltip
                    class="limit__tooltip pointer"
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
                    class="limit__tooltip pointer"
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
                <span class="body_S ellipsis"> До {{ limit.amount.toLocaleString() }} ₽</span>
            </div>
            <div
                :class="['pointer', { disabled: disabledEdit }]"
                @click="emit('handleEdit', limit.id)"
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
import IconSprite from '@/components/interface/IconSprite.vue'
import { getShortName } from '@/helpers/helpers'
import BaseTooltip from '@ui/BaseTooltip.vue'

const props = defineProps({
    limit: { type: Object, required: true },
    disabledEdit: { type: Boolean, required: false, default: false },
})

const emit = defineEmits(['handleEdit'])

const directionNames = computed(() => {
    if (props.limit.start.name === props.limit.finish.name) {
        return props.limit.start.name
    } else {
        return props.limit.start.name + ' — ' + props.limit.finish.name
    }
})

const departmentNames = computed(() => props.limit.departments.map((el) => el.name).join(', '))

const shortNames = computed(() => {
    if (!Array.isArray(props.limit.employees)) {
        console.error('Employees is not an array')
        return ''
    }
    return props.limit.employees.map(getShortName).filter(Boolean).join(', ')
})

const fullNames = computed(() =>
    props.limit.employees
        .map((employee) => (employee.lastName || '') + ' ' + (employee.firstName || '') + ' ' + (employee.middleName || ''))
        .join(', '),
)
</script>

<style lang="scss" scoped>
.limit {
    width: 100%;
    padding: 20px;

    //.limit:not(:last-child)
    &:not(:last-child) {
        margin-bottom: 24px;
    }
    // .limit__content
    &__content {
        display: grid;
        align-items: center;
        grid-template-columns: 240px 240px 240px 1fr 24px;
        width: 100%;
        gap: 16px;
    }

    .disabled {
        pointer-events: none;
    }
    .icon__svg {
        margin-right: 0;
    }

    .limit__tooltip {
        display: inline-block;
        max-width: 100%;
    }
}
</style>
