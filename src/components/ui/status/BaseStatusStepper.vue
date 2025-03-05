<template>
    <div class="status-stepper">
            <div
                class="mb-20 status-stepper__row flex ai-c jc-fs"
                v-for="(step, index) in steps"
                :key="step.id"
            >
                <template v-if="index < lastStepWithStatus">
                    <div
                        v-if="index !== 0"
                        class="bg-gray-3 status-stepper__track-line status-stepper__track-line_top"
                    ></div>
                    <div
                        v-if="index !== steps.length - 1"
                        class="bg-gray-3 status-stepper__track-line status-stepper__track-line_bot"
                    ></div>
                </template>
                
                <div v-if="!!step.status" class="status-stepper__status">
                    <div
                        v-if="step.status === 'Rejected'"
                        class="bg-red-2 radius-50p status-stepper__icon-wrapper flex ai-c jc-c"
                    >
                        <IconSprite
                            name="common--off"
                            className="status-stepper__icon c-red"
                        />
                    </div>
                    <div
                        v-else-if="step.status === 'Approved'"
                        class="bg-turquoise-2 radius-50p status-stepper__icon-wrapper flex ai-c jc-c"
                    >
                        <IconSprite
                            name="common--check"
                            className="status-stepper__icon c-green"
                        />
                    </div>
                    <div
                        v-else
                        class="bg-gray-5 radius-50p status-stepper__icon-wrapper flex ai-c jc-c"
                    >
                        <IconSprite
                            name="common--time"
                            className="status-stepper__icon c-gray-2"
                        />
                    </div>
                </div>
                <div v-else class="status-stepper__status status-stepper__status_empty"></div>

                <div class="status-stepper__about">
                    <p class="body_S status-stepper__title">{{ step.title }}</p>
                    <p class="footnote_L c-gray status-stepper__description">{{ step.description }}</p>
                </div>
            </div>

    </div>
</template>

<!-- 
-- Статус-степпер --
- Указыавет дерево статусов, с названием и дополнительным описанием каждого статуса
- status (Pending-ожидает согласования, Approved-согласовано, Rejected-отклонено)
- status: '' // не имеет индикатора статуса, только текст
- ui/status-stepper  - example пример
-->

<script setup>
import IconSprite from '@/components/interface/IconSprite.vue'
import { computed } from 'vue'
const props = defineProps({
    // [
    //     {
    //         status: 'Approved', // 'Pending', 'Rejected', 'Approved' or ''
    //         title: 'Лермонтов М.Ю',
    //         description: new Date(),
    //         id: 1, // id cотрудника
    //         isExtra: false, // дополнительный статус
    //     }
    // ]
    steps: {
        type: Array,
        defined: true,
    },    
})

const lastStepWithStatus = computed(() => {
    return props.steps.findLastIndex(step => !!step.status)
})
</script>

<style lang="scss" scoped>
.status-stepper {
    overflow: hidden;

    // .status-stepper__row
    &__row {
        margin-bottom: 20px;
        position: relative;

        &:last-child {
            margin-bottom: 0;
        }
    }

    // .status-stepper__status
    &__status {
        margin-right: 19px;

        // .status-stepper__status_empty
        &_empty {
            min-width: 32px;
            height: 32px;            
        }
    }

    // .status-stepper__icon-wrapper
    &__icon-wrapper {
        position: relative;
        width: 32px;
        height: 32px;
        z-index: 5;
    }
    // .status-stepper__icon
    &__icon {
        width: 20px;
        height: 20px;
    }

    // .status-stepper__track-line
    &__track-line {
        position: absolute;
        left: 16px;
        width: 1px;
        &_bot {
            height: calc(50% + 20px);
            top: calc(50% + 16px);
        }
        &_top {
            top: 16px;
            height: 50%;
        }
    }

    // .status-stepper__about
    &__about {
    }

    // .status-stepper__title
    &__title {
        display: block;
        margin-bottom: 2px;
    }

    // .status-stepper__description
    &__description {
    }
}
</style>
